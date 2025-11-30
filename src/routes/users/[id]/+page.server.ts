import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getUsers, updateUser, ApiClientError } from '$lib/api';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userId = Number(params.id);

  try {
    const users = await getUsers(locals.token);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return {
        user: null,
        error: 'User not found'
      };
    }

    return { user };
  } catch (err) {
    console.error('Failed to fetch user:', err);
    return {
      user: null,
      error: 'Failed to load user'
    };
  }
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const userId = Number(params.id);
    const formData = await request.formData();
    const name = formData.get('name') as string;

    if (!name || name.trim() === '') {
      return fail(400, {
        error: 'Name is required',
        name
      });
    }

    try {
      await updateUser({ id: userId, name }, locals.token);
    } catch (err) {
      if (err instanceof ApiClientError) {
        return fail(400, {
          error: err.message,
          name
        });
      }
      console.error('Update user error:', err);
      return fail(500, {
        error: 'Unable to connect to server',
        name
      });
    }

    redirect(303, '/users');
  }
};
