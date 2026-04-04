import { fail, redirect } from '@sveltejs/kit';

import { ERROR_CODES } from '$lib/api';
import { APPROVAL_STATUS, HTTP_STATUS, ROUTES } from '$lib/constants';
import type { ActionableApprovalStatus } from '$lib/domain';
import {
  handleActionError,
  parsePositiveIntParam,
  safeLoad,
} from '$lib/server/utils';
import * as t from '$paraglide/messages';

import type { Actions, PageServerLoad } from './$types';

async function performApprovalAction(
  approvalIdParam: string,
  locals: App.Locals,
  action: ActionableApprovalStatus,
  context: string,
) {
  const approvalId = parsePositiveIntParam(approvalIdParam);

  if (!approvalId) {
    return fail(HTTP_STATUS.BAD_REQUEST, {
      error: t['approvals.error.not_found'](),
    });
  }

  try {
    await locals.api.approvals.action(approvalId, { action });
  } catch (err) {
    return handleActionError(
      err,
      context,
      {},
      {
        [ERROR_CODES.NOT_FOUND]: t['approvals.error.not_found'](),
      },
    );
  }

  redirect(HTTP_STATUS.SEE_OTHER, ROUTES.APPROVALS);
}

export const load: PageServerLoad = async ({ params, locals }) => {
  const approvalId = parsePositiveIntParam(params.id);

  if (!approvalId) {
    return { approval: null, error: t['approvals.error.not_found']() };
  }

  const { data: approval, error } = await safeLoad(
    () => locals.api.approvals.get(approvalId),
    null,
    'Failed to fetch approval',
    { [ERROR_CODES.NOT_FOUND]: t['approvals.error.not_found']() },
  );

  if (error) {
    return { approval: null, error };
  }

  if (!approval) {
    return { approval: null, error: t['approvals.error.not_found']() };
  }

  return { approval };
};

export const actions: Actions = {
  approve: async ({ params, locals }) => {
    return performApprovalAction(
      params.id,
      locals,
      APPROVAL_STATUS.APPROVED,
      'Approve error',
    );
  },

  reject: async ({ params, locals }) => {
    return performApprovalAction(
      params.id,
      locals,
      APPROVAL_STATUS.REJECTED,
      'Reject error',
    );
  },
};
