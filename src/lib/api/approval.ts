import { BaseApi } from './client';
import type {
  GetApprovalsResponse,
  Approval,
  ApprovalActionRequest,
  ListApprovalsRequest
} from '$lib/types';

export class ApprovalApi extends BaseApi {
  async list(
    query?: ListApprovalsRequest
  ): Promise<GetApprovalsResponse> {
    return this.client.get<GetApprovalsResponse>('/approvals', {
      query: query as Record<string, any>
    });
  }

  async get(id: number): Promise<Approval> {
    return this.client.get<Approval>(`/approvals/${id}`);
  }

  async create(): Promise<string> {
    return this.client.post<string>('/approvals', {});
  }

  async action(id: number, data: ApprovalActionRequest): Promise<string> {
    return this.client.put<string>(`/approvals/${id}/action`, data);
  }
}
