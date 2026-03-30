import type { PageServerLoad } from './$types';
import { COOKIE_KEYS, DEFAULTS } from '$lib/constants';
import { safeLoad } from '$lib/server/utils';

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
      {
        data: [],
        meta: {
          total: 0,
          per_page: DEFAULTS.OVERVIEW_RECENT_LIMIT,
          current_page: DEFAULTS.FIRST_PAGE,
          last_page: DEFAULTS.FIRST_PAGE
        }
      },
      'Failed to fetch users'
    ),
    safeLoad(
      () => locals.api.approvals.list(),
      { data: [], meta: { next_cursor: null, has_more: false } },
      'Failed to fetch approvals'
    )
  ]);

  return {
    userInfo,
    recentUsers: usersResult.data.data,
    recentApprovals: approvalsResult.data.data.slice(0, DEFAULTS.OVERVIEW_RECENT_LIMIT)
  };
};
