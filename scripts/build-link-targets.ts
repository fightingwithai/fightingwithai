/**
 * Build link targets from content collections for atlas magic links.
 * Scans content directories and extracts frontmatter to build target map.
 */

import { readdirSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import type { LinkTarget } from 'sailkit/packages/atlas/dist/types.js';
import { COLLECTION_NAMES, type CollectionName } from '../src/utils/collections-config.js';

/**
 * Extract frontmatter from a markdown file.
 * Simple YAML parser for basic frontmatter fields.
 */
function extractFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result: Record<string, unknown> = {};

  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle arrays (basic support)
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1);
      result[key] = value.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    } else {
      // Remove quotes if present
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return result;
}

/**
 * Build link targets from all content collections.
 */
export function buildLinkTargets(): LinkTarget[] {
  const targets: LinkTarget[] = [];
  const contentDir = join(process.cwd(), 'src/content');

  for (const collection of COLLECTION_NAMES) {
    const collectionDir = join(contentDir, collection);

    let files: string[];
    try {
      files = readdirSync(collectionDir);
    } catch {
      // Collection directory doesn't exist yet
      continue;
    }

    for (const file of files) {
      const ext = extname(file).toLowerCase();
      if (ext !== '.md' && ext !== '.mdx') continue;

      const slug = file.replace(/\.(md|mdx)$/, '');
      const filePath = join(collectionDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      const target: LinkTarget = {
        id: (frontmatter.id as string) || slug,
        slug,
        url: `/${collection}/${slug}/`,
        aliases: frontmatter.aliases as string[] | undefined,
        placeholder: frontmatter.placeholder as boolean | undefined,
      };

      targets.push(target);
    }
  }

  return targets;
}

// If run directly, print targets as JSON
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildLinkTargets(), null, 2));
}
