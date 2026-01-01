import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getUsers, updateUser } from '$lib/api';
import { safeLoad, handleActionError } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
  const userId = Number(params.id);

  const { data: usersResponse, error } = await safeLoad(
    () => getUsers(locals.token),
    { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 } },
    'Failed to fetch user'
  );

  if (error) {
    return { user: null, error };
  }

  const user = usersResponse.data.find((u) => u.id === userId);

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
      await updateUser({ id: userId, name }, locals.token);
    } catch (err) {
      return handleActionError(err, 'Update user error', formFields);
    }

    redirect(303, '/users');
  }
};
