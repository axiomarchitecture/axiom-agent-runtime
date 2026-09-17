import { audit } from "./audit.js";
import { evaluatePolicy } from "./policy.js";
import { validateDecision } from "./validator.js";
import type {
  AxiomRequest,
  EconomicPolicy,
  ExecutionPlan,
  AuditEvent
} from "./types.js";

export interface EvaluationResult {
  plan: ExecutionPlan;
  audit: AuditEvent[];
}

export class AxiomCore {
  constructor(private readonly policy: EconomicPolicy) {}

  evaluate(request: AxiomRequest): EvaluationResult {
    const events: AuditEvent[] = [];

    audit(events, "INTENT", "RECEIVED", `Received ${request.decision.action} intent.`);

    try {
      validateDecision(request.decision);
      audit(events, "VALIDATION", "PASSED", "Decision shape and bounds are valid.");
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown validation error.";
      audit(events, "VALIDATION", "FAILED", reason);
      return this.rejected(request, reason, events);
    }

    const policy = evaluatePolicy(request.decision, this.policy);
    audit(events, "AUTHORIZATION", policy.authorized ? "APPROVED" : "REJECTED", policy.reason);

    if (!policy.authorized) {
      return this.rejected(request, policy.reason, events);
    }

    if (!this.conditionMatches(request)) {
      const reason = "Observed price does not satisfy the Jev condition.";
      audit(events, "CONDITION", "REJECTED", reason);
      return this.rejected(request, reason, events);
    }

    audit(events, "CONDITION", "PASSED", "Observed price satisfies the condition.");
    audit(events, "EXECUTION", "PLANNED", "Execution plan created; no real funds were moved.");

    return {
      plan: {
        status: "APPROVED",
        transactionId: request.transactionId,
        action: request.decision.action,
        asset: request.decision.asset,
        amount: request.decision.amount,
        currency: request.decision.currency,
        reason: "Policy and condition checks passed."
      },
      audit: events
    };
  }

  private conditionMatches(request: AxiomRequest): boolean {
    const { operator, value } = request.decision.condition;
    if (operator === "NONE") return true;
    if (value === undefined) return false;

    switch (operator) {
      case "LT": return request.observedPrice < value;
      case "LTE": return request.observedPrice <= value;
      case "GT": return request.observedPrice > value;
      case "GTE": return request.observedPrice >= value;
      case "EQ": return request.observedPrice === value;
    }
  }

  private rejected(
    request: AxiomRequest,
    reason: string,
    events: AuditEvent[]
  ): EvaluationResult {
    audit(events, "EXECUTION", "REJECTED", reason);

    return {
      plan: {
        status: "REJECTED",
        transactionId: request.transactionId,
        action: request.decision.action,
        asset: request.decision.asset,
        amount: request.decision.amount,
        currency: request.decision.currency,
        reason
      },
      audit: events
    };
  }
}
