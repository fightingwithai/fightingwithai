---
title: Pipelines
---

Deterministic workflows that execute without model negotiation. The formatter runs before code hits disk. The linter runs after. No arguing required.

## The Problem with Instructions

Telling the model "always run the formatter" doesn't guarantee it happens. The model might:

- Forget
- Decide it's unnecessary this time
- Get distracted by something else
- Require multiple reminders

Instructions are probabilistic. Pipelines are deterministic.

## What Pipelines Look Like

A pipeline chains steps that execute automatically:

```
Code written → Formatter runs → Linter checks → Tests run → Code committed
```

Each step triggers the next. The model doesn't decide whether to run them—they just run.

## Implementation Options

**Tool-level hooks:**
Some tools (Claude Code, Cursor) support hooks that fire on events like "file saved" or "tool completed." These are primitives for building pipelines.

**Agent orchestration:**
A parent agent spawns child agents for specific tasks, reviews their output, and routes work based on results. The parent enforces the pipeline.

**External automation:**
CI/CD, pre-commit hooks, file watchers. The pipeline lives outside the AI entirely.

## Why This Matters

The goal is removing negotiation overhead. Compare:

**Without pipelines:**
> "Run the formatter"
> "I've made the changes"
> "You didn't run the formatter"
> "Let me run it now..."

**With pipelines:**
> Code written → formatter runs automatically

The second version is faster and more reliable.

## Designing Pipelines

Good candidates for automation:

| Step | Trigger | Why Automate |
|------|---------|--------------|
| Formatting | File write | Never argue about style |
| Linting | File write | Catch issues immediately |
| Type checking | File write | Don't wait for build |
| Tests | Before commit | Gate broken code |
| Cleanup audit | Feature complete | Don't forget debt |

Bad candidates (require judgment):

- Architectural decisions
- User-facing copy
- API design choices

## The Spectrum

From most manual to most automated:

1. **Instructions** — "Remember to run X"
2. **Reminders** — Agent prompts itself after certain events
3. **Hooks** — External triggers fire on events
4. **Full pipelines** — Chained deterministic execution

Move right on this spectrum for repetitive, mechanical tasks. Stay left for tasks requiring judgment.
