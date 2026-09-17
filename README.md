# Axiom Agent Runtime

A small, model-agnostic reference prototype showing the flow:

**TypeSafe / Jev → Axiom → Argent → Silverscript**

The prototype demonstrates how an agent intent can be interpreted into a structured decision, evaluated against deterministic Axiom policies, converted into an execution plan, and prepared for an Argent covenant boundary.

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