<script lang="ts">
  import { Button, type ButtonVariant } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  interface Props {
    cancelHref?: string;
    cancelLabel?: string;
    submitLabel: string;
    submittingLabel?: string;
    isSubmitting?: boolean;
    submitDisabled?: boolean;
    submitVariant?: ButtonVariant;
    submitClass?: string;
    footerClass?: string;
  }

  let {
    cancelHref,
    cancelLabel,
    submitLabel,
    submittingLabel,
    isSubmitting = false,
    submitDisabled,
    submitVariant = 'default',
    submitClass,
    footerClass = 'flex justify-between pt-6',
  }: Props = $props();
</script>

<Card.Footer class={cn(footerClass)}>
  {#if cancelHref && cancelLabel}
    <Button variant="outline" href={cancelHref}>{cancelLabel}</Button>
  {/if}

  <Button
    type="submit"
    variant={submitVariant}
    disabled={submitDisabled ?? isSubmitting}
    class={submitClass}
  >
    {#if isSubmitting && submittingLabel}
      {submittingLabel}
    {:else}
      {submitLabel}
    {/if}
  </Button>
</Card.Footer>
