---
title: Breadcrumbs
---

Breadcrumbs are hints you leave in code that point to related files. When the model explores your codebase, these references help it discover relevant context on its own.

A test file might include a comment noting which source file it covers. A component might reference the API endpoint it calls. The model follows these trails to build understanding without explicit instructions.

```js
// Tests: src/utils/formatDate.ts

describe('formatDate', () => {
  it('formats ISO dates', () => {
    expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
  });
});
```
