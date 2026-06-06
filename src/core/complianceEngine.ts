import { AuditRequest } from '../domain/entities';

const KEYWORD_BLACKLIST = ['sanctions', 'offshore', 'shell company', 'money laundering'];

const TENANT_TIER_LIMITS = {
  STANDARD: 500,
  PREMIUM: 5000,
  ENTERPRISE: 50000,
} as const;

type TenantTier = keyof typeof TENANT_TIER_LIMITS;

export interface ComplianceEvaluation {
  passed: boolean;
  reason: string;
}

function resolveTenantTier(tenantId: string): TenantTier {
  if (tenantId.startsWith('tenant-enterprise-')) {
    return 'ENTERPRISE';
  }

  if (tenantId.startsWith('tenant-premium-')) {
    return 'PREMIUM';
  }

  return 'STANDARD';
}

export function evaluateComplianceRules(tenantId: string, payload: AuditRequest): ComplianceEvaluation {
  const normalizedText = payload.rawText.toLowerCase();

  const matchedKeyword = KEYWORD_BLACKLIST.find((keyword) => normalizedText.includes(keyword));
  if (matchedKeyword) {
    return {
      passed: false,
      reason: `Compliance Check: Request rejected. Blacklisted keyword detected: "${matchedKeyword}".`,
    };
  }

  const tier = resolveTenantTier(tenantId);
  const limit = TENANT_TIER_LIMITS[tier];

  if (payload.amount > limit) {
    return {
      passed: false,
      reason: `Compliance Check: Request rejected. Amount ${payload.amount} exceeds ${tier} tier limit of ${limit}.`,
    };
  }

  return {
    passed: true,
    reason: 'Compliance Check: All rules passed.',
  };
}
