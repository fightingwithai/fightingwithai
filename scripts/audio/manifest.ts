/**
 * Manifest for tracking generated audio files and their content hashes.
 * Enables incremental regeneration - only regenerate when content changes.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export interface ManifestEntry {
  hash: string;
  duration: number;  // seconds
  size: number;      // bytes
  generatedAt: string;
  filename: string;  // e.g., "01-context.wav"
}

export interface Manifest {
  version: number;
  voice: string;
  entries: Record<string, ManifestEntry>;
}

const MANIFEST_PATH = 'public/audio/manifest.json';
const CURRENT_VERSION = 1;
const DEFAULT_VOICE = 'en_US-lessac-medium';

/**
 * Load manifest from disk, or create empty one if it doesn't exist.
 */
export function loadManifest(): Manifest {
  if (!existsSync(MANIFEST_PATH)) {
    return {
      version: CURRENT_VERSION,
      voice: DEFAULT_VOICE,
      entries: {},
    };
  }

  try {
    const content = readFileSync(MANIFEST_PATH, 'utf-8');
    const manifest = JSON.parse(content) as Manifest;

    // Handle version migrations if needed in the future
    if (manifest.version !== CURRENT_VERSION) {
      console.log(`Manifest version mismatch (${manifest.version} -> ${CURRENT_VERSION}), regenerating all`);
      return {
        version: CURRENT_VERSION,
        voice: DEFAULT_VOICE,
        entries: {},
      };
    }

    return manifest;
  } catch (error) {
    console.warn('Failed to parse manifest, starting fresh:', error);
    return {
      version: CURRENT_VERSION,
      voice: DEFAULT_VOICE,
      entries: {},
    };
  }
}

/**
 * Save manifest to disk.
 */
export function saveManifest(manifest: Manifest): void {
  // Ensure directory exists
  const dir = dirname(MANIFEST_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

/**
 * Check if content needs regeneration based on hash.
 */
export function needsRegeneration(manifest: Manifest, key: string, hash: string): boolean {
  const entry = manifest.entries[key];
  if (!entry) return true;
  return entry.hash !== hash;
}

/**
 * Update manifest entry after generation.
 */
export function updateEntry(
  manifest: Manifest,
  key: string,
  hash: string,
  duration: number,
  size: number,
  filename: string
): void {
  manifest.entries[key] = {
    hash,
    duration,
    size,
    generatedAt: new Date().toISOString(),
    filename,
  };
}
