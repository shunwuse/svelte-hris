<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';

  let { data, form } = $props();

  let isSubmitting = $state(false);
</script>

<div class="p-6">
  <div class="mx-auto max-w-md">
    <Card.Root>
      <Card.Header>
        <Card.Title>Edit User</Card.Title>
        <Card.Description>Update user information</Card.Description>
      </Card.Header>

      {#if data.error}
        <Card.Content>
          <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {data.error}
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="outline" href="/users">← Back to Users</Button>
        </Card.Footer>
      {:else if data.user}
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

            <!-- Username (read-only) -->
            <div class="space-y-2">
              <Label for="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={data.user.username}
                disabled
                class="bg-muted"
              />
              <p class="text-xs text-muted-foreground">Username cannot be changed</p>
            </div>

            <!-- Name -->
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                required
                value={form?.name ?? data.user.name}
              />
            </div>
          </Card.Content>

          <Card.Footer class="flex justify-between">
            <Button variant="outline" href="/users">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {#if isSubmitting}
                Saving...
              {:else}
                Save Changes
              {/if}
            </Button>
          </Card.Footer>
        </form>
      {/if}
    </Card.Root>
  </div>
</div>
