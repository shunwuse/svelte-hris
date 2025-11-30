<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  let { form } = $props();

  let isSubmitting = $state(false);
</script>

<div class="min-h-screen bg-gray-50 p-6">
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
          return async ({ update }) => {
            await update();
            isSubmitting = false;
          };
        }}
      >
        <Card.Content class="space-y-4">
          <!-- Error Message -->
          {#if form?.error}
            <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {form.error}
            </div>
          {/if}

          <p class="text-sm text-muted-foreground">
            Click the button below to submit a new approval request.
            It will be sent to a manager for review.
          </p>
        </Card.Content>

        <Card.Footer class="flex justify-between">
          <Button variant="outline" href="/approvals">Cancel</Button>
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
