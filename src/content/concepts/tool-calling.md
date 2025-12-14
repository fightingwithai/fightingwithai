---
title: Tool Calling
dependsOn: chat-loops
---

Tools are capabilities the model can invoke to interact with the world beyond text generation.

A base language model can only produce text. Tools extend what's possible: reading files, running commands, searching the web, calling APIs. The model selects when to use a tool, generates the appropriate call, and incorporates the result into its response.

## How Tools Work

The model doesn't actually execute anything. It produces structured output (JSON, for example) describing the action to perform.

Here's an example system prompt that teaches a model to use tools:

```
You are a coding assistant with access to file tools.

When you need to read or write files, output a JSON tool call:

To read a file:
{"tool": "read_file", "path": "/path/to/file"}

To write a file:
{"tool": "write_file", "path": "/path/to/file", "content": "..."}

After outputting a tool call, stop and wait for the result.
```

When the user asks "What's in src/app.ts?", the model outputs:

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

The model just outputs text. Which tool it "selects" depends on what text it generates - and that depends on how the tools are described in the prompt.

This means:
- Well-documented tools get used correctly more often
- Ambiguous descriptions lead to wrong tool choices
- Clear examples in the prompt improve reliability

