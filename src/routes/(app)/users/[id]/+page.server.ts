import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { HTTP_STATUS, ROUTES } from '$lib/constants';
import {
  safeLoad,
  handleActionError,
  parsePositiveIntParam,
  readFormField
} from '$lib/server/utils';
import { ERROR_CODES } from '$lib/api';
import * as t from '$paraglide/messages';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userId = parsePositiveIntParam(params.id);

  if (!userId) {
    return { user: null, error: t['users.error.not_found']() };
  }

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
    const formData = await request.formData();
    const name = readFormField(formData, 'name');

    const formFields = { name };
    const userId = parsePositiveIntParam(params.id);

    if (!userId) {
      return fail(HTTP_STATUS.BAD_REQUEST, {
        error: t['users.error.update_failed_not_found'](),
        ...formFields
      });
    }

    if (!name) {
      return fail(HTTP_STATUS.BAD_REQUEST, {
        error: t['users.error.name_required'](),
        ...formFields
      });
    }

    try {
      await locals.api.users.update(userId, { name });
    } catch (err) {
      return handleActionError(err, 'Update user error', formFields, {
        [ERROR_CODES.NOT_FOUND]: t['users.error.update_failed_not_found']()
      });
    }

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.USERS);
  }
};
