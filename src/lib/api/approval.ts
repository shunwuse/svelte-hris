import { api } from './client';
import type {
    GetApprovalsResponse
} from '$lib/types';

export function getApprovals(token: string): Promise<GetApprovalsResponse> {
  return api.get<GetApprovalsResponse>('/approvals', {
    Authorization: `Bearer ${token}`
  });
}
