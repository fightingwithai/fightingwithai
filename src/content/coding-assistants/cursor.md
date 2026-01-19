---
title: Cursor
---

Cursor is a fork of VS Code designed around AI-assisted coding. It's more graphical than terminal-based tools.

## Design Focus

Cursor is moving towards being a design tool as much as a code editor. The interface provides visual ways to interact with AI, approve changes, and manage context.

## Worktree Integration

Cursor provides a GUI for running agentic sessions in different worktrees. This lets you visualize parallel work streams and switch between them without juggling terminal windows.

## IDE Integration

Because Cursor is a full IDE (based on VS Code), it has deep integration with language servers, debuggers, and extensions. The AI can access IDE features like type information and diagnostics directly.

This is different from terminal-based tools that shell out to compilers and linters. The integration is tighter, though it also means more coupling to the IDE's view of your code.
