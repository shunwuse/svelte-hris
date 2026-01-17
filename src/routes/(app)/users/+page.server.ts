import type { PageServerLoad } from './$types';
import { safeLoad } from '$lib/server/utils';
import type { Role } from '$lib/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const per_page = Number(url.searchParams.get('per_page')) || 10;
  const name = url.searchParams.get('name') || undefined;
  const role = (url.searchParams.get('role') as Role) || undefined;

  const { data: usersResponse, error } = await safeLoad(
    () => locals.api.users.list({ page, per_page, name, role }),
    { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 } },
    'Failed to fetch users'
  );

  return { usersResponse, error };
};
