import { runSecureAuditWorkflow } from '../src/agents/auditorAgent';
import { AuditRequest } from '../src/domain/entities';

interface Scenario {
  name: string;
  payload: AuditRequest;
  expectedDecision: 'APPROVED' | 'REJECTED';
}

const scenarios: Scenario[] = [
  {
    name: 'Under limit — should APPROVE',
    payload: {
      rawText: 'Wire transfer to vendor ACME Corp',
      amount: 450,
      currency: 'USD',
    },
    expectedDecision: 'APPROVED',
  },
  {
    name: 'Over limit — should REJECT',
    payload: {
      rawText: 'Large capital disbursement request',
      amount: 600,
      currency: 'USD',
    },
    expectedDecision: 'REJECTED',
  },
];

async function runScenario(scenario: Scenario): Promise<boolean> {
  console.log(`\n--- ${scenario.name} ---`);
  console.log('Input:', JSON.stringify(scenario.payload, null, 2));

  const receipt = await runSecureAuditWorkflow('tenant-demo', scenario.payload);
  console.log('Receipt:', JSON.stringify(receipt, null, 2));

  const passed =
    receipt.success === true &&
    receipt.mode === 'MOCK_SANDBOX' &&
    receipt.decision === scenario.expectedDecision;

  console.log(passed ? '✅ PASS' : '❌ FAIL');
  return passed;
}

async function main(): Promise<void> {
  process.env.EXECUTION_MODE = 'MOCK';

  console.log('[try-mock] Starting MOCK sandbox scenarios (no live services)...');

  const results = await Promise.all(scenarios.map(runScenario));
  const allPassed = results.every(Boolean);

  console.log('\n--- Summary ---');
  console.log(`Scenarios passed: ${results.filter(Boolean).length}/${results.length}`);

  if (!allPassed) {
    process.exitCode = 1;
    return;
  }

  console.log('All scenarios passed. Zero service downtime — MOCK mode only.');
}

main().catch((error: unknown) => {
  console.error('[try-mock] Unhandled error:', error);
  process.exitCode = 1;
});
