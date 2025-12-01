<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Table from '$lib/components/ui/table';
  import { flash } from '$lib/stores';

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
</script>

<div class="p-6">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <p class="text-gray-500">Manage system users</p>
    </div>
    <Button href="/users/create">+ Add User</Button>
  </div>

  <!-- Users Table -->
  <div class="rounded-lg border bg-white">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-16">ID</Table.Head>
          <Table.Head>Username</Table.Head>
          <Table.Head>Name</Table.Head>
          <Table.Head>Created</Table.Head>
          <Table.Head>Updated</Table.Head>
          <Table.Head class="w-24">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each data.users as user}
          <Table.Row>
            <Table.Cell>{user.id}</Table.Cell>
            <Table.Cell class="font-medium">{user.username}</Table.Cell>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell class="text-sm text-gray-500">
              {formatDate(user.created_time)}
            </Table.Cell>
            <Table.Cell class="text-sm text-gray-500">
              {formatDate(user.last_updated_time)}
            </Table.Cell>
            <Table.Cell>
              <Button variant="ghost" size="sm" href="/users/{user.id}">
                Edit
              </Button>
            </Table.Cell>
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={6} class="py-8 text-center text-gray-500">
              No users found
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
