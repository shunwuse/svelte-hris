<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import * as Select from '$lib/components/ui/select';
  import * as Card from '$lib/components/ui/card';
  import {
    DEFAULTS,
    FILTER_VALUES,
    PAGINATION,
    QUERY_KEYS,
    ROUTES,
    ROUTE_BUILDERS
  } from '$lib/constants';
  import { toPathWithSearch, updateSearchParams } from '$lib/navigation';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';
  import type { Pathname } from '$app/types';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { ROLES } from '$lib/domain';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Search from '@lucide/svelte/icons/search';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import Pencil from '@lucide/svelte/icons/pencil';
  import * as t from '$paraglide/messages';
  import { getLocale } from '$paraglide/runtime';

  let { data } = $props();

  // eslint-disable-next-line svelte/prefer-writable-derived
  let nameQuery = $state(page.url.searchParams.get(QUERY_KEYS.NAME) || '');

  $effect(() => {
    nameQuery = page.url.searchParams.get(QUERY_KEYS.NAME) || '';
  });

  function formatDate(timestamp: string): string {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString(getLocale(), {
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

  function updateFilters(newParams: Record<string, string | undefined>) {
    const url = updateSearchParams(
      page.url,
      {
        ...newParams,
        [QUERY_KEYS.PAGE]: DEFAULTS.FIRST_PAGE.toString()
      },
      { deleteValues: [FILTER_VALUES.ALL, ''] }
    );
    goto(resolve(toPathWithSearch(url) as Pathname));
  }

  function handleNameSearch(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      updateFilters({ [QUERY_KEYS.NAME]: nameQuery });
    }
  }

  function handleRoleChange(value: string | undefined) {
    updateFilters({ [QUERY_KEYS.ROLE]: value });
  }

  function handlePerPageChange(value: string | undefined) {
    if (!value) return;
    updateFilters({ [QUERY_KEYS.PER_PAGE]: value });
  }

  function getPageLink(p: number) {
    return toPathWithSearch(
      updateSearchParams(page.url, {
        [QUERY_KEYS.PAGE]: p.toString()
      })
    );
  }

  const roleNames: Record<string, string> = {
    [FILTER_VALUES.ALL]: t['users.role_all'](),
    [ROLES.ADMINISTRATOR]: t['role.administrator'](),
    [ROLES.MANAGER]: t['role.manager'](),
    [ROLES.STAFF]: t['role.staff']()
  };

  const perPageOptions = $derived([
    ...PAGINATION.USERS_PER_PAGE_OPTIONS.map((perPage) => ({
      value: perPage.toString(),
      label: t['users.pagination_per_page']({ per_page: perPage })
    }))
  ]);
</script>

<div class="p-8">
  <div class="mx-auto max-w-6xl space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{t['users.title']()}</h1>
        <p class="text-muted-foreground">{t['users.description']()}</p>
      </div>
      <div class="flex items-center gap-2">
        <Button href={resolve(ROUTES.USERS_CREATE as Pathname)} class="gap-2">
          <UserPlus class="size-4" />
          {t['users.create_user']()}
        </Button>
      </div>
    </div>

    <!-- Filters & Actions -->
    <Card.Root>
      <Card.Content class="p-4">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div class="relative flex-1 max-w-sm">
              <Search
                class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder={t['users.search_placeholder_full']()}
                class="pl-9"
                bind:value={nameQuery}
                onkeydown={handleNameSearch}
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-muted-foreground">{t['common.role']()}</span>
              <Select.Root
                type="single"
                value={page.url.searchParams.get(QUERY_KEYS.ROLE) || FILTER_VALUES.ALL}
                onValueChange={handleRoleChange}
              >
                <Select.Trigger class="w-40">
                  {roleNames[page.url.searchParams.get(QUERY_KEYS.ROLE) || FILTER_VALUES.ALL]}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value={FILTER_VALUES.ALL}>{t['users.role_all']()}</Select.Item>
                  <Select.Item value={ROLES.ADMINISTRATOR}>{t['role.administrator']()}</Select.Item>
                  <Select.Item value={ROLES.MANAGER}>{t['role.manager']()}</Select.Item>
                  <Select.Item value={ROLES.STAFF}>{t['role.staff']()}</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">{t['common.show']()}</span>
            <Select.Root
              type="single"
              value={data.usersResponse.meta.per_page.toString()}
              onValueChange={handlePerPageChange}
            >
              <Select.Trigger class="w-[130px]">
                {perPageOptions.find((o) => o.value === data.usersResponse.meta.per_page.toString())
                  ?.label}
              </Select.Trigger>
              <Select.Content>
                {#each perPageOptions as option (option.value)}
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
              <Table.Head class="w-16 text-center">{t['users.table_id']()}</Table.Head>
              <Table.Head>{t['users.table_user_info']()}</Table.Head>
              <Table.Head>{t['users.table_created_at']()}</Table.Head>
              <Table.Head>{t['users.table_updated_at']()}</Table.Head>
              <Table.Head class="w-24 text-right">{t['users.table_actions']()}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each data.usersResponse.data as user (user.id)}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    href={resolve(ROUTE_BUILDERS.userDetail(user.id) as Pathname)}
                    class="h-8 w-8"
                  >
                    <Pencil class="size-4" />
                    <span class="sr-only">{t['common.edit']()}</span>
                  </Button>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row>
                <Table.Cell colspan={5} class="h-32 text-center">
                  <div
                    class="flex flex-col items-center justify-center gap-1 text-muted-foreground"
                  >
                    <p class="text-lg font-medium">{t['users.no_users_found']()}</p>
                    <p class="text-sm">{t['users.no_users_found_desc']()}</p>
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
            {t['users.pagination_showing']({
              start: String(
                (data.usersResponse.meta.current_page - 1) * data.usersResponse.meta.per_page + 1
              ),
              end: String(
                Math.min(
                  data.usersResponse.meta.current_page * data.usersResponse.meta.per_page,
                  data.usersResponse.meta.total
                )
              ),
              total: String(data.usersResponse.meta.total)
            })}
          </p>

          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={data.usersResponse.meta.current_page === 1}
              href={getPageLink(data.usersResponse.meta.current_page - 1)}
            >
              <ChevronLeft class="size-4" />
              <span class="sr-only">{t['common.previous']()}</span>
            </Button>

            <div class="hidden items-center gap-1 sm:flex">
              {#each Array.from({ length: data.usersResponse.meta.last_page }, (_, i) => i + 1) as p (p)}
                {#if p === 1 || p === data.usersResponse.meta.last_page || (p >= data.usersResponse.meta.current_page - 1 && p <= data.usersResponse.meta.current_page + 1)}
                  <Button
                    variant={data.usersResponse.meta.current_page === p ? 'default' : 'outline'}
                    size="sm"
                    class="h-8 w-8 p-0"
                    href={getPageLink(p)}
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
              href={getPageLink(data.usersResponse.meta.current_page + 1)}
            >
              <ChevronRight class="size-4" />
              <span class="sr-only">{t['common.next']()}</span>
            </Button>
          </div>
        </Card.Footer>
      {/if}
    </Card.Root>
  </div>
</div>
