<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Table from '$lib/components/ui/table';
  import type { ApprovalStatus } from '$lib/types';

  let { data } = $props();

  // Get badge variant based on status
  function getStatusVariant(status: ApprovalStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'PENDING':
      default:
        return 'secondary';
    }
  }

  // Format status for display
  function formatStatus(status: ApprovalStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }
</script>

<div class="p-6">
  <!-- Header -->
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Approvals</h1>
      <p class="text-gray-500">Manage approval requests</p>
    </div>
    <Button href="/approvals/create">+ New Request</Button>
  </div>

  <!-- Error Message -->
  {#if data.error}
    <div class="mb-4 rounded-md bg-destructive/15 p-4 text-destructive">
      {data.error}
    </div>
  {/if}

  <!-- Approvals Table -->
  <div class="rounded-lg border bg-white">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-16">ID</Table.Head>
          <Table.Head>Creator</Table.Head>
          <Table.Head>Approver</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head class="w-24">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each data.approvals as approval}
          <Table.Row>
            <Table.Cell>{approval.id}</Table.Cell>
            <Table.Cell class="font-medium">{approval.creator_name}</Table.Cell>
            <Table.Cell>{approval.approver_name ?? '-'}</Table.Cell>
            <Table.Cell>
              <Badge variant={getStatusVariant(approval.status)}>
                {formatStatus(approval.status)}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              {#if approval.status === 'PENDING'}
                <Button variant="ghost" size="sm" href="/approvals/{approval.id}">
                  Review
                </Button>
              {:else}
                <span class="text-sm text-gray-400">-</span>
              {/if}
            </Table.Cell>
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={5} class="py-8 text-center text-gray-500">
              No approvals found
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
