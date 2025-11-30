import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { createApproval, ApiClientError } from '$lib/api';

export const actions: Actions = {
  default: async ({ locals }) => {
    try {
      await createApproval(locals.token);
    } catch (err) {
      if (err instanceof ApiClientError) {
        return { error: err.message };
      }
      console.error('Create approval error:', err);
      return { error: 'Unable to connect to server' };
    }

    redirect(303, '/approvals');
  }
};
