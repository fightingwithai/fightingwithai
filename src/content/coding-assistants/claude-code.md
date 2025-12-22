---
title: Claude Code
---

Claude Code is Anthropic's CLI-based coding assistant. It runs in your terminal and operates on your local filesystem.

## Pricing Model

Monthly plans give you access to Opus 4.5, the most capable model. There are session limits, but they're deterministic—you can see exactly how much usage you have left and budget accordingly.

This predictability matters. You know what you're getting and can plan around it, unlike tools with opaque rate limits or surprise throttling.

## Terminal-First

Claude Code runs in the terminal, not an IDE. This fits well with git worktrees and parallel development—you can have multiple Claude sessions running in different worktrees without IDE context bleeding between them.

The terminal focus also means it integrates naturally with command-line workflows: git, build tools, test runners.

## Agent Capabilities

Claude Code can create and switch between files, run shell commands, and iterate on its own output. It's designed for agentic workflows where you give it a goal and let it figure out the steps.
