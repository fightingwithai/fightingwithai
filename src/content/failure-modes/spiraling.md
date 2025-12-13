---
title: Spiraling
relatesTo:
  - context-collapse
  - stochastic-noise
---

The AI gets stuck in a loop, flip-flopping between wrong answers or digging deeper into the wrong direction.

## Symptoms

- AI flip-flops on diagnoses ("the issue is X... wait, it's Y... no, it's actually X again")
- Spiraling deeper into wrong directions
- Amplifying its own previous noise instead of course-correcting
- Spawns multiple processes (frontend, backend, tests), loses track, tries to kill them, spawns duplicates, repeats

## Theory

Each AI response becomes part of the context for the next response. When the AI makes a wrong guess, that guess influences subsequent thinking. Instead of stepping back, it builds on the mistake - or oscillates between competing wrong hypotheses.

## Mitigation

Interrupt the loop. Either:
- Start a fresh context
- Provide a clear correction that breaks the pattern
- Ask the AI to step back and reconsider from scratch
