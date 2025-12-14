---
title: Signal vs Noise
dependsOn: context
relatesTo:
  - context-collapse
  - context-contamination
---

Signal is information that helps. Noise is everything else. The ratio between them determines whether you get good results.

This tradeoff shows up everywhere—debugging, documentation, communication. When working with AI, it becomes especially important because you're constantly deciding what information to include and what to leave out.

## The Tradeoff

More information isn't always better. Adding context has costs:

- **Dilution** — Important details get buried
- **Distraction** — Attention gets spent on irrelevant tokens
- **Displacement** — Useful context gets pushed out

The goal isn't maximum information. It's maximum *relevant* information.

## Sources of Noise

**From the model:**
- Failed attempts that stay in context
- Speculative edits and "just in case" changes
- Verbose explanations when terse ones suffice

**From the user:**
- Pasting entire files when a snippet would do
- Including background that doesn't affect the task
- Keeping old conversation threads alive too long

**From tools:**
- Full stack traces when the first line matters
- Verbose command output
- Redundant file reads

## Examples

### The Buried Signal

A test fails. The stack trace looks like this (the details don't matter—just notice how much noise there is):

```
Error: Connection refused
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
    at Protocol._enqueue (/node_modules/mysql/lib/protocol/Protocol.js:144:48)
    at Protocol.handshake (/node_modules/mysql/lib/protocol/Protocol.js:51:23)
    at PoolConnection.connect (/node_modules/mysql/lib/Connection.js:116:18)
    at Pool.getConnection (/node_modules/mysql/lib/Pool.js:48:16)
    at /app/src/db/connection.js:23:10
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async UserService.findById (/app/src/services/user.js:47:18)
    at async GET /api/users/:id (/app/src/routes/users.js:12:20)
```

The signal is "Connection refused"—the database isn't running. Everything else is noise. But the model might attend to the file paths, line numbers, and internal Node.js frames, diluting its focus on the actual problem.

### Less Noise, Worse Ratio

The model notices it's getting verbose output and tries to help:

```bash
npm test 2>&1 | head -5
```

Output:
```
> myapp@1.0.0 test
> jest

PASS src/utils/format.test.js
PASS src/utils/validate.test.js
```

There's less noise now. But the signal—the one failing test at line 47—got cut off entirely. The signal-to-noise ratio is now zero.

Reducing noise only helps if you keep the signal. Truncating output, filtering logs, or summarizing results can backfire when the important information gets discarded along with the clutter.
