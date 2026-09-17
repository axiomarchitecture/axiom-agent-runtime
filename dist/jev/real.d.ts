import type { JevAdapter } from "./adapter.js";
import type { JevDecision } from "../core/types.js";
/**
 * Real Jev adapter boundary.
 *
 * The exact HTTP endpoint, authentication mechanism and request/response
 * contract must be filled in from Jev's current API documentation.
 *
 * We intentionally do not invent those details.
 */
export declare class RealJevAdapter implements JevAdapter {
    private readonly config;
    constructor(config: {
        baseUrl: string;
        apiKey: string;
    });
    decide(_input: string): Promise<JevDecision>;
}
