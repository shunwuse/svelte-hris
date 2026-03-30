export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export type ApprovalStatus = (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];
export type ActionableApprovalStatus = Exclude<ApprovalStatus, typeof APPROVAL_STATUS.PENDING>;

export type ApprovalStatusBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface ApprovalStatusLabels {
  pending: string;
  approved: string;
  rejected: string;
}

export function getApprovalStatusVariant(status: ApprovalStatus): ApprovalStatusBadgeVariant {
  switch (status) {
    case APPROVAL_STATUS.APPROVED:
      return 'default';
    case APPROVAL_STATUS.REJECTED:
      return 'destructive';
    case APPROVAL_STATUS.PENDING:
    default:
      return 'secondary';
  }
}

export function formatApprovalStatus(status: ApprovalStatus, labels: ApprovalStatusLabels): string {
  switch (status) {
    case APPROVAL_STATUS.PENDING:
      return labels.pending;
    case APPROVAL_STATUS.APPROVED:
      return labels.approved;
    case APPROVAL_STATUS.REJECTED:
      return labels.rejected;
    default:
      return status;
  }
}

export function getApprovalStatusColorClass(status: ApprovalStatus): string {
  switch (status) {
    case APPROVAL_STATUS.APPROVED:
      return 'bg-green-100 text-green-800';
    case APPROVAL_STATUS.REJECTED:
      return 'bg-red-100 text-red-800';
    case APPROVAL_STATUS.PENDING:
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}
