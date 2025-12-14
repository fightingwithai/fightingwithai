---
title: Chain of Thought
dependsOn: large-language-models
---

Chain of thought (also called "thinking mode") prompts the model to generate text simulating what a human might write if asked to document their thought process.

The model performs this until it decides the reasoning is complete. The output is then reincorporated into the context before the final response.

## What It Does

The model predicts text that resembles human problem-solving notes: breaking down steps, considering alternatives, catching mistakes. This additional context can improve the final output by:

- Correcting typos or errors in the original prompt
- Surfacing relevant details the model might otherwise skip
- Providing a richer context for the final response

## Trade-offs

Chain of thought adds overhead. Whether that overhead pays off depends on the task.

**When it helps:**
- Complex tasks with multiple steps or considerations
- Long-running tasks where the model might drift off course
- Problems requiring course correction mid-stream

**When it costs more than it gives:**
- Simple tasks where the answer is straightforward
- Cases where extra token consumption outweighs quality gains
- Situations where extended processing leads to overthinking—the model spirals into edge cases, second-guesses correct answers, or produces verbose output that obscures the result

The same mechanism that enables self-correction can produce runaway elaboration. A model generating reasoning tokens may keep generating them past the point of usefulness.

## A Note on "Thinking"

People debate whether this constitutes reasoning or pattern recognition. This guide avoids that debate.

We don't call it "thinking." We frame it as: the model predicting what a human would write if documenting their thought process. There are real differences between models that predict text and systems designed to reason about facts—but that's a machine learning debate beyond our scope.

This guide documents patterns and their impact on workflows. Chain of thought often improves output quality. That's what matters for practical use.
