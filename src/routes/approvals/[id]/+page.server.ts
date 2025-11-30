import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { COOKIE_KEYS } from '$lib/constants';
import { getApprovals, actionApproval, ApiClientError } from '$lib/api';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const token = cookies.get(COOKIE_KEYS.AUTH_TOKEN);

  if (!token) {
    redirect(303, '/login');
  }

  const approvalId = Number(params.id);

  try {
    const approvals = await getApprovals(token);
    const approval = approvals.find((a) => a.id === approvalId);

    if (!approval) {
      return {
        approval: null,
        error: 'Approval not found'
      };
    }

    return { approval };
  } catch (err) {
    console.error('Failed to fetch approval:', err);
    return {
      approval: null,
      error: 'Failed to load approval'
    };
  }
};

export const actions: Actions = {
  approve: async ({ params, cookies }) => {
    const token = cookies.get(COOKIE_KEYS.AUTH_TOKEN);

    if (!token) {
      redirect(303, '/login');
    }

    const approvalId = Number(params.id);

    try {
      await actionApproval({ id: approvalId, action: 'APPROVED' }, token);
    } catch (err) {
      if (err instanceof ApiClientError) {
        return fail(400, { error: err.message });
      }
      console.error('Approve error:', err);
      return fail(500, { error: 'Unable to connect to server' });
    }

    redirect(303, '/approvals');
  },

  reject: async ({ params, cookies }) => {
    const token = cookies.get(COOKIE_KEYS.AUTH_TOKEN);

    if (!token) {
      redirect(303, '/login');
    }

    const approvalId = Number(params.id);

    try {
      await actionApproval({ id: approvalId, action: 'REJECTED' }, token);
    } catch (err) {
      if (err instanceof ApiClientError) {
        return fail(400, { error: err.message });
      }
      console.error('Reject error:', err);
      return fail(500, { error: 'Unable to connect to server' });
    }

    redirect(303, '/approvals');
  }
};
