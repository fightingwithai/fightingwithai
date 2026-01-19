---
title: OpenCode
---

OpenCode is an open-source fork of Claude Code that uses OpenRouter instead of Anthropic's API directly.

## What It Is

OpenCode provides a Claude Code-like terminal experience but routes requests through OpenRouter. This gives you access to multiple model providers through a single interface.

## Open Source

Being open source means you can inspect the code, modify it for your needs, and contribute improvements. The community can fix issues and add features without waiting for a vendor.

## Trade-offs

Using OpenRouter adds a layer of indirection. You're dependent on OpenRouter's availability and pricing, and there may be subtle differences in how requests are handled compared to direct API access.

For users who want model flexibility or prefer open-source tools, it's an option worth considering.
