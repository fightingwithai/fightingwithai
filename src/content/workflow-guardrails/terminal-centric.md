---
title: Terminal-Centric Work
---

AI coding agents manipulate text. They read files, write files, run commands. Even when wrapped in graphical interfaces, they're executing text-based tools underneath—often through MCP servers and command-line utilities.

The terminal is their native habitat.

## The Unix Philosophy

Command-line tools compose. The agent pipes `ripgrep` output to `sed`, loops over files with `find`, chains commands with `&&`. This is the Unix philosophy applied to agentic work.

You can build [pipelines](/workflow-guardrails/pipelines) that process files through agents, review outputs, and continue—automation that's hard to replicate clicking through GUIs.

## Understanding What the Model Does

The agent runs tools like `ripgrep`, `fd`, `sed`, `git`. If you don't understand these tools, how do you know whether to stop it? Whether it's making progress or spiraling?

Terminal fluency isn't just about running agents in the terminal. It's about understanding the agent's world well enough to supervise it. People who live in the terminal are better positioned to leverage AI coding agents because they speak the same language.

## GUI Friction

Graphical tools often require clicking on files to review changes. People skip it because it's too much friction. They don't review the diffs. They don't catch problems.

[Claude Code](/coding-assistants/claude-code) shows diffs inline as it edits—now with a dedicated panel for reviewing changes before accepting. Terminal tools like `lazygit` complement this by letting you review commits across [worktrees](/workflow-guardrails/worktrees) with single keystrokes.

## Resource Overhead

Running multiple agentic sessions in editors—especially Electron apps—creates overhead. Memory bloats. Machines slow down.

Worse, the editor can poison your context. Lagging LSP servers feed stale information to the agent. I've seen agents claim "no errors" when errors existed, or "clean git status" when files were modified. VS Code was feeding wrong information.

The terminal can run in complete isolation. No editor state leaking in.

## Terminal Power Features

**Vim mode:** In Claude Code, edit prompts using vim motions. Saves keystrokes when crafting complex prompts.

**Bang commands:** Type `!` followed by a bash command. It runs, and the output gets incorporated into context. Quick way to inject information.

**Multiplexing:** Use tmux, Kitty splits, or Zellij to run multiple sessions side by side. Switch between them instantly.

**Workflow flexibility:** Stop Claude, inspect the filesystem manually, then run `claude --continue` to re-enter the conversation. Work full-screen, switching between programs. You control the flow.

## IDE Annoyances

VS Code constantly fights for screen real estate. Sidebars pop open when you close them. File trees block your code. Terminals expand unexpectedly. Things jump around.

The terminal is calm. You get exactly what you ask for. Nothing surprises you.

## Modern Terminals Are Beautiful

The misconception that terminals are boring, ugly text on black backgrounds is outdated. Modern terminals like Kitty and Alacritty support millions of colors, inline images, ligatures, and custom fonts. They can look as good as any editor.

## The Ecosystem

Terminal-based tools form an ecosystem:

- **Multiplexers:** tmux, Zellij, Kitty (built-in)
- **Editors:** vim, neovim, Emacs
- **Search:** ripgrep, fd, fzf
- **Git:** lazygit
- **Agents:** Claude Code, OpenCode

Learning these tools pays compound interest. Each one you add makes the others more powerful.

## Cloud Agents vs Interactive Work

The industry talks about "kick off an agent, come back to a PR." That works for some tasks. But it often means working in small increments or redoing work when the agent goes off-track.

Interactive terminal work lets you stop and [steer](/workflow-guardrails/steering) in real time. For many tasks, that's more efficient than fire-and-forget.

## The Pattern

Even if you don't work in the terminal daily, understanding terminal-based workflows makes you better at supervising AI agents. They think in commands. Speaking their language helps you guide them.
