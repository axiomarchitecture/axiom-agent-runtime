import type { ExecutionAdapter, PreparedExecution } from "./types.js";
import type { ExecutionPlan } from "../core/types.js";

export class MockExecutionAdapter implements ExecutionAdapter {
  async prepare(plan: ExecutionPlan): Promise<PreparedExecution> {
    if (plan.status !== "APPROVED") {
      return {
        transactionId: plan.transactionId,
        status: "BLOCKED",
        message: "Rejected plans cannot be executed."
      };
    }

    return {
      transactionId: plan.transactionId,
      status: "READY",
      message: "Execution prepared only. No real transaction was broadcast."
    };
  }
}
