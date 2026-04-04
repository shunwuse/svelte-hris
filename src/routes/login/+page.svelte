<script lang="ts">
  import { enhance } from '$app/forms';
  import FormErrorAlert from '$lib/components/FormErrorAlert.svelte';
  import FormPageCard from '$lib/components/FormPageCard.svelte';
  import FormSubmitFooter from '$lib/components/FormSubmitFooter.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { createSubmitEnhancer } from '$lib/form-actions';
  import * as t from '$paraglide/messages';

  let { form } = $props();

  let isLoading = $state(false);

  const submitEnhance = createSubmitEnhancer({
    setSubmitting: (value) => {
      isLoading = value;
    },
  });
</script>

<FormPageCard
  title={t['login.title']()}
  description={t['login.description']()}
  outerClass="flex min-h-screen items-center justify-center bg-background p-6"
  innerClass="w-full max-w-md"
  headerClass="space-y-1"
  titleClass="text-2xl font-bold"
>
  <form method="POST" use:enhance={submitEnhance}>
    <Card.Content class="space-y-4">
      <FormErrorAlert message={form?.error} />

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

    <FormSubmitFooter
      submitLabel={t['login.submit']()}
      submittingLabel={t['login.submitting']()}
      isSubmitting={isLoading}
      submitClass="w-full"
      footerClass="pt-6"
    />
  </form>
</FormPageCard>
