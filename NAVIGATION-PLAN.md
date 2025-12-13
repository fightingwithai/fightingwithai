# Navigation Improvements Plan

## Overview

This document outlines the implementation plan for improving navigation when the sidebar is collapsed or hidden on mobile devices.

**Problem**: When viewing content pages without the sidebar visible, users have:
- No sense of where they are in the hierarchy
- No way to navigate to previous/next content without opening the sidebar
- No visibility into content relationships (`relatesTo` data exists but isn't shown)

**Solution**: Add contextual navigation elements directly to content pages.

---

## Features

### 1. Breadcrumbs
Show the collection → title hierarchy above the page title.

```
Failure Modes → Spiraling
```

- Collection name links to homepage (or could anchor to that section)
- Current page title shown but not linked
- Muted styling that doesn't compete with the h1

**Mobile Header Enhancement**: Update the mobile header to show the current section name instead of just "Fighting With AI" when on a content page.

### 2. Previous/Next Navigation
Compact navigation links to adjacent content within the same collection.

```
← Context Collapse                              Stochastic Noise →
```

- Appears at **both top and bottom** of content
- Top placement: below breadcrumbs, above title
- Bottom placement: after main content (or after related section)
- Uses same ordering as sidebar:
  - Concepts: topological sort by `dependsOn`
  - Failure Modes: alphabetical by title
  - Patterns: alphabetical by title
- Shows nothing if at start/end of collection

### 3. Related Content Section
Surface the existing `relatesTo` frontmatter data.

```
Related
• Context Collapse
• Stochastic Noise
```

- Only appears if page has `relatesTo` data
- Currently used by 5 failure modes (none in patterns yet)
- Links show the actual title, not the slug

---

## Technical Implementation

### New Components

#### `src/components/Breadcrumbs.astro`

```astro
---
interface Props {
  collection: string;
  title: string;
}

const { collection, title } = Astro.props;

const collectionNames: Record<string, string> = {
  'concepts': 'Concepts',
  'failure-modes': 'Failure Modes',
  'patterns': 'Patterns'
};

const displayName = collectionNames[collection] || collection;
---

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <a href="/">{displayName}</a>
  <span class="separator">→</span>
  <span class="current">{title}</span>
</nav>

<style>
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-4);
  }

  .breadcrumbs a {
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .breadcrumbs a:hover {
    color: var(--color-accent);
  }

  .separator {
    color: var(--color-border);
  }

  .current {
    color: var(--color-text);
  }
</style>
```

#### `src/components/ContentNav.astro`

```astro
---
interface NavItem {
  slug: string;
  title: string;
  collection: string;
}

interface Props {
  prev: NavItem | null;
  next: NavItem | null;
}

const { prev, next } = Astro.props;
---

{(prev || next) && (
  <nav class="content-nav" aria-label="Page navigation">
    <div class="nav-prev">
      {prev && (
        <a href={`/${prev.collection}/${prev.slug}/`}>
          ← {prev.title}
        </a>
      )}
    </div>
    <div class="nav-next">
      {next && (
        <a href={`/${next.collection}/${next.slug}/`}>
          {next.title} →
        </a>
      )}
    </div>
  </nav>
)}

<style>
  .content-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) 0;
    font-size: var(--text-sm);
  }

  .nav-prev, .nav-next {
    flex: 1;
  }

  .nav-next {
    text-align: right;
  }

  .content-nav a {
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .content-nav a:hover {
    color: var(--color-accent);
  }
</style>
```

#### `src/components/RelatedContent.astro`

```astro
---
interface RelatedItem {
  slug: string;
  title: string;
  collection: string;
}

interface Props {
  items: RelatedItem[];
}

const { items } = Astro.props;
---

{items.length > 0 && (
  <aside class="related-content">
    <h2>Related</h2>
    <ul>
      {items.map((item) => (
        <li>
          <a href={`/${item.collection}/${item.slug}/`}>{item.title}</a>
        </li>
      ))}
    </ul>
  </aside>
)}

<style>
  .related-content {
    margin-top: var(--space-12);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
  }

  .related-content h2 {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wider);
    color: var(--color-text-muted);
    margin-bottom: var(--space-3);
  }

  .related-content ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .related-content li {
    margin-bottom: var(--space-2);
  }

  .related-content a {
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .related-content a:hover {
    color: var(--color-accent);
  }

  .related-content a::before {
    content: "• ";
    color: var(--color-border);
  }
</style>
```

### Modified Files

#### `src/pages/[collection]/[slug].astro`

```astro
---
import Layout from "../../layouts/Layout.astro";
import Breadcrumbs from "../../components/Breadcrumbs.astro";
import ContentNav from "../../components/ContentNav.astro";
import RelatedContent from "../../components/RelatedContent.astro";
import { getCollection } from "astro:content";
import { sortCollectionByDependency } from "../../utils/sortByDependency";

const collectionNames = ["concepts", "failure-modes", "patterns"] as const;

export async function getStaticPaths() {
  const paths = [];

  for (const collectionName of ["concepts", "failure-modes", "patterns"]) {
    const entries = await getCollection(collectionName);
    for (const entry of entries) {
      paths.push({
        params: { collection: collectionName, slug: entry.slug },
        props: { entry, collectionName },
      });
    }
  }

  return paths;
}

const { entry, collectionName } = Astro.props;
const { Content } = await entry.render();
const isPlaceholder = entry.body.trim().toLowerCase() === "todo";

// Get all entries in this collection for prev/next navigation
const allEntries = await getCollection(collectionName);

// Sort entries the same way as the sidebar
let sortedEntries;
if (collectionName === "concepts") {
  sortedEntries = sortCollectionByDependency(allEntries);
} else {
  sortedEntries = [...allEntries].sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );
}

// Find current position and calculate prev/next
const currentIndex = sortedEntries.findIndex((e) => e.slug === entry.slug);
const prevEntry = currentIndex > 0 ? sortedEntries[currentIndex - 1] : null;
const nextEntry = currentIndex < sortedEntries.length - 1
  ? sortedEntries[currentIndex + 1]
  : null;

// Format prev/next for component
const prev = prevEntry ? {
  slug: prevEntry.slug,
  title: prevEntry.data.title,
  collection: collectionName,
} : null;

const next = nextEntry ? {
  slug: nextEntry.slug,
  title: nextEntry.data.title,
  collection: collectionName,
} : null;

// Resolve related content (relatesTo slugs -> actual entries)
const relatedSlugs = entry.data.relatesTo || [];
const relatedItems = [];

for (const slug of relatedSlugs) {
  // relatesTo can reference any collection, so search all
  for (const searchCollection of collectionNames) {
    const allInCollection = await getCollection(searchCollection);
    const found = allInCollection.find((e) => e.slug === slug);
    if (found) {
      relatedItems.push({
        slug: found.slug,
        title: found.data.title,
        collection: searchCollection,
      });
      break;
    }
  }
}

// Collection display name for mobile header
const collectionDisplayNames: Record<string, string> = {
  'concepts': 'Concepts',
  'failure-modes': 'Failure Modes',
  'patterns': 'Patterns'
};
const currentSection = collectionDisplayNames[collectionName];
---

<Layout title={entry.data.title} currentSection={currentSection}>
  <article>
    <Breadcrumbs collection={collectionName} title={entry.data.title} />
    <ContentNav prev={prev} next={next} />

    <h1>{entry.data.title}</h1>

    {isPlaceholder ? (
      <div class="placeholder-notice">
        <p>This content is coming soon.</p>
      </div>
    ) : (
      <Content />
    )}

    <RelatedContent items={relatedItems} />
    <ContentNav prev={prev} next={next} />
  </article>
</Layout>
```

#### `src/layouts/Layout.astro`

Changes needed:
1. Add `currentSection` to Props interface
2. Update mobile header to show section name

```astro
// In the Props interface:
interface Props {
  title: string;
  description?: string;
  currentSection?: string;  // NEW
}

const {
  title,
  description = "Fighting With AI - Patterns of AI Coding",
  currentSection  // NEW
} = Astro.props;

// In the mobile header (around line 347-350):
<header class="mobile-header">
  <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu">☰</button>
  <span class="mobile-header-title">
    {currentSection || "Fighting With AI"}
  </span>
</header>
```

---

## Data Flow Summary

```
[collection]/[slug].astro
├── Fetches all entries in collection
├── Sorts entries (topological for concepts, alphabetical otherwise)
├── Calculates prev/next based on current position
├── Resolves relatesTo slugs → entry objects with titles
└── Passes data to components:
    ├── Breadcrumbs: collection, title
    ├── ContentNav: prev, next
    ├── RelatedContent: items[]
    └── Layout: currentSection (for mobile header)
```

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/Breadcrumbs.astro` | Create | Collection → Title navigation |
| `src/components/ContentNav.astro` | Create | Previous/Next links |
| `src/components/RelatedContent.astro` | Create | Related content section |
| `src/pages/[collection]/[slug].astro` | Modify | Wire up all components |
| `src/layouts/Layout.astro` | Modify | Mobile header enhancement |

---

## Future Considerations

Not in scope for this implementation, but could be added later:

- **Progress indicator**: "3 of 5 Failure Modes"
- **Prerequisites section**: Show `dependsOn` for concepts
- **Cross-collection relationships**: Currently `relatesTo` is only used in failure-modes
- **Back-references**: Show "Pages that link to this" (requires build-time graph)
