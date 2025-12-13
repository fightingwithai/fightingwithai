---
title: Agents
dependsOn: large-language-models
---

An agent is a multi-turn LLM that interacts with its environment using tools.

## The Loop

A basic LLM takes input and produces output. One shot. An agent runs in a loop:

1. Receive a prompt
2. Decide what tool to use (or respond directly)
3. Execute the tool
4. Observe the result
5. Repeat until done

Each iteration adds to the [context](/concepts/context). The agent builds up knowledge about your codebase, the state of your files, and what it's already tried.

## Why Tools Matter

Without tools, an LLM can only generate text. With tools, it can:

- Read and write files
- Run terminal commands
- Search codebases
- Make API calls

The tools define what the agent can actually *do* in your environment.
