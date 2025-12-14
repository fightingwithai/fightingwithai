/**
 * Collection utilities with Astro integration.
 *
 * Re-exports pure config from collections-config.ts and adds
 * Astro-specific functions that use getCollection.
 */

import { getCollection, type CollectionEntry } from "astro:content";
import { sortCollectionByDependency } from "./sortByDependency";
import {
  COLLECTION_CONFIG,
  COLLECTION_NAMES,
  sortAlphabetically,
  type CollectionName,
  type NavEntry,
  type RelatedItem,
} from "./collections-config";

// Re-export everything from config for convenience
export {
  COLLECTION_CONFIG,
  COLLECTION_NAMES,
  sortAlphabetically,
  getDisplayName,
  type CollectionConfig,
  type CollectionName,
  type NavEntry,
  type RelatedItem,
} from "./collections-config";

// Type for any collection entry
export type AnyCollectionEntry =
  | CollectionEntry<"concepts">
  | CollectionEntry<"failure-modes">
  | CollectionEntry<"prompt-engineering">
  | CollectionEntry<"context-engineering">
  | CollectionEntry<"workflow-guardrails">
  | CollectionEntry<"tools">;

/**
 * A collection with its entries, ready for rendering.
 */
export interface CollectionWithEntries {
  name: CollectionName;
  displayName: string;
  description: string;
  entries: AnyCollectionEntry[];
}

/**
 * Fetch and sort a collection based on its configured sort method.
 */
export async function getCollectionSorted(name: CollectionName): Promise<AnyCollectionEntry[]> {
  const entries = await getCollection(name);
  const config = COLLECTION_CONFIG[name];

  if (config.sortMethod === "dependency") {
    return sortCollectionByDependency(entries);
  }
  return sortAlphabetically(entries);
}

/**
 * Fetch and sort all collections as an ordered array.
 * Order is defined by COLLECTION_NAMES - the single source of truth.
 * Used by Layout.astro for navigation.
 */
export async function getAllCollectionsSorted(): Promise<CollectionWithEntries[]> {
  const results: CollectionWithEntries[] = [];

  for (const name of COLLECTION_NAMES) {
    const config = COLLECTION_CONFIG[name];
    const entries = await getCollectionSorted(name);

    results.push({
      name,
      displayName: config.displayName,
      description: config.description,
      entries,
    });
  }

  return results;
}

/**
 * Build a unified navigation list across all sections.
 * Used for prev/next navigation that crosses section boundaries.
 * Order is defined by COLLECTION_NAMES.
 */
export async function buildUnifiedNavList(): Promise<NavEntry[]> {
  const collections = await getAllCollectionsSorted();

  return collections.flatMap(collection =>
    collection.entries.map(entry => ({
      slug: entry.slug,
      title: entry.data.title,
      collection: collection.name,
      sectionName: collection.displayName,
    }))
  );
}

/**
 * Resolve related content slugs to full entries.
 * Searches across all collections since relatesTo can reference any collection.
 */
export async function resolveRelatedContent(slugs: string[]): Promise<RelatedItem[]> {
  if (!slugs || slugs.length === 0) return [];

  const items: RelatedItem[] = [];

  for (const slug of slugs) {
    for (const collectionName of COLLECTION_NAMES) {
      const entries = await getCollection(collectionName);
      const found = entries.find((e) => e.slug === slug);
      if (found) {
        items.push({
          slug: found.slug,
          title: found.data.title,
          collection: collectionName,
        });
        break;
      }
    }
  }

  return items;
}
