/**
 * Canonical lifecycle-state union shared by AgentStep, ToolCallCard,
 * TraceTree (SpanCard), and RunStatusBadge.
 *
 * Legacy string aliases accepted at runtime by normalizeOperationStatus():
 *   'error'    → 'failed'
 *   'success'  → 'completed'
 *   'complete' → 'completed'
 */
export type OperationStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'queued'
  | 'cancelled'
  | 'skipped';

export function normalizeOperationStatus(status: OperationStatus | string): OperationStatus {
  if (status === 'error') return 'failed';
  if (status === 'success' || status === 'complete') return 'completed';
  return status as OperationStatus;
}
