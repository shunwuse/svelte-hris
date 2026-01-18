<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import { flash } from '$lib/stores';
  import type { ApprovalStatus } from '$lib/domain';
  import { APPROVAL_STATUS } from '$lib/domain';
  import { resolve } from '$app/paths';
  import * as t from '$paraglide/messages';

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
    switch (status) {
      case APPROVAL_STATUS.PENDING:
        return t['approvals.status_pending']();
      case APPROVAL_STATUS.APPROVED:
        return t['approvals.status_approved']();
      case APPROVAL_STATUS.REJECTED:
        return t['approvals.status_rejected']();
      default:
        return status;
    }
  }

  function handleEnhance(action: 'approve' | 'reject') {
    return () => {
      isSubmitting = true;
      return async ({ result, update }: { result: { type: string }; update: () => Promise<void> }) => {
        if (result.type === 'redirect') {
          flash.success(action === 'approve' ? t['approvals.approved_msg']() : t['approvals.rejected_msg']());
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
        <Card.Title>{t['approvals.review_request']()}</Card.Title>
        <Card.Description>{t['approvals.review_desc']()}</Card.Description>
      </Card.Header>

      {#if data.error}
        <Card.Content>
          <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {data.error}
          </div>
        </Card.Content>
        <Card.Footer class="pt-6">
          <Button variant="outline" href={resolve("/approvals")}>← {t['approvals.back_to_list']()}</Button>
        </Card.Footer>
      {:else if data.approval}
        <Card.Content class="space-y-4">
          <!-- Approval Details -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{t['users.table_id']()}</span>
              <span class="font-medium">{data.approval.id}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{t['approvals.creator']()}</span>
              <span class="font-medium">{data.approval.creator_name}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{t['approvals.approver']()}</span>
              <span class="font-medium">{data.approval.approver_name ?? '-'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{t['common.status']()}</span>
              <Badge variant={getStatusVariant(data.approval.status)}>
                {formatStatus(data.approval.status)}
              </Badge>
            </div>
          </div>
        </Card.Content>

        <Card.Footer class="flex justify-between pt-6">
          <Button variant="outline" href={resolve("/approvals")}>{t['common.cancel']()}</Button>

          {#if data.approval.status === APPROVAL_STATUS.PENDING}
            <div class="flex gap-2">
              <form
                method="POST"
                action="?/reject"
                use:enhance={handleEnhance('reject')}
              >
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  {t['approvals.reject']()}
                </Button>
              </form>

              <form
                method="POST"
                action="?/approve"
                use:enhance={handleEnhance('approve')}
              >
                <Button type="submit" disabled={isSubmitting}>
                  {t['approvals.approve']()}
                </Button>
              </form>
            </div>
          {/if}
        </Card.Footer>
      {/if}
    </Card.Root>
  </div>
</div>
