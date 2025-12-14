# Fighting With AI - Project Context

## What This Book Is

A **pattern catalog** for AI-assisted software engineering, in the tradition of:

- **Gang of Four** - "Design Patterns" (1994) - named patterns like Singleton, Factory, Observer
- **Martin Fowler** - "Patterns of Enterprise Application Architecture" (2002) - named patterns like Repository, Unit of Work, Active Record

The goal is to do for AI-assisted work what these books did for OOP and enterprise architecture: **create a shared vocabulary**.

## Why Patterns Matter

Before pattern books, developers solved the same problems repeatedly without shared language. After pattern books, you could say "use a Factory" and everyone knew what you meant.

This book names the moves for working with AI:
- Recognizable situations
- Named patterns for each
- Specific approaches that work

When devs see "pattern catalog," they recognize the ambition. It's a signal: "This is trying to be *that* book for AI."

## Target Audience

**Primary:** Developers who would recognize the Fowler/GoF lineage. They'll understand the value proposition immediately.

**Strategy:** Once devs adopt it, the ideas spread. Others can package and teach the concepts more broadly. The patterns become the shared vocabulary.

## Voice & Style

- **ELI5 (Explain Like I'm 5)**: Simple, clear language
- **Short and direct**: No fluff
- **Concrete over abstract**: Show the situation, name the pattern, explain the move

## The Title: "Fighting With AI"

Double meaning:
1. **Fighting alongside AI** - using it as a tool
2. **Fighting against AI** - pushing back when it's wrong

The book is about working *with* AI without letting it mess things up:
- Verifying output
- Setting constraints
- Knowing when to trust it
- Fixing mistakes instead of accepting them

## Key Messages

- AI makes mistakes and sounds confident when wrong
- The goal is staying in control of a powerful tool
- Named patterns let you recognize situations and know what to do
- People who work well with AI do better than those who don't use it or blindly trust it

## Technical Stack

- **Framework:** Astro (static site generation)
- **Content:** Markdown files in `src/content/`
- **Styling:** CSS variables via design system

## Skills

See `.claude/skills/` for technical guidance on Astro patterns, content ordering, copywriting, and more.

## Workflow

After implementing features that involve iteration or touch multiple files, run the `/code-cleanup` command to audit for technical debt before moving on.

## Linting

Asset linting runs automatically on pre-commit via Husky. You can also run manually:

```bash
npm run lint:assets
```
