---
title: Context Contamination
relatesTo:
  - context-collapse
---

The AI applies [context](/concepts/context) from one domain where it doesn't belong.

## Examples

- Writing a generic utility but hardcoding specific values
- Mixing up conventions from different parts of the codebase

## How It Differs from Leaky Abstractions

Classic leaky abstractions leak *upward*—implementation details escape through the abstraction layer.

Context contamination goes any direction. The AI might pull context *in* from unrelated parts of the conversation, or push context *out* where it doesn't belong.

## Mitigation

- Start fresh conversations for unrelated work
- Be explicit about scope: "this should be generic, don't reference X"
- Improve separation of concerns, and add automated tests.
