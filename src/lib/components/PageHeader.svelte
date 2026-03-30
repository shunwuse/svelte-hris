<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description?: string;
    class?: string;
    actionsClass?: string;
    actions?: Snippet;
  }

  let {
    title,
    description,
    class: className,
    actionsClass = 'flex items-center gap-2',
    actions
  }: Props = $props();
</script>

<div class={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between', className)}>
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
    {#if description}
      <p class="text-muted-foreground">{description}</p>
    {/if}
  </div>

  {#if actions}
    <div class={actionsClass}>
      {@render actions()}
    </div>
  {/if}
</div>
