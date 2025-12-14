---
title: Hierarchy
relatesTo:
  - signal-noise
---

Structure your prompts like documents, not walls of text. Headers, sections, and visual markers help the model parse what matters.

## Why Structure Matters

A prompt is input to a prediction engine. The model attends to tokens based on patterns it learned during training. Structured text—with clear sections and emphasis—gives stronger signals about what's important.

Walls of text bury the key points. Structure surfaces them.

## Techniques

### Headers and Sections

Break prompts into labeled sections. The model learns to treat headers as topic boundaries.

```
## Context
You're reviewing a pull request for a payments service.

## Task
Check for security issues in the authentication flow.

## Constraints
Focus only on the auth code. Ignore styling issues.
```

### XML Tags

XML provides explicit boundaries. Useful when sections contain complex content that might confuse markdown parsing.

```
<context>
The user is building a CLI tool in Rust.
</context>

<requirements>
- Must handle stdin and file input
- Should support JSON and CSV output formats
</requirements>

<examples>
mytool input.csv --format json
cat data.csv | mytool --format json
</examples>
```

Claude models specifically respond well to XML tags—they're prominent in training data.

### All Caps for Emphasis

CAPITALS signal importance. Use sparingly for critical instructions.

```
Generate test cases for this function.

IMPORTANT: Do not modify the original function.
IMPORTANT: Each test must be independent.
```

Overuse dilutes the signal. One or two IMPORTANT lines stand out. Ten do not.

### Whitespace and Separation

Blank lines create visual breaks. Dense text without breathing room is harder to parse—for humans and models.

```
Bad:
Review this code. Look for bugs. Also check performance. Make sure error handling is correct. Don't change the API.

Better:
Review this code for:
- Bugs
- Performance issues
- Error handling gaps

Do not change the public API.
```

## Combining Techniques

Real prompts mix these approaches:

```
## Your Role
You're a code reviewer for a fintech company.

<codebase_context>
- Language: TypeScript
- Framework: Express
- Database: PostgreSQL
</codebase_context>

## Task
Review the attached PR for security issues.

IMPORTANT: This code handles payment processing. Flag anything that could leak PII or allow unauthorized transactions.

## Output Format
For each issue:
1. File and line number
2. Severity (critical/high/medium/low)
3. Brief explanation
4. Suggested fix
```

## Theory

Hierarchy works because attention is finite. Structure tells the model where to focus. Without it, every token competes equally—important instructions get the same weight as filler words.
