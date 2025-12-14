---
title: PR Splitting
---

When a PR balloons in scope, split it.

AI-assisted work tends to touch many files quickly. A 40-file PR is unreasonable to review. Each additional edit risks the AI modifying files you've already reviewed. The scope creep becomes its own problem.

## The Fix

Cherry-pick one file at a time into a new branch. Review it. Iterate. Merge. Repeat.

This gives you:
- Reviewable chunks
- Confidence in what's already merged
- A clean boundary—files in the new PR are the only ones at risk of AI edits
- Easier rollback if something breaks

## When to Split

- You've lost track of what changed
- The diff is too large to review carefully
- You're nervous about continued edits touching reviewed files
- The PR mixes unrelated changes (refactoring + features + fixes)
