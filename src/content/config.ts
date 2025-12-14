import { defineCollection, z } from 'astro:content';

// Shared schema for content that uses dependency-based ordering
const dependencySchema = z.object({
  title: z.string(),
  dependsOn: z.string().optional(), // slug of prerequisite content
});

// Shared schema for content with related items (alphabetically sorted)
const relatedSchema = z.object({
  title: z.string(),
  relatesTo: z.array(z.string()).optional(), // slugs of related content
});

// Concepts: AI and machine learning fundamentals that help you
// understand the technology you're working with.
const concepts = defineCollection({
  type: 'content',
  schema: dependencySchema,
});

// Failure Modes: Dynamics that result in unreasonable or
// unmaintainable outputs from AI.
const failureModes = defineCollection({
  type: 'content',
  schema: relatedSchema,
});

// Prompt Engineering: How you write and structure what you say to the AI
const promptEngineering = defineCollection({
  type: 'content',
  schema: relatedSchema,
});

// Context Pruning: Techniques for reducing/focusing context
const contextPruning = defineCollection({
  type: 'content',
  schema: dependencySchema,
});

// Context Expanding: Techniques for adding useful context
const contextExpanding = defineCollection({
  type: 'content',
  schema: dependencySchema,
});

// Workflow & Guardrails: How you guide the AI through a task
const workflowGuardrails = defineCollection({
  type: 'content',
  schema: relatedSchema,
});

// Coding Assistants: AI coding tools and how they implement these patterns
const codingAssistants = defineCollection({
  type: 'content',
  schema: relatedSchema,
});

export const collections = {
  concepts,
  'failure-modes': failureModes,
  'prompt-engineering': promptEngineering,
  'context-pruning': contextPruning,
  'context-expanding': contextExpanding,
  'workflow-guardrails': workflowGuardrails,
  'coding-assistants': codingAssistants,
};
