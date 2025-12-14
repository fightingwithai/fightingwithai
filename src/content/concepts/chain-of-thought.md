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

## A Note on "Thinking"

People debate whether this constitutes reasoning or pattern recognition. This guide avoids that debate.

We don't call it "thinking." We frame it as: the model predicting what a human would write if documenting their thought process. There are real differences between models that predict text and systems designed to reason about facts—but that's a machine learning debate beyond our scope.

This guide documents patterns and their impact on workflows. Chain of thought often improves output quality. That's what matters for practical use.
