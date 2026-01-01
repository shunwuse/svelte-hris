<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import * as Select from '$lib/components/ui/select';
  import * as Card from '$lib/components/ui/card';
  import { flash } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Search from '@lucide/svelte/icons/search';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import Edit2 from '@lucide/svelte/icons/edit-2';

  let { data } = $props();

  function formatDate(timestamp: string): string {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
  });

  function handlePerPageChange(value: string | undefined) {
    if (!value) return;
    const url = new URL(page.url);
    url.searchParams.set('per_page', value);
    url.searchParams.set('page', '1');
    goto(url.toString());
  }

  const perPageOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' }
  ];
</script>

<div class="space-y-6 p-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
      <p class="text-muted-foreground">Manage system users and their permissions.</p>
    </div>
    <div class="flex items-center gap-2">
      <Button href="/users/create" class="gap-2">
        <UserPlus class="size-4" />
        Add User
      </Button>
    </div>
  </div>

  <!-- Filters & Actions -->
  <Card.Root>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="relative max-w-sm flex-1">
          <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." class="pl-9" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Show</span>
          <Select.Root
            type="single"
            value={data.usersResponse.meta.per_page.toString()}
            onValueChange={handlePerPageChange}
          >
            <Select.Trigger class="w-[130px]">
              {perPageOptions.find(
                (o) => o.value === data.usersResponse.meta.per_page.toString()
              )?.label}
            </Select.Trigger>
            <Select.Content>
              {#each perPageOptions as option}
                <Select.Item value={option.value}>{option.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </Card.Content>

    <!-- Users Table -->
    <div class="border-t">
      <Table.Root>
        <Table.Header>
          <Table.Row class="bg-muted/50">
            <Table.Head class="w-16 text-center">ID</Table.Head>
            <Table.Head>User Information</Table.Head>
            <Table.Head>Created</Table.Head>
            <Table.Head>Updated</Table.Head>
            <Table.Head class="w-24 text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.usersResponse.data as user}
            <Table.Row class="group transition-colors hover:bg-muted/30">
              <Table.Cell class="text-center font-mono text-xs text-muted-foreground">
                {user.id}
              </Table.Cell>
              <Table.Cell>
                <div class="flex flex-col">
                  <span class="font-semibold text-gray-900">{user.name}</span>
                  <span class="text-xs text-muted-foreground">@{user.username}</span>
                </div>
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {formatDate(user.created_time)}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {formatDate(user.last_updated_time)}
              </Table.Cell>
              <Table.Cell class="text-right">
                <Button variant="ghost" size="icon" href="/users/{user.id}" class="opacity-0 group-hover:opacity-100">
                  <Edit2 class="size-4" />
                  <span class="sr-only">Edit</span>
                </Button>
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell colspan={5} class="h-32 text-center">
                <div class="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                  <p class="text-lg font-medium">No users found</p>
                  <p class="text-sm">Try adjusting your search or filters.</p>
                </div>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>

    <!-- Pagination Footer -->
    {#if data.usersResponse.meta.total > 0}
      <Card.Footer class="flex items-center justify-between border-t p-4">
        <p class="text-sm text-muted-foreground">
          Showing <span class="font-medium text-foreground">{(data.usersResponse.meta.current_page - 1) * data.usersResponse.meta.per_page + 1}</span>
          to <span class="font-medium text-foreground">{Math.min(data.usersResponse.meta.current_page * data.usersResponse.meta.per_page, data.usersResponse.meta.total)}</span>
          of <span class="font-medium text-foreground">{data.usersResponse.meta.total}</span> users
        </p>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={data.usersResponse.meta.current_page === 1}
            href="?page={data.usersResponse.meta.current_page - 1}&per_page={data.usersResponse.meta.per_page}"
          >
            <ChevronLeft class="size-4" />
            <span class="sr-only">Previous</span>
          </Button>

          <div class="hidden items-center gap-1 sm:flex">
            {#each Array.from({ length: data.usersResponse.meta.last_page }, (_, i) => i + 1) as p}
              {#if p === 1 || p === data.usersResponse.meta.last_page || (p >= data.usersResponse.meta.current_page - 1 && p <= data.usersResponse.meta.current_page + 1)}
                <Button
                  variant={data.usersResponse.meta.current_page === p ? 'default' : 'outline'}
                  size="sm"
                  class="h-8 w-8 p-0"
                  href="?page={p}&per_page={data.usersResponse.meta.per_page}"
                >
                  {p}
                </Button>
              {:else if p === 2 || p === data.usersResponse.meta.last_page - 1}
                <span class="px-1 text-muted-foreground">...</span>
              {/if}
            {/each}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={data.usersResponse.meta.current_page === data.usersResponse.meta.last_page}
            href="?page={data.usersResponse.meta.current_page + 1}&per_page={data.usersResponse.meta.per_page}"
          >
            <ChevronRight class="size-4" />
            <span class="sr-only">Next</span>
          </Button>
        </div>
      </Card.Footer>
    {/if}
  </Card.Root>
</div>
