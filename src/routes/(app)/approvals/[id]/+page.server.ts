import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { getApprovals, actionApproval } from '$lib/api';
import { safeLoad, handleActionError } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
  const approvalId = Number(params.id);

  const { data: approvalsResponse, error } = await safeLoad(
    () => getApprovals(locals.token),
    { data: [], meta: { next_cursor: null, has_more: false } },
    'Failed to fetch approval'
  );

  if (error) {
    return { approval: null, error };
  }

  const approval = approvalsResponse.data.find((a) => a.id === approvalId);

  if (!approval) {
    return { approval: null, error: 'Approval not found' };
  }

  return { approval };
};

export const actions: Actions = {
  approve: async ({ params, locals }) => {
    const approvalId = Number(params.id);

    try {
      await actionApproval({ id: approvalId, action: 'APPROVED' }, locals.token);
    } catch (err) {
      return handleActionError(err, 'Approve error');
    }

    redirect(303, '/approvals');
  },

  reject: async ({ params, locals }) => {
    const approvalId = Number(params.id);

    try {
      await actionApproval({ id: approvalId, action: 'REJECTED' }, locals.token);
    } catch (err) {
      return handleActionError(err, 'Reject error');
    }

    redirect(303, '/approvals');
  }
};
