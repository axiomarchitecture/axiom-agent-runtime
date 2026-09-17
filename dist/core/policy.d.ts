import type { EconomicPolicy, JevDecision } from "./types.js";
export interface PolicyResult {
    authorized: boolean;
    reason: string;
}
export declare function evaluatePolicy(decision: JevDecision, policy: EconomicPolicy): PolicyResult;
