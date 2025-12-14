---
title: Tool Calling
dependsOn: agents
---

Tools are capabilities the model can invoke to interact with the world beyond text generation.

A base language model can only produce text. Tools extend what's possible: reading files, running commands, searching the web, calling APIs. The model decides when to use a tool, generates the appropriate call, and incorporates the result into its response.

## How Tools Work

The model doesn't actually execute anything. It produces structured output—usually JSON—that describes what it wants to do:

```json
{
  "tool": "read_file",
  "path": "/src/app.ts"
}
```

The host system (Claude Code, an API integration, etc.) executes the call and returns the result. The model then continues generating based on what it learned.

This creates a loop:
1. Model reasons about what information it needs
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

Models learn tool usage during training. They see examples of when to use each tool and develop intuitions about which tool fits which situation.

This means:
- Well-documented tools get used correctly more often
- Unusual tools may require explicit prompting
- The model might default to familiar tools even when others would work better

## The Tool vs Instruction Tradeoff

You can often accomplish the same goal two ways:

**With instructions:** "Search for files containing 'auth' in the filename"
**With a tool call:** The model invokes a glob/find tool

Tools are more reliable for mechanical tasks. Instructions are better when the task requires judgment about what to search for.
