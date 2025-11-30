import type { PageServerLoad } from './$types';
import { COOKIE_KEYS } from '$lib/constants';
import { getUsers } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get(COOKIE_KEYS.AUTH_TOKEN);

  if (!token) {
    redirect(303, '/login');
  }

  try {
    const response = await getUsers(token);
    return {
      users: response
    };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return {
      users: [],
      error: 'Failed to load users'
    };
  }
};
