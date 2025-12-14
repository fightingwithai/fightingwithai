---
title: MCP
dependsOn: tool-calling
---

Model Context Protocol (MCP) is a standard for connecting AI models to external tools. Think of it like REST—a protocol that defines how tools expose capabilities and how clients invoke them.

## Tradeoffs

MCP servers can return bloated responses. The GitHub MCP server, for example, returns many fields the model doesn't need, consuming context. This isn't unique to MCP—GitHub's REST API has the same problem. Their GraphQL API doesn't, since it lets you request only the fields you need.

Some argue that using CLI tools or GraphQL directly offers better efficiency than MCP. But many useful integrations are currently built as MCP servers, which is why we cover it here.
