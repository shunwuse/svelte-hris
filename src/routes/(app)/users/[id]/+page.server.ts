import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { safeLoad, handleActionError } from '$lib/server/utils';
import { ERROR_CODES } from '$lib/api';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userId = Number(params.id);

  const { data: user, error } = await safeLoad(
    () => locals.api.users.get(userId),
    null,
    'Failed to fetch user',
    { [ERROR_CODES.NOT_FOUND]: 'The user does not exist or has been deleted' }
  );

  if (error) {
    return { user: null, error };
  }

  if (!user) {
    return { user: null, error: 'User not found' };
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
      return fail(400, { error: 'Name is required', ...formFields });
    }

    try {
      await locals.api.users.update(userId, { name });
    } catch (err) {
      return handleActionError(err, 'Update user error', formFields, {
        [ERROR_CODES.NOT_FOUND]: 'Cannot update user as they no longer exist'
      });
    }

    redirect(303, '/users');
  }
};
