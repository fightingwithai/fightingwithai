---
title: Context Engineering
dependsOn: large-language-models
---

A school of thought emphasizing understanding and quality. Practitioners care about architecture, read AI output carefully, and craft what goes into the [[context|context window]]—system prompts, examples, constraints.

## Example: Fixing a Layout Bug

There's a horizontal scrollbar appearing on your page. Instead of asking the AI to "fix the layout bug," you open dev tools and investigate. You find that `.card-container` has `width: 100vw` which doesn't account for the scrollbar width, causing overflow.

Your prompt becomes specific:

```
The .card-container is causing horizontal overflow.
It uses width: 100vw which includes scrollbar width.
Change it to width: 100% so it respects the parent container.
```

You've done the diagnostic work. The AI receives mechanical instructions rather than a vague problem description. The fix is almost certain to work because you've already solved the problem—you're just using the AI to type it.

## The Trade-off

This approach takes more upfront effort. You need to understand your codebase and investigate issues yourself. But you get predictable results and maintain control over the solution.

Often contrasted with [[vibe-coding|vibe coding]], but they're not mutually exclusive. Some people switch between modes depending on the task.
