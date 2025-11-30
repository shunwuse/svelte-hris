import type { PageServerLoad } from './$types';
import { getApprovals } from '$lib/api';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const approvals = await getApprovals(locals.token);
    return { approvals };
  } catch (error) {
    console.error('Failed to fetch approvals:', error);
    return {
      approvals: [],
      error: 'Failed to load approvals'
    };
  }
};
