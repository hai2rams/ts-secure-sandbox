import { z } from 'zod';

export const AuditRequestSchema = z.object({
  rawText: z.string(),
  amount: z.number(),
  currency: z.string(),
});

export type AuditRequest = z.infer<typeof AuditRequestSchema>;

export interface ExecutionReceipt {
  success: boolean;
  mode: 'MOCK_SANDBOX' | 'LIVE_TEE_ENCLAVE';
  txHash: string;
  storageKey: string;
  decision: 'APPROVED' | 'REJECTED';
  reasoning: string;
  timestamp: string;
}
