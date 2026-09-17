import type { ExecutionAdapter, PreparedExecution } from "./types.js";
import type { ExecutionPlan } from "../core/types.js";
export declare class MockExecutionAdapter implements ExecutionAdapter {
    prepare(plan: ExecutionPlan): Promise<PreparedExecution>;
}
