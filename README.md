# Axiom Agent Runtime

A small, model-agnostic runtime for autonomous-agent decisions.

## Architecture

```text
USER / AGENT GOAL
       |
       v
      JEV
       |
       | structured decision
       v
 AXIOM CORE
       |
       +--> validation
       +--> authorization
       +--> policy
       +--> audit
       |
       v
 EXECUTION PLAN
       |
       +------------------+
       |                  |
       v                  v
 Silverscript           Argent
       |                  |
       +--------+---------+
                |
                v
              Kaspa
```

The MVP deliberately keeps AI decision-making separate from irreversible execution.

## Current status

- Mock Jev adapter: included
- Real Jev adapter boundary: included, API details intentionally left configurable
- Axiom policy/authorization: included
- JSON Schema: included
- Deterministic execution plan: included
- Silverscript contract skeleton: included
- Argent integration boundary: documented
- Real Kaspa transaction execution: NOT included

## Run

```bash
npm install
npm run check
npm run dev
```

Build and run:

```bash
npm run build
npm start
```

## Safety model

Jev may propose a decision, but it cannot directly authorize money movement.

The Axiom Core validates the decision against deterministic policy rules before producing an execution plan.

Do not put API keys in source control. Use environment variables.

## Next step

Replace `MockJevAdapter` with the real Jev adapter once the exact Jev API documentation or example request/response is available.
