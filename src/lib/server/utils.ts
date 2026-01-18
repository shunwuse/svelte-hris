import { fail } from '@sveltejs/kit';
import { ApiClientError } from '$lib/api';
import type { ApiError } from '$lib/types';
import type { ErrorMessageOverrides } from '$lib/api/error-codes';
import { getErrorMessage } from '$lib/api/error-codes';
import * as t from '$paraglide/messages';

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
 * @param overrides - Custom error message overrides by code (optional)
 * @returns SvelteKit fail response
 */
export function handleActionError<T extends FormFields = FormFields>(
	err: unknown,
	context: string,
	formFields?: T,
	overrides?: ErrorMessageOverrides
) {
	if (err instanceof ApiClientError) {
		const message = getErrorMessage(err.code, err.message, overrides);
		return fail(400, {
			error: message,
			code: err.code,
			message: message,
			details: err.details,
			...formFields
		} as ActionErrorResponse & T);
	}

	console.error(`${context}:`, err);
	return fail(500, {
		error: t['common.error.connection_error'](),
		code: 'CONNECTION_ERROR',
		message: t['common.error.connection_error'](),
		...formFields
	});
}

/**
 * Handle API errors in load functions
 *
 * @param err - The caught error
 * @param context - Error context description
 * @param overrides - Custom error message overrides by code (optional)
 * @returns Error message string
 */
export function handleLoadError(
	err: unknown,
	context: string,
	overrides?: ErrorMessageOverrides
): string {
	console.error(`${context}:`, err);

	if (err instanceof ApiClientError) {
		return getErrorMessage(err.code, err.message, overrides);
	}

	return t['common.error.load_failed']();
}

/**
 * Wrapper for async operations with unified error handling
 * Suitable for load functions
 *
 * @param fn - The async function to execute
 * @param defaultValue - Default value to return on error
 * @param context - Error context description
 * @param overrides - Custom error message overrides by code (optional)
 * @returns Promise containing data or error
 */
export async function safeLoad<T>(
	fn: () => Promise<T>,
	defaultValue: T,
	context: string,
	overrides?: ErrorMessageOverrides
): Promise<{ data: T; error?: string }> {
	try {
		const data = await fn();
		return { data };
	} catch (err) {
		const error = handleLoadError(err, context, overrides);
		return { data: defaultValue, error };
	}
}
