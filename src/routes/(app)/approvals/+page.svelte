<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { flash } from '$lib/stores';
  import { getApprovals } from '$lib/api';
  import type { Approval, ApprovalStatus } from '$lib/types';
  import Search from '@lucide/svelte/icons/search';
  import Plus from '@lucide/svelte/icons/plus';
  import Loader2 from '@lucide/svelte/icons/loader-2';

  let { data } = $props();

  // State for cursor-based pagination
  let approvals = $state<Approval[]>(data.approvalsResponse.data);
  let nextCursor = $state<string | null>(data.approvalsResponse.meta.next_cursor);
  let hasMore = $state<boolean>(data.approvalsResponse.meta.has_more);
  let isLoadingMore = $state(false);
  let isAutoLoad = $state(false);

  // Intersection Observer for auto-load
  let loadMoreTrigger = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!isAutoLoad || !hasMore || !loadMoreTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreTrigger);
    return () => observer.disconnect();
  });

  // Update state when data from server changes
  $effect(() => {
    approvals = data.approvalsResponse.data;
    nextCursor = data.approvalsResponse.meta.next_cursor;
    hasMore = data.approvalsResponse.meta.has_more;
  });

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

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
  });

  async function loadMore() {
    if (isLoadingMore || !nextCursor) return;

    isLoadingMore = true;
    try {
      const response = await getApprovals(data.token, {
        cursor: nextCursor
      });

      approvals = [...approvals, ...response.data];
      nextCursor = response.meta.next_cursor;
      hasMore = response.meta.has_more;
    } catch {
      flash.error('Failed to load more approvals');
    } finally {
      isLoadingMore = false;
    }
  }
</script>

<div class="space-y-6 p-6">
  <!-- Header -->
  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Approvals</h1>
      <p class="text-muted-foreground">Manage and review approval requests.</p>
    </div>
    <div class="flex items-center gap-2">
      <Button href="/approvals/create" class="gap-2">
        <Plus class="size-4" />
        New Request
      </Button>
    </div>
  </div>

  <!-- Filters & Actions -->
  <Card.Root>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="relative max-w-sm flex-1">
          <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search approvals..." class="pl-9" />
        </div>
        <div class="flex items-center gap-2">
          <Label for="auto-load" class="text-sm text-muted-foreground">Auto-load</Label>
          <Button
            id="auto-load"
            variant={isAutoLoad ? "default" : "outline"}
            size="sm"
            class="h-9 w-16 transition-all"
            onclick={() => (isAutoLoad = !isAutoLoad)}
          >
            {isAutoLoad ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>
    </Card.Content>

    <!-- Approvals Table -->
    <div class="border-t">
      <Table.Root>
        <Table.Header>
          <Table.Row class="bg-muted/50">
            <Table.Head class="w-16 text-center">ID</Table.Head>
            <Table.Head>Creator</Table.Head>
            <Table.Head>Approver</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head class="w-24 text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each approvals as approval (approval.id)}
            <Table.Row>
              <Table.Cell class="text-center font-mono text-xs text-muted-foreground">
                {approval.id}
              </Table.Cell>
              <Table.Cell class="font-medium">{approval.creator_name}</Table.Cell>
              <Table.Cell>{approval.approver_name ?? '-'}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(approval.status)}>
                  {formatStatus(approval.status)}
                </Badge>
              </Table.Cell>
              <Table.Cell class="text-right">
                {#if approval.status === 'PENDING'}
                  <Button variant="ghost" size="sm" href="/approvals/{approval.id}">
                    Review
                  </Button>
                {:else}
                  <span class="text-sm text-muted-foreground">-</span>
                {/if}
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell colspan={5} class="h-24 text-center text-muted-foreground">
                No approvals found.
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>

    <!-- Load More / End of List -->
    <div bind:this={loadMoreTrigger} class="flex justify-center border-t p-4">
      {#if hasMore}
        <Button
          variant="outline"
          onclick={loadMore}
          disabled={isLoadingMore}
          class="min-w-[120px]"
        >
          {#if isLoadingMore}
            <Loader2 class="mr-2 size-4 animate-spin" />
            Loading...
          {:else}
            Load More
          {/if}
        </Button>
      {:else if approvals.length > 0}
        <p class="text-sm text-muted-foreground">You've reached the end of the list.</p>
      {/if}
    </div>
  </Card.Root>
</div>
