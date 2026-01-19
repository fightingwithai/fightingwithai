---
title: Abstractions
---

Abstractions let AI agents work at the right level without losing the forest for the trees.

## What an Abstraction Is

An abstraction is an interface that hides implementation details. A file system interface is an abstraction—you can swap in a mock, network storage, or in-memory implementation without changing the code that uses it.

This isn't just good software design. It's a way to scope what the AI can touch.

## Why This Helps AI

When an agent tries to do everything at once, it gets bogged down in low-level details. The context fills up with implementation noise, and the model loses track of the high-level goal.

Abstractions let you split the work:

1. **One agent creates the abstraction** — builds the library, defines the interface, handles the low-level complexity
2. **Another agent uses it** — works at the high level, focused on the application logic

Together they achieve more than one agent trying to do both.

## Examples

**Extracted libraries:** You build a reusable component library in one session. Future sessions import those components without needing to understand their internals. The agent thinks about *what* to render, not *how* rendering works.

**Config-driven modules:** You write a dynamic core once, then let agents work only with JSON config files. They can configure behavior without touching the engine that interprets the config.

**Interfaces and mocks:** Define a data access interface. The agent writes business logic against that interface. The actual database implementation is abstracted away—the agent doesn't need to know about connection pooling or query optimization.

## The Pattern

Extract complexity into stable abstractions. Let agents work at higher levels of abstraction where they can stay focused on the immediate goal.
