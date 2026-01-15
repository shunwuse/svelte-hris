import type { PageServerLoad } from './$types';
import { safeLoad } from '$lib/server/utils';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: approvalsResponse, error } = await safeLoad(
    () => locals.api.approvals.list(),
    { data: [], meta: { next_cursor: null, has_more: false } },
    'Failed to fetch approvals'
  );

  return {
    approvalsResponse,
    error,
    accessToken: locals.accessToken,
    refreshToken: locals.refreshToken
  };
};
