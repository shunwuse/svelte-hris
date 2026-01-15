import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { handleActionError } from '$lib/server/utils';

export const actions: Actions = {
  default: async ({ locals }) => {
    try {
      await locals.api.approvals.create();
    } catch (err) {
      return handleActionError(err, 'Create approval error');
    }

    redirect(303, '/approvals');
  }
};
