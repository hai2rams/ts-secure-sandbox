import { AuditRequest, ExecutionReceipt } from '../domain/entities';

export async function runStaticMockWorkflow(tenantId: string, payload: AuditRequest): Promise<ExecutionReceipt> {
  // Simulating small network latency for realism
  await new Promise((resolve) => setTimeout(resolve, 100));

  const isOverLimit = payload.amount > 500;

  return {
    success: true,
    mode: 'MOCK_SANDBOX',
    txHash: '0xmock_gas_burn_' + Math.random().toString(16).substring(2, 10),
    storageKey: `z:${tenantId}:mock_audit:${Date.now()}`,
    decision: isOverLimit ? 'REJECTED' : 'APPROVED',
    reasoning: isOverLimit
      ? 'Mock Check: Request rejected. Amount exceeds the maximum fifty-hundred parameter limit.'
      : 'Mock Check: Request approved. Compliance limits respected.',
    timestamp: new Date().toISOString(),
  };
}
