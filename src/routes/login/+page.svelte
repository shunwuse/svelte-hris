<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { login, ApiClientError } from '$lib/api';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let isLoading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    isLoading = true;

    try {
      const response = await login({ username, password });
      console.log('Login successful:', response);

      // TODO: Save token and redirect
      goto('/');
    } catch (err) {
      if (err instanceof ApiClientError) {
        error = err.message;
      } else {
        error = 'An unexpected error occurred';
      }
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl font-bold">Login</Card.Title>
      <Card.Description>Enter your credentials to access the system</Card.Description>
    </Card.Header>

    <form onsubmit={handleSubmit}>
      <Card.Content class="space-y-4">
        {#if error}
          <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        {/if}

        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            bind:value={username}
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            bind:value={password}
            required
          />
        </div>
      </Card.Content>

      <Card.Footer class="pt-4">
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
