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

// Type for any collection entry (concepts, failure-modes, patterns)
export type AnyCollectionEntry =
  | CollectionEntry<"concepts">
  | CollectionEntry<"failure-modes">
  | CollectionEntry<"patterns">;

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
 * Fetch and sort all collections. Returns them in sidebar order.
 * Used by Layout.astro for navigation.
 */
export async function getAllCollectionsSorted(): Promise<{
  concepts: AnyCollectionEntry[];
  failureModes: AnyCollectionEntry[];
  patterns: AnyCollectionEntry[];
}> {
  const [concepts, failureModes, patterns] = await Promise.all([
    getCollectionSorted("concepts"),
    getCollectionSorted("failure-modes"),
    getCollectionSorted("patterns"),
  ]);

  return { concepts, failureModes, patterns };
}

/**
 * Build a unified navigation list across all sections.
 * Used for prev/next navigation that crosses section boundaries.
 */
export async function buildUnifiedNavList(): Promise<NavEntry[]> {
  const { concepts, failureModes, patterns } = await getAllCollectionsSorted();

  const toNavEntry = (entries: AnyCollectionEntry[], collection: CollectionName): NavEntry[] =>
    entries.map(e => ({
      slug: e.slug,
      title: e.data.title,
      collection,
      sectionName: COLLECTION_CONFIG[collection].displayName,
    }));

  return [
    ...toNavEntry(concepts, "concepts"),
    ...toNavEntry(failureModes, "failure-modes"),
    ...toNavEntry(patterns, "patterns"),
  ];
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
