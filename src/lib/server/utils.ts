import { fail } from '@sveltejs/kit';
import { ApiClientError } from '$lib/api';
import type { ApiError } from '$lib/types';

/**
 * Helper type for API error handling
 */
export type FormFields = Record<string, unknown>;

/**
 * API error response structure for form actions
 */
export type ActionErrorResponse = ApiError['error'] & {
	error: string; // Alias for message (for backward compatibility)
};

/**
 * Handle API errors and return appropriate fail response
 *
 * @param err - The caught error
 * @param context - Error context description (for console.error)
 * @param formFields - Form field values to preserve (optional)
 * @returns SvelteKit fail response
 */
export function handleActionError<T extends FormFields = FormFields>(
	err: unknown,
	context: string,
	formFields?: T
) {
	if (err instanceof ApiClientError) {
		return fail(400, {
			error: err.message,
			code: err.code,
			message: err.message,
			details: err.details,
			...formFields
		} as ActionErrorResponse & T);
	}

	console.error(`${context}:`, err);
	return fail(500, {
		error: 'Unable to connect to server',
		code: 'CONNECTION_ERROR',
		message: 'Unable to connect to server',
		...formFields
	} as ActionErrorResponse & T);
}

/**
 * Handle API errors in load functions
 *
 * @param err - The caught error
 * @param context - Error context description
 * @returns Error message string
 */
export function handleLoadError(err: unknown, context: string): string {
	console.error(`${context}:`, err);

	if (err instanceof ApiClientError) {
		return err.message;
	}

	return 'Failed to load data';
}

/**
 * Wrapper for async operations with unified error handling
 * Suitable for load functions
 *
 * @param fn - The async function to execute
 * @param defaultValue - Default value to return on error
 * @param context - Error context description
 * @returns Promise containing data or error
 */
export async function safeLoad<T>(
	fn: () => Promise<T>,
	defaultValue: T,
	context: string
): Promise<{ data: T; error?: string }> {
	try {
		const data = await fn();
		return { data };
	} catch (err) {
		const error = handleLoadError(err, context);
		return { data: defaultValue, error };
	}
}
