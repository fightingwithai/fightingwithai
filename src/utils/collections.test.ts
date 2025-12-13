import { describe, it, expect } from 'vitest';
import {
  sortAlphabetically,
  COLLECTION_CONFIG,
  COLLECTION_NAMES,
  getDisplayName,
} from './collections-config';

describe('sortAlphabetically', () => {
  it('sorts entries by title ascending', () => {
    const entries = [
      { data: { title: 'Zebra' } },
      { data: { title: 'Alpha' } },
      { data: { title: 'Middle' } },
    ];

    const result = sortAlphabetically(entries);

    expect(result.map(e => e.data.title)).toEqual(['Alpha', 'Middle', 'Zebra']);
  });

  it('returns empty array for empty input', () => {
    expect(sortAlphabetically([])).toEqual([]);
  });

  it('handles single item', () => {
    const entries = [{ data: { title: 'Only' } }];
    const result = sortAlphabetically(entries);
    expect(result).toEqual([{ data: { title: 'Only' } }]);
  });

  it('does not mutate original array', () => {
    const original = [
      { data: { title: 'B' } },
      { data: { title: 'A' } },
    ];
    const originalCopy = [...original];

    sortAlphabetically(original);

    expect(original).toEqual(originalCopy);
  });

  it('handles case-sensitive sorting (uppercase before lowercase in locale)', () => {
    const entries = [
      { data: { title: 'banana' } },
      { data: { title: 'Apple' } },
    ];

    const result = sortAlphabetically(entries);

    // localeCompare typically puts Apple before banana
    expect(result.map(e => e.data.title)).toEqual(['Apple', 'banana']);
  });

  it('preserves additional properties on entries', () => {
    const entries = [
      { data: { title: 'B' }, slug: 'b-slug', extra: 123 },
      { data: { title: 'A' }, slug: 'a-slug', extra: 456 },
    ];

    const result = sortAlphabetically(entries);

    expect(result[0]).toEqual({ data: { title: 'A' }, slug: 'a-slug', extra: 456 });
    expect(result[1]).toEqual({ data: { title: 'B' }, slug: 'b-slug', extra: 123 });
  });
});

describe('COLLECTION_CONFIG', () => {
  it('has configuration for all collection names', () => {
    for (const name of COLLECTION_NAMES) {
      expect(COLLECTION_CONFIG[name]).toBeDefined();
      expect(COLLECTION_CONFIG[name].slug).toBe(name);
      expect(COLLECTION_CONFIG[name].displayName).toBeTruthy();
      expect(COLLECTION_CONFIG[name].description).toBeTruthy();
      expect(['dependency', 'alphabetical']).toContain(COLLECTION_CONFIG[name].sortMethod);
    }
  });

  it('concepts uses dependency sort', () => {
    expect(COLLECTION_CONFIG['concepts'].sortMethod).toBe('dependency');
  });

  it('failure-modes uses alphabetical sort', () => {
    expect(COLLECTION_CONFIG['failure-modes'].sortMethod).toBe('alphabetical');
  });

  it('patterns uses alphabetical sort', () => {
    expect(COLLECTION_CONFIG['patterns'].sortMethod).toBe('alphabetical');
  });
});

describe('COLLECTION_NAMES', () => {
  it('contains all expected collections', () => {
    expect(COLLECTION_NAMES).toContain('concepts');
    expect(COLLECTION_NAMES).toContain('failure-modes');
    expect(COLLECTION_NAMES).toContain('patterns');
  });

  it('maintains order: concepts, failure-modes, patterns', () => {
    expect(COLLECTION_NAMES).toEqual(['concepts', 'failure-modes', 'patterns']);
  });
});

describe('getDisplayName', () => {
  it('returns correct display name for concepts', () => {
    expect(getDisplayName('concepts')).toBe('Concepts');
  });

  it('returns correct display name for failure-modes', () => {
    expect(getDisplayName('failure-modes')).toBe('Failure Modes');
  });

  it('returns correct display name for patterns', () => {
    expect(getDisplayName('patterns')).toBe('Patterns');
  });
});
