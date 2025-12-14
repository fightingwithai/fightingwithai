---
title: Agents
dependsOn: tool-calling
---

An agent is a system that perceives its environment and takes actions to achieve a goal.

## The Loop

A basic LLM takes input and produces output. One shot. An agent runs in a loop:

1. Receive input
2. Predict the next tokens—which may specify a tool call
3. The system executes any tool calls
4. Tool output becomes part of the context
5. Repeat until complete

Each iteration extends the [context](/concepts/context). The context accumulates information about your codebase, file states, and previous attempts.

## Why Tools Matter

Without tools, an LLM can only generate text. With tools, it can:

- Read and write files
- Run terminal commands
- Search codebases
- Make API calls

The tools define what the agent can actually *do* in your environment.
