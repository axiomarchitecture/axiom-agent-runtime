Alles in README.md löschen und diesen kompletten Inhalt einfügen:

# Axiom Agent Runtime

A small, model-agnostic reference prototype showing the flow:

**TypeSafe / Jev → Axiom → Argent → Silverscript**

The prototype demonstrates how an agent intent can be interpreted into a
structured decision, evaluated against deterministic Axiom policies,
converted into an execution plan, and prepared for an Argent covenant
boundary.

No real transaction is broadcast.

## Architecture

```text
Agent / Human Intent
        |
        v
 TypeSafe / Jev
        |
        | structured decision
        v
   Axiom Core
        |
        +--> validation
        +--> authorization
        +--> policy
        +--> condition
        +--> audit
        |
        v
  Execution Plan
        |
        v
 Argent Execution Boundary
        |
        v
  AxiomAgent.ag
        |
        v
 Argent Compiler
        |
        v
  Silverscript
        |
        v
      Kaspa

The important separation is:

Jev interprets intent.
Axiom applies deterministic rules.
Argent represents the execution boundary.
Silverscript represents the covenant-level contract.
Kaspa is the target execution layer.

AI-generated decisions are never treated as direct authorization for
irreversible execution.

What the prototype demonstrates
1. Intent

Example:

Buy 150 KAS if price is below $0.04
2. TypeSafe / Jev

Jev converts the natural-language intent into a structured decision:

action
asset
amount
currency
condition
confidence

The Axiom runtime does not depend on a specific model implementation.
Jev is an adapter boundary.

3. Axiom Core

Axiom evaluates the decision deterministically.

The current policy checks:

decision validity
allowed assets
maximum spend per transaction
total budget
minimum confidence
price condition

Every evaluation produces an audit trail.

4. Execution Plan

If the decision passes the Axiom rules, the runtime produces a deterministic
ExecutionPlan.

Example:

{
  "status": "APPROVED",
  "action": "BUY",
  "asset": "KAS",
  "amount": 150,
  "currency": "USD"
}

A rejected decision never reaches execution.

5. Argent

The prototype contains an ArgentExecutionAdapter.

It deliberately stops at the execution boundary:

Axiom ExecutionPlan
        |
        v
Argent adapter
        |
        v
Argent covenant

The adapter prepares an execution state but does not broadcast a
transaction.

6. Silverscript

The repository contains a minimal AxiomAgent Argent contract.

The contract models:

agent identity
controller identity
capabilities
budget limit
budget spent
state generation

The contract has a controlled state-transition entrypoint that validates
the next state before replacing the current state.

The contract is compiled with the Argent compiler into a build artifact
containing generated Silverscript.

Example

The demo runs two decisions against the same observed price.

Approved
Buy 150 KAS if price is below $0.04
Observed price: $0.035

Result:

Axiom:   APPROVED
Argent:  READY
Rejected
Buy 500 KAS if price is below $0.04
Observed price: $0.035

The observed price satisfies the condition, but the amount exceeds the
configured maximum spend.

Result:

Axiom:   REJECTED
Argent:  BLOCKED

This demonstrates the important boundary:

Jev proposes
     |
     v
Axiom decides whether the proposal is permitted
     |
     v
Execution plan is created
     |
     v
Argent becomes the execution boundary
Current status
TypeSafe / Jev adapter: working
Real Jev API integration: working
Axiom validation: working
Axiom policy / authorization: working
Conditional evaluation: working
Audit trail: working
Deterministic execution plan: working
Argent execution boundary: implemented
Argent agent contract: implemented
Argent compilation: verified
Generated Silverscript artifact: verified
Real Kaspa transaction: not included
Testnet deployment: not included

This is intentionally a small reference prototype, not a production system.

Run

Install dependencies:

npm install

Type-check the project:

npm run check

Run the demo:

npm run dev

Build:

npm run build

Run the compiled demo:

npm start
TypeSafe API key

The real Jev adapter expects the API key through an environment variable:

TYPESAFE_API_KEY

Do not put API keys in source control.

Argent compilation

The Argent contract can be compiled using the Argent compiler and Cargo:

cargo run --quiet \
  --manifest-path ../argent/Cargo.toml \
  build /workspaces/axiom-agent-runtime/argent/axiom_agent.ag \
  --out /tmp/axiom-agent-build

The resulting artifact contains the compiled contract and generated
Silverscript.

The current prototype does not deploy or broadcast the resulting contract.

Why the boundaries matter

The prototype intentionally separates four concerns:

Intent
  |
  v
Interpretation
  |
  v
Policy
  |
  v
Execution

This means the decision layer can evolve independently from the execution
layer.

Axiom does not need to know how a particular agent model works.

Jev does not receive authority to move funds.

Argent does not need to interpret natural-language intent.

The covenant layer does not need to contain the agent's reasoning.

Each layer has a clear responsibility.

.igra is not required

This prototype does not depend on .igra namespaces.

Protocols such as intent, authorization, escrow, payment and settlement
can later be represented as concrete services or protocol integrations.

For this reference implementation, the core path remains intentionally
small:

Intent
  |
  v
Jev
  |
  v
Axiom
  |
  v
ExecutionPlan
  |
  v
Argent
  |
  v
Silverscript
Vision: Jev Workflows → Axiom Policy

The current prototype intentionally keeps the execution path small.

A natural next step is to evolve the Jev boundary from a single structured
decision into a set of small, composable probabilistic decisions.

The direction is:

                AGENT STATE
                     |
                     v
              TYPE SAFE / JEV
                     |
          +----------+----------+
          |          |          |
          v          v          v
       intent       risk     economic
       choice      score      choice
          |          |          |
          +----------+----------+
                     |
                     v
                  AXIOM
                     |
          deterministic policy
          authorization
          budget
          conditions
          confidence thresholds
          audit
                     |
                     v
              ExecutionPlan
                     |
                     v
                  ARGENT
                     |
                     v
               SILVERSCRIPT

The principle is simple:

Jev provides probabilistic intelligence. Axiom turns that intelligence into deterministic, auditable economic action.

Jev can answer narrow questions such as:

What action is being requested?
Which asset is involved?
Is the intent sufficiently clear?
Does the proposed action match the observed state?
How confident is the decision?

Axiom then applies deterministic rules to those results.

For example:

Jev
 |
 +-- action = BUY
 +-- asset = KAS
 +-- amount = 150
 +-- condition = price < $0.04
 +-- confidence = 0.96
 |
 v
Axiom
 |
 +-- confidence >= required threshold
 +-- asset is allowed
 +-- amount <= per-spend limit
 +-- budget remains available
 +-- condition is satisfied
 |
 v
APPROVED
 |
 v
ExecutionPlan
 |
 v
Argent

This separation is intentional.

Jev is responsible for probabilistic interpretation.

Axiom is responsible for deterministic authorization and economic policy.

Argent and Silverscript are responsible for the execution boundary and
state-transition enforcement.

Future direction

A possible v0.2 could introduce a small Jev workflow layer where several
independent decisions are evaluated and combined by ordinary application
code before entering Axiom.

This could allow Axiom to act as a general decision harness for autonomous
economic workflows without coupling the policy layer to a particular AI
model.

The v0.1 prototype does not implement this workflow layer yet.

Project status

This repository is a technical reference prototype exploring the boundary
between:

agent intent
probabilistic decision-making
deterministic economic policy
accountable execution
covenant-based state transitions

The current implementation is intentionally small.

It is designed to make the architecture concrete and testable without
requiring real funds or a production deployment.

The next architectural step is described above as a vision, not as an
implemented feature.