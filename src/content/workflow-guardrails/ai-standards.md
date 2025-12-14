---
title: AI Standards
---

Some organizations now have formal policies on AI-assisted code. These range from outright bans to disclosure requirements.

## The Spectrum

**Allow with disclosure:** Fedora's 2025 policy permits AI-assisted contributions. The core requirement: *"It is your responsibility to review, test, and understand everything you submit."* Contributors use an `Assisted-by:` commit trailer for transparency.

**Outright bans:** Gentoo, NetBSD, Cloud Hypervisor, and QEMU prohibit AI-generated code. Reasons include copyright concerns (AI training data has unclear provenance) and review burden (low-quality submissions waste maintainer time).

## Two Philosophies

**Accountability-focused (Fedora):** Doesn't matter how you got there. Can you vouch for the code? The contributor is always the author. AI output is treated as a suggestion, not final code.

**Provenance-focused (Gentoo, NetBSD):** Where did the bits come from? NetBSD considers AI code "presumed tainted" due to unclear copyright. Gentoo's ban passed 6-0, citing copyright, quality, and ethics.

## The Definition Problem

Banning "AI-generated code" requires defining it. This is harder than it sounds.

Clear cases:
- Paste ChatGPT output directly → AI-generated
- Type every character yourself with no AI → not AI-generated

Gray areas:
- Ask AI to explain a concept, then implement it yourself
- Use AI to debug, then fix the code manually
- Discuss architecture with AI, then write the code
- Autocomplete suggests a function name you accept

One Cloud Hypervisor contributor noted: *"This policy will basically be violated starting from day 0. We never can ensure code is not at least enhanced with/from LLM."*

## Accountability vs. Provenance

The provenance approach (ban AI code) is difficult to enforce. There's no reliable way to detect AI-assisted work, and the boundary between "AI-generated" and "AI-influenced" is blurry.

The accountability approach (understand what you submit) sidesteps the definition problem. It doesn't ask where code came from—it asks whether you can stand behind it.

This mirrors how open source has always worked. Maintainers don't audit whether you wrote code at 3am or copied it from Stack Overflow. They ask: does it work? Is it correct? Can you fix it if it breaks?

## Implications

Teams adopting AI policies face a choice:

1. **Define the tool** — ban or require disclosure of specific AI tools. Easier to write, harder to enforce, and obsolete as tools change.

2. **Define the outcome** — require contributors to understand and vouch for their code. Harder to measure, but captures what actually matters.

Neither approach is wrong. They reflect different priorities: legal clarity vs. practical quality.
