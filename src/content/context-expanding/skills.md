---
title: Skills
dependsOn: breadcrumbs
---

Skills are documentation files that teach the model how to accomplish specific tasks. They're context you inject to give the model specialized knowledge.

Think of skills as instruction manuals. The model reads them and gains the ability to do something it couldn't do otherwise—or do it better than it would by default.

## Skills vs Tools

Tools are capabilities—the model can invoke them to do things. Skills are knowledge—they inform how the model uses tools or approaches problems.

A tool lets the model run shell commands. A skill teaches it your team's conventions for writing commit messages.

A tool lets the model edit files. A skill teaches it your project's code style and patterns.

Skills often document tool usage, but they're fundamentally different: tools enable actions, skills shape behavior.

## How Skills Work

Skills typically live in configuration directories (`.claude/skills/`, `.cursor/rules/`, etc.). When a conversation starts or a relevant condition triggers, the skill content gets added to context.

The model then has access to that knowledge for the duration of the session. It can reference the skill's guidance when making decisions.

## What Makes a Good Skill

**Specific over general.** "Always use TypeScript" is too vague. "Use strict null checks and explicit return types for public functions" is actionable.

**Contextual.** Skills should fire when relevant and stay out of the way otherwise. A database migration skill doesn't need to load when you're writing CSS.

**Example-rich.** Models learn from examples. A skill that shows three good commit messages teaches more than one that describes what good commit messages look like.

## Common Skill Types

**Code style:** Formatting preferences, naming conventions, patterns to use or avoid.

**Domain knowledge:** Business logic, API contracts, data models specific to your project.

**Workflow guidance:** How to run tests, how to structure PRs, what to check before committing.

**Tool instructions:** How to use project-specific tools, custom commands, or automation.

## Relationship to Breadcrumbs

Skills are similar to breadcrumbs—both inject context that guides model behavior. The difference is scope:

- **Breadcrumbs** help the model navigate: where things are, what connects to what
- **Skills** help the model perform: how to do things, what patterns to follow

A breadcrumb might say "auth code lives in `/src/auth`." A skill might say "auth endpoints must validate JWT tokens and log access attempts."

Both shape model behavior through context. Skills focus on the "how," breadcrumbs focus on the "where."
