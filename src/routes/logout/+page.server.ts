import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { COOKIE_CONFIG, COOKIE_KEYS, HTTP_STATUS, ROUTES } from '$lib/constants';

export const actions: Actions = {
  default: async ({ cookies }) => {
    // Clear auth cookies
    cookies.delete(COOKIE_KEYS.ACCESS_TOKEN, { path: COOKIE_CONFIG.PATH_ROOT });
    cookies.delete(COOKIE_KEYS.REFRESH_TOKEN, { path: COOKIE_CONFIG.PATH_ROOT });
    cookies.delete(COOKIE_KEYS.USER_INFO, { path: COOKIE_CONFIG.PATH_ROOT });

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.LOGIN);
  }
};
