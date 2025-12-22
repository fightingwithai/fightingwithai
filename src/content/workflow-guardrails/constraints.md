---
title: Constraints
---

Without constraints, the model is like water poured on flat ground—it spreads everywhere and makes a mess. Constraints are the banks of the river. They channel the work.

## Scoping the Task

Tell the agent exactly what it's working on:

- "You're just working on tests"
- "You're just implementing this function"
- "You're just fixing type errors"
- "You're just explaining the code—don't modify anything"

Each constraint focuses the model's attention and prevents drift. Without them, a simple request to "fix this bug" can balloon into refactoring, adding features, and restructuring files.

## Why Constraints Matter

Models have a tendency to expand scope. They see adjacent problems and try to solve them. They notice patterns they could improve and start improving them. They're eager to help—sometimes too eager.

Explicit constraints give the model permission to ignore those temptations. "You're only touching test files" means it won't decide to also refactor the source code it's testing.

## Soft Sandboxing

Constraints are a form of soft [sandboxing](/workflow-guardrails/sandboxing). They rely on the model following instructions rather than hard technical enforcement. But they work surprisingly well. Models are generally good at respecting scope when you define it clearly.

## Layers of Abstraction

You can layer constraints through abstraction:

- This worktree is for tests
- This session is for implementation
- This prompt is for code review only

Each layer narrows the scope. The model operates within boundaries it can't accidentally cross because the structure enforces them.

## The Pattern

Define the river banks before releasing the water. Tell the agent what it's working on, what it should ignore, and what success looks like. Constraints turn unfocused energy into directed work.
