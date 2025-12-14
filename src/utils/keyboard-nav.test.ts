import { describe, it, expect } from 'vitest';
import {
  isMobileMode,
  isTypingInInput,
  computeFilterVisibility,
  calculateNextHighlightIndex,
  parseKeyEvent,
  matchesShortcut,
  DEFAULT_CONFIG,
} from './keyboard-nav';

// ============================================================================
// isMobileMode
// ============================================================================

describe('isMobileMode', () => {
  it('returns true when viewport is at breakpoint', () => {
    expect(isMobileMode(768, 768)).toBe(true);
  });

  it('returns true when viewport is below breakpoint', () => {
    expect(isMobileMode(500, 768)).toBe(true);
  });

  it('returns false when viewport is above breakpoint', () => {
    expect(isMobileMode(1024, 768)).toBe(false);
  });

  it('returns false when viewport is just above breakpoint', () => {
    expect(isMobileMode(769, 768)).toBe(false);
  });

  it('works with custom breakpoints', () => {
    expect(isMobileMode(1000, 1024)).toBe(true);
    expect(isMobileMode(1025, 1024)).toBe(false);
  });
});

// ============================================================================
// isTypingInInput
// ============================================================================

describe('isTypingInInput', () => {
  it('returns false for null element', () => {
    expect(isTypingInInput(null)).toBe(false);
  });

  it('returns true for INPUT elements', () => {
    const input = document.createElement('input');
    expect(isTypingInInput(input)).toBe(true);
  });

  it('returns true for TEXTAREA elements', () => {
    const textarea = document.createElement('textarea');
    expect(isTypingInInput(textarea)).toBe(true);
  });

  it('returns true for contenteditable elements', () => {
    const div = document.createElement('div');
    div.setAttribute('contenteditable', 'true');
    expect(isTypingInInput(div)).toBe(true);
  });

  it('returns false for regular div elements', () => {
    const div = document.createElement('div');
    expect(isTypingInInput(div)).toBe(false);
  });

  it('returns false for button elements', () => {
    const button = document.createElement('button');
    expect(isTypingInInput(button)).toBe(false);
  });

  it('returns false for anchor elements', () => {
    const anchor = document.createElement('a');
    expect(isTypingInInput(anchor)).toBe(false);
  });
});

// ============================================================================
// computeFilterVisibility
// ============================================================================

describe('computeFilterVisibility', () => {
  function createNavItem(title: string): {
    element: HTMLElement;
    title: string;
    href: string;
  } {
    const el = document.createElement('a');
    el.textContent = title;
    return { element: el, title, href: `/${title.toLowerCase()}/` };
  }

  it('shows all items when query is empty', () => {
    const items = [
      createNavItem('First'),
      createNavItem('Second'),
      createNavItem('Third'),
    ];

    const visibility = computeFilterVisibility(items, '');

    expect(visibility.get(items[0].element)).toBe(true);
    expect(visibility.get(items[1].element)).toBe(true);
    expect(visibility.get(items[2].element)).toBe(true);
  });

  it('shows all items when query is whitespace', () => {
    const items = [createNavItem('First'), createNavItem('Second')];

    const visibility = computeFilterVisibility(items, '   ');

    expect(visibility.get(items[0].element)).toBe(true);
    expect(visibility.get(items[1].element)).toBe(true);
  });

  it('filters items by title match', () => {
    const items = [
      createNavItem('Context Pruning'),
      createNavItem('Context Expanding'),
      createNavItem('Failure Modes'),
    ];

    const visibility = computeFilterVisibility(items, 'context');

    expect(visibility.get(items[0].element)).toBe(true);
    expect(visibility.get(items[1].element)).toBe(true);
    expect(visibility.get(items[2].element)).toBe(false);
  });

  it('is case insensitive', () => {
    const items = [
      createNavItem('Hello World'),
      createNavItem('Goodbye'),
    ];

    const visibility = computeFilterVisibility(items, 'HELLO');

    expect(visibility.get(items[0].element)).toBe(true);
    expect(visibility.get(items[1].element)).toBe(false);
  });

  it('matches partial strings', () => {
    const items = [
      createNavItem('Introduction'),
      createNavItem('Getting Started'),
    ];

    const visibility = computeFilterVisibility(items, 'intro');

    expect(visibility.get(items[0].element)).toBe(true);
    expect(visibility.get(items[1].element)).toBe(false);
  });

  it('hides all items when no match', () => {
    const items = [createNavItem('Alpha'), createNavItem('Beta')];

    const visibility = computeFilterVisibility(items, 'xyz');

    expect(visibility.get(items[0].element)).toBe(false);
    expect(visibility.get(items[1].element)).toBe(false);
  });

  it('handles empty items array', () => {
    const visibility = computeFilterVisibility([], 'test');
    expect(visibility.size).toBe(0);
  });

  it('matches anywhere in title', () => {
    const items = [createNavItem('Advanced Topics')];

    const visibility = computeFilterVisibility(items, 'topic');

    expect(visibility.get(items[0].element)).toBe(true);
  });
});

// ============================================================================
// calculateNextHighlightIndex
// ============================================================================

describe('calculateNextHighlightIndex', () => {
  describe('moving down', () => {
    it('moves from -1 to 0', () => {
      expect(calculateNextHighlightIndex(-1, 5, 'down')).toBe(0);
    });

    it('moves from 0 to 1', () => {
      expect(calculateNextHighlightIndex(0, 5, 'down')).toBe(1);
    });

    it('wraps from last to first', () => {
      expect(calculateNextHighlightIndex(4, 5, 'down')).toBe(0);
    });

    it('stays at 0 for single item', () => {
      expect(calculateNextHighlightIndex(0, 1, 'down')).toBe(0);
    });
  });

  describe('moving up', () => {
    it('moves from 1 to 0', () => {
      expect(calculateNextHighlightIndex(1, 5, 'up')).toBe(0);
    });

    it('wraps from first to last', () => {
      expect(calculateNextHighlightIndex(0, 5, 'up')).toBe(4);
    });

    it('wraps from -1 to last', () => {
      expect(calculateNextHighlightIndex(-1, 5, 'up')).toBe(4);
    });

    it('stays at 0 for single item', () => {
      expect(calculateNextHighlightIndex(0, 1, 'up')).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('returns -1 when no items', () => {
      expect(calculateNextHighlightIndex(0, 0, 'down')).toBe(-1);
      expect(calculateNextHighlightIndex(0, 0, 'up')).toBe(-1);
    });

    it('handles two items correctly', () => {
      expect(calculateNextHighlightIndex(0, 2, 'down')).toBe(1);
      expect(calculateNextHighlightIndex(1, 2, 'down')).toBe(0);
      expect(calculateNextHighlightIndex(0, 2, 'up')).toBe(1);
      expect(calculateNextHighlightIndex(1, 2, 'up')).toBe(0);
    });
  });
});

// ============================================================================
// parseKeyEvent
// ============================================================================

describe('parseKeyEvent', () => {
  function createKeyEvent(
    key: string,
    modifiers: Partial<{
      ctrlKey: boolean;
      metaKey: boolean;
      altKey: boolean;
      shiftKey: boolean;
    }> = {}
  ): KeyboardEvent {
    return new KeyboardEvent('keydown', {
      key,
      ctrlKey: modifiers.ctrlKey ?? false,
      metaKey: modifiers.metaKey ?? false,
      altKey: modifiers.altKey ?? false,
      shiftKey: modifiers.shiftKey ?? false,
    });
  }

  it('normalizes key to lowercase', () => {
    const event = createKeyEvent('J');
    const parsed = parseKeyEvent(event);
    expect(parsed.key).toBe('j');
  });

  it('captures ctrl modifier', () => {
    const event = createKeyEvent('d', { ctrlKey: true });
    const parsed = parseKeyEvent(event);
    expect(parsed.ctrl).toBe(true);
    expect(parsed.meta).toBe(false);
  });

  it('captures meta modifier', () => {
    const event = createKeyEvent('d', { metaKey: true });
    const parsed = parseKeyEvent(event);
    expect(parsed.meta).toBe(true);
    expect(parsed.ctrl).toBe(false);
  });

  it('captures alt modifier', () => {
    const event = createKeyEvent('d', { altKey: true });
    const parsed = parseKeyEvent(event);
    expect(parsed.alt).toBe(true);
  });

  it('captures shift modifier', () => {
    const event = createKeyEvent('d', { shiftKey: true });
    const parsed = parseKeyEvent(event);
    expect(parsed.shift).toBe(true);
  });

  it('captures multiple modifiers', () => {
    const event = createKeyEvent('d', { ctrlKey: true, shiftKey: true });
    const parsed = parseKeyEvent(event);
    expect(parsed.ctrl).toBe(true);
    expect(parsed.shift).toBe(true);
    expect(parsed.meta).toBe(false);
    expect(parsed.alt).toBe(false);
  });

  it('handles special keys', () => {
    const escape = createKeyEvent('Escape');
    const enter = createKeyEvent('Enter');
    const arrow = createKeyEvent('ArrowDown');

    expect(parseKeyEvent(escape).key).toBe('escape');
    expect(parseKeyEvent(enter).key).toBe('enter');
    expect(parseKeyEvent(arrow).key).toBe('arrowdown');
  });
});

// ============================================================================
// matchesShortcut
// ============================================================================

describe('matchesShortcut', () => {
  it('matches simple key without modifiers', () => {
    const event = { key: 'n', ctrl: false, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'n' })).toBe(true);
  });

  it('does not match different key', () => {
    const event = { key: 'n', ctrl: false, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'j' })).toBe(false);
  });

  it('matches key with ctrl modifier', () => {
    const event = { key: 'd', ctrl: true, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'd', ctrl: true })).toBe(true);
  });

  it('does not match when ctrl required but not pressed', () => {
    const event = { key: 'd', ctrl: false, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'd', ctrl: true })).toBe(false);
  });

  it('does not match when ctrl pressed but not required', () => {
    const event = { key: 'd', ctrl: true, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'd' })).toBe(false);
  });

  it('matches key with meta modifier', () => {
    const event = { key: 'k', ctrl: false, meta: true, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'k', meta: true })).toBe(true);
  });

  it('does not match when meta required but not pressed', () => {
    const event = { key: 'k', ctrl: false, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'k', meta: true })).toBe(false);
  });

  it('matches key with alt modifier', () => {
    const event = { key: 'x', ctrl: false, meta: false, alt: true, shift: false };
    expect(matchesShortcut(event, { key: 'x', alt: true })).toBe(true);
  });

  it('does not match when alt required but not pressed', () => {
    const event = { key: 'x', ctrl: false, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'x', alt: true })).toBe(false);
  });

  it('matches ctrl+d shortcut', () => {
    const event = { key: 'd', ctrl: true, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'd', ctrl: true })).toBe(true);
  });

  it('matches ctrl+u shortcut', () => {
    const event = { key: 'u', ctrl: true, meta: false, alt: false, shift: false };
    expect(matchesShortcut(event, { key: 'u', ctrl: true })).toBe(true);
  });
});

// ============================================================================
// DEFAULT_CONFIG
// ============================================================================

describe('DEFAULT_CONFIG', () => {
  it('has all required selectors', () => {
    expect(DEFAULT_CONFIG.selectors.sidebar).toBe('#sidebar');
    expect(DEFAULT_CONFIG.selectors.overlay).toBe('#sidebar-overlay');
    expect(DEFAULT_CONFIG.selectors.filterInput).toBe('#sidebar-filter-input');
    expect(DEFAULT_CONFIG.selectors.navList).toBe('#nav-list');
    expect(DEFAULT_CONFIG.selectors.navItem).toBe('.nav-item');
    expect(DEFAULT_CONFIG.selectors.navSectionTitle).toBe('.nav-section-title');
    expect(DEFAULT_CONFIG.selectors.nextLink).toBe('.nav-next');
    expect(DEFAULT_CONFIG.selectors.menuButton).toBe('#mobile-menu-btn');
    expect(DEFAULT_CONFIG.selectors.closeButton).toBe('#sidebar-close');
  });

  it('has all required classes', () => {
    expect(DEFAULT_CONFIG.classes.sidebarOpen).toBe('open');
    expect(DEFAULT_CONFIG.classes.overlayVisible).toBe('visible');
    expect(DEFAULT_CONFIG.classes.filterHidden).toBe('filter-hidden');
    expect(DEFAULT_CONFIG.classes.filterHighlight).toBe('filter-highlight');
    expect(DEFAULT_CONFIG.classes.active).toBe('active');
  });

  it('has scroll configuration', () => {
    expect(DEFAULT_CONFIG.scroll.small).toBe(100);
    expect(DEFAULT_CONFIG.scroll.largeRatio).toBe(0.5);
  });

  it('has mobile breakpoint', () => {
    expect(DEFAULT_CONFIG.mobileBreakpoint).toBe(768);
  });

  it('has smooth scroll enabled by default', () => {
    expect(DEFAULT_CONFIG.smoothScroll).toBe(true);
  });
});

// ============================================================================
// Integration-style tests for shortcut combinations
// ============================================================================

describe('shortcut combinations', () => {
  function createParsedEvent(
    key: string,
    modifiers: Partial<{
      ctrl: boolean;
      meta: boolean;
      alt: boolean;
    }> = {}
  ) {
    return {
      key,
      ctrl: modifiers.ctrl ?? false,
      meta: modifiers.meta ?? false,
      alt: modifiers.alt ?? false,
      shift: false,
    };
  }

  describe('vim-style navigation', () => {
    it('j without modifiers matches scroll down', () => {
      const event = createParsedEvent('j');
      expect(matchesShortcut(event, { key: 'j' })).toBe(true);
    });

    it('k without modifiers matches scroll up', () => {
      const event = createParsedEvent('k');
      expect(matchesShortcut(event, { key: 'k' })).toBe(true);
    });

    it('n without modifiers matches next article', () => {
      const event = createParsedEvent('n');
      expect(matchesShortcut(event, { key: 'n' })).toBe(true);
    });

    it('h without modifiers matches toggle sidebar', () => {
      const event = createParsedEvent('h');
      expect(matchesShortcut(event, { key: 'h' })).toBe(true);
    });

    it('l without modifiers matches toggle sidebar', () => {
      const event = createParsedEvent('l');
      expect(matchesShortcut(event, { key: 'l' })).toBe(true);
    });

    it('t without modifiers matches focus filter', () => {
      const event = createParsedEvent('t');
      expect(matchesShortcut(event, { key: 't' })).toBe(true);
    });
  });

  describe('page scroll shortcuts', () => {
    it('ctrl+d matches page down', () => {
      const event = createParsedEvent('d', { ctrl: true });
      expect(matchesShortcut(event, { key: 'd', ctrl: true })).toBe(true);
    });

    it('ctrl+u matches page up', () => {
      const event = createParsedEvent('u', { ctrl: true });
      expect(matchesShortcut(event, { key: 'u', ctrl: true })).toBe(true);
    });

    it('plain d does not match ctrl+d', () => {
      const event = createParsedEvent('d');
      expect(matchesShortcut(event, { key: 'd', ctrl: true })).toBe(false);
    });

    it('plain u does not match ctrl+u', () => {
      const event = createParsedEvent('u');
      expect(matchesShortcut(event, { key: 'u', ctrl: true })).toBe(false);
    });
  });

  describe('escape key', () => {
    it('escape matches clear/close', () => {
      const event = createParsedEvent('escape');
      expect(matchesShortcut(event, { key: 'escape' })).toBe(true);
    });
  });

  describe('filter navigation', () => {
    it('arrowdown matches filter navigation', () => {
      const event = createParsedEvent('arrowdown');
      expect(matchesShortcut(event, { key: 'arrowdown' })).toBe(true);
    });

    it('arrowup matches filter navigation', () => {
      const event = createParsedEvent('arrowup');
      expect(matchesShortcut(event, { key: 'arrowup' })).toBe(true);
    });

    it('enter matches filter selection', () => {
      const event = createParsedEvent('enter');
      expect(matchesShortcut(event, { key: 'enter' })).toBe(true);
    });
  });
});
