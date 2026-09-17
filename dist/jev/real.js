/**
 * Real Jev adapter boundary.
 *
 * The exact HTTP endpoint, authentication mechanism and request/response
 * contract must be filled in from Jev's current API documentation.
 *
 * We intentionally do not invent those details.
 */
export class RealJevAdapter {
    config;
    constructor(config) {
        this.config = config;
    }
    async decide(_input) {
        if (!this.config.baseUrl || !this.config.apiKey) {
            throw new Error("RealJevAdapter is not configured. Set JEV_BASE_URL and JEV_API_KEY after confirming Jev's API contract.");
        }
        throw new Error("RealJevAdapter is intentionally not guessing Jev's API. Add the documented request/response mapping here.");
    }
}
