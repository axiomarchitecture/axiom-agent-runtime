export class MockJevAdapter {
    async decide(input) {
        const lower = input.toLowerCase();
        const action = lower.includes("sell") ? "SELL" :
            lower.includes("pay") ? "PAY" :
                lower.includes("transfer") ? "TRANSFER" :
                    "BUY";
        const asset = lower.includes("kas") ? "KAS" : "UNKNOWN";
        const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:KAS|kas)/);
        const amount = amountMatch ? Number(amountMatch[1]) : 0;
        const conditionMatch = input.match(/(?:below|under|less than|<)\s*\$?\s*(\d+(?:\.\d+)?)/i);
        return {
            action,
            asset,
            amount,
            currency: "USD",
            condition: conditionMatch
                ? { operator: "LT", value: Number(conditionMatch[1]) }
                : { operator: "NONE" },
            confidence: 0.97,
            rationale: "Mock adapter parsed the demo instruction."
        };
    }
}
