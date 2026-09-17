export function validateDecision(decision) {
    if (!decision || typeof decision !== "object") {
        throw new Error("Jev decision is missing.");
    }
    const actions = ["BUY", "SELL", "PAY", "TRANSFER"];
    if (!actions.includes(decision.action)) {
        throw new Error("Invalid action.");
    }
    if (typeof decision.asset !== "string" || decision.asset.length === 0) {
        throw new Error("Invalid asset.");
    }
    if (typeof decision.amount !== "number" || !Number.isFinite(decision.amount)) {
        throw new Error("Invalid amount.");
    }
    if (typeof decision.currency !== "string" || decision.currency.length === 0) {
        throw new Error("Invalid currency.");
    }
    if (decision.confidence < 0 || decision.confidence > 1) {
        throw new Error("Confidence must be between 0 and 1.");
    }
    if (decision.condition.operator !== "NONE" && decision.condition.value === undefined) {
        throw new Error("A non-NONE condition requires a value.");
    }
}
