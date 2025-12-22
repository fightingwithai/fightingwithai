---
title: Vibe Coding
dependsOn: large-language-models
---

Accepting AI output without deep scrutiny. Describe what you want, accept the code if it works, move on. Code quality takes a backseat—maybe because tests already cover it, or the code is throwaway, or it'll be rewritten later.

## Example: Fixing a Layout Bug

There's a horizontal scrollbar appearing on your page. You prompt:

```
There's a horizontal scrollbar on the page. Fix it.
```

The AI tries something—maybe adding `overflow-x: hidden` to the body. The scrollbar disappears, but now content is clipped on mobile. You prompt again:

```
Now the content is cut off on mobile. Fix that too.
```

This loop continues. Each fix might create new issues. Eventually something works, or you give up and investigate yourself.

## When It Works

Vibe coding isn't wrong—it's a trade-off. It works well when:

- You're prototyping and don't care about code quality
- The task is low-stakes or throwaway
- You have good test coverage that catches breakage
- You're exploring unfamiliar territory and learning as you go

The risk is accumulating fixes-on-fixes that you don't fully understand.

Often contrasted with [[context-engineering]], but they're not mutually exclusive. Some people switch between modes depending on the task.
