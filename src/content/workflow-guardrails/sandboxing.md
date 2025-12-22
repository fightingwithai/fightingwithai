---
title: Sandboxing
---

Sandboxing isolates the agent's actions to limit potential damage. The degree of isolation varies widely.

## Weak Sandboxing

Most AI coding tools provide some form of permission system:

- Asking before operating in a folder
- Whitelisting allowed commands
- Requiring approval for file modifications

These are weak guardrails. They rely on the tool's own enforcement and your attention to prompts. A sufficiently confused agent—or malicious code it generates—can still cause problems.

## Soft Sandboxing

A middle ground uses [constraints](/workflow-guardrails/constraints) and conventions rather than hard isolation:

- Running in a dedicated subfolder
- Instructing the agent to only touch certain files
- Using [worktrees](/workflow-guardrails/worktrees) to isolate experimental work

This relies on the model following instructions. It's not true isolation, but it channels the agent's work and makes cleanup easier if things go wrong.

## Strong Sandboxing

True sandboxing means the agent can't break out even if it tries:

- Running inside a VM
- Network-level firewalling
- Container isolation with restricted permissions
- No access to secrets or credentials

Strong sandboxing protects against not just the agent's mistakes but also malicious code it might generate—code that could exfiltrate data or cause damage if run in your real environment.

## The Trade-off

Stronger sandboxing means more friction. You can't give the agent access to your real database, your actual credentials, or your production environment—which limits what it can do.

For exploratory work or untrusted tasks, strong sandboxing makes sense. For routine work in a codebase you trust, weaker forms might be practical. Match the isolation level to the risk.
