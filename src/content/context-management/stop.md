---
title: Stop
dependsOn: compact
---

Interrupt generation before the AI finishes. The partial output stays in context, but nothing more gets added.

## When to Stop

**Catch a working state.** The AI oscillates between working and broken versions—fix something, break something else, fix that, break the first thing. Stop the moment it produces a working version.

**Prevent contamination.** The AI starts down an obviously wrong path. Every token it generates becomes context that influences what follows. Stop early before the bad approach gets established.

**Save time.** The output is clearly wrong or irrelevant. No need to wait for completion when you already know you'll discard it.

## Stop vs. Rewind

Stop prevents bad context from forming. [Rewind](/context-management/rewinding) removes bad context after the fact.

Stopping is faster—you intervene in real-time. But you have to be watching. Rewinding works when you notice the problem later.

## Stop and Steer

Stop pairs naturally with [steering](/workflow-guardrails/steering). Stop halts the wrong direction. Steering redirects toward the right one.

The sequence: stop generation, then send a follow-up message that clarifies what you actually want. The AI resumes with your correction as the most recent context.

Without the stop, your steering message competes with whatever the AI just produced. With the stop, your correction has less noise to overcome.

## The Partial Output Problem

When you stop mid-generation, you get a partial response. This might be:

- **Usable as-is** - You stopped at the right moment
- **Incomplete but salvageable** - Copy what you need, then [clear](/context-management/clear) or [rewind](/context-management/rewinding)
- **Garbage** - Rewind to before the partial output

The partial output is now in context either way. If it's not useful, remove it.
