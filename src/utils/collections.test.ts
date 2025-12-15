import { describe, it, expect } from 'vitest';
import {
  sortAlphabetically,
  COLLECTION_CONFIG,
  COLLECTION_NAMES,
  getDisplayName,
  type CollectionName,
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

  it('each config has valid sortMethod', () => {
    for (const name of COLLECTION_NAMES) {
      const sortMethod = COLLECTION_CONFIG[name].sortMethod;
      expect(['dependency', 'alphabetical']).toContain(sortMethod);
    }
  });

  it('config keys match COLLECTION_NAMES', () => {
    const configKeys = Object.keys(COLLECTION_CONFIG).sort();
    const names = [...COLLECTION_NAMES].sort();
    expect(configKeys).toEqual(names);
  });
});

describe('COLLECTION_NAMES', () => {
  it('has at least one collection', () => {
    expect(COLLECTION_NAMES.length).toBeGreaterThan(0);
  });

  it('concepts is first (foundational knowledge)', () => {
    expect(COLLECTION_NAMES[0]).toBe('concepts');
  });

  it('has no duplicates', () => {
    const unique = new Set(COLLECTION_NAMES);
    expect(unique.size).toBe(COLLECTION_NAMES.length);
  });

  it('all names are valid slugs (lowercase, hyphens only)', () => {
    for (const name of COLLECTION_NAMES) {
      expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});

describe('getDisplayName', () => {
  it('returns display name for each collection', () => {
    for (const name of COLLECTION_NAMES) {
      const displayName = getDisplayName(name);
      expect(displayName).toBeTruthy();
      expect(typeof displayName).toBe('string');
    }
  });

  it('display names are title case or contain spaces', () => {
    for (const name of COLLECTION_NAMES) {
      const displayName = getDisplayName(name);
      // Display name should start with uppercase
      expect(displayName[0]).toBe(displayName[0].toUpperCase());
    }
  });

  it('matches config displayName', () => {
    for (const name of COLLECTION_NAMES) {
      expect(getDisplayName(name)).toBe(COLLECTION_CONFIG[name].displayName);
    }
  });
});
