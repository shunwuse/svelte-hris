<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Table from '$lib/components/ui/table';

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
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <p class="text-gray-500">Manage system users</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" href="/">← Back</Button>
      <Button href="/users/create">+ Add User</Button>
    </div>
  </div>

  <!-- Error Message -->
  {#if data.error}
    <div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
      {data.error}
    </div>
  {/if}

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
