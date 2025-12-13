/**
 * Sorts items by their `dependsOn` field using topological sort.
 *
 * Items form a linked list where each item points to its prerequisite.
 * The item with no `dependsOn` is the head and appears first.
 *
 * @example
 * // Input (unordered):
 * // { id: 'tools', dependsOn: 'context' }
 * // { id: 'context', dependsOn: 'llm' }
 * // { id: 'llm' }  // head - no dependsOn
 *
 * // Output (ordered):
 * // llm -> context -> tools
 */

export interface DependencyItem {
  id: string;
  dependsOn?: string;
}

/**
 * Performs topological sort on items with dependency relationships.
 *
 * Algorithm:
 * 1. Build a map of id -> item for O(1) lookup
 * 2. Build a reverse map: what depends on each item
 * 3. Find the head(s) - items with no dependsOn
 * 4. Walk the chain: head -> what depends on head -> what depends on that...
 * 5. Items not in any chain go at the end (alphabetically by id)
 */
export function sortByDependency<T extends DependencyItem>(items: T[]): T[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [...items];

  // Build lookup maps
  const byId = new Map<string, T>();
  const dependents = new Map<string, string[]>(); // id -> items that depend on it

  for (const item of items) {
    byId.set(item.id, item);
    dependents.set(item.id, []);
  }

  // Build reverse dependency map
  for (const item of items) {
    if (item.dependsOn && byId.has(item.dependsOn)) {
      dependents.get(item.dependsOn)!.push(item.id);
    }
  }

  // Find heads (items with no dependsOn, or dependsOn points to non-existent item)
  const heads: T[] = [];
  const hasValidDependency = new Set<string>();

  for (const item of items) {
    if (!item.dependsOn || !byId.has(item.dependsOn)) {
      heads.push(item);
    } else {
      hasValidDependency.add(item.id);
    }
  }

  // Sort heads alphabetically for deterministic ordering when multiple chains exist
  heads.sort((a, b) => a.id.localeCompare(b.id));

  // Walk each chain from its head
  const result: T[] = [];
  const visited = new Set<string>();

  function walkChain(id: string): void {
    if (visited.has(id)) return; // Prevent cycles
    visited.add(id);

    const item = byId.get(id);
    if (item) {
      result.push(item);

      // Get items that depend on this one, sorted for determinism
      const deps = dependents.get(id) || [];
      deps.sort((a, b) => a.localeCompare(b));

      for (const depId of deps) {
        walkChain(depId);
      }
    }
  }

  // Start from each head
  for (const head of heads) {
    walkChain(head.id);
  }

  // Add any remaining items not reached (shouldn't happen in well-formed data)
  for (const item of items) {
    if (!visited.has(item.id)) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Adapter for Astro collection entries.
 * Extracts id from slug and dependsOn from frontmatter data.
 */
export function sortCollectionByDependency<T extends { slug: string; data: { dependsOn?: string } }>(
  entries: T[]
): T[] {
  // Convert to DependencyItem format
  const items = entries.map(entry => ({
    id: entry.slug,
    dependsOn: entry.data.dependsOn,
    original: entry,
  }));

  // Sort
  const sorted = sortByDependency(items);

  // Return original entries in sorted order
  return sorted.map(item => item.original);
}
