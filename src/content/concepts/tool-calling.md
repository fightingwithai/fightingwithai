---
title: Tool Calling
dependsOn: chats
---

Tools are capabilities the model can invoke to interact with the world beyond text generation.

A base language model can only produce text. Tools extend what's possible: reading files, running commands, searching the web, calling APIs. The model selects when to use a tool, generates the appropriate call, and incorporates the result into its response.

## How Tools Work

The model doesn't actually execute anything. It produces structured output (JSON, for example) describing the action to perform:

```json
{
  "tool": "read_file",
  "path": "/src/app.ts"
}
```

The host system (Claude Code, an API integration, etc.) executes the call and returns the result. The model then continues generating based on the result.

This creates a loop:
1. Model evaluates what information it requires
2. Model generates a tool call
3. Host executes the call
4. Result goes back into context
5. Model continues with new information

## Common Tool Categories

**File operations:**
- Read files
- Write/edit files
- Search for files
- List directories

**Execution:**
- Run shell commands
- Execute code
- Run tests

**Information retrieval:**
- Web search
- Fetch URLs
- Query databases

**Communication:**
- Ask clarifying questions
- Present options to the user

## Tool Selection

Models learn tool usage during training. Training examples shape which tool gets selected for which situation.

This means:
- Well-documented tools get used correctly more often
- Unusual tools may require explicit prompting
- The model might default to familiar tools even when others would work better

