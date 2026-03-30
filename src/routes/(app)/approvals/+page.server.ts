import type { PageServerLoad } from './$types';
import { QUERY_KEYS } from '$lib/constants';
import { createEmptyCursorPaginationResponse, safeLoad } from '$lib/server/utils';
import type { ApprovalStatus } from '$lib/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  const status = url.searchParams.get(QUERY_KEYS.STATUS) as ApprovalStatus | undefined;

  const { data: approvalsResponse, error } = await safeLoad(
    () => locals.api.approvals.list({ status }),
    createEmptyCursorPaginationResponse(),
    'Failed to fetch approvals'
  );

  return {
    approvalsResponse,
    error,
    accessToken: locals.accessToken,
    refreshToken: locals.refreshToken
  };
};
