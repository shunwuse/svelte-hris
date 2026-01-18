import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { handleActionError } from '$lib/server/utils';
import { ERROR_CODES } from '$lib/api';
import type { CreateableRole } from '$lib/domain';
import * as t from '$paraglide/messages';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as CreateableRole;

    const formFields = { username, name };

    // Basic validation
    if (!username || !name || !password) {
      return fail(400, { error: t['users.error.all_fields_required'](), ...formFields });
    }

    if (!role) {
      return fail(400, { error: t['users.error.role_required'](), ...formFields });
    }

    try {
      await locals.api.users.create(
        { username, name, password, role }
      );
    } catch (err) {
      return handleActionError(err, 'Create user error', formFields, {
        [ERROR_CODES.ALREADY_EXISTS]: t['users.error.username_taken']()
      });
    }

    redirect(303, '/users');
  }
};
