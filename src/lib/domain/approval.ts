import { APPROVAL_STATUS } from '$lib/constants';

export { APPROVAL_STATUS };

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

export function isApprovalStatus(value: unknown): value is ApprovalStatus {
  return (
    typeof value === 'string' && Object.values(APPROVAL_STATUS).includes(value as ApprovalStatus)
  );
}

export function isActionableApprovalStatus(value: unknown): value is ActionableApprovalStatus {
  return value === APPROVAL_STATUS.APPROVED || value === APPROVAL_STATUS.REJECTED;
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
