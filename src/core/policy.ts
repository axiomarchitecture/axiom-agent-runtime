import type { EconomicPolicy, JevDecision } from "./types.js";

export interface PolicyResult {
  authorized: boolean;
  reason: string;
}

export function evaluatePolicy(
  decision: JevDecision,
  policy: EconomicPolicy
): PolicyResult {
  if (!Number.isFinite(decision.amount) || decision.amount <= 0) {
    return { authorized: false, reason: "Amount must be a positive finite number." };
  }

  if (decision.amount > policy.maxPerSpend) {
    return { authorized: false, reason: "Amount exceeds maxPerSpend." };
  }

  const budgetRemaining = policy.budgetTotal - policy.budgetSpent;
  if (decision.amount > budgetRemaining) {
    return { authorized: false, reason: "Amount exceeds remaining budget." };
  }

  if (!policy.allowedAssets.includes(decision.asset)) {
    return { authorized: false, reason: `Asset ${decision.asset} is not allowed by policy.` };
  }

  if (
    !Number.isFinite(decision.confidence) ||
    decision.confidence < policy.minimumConfidence
  ) {
    return { authorized: false, reason: "Jev confidence is below the configured threshold." };
  }

  return { authorized: true, reason: "Policy checks passed." };
}
