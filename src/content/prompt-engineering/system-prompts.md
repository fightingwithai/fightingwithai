---
title: System Prompts
---

System prompts set baseline instructions that apply to the entire conversation. They define behavior, constraints, and persona before any user input arrives.

When using tool vendors (Cursor, Claude.ai, ChatGPT), the "system prompt" you configure is typically a middle-layer prompt—not the true top-level prompt. The vendor's own system prompt wraps yours, injecting their safety guidelines, tool definitions, and formatting rules around your instructions.

User-facing settings like verbosity or response length can work in different ways. Some tools inject text into the system prompt (e.g., "respond concisely"). Others modify input activations directly, bypassing tokenization entirely. The implementation is usually opaque to the user.
