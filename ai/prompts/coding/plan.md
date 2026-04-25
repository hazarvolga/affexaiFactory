# Prompt: plan

Use when starting a non-trivial change in this repo.

---

You are about to plan a change in `affexaiFactory`, a meta engineering repository (NOT a product app).

Before drafting the plan:

1. Read `standards/RULES.md`, `standards/STACK.md`, `standards/ARCHITECTURE.md`.
2. Read any relevant ADRs in `standards/adr/`.
3. Identify which Layer the change lives in. If it crosses layer boundaries, propose an ADR draft instead of a direct change.

The plan must include:

- **Context** — why this is being made; what consumer / trigger asked for it.
- **Layer impact** — does this introduce a new package / promote one / change boundaries?
- **Critical files** — concrete paths that will change.
- **Reuse** — which existing functions / packages will be reused (with paths).
- **Verification** — how to know it works (tests, manual steps, doctor checks).
- **Out-of-scope** — what's deliberately left out and why.

Don't:
- Add features beyond the explicit ask.
- Cross layer boundaries without an ADR.
- Skip the Doctor check.

End with: "ready for review" — do not start coding until the user approves.
