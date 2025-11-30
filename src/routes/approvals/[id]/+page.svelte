<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import type { ApprovalStatus } from '$lib/types';

  let { data, form } = $props();

  let isSubmitting = $state(false);

  function getStatusVariant(status: ApprovalStatus): 'default' | 'secondary' | 'destructive' {
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

  function formatStatus(status: ApprovalStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="mx-auto max-w-md">
    <Card.Root>
      <Card.Header>
        <Card.Title>Review Approval</Card.Title>
        <Card.Description>Review and take action on this request</Card.Description>
      </Card.Header>

      {#if data.error}
        <Card.Content>
          <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {data.error}
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="outline" href="/approvals">← Back to Approvals</Button>
        </Card.Footer>
      {:else if data.approval}
        <Card.Content class="space-y-4">
          <!-- Form Error Message -->
          {#if form?.error}
            <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {form.error}
            </div>
          {/if}

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

        <Card.Footer class="flex justify-between">
          <Button variant="outline" href="/approvals">Cancel</Button>

          {#if data.approval.status === 'PENDING'}
            <div class="flex gap-2">
              <form
                method="POST"
                action="?/reject"
                use:enhance={() => {
                  isSubmitting = true;
                  return async ({ update }) => {
                    await update();
                    isSubmitting = false;
                  };
                }}
              >
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  Reject
                </Button>
              </form>

              <form
                method="POST"
                action="?/approve"
                use:enhance={() => {
                  isSubmitting = true;
                  return async ({ update }) => {
                    await update();
                    isSubmitting = false;
                  };
                }}
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
