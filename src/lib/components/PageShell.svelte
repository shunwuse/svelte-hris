<script lang="ts">
  import type { Snippet } from 'svelte';

  import { cn } from '$lib/utils';

  interface Props {
    outerClass?: string;
    innerClass?: string;
    contentClass?: string;
    children?: Snippet;
  }

  let {
    outerClass = 'p-8',
    innerClass = 'mx-auto max-w-6xl',
    contentClass = 'space-y-6',
    children,
  }: Props = $props();
</script>

<div class={cn(outerClass)}>
  <div class={cn(innerClass, contentClass)}>
    {@render children?.()}
  </div>
</div>
