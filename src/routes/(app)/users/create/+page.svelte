<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import { flash } from '$lib/stores';
  import { resolve } from '$app/paths';

  let { form } = $props();

  let isSubmitting = $state(false);
  let selectedRole = $state<string | undefined>(undefined);

  const roleOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' }
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
        <Card.Title>Create New User</Card.Title>
        <Card.Description>Add a new user to the system</Card.Description>
      </Card.Header>

      <form
        method="POST"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ result, update }) => {
            if (result.type === 'redirect') {
              flash.success('User created successfully');
            }
            await update();
            isSubmitting = false;
          };
        }}
      >
        <Card.Content class="space-y-4">
          <!-- Username -->
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              required
              value={form?.username ?? ''}
            />
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
              value={form?.name ?? ''}
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>

          <!-- Role -->
          <div class="space-y-2">
            <Label>Role</Label>
            <Select.Root type="single" name="role" bind:value={selectedRole}>
              <Select.Trigger class="w-full">
                {roleOptions.find(r => r.value === selectedRole)?.label ?? 'Select a role'}
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

        <Card.Footer class="flex justify-between">
          <Button variant="outline" href={resolve("/users")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {#if isSubmitting}
              Creating...
            {:else}
              Create User
            {/if}
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  </div>
</div>
