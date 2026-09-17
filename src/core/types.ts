export type ActorType = "human" | "agent" | "service";
export type Action = "BUY" | "SELL" | "PAY" | "TRANSFER";
export type ConditionOperator = "LT" | "LTE" | "GT" | "GTE" | "EQ" | "NONE";

export interface Actor {
  id: string;
  type: ActorType;
}

export interface PriceCondition {
  operator: ConditionOperator;
  value?: number;
}

export interface JevDecision {
  action: Action;
  asset: string;
  amount: number;
  currency: string;
  condition: PriceCondition;
  confidence: number;
  rationale?: string;
}

export interface EconomicPolicy {
  maxPerSpend: number;
  budgetTotal: number;
  budgetSpent: number;
  allowedAssets: string[];
  minimumConfidence: number;
}

export interface AxiomRequest {
  transactionId: string;
  actor: Actor;
  decision: JevDecision;
  observedPrice: number;
  priceSource: string;
}

export type DecisionStatus = "APPROVED" | "REJECTED";

export interface ExecutionPlan {
  status: DecisionStatus;
  transactionId: string;
  action: Action;
  asset: string;
  amount: number;
  currency: string;
  reason: string;
}

export interface AuditEvent {
  stage: string;
  status: string;
  timestamp: string;
  message: string;
}
