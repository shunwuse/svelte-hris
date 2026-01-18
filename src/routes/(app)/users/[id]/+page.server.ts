import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { safeLoad, handleActionError } from '$lib/server/utils';
import { ERROR_CODES } from '$lib/api';
import * as t from '$paraglide/messages';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userId = Number(params.id);

  const { data: user, error } = await safeLoad(
    () => locals.api.users.get(userId),
    null,
    'Failed to fetch user',
    { [ERROR_CODES.NOT_FOUND]: t['users.error.not_found']() }
  );

  if (error) {
    return { user: null, error };
  }

  if (!user) {
    return { user: null, error: t['users.error.not_found']() };
  }

  return { user };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const userId = Number(params.id);
    const formData = await request.formData();
    const name = formData.get('name') as string;

    const formFields = { name };

    if (!name || name.trim() === '') {
      return fail(400, { error: t['users.error.name_required'](), ...formFields });
    }

    try {
      await locals.api.users.update(userId, { name });
    } catch (err) {
      return handleActionError(err, 'Update user error', formFields, {
        [ERROR_CODES.NOT_FOUND]: t['users.error.update_failed_not_found']()
      });
    }

    redirect(303, '/users');
  }
};
