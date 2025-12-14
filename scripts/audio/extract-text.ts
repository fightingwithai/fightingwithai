/**
 * Extract speakable text from markdown content.
 * Strips formatting while preserving text that should be read aloud.
 */

export interface ExtractionResult {
  title: string;
  speakableText: string;
}

/**
 * Extract speakable text from markdown/MDX content.
 *
 * Includes: paragraphs, headings, lists, bold/italic text, image alt text, link text
 * Excludes: frontmatter, code blocks, HTML tags, MDX imports, URLs
 */
export function extractSpeakableText(markdown: string): ExtractionResult {
  let text = markdown;

  // 1. Extract and remove frontmatter, capturing title
  let title = '';
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    text = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
  }

  // 2. Remove MDX import statements
  text = text.replace(/^import\s+.*$/gm, '');

  // 3. Remove fenced code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, '');

  // 4. Remove inline code (`...`) - just remove the backticks, keep the text
  // Actually, let's remove inline code entirely as it's usually technical
  text = text.replace(/`[^`]+`/g, '');

  // 5. Extract image alt text: ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // 6. Extract link text: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 7. Remove MDX/JSX component tags but try to keep text content
  // Remove self-closing tags: <Component ... />
  text = text.replace(/<[A-Z][a-zA-Z]*\s[^>]*\/>/g, '');
  // Remove opening/closing tags: <Component>...</Component>
  text = text.replace(/<\/?[A-Z][a-zA-Z]*[^>]*>/g, '');

  // 8. Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // 9. Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // 10. Remove markdown heading markers (##, ###, etc.) but keep text
  text = text.replace(/^#{1,6}\s+/gm, '');

  // 11. Remove bold/italic markers but keep text
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1'); // **bold**
  text = text.replace(/\*([^*]+)\*/g, '$1');     // *italic*
  text = text.replace(/__([^_]+)__/g, '$1');     // __bold__
  text = text.replace(/_([^_]+)_/g, '$1');       // _italic_

  // 12. Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');   // Unordered lists
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');   // Ordered lists

  // 13. Remove blockquote markers
  text = text.replace(/^>\s*/gm, '');

  // 14. Normalize whitespace
  text = text.replace(/\n{3,}/g, '\n\n');  // Max 2 newlines
  text = text.replace(/[ \t]+/g, ' ');      // Collapse spaces
  text = text.trim();

  return { title, speakableText: text };
}
