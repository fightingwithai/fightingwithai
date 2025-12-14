/**
 * Pure configuration and helpers for collections.
 * No Astro dependencies - can be unit tested directly.
 */

export type CollectionName =
  | "concepts"
  | "prompt-engineering"
  | "context-management"
  | "context-expanding"
  | "workflow-guardrails"
  | "failure-modes"
  | "coding-assistants";

export interface CollectionConfig {
  slug: CollectionName;
  displayName: string;
  description: string;
  sortMethod: "dependency" | "alphabetical";
}

/**
 * Central configuration for all content collections.
 * Single source of truth for display names, descriptions, and sort behavior.
 */
export const COLLECTION_CONFIG: Record<CollectionName, CollectionConfig> = {
  "concepts": {
    slug: "concepts",
    displayName: "Concepts",
    description: "Foundational knowledge for understanding AI-assisted work.",
    sortMethod: "dependency",
  },
  "prompt-engineering": {
    slug: "prompt-engineering",
    displayName: "Prompt Engineering",
    description: "How you write and structure what you say to the AI.",
    sortMethod: "alphabetical",
  },
  "context-management": {
    slug: "context-management",
    displayName: "Context Management",
    description: "Techniques for inspecting, reducing, and focusing context.",
    sortMethod: "dependency",
  },
  "context-expanding": {
    slug: "context-expanding",
    displayName: "Context Expanding",
    description: "Techniques for adding useful context to guide the model.",
    sortMethod: "dependency",
  },
  "workflow-guardrails": {
    slug: "workflow-guardrails",
    displayName: "Workflow & Guardrails",
    description: "How you guide the AI through a task.",
    sortMethod: "alphabetical",
  },
  "failure-modes": {
    slug: "failure-modes",
    displayName: "Failure Modes",
    description: "Dynamics that result in unreasonable or unmaintainable outputs from AI.",
    sortMethod: "alphabetical",
  },
  "coding-assistants": {
    slug: "coding-assistants",
    displayName: "Coding Assistants",
    description: "AI coding assistants and how they implement these patterns.",
    sortMethod: "alphabetical",
  },
};

/**
 * All collection names in sidebar display order.
 * Concepts come first as foundational knowledge.
 */
export const COLLECTION_NAMES: CollectionName[] = [
  "concepts",
  "prompt-engineering",
  "context-management",
  "context-expanding",
  "workflow-guardrails",
  "failure-modes",
  "coding-assistants",
];

/**
 * Sort entries alphabetically by title.
 * Extracted from repeated inline sorts across the codebase.
 */
export function sortAlphabetically<T extends { data: { title: string } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.title.localeCompare(b.data.title));
}

/**
 * Get display name for a collection.
 * Convenience function for templates.
 */
export function getDisplayName(collection: CollectionName): string {
  return COLLECTION_CONFIG[collection].displayName;
}

/**
 * Navigation entry with collection context.
 */
export interface NavEntry {
  slug: string;
  title: string;
  collection: CollectionName;
  sectionName: string;
}

/**
 * Related content item.
 */
export interface RelatedItem {
  slug: string;
  title: string;
  collection: CollectionName;
}
