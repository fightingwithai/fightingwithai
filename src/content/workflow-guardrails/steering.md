---
title: Steering
---

Steering is nudging. When the model does the wrong thing, you push it in the right direction.

## Direct Steering

The most immediate form: you [stop](/context-management/stop) the agent mid-execution and send a follow-up prompt, or [rewind](/context-management/rewinding) to edit a previous message and steer it differently from that point.

You see what the model is doing, intervene, and redirect. This is the core skill of working with AI.

## Environmental Steering

You can also steer indirectly through [feedback loops](/workflow-guardrails/feedback-loops). For example, when writing TypeScript, adding a lint rule that flags the `any` type steers the model away from using it. The model sees the lint errors and adjusts.

This is steering through constraints rather than through prompts. You shape the environment, and the model adapts to it.

## The Difference

| Type | When | How |
|------|------|-----|
| **Direct** | In the moment | Stop, redirect, rewind |
| **Environmental** | Before the task | Lint rules, type systems, tests |

Direct steering is reactive—you fix problems as they happen. Environmental steering is proactive—you prevent problems before they start.
