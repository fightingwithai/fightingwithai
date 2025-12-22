---
title: Planning
---

At its simplest, planning means asking the agent to make a plan before letting it execute. You review the plan, make sure you're aligned, then give it the green light.

## Why Plan First

Without a planning step, the agent jumps straight into execution. If its understanding of the task differs from yours, you find out after it's already made changes. Planning surfaces misalignment early, when it's cheap to correct.

## Vendor Planning Modes

Various AI vendors have created explicit "planning modes" in their tools. What these actually do under the hood is unclear. It might be:

- Simple prompting that tells the agent to stay in planning mode
- Manipulations of input neurons or internal guardrails
- Something else entirely

This could vary from one provider to the next. The implementation is opaque, so treat vendor planning modes as a convenience rather than a guarantee. The core pattern—review before execute—works regardless of tooling.
