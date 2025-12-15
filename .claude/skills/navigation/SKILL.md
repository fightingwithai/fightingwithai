# Navigation Skill

## Philosophy

Navigation follows the Neovim documentation approach: **minimal, content-first**.

- Simple text links, not cards or buttons
- Previous link on left, next link on right
- Section labels only when crossing to a new section

## Navigation Flow

```
Home → Concepts (section) → Large Language Models → Agents → Context →
       ↓ (section crossing)
       Failure Modes (section) → Context Collapse → ...
```

Users read sequentially by clicking "next". The sidebar provides random access.

## Components

### ContentNav (`src/components/ContentNav.astro`)

Used on **article pages** (`[collection]/[slug].astro`).

```astro
<ContentNav prev={prev} next={next} currentCollection={collectionName} />
```

**Behavior:**
- Shows previous link on left, next link on right (flexbox layout)
- When navigating within same section: shows just title
- When crossing sections: shows section label above title
- Boundary handling: no prev on first page, no next on last page

**Example output (within section):**
```
← Large Language Models                    Context →
```

**Example output (crossing sections):**
```
← Context Engineering              PROMPT ENGINEERING
                               Adversarial Prompting →
```

### Section Index Pages

Each section index (`concepts/index.astro`, etc.) has inline navigation:

```astro
<nav class="section-nav">
  <a href={`/concepts/${firstItem.slug}/`} class="nav-next">
    {firstItem.data.title} →
  </a>
</nav>
```

**Key:** Links to first article in section, not next section.

## Styling Pattern

All navigation uses the same minimal style:

```css
.content-nav {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  font-size: var(--text-sm);
}

.nav-prev,
.nav-next {
  color: var(--color-accent);
}

.nav-next {
  text-align: right;
}

.section-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}
```

## Rules

### DO:
- Keep navigation minimal - just links with arrows
- Previous on left, next on right (flexbox space-between)
- Use border-top separator
- Show section label only when crossing sections
- Link section indexes to first article

### DON'T:
- Add cards, backgrounds, or borders around links
- Put navigation at both top and bottom (just bottom)
- Link section indexes to next section (link to first article)
- Add descriptions or metadata to nav links

## Files

| File | Purpose |
|------|---------|
| `src/components/ContentNav.astro` | Article page navigation |
| `src/pages/concepts/index.astro` | Concepts section index |
| `src/pages/failure-modes/index.astro` | Failure Modes section index |
| `src/pages/patterns/index.astro` | Patterns section index |
| `src/pages/index.astro` | Home page with entry link |

## Adding a New Section

1. Create `src/pages/[new-section]/index.astro`
2. Add navigation linking to first article
3. Update `src/pages/[collection]/[slug].astro` if needed
4. Ensure ContentNav handles the new collection name
