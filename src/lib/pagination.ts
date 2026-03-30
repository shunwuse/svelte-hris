export type PaginationItem = number | 'ellipsis';

export function createPaginationItems(
  currentPage: number,
  lastPage: number,
  siblingCount = 1
): PaginationItem[] {
  if (lastPage <= 0) {
    return [];
  }

  const clampedCurrent = Math.min(Math.max(currentPage, 1), lastPage);
  const pages = new Set<number>([1, lastPage]);

  for (let page = clampedCurrent - siblingCount; page <= clampedCurrent + siblingCount; page += 1) {
    if (page >= 1 && page <= lastPage) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  let previousPage: number | null = null;

  for (const page of sortedPages) {
    if (previousPage !== null && page - previousPage > 1) {
      items.push('ellipsis');
    }

    items.push(page);
    previousPage = page;
  }

  return items;
}
