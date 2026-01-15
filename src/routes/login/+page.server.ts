import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { COOKIE_KEYS } from '$lib/constants';
import { handleActionError } from '$lib/server/utils';

export const actions: Actions = {
  default: async ({ request, cookies, locals }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return fail(400, {
        error: 'Username and password are required',
        username
      });
    }

    try {
      const data = await locals.api.auth.login({ username, password });

      cookies.set(COOKIE_KEYS.ACCESS_TOKEN, data.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60
      });

      cookies.set(COOKIE_KEYS.REFRESH_TOKEN, data.refresh_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60
      });

      cookies.set(
        COOKIE_KEYS.USER_INFO,
        JSON.stringify({ username: data.username, roles: data.roles }),
        {
          path: '/',
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60
        }
      );
    } catch (err) {
      return handleActionError(err, 'Login error', { username });
    }

    redirect(303, '/');
  }
};
