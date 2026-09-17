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

async function run(input: string, observedPrice: number): Promise<void> {
  console.log("\n========================================");
  console.log("AXIOM AGENT RUNTIME");
  console.log("========================================");

  console.log("\nINTENT");
  console.log(input);

  const decision = await jev.decide(input);

  console.log("\nTYPEsafe / JEV");
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
  console.log(JSON.stringify(result.plan, null, 2));

  console.log("\nAUDIT");
  console.log(JSON.stringify(result.audit, null, 2));

  const prepared = await argent.prepare(result.plan);

  console.log("\nARGENT");
  console.log(JSON.stringify(prepared, null, 2));

  console.log("\nSILVERSCRIPT / ON-CHAIN");
  console.log("Argent contract is compiled separately.");
  console.log("No real transaction was broadcast.");
}

await run(
  "Buy 150 KAS if price is below $0.04",
  0.035
);

await run(
  "Buy 500 KAS if price is below $0.04",
  0.035
);