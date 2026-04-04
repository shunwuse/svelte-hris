import { DEFAULTS, QUERY_KEYS } from '$lib/constants';
import { isRole } from '$lib/domain';
import {
  createEmptyOffsetPaginationResponse,
  parsePositiveIntParam,
  safeLoad,
} from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const page =
    parsePositiveIntParam(url.searchParams.get(QUERY_KEYS.PAGE) ?? '') ??
    DEFAULTS.FIRST_PAGE;
  const per_page =
    parsePositiveIntParam(url.searchParams.get(QUERY_KEYS.PER_PAGE) ?? '') ??
    DEFAULTS.USERS_PER_PAGE;
  const name = url.searchParams.get(QUERY_KEYS.NAME) || undefined;
  const roleParam = url.searchParams.get(QUERY_KEYS.ROLE);
  const role = roleParam && isRole(roleParam) ? roleParam : undefined;

  const { data: usersResponse, error } = await safeLoad(
    () => locals.api.users.list({ page, per_page, name, role }),
    createEmptyOffsetPaginationResponse(),
    'Failed to fetch users',
  );

  return { usersResponse, error };
};
