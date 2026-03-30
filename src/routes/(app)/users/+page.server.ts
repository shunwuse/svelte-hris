import type { PageServerLoad } from './$types';
import { DEFAULTS, QUERY_KEYS } from '$lib/constants';
import { safeLoad } from '$lib/server/utils';
import type { Role } from '$lib/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get(QUERY_KEYS.PAGE)) || DEFAULTS.FIRST_PAGE;
  const per_page = Number(url.searchParams.get(QUERY_KEYS.PER_PAGE)) || DEFAULTS.USERS_PER_PAGE;
  const name = url.searchParams.get(QUERY_KEYS.NAME) || undefined;
  const role = (url.searchParams.get(QUERY_KEYS.ROLE) as Role) || undefined;

  const { data: usersResponse, error } = await safeLoad(
    () => locals.api.users.list({ page, per_page, name, role }),
    {
      data: [],
      meta: {
        total: 0,
        per_page: DEFAULTS.USERS_PER_PAGE,
        current_page: DEFAULTS.FIRST_PAGE,
        last_page: DEFAULTS.FIRST_PAGE
      }
    },
    'Failed to fetch users'
  );

  return { usersResponse, error };
};
