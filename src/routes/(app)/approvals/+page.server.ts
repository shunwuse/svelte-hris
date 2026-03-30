import type { PageServerLoad } from './$types';
import { QUERY_KEYS } from '$lib/constants';
import { createEmptyCursorPaginationResponse, safeLoad } from '$lib/server/utils';
import { isApprovalStatus } from '$lib/domain';

export const load: PageServerLoad = async ({ locals, url }) => {
  const statusParam = url.searchParams.get(QUERY_KEYS.STATUS);
  const status = statusParam && isApprovalStatus(statusParam) ? statusParam : undefined;

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
