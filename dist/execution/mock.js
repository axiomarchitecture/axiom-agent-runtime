export class MockExecutionAdapter {
    async prepare(plan) {
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
