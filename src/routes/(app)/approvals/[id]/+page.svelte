<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import ApprovalStatusBadge from '$lib/components/ApprovalStatusBadge.svelte';
  import FormErrorAlert from '$lib/components/FormErrorAlert.svelte';
  import FormPageCard from '$lib/components/FormPageCard.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { APPROVAL_STATUS, FORM_ACTIONS, ROUTES } from '$lib/constants';
  import { createSubmitEnhancer } from '$lib/form-actions';
  import { flash } from '$lib/stores';
  import * as t from '$paraglide/messages';

  let { data, form } = $props();

  let isSubmitting = $state(false);

  function createApprovalSubmitEnhancer(action: 'approve' | 'reject') {
    return createSubmitEnhancer({
      setSubmitting: (value) => {
        isSubmitting = value;
      },
      onRedirect: () => {
        flash.success(
          action === 'approve'
            ? t['approvals.approved_msg']()
            : t['approvals.rejected_msg'](),
        );
      },
    });
  }

  const approveEnhance = createApprovalSubmitEnhancer('approve');
  const rejectEnhance = createApprovalSubmitEnhancer('reject');

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
    if (form?.error) flash.error(form.error);
  });
</script>

<FormPageCard
  title={t['approvals.review_request']()}
  description={t['approvals.review_desc']()}
>
  {#if data.error}
    <Card.Content>
      <FormErrorAlert message={data.error} />
    </Card.Content>
    <Card.Footer class="pt-6">
      <Button variant="outline" href={resolve(ROUTES.APPROVALS)}
        >← {t['approvals.back_to_list']()}</Button
      >
    </Card.Footer>
  {:else if data.approval}
    <Card.Content class="space-y-4">
      <!-- Approval Details -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground"
            >{t['users.table_id']()}</span
          >
          <span class="font-medium">{data.approval.id}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground"
            >{t['approvals.creator']()}</span
          >
          <span class="font-medium">{data.approval.creator_name}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground"
            >{t['approvals.approver']()}</span
          >
          <span class="font-medium">{data.approval.approver_name ?? '-'}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground"
            >{t['common.status']()}</span
          >
          <ApprovalStatusBadge status={data.approval.status} />
        </div>
      </div>
    </Card.Content>

    <Card.Footer class="flex justify-between pt-6">
      <Button variant="outline" href={resolve(ROUTES.APPROVALS)}
        >{t['common.cancel']()}</Button
      >

      {#if data.approval.status === APPROVAL_STATUS.PENDING}
        <div class="flex gap-2">
          <form
            method="POST"
            action={FORM_ACTIONS.REJECT}
            use:enhance={rejectEnhance}
          >
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {t['approvals.reject']()}
            </Button>
          </form>

          <form
            method="POST"
            action={FORM_ACTIONS.APPROVE}
            use:enhance={approveEnhance}
          >
            <Button type="submit" disabled={isSubmitting}>
              {t['approvals.approve']()}
            </Button>
          </form>
        </div>
      {/if}
    </Card.Footer>
  {/if}
</FormPageCard>
