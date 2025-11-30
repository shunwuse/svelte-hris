import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { COOKIE_KEYS } from '$lib/constants';

export const actions: Actions = {
  default: async ({ cookies }) => {
    // Clear auth cookies
    cookies.delete(COOKIE_KEYS.AUTH_TOKEN, { path: '/' });
    cookies.delete(COOKIE_KEYS.USER_INFO, { path: '/' });

    redirect(303, '/login');
  }
};
