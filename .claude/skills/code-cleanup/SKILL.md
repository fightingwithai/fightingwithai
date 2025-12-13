# Code Cleanup Skill

## When to Use

After iterating on code with multiple changes, reversals, or simplifications - technical debt accumulates. Use this skill to systematically identify and clean it up.

**Triggers:**
- "clean up the code"
- "look for technical debt"
- "we iterated a lot, what can we simplify"
- After any feature that went through multiple revisions

## Process

### Phase 1: Audit (Don't Change Code Yet)

1. **Identify files touched** - What files were modified during iteration?

2. **Look for these patterns:**

   | Pattern | Description | Example |
   |---------|-------------|---------|
   | **Duplicated code** | Same logic/styles in multiple files | CSS copied across 3 pages |
   | **Dead code** | Unused functions, props, variables | `prev` prop passed but never used |
   | **Vestigial code** | Leftovers from removed features | `extractDescription()` for deleted UI |
   | **Inconsistent patterns** | Same thing done different ways | `flex` vs `text-align` for alignment |
   | **Over-abstraction** | Complexity added then never used | Interface with 5 fields, 2 used |
   | **Under-abstraction** | Copy-paste that should be shared | 3 nearly-identical page templates |

3. **Prioritize by impact:**
   - **High**: Dead code, unused props (easy wins, remove confusion)
   - **Medium**: Duplicated code (DRY violations, maintenance burden)
   - **Low**: Inconsistencies (style issues, not bugs)

4. **Create a summary** - List issues with line counts and fix complexity before touching code.

### Phase 2: Checkpoint

Before making cleanup changes:
1. Commit current working state
2. Use a clear message like "checkpoint before cleanup" or "feature complete, cleanup pending"

This ensures you can always get back to working code if cleanup introduces issues.

### Phase 3: Fix (In Order)

1. **Quick wins first** - Delete dead code, remove unused props
2. **Then consolidation** - Extract shared components/styles
3. **Finally polish** - Fix inconsistencies

After each logical chunk, verify the app still works.

## Common Cleanup Patterns

### Removing Dead Props

```typescript
// Before: prop accepted but never used
interface Props {
  prev: Item | null;  // ← dead
  next: Item | null;
}
const { prev, next } = Astro.props;
// prev never referenced...

// After: remove from interface and callers
interface Props {
  next: Item | null;
}
```

### Extracting Shared Styles

```astro
<!-- Before: duplicated in 3 files -->
<style>
  .nav { text-align: right; padding-top: var(--space-4); ... }
</style>

<!-- After: shared component or global styles -->
<NavFooter href="/next/" label="Next Item" />
```

### Removing Vestigial Functions

Look for functions that:
- Are defined but never called
- Return values that are stored but never used
- Compute things for UI elements that were removed

## Checklist

- [ ] Read all modified files
- [ ] List dead code (unused functions, props, variables)
- [ ] List duplicated code (same logic in multiple places)
- [ ] List inconsistencies (different approaches to same problem)
- [ ] Prioritize fixes
- [ ] Commit checkpoint before changes
- [ ] Make changes in priority order
- [ ] Verify app works after each chunk
- [ ] Final commit with cleanup summary

## Anti-Patterns to Avoid

- **Don't refactor while cleaning** - Cleanup removes debt, refactoring changes structure. Do one at a time.
- **Don't add features during cleanup** - Keep the diff focused on removal/consolidation.
- **Don't skip the checkpoint** - You'll regret it when cleanup breaks something subtle.
