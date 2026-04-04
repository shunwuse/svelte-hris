<script lang="ts">
  import Eye from '@lucide/svelte/icons/eye';
  import Loader2 from '@lucide/svelte/icons/loader-2';
  import Plus from '@lucide/svelte/icons/plus';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { Pathname } from '$app/types';
  import { ApiClientError, createApi } from '$lib/api';
  import ApprovalStatusBadge from '$lib/components/ApprovalStatusBadge.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import {
    APPROVAL_STATUS,
    FILTER_VALUES,
    QUERY_KEYS,
    ROUTE_BUILDERS,
    ROUTES,
  } from '$lib/constants';
  import type { ApprovalStatus } from '$lib/domain';
  import { formatApprovalStatus, isApprovalStatus } from '$lib/domain';
  import { toPathWithSearch, updateSearchParams } from '$lib/navigation';
  import { flash } from '$lib/stores';
  import type { Approval } from '$lib/types';
  import * as t from '$paraglide/messages';

  let { data } = $props();

  // Create API client - only on client side to avoid SSR fetch warnings
  const api = $derived.by<ReturnType<typeof createApi> | null>(() => {
    if (typeof window === 'undefined') return null;
    return createApi({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  });

  const selectedStatus = $derived.by<ApprovalStatus | typeof FILTER_VALUES.ALL>(
    () => {
      const statusParam = page.url.searchParams.get(QUERY_KEYS.STATUS);
      return statusParam && isApprovalStatus(statusParam)
        ? statusParam
        : FILTER_VALUES.ALL;
    },
  );

  const selectedStatusLabel = $derived(
    selectedStatus === FILTER_VALUES.ALL
      ? t['approvals.status_all']()
      : formatStatus(selectedStatus),
  );

  // State for cursor-based pagination
  let approvals = $state<Approval[]>(data.approvalsResponse.data);
  let nextCursor = $state<string | null>(
    data.approvalsResponse.meta.next_cursor,
  );
  let hasMore = $state<boolean>(data.approvalsResponse.meta.has_more);
  let isLoadingMore = $state(false);
  let isAutoLoad = $state(false);

  // Intersection Observer for auto-load
  let loadMoreTrigger = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!isAutoLoad || !hasMore || !loadMoreTrigger || approvals.length === 0)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
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

  // Format status for display
  function formatStatus(status: ApprovalStatus): string {
    return formatApprovalStatus(status, {
      pending: t['approvals.status_pending'](),
      approved: t['approvals.status_approved'](),
      rejected: t['approvals.status_rejected'](),
    });
  }

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
  });

  function handleStatusChange(value: string | undefined) {
    const url = updateSearchParams(
      page.url,
      {
        [QUERY_KEYS.STATUS]: value,
        [QUERY_KEYS.CURSOR]: undefined,
      },
      { deleteValues: [FILTER_VALUES.ALL, ''] },
    );
    goto(resolve(toPathWithSearch(url) as Pathname));
  }

  async function loadMore() {
    if (!api || isLoadingMore || !nextCursor) return;

    isLoadingMore = true;
    try {
      const status =
        selectedStatus === FILTER_VALUES.ALL ? undefined : selectedStatus;

      const response = await api.approvals.list({
        cursor: nextCursor,
        status,
      });

      approvals = [...approvals, ...response.data];
      nextCursor = response.meta.next_cursor;
      hasMore = response.meta.has_more;
    } catch (err) {
      if (err instanceof ApiClientError) {
        flash.error(err.message);
      } else {
        flash.error(t['approvals.load_error']());
      }
    } finally {
      isLoadingMore = false;
    }
  }
</script>

<div class="p-8">
  <div class="mx-auto max-w-6xl space-y-6">
    <!-- Header -->
    <PageHeader
      title={t['nav.approvals']()}
      description={t['approvals.description']()}
    >
      {#snippet actions()}
        <Button href={ROUTES.APPROVALS_CREATE} class="gap-2">
          <Plus class="size-4" />
          {t['approvals.create_request']()}
        </Button>
      {/snippet}
    </PageHeader>

    <!-- Filters & Actions -->
    <Card.Root>
      <Card.Content class="p-4">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex flex-1 items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-muted-foreground"
                >{t['common.status']()}</span
              >
              <Select.Root
                type="single"
                value={selectedStatus}
                onValueChange={handleStatusChange}
              >
                <Select.Trigger class="w-40"
                  >{selectedStatusLabel}</Select.Trigger
                >
                <Select.Content>
                  <Select.Item value={FILTER_VALUES.ALL}
                    >{t['approvals.status_all']()}</Select.Item
                  >
                  <Select.Item value={APPROVAL_STATUS.PENDING}
                    >{t['approvals.status_pending']()}</Select.Item
                  >
                  <Select.Item value={APPROVAL_STATUS.APPROVED}
                    >{t['approvals.status_approved']()}</Select.Item
                  >
                  <Select.Item value={APPROVAL_STATUS.REJECTED}
                    >{t['approvals.status_rejected']()}</Select.Item
                  >
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground"
              >{t['approvals.auto_load']()}</span
            >
            <Button
              id="auto-load"
              variant={isAutoLoad ? 'default' : 'outline'}
              size="sm"
              class="h-9 w-16 transition-all"
              onPress={() => (isAutoLoad = !isAutoLoad)}
            >
              {isAutoLoad ? t['approvals.on']() : t['approvals.off']()}
            </Button>
          </div>
        </div>
      </Card.Content>

      <!-- Approvals Table -->
      <div class="border-t">
        <Table.Root>
          <Table.Header>
            <Table.Row class="bg-muted/50">
              <Table.Head class="w-16 text-center"
                >{t['users.table_id']()}</Table.Head
              >
              <Table.Head>{t['approvals.creator']()}</Table.Head>
              <Table.Head>{t['approvals.approver']()}</Table.Head>
              <Table.Head>{t['common.status']()}</Table.Head>
              <Table.Head class="w-24 text-right"
                >{t['users.table_actions']()}</Table.Head
              >
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each approvals as approval (approval.id)}
              <Table.Row>
                <Table.Cell
                  class="text-center font-mono text-xs text-muted-foreground"
                >
                  {approval.id}
                </Table.Cell>
                <Table.Cell class="font-medium"
                  >{approval.creator_name}</Table.Cell
                >
                <Table.Cell>{approval.approver_name ?? '-'}</Table.Cell>
                <Table.Cell>
                  <ApprovalStatusBadge status={approval.status} />
                </Table.Cell>
                <Table.Cell class="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    href={ROUTE_BUILDERS.approvalDetail(approval.id)}
                    class="h-8 w-8"
                  >
                    <Eye class="size-4" />
                    <span class="sr-only">{t['common.view']()}</span>
                  </Button>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row>
                <Table.Cell
                  colspan={5}
                  class="h-24 text-center text-muted-foreground"
                >
                  {t['approvals.no_approvals']()}
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
            onPress={loadMore}
            disabled={isLoadingMore}
            class="min-w-[120px]"
          >
            {#if isLoadingMore}
              <Loader2 class="mr-2 size-4 animate-spin" />
              {t['common.loading']()}
            {:else}
              {t['approvals.load_more']()}
            {/if}
          </Button>
        {:else if approvals.length > 0}
          <p class="text-sm text-muted-foreground">
            {t['approvals.reached_end']()}
          </p>
        {/if}
      </div>
    </Card.Root>
  </div>
</div>
