<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';

  let isLoading = $state(false);
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4">
  <h1 class="text-2xl font-bold">Welcome to HRIS</h1>
  <p class="text-muted-foreground">You are logged in.</p>

  <div class="flex gap-2">
    <Button href="/users">User Management</Button>
    <Button href="/approvals">Approvals</Button>
  </div>

  <form
    method="POST"
    action="/logout"
    use:enhance={() => {
      isLoading = true;
      return async ({ update }) => {
        await update();
      };
    }}
  >
    <Button type="submit" variant="outline" disabled={isLoading}>
      {#if isLoading}
        Logging out...
      {:else}
        Logout
      {/if}
    </Button>
  </form>
</div>
