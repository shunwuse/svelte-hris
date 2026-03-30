import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { HTTP_STATUS, ROUTES } from '$lib/constants';
import { handleActionError, readFormField } from '$lib/server/utils';
import { ERROR_CODES } from '$lib/api';
import { isCreateableRole } from '$lib/domain';
import * as t from '$paraglide/messages';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const username = readFormField(formData, 'username');
    const name = readFormField(formData, 'name');
    const password = readFormField(formData, 'password', { trim: false });
    const role = readFormField(formData, 'role');

    const formFields = { username, name };

    // Basic validation
    if (!username || !name || !password) {
      return fail(HTTP_STATUS.BAD_REQUEST, {
        error: t['users.error.all_fields_required'](),
        ...formFields
      });
    }

    if (!isCreateableRole(role)) {
      return fail(HTTP_STATUS.BAD_REQUEST, {
        error: t['users.error.role_required'](),
        ...formFields
      });
    }

    try {
      await locals.api.users.create({ username, name, password, role });
    } catch (err) {
      return handleActionError(err, 'Create user error', formFields, {
        [ERROR_CODES.ALREADY_EXISTS]: t['users.error.username_taken']()
      });
    }

    redirect(HTTP_STATUS.SEE_OTHER, ROUTES.USERS);
  }
};
