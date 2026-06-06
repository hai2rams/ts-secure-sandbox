import { AuditRequest, ExecutionReceipt } from '../domain/entities';
import { evaluateComplianceRules } from '../core/complianceEngine';

function buildReceipt(
  tenantId: string,
  decision: ExecutionReceipt['decision'],
  reasoning: string
): ExecutionReceipt {
  return {
    success: true,
    mode: 'MOCK_SANDBOX',
    txHash: '0xmock_gas_burn_' + Math.random().toString(16).substring(2),
    storageKey: `z:${tenantId}:mock_audit:${Date.now()}`,
    decision,
    reasoning,
    timestamp: new Date().toISOString()
  };
}

export async function runStaticMockWorkflow(
  tenantId: string,
  payload: AuditRequest
): Promise<ExecutionReceipt> {
  // Simulate short network latency
  await new Promise((resolve) => setTimeout(resolve, 100));

  // CRITICAL TRIGGER: Execute the cascading compliance rules engine
  const assessment = evaluateComplianceRules(tenantId, payload);

  // Short-circuit immediately if validation fails
  if (!assessment.passed) {
    console.log(`[Router] ❌ Compliance Violation flagged for ${tenantId}: ${assessment.reason}`);
    return buildReceipt(tenantId, 'REJECTED', assessment.reason);
  }

  console.log(`[Router] 🟢 Local deterministic compliance rules passed for ${tenantId}.`);
  return buildReceipt(tenantId, 'APPROVED', assessment.reason);
}
