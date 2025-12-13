/**
 * Pure configuration and helpers for collections.
 * No Astro dependencies - can be unit tested directly.
 */

export type CollectionName = "concepts" | "failure-modes" | "patterns";

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
    description: "AI and machine learning fundamentals that help you understand the technology you're working with.",
    sortMethod: "dependency",
  },
  "failure-modes": {
    slug: "failure-modes",
    displayName: "Failure Modes",
    description: "Dynamics that result in unreasonable or unmaintainable outputs from AI.",
    sortMethod: "alphabetical",
  },
  "patterns": {
    slug: "patterns",
    displayName: "Patterns",
    description: "Common techniques employed in practice to stay in control.",
    sortMethod: "alphabetical",
  },
};

/**
 * All collection names in display order.
 */
export const COLLECTION_NAMES: CollectionName[] = ["concepts", "failure-modes", "patterns"];

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
