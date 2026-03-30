<script lang="ts">
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import { Button } from '$lib/components/ui/button';
  import { createPaginationItems } from '$lib/pagination';

  interface Props {
    currentPage: number;
    lastPage: number;
    getPageHref: (page: number) => string;
    previousLabel: string;
    nextLabel: string;
  }

  let { currentPage, lastPage, getPageHref, previousLabel, nextLabel }: Props = $props();

  const paginationItems = $derived(createPaginationItems(currentPage, lastPage));
</script>

<div class="flex items-center gap-2">
  <Button
    variant="outline"
    size="icon"
    disabled={currentPage === 1}
    href={getPageHref(currentPage - 1)}
  >
    <ChevronLeft class="size-4" />
    <span class="sr-only">{previousLabel}</span>
  </Button>

  <div class="hidden items-center gap-1 sm:flex">
    {#each paginationItems as item, index (`${item}-${index}`)}
      {#if item === 'ellipsis'}
        <span class="px-1 text-muted-foreground">...</span>
      {:else}
        <Button
          variant={currentPage === item ? 'default' : 'outline'}
          size="sm"
          class="h-8 w-8 p-0"
          href={getPageHref(item)}
        >
          {item}
        </Button>
      {/if}
    {/each}
  </div>

  <Button
    variant="outline"
    size="icon"
    disabled={currentPage === lastPage}
    href={getPageHref(currentPage + 1)}
  >
    <ChevronRight class="size-4" />
    <span class="sr-only">{nextLabel}</span>
  </Button>
</div>
