import { BaseApi } from './client';
import type {
  GetApprovalsResponse,
  Approval,
  ApprovalActionRequest
} from '$lib/types';

export class ApprovalApi extends BaseApi {
  async list(
    params: { cursor?: string; per_page?: number; } = {}
  ): Promise<GetApprovalsResponse> {
    const searchParams = new URLSearchParams();
    if (params.cursor) searchParams.set('cursor', params.cursor);
    if (params.per_page) searchParams.set('per_page', params.per_page.toString());

    const queryString = searchParams.toString();
    const path = `/approvals${queryString ? `?${queryString}` : ''}`;

    return this.client.get<GetApprovalsResponse>(path);
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
