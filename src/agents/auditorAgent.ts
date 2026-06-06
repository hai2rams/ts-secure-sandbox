import { AuditRequest, ExecutionReceipt } from '../domain/entities';
import { runStaticMockWorkflow } from './mockWorkflow';
import { runLiveT3GeminiWorkflow } from './liveWorkflow';

export async function runSecureAuditWorkflow(tenantId: string, payload: AuditRequest): Promise<ExecutionReceipt> {
  // Read our environmental flag switch
  const mode = process.env.EXECUTION_MODE || 'MOCK';

  if (mode === 'MOCK') {
    console.log(`[Router] 🟢 Executing inside FREE LOCAL SANDBOX mode. Zero financial impact.`);
    return await runStaticMockWorkflow(tenantId, payload);
  } else {
    console.log(`[Router] ⚠️ WARNING: Running inside LIVE TEE mode. Active network connection initiated.`);
    return await runLiveT3GeminiWorkflow(tenantId, payload);
  }
}
