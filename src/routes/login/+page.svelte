<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { enhance } from '$app/forms';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isLoading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
  <Card.Root class="w-full max-w-md">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl font-bold">{t['login.title']()}</Card.Title>
      <Card.Description>{t['login.description']()}</Card.Description>
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
          <Label for="username">{t['login.username']()}</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder={t['login.username_placeholder']()}
            value={form?.username ?? ''}
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="password">{t['login.password']()}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={t['login.password_placeholder']()}
            required
          />
        </div>
      </Card.Content>

      <Card.Footer class="pt-6">
        <Button type="submit" class="w-full" disabled={isLoading}>
          {#if isLoading}
            {t['login.submitting']()}
          {:else}
            {t['login.submit']()}
          {/if}
        </Button>
      </Card.Footer>
    </form>
  </Card.Root>
</div>
