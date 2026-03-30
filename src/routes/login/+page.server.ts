import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions } from './$types';
import { COOKIE_CONFIG, COOKIE_KEYS, HTTP_STATUS, ROUTES } from '$lib/constants';
import { handleActionError } from '$lib/server/utils';
import * as t from '$paraglide/messages';

export const actions: Actions = {
  default: async ({ request, cookies, locals }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return fail(HTTP_STATUS.BAD_REQUEST, {
        error: t['login.error.credentials_required'](),
        username
      });
    }

    try {
      const data = await locals.api.auth.login({ username, password });

      cookies.set(COOKIE_KEYS.ACCESS_TOKEN, data.access_token, {
        path: COOKIE_CONFIG.PATH_ROOT,
        httpOnly: true,
        secure: !dev,
        sameSite: COOKIE_CONFIG.SAME_SITE_STRICT,
        maxAge: COOKIE_CONFIG.AUTH_MAX_AGE_SECONDS
      });

      cookies.set(COOKIE_KEYS.REFRESH_TOKEN, data.refresh_token, {
        path: COOKIE_CONFIG.PATH_ROOT,
        httpOnly: true,
        secure: !dev,
        sameSite: COOKIE_CONFIG.SAME_SITE_STRICT,
        maxAge: COOKIE_CONFIG.AUTH_MAX_AGE_SECONDS
      });

      cookies.set(
        COOKIE_KEYS.USER_INFO,
        JSON.stringify({ username: data.username, roles: data.roles }),
        {
          path: COOKIE_CONFIG.PATH_ROOT,
          httpOnly: false,
          secure: !dev,
          sameSite: COOKIE_CONFIG.SAME_SITE_STRICT,
          maxAge: COOKIE_CONFIG.AUTH_MAX_AGE_SECONDS
        }
      );
    } catch (err) {
      return handleActionError(err, 'Login error', { username });
    }

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.ROOT);
  }
};
