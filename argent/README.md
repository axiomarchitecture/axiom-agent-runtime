# Argent integration boundary

Argent belongs above the low-level covenant layer.

Planned flow:

```text
Axiom ExecutionPlan
        |
        v
Argent application / actor
        |
        v
Silverscript
        |
        v
Kaspa transaction
```

The first Argent milestone should be a minimal single-agent budget actor.

After that, the architecture can grow toward multiple actors, ICC and
observation-driven coordination.

Argent is intentionally kept behind an adapter boundary because its
toolchain is still evolving.
