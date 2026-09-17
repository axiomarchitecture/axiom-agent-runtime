import { AxiomCore } from "./core/core.js";
import { MockJevAdapter } from "./jev/mock.js";
import { MockExecutionAdapter } from "./execution/mock.js";
const jev = new MockJevAdapter();
const core = new AxiomCore({
    maxPerSpend: 200,
    budgetTotal: 1000,
    budgetSpent: 0,
    allowedAssets: ["KAS"],
    minimumConfidence: 0.90
});
const execution = new MockExecutionAdapter();
async function run(input, observedPrice) {
    console.log("\n--- INPUT ---");
    console.log(input);
    const decision = await jev.decide(input);
    console.log("\nJEV DECISION");
    console.log(JSON.stringify(decision, null, 2));
    const result = core.evaluate({
        transactionId: crypto.randomUUID(),
        actor: { id: "demo-agent", type: "agent" },
        decision,
        observedPrice,
        priceSource: "demo"
    });
    console.log("\nAXIOM PLAN");
    console.log(JSON.stringify(result.plan, null, 2));
    const prepared = await execution.prepare(result.plan);
    console.log("\nEXECUTION");
    console.log(JSON.stringify(prepared, null, 2));
}
await run("Buy 150 KAS if price is below $0.04", 0.035);
await run("Buy 500 KAS if price is below $0.04", 0.035);
