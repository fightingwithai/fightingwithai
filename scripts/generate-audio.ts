#!/usr/bin/env npx tsx

/**
 * Generate audio files from content using OpenAI TTS API.
 *
 * Usage: npm run audio:generate
 *
 * Requires: OPENAI_API_KEY environment variable
 *
 * This script:
 * 1. Reads all content files from src/content/
 * 2. Sorts them by dependency order (matching site navigation)
 * 3. Extracts speakable text
 * 4. Computes content hash
 * 5. Skips if hash matches existing (incremental build)
 * 6. Generates MP3 audio with numeric prefixes (01-, 02-, etc.)
 * 7. Updates manifest
 */

import { readFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { globSync } from 'glob';

import { extractSpeakableText } from './audio/extract-text.js';
import { computeContentHash } from './audio/content-hash.js';
import { loadManifest, saveManifest, needsRegeneration, updateEntry } from './audio/manifest.js';
import { generateAudio, checkOpenAIAvailable } from './audio/openai-wrapper.js';

// ANSI colors
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

// Collection config matching src/utils/collections-config.ts
interface CollectionConfig {
  name: string;
  sortMethod: 'dependency' | 'alphabetical';
}

const COLLECTIONS: CollectionConfig[] = [
  { name: 'concepts', sortMethod: 'dependency' },
  { name: 'prompt-engineering', sortMethod: 'alphabetical' },
  { name: 'context-management', sortMethod: 'dependency' },
  { name: 'context-expanding', sortMethod: 'dependency' },
  { name: 'workflow-guardrails', sortMethod: 'alphabetical' },
  { name: 'failure-modes', sortMethod: 'alphabetical' },
  { name: 'coding-assistants', sortMethod: 'alphabetical' },
];

interface ContentFile {
  collection: string;
  slug: string;
  filePath: string;
  content: string;
  title: string;
  dependsOn?: string;
}

interface OrderedContentFile extends ContentFile {
  order: number;      // 1-based index within collection
  filename: string;   // e.g., "01-context.mp3"
}

/**
 * Parse frontmatter from markdown content.
 */
function parseFrontmatter(content: string): { title: string; dependsOn?: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: '' };

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const dependsOnMatch = frontmatter.match(/^dependsOn:\s*(.+)$/m);

  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    dependsOn: dependsOnMatch ? dependsOnMatch[1].trim() : undefined,
  };
}

/**
 * Sort items by dependency chain (topological sort).
 * Items with no dependsOn come first, then their dependents.
 */
function sortByDependency(files: ContentFile[]): ContentFile[] {
  if (files.length <= 1) return files;

  // Build lookup maps
  const bySlug = new Map<string, ContentFile>();
  const dependents = new Map<string, string[]>();

  for (const file of files) {
    bySlug.set(file.slug, file);
    dependents.set(file.slug, []);
  }

  // Build reverse dependency map
  for (const file of files) {
    if (file.dependsOn && bySlug.has(file.dependsOn)) {
      dependents.get(file.dependsOn)!.push(file.slug);
    }
  }

  // Find heads (no dependsOn or dependsOn doesn't exist)
  const heads: ContentFile[] = [];
  for (const file of files) {
    if (!file.dependsOn || !bySlug.has(file.dependsOn)) {
      heads.push(file);
    }
  }

  // Sort heads alphabetically for determinism
  heads.sort((a, b) => a.slug.localeCompare(b.slug));

  // Walk chains
  const result: ContentFile[] = [];
  const visited = new Set<string>();

  function walkChain(slug: string): void {
    if (visited.has(slug)) return;
    visited.add(slug);

    const file = bySlug.get(slug);
    if (file) {
      result.push(file);

      const deps = dependents.get(slug) || [];
      deps.sort((a, b) => a.localeCompare(b));
      for (const depSlug of deps) {
        walkChain(depSlug);
      }
    }
  }

  for (const head of heads) {
    walkChain(head.slug);
  }

  // Add any remaining (shouldn't happen with well-formed data)
  for (const file of files) {
    if (!visited.has(file.slug)) {
      result.push(file);
    }
  }

  return result;
}

/**
 * Sort items alphabetically by title.
 */
function sortAlphabetically(files: ContentFile[]): ContentFile[] {
  return [...files].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Get all content files from a collection, sorted appropriately.
 */
function getCollectionFiles(config: CollectionConfig): OrderedContentFile[] {
  const collectionPath = resolve(process.cwd(), 'src/content', config.name);

  if (!existsSync(collectionPath)) {
    return [];
  }

  const contentFiles = globSync('*.{md,mdx}', { cwd: collectionPath });
  const files: ContentFile[] = [];

  for (const file of contentFiles) {
    const filePath = resolve(collectionPath, file);
    const slug = basename(file, extname(file));
    const content = readFileSync(filePath, 'utf-8');

    // Skip placeholder/TODO content
    const bodyContent = content.replace(/^---[\s\S]*?---\n?/, '').trim();
    if (bodyContent.toLowerCase() === 'todo') {
      console.log(`${DIM}[SKIP] ${config.name}/${slug} - placeholder content${RESET}`);
      continue;
    }

    const { title, dependsOn } = parseFrontmatter(content);
    files.push({ collection: config.name, slug, filePath, content, title, dependsOn });
  }

  // Sort based on collection config
  const sorted = config.sortMethod === 'dependency'
    ? sortByDependency(files)
    : sortAlphabetically(files);

  // Add order and filename (using .mp3 for OpenAI output)
  return sorted.map((file, index) => ({
    ...file,
    order: index + 1,
    filename: `${String(index + 1).padStart(2, '0')}-${file.slug}.mp3`,
  }));
}

/**
 * Clean up orphaned audio files that no longer have corresponding content.
 */
function cleanOrphanedAudio(manifest: ReturnType<typeof loadManifest>, validKeys: Set<string>): void {
  const orphanedKeys = Object.keys(manifest.entries).filter(key => !validKeys.has(key));

  for (const key of orphanedKeys) {
    const entry = manifest.entries[key];
    if (entry?.filename) {
      const [collection] = key.split('/');
      const audioPath = resolve(process.cwd(), 'public/audio', collection, entry.filename);
      if (existsSync(audioPath)) {
        console.log(`${YELLOW}[CLEAN] ${key} - content removed${RESET}`);
        unlinkSync(audioPath);
      }
    }
    delete manifest.entries[key];
  }
}

async function main(): Promise<void> {
  console.log(`\n${CYAN}🎙️  OpenAI TTS Audio Generator${RESET}\n`);

  // Check OpenAI API is available
  if (!checkOpenAIAvailable()) {
    console.error(`${RED}OpenAI API not available. Aborting.${RESET}`);
    process.exit(1);
  }

  // Load manifest
  const manifest = loadManifest();
  console.log(`Loaded manifest with ${Object.keys(manifest.entries).length} existing entries\n`);

  // Get all content files, sorted per collection
  const allFiles: OrderedContentFile[] = [];
  for (const config of COLLECTIONS) {
    const files = getCollectionFiles(config);
    allFiles.push(...files);
  }

  console.log(`Found ${allFiles.length} content files to process\n`);

  if (allFiles.length === 0) {
    console.log(`${YELLOW}No content files found.${RESET}`);
    return;
  }

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  const validKeys = new Set<string>();

  for (const file of allFiles) {
    const key = `${file.collection}/${file.slug}`;
    validKeys.add(key);

    try {
      // Extract speakable text
      const { speakableText } = extractSpeakableText(file.content);

      if (!speakableText.trim()) {
        console.log(`${DIM}[SKIP] ${key} - no speakable content${RESET}`);
        skipped++;
        continue;
      }

      // Compute hash
      const hash = computeContentHash(speakableText);

      // Check if regeneration needed (also check if filename changed)
      const existingEntry = manifest.entries[key];
      const filenameChanged = existingEntry?.filename !== file.filename;

      if (!needsRegeneration(manifest, key, hash) && !filenameChanged) {
        console.log(`${DIM}[SKIP] ${key} - unchanged${RESET}`);
        skipped++;
        continue;
      }

      // Delete old file if filename changed
      if (filenameChanged && existingEntry?.filename) {
        const oldPath = resolve(process.cwd(), 'public/audio', file.collection, existingEntry.filename);
        if (existsSync(oldPath)) {
          unlinkSync(oldPath);
        }
      }

      // Generate audio
      const orderStr = String(file.order).padStart(2, '0');
      console.log(`${GREEN}[GEN]${RESET} ${orderStr}. ${key}`);

      const outputPath = `public/audio/${file.collection}/${file.filename}`;

      // Prepend title for natural intro: "Context. The context window is finite..."
      const fullText = file.title ? `${file.title}. ${speakableText}` : speakableText;

      const { duration, size } = await generateAudio(fullText, outputPath);

      // Update manifest with filename
      updateEntry(manifest, key, hash, duration, size, file.filename);
      generated++;

      console.log(`       ${DIM}${duration.toFixed(1)}s, ${(size / 1024).toFixed(0)} KB${RESET}`);

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${RED}[ERR] ${key}: ${message}${RESET}`);
      errors++;
    }
  }

  // Clean up orphaned audio files
  cleanOrphanedAudio(manifest, validKeys);

  // Save manifest
  saveManifest(manifest);

  // Summary
  console.log(`\n${CYAN}📊 Summary${RESET}`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Errors:    ${errors}`);

  if (errors > 0) {
    console.log(`\n${YELLOW}⚠️  Some files had errors. Check the output above.${RESET}`);
    process.exit(1);
  }

  console.log(`\n${GREEN}✅ Audio generation complete!${RESET}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${RED}Fatal error: ${message}${RESET}`);
  process.exit(1);
});
