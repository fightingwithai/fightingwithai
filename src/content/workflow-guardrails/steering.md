---
title: Steering
---

Steering is a fancy word for nudging. When the model does the wrong thing, you push it in the right direction.

## Interactive Steering

The most immediate form is interactive: you [stop](/context-management/stop) the agent mid-execution and send a follow-up prompt, or [rewind](/context-management/rewinding) to edit a previous message and steer it differently from that point.

This is prompting in the moment. You see what the model is doing, intervene, and redirect.

## Activation Steering

With open-weight models, you can steer at inference time by manipulating the model's internals. The process:

1. Run good prompts and bad prompts through the model
2. Identify the activation patterns that differ between them
3. Adjust weights to reinforce good behaviors and suppress bad ones

This steers the model's outputs without changing the prompt. It's more technical and requires access to model weights.

## Fine-Tuning

The most robust form of steering happens during training. You take a generalized model and run a final round of fine-tuning to shape it toward the behaviors you want.

Fine-tuning is permanent—the steering is baked into the model itself rather than applied at inference time.

## Steering Through Constraints

You can also steer indirectly through [feedback loops](/workflow-guardrails/feedback-loops). For example, when writing TypeScript, adding a lint rule that flags the `any` type steers the model away from using it. The model learns from the lint errors and adjusts.

This is steering through environment rather than through the model itself.
