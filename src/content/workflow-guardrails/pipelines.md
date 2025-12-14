---
title: Pipelines and Hooks
---

Deterministic workflows that execute without model negotiation. The formatter runs before code hits disk. The linter runs after. No arguing required.

## The Problem with Instructions

"Always run the formatter" is a suggestion. The model may skip it, or require reminders.

Instructions are probabilistic. Pipelines are deterministic.

## What Pipelines Look Like

A pipeline chains steps where each output feeds the next input. The Unix pipe is the simplest example—`cat error.log | claude -p "summarize"` sends file contents to Claude and outputs the response. One command's output becomes another's input.

AI workflows work the same way: code written → formatter runs → linter checks → tests run. Each step triggers automatically.

## Implementation Options

**Tool-level hooks:** Claude Code and Cursor support hooks that fire on events like "file saved" or "tool completed."

**Agent orchestration:** A parent agent spawns child agents, reviews output, and routes work. The parent enforces the pipeline.

**External automation:** The pipeline lives outside the AI entirely. [lint-staged](https://github.com/lint-staged/lint-staged) runs formatters and linters on staged files during `git commit`—the model never gets a chance to skip it.
