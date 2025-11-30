import type { PageServerLoad } from './$types';
import { getUsers } from '$lib/api';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const response = await getUsers(locals.token);
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
