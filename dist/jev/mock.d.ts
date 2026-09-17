import type { JevAdapter } from "./adapter.js";
import type { JevDecision } from "../core/types.js";
export declare class MockJevAdapter implements JevAdapter {
    decide(input: string): Promise<JevDecision>;
}
