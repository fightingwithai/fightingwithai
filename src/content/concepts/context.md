---
title: Context
dependsOn: large-language-models
---

The context window is finite. Everything the AI knows about your conversation has to fit inside it.

## What's in the Context Window?

- [System prompt](/patterns/system-prompts)
- [Tools](/concepts/tools) (file ops, terminal, LSP, search)
- MCP servers you've connected
- [Skills](/patterns/skills) loaded on startup
- Conversation history (messages, tool calls, results)

## Why This Matters

As context fills up, signal competes with noise. Important details get buried. See [context collapse](/failure-modes/context-collapse).

Context from one domain can also contaminate another. See [context contamination](/failure-modes/context-contamination).
