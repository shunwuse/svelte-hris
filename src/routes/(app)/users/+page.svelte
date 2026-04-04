<script lang="ts">
  import Pencil from '@lucide/svelte/icons/pencil';
  import Search from '@lucide/svelte/icons/search';
  import UserPlus from '@lucide/svelte/icons/user-plus';

  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { Pathname } from '$app/types';
  import OffsetPaginationNav from '$lib/components/OffsetPaginationNav.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import {
    DEFAULTS,
    FILTER_VALUES,
    PAGINATION,
    QUERY_KEYS,
    ROLES,
    ROUTE_BUILDERS,
    ROUTES,
  } from '$lib/constants';
  import { toPathWithSearch, updateSearchParams } from '$lib/navigation';
  import { flash } from '$lib/stores';
  import * as t from '$paraglide/messages';
  import { getLocale } from '$paraglide/runtime';

  let { data } = $props();

  // eslint-disable-next-line svelte/prefer-writable-derived
  let nameQuery = $state(page.url.searchParams.get(QUERY_KEYS.NAME) || '');

  $effect(() => {
    nameQuery = page.url.searchParams.get(QUERY_KEYS.NAME) || '';
  });

  function formatDate(timestamp: string): string {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString(getLocale(), {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Forward page-level errors to flash so layout shows toast
  $effect(() => {
    if (data?.error) flash.error(data.error);
  });

  function updateFilters(newParams: Record<string, string | undefined>) {
    const url = updateSearchParams(
      page.url,
      {
        ...newParams,
        [QUERY_KEYS.PAGE]: DEFAULTS.FIRST_PAGE.toString(),
      },
      { deleteValues: [FILTER_VALUES.ALL, ''] },
    );
    goto(resolve(toPathWithSearch(url) as Pathname));
  }

  function handleNameSearch(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      updateFilters({ [QUERY_KEYS.NAME]: nameQuery });
    }
  }

  function handleRoleChange(value: string | undefined) {
    updateFilters({ [QUERY_KEYS.ROLE]: value });
  }

  function handlePerPageChange(value: string | undefined) {
    if (!value) return;
    updateFilters({ [QUERY_KEYS.PER_PAGE]: value });
  }

  function getPageLink(p: number) {
    return toPathWithSearch(
      updateSearchParams(page.url, {
        [QUERY_KEYS.PAGE]: p.toString(),
      }),
    );
  }

  const roleNames: Record<string, string> = {
    [FILTER_VALUES.ALL]: t['users.role_all'](),
    [ROLES.ADMINISTRATOR]: t['role.administrator'](),
    [ROLES.MANAGER]: t['role.manager'](),
    [ROLES.STAFF]: t['role.staff'](),
  };

  const perPageOptions = $derived([
    ...PAGINATION.USERS_PER_PAGE_OPTIONS.map((perPage) => ({
      value: perPage.toString(),
      label: t['users.pagination_per_page']({ per_page: perPage }),
    })),
  ]);

  const usersMeta = $derived(data.usersResponse.meta);
  const selectedRole = $derived(
    page.url.searchParams.get(QUERY_KEYS.ROLE) || FILTER_VALUES.ALL,
  );
  const selectedPerPage = $derived(usersMeta.per_page.toString());
  const selectedPerPageLabel = $derived(
    perPageOptions.find((option) => option.value === selectedPerPage)?.label ??
      '',
  );
  const pageRangeStart = $derived(
    (usersMeta.current_page - 1) * usersMeta.per_page + 1,
  );
  const pageRangeEnd = $derived(
    Math.min(usersMeta.current_page * usersMeta.per_page, usersMeta.total),
  );
</script>

<div class="p-8">
  <div class="mx-auto max-w-6xl space-y-6">
    <!-- Header -->
    <PageHeader
      title={t['users.title']()}
      description={t['users.description']()}
    >
      {#snippet actions()}
        <Button href={resolve(ROUTES.USERS_CREATE as Pathname)} class="gap-2">
          <UserPlus class="size-4" />
          {t['users.create_user']()}
        </Button>
      {/snippet}
    </PageHeader>

    <!-- Filters & Actions -->
    <Card.Root>
      <Card.Content class="p-4">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div class="relative max-w-sm flex-1">
              <Search
                class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder={t['users.search_placeholder_full']()}
                class="pl-9"
                bind:value={nameQuery}
                onkeydown={handleNameSearch}
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-muted-foreground"
                >{t['common.role']()}</span
              >
              <Select.Root
                type="single"
                value={selectedRole}
                onValueChange={handleRoleChange}
              >
                <Select.Trigger class="w-40">
                  {roleNames[selectedRole]}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value={FILTER_VALUES.ALL}
                    >{t['users.role_all']()}</Select.Item
                  >
                  <Select.Item value={ROLES.ADMINISTRATOR}
                    >{t['role.administrator']()}</Select.Item
                  >
                  <Select.Item value={ROLES.MANAGER}
                    >{t['role.manager']()}</Select.Item
                  >
                  <Select.Item value={ROLES.STAFF}
                    >{t['role.staff']()}</Select.Item
                  >
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground"
              >{t['common.show']()}</span
            >
            <Select.Root
              type="single"
              value={selectedPerPage}
              onValueChange={handlePerPageChange}
            >
              <Select.Trigger class="w-[130px]"
                >{selectedPerPageLabel}</Select.Trigger
              >
              <Select.Content>
                {#each perPageOptions as option (option.value)}
                  <Select.Item value={option.value}>{option.label}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </Card.Content>

      <!-- Users Table -->
      <div class="border-t">
        <Table.Root>
          <Table.Header>
            <Table.Row class="bg-muted/50">
              <Table.Head class="w-16 text-center"
                >{t['users.table_id']()}</Table.Head
              >
              <Table.Head>{t['users.table_user_info']()}</Table.Head>
              <Table.Head>{t['users.table_created_at']()}</Table.Head>
              <Table.Head>{t['users.table_updated_at']()}</Table.Head>
              <Table.Head class="w-24 text-right"
                >{t['users.table_actions']()}</Table.Head
              >
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each data.usersResponse.data as user (user.id)}
              <Table.Row class="group transition-colors hover:bg-muted/30">
                <Table.Cell
                  class="text-center font-mono text-xs text-muted-foreground"
                >
                  {user.id}
                </Table.Cell>
                <Table.Cell>
                  <div class="flex flex-col">
                    <span class="font-semibold text-gray-900">{user.name}</span>
                    <span class="text-xs text-muted-foreground"
                      >@{user.username}</span
                    >
                  </div>
                </Table.Cell>
                <Table.Cell class="text-sm text-muted-foreground">
                  {formatDate(user.created_time)}
                </Table.Cell>
                <Table.Cell class="text-sm text-muted-foreground">
                  {formatDate(user.last_updated_time)}
                </Table.Cell>
                <Table.Cell class="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    href={resolve(
                      ROUTE_BUILDERS.userDetail(user.id) as Pathname,
                    )}
                    class="h-8 w-8"
                  >
                    <Pencil class="size-4" />
                    <span class="sr-only">{t['common.edit']()}</span>
                  </Button>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row>
                <Table.Cell colspan={5} class="h-32 text-center">
                  <div
                    class="flex flex-col items-center justify-center gap-1 text-muted-foreground"
                  >
                    <p class="text-lg font-medium">
                      {t['users.no_users_found']()}
                    </p>
                    <p class="text-sm">{t['users.no_users_found_desc']()}</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>

      <!-- Pagination Footer -->
      {#if usersMeta.total > 0}
        <Card.Footer class="flex items-center justify-between border-t p-4">
          <p class="text-sm text-muted-foreground">
            {t['users.pagination_showing']({
              start: String(pageRangeStart),
              end: String(pageRangeEnd),
              total: String(usersMeta.total),
            })}
          </p>

          <OffsetPaginationNav
            currentPage={usersMeta.current_page}
            lastPage={usersMeta.last_page}
            getPageHref={getPageLink}
            previousLabel={t['common.previous']()}
            nextLabel={t['common.next']()}
          />
        </Card.Footer>
      {/if}
    </Card.Root>
  </div>
</div>
