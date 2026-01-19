---
title: Worktrees
---

Git worktrees let you have multiple working copies of your repository simultaneously. Think of it like having a second checkout of your repo—you can work on separate tasks even if they touch the same files.

## The Problem They Solve

You're working on feature A when an urgent bug comes in. Normally you'd stash your changes, switch branches, fix the bug, switch back, pop the stash. With worktrees, you just open another terminal pointing to a different worktree and work there.

For agentic work, this is powerful. You can run multiple agents on different tasks in parallel, each in its own worktree, without them stepping on each other's changes.

## Basic Usage

```bash
# Create a worktree for a new branch
git worktree add ../my-repo-feature feature-branch

# Create a worktree for an existing branch
git worktree add ../my-repo-bugfix bugfix-branch

# List worktrees
git worktree list

# Remove when done
git worktree remove ../my-repo-feature
```

Each worktree is a full working directory with its own checked-out branch. They share the same `.git` history, so commits in one are visible to all.

## The Trade-offs

Worktrees aren't perfect isolation. They share the same machine, same network, same ports.

If your dev server grabs port 3000, and you spin up another worktree, that second dev server might grab 3001 instead. Now you have two servers running. Agents can get confused about which one they're supposed to hit. You might test against the wrong instance.

This is why worktrees are a form of [soft sandboxing](/workflow-guardrails/sandboxing)—not strong sandboxing. They're more about concurrency than true isolation.

## Concurrency, Not Isolation

The real value of worktrees is running parallel work streams:

- Multiple agents working on different features
- Reviewing one task while another runs
- Keeping experimental work separate from stable work

They don't protect you from an agent that goes off the rails. They just keep its mess contained to one directory while your other work stays clean.

## The Pattern

Use worktrees when you need to work on multiple things at once. Understand that they share resources. For true isolation, you need VMs or containers. For parallel agentic work on the same codebase, worktrees hit the sweet spot.
