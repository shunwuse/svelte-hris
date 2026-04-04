import { COOKIE_KEYS, DEFAULTS } from '$lib/constants';
import {
  createEmptyCursorPaginationResponse,
  createEmptyOffsetPaginationResponse,
  safeLoad,
} from '$lib/server/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
  // Get user info from cookie
  const userInfoStr = cookies.get(COOKIE_KEYS.USER_INFO);
  let userInfo = null;

  if (userInfoStr) {
    try {
      userInfo = JSON.parse(userInfoStr);
    } catch {
      // Invalid JSON, ignore
    }
  }

  // Fetch users and approvals for stats
  const [usersResult, approvalsResult] = await Promise.all([
    safeLoad(
      () => locals.api.users.list({ per_page: DEFAULTS.OVERVIEW_RECENT_LIMIT }),
      createEmptyOffsetPaginationResponse(DEFAULTS.OVERVIEW_RECENT_LIMIT),
      'Failed to fetch users',
    ),
    safeLoad(
      () => locals.api.approvals.list(),
      createEmptyCursorPaginationResponse(),
      'Failed to fetch approvals',
    ),
  ]);

  return {
    userInfo,
    recentUsers: usersResult.data.data,
    recentApprovals: approvalsResult.data.data.slice(
      0,
      DEFAULTS.OVERVIEW_RECENT_LIMIT,
    ),
  };
};
