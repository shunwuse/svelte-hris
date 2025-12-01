import type { PageServerLoad } from './$types';
import { getApprovals } from '$lib/api';
import { safeLoad } from '$lib/server/utils';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: approvals, error } = await safeLoad(
    () => getApprovals(locals.token),
    [],
    'Failed to fetch approvals'
  );

  return { approvals, error };
};
