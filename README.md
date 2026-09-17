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
```
Kaspa
Structured Agent Decision
Jev
├─ action      BUY
├─ asset       KAS
├─ amount      150
├─ currency    USD
├─ condition   price < $0.04
└─ confidence  0.95

Jev interprets intent and produces structured variables.

Axiom turns those variables into deterministic, auditable authorization.

Jev decision
     ↓
Axiom policy
     ↓
APPROVED → READY

If a rule is violated:

REJECTED → BLOCKED
What it demonstrates

Shows how a structured decision from Jev can be safely authorized and prepared for covenant-native execution on Kaspa.

The goal is a simple boundary between probabilistic agent intelligence and deterministic economic execution.

Prototype
Real TypeSafe / Jev API
Structured decision parsing
Deterministic policy
Budget & condition checks
Audit trail
Argent execution boundary
AxiomAgent → Silverscript compilation

Working reference prototype. Real Jev is connected. Argent/Silverscript execution is prepared but not yet broadcasting.

Run
npm install
npm run check
npm run dev

Requires TYPESAFE_API_KEY.

Probabilistic intelligence
            ↓
Deterministic authorization
            ↓
Constrained execution

Jev → Axiom → Argent → Silverscript
