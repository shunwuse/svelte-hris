export type SearchParamValue = string | undefined;

export interface UpdateSearchParamsOptions {
  deleteValues?: readonly string[];
}

const DEFAULT_DELETE_VALUES = [''] as const;

export function updateSearchParams(
  sourceUrl: URL,
  updates: Record<string, SearchParamValue>,
  options: UpdateSearchParamsOptions = {},
): URL {
  const url = new URL(sourceUrl);
  const deleteValues = options.deleteValues ?? DEFAULT_DELETE_VALUES;

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || deleteValues.includes(value)) {
      url.searchParams.delete(key);
      return;
    }

    url.searchParams.set(key, value);
  });

  return url;
}

export function toPathWithSearch(url: URL): string {
  return url.pathname + url.search;
}
