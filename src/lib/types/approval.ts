import type { CursorPaginationResponse } from './api';

// ==================== Approval ====================

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Approval {
  id: number;
  creator_name: string;
  approver_name: string | null;
  status: ApprovalStatus;
}

export type GetApprovalsResponse = CursorPaginationResponse<Approval>;

export interface ApprovalActionRequest {
  id: number;
  action: 'APPROVED' | 'REJECTED';
}
