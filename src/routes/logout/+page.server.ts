import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { HTTP_STATUS, ROUTES } from '$lib/constants';
import { clearAuthCookies } from '$lib/server/auth-cookies';

export const actions: Actions = {
  default: async ({ cookies }) => {
    clearAuthCookies(cookies);

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.LOGIN);
  }
};
