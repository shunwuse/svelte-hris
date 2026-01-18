import * as t from '$paraglide/messages';

export const ERROR_CODES = {
	// Common errors
	NOT_FOUND: 'NOT_FOUND',
	ALREADY_EXISTS: 'ALREADY_EXISTS',
	INVALID_INPUT: 'INVALID_INPUT',
	INTERNAL_ERROR: 'INTERNAL_ERROR',

	// Authentication & Authorization errors
	UNAUTHORIZED: 'UNAUTHORIZED',
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
	TOKEN_EXPIRED: 'TOKEN_EXPIRED',
	TOKEN_INVALID: 'TOKEN_INVALID',

	// Validation errors
	VALIDATION_FAILED: 'VALIDATION_FAILED',

	// Business logic errors
	FORBIDDEN: 'FORBIDDEN',
	OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
	CONFLICT: 'CONFLICT',

	// Infrastructure errors
	DATABASE_ERROR: 'DATABASE_ERROR'
} as const;

export type ApiErrorCode = keyof typeof ERROR_CODES;

export type ErrorMessageOverrides = Partial<Record<ApiErrorCode, string>> &
	Record<string, string | undefined>;

const API_ERROR_MESSAGES: Record<ApiErrorCode, () => string> = {
	[ERROR_CODES.NOT_FOUND]: t['api.error.not_found'],
	[ERROR_CODES.ALREADY_EXISTS]: t['api.error.already_exists'],
	[ERROR_CODES.INVALID_INPUT]: t['api.error.invalid_input'],
	[ERROR_CODES.INTERNAL_ERROR]: t['api.error.internal_error'],

	[ERROR_CODES.UNAUTHORIZED]: t['api.error.unauthorized'],
	[ERROR_CODES.INVALID_CREDENTIALS]: t['api.error.invalid_credentials'],
	[ERROR_CODES.TOKEN_EXPIRED]: t['api.error.token_expired'],
	[ERROR_CODES.TOKEN_INVALID]: t['api.error.token_invalid'],

	[ERROR_CODES.VALIDATION_FAILED]: t['api.error.validation_failed'],

	[ERROR_CODES.FORBIDDEN]: t['api.error.forbidden'],
	[ERROR_CODES.OPERATION_NOT_ALLOWED]: t['api.error.operation_not_allowed'],
	[ERROR_CODES.CONFLICT]: t['api.error.conflict'],

	[ERROR_CODES.DATABASE_ERROR]: t['api.error.internal_error']
};

// Gets a user-friendly error message based on the API error code
export function getErrorMessage(
	code: string,
	defaultMessage?: string,
	overrides?: ErrorMessageOverrides
): string {
	if (overrides && overrides[code] !== undefined) {
		return overrides[code]!;
	}

	const errorCode = code as ApiErrorCode;
	if (errorCode in API_ERROR_MESSAGES) {
		return API_ERROR_MESSAGES[errorCode]();
	}

	return defaultMessage || t['common.error.unexpected']();
}
