---
title: MCP
dependsOn: tool-calling
---

Model Context Protocol (MCP) is a standard for connecting AI models to external tools and data sources.

Before MCP, every AI application built its own integration layer. Each tool had custom code for each host. MCP provides a common interface: build a tool once, use it anywhere that supports the protocol.

## The Problem MCP Solves

Without a standard:
- Tool developers write separate integrations for Claude Code, Cursor, custom apps
- Host applications implement their own tool formats
- Users can't easily share or reuse tool configurations

With MCP:
- Tool developers write one server
- Host applications implement one protocol
- Tools become portable across environments

## How It Works

MCP defines three roles:

**Servers** expose capabilities. A file system server provides read/write operations. A database server provides queries. A web server provides fetch operations.

**Clients** consume capabilities. Claude Code, Cursor, or any MCP-compatible application can connect to servers and use their tools.

**The protocol** standardizes how they communicate. Servers describe what they can do. Clients invoke those capabilities. Results flow back in a consistent format.

## What MCP Enables

**Tool composition:** Connect multiple servers to give the model access to files, databases, APIs, and custom systems simultaneously.

**Separation of concerns:** The AI application handles conversation and reasoning. MCP servers handle domain-specific operations.

**Ecosystem growth:** Once a tool works with MCP, it works everywhere. This encourages building reusable, well-documented tools.

## Practical Example

A developer wants Claude Code to query their company's internal API. Without MCP, they'd need to write custom integration code. With MCP:

1. Write an MCP server that wraps the internal API
2. Configure Claude Code to connect to that server
3. The model can now query the API like any other tool

The server handles authentication, rate limiting, and response formatting. The model just sees another tool it can invoke.

## Relationship to Tools

MCP is one way to provide tools to a model. Tools are the fundamental concept—capabilities the model can invoke. MCP is a specific protocol for exposing and discovering those capabilities in a standardized way.

Not all tools use MCP. Built-in tools (file read, bash, etc.) are typically implemented directly by the host. MCP shines for extending the model with custom, shareable capabilities.
