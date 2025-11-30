import type { PageServerLoad } from './$types';
import { COOKIE_KEYS } from '$lib/constants';
import { getApprovals } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get(COOKIE_KEYS.AUTH_TOKEN);

  if (!token) {
    redirect(303, '/login');
  }

  try {
    const approvals = await getApprovals(token);
    return { approvals };
  } catch (error) {
    console.error('Failed to fetch approvals:', error);
    return {
      approvals: [],
      error: 'Failed to load approvals'
    };
  }
};
