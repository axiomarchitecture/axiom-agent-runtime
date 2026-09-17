import { strict as assert } from "node:assert";
import { evaluatePolicy } from "../src/core/policy.js";

const policy = {
  maxPerSpend: 200,
  budgetTotal: 1000,
  budgetSpent: 0,
  allowedAssets: ["KAS"],
  minimumConfidence: 0.9
};

const valid = {
  action: "BUY" as const,
  asset: "KAS",
  amount: 100,
  currency: "USD",
  condition: { operator: "NONE" as const },
  confidence: 0.99
};

assert.equal(evaluatePolicy(valid, policy).authorized, true);

assert.equal(
  evaluatePolicy({ ...valid, amount: 201 }, policy).authorized,
  false
);

assert.equal(
  evaluatePolicy({ ...valid, asset: "BTC" }, policy).authorized,
  false
);

assert.equal(
  evaluatePolicy({ ...valid, confidence: 0.5 }, policy).authorized,
  false
);

console.log("policy tests passed");
