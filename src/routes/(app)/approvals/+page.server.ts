import type { PageServerLoad } from './$types';
import { safeLoad } from '$lib/server/utils';
import type { ApprovalStatus } from '$lib/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  const status = url.searchParams.get('status') as ApprovalStatus | undefined;

  const { data: approvalsResponse, error } = await safeLoad(
    () => locals.api.approvals.list({ status }),
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
