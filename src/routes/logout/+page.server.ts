import { redirect } from '@sveltejs/kit';

import { HTTP_STATUS, ROUTES } from '$lib/constants';
import { clearAuthCookies } from '$lib/server/auth-cookies';

import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    clearAuthCookies(cookies);

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.LOGIN);
  },
};
