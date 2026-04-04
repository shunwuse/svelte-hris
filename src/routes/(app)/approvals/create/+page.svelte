<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import FormPageCard from '$lib/components/FormPageCard.svelte';
  import FormSubmitFooter from '$lib/components/FormSubmitFooter.svelte';
  import * as Card from '$lib/components/ui/card';
  import { ROUTES } from '$lib/constants';
  import { createSubmitEnhancer } from '$lib/form-actions';
  import { flash } from '$lib/stores';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isSubmitting = $state(false);

  const submitEnhance = createSubmitEnhancer({
    setSubmitting: (value) => {
      isSubmitting = value;
    },
    onRedirect: () => {
      flash.success(t['approvals.submitted_msg']());
    },
  });

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (form?.error) flash.error(form.error);
  });
</script>

<FormPageCard
  title={t['approvals.create_request']()}
  description={t['approvals.create_desc']()}
>
  <form method="POST" use:enhance={submitEnhance}>
    <Card.Content class="space-y-4">
      <p class="text-sm text-muted-foreground">
        {t['approvals.create_info']()}
      </p>
    </Card.Content>

    <FormSubmitFooter
      cancelHref={resolve(ROUTES.APPROVALS)}
      cancelLabel={t['common.cancel']()}
      submitLabel={t['approvals.submit']()}
      submittingLabel={t['approvals.submitting']()}
      {isSubmitting}
    />
  </form>
</FormPageCard>
