<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';
  import { ROLES } from '$lib/domain';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isSubmitting = $state(false);
  let selectedRole = $state<string | undefined>(undefined);

  const roleOptions = [
    { value: ROLES.MANAGER, label: t['role.manager']() },
    { value: ROLES.STAFF, label: t['role.staff']() }
  ];

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (form?.error) flash.error(form.error);
  });
</script>

<div class="p-6">
  <div class="mx-auto max-w-md">
    <Card.Root>
      <Card.Header>
        <Card.Title>{t['users.create_user']()}</Card.Title>
        <Card.Description>{t['users.create_user_desc']()}</Card.Description>
      </Card.Header>

      <form
        method="POST"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ result, update }) => {
            if (result.type === 'redirect') {
              flash.success(t['users.created']());
            }
            await update();
            isSubmitting = false;
          };
        }}
      >
        <Card.Content class="space-y-4">
          <!-- Username -->
          <div class="space-y-2">
            <Label for="username">{t['login.username']()}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t['users.enter_username']()}
              required
              value={form?.username ?? ''}
            />
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
              value={form?.name ?? ''}
            />
          </div>

          <!-- Password -->
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

          <!-- Role -->
          <div class="space-y-2">
            <Label>{t['common.role']()}</Label>
            <Select.Root type="single" name="role" bind:value={selectedRole}>
              <Select.Trigger class="w-full">
                {roleOptions.find(r => r.value === selectedRole)?.label ?? t['common.role']()}
              </Select.Trigger>
              <Select.Content>
                {#each roleOptions as role (role.value)}
                  <Select.Item value={role.value} label={role.label}>
                    {role.label}
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
            <input type="hidden" name="role" value={selectedRole ?? ''} />
          </div>
        </Card.Content>

        <Card.Footer class="flex justify-between pt-6">
          <Button variant="outline" href={resolve("/users")}>{t['common.cancel']()}</Button>
          <Button type="submit" disabled={isSubmitting}>
            {#if isSubmitting}
              {t['common.creating']()}
            {:else}
              {t['users.create_user']()}
            {/if}
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  </div>
</div>
