---
title: Rewinding / Undo
dependsOn: stop
---

When the AI goes off track, you can rewind to a previous point in the conversation and try again from there.

## When to Rewind

- The AI made a bad decision that's now influencing all subsequent work
- You gave unclear instructions and the AI went the wrong direction
- The conversation got contaminated with incorrect assumptions
- A tool call failed and left garbage in the context

## How It Works

Most AI interfaces let you delete recent messages. When you delete a message, you're removing it from the context window entirely. The AI won't remember it happened.

This is different from saying "undo that" or "forget what I said" - those just add more messages. The context still contains the mistake. Rewinding actually removes it.

## Tool-Specific Approaches

Different coding agents handle rewinding differently:

- **Claude Code**: Press Escape twice to undo the last action and remove it from context
- **GitHub Copilot**: Uses a second buffer for AI changes—the undo button reverts without committing changes to your files
- **Chat interfaces**: Most let you delete or edit previous messages directly

Source control provides another layer. If changes were already written to files, `git checkout` or `git stash` can restore previous state. The AI's context still contains the mistake, but your codebase doesn't.

## Rewind vs. Stop vs. Clear

[[stop|Stop]] prevents bad context from forming. Rewinding removes it after the fact.

[[clear|Clear]] starts fresh. You lose everything.

Rewinding keeps good context and removes bad context. You preserve the useful setup work while discarding the wrong turn.

## The Pattern

1. Notice the AI went wrong
2. Find the last good message
3. Delete everything after it
4. Try again with better instructions

The key insight: context is mutable. You're not stuck with bad context once it's there.
