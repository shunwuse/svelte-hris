import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { COOKIE_KEYS } from '$lib/constants';
import { createApproval, ApiClientError } from '$lib/api';

export const actions: Actions = {
  default: async ({ cookies }) => {
    const token = cookies.get(COOKIE_KEYS.AUTH_TOKEN);

    if (!token) {
      redirect(303, '/login');
    }

    try {
      await createApproval(token);
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
