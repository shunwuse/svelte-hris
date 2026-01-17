import type { ApiClientOptions } from './client';
import { ApiClient, ApiClientError } from './client';
import { AuthApi } from './auth';
import { UserApi } from './user';
import { ApprovalApi } from './approval';
import { getErrorMessage, ERROR_CODES } from './error-codes';

export { ApiClientError, getErrorMessage, ERROR_CODES };
export type { ApiClientOptions };

export function createApi(options: ApiClientOptions = {}) {
  const client = new ApiClient(options);

  return {
    auth: new AuthApi(client),
    users: new UserApi(client),
    approvals: new ApprovalApi(client)
  };
}

export type ApiInstance = ReturnType<typeof createApi>;
