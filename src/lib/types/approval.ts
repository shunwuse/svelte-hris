// ==================== Approval ====================

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Approval {
  id: number;
  creator_name: string;
  approver_name: string | null;
  status: ApprovalStatus;
}

export type GetApprovalsResponse = Approval[];
