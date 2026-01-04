import { api } from './client';
import type {
    GetApprovalsResponse,
    ApprovalActionRequest
} from '$lib/types';

export function getApprovals(
  token: string,
  params: { cursor?: string; per_page?: number } = {}
): Promise<GetApprovalsResponse> {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.per_page) searchParams.set('per_page', params.per_page.toString());

  const queryString = searchParams.toString();
  const endpoint = `/approvals${queryString ? `?${queryString}` : ''}`;

  return api.get<GetApprovalsResponse>(endpoint, {
    Authorization: `Bearer ${token}`
  });
}

export function createApproval(token: string): Promise<string> {
  return api.post<string>('/approvals', {}, {
    Authorization: `Bearer ${token}`
  });
}

export function actionApproval(
  id: number,
  data: ApprovalActionRequest,
  token: string
): Promise<string> {
  return api.put<string>(`/approvals/${id}/action`, data, {
    Authorization: `Bearer ${token}`
  });
}
