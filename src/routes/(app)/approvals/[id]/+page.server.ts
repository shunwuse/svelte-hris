import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { APPROVAL_STATUS } from '$lib/domain';
import { safeLoad, handleActionError } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
  const approvalId = Number(params.id);

  const { data: approval, error } = await safeLoad(
    () => locals.api.approvals.get(approvalId),
    null,
    'Failed to fetch approval'
  );

  if (error) {
    return { approval: null, error };
  }

  if (!approval) {
    return { approval: null, error: 'Approval not found' };
  }

  return { approval };
};

export const actions: Actions = {
  approve: async ({ params, locals }) => {
    const approvalId = Number(params.id);

    try {
      await locals.api.approvals.action(approvalId, { action: APPROVAL_STATUS.APPROVED });
    } catch (err) {
      return handleActionError(err, 'Approve error');
    }

    redirect(303, '/approvals');
  },

  reject: async ({ params, locals }) => {
    const approvalId = Number(params.id);

    try {
      await locals.api.approvals.action(approvalId, { action: APPROVAL_STATUS.REJECTED });
    } catch (err) {
      return handleActionError(err, 'Reject error');
    }

    redirect(303, '/approvals');
  }
};
