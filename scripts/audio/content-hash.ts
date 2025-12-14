/**
 * Content hashing for smart audio regeneration.
 * Hash is designed to ignore formatting changes but catch text changes.
 */

import { createHash } from 'crypto';

/**
 * Compute a content hash that ignores formatting differences.
 *
 * Changes that DON'T trigger regeneration:
 * - Heading level changes (h1 -> h2)
 * - Bold/italic changes
 * - Whitespace differences
 * - Adding images (without alt text)
 *
 * Changes that DO trigger regeneration:
 * - Any text content changes
 * - Alt text changes
 * - Link text changes
 */
export function computeContentHash(speakableText: string): string {
  // Normalize for hashing:
  // - lowercase (case changes don't affect speech much)
  // - collapse all whitespace to single space
  // - trim
  const normalized = speakableText
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Use SHA-256, truncated to 16 chars for readability
  return createHash('sha256')
    .update(normalized)
    .digest('hex')
    .substring(0, 16);
}
