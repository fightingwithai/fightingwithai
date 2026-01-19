---
title: Research-Plan-Implement
relatesTo:
  - planning
  - steering
---

Research-Plan-Implement (RPI) is a workflow pattern that separates AI coding work into three sequential phases. Each phase produces a compacted artifact that feeds the next.

The tradeoff: slower than direct implementation, but more predictable and correct.

## Why This Works

AI coding usually fails when the model is asked to plan and code simultaneously. Context fills with noise, decisions get made with incomplete information, and the agent drifts off course.

RPI prevents this by enforcing boundaries. Each phase has one job. You review the output before moving on.

## The Three Phases

### Research

**Goal:** Document what exists. No opinions, no suggestions.

The agent explores the codebase, reading files, tracing dependencies, noting patterns. The output is a research document—typically saved to a file like `research.md`.

This phase can spawn parallel sub-agents to search and analyze, keeping the parent context clean. Only compacted summaries return.

**Checkpoint:** Review the research document. If the agent misunderstood the codebase, catch it now.

### Plan

**Goal:** Design the change with clear phases and success criteria.

The agent reads the research document, asks clarifying questions, presents options where applicable, and produces an implementation plan. Exact file paths, code snippets, verification steps.

**Checkpoint:** Review the plan. A flawed approach caught here saves hundreds of lines of wasted code.

### Implement

**Goal:** Execute the plan mechanically.

The agent follows the plan step by step, running verification after each phase. For complex tasks, a progress file tracks status across context resets.

This phase is intentionally boring. The creative work happened earlier.

## The Leverage Ratio

Where you review matters:

- **Bad research** (one wrong assumption) → thousands of lines of incorrectly architected code
- **Bad plan** (flawed approach) → hundreds of lines in wrong locations
- **Bad code** (single bug) → one bad line

Reviewing ~400 lines of research and planning documents catches problems with 10-100x more leverage than reviewing generated code.

## When to Use RPI

RPI is not optimized for speed. Use it for:

- Complex changes spanning multiple files
- Refactors and migrations
- Features in unfamiliar codebases
- Work where correctness matters more than velocity

For simple, well-understood changes, direct implementation is faster.

## Key Principle

Do each phase in a new session. One goal per session. The fresh context keeps the model focused on the current task without noise from previous phases.

## Tools

Several tools implement RPI workflows:

- **Goose** has built-in `/research`, `/plan`, `/implement` commands
- **Claude Code** frameworks like [claude-research-plan-implement](https://github.com/brilliantconsultingdev/claude-research-plan-implement) provide structured templates
- **Custom CLAUDE.md** instructions can enforce the pattern in any tool
