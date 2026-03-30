<script lang="ts">
  import { enhance } from '$app/forms';
  import { createSubmitEnhancer } from '$lib/form-actions';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { ROUTES } from '$lib/constants';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isSubmitting = $state(false);

  const submitEnhance = createSubmitEnhancer({
    setSubmitting: (value) => {
      isSubmitting = value;
    },
    onRedirect: () => {
      flash.success(t['approvals.submitted_msg']());
    }
  });

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (form?.error) flash.error(form.error);
  });
</script>

<div class="p-6">
  <div class="mx-auto max-w-md">
    <Card.Root>
      <Card.Header>
        <Card.Title>{t['approvals.create_request']()}</Card.Title>
        <Card.Description>{t['approvals.create_desc']()}</Card.Description>
      </Card.Header>

      <form method="POST" use:enhance={submitEnhance}>
        <Card.Content class="space-y-4">
          <p class="text-sm text-muted-foreground">
            {t['approvals.create_info']()}
          </p>
        </Card.Content>

        <Card.Footer class="flex justify-between pt-6">
          <Button variant="outline" href={resolve(ROUTES.APPROVALS)}>{t['common.cancel']()}</Button>
          <Button type="submit" disabled={isSubmitting}>
            {#if isSubmitting}
              {t['approvals.submitting']()}
            {:else}
              {t['approvals.submit']()}
            {/if}
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  </div>
</div>
