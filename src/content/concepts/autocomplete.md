---
title: Autocomplete
dependsOn: context
---

Autocomplete tools (Copilot, Codeium, Supermaven) use LLMs to predict your next few lines of code.

## Under the Hood

A system prompt instructs the model: given these files and the cursor position, predict the next snippet. Your code—including comments—becomes the context. The model outputs what it predicts comes next.

## Prompting Without Realizing It

When you write a comment, you're not thinking "prompt." But comments shape predictions. The model pattern-matches on everything in context.
