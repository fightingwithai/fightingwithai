import { defineCollection, z } from 'astro:content';

// Concepts: AI and machine learning fundamentals that help you
// understand the technology you're working with.
const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dependsOn: z.string().optional(), // slug of prerequisite content
  }),
});

// Failure Modes: Dynamics that result in unreasonable or
// unmaintainable outputs from AI.
const failureModes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    relatesTo: z.array(z.string()).optional(), // slugs of related content
  }),
});

// Patterns: Common techniques employed in practice to stay in control.
const patterns = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    relatesTo: z.array(z.string()).optional(), // slugs of related content
  }),
});

export const collections = {
  concepts,
  'failure-modes': failureModes,
  patterns,
};
