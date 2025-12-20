# Magic Links System

Wikipedia-style links using `@sailkit/atlas`.

## Syntax

```markdown
[[context-collapse]]                     → [context-collapse](/concepts/context-collapse/)
[[context-collapse|Learn about context]] → [Learn about context](/concepts/context-collapse/)

[:context-collapse]                      → same, alternate syntax
[:context-collapse|Learn about context]  → same with display text
```

## Configuration

```javascript
// astro.config.mjs
import { remarkMagicLinks } from '@sailkit/atlas';

remarkPlugins: [[remarkMagicLinks, {
  urlBuilder: (id) => `/concepts/${id}/`,
  syntax: 'both',
}]]
```

## How It Works

1. Write `[[some-page]]` in markdown
2. Remark plugin finds it in text nodes (not code blocks)
3. Transforms to `[some-page](/concepts/some-page/)` using `urlBuilder`

No frontmatter required. No validation. The ID is the slug.
