import type { PageServerLoad } from './$types';
import { safeLoad } from '$lib/server/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const per_page = Number(url.searchParams.get('per_page')) || 10;

  const { data: usersResponse, error } = await safeLoad(
    () => locals.api.users.list({ page, per_page }),
    { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 } },
    'Failed to fetch users'
  );

  return { usersResponse, error };
};
