<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';
  import * as t from '$paraglide/messages';

  let { data, form } = $props();

  let isSubmitting = $state(false);

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
    if (form?.error) flash.error(form.error);
  });
</script>

<div class="p-6">
  <div class="mx-auto max-w-md">
    <Card.Root>
      <Card.Header>
        <Card.Title>{t['users.edit_user']()}</Card.Title>
        <Card.Description>{t['users.update_user_desc']()}</Card.Description>
      </Card.Header>

      {#if data.user}
        <form
          method="POST"
          use:enhance={() => {
            isSubmitting = true;
            return async ({ result, update }) => {
              if (result.type === 'redirect') {
                flash.success(t['users.updated']());
              }
              await update();
              isSubmitting = false;
            };
          }}
        >
          <Card.Content class="space-y-4">
            <!-- Username (read-only) -->
            <div class="space-y-2">
              <Label for="username">{t['login.username']()}</Label>
              <Input
                id="username"
                type="text"
                value={data.user.username}
                disabled
                class="bg-muted"
              />
              <p class="text-xs text-muted-foreground">{t['users.username_readonly']()}</p>
            </div>

            <!-- Name -->
            <div class="space-y-2">
              <Label for="name">{t['users.table_name']()}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t['users.enter_name']()}
                required
                value={form?.name ?? data.user.name}
              />
            </div>
          </Card.Content>

          <Card.Footer class="flex justify-between pt-6">
            <Button variant="outline" href={resolve("/users")}>{t['common.cancel']()}</Button>
            <Button type="submit" disabled={isSubmitting}>
              {#if isSubmitting}
                {t['common.saving']()}
              {:else}
                {t['common.save']()}
              {/if}
            </Button>
          </Card.Footer>
        </form>
      {/if}
    </Card.Root>
  </div>
</div>
