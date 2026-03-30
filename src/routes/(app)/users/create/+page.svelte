<script lang="ts">
  import { enhance } from '$app/forms';
  import FormPageCard from '$lib/components/FormPageCard.svelte';
  import FormSubmitFooter from '$lib/components/FormSubmitFooter.svelte';
  import { createSubmitEnhancer } from '$lib/form-actions';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { ROLES, ROUTES } from '$lib/constants';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isSubmitting = $state(false);
  let selectedRole = $state<string | undefined>(undefined);

  const submitEnhance = createSubmitEnhancer({
    setSubmitting: (value) => {
      isSubmitting = value;
    },
    onRedirect: () => {
      flash.success(t['users.created']());
    }
  });

  const roleOptions = [
    { value: ROLES.MANAGER, label: t['role.manager']() },
    { value: ROLES.STAFF, label: t['role.staff']() }
  ];

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (form?.error) flash.error(form.error);
  });
</script>

<FormPageCard title={t['users.create_user']()} description={t['users.create_user_desc']()}>
  <form method="POST" use:enhance={submitEnhance}>
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
            {roleOptions.find((r) => r.value === selectedRole)?.label ?? t['common.role']()}
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

    <FormSubmitFooter
      cancelHref={resolve(ROUTES.USERS)}
      cancelLabel={t['common.cancel']()}
      submitLabel={t['users.create_user']()}
      submittingLabel={t['common.creating']()}
      {isSubmitting}
    />
  </form>
</FormPageCard>
