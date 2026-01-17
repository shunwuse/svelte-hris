import type { CursorPaginationResponse } from './api';
import type { ApprovalStatus, ActionableApprovalStatus } from '$lib/domain';

// ==================== Approval ====================

export interface Approval {
  id: number;
  creator_name: string;
  approver_name: string | null;
  status: ApprovalStatus;
}

export interface ListApprovalsRequest {
  cursor?: string;
  limit?: number;
  status?: ApprovalStatus;
}

export type GetApprovalsResponse = CursorPaginationResponse<Approval>;

export interface ApprovalActionRequest {
  action: ActionableApprovalStatus;
}
