import type { JevDecision } from "../core/types.js";
export interface JevAdapter {
    decide(input: string): Promise<JevDecision>;
}
