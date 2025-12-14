---
title: Chat Loops
dependsOn: autocomplete
---

Chat interfaces (ChatGPT, Claude) let you have a conversation with an LLM.

## The Loop

Unlike autocomplete, chat involves multiple turns:

1. You send a message
2. The model generates a response
3. You read and respond
4. Repeat

Each exchange extends the [context](/concepts/context). The model sees the full conversation history when generating each response.

## Text In, Text Out

Chat generates text—code snippets, explanations, suggestions. It doesn't act on your environment. You copy the code, paste it into your editor, and run commands yourself.

[Agent loops](/concepts/agent-loops) add the ability to take actions: reading files, writing changes, running commands. Chat stays in the realm of text.
