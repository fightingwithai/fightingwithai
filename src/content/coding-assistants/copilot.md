---
title: Copilot
---

GitHub Copilot is Microsoft's AI coding assistant. It started as autocomplete and has evolved to include chat and agent features.

## The Experience

Copilot runs as a VS Code extension—a chat panel bolted onto the side of the editor. It integrates with VS Code's language features to provide context.

## Known Issues

Some users have experienced problems:

- **Stale diagnostics:** The language server sometimes feeds Copilot outdated error information, leading the model to fix problems that no longer exist or miss problems that do.
- **Tool execution:** Models occasionally fail to run tools correctly or run the wrong tools.
- **Stop behavior:** Hitting "stop" sometimes doesn't actually stop the model—it continues running.

These may be version-specific issues that improve over time. Your experience may vary depending on your VS Code version, extensions, and configuration.

## When It Makes Sense

Copilot provides cheap access to multiple models and works on the free tier. If you're exploring AI-assisted coding or need something lightweight, it's an accessible starting point.

For serious agentic workflows, the tool execution issues can hold you back. The integration is convenient but not as robust as dedicated AI coding tools.
