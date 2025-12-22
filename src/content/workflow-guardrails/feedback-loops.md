---
title: Feedback Loops
---

Feedback loops give the model ground truth. Without them, it's guessing. With them, it can verify its work and course-correct.

## Why Loops Matter

This is why models can run for 4+ hours porting code from one language to another when the library has good unit tests. The tests tell the model whether each piece works. It doesn't have to guess—it runs the test and knows.

## Types of Feedback

**Tests:** Unit tests provide the tightest feedback. When a model is spiraling on an end-to-end test, the fix is often to write smaller unit tests. Verify each piece of functionality in isolation. Get traction on the units, then return to the end-to-end test once the pieces work.

**Lint rules:** A lint rule deterministically flags issues until they're fixed. The model can run the linter, see what's still wrong, and keep going until it's clean.

**Type checkers:** TypeScript is a feedback loop. The model runs the type checker, sees the errors, and fixes them. No guessing whether the types are right.

**Deterministic validation tools:** If you ask a model to update all the modules, it might miss some. But if you have a tool that validates which modules were changed and fails deterministically if any were missed, the model can run that tool and know whether it's done.

## The Pattern

Give the model something that tells it whether it succeeded. The more deterministic and specific the feedback, the more effectively the model can work.
