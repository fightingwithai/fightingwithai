---
title: Autocomplete
dependsOn: context
---

Autocomplete tools (Copilot, Codeium, Supermaven) use LLMs to predict your next few lines of code.

## Under the Hood

A system prompt instructs the model: given these files and the cursor position, predict the next snippet. Your code—including comments—becomes the context. The model outputs what it predicts comes next.

## Prompting Without Realizing It

You type a comment:

```ts
// validate email format and check if domain exists
```

Autocomplete suggests:

```ts
async function validateEmail(email: string): Promise<boolean> {
```

You weren't thinking "prompt." You were documenting. But that comment went into the context, and the model predicted what comes next. The comment *was* the prompt.
