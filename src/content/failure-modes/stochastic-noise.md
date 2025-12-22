---
title: Stochastic Noise
relatesTo:
  - context-collapse
  - spiraling
---

Random, speculative actions that pollute the context without solving the problem.

## What It Looks Like

- Making speculative edits to code that might be related
- Creating files "just in case" they're needed
- Changing things that were already working
- Re-running the same commands hoping for different results
- Adding defensive code, logging, or error handling "to help debug"

## Theory

LLMs sample from probability distributions. When uncertain, they don't pause—they act. Something plausible is always available, so something gets done. Action feels like progress even when it isn't.

## The Damage

Every speculative action adds to the context. Code changes pile up. Files multiply. The original problem gets buried under "attempts." Even if individual actions are harmless, the cumulative noise causes [[context-collapse]].

## Mitigation

Constrain the action space. Give specific instructions. When you see speculative edits, stop and redirect before the context fills with junk.
