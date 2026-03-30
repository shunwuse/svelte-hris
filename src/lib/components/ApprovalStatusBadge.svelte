<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import type { ApprovalStatus } from '$lib/domain';
  import { formatApprovalStatus, getApprovalStatusVariant } from '$lib/domain';
  import * as t from '$paraglide/messages';

  interface Props {
    status: ApprovalStatus;
  }

  let { status }: Props = $props();

  const label = $derived(
    formatApprovalStatus(status, {
      pending: t['approvals.status_pending'](),
      approved: t['approvals.status_approved'](),
      rejected: t['approvals.status_rejected']()
    })
  );
</script>

<Badge variant={getApprovalStatusVariant(status)}>{label}</Badge>
