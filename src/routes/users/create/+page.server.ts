import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createUser, ApiClientError } from '$lib/api';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    // Basic validation
    if (!username || !name || !password) {
      return fail(400, {
        error: 'All fields are required',
        username,
        name
      });
    }

    if (!role || !['manager', 'staff'].includes(role)) {
      return fail(400, {
        error: 'Please select a valid role',
        username,
        name
      });
    }

    try {
      await createUser(
        { username, name, password, role: role as 'manager' | 'staff' },
        locals.token
      );
    } catch (err) {
      if (err instanceof ApiClientError) {
        return fail(400, {
          error: err.message,
          username,
          name
        });
      }
      console.error('Create user error:', err);
      return fail(500, {
        error: 'Unable to connect to server',
        username,
        name
      });
    }

    redirect(303, '/users');
  }
};
