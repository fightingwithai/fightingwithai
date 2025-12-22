---
title: Organization
---

Where you store AI-related files affects how well tools can find and use them.

## The Problem

Different AI tools look for configuration in different places. Claude Code looks for `CLAUDE.md`. Cursor has its own config. Copilot expects certain patterns. If you scatter prompts and instructions across tool-specific locations, you end up duplicating content and maintaining multiple copies.

## A Vendor-Agnostic Approach

Store reusable prompts and instructions in a vendor-agnostic `.ai` folder. Then create symlinks for each tool you actually use.

```
.ai/
  prompts/
    code-review.md
    commit-message.md
  context/
    architecture.md
    conventions.md

.claude/
  CLAUDE.md -> ../.ai/context/conventions.md
```

The `.ai` folder holds the source of truth. Tool-specific folders just point to it.

## Plans and Context

For project plans and longer-term context, consider where files should live:

- **In the repo:** If the context is project-specific and should travel with the code
- **Outside the repo:** If plans span multiple projects or contain notes you don't want committed

Some teams keep a top-level `plans/` folder in their projects directory for cross-project planning, with subfolders per project.

## The Pattern

Centralize AI instructions in a vendor-agnostic location. Use symlinks to expose them to specific tools. Keep plans where they make sense for your workflow.
