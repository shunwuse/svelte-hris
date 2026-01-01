import type { PageServerLoad } from './$types';
import { COOKIE_KEYS } from '$lib/constants';
import { getUsers, getApprovals } from '$lib/api';
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
			() => getUsers(locals.token),
			{ data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 } },
			'Failed to fetch users'
		),
		safeLoad(() => getApprovals(locals.token), [], 'Failed to fetch approvals')
	]);

	// Calculate stats
	const pendingApprovals = approvalsResult.data.filter((a) => a.status === 'PENDING').length;
	const approvedApprovals = approvalsResult.data.filter((a) => a.status === 'APPROVED').length;
	const rejectedApprovals = approvalsResult.data.filter((a) => a.status === 'REJECTED').length;

	return {
		userInfo,
		stats: {
			totalUsers: usersResult.data.meta.total,
			totalApprovals: approvalsResult.data.length,
			pendingApprovals,
			approvedApprovals,
			rejectedApprovals
		},
		recentApprovals: approvalsResult.data.slice(0, 5)
	};
};
