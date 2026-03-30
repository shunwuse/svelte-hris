import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { HTTP_STATUS, ROUTES } from '$lib/constants';
import { setAuthSessionCookies } from '$lib/server/auth-cookies';
import { handleActionError, readFormField } from '$lib/server/utils';
import * as t from '$paraglide/messages';

export const actions: Actions = {
  default: async ({ request, cookies, locals }) => {
    const formData = await request.formData();
    const username = readFormField(formData, 'username');
    const password = readFormField(formData, 'password', { trim: false });

    if (!username || !password) {
      return fail(HTTP_STATUS.BAD_REQUEST, {
        error: t['login.error.credentials_required'](),
        username
      });
    }

    try {
      const data = await locals.api.auth.login({ username, password });

      setAuthSessionCookies(cookies, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        username: data.username,
        roles: data.roles
      });
    } catch (err) {
      return handleActionError(err, 'Login error', { username });
    }

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.ROOT);
  }
};
