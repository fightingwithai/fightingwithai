import { defineCollection, z } from 'astro:content';

// Concepts: AI and machine learning fundamentals that help you
// understand the technology you're working with.
const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

// Failure Modes: Dynamics that result in unreasonable or
// unmaintainable outputs from AI.
const failureModes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

// Patterns: Common techniques employed in practice to stay in control.
const patterns = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  concepts,
  'failure-modes': failureModes,
  patterns,
};
