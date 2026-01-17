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

const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
	[ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
	[ERROR_CODES.ALREADY_EXISTS]: 'The resource already exists.',
	[ERROR_CODES.INVALID_INPUT]: 'The input provided is invalid.',
    [ERROR_CODES.INTERNAL_ERROR]: 'An internal server error occurred. Please try again later.',

	[ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
	[ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid username or password.',
	[ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please login again.',
    [ERROR_CODES.TOKEN_INVALID]: 'Invalid session token. Please login again.',

    [ERROR_CODES.VALIDATION_FAILED]: 'Validation failed. Please check your input.',

	[ERROR_CODES.FORBIDDEN]: 'Access to this resource is forbidden.',
	[ERROR_CODES.OPERATION_NOT_ALLOWED]: 'This operation is not allowed.',
    [ERROR_CODES.CONFLICT]: 'A conflict occurred with the current state of the resource.',

	[ERROR_CODES.DATABASE_ERROR]: 'A database error occurred.'
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
		return API_ERROR_MESSAGES[errorCode];
	}

	return defaultMessage || 'An unexpected error occurred.';
}
