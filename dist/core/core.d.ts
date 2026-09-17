import type { AxiomRequest, EconomicPolicy, ExecutionPlan, AuditEvent } from "./types.js";
export interface EvaluationResult {
    plan: ExecutionPlan;
    audit: AuditEvent[];
}
export declare class AxiomCore {
    private readonly policy;
    constructor(policy: EconomicPolicy);
    evaluate(request: AxiomRequest): EvaluationResult;
    private conditionMatches;
    private rejected;
}
