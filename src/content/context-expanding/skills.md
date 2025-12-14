---
title: Skills
dependsOn: breadcrumbs
---

Skills are documentation files that teach the model how to accomplish specific tasks. They typically live in configuration directories (`.claude/skills/`, `.cursor/rules/`, etc.) and load into context when relevant.

Tools enable actions, skills shape behavior. The command line is a tool. A skill is a markdown file describing how to use it in a specific context.

**Example:** You ask the model to refactor all modules, but it misses some. A skill for working with modules might include a canonical `find` command to list the module directory structure, plus instructions to update each one and keep count. The model now has a reliable way to find all targets and track progress.
