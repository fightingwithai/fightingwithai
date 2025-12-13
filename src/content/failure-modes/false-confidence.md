---
title: False Confidence
relatesTo:
  - stochastic-noise
  - context-collapse
---

When the AI is wrong but sounds certain. It presents guesses as facts and treats uncertain interpretations as obvious truths.

## Theory

**Latching onto the wrong thing.** You mention a detail in passing, and the AI treats it as the main problem. You ask about a bug in the payment flow, and it fixates on a typo in a comment.

**Hallucinating details.** The AI invents facts—function names that don't exist, APIs that work differently than it claims, error messages it never saw.

**Treating guesses as facts.** After making an assumption to fill a gap, the AI proceeds as if that assumption were confirmed. Its own speculation becomes "established fact" in subsequent responses.

## Symptoms

- Confident assertions about code it hasn't read
- Solving a problem you didn't describe
- References to things that don't exist
- Doubling down when corrected

## Why It's Dangerous

AI doesn't signal uncertainty the way people do. There's no "I think" or hesitation. Wrong answers sound exactly like right ones. The more fluent the AI, the harder it is to spot errors.

## Mitigation

Verify claims. When the AI says a function exists or an API works a certain way, check. Don't assume confidence means correctness.

Redirect explicitly. When it latches onto the wrong thing: "That's not the issue. The problem is X."

Ask for sources. "Show me where that's defined" or "What file is that in?" forces it to ground claims in reality.
