---
title: Compact
dependsOn: clear
---

[[clear|Clearing]] loses everything. Compacting preserves a summary.

## How It Works

1. A prompt runs behind the scenes, summarizing the preceding conversation
2. The context clears
3. A new context starts with the summary loaded

The result: a fresh context window with key decisions and progress carried forward.

## Auto-Compaction

Some tools reserve buffer space at the end of the context window. When the context fills up, auto-compaction runs transparently—the tool summarizes and clears without explicit user action.

This keeps things moving, but the timing is unpredictable. The summary happens wherever the context happened to fill up, not at a logical breakpoint.

## Proactive Compaction

Compacting manually at natural breakpoints produces better results. The summary captures a completed unit of work rather than an arbitrary slice.

Example: when working through a multi-step plan, compact after each major step. Each subsequent step starts with a clean context and a summary of prior progress—without accumulated noise from the implementation details.
