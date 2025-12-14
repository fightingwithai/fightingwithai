---
title: Large Language Models
---

An LLM predicts the next word based on everything that came before.

## From Markov Chains to Transformers

**Markov chains** predict the next word using only the previous word. "The" often leads to "cat" or "dog." Simple, but context-free.

**N-grams** extend this by looking at the last N words. "The quick brown" predicts "fox" better than just "brown" alone. More context, better predictions.

**LLMs** are the logical extreme: instead of 2-3 words, they look back thousands of tokens. The mechanism that enables this is called **attention**—it lets the model weigh which earlier tokens matter most for predicting the next one.

Same principle as a Markov chain. Much longer memory.

## Tokenization

LLMs don't read words—they read **tokens**. A token is a chunk of text, usually a word or part of a word. "unhappiness" becomes three tokens: `un` + `happi` + `ness`.

## Embeddings

Computers need numbers, not words. **Embeddings** turn words into numbers that capture meaning.

Picture a line. Put "sad" at 0, "happy" at 100. Now every word gets a number based on where it falls. "Miserable" might be 10. "Content" might be 60. "Joyful" might be 95.

Words with similar meanings get similar numbers. The computer can now "see" that happy, joyful, and glad cluster together—they're all high numbers on this line.

Real embeddings use thousands of these number lines at once, but the idea is the same.

## A Compressed JPEG of the Internet

Think of an LLM as a compressed JPEG of its training data.

Training takes billions of documents and compresses them into model weights. Like JPEG compression, some information survives intact. Other information gets lost or blurred. The model stores patterns, not facts.

Where information is missing, the model fills gaps—the same way a heavily compressed image invents pixels that weren't in the original. The output looks coherent, but some of it was reconstructed, not recalled.
