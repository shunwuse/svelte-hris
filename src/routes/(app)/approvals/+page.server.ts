import { QUERY_KEYS } from '$lib/constants';
import { isApprovalStatus } from '$lib/domain';
import {
  createEmptyCursorPaginationResponse,
  safeLoad,
} from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const statusParam = url.searchParams.get(QUERY_KEYS.STATUS);
  const status =
    statusParam && isApprovalStatus(statusParam) ? statusParam : undefined;

  const { data: approvalsResponse, error } = await safeLoad(
    () => locals.api.approvals.list({ status }),
    createEmptyCursorPaginationResponse(),
    'Failed to fetch approvals',
  );

  return {
    approvalsResponse,
    error,
    accessToken: locals.accessToken,
    refreshToken: locals.refreshToken,
  };
};
