---
title: Agent Orchestration
dependsOn: agent-loops
---

A single agent context eventually breaks down. Context fills up. Focus drifts. The model loses track of where it is in a complex task.

Orchestration solves this by coordinating multiple focused agents instead of one overloaded context.

## The Core Problem

Long-running tasks accumulate noise:

- File reads stack up
- Failed attempts stay in context
- The model forgets earlier decisions
- Token limits force summarization that loses detail

A 50-step task rarely succeeds in a single context. By step 30, the agent is working with degraded information.

## The Pattern

Instead of one agent doing everything:

1. **Coordinator** breaks the task into subtasks
2. **Subagents** each handle one focused piece
3. **Shared state** (a plan file, todo list) tracks progress
4. **Handoffs** pass control with minimal context

Each subagent starts fresh. It reads the plan, does its job, updates the plan, exits. The next subagent picks up where it left off.

## Plan as Shared State

The plan file is the coordination mechanism:

```markdown
# Implementation Plan

## Completed
- [x] Add user model (subagent-1)
- [x] Create API endpoints (subagent-2)

## In Progress
- [ ] Add authentication middleware

## Pending
- [ ] Write tests
- [ ] Update documentation
```

Each subagent:
1. Reads the current plan
2. Works on the next incomplete item
3. Checks it off with a summary of what changed
4. Hands off to the next agent

The plan persists across contexts. No single agent needs to hold the full history.

## Parallel vs Sequential

**Sequential**: One subagent finishes before the next starts. Use for dependent tasks where order matters.

**Parallel**: Multiple subagents run simultaneously on independent tasks. An exploration agent searches the codebase while an implementation agent writes code.

**Background**: Long-running tasks (test suites, builds) run in background while the main agent continues. Check results later.

## Handoff Protocol

A clean handoff includes:

1. **Summary**: What was accomplished (2-3 sentences)
2. **State update**: Mark tasks complete in the plan
3. **Next action**: What the next agent should do
4. **Artifacts**: Files created or modified

The receiving agent doesn't need the full history—just enough to continue.

## When to Orchestrate

Single context works for:
- Tasks under ~20 steps
- Work that fits in one logical session
- Exploratory work where you don't know the scope

Orchestration helps when:
- The task has clear subtasks
- You're hitting context limits
- Multiple independent pieces can parallelize
- You need to resume across sessions

## Hierarchical Orchestration

Flat structures hit limits. Multiple agents working in parallel tend to step on each other's work—editing the same files, duplicating effort, or making conflicting changes. And you lose track of what's happening when you're switching between fifteen different tabs.

Hierarchy helps. Separate agents into roles.

**Planner-Worker Architecture:**
- **Planners** explore the codebase and create tasks. They can spawn sub-planners for specific areas, making planning recursive.
- **Workers** focus entirely on completing assigned tasks. No coordination with other workers—just grind until done.
- **Judges** evaluate results after each cycle and decide whether to continue or restart fresh.

This mirrors traditional org design. The planner thinks, the workers execute, the judge evaluates. Each role has one job.

Cursor uses this architecture for long-running agents. The planner maintains context about the full codebase; workers operate with narrow focus.

## Persistent Planning Documents

Context windows truncate. Instructions from earlier in the session get pushed out.

One workaround: a shared file where agents store state and summaries. When the next agent picks up, it reads the file to get context about what happened.

This helps but doesn't eliminate information loss. Summaries lose detail. The file can get stale. Agents may not read it carefully or may misinterpret what's there.

Cursor implements this as "Scratchpad." Other tools use plan files, progress files, or markdown todos.

## Tools

Several tools implement orchestration patterns:

- **[Cursor](https://cursor.com)**: Uses planner-worker-judge hierarchy for long-running agents. Implements persistent planning via "Scratchpad."
- **[Gas Town](https://github.com/steveyegge/gastown)**: Multi-agent workspace manager for Claude Code. Coordinates 20-30+ agents with planner-worker hierarchy and git-backed persistence.
- **[Beads](https://github.com/steveyegge/beads)**: Git-native issue tracker designed for AI agents. Provides dependency-aware task graphs that survive session restarts.
- **Claude Code**: Built-in background tasks (Ctrl+B), message queueing, and subagent spawning via the Task tool.

## Trade-offs

Orchestration adds complexity. Each handoff loses some nuance. Subagents may duplicate work if the plan isn't clear.

Start with a single agent. Add orchestration when you hit limits, not before.
