import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { createApproval } from '$lib/api';
import { handleActionError } from '$lib/server/utils';

export const actions: Actions = {
  default: async ({ locals }) => {
    try {
      await createApproval(locals.token);
    } catch (err) {
      return handleActionError(err, 'Create approval error');
    }

    redirect(303, '/approvals');
  }
};
