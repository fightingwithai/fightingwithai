---
title: Context Contamination
relatesTo:
  - context-collapse
---

The AI applies [context](/concepts/context) from one domain where it doesn't belong.

## Symptoms

- A generic utility contains hardcoded values from your specific use case
- Articles written in the same session share phrasing, structure, or concepts that shouldn't overlap
- Conventions from one part of the codebase bleed into unrelated areas
- Output clusters by when you worked on it, not by what it should be

## Theory

Everything in the conversation becomes context for subsequent responses. When you write three articles back-to-back, Article 3 is influenced by Articles 1 and 2—even when the topics are unrelated.

The AI doesn't know what to forget. It sees the full conversation and draws connections. Sometimes those connections help. Often they create subtle contamination: shared metaphors, repeated sentence structures, concepts that don't belong together.

## Example: Batch Writing Articles

It's tempting to write articles one after another in a chain. You're in the zone. Clearing context and reloading [skills](/context-expanding/skills) for each piece feels like friction.

But articles written this way tend to blur. They cluster by *when* you wrote them, not by *what* they cover. An article about testing might accidentally echo language from the authentication article you wrote 20 minutes earlier.

The trade-off is real: reloading a copywriting skill every time you start fresh is annoying. But you get self-contained pieces that don't accidentally mix unrelated concepts.

## How It Differs from Leaky Abstractions

Classic leaky abstractions leak *upward*—implementation details escape through the abstraction layer.

Context contamination goes any direction. The AI might pull context *in* from unrelated parts of the conversation, or push context *out* where it doesn't belong.

## Mitigation

- Start fresh conversations for unrelated work
- Accept the overhead of reloading skills—the isolation is worth it
- Be explicit about scope: "this should be generic, don't reference X"
- Review output for unexpected cross-pollination
