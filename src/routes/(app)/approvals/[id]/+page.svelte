<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import { flash } from '$lib/stores';
  import type { ApprovalStatus } from '$lib/domain';
  import { APPROVAL_STATUS } from '$lib/domain';
  import { resolve } from '$app/paths';

  let { data, form } = $props();

  let isSubmitting = $state(false);

  function getStatusVariant(status: ApprovalStatus): 'default' | 'secondary' | 'destructive' {
    switch (status) {
      case APPROVAL_STATUS.APPROVED:
        return 'default';
      case APPROVAL_STATUS.REJECTED:
        return 'destructive';
      case APPROVAL_STATUS.PENDING:
      default:
        return 'secondary';
    }
  }

  function formatStatus(status: ApprovalStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  function handleEnhance(action: 'approve' | 'reject') {
    return () => {
      isSubmitting = true;
      return async ({ result, update }: { result: { type: string }; update: () => Promise<void> }) => {
        if (result.type === 'redirect') {
          flash.success(action === 'approve' ? 'Request approved' : 'Request rejected');
        }
        await update();
        isSubmitting = false;
      };
    };
  }

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
    if (form?.error) flash.error(form.error);
  });
</script>

<div class="p-6">
  <div class="mx-auto max-w-md">
    <Card.Root>
      <Card.Header>
        <Card.Title>Review Request</Card.Title>
        <Card.Description>Review and manage this approval request</Card.Description>
      </Card.Header>

      {#if data.error}
        <Card.Content>
          <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {data.error}
          </div>
        </Card.Content>
        <Card.Footer class="pt-6">
          <Button variant="outline" href={resolve("/approvals")}>← Back to Approvals</Button>
        </Card.Footer>
      {:else if data.approval}
        <Card.Content class="space-y-4">
          <!-- Approval Details -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">ID</span>
              <span class="font-medium">{data.approval.id}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Creator</span>
              <span class="font-medium">{data.approval.creator_name}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Approver</span>
              <span class="font-medium">{data.approval.approver_name ?? '-'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Status</span>
              <Badge variant={getStatusVariant(data.approval.status)}>
                {formatStatus(data.approval.status)}
              </Badge>
            </div>
          </div>
        </Card.Content>

        <Card.Footer class="flex justify-between pt-6">
          <Button variant="outline" href={resolve("/approvals")}>Cancel</Button>

          {#if data.approval.status === APPROVAL_STATUS.PENDING}
            <div class="flex gap-2">
              <form
                method="POST"
                action="?/reject"
                use:enhance={handleEnhance('reject')}
              >
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  Reject
                </Button>
              </form>

              <form
                method="POST"
                action="?/approve"
                use:enhance={handleEnhance('approve')}
              >
                <Button type="submit" disabled={isSubmitting}>
                  Approve
                </Button>
              </form>
            </div>
          {/if}
        </Card.Footer>
      {/if}
    </Card.Root>
  </div>
</div>
