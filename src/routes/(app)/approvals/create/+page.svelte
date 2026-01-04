<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';

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
        <Card.Title>New Approval Request</Card.Title>
        <Card.Description>Submit a new approval request for review</Card.Description>
      </Card.Header>

      <form
        method="POST"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ result, update }) => {
            if (result.type === 'redirect') {
              flash.success('Approval request submitted successfully');
            }
            await update();
            isSubmitting = false;
          };
        }}
      >
        <Card.Content class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Click the button below to submit a new approval request.
            It will be sent to a manager for review.
          </p>
        </Card.Content>

        <Card.Footer class="flex justify-between pt-6">
          <Button variant="outline" href={resolve("/approvals")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {#if isSubmitting}
              Submitting...
            {:else}
              Submit Request
            {/if}
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  </div>
</div>
