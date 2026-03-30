<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    message?: string | null;
    class?: string;
  }

  let { message, class: className }: Props = $props();
</script>

{#if message}
  <div class={cn('rounded-md bg-destructive/15 p-3 text-sm text-destructive', className)}>
    {message}
  </div>
{/if}
