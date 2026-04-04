import { ApprovalApi } from './approval';
import { AuthApi } from './auth';
import type { ApiClientOptions } from './client';
import { ApiClient, ApiClientError } from './client';
import { ERROR_CODES, getErrorMessage } from './error-codes';
import { UserApi } from './user';

export { ApiClientError, ERROR_CODES, getErrorMessage };
export type { ApiClientOptions };

export function createApi(options: ApiClientOptions = {}) {
  const client = new ApiClient(options);

  return {
    auth: new AuthApi(client),
    users: new UserApi(client),
    approvals: new ApprovalApi(client),
  };
}

export type ApiInstance = ReturnType<typeof createApi>;
