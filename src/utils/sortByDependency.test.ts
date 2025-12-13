import { describe, it, expect } from 'vitest';
import { sortByDependency, sortCollectionByDependency, type DependencyItem } from './sortByDependency';

describe('sortByDependency', () => {
  describe('edge cases', () => {
    it('returns empty array for empty input', () => {
      expect(sortByDependency([])).toEqual([]);
    });

    it('returns single item unchanged', () => {
      const items = [{ id: 'only' }];
      expect(sortByDependency(items)).toEqual([{ id: 'only' }]);
    });

    it('returns single item with undefined dependsOn', () => {
      const items = [{ id: 'only', dependsOn: undefined }];
      expect(sortByDependency(items)).toEqual([{ id: 'only', dependsOn: undefined }]);
    });
  });

  describe('simple chains', () => {
    it('sorts a two-item chain correctly', () => {
      const items: DependencyItem[] = [
        { id: 'second', dependsOn: 'first' },
        { id: 'first' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['first', 'second']);
    });

    it('sorts a three-item chain correctly', () => {
      const items: DependencyItem[] = [
        { id: 'third', dependsOn: 'second' },
        { id: 'first' },
        { id: 'second', dependsOn: 'first' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['first', 'second', 'third']);
    });

    it('handles chain in reverse input order', () => {
      const items: DependencyItem[] = [
        { id: 'a' },
        { id: 'b', dependsOn: 'a' },
        { id: 'c', dependsOn: 'b' },
        { id: 'd', dependsOn: 'c' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['a', 'b', 'c', 'd']);
    });

    it('handles chain in scrambled input order', () => {
      const items: DependencyItem[] = [
        { id: 'c', dependsOn: 'b' },
        { id: 'a' },
        { id: 'd', dependsOn: 'c' },
        { id: 'b', dependsOn: 'a' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('multiple chains (multiple heads)', () => {
    it('handles two independent items (both are heads)', () => {
      const items: DependencyItem[] = [
        { id: 'beta' },
        { id: 'alpha' },
      ];
      const result = sortByDependency(items);
      // Heads sorted alphabetically
      expect(result.map(i => i.id)).toEqual(['alpha', 'beta']);
    });

    it('handles two separate chains', () => {
      const items: DependencyItem[] = [
        { id: 'chain1-b', dependsOn: 'chain1-a' },
        { id: 'chain2-b', dependsOn: 'chain2-a' },
        { id: 'chain1-a' },
        { id: 'chain2-a' },
      ];
      const result = sortByDependency(items);
      // Both heads, then their dependents
      expect(result.map(i => i.id)).toEqual([
        'chain1-a', 'chain1-b',
        'chain2-a', 'chain2-b',
      ]);
    });

    it('handles mixed: some items in chains, some standalone', () => {
      const items: DependencyItem[] = [
        { id: 'standalone' },
        { id: 'chained-b', dependsOn: 'chained-a' },
        { id: 'chained-a' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['chained-a', 'chained-b', 'standalone']);
    });
  });

  describe('branching (multiple items depend on same parent)', () => {
    it('handles two items depending on the same parent', () => {
      const items: DependencyItem[] = [
        { id: 'parent' },
        { id: 'child-b', dependsOn: 'parent' },
        { id: 'child-a', dependsOn: 'parent' },
      ];
      const result = sortByDependency(items);
      // Children sorted alphabetically
      expect(result.map(i => i.id)).toEqual(['parent', 'child-a', 'child-b']);
    });

    it('handles tree structure', () => {
      // Tree:     root
      //          /    \
      //       left    right
      //        |
      //     left-child
      const items: DependencyItem[] = [
        { id: 'left-child', dependsOn: 'left' },
        { id: 'right', dependsOn: 'root' },
        { id: 'left', dependsOn: 'root' },
        { id: 'root' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['root', 'left', 'left-child', 'right']);
    });
  });

  describe('missing dependencies', () => {
    it('treats item with non-existent dependsOn as a head', () => {
      const items: DependencyItem[] = [
        { id: 'orphan', dependsOn: 'does-not-exist' },
        { id: 'normal' },
      ];
      const result = sortByDependency(items);
      // Both are heads (orphan's dependency doesn't exist)
      expect(result.map(i => i.id)).toEqual(['normal', 'orphan']);
    });

    it('chains still work even if some items reference missing deps', () => {
      const items: DependencyItem[] = [
        { id: 'orphan', dependsOn: 'missing' },
        { id: 'second', dependsOn: 'first' },
        { id: 'first' },
      ];
      const result = sortByDependency(items);
      expect(result.map(i => i.id)).toEqual(['first', 'second', 'orphan']);
    });
  });

  describe('cycle handling', () => {
    it('handles self-referential item (cycle of 1)', () => {
      const items: DependencyItem[] = [
        { id: 'self-loop', dependsOn: 'self-loop' },
        { id: 'normal' },
      ];
      const result = sortByDependency(items);
      // self-loop depends on itself which doesn't exist yet, so treated as missing dep
      expect(result.length).toBe(2);
      expect(result.map(i => i.id)).toContain('normal');
      expect(result.map(i => i.id)).toContain('self-loop');
    });

    it('handles two-item cycle without infinite loop', () => {
      const items: DependencyItem[] = [
        { id: 'a', dependsOn: 'b' },
        { id: 'b', dependsOn: 'a' },
      ];
      const result = sortByDependency(items);
      // Both depend on each other - neither is a valid head
      // Algorithm should still complete without hanging
      expect(result.length).toBe(2);
    });

    it('handles cycle with valid chain attached', () => {
      const items: DependencyItem[] = [
        { id: 'normal-head' },
        { id: 'normal-tail', dependsOn: 'normal-head' },
        { id: 'cycle-a', dependsOn: 'cycle-b' },
        { id: 'cycle-b', dependsOn: 'cycle-a' },
      ];
      const result = sortByDependency(items);
      expect(result.length).toBe(4);
      // Normal chain should be intact
      const normalHeadIdx = result.findIndex(i => i.id === 'normal-head');
      const normalTailIdx = result.findIndex(i => i.id === 'normal-tail');
      expect(normalHeadIdx).toBeLessThan(normalTailIdx);
    });
  });

  describe('preserves original objects', () => {
    it('returns the same object references', () => {
      const first = { id: 'first', extra: 'data1' };
      const second = { id: 'second', dependsOn: 'first', extra: 'data2' };
      const items = [second, first];

      const result = sortByDependency(items);

      expect(result[0]).toBe(first);
      expect(result[1]).toBe(second);
    });
  });

  describe('deterministic ordering', () => {
    it('produces same output regardless of input order', () => {
      const items1: DependencyItem[] = [
        { id: 'c', dependsOn: 'b' },
        { id: 'a' },
        { id: 'b', dependsOn: 'a' },
      ];

      const items2: DependencyItem[] = [
        { id: 'a' },
        { id: 'b', dependsOn: 'a' },
        { id: 'c', dependsOn: 'b' },
      ];

      const items3: DependencyItem[] = [
        { id: 'b', dependsOn: 'a' },
        { id: 'c', dependsOn: 'b' },
        { id: 'a' },
      ];

      const result1 = sortByDependency(items1).map(i => i.id);
      const result2 = sortByDependency(items2).map(i => i.id);
      const result3 = sortByDependency(items3).map(i => i.id);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toEqual(['a', 'b', 'c']);
    });
  });
});

describe('sortCollectionByDependency', () => {
  it('sorts Astro collection entries by dependsOn', () => {
    const entries = [
      { slug: 'tools', data: { title: 'Tools', dependsOn: 'context' } },
      { slug: 'context', data: { title: 'Context', dependsOn: 'large-language-models' } },
      { slug: 'large-language-models', data: { title: 'LLMs' } },
      { slug: 'agents', data: { title: 'Agents', dependsOn: 'tools' } },
    ];

    const result = sortCollectionByDependency(entries);

    expect(result.map(e => e.slug)).toEqual([
      'large-language-models',
      'context',
      'tools',
      'agents',
    ]);
  });

  it('preserves all original entry properties', () => {
    const entries = [
      { slug: 'second', data: { title: 'Second', dependsOn: 'first', extra: 123 } },
      { slug: 'first', data: { title: 'First' } },
    ];

    const result = sortCollectionByDependency(entries);

    expect(result[0].data.title).toBe('First');
    expect(result[1].data.title).toBe('Second');
    expect((result[1].data as any).extra).toBe(123);
  });

  it('handles entries with no dependsOn', () => {
    const entries = [
      { slug: 'zebra', data: { title: 'Zebra' } },
      { slug: 'alpha', data: { title: 'Alpha' } },
    ];

    const result = sortCollectionByDependency(entries);
    // All are heads, sorted alphabetically by slug
    expect(result.map(e => e.slug)).toEqual(['alpha', 'zebra']);
  });
});
