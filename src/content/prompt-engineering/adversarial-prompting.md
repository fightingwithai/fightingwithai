---
title: Adversarial Prompting
---

Adversarial prompting is the technique of framing prompts so one AI session works against another—or against its own prior output after clearing context.

## Examples

- One model writes tests, another tries to make them pass
- One model inserts intentional bugs to verify tests catch them
- Reviewing code as if written by "an unfamiliar engineer" to get more stringent critique
- One model generates edge cases, another validates handling

## Why It Works

The key is removing collaborative framing. When you clear context and prompt with an adversarial frame, the model produces output that simulates opposition rather than agreement. It's not defending work it just helped create.

## The Pattern

1. Complete the initial work (write code, generate tests, etc.)
2. [[clear]] the context or switch models
3. Prompt with an adversarial frame ("find issues", "break this", "what would fail")
4. Use the critical output to improve the original work
