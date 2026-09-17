# Axiom Agent Runtime

> **Jev proposes. Axiom authorizes. Argent enforces.**

A small reference prototype exploring:

**TypeSafe / Jev → Axiom → Argent → Silverscript → Kaspa**

```text
Agent Intent
     ↓
TypeSafe / Jev
     ↓
   Axiom
     ↓
ExecutionPlan
     ↓
  Argent
     ↓
Silverscript
     ↓
   Kaspa
Example
"Buy 150 KAS if price < $0.04"

Jev      → structured decision
Axiom    → deterministic policy
Argent   → execution boundary

APPROVED → READY

If the policy is violated:

REJECTED → BLOCKED

Prototype
Real TypeSafe / Jev API
Deterministic Axiom policy
Audit trail
Argent execution boundary
AxiomAgent → Silverscript compilation

No real funds. No broadcast. No testnet.

Jev → Axiom → Argent → Silverscript
npm install
npm run check
npm run dev

Requires TYPESAFE_API_KEY.
