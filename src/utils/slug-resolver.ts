import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

interface SlugMap {
  unique: Map<string, string>;      // slug -> url
  ambiguous: Map<string, string[]>; // slug -> [urls]
}

function scanContentDir(contentDir: string): SlugMap {
  const unique = new Map<string, string>();
  const ambiguous = new Map<string, string[]>();

  const collections = readdirSync(contentDir).filter(name => {
    const path = join(contentDir, name);
    return statSync(path).isDirectory();
  });

  for (const collection of collections) {
    const collectionPath = join(contentDir, collection);
    const files = readdirSync(collectionPath).filter(f =>
      f.endsWith('.md') || f.endsWith('.mdx')
    );

    for (const file of files) {
      const slug = basename(file).replace(/\.mdx?$/, '');
      const url = `/${collection}/${slug}/`;
      const fullKey = `${collection}/${slug}`;

      // Always register the full path (collection/slug)
      unique.set(fullKey, url);

      // Check if short slug is already registered
      if (unique.has(slug)) {
        // Move to ambiguous
        const existing = unique.get(slug)!;
        unique.delete(slug);
        ambiguous.set(slug, [existing, url]);
      } else if (ambiguous.has(slug)) {
        // Add to existing ambiguous list
        ambiguous.get(slug)!.push(url);
      } else {
        // Register short slug
        unique.set(slug, url);
      }
    }
  }

  return { unique, ambiguous };
}

export function createSlugResolver(contentDir: string) {
  const { unique, ambiguous } = scanContentDir(contentDir);

  return function urlBuilder(id: string): string {
    // Try exact match first (handles both short and full paths)
    if (unique.has(id)) {
      return unique.get(id)!;
    }

    // Check if it's ambiguous
    if (ambiguous.has(id)) {
      const options = ambiguous.get(id)!;
      throw new Error(
        `Ambiguous link [[${id}]]. Specify collection: ${options.join(' or ')}`
      );
    }

    throw new Error(`Unknown link [[${id}]]. No content found with this slug.`);
  };
}
