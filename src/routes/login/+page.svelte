<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { enhance } from '$app/forms';

  let { form } = $props();

  let isLoading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl font-bold">Login</Card.Title>
      <Card.Description>Sign in to your account to continue</Card.Description>
    </Card.Header>

    <form
      method="POST"
      use:enhance={() => {
        isLoading = true;
        return async ({ update }) => {
          isLoading = false;
          await update();
        };
      }}
    >
      <Card.Content class="space-y-4">
        {#if  form?.error}
          <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {form.error}
          </div>
        {/if}

        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={form?.username ?? ''}
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
      </Card.Content>

      <Card.Footer class="pt-6">
        <Button type="submit" class="w-full" disabled={isLoading}>
          {#if isLoading}
            Logging in...
          {:else}
            Login
          {/if}
        </Button>
      </Card.Footer>
    </form>
  </Card.Root>
</div>
