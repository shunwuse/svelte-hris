import { api } from './client';
import type {
    GetApprovalsResponse,
    ApprovalActionRequest
} from '$lib/types';

export function getApprovals(token: string): Promise<GetApprovalsResponse> {
  return api.get<GetApprovalsResponse>('/approvals', {
    Authorization: `Bearer ${token}`
  });
}

export function createApproval(token: string): Promise<string> {
  return api.post<string>('/approvals', {}, {
    Authorization: `Bearer ${token}`
  });
}

export function actionApproval(
  data: ApprovalActionRequest,
  token: string
): Promise<string> {
  return api.put<string>('/approvals/action', data, {
    Authorization: `Bearer ${token}`
  });
}
