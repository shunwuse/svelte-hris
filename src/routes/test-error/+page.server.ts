import type { PageServerLoad, Actions } from './$types';
import { safeLoad, handleActionError } from '$lib/server/utils';
import { ApiClientError } from '$lib/api';

export const load: PageServerLoad = async () => {
	// Test safeLoad with a failing function
	const { data, error } = await safeLoad(
		async () => {
			// Simulate API call that fails
			throw new Error('Simulated network error');
		},
		'default value',
		'Test load error'
	);

	return {
		testData: data,
		loadError: error
	};
};

export const actions: Actions = {
	// Test network error (500)
	testNetworkError: async () => {
		try {
			throw new Error('Simulated network failure');
		} catch (err) {
			return handleActionError(err, 'Test network error', { testField: 'preserved value' });
		}
	},

	// Test API error (400)
	testApiError: async () => {
		try {
			throw new ApiClientError({
				code: 'VALIDATION_ERROR',
				message: 'Username already exists',
				details: {
					username: 'This username is already taken',
					suggestion: 'Try adding numbers to your username'
				}
			});
		} catch (err) {
			return handleActionError(err, 'Test API error', { testField: 'preserved value' });
		}
	},

	// Test success (should redirect but we'll just return success)
	testSuccess: async () => {
		return { success: true, message: 'Action completed successfully!' };
	}
};
