import type { ExecutionPlan } from "../core/types.js";
export interface ExecutionAdapter {
    prepare(plan: ExecutionPlan): Promise<PreparedExecution>;
}
export interface PreparedExecution {
    transactionId: string;
    status: "READY" | "BLOCKED";
    message: string;
}
