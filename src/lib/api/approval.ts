import { api } from './client';
import type {
    GetApprovalsResponse
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
