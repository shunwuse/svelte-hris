<script lang="ts">
  import type { Snippet } from 'svelte';

  import * as Card from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  interface Props {
    title: string;
    description?: string;
    outerClass?: string;
    innerClass?: string;
    headerClass?: string;
    titleClass?: string;
    children?: Snippet;
  }

  let {
    title,
    description,
    outerClass = 'p-6',
    innerClass = 'mx-auto max-w-md',
    headerClass,
    titleClass,
    children,
  }: Props = $props();
</script>

<div class={cn(outerClass)}>
  <div class={cn(innerClass)}>
    <Card.Root>
      <Card.Header class={headerClass}>
        <Card.Title class={titleClass}>{title}</Card.Title>
        {#if description}
          <Card.Description>{description}</Card.Description>
        {/if}
      </Card.Header>

      {@render children?.()}
    </Card.Root>
  </div>
</div>
