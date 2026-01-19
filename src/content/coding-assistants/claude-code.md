---
title: Claude Code
---

Claude Code is Anthropic's coding assistant. It's available as a CLI tool and as a VS Code extension, both operating on your local filesystem.

## Pricing Model

Monthly plans give you access to Opus 4.5, the most capable model. There are session limits, but they're deterministic—you can see exactly how much usage you have left and budget accordingly.

This predictability matters. You know what you're getting and can plan around it, unlike tools with opaque rate limits or surprise throttling.

## Interface Options

The CLI runs in your terminal and fits well with git worktrees and parallel development—multiple sessions in different worktrees without context bleeding between them.

The VS Code extension provides the same capabilities with IDE integration: inline diffs, file navigation, and visual feedback.

Both integrate with command-line workflows: git, build tools, test runners. The CLI particularly shines for [terminal-centric work](/workflow-guardrails/terminal-centric)—composing with tools like lazygit, tmux, and vim.

## Agent Capabilities

Claude Code can create and switch between files, run shell commands, and iterate on its own output. It's designed for agentic workflows where you give it a goal and let it figure out the steps.

## Parallel Execution

Claude Code supports [agent orchestration](/concepts/agent-orchestration) patterns out of the box:

- **Background tasks**: Press Ctrl+V to move the current operation to the background while you continue working
- **Message queueing**: Send follow-up messages without waiting for the current loop to complete
- **Multiple sessions**: Run concurrent sessions in separate terminals or worktrees, each with isolated context

This makes it practical to have an exploration agent searching the codebase while an implementation agent writes code—without the two stepping on each other.

## Known Issues

Some users have reported UI glitches:

- **Text flickering:** Output sometimes flickers during streaming
- **Toggle inconsistencies:** Todo checkboxes and collapsible sections occasionally misbehave
- **Escape handling:** The escape key doesn't always register on first press

Like [other AI coding tools](/coding-assistants/copilot), the tooling is still maturing.
