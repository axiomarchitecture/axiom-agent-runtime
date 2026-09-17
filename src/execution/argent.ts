import type { ExecutionAdapter, PreparedExecution } from "./types.js";
import type { ExecutionPlan } from "../core/types.js";

export class ArgentExecutionAdapter implements ExecutionAdapter {
  async prepare(plan: ExecutionPlan): Promise<PreparedExecution> {
    if (plan.status !== "APPROVED") {
      return {
        transactionId: plan.transactionId,
        status: "BLOCKED",
        message: "Rejected plans cannot be sent to Argent."
      };
    }

    return {
      transactionId: plan.transactionId,
      status: "READY",
      message: "Argent execution plan prepared. No transaction was broadcast."
    };
  }
}