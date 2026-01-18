<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isSubmitting = $state(false);

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

      <form
        method="POST"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ result, update }) => {
            if (result.type === 'redirect') {
              flash.success(t['approvals.submitted_msg']());
            }
            await update();
            isSubmitting = false;
          };
        }}
      >
        <Card.Content class="space-y-4">
          <p class="text-sm text-muted-foreground">
            {t['approvals.create_info']()}
          </p>
        </Card.Content>

        <Card.Footer class="flex justify-between pt-6">
          <Button variant="outline" href={resolve("/approvals")}>{t['common.cancel']()}</Button>
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
