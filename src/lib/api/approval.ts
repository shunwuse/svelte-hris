import { BaseApi } from './client';
import type {
  GetApprovalsResponse,
  Approval,
  ApprovalActionRequest,
  ListApprovalsRequest
} from '$lib/types';
import { API_ENDPOINTS } from '$lib/constants';

export class ApprovalApi extends BaseApi {
  async list(
    query?: ListApprovalsRequest
  ): Promise<GetApprovalsResponse> {
    return this.client.get<GetApprovalsResponse>(API_ENDPOINTS.APPROVALS, {
      query: query as Record<string, any>
    });
  }

  async get(id: number): Promise<Approval> {
    return this.client.get<Approval>(API_ENDPOINTS.approvalById(id));
  }

  async create(): Promise<string> {
    return this.client.post<string>(API_ENDPOINTS.APPROVALS, {});
  }

  async action(id: number, data: ApprovalActionRequest): Promise<string> {
    return this.client.put<string>(API_ENDPOINTS.approvalAction(id), data);
  }
}
