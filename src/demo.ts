import { AxiomCore } from "./core/core.js";
import { RealJevAdapter } from "./jev/real.js";
import { ArgentExecutionAdapter } from "./execution/argent.js";

const jev = new RealJevAdapter({
  apiKey: process.env.TYPESAFE_API_KEY ?? "",
});

const axiom = new AxiomCore({
  maxPerSpend: 200,
  budgetTotal: 1000,
  budgetSpent: 0,
  allowedAssets: ["KAS"],
  minimumConfidence: 0.90,
});

const argent = new ArgentExecutionAdapter();

function section(title: string): void {
  console.log(`\n${"═".repeat(56)}`);
  console.log(` ${title}`);
  console.log(`${"═".repeat(56)}`);
}

async function run(input: string, observedPrice: number): Promise<void> {
  section("AXIOM AGENT RUNTIME");

  console.log("\nINTENT");
  console.log(`> ${input}`);

  const decision = await jev.decide(input);

  console.log("\nTYPEsafe / JEV");
  console.log("✓ Structured decision received");
  console.log(JSON.stringify(decision, null, 2));

  const result = axiom.evaluate({
    transactionId: crypto.randomUUID(),
    actor: {
      id: "demo-agent",
      type: "agent",
    },
    decision,
    observedPrice,
    priceSource: "demo",
  });

  console.log("\nAXIOM");

  for (const event of result.audit) {
    if (event.stage === "INTENT") continue;

    const symbol = event.status === "PASSED" || event.status === "APPROVED"
      ? "✓"
      : event.status === "FAILED" || event.status === "REJECTED"
        ? "✗"
        : "•";

    console.log(`${symbol} ${event.stage}: ${event.message}`);
  }

  console.log("\nAUTHORIZATION");
  console.log(
    result.plan.status === "APPROVED"
      ? "✓ APPROVED"
      : "✗ REJECTED"
  );

  console.log("\nEXECUTION PLAN");
  console.log(JSON.stringify(result.plan, null, 2));

  const prepared = await argent.prepare(result.plan);

  console.log("\nARGENT");
  console.log(
    prepared.status === "READY"
      ? "✓ READY"
      : "✗ BLOCKED"
  );
  console.log(prepared.message);

  console.log("\nSILVERSCRIPT / ON-CHAIN");
  console.log("✓ Argent contract boundary compiled");
  console.log("○ Transaction not broadcast");
}

await run(
  "Buy 150 KAS if price is below $0.04",
  0.035
);

await run(
  "Buy 500 KAS if price is below $0.04",
  0.035
);