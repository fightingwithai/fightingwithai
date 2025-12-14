---
title: Context Collapse
relatesTo:
  - stochastic-noise
  - spiraling
---

When the AI lacks the information it needs to do the job. It's working blind, so its actions miss the mark.

## Theory

**Missing context.** The AI doesn't have information it needs. You're asking about a bug, but it hasn't seen the error message. You want changes to a file it hasn't read.

**Lost runtime state.** The AI spawns processes but doesn't track them. It forgets what's running, which ports are bound, which PIDs to kill.

**Drowned context.** Noise buries the signal. After enough retries, guesses, and failed attempts, the original goal gets pushed out of effective attention.

**Ambiguous names.** This website once had both a "tools" page explaining tool calling and a "tools" collection listing coding assistants. "Edit the tools page" was ambiguous for AI and humans alike. We renamed them to "tool use" and "coding assistants"—clearer for everyone.

## Symptoms

- Actions that don't relate to the actual task
- Ignoring key details you provided earlier
- Solving a problem you didn't ask about

## Mitigation

For missing context: give it what it needs. Point to the file, paste the error, show the output.

For drowned context: start fresh. Summarize where you are and what you need, or begin a new conversation.

For ambiguous names: rename things. If disambiguation helps the AI, it probably helps your users too.
