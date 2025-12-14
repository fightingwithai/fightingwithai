---
title: Context Seeding
---

Context seeding loads relevant information into the conversation before making your actual request. The AI gathers context first, then uses it to inform its response.

## Examples

- **Web search**: "Search for the latest React 19 features"
- **File reads**: "Read the authentication module and related tests"
- **Git history**: "Check the recent commits touching this file"
- **Slash commands**: Triggering `/docs` or custom commands that inject context
- **Skills**: Having the AI load project-specific guidance files

## Reducing Noise

One technique: after the seeding prompt, instruct the AI to respond with just "ready" or "done." This prevents lengthy summaries from cluttering the context window. The information is loaded—no need for a recap.

```
Read all files in src/auth/ and say "ready" when done.
```

The AI processes the files, outputs "ready," and you follow up with your actual question or task.
