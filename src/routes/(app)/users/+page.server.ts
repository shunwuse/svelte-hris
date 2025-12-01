import type { PageServerLoad } from './$types';
import { getUsers } from '$lib/api';
import { safeLoad } from '$lib/server/utils';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: users, error } = await safeLoad(
    () => getUsers(locals.token),
    [],
    'Failed to fetch users'
  );

  return { users, error };
};
