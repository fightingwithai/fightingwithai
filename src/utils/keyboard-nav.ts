/**
 * Keyboard Navigation Module
 *
 * A modular, testable keyboard navigation system for documentation sites.
 * Provides vim-style navigation, sidebar filtering, and mobile sidebar control.
 *
 * Designed for potential extraction as a standalone plugin.
 */

import fuzzysort from 'fuzzysort';

// ============================================================================
// Types & Configuration
// ============================================================================

export interface KeyboardNavConfig {
  /** Selectors for DOM elements */
  selectors: {
    sidebar: string;
    overlay: string;
    filterInput: string;
    navList: string;
    navItem: string;
    navSectionTitle: string;
    nextLink: string;
    menuButton: string;
    closeButton: string;
  };
  /** CSS classes used by the system */
  classes: {
    sidebarOpen: string;
    overlayVisible: string;
    filterHidden: string;
    filterHighlight: string;
    active: string;
  };
  /** Scroll amounts */
  scroll: {
    /** Small scroll increment (j/k) */
    small: number;
    /** Large scroll ratio of viewport (Ctrl+D/U) */
    largeRatio: number;
  };
  /** Breakpoint for mobile detection */
  mobileBreakpoint: number;
  /** Enable smooth scrolling */
  smoothScroll: boolean;
}

export interface KeyboardNavState {
  /** Current filter highlight index */
  filterHighlightIndex: number;
  /** Saved sidebar scroll position */
  sidebarScrollPosition: number;
}

export interface NavItem {
  element: HTMLElement;
  title: string;
  href: string;
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_CONFIG: KeyboardNavConfig = {
  selectors: {
    sidebar: '#sidebar',
    overlay: '#sidebar-overlay',
    filterInput: '#sidebar-filter-input',
    navList: '#nav-list',
    navItem: '.nav-item',
    navSectionTitle: '.nav-section-title',
    nextLink: '.nav-next',
    menuButton: '#mobile-menu-btn',
    closeButton: '#sidebar-close',
  },
  classes: {
    sidebarOpen: 'open',
    overlayVisible: 'visible',
    filterHidden: 'filter-hidden',
    filterHighlight: 'filter-highlight',
    active: 'active',
  },
  scroll: {
    small: 100,
    largeRatio: 0.5,
  },
  mobileBreakpoint: 768,
  smoothScroll: true,
};

// ============================================================================
// Pure Helper Functions (Testable)
// ============================================================================

/**
 * Check if we're in mobile mode based on viewport width
 */
export function isMobileMode(
  viewportWidth: number,
  breakpoint: number
): boolean {
  return viewportWidth <= breakpoint;
}

/**
 * Check if the active element is an input that should block shortcuts
 */
export function isTypingInInput(activeElement: Element | null): boolean {
  if (!activeElement) return false;

  const tagName = activeElement.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;

  // Check both the property and the attribute for contentEditable
  // (property for browser, attribute for jsdom compatibility)
  const htmlElement = activeElement as HTMLElement;
  if (htmlElement.isContentEditable) return true;
  if (htmlElement.getAttribute?.('contenteditable') === 'true') return true;

  return false;
}

/**
 * Filter nav items based on a query string using fuzzy matching
 * Returns which items and sections should be visible
 */
export function computeFilterVisibility(
  items: NavItem[],
  query: string
): Map<HTMLElement, boolean> {
  const visibility = new Map<HTMLElement, boolean>();
  const normalizedQuery = query.trim();

  // If no query, show everything
  if (!normalizedQuery) {
    for (const item of items) {
      visibility.set(item.element, true);
    }
    return visibility;
  }

  // Use fuzzysort for fuzzy matching
  const results = fuzzysort.go(normalizedQuery, items, {
    key: 'title',
    threshold: -10000, // Allow loose matches
  });

  // Create a set of matched elements for quick lookup
  const matchedElements = new Set(results.map((r) => r.obj.element));

  for (const item of items) {
    visibility.set(item.element, matchedElements.has(item.element));
  }

  return visibility;
}

/**
 * Determine which section titles should be visible based on their items
 */
export function computeSectionVisibility(
  sectionTitles: HTMLElement[],
  navItems: HTMLElement[],
  itemVisibility: Map<HTMLElement, boolean>
): Map<HTMLElement, boolean> {
  const visibility = new Map<HTMLElement, boolean>();

  for (const section of sectionTitles) {
    // Find all items that belong to this section (items after this title, before next title)
    let hasVisibleItem = false;
    let currentElement = section.nextElementSibling;

    while (currentElement) {
      if (
        currentElement.classList.contains('nav-section-title') ||
        currentElement.classList.contains(
          sectionTitles[0]?.className.split(' ')[0] || 'nav-section-title'
        )
      ) {
        break;
      }

      if (navItems.includes(currentElement as HTMLElement)) {
        if (itemVisibility.get(currentElement as HTMLElement)) {
          hasVisibleItem = true;
          break;
        }
      }

      currentElement = currentElement.nextElementSibling;
    }

    visibility.set(section, hasVisibleItem);
  }

  return visibility;
}

/**
 * Calculate the next highlight index for filter navigation
 */
export function calculateNextHighlightIndex(
  currentIndex: number,
  totalItems: number,
  direction: 'up' | 'down'
): number {
  if (totalItems === 0) return -1;

  if (direction === 'down') {
    return currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
  } else {
    return currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
  }
}

/**
 * Parse a keyboard event into a normalized key descriptor
 */
export function parseKeyEvent(event: KeyboardEvent): {
  key: string;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
} {
  return {
    key: event.key.toLowerCase(),
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    alt: event.altKey,
    shift: event.shiftKey,
  };
}

/**
 * Check if a key matches a shortcut definition
 */
export function matchesShortcut(
  event: ReturnType<typeof parseKeyEvent>,
  shortcut: {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    alt?: boolean;
  }
): boolean {
  if (event.key !== shortcut.key) return false;
  if (shortcut.ctrl && !event.ctrl) return false;
  if (!shortcut.ctrl && event.ctrl) return false;
  if (shortcut.meta && !event.meta) return false;
  if (shortcut.alt && !event.alt) return false;
  return true;
}

// ============================================================================
// DOM Interaction Layer
// ============================================================================

/**
 * Create a DOM helper bound to a specific configuration
 */
export function createDOMHelper(config: KeyboardNavConfig) {
  function getElement<T extends HTMLElement>(selector: string): T | null {
    return document.querySelector(selector);
  }

  function getAllElements<T extends HTMLElement>(selector: string): T[] {
    return Array.from(document.querySelectorAll(selector));
  }

  return {
    getSidebar: () => getElement<HTMLElement>(config.selectors.sidebar),
    getOverlay: () => getElement<HTMLElement>(config.selectors.overlay),
    getFilterInput: () =>
      getElement<HTMLInputElement>(config.selectors.filterInput),
    getNavList: () => getElement<HTMLElement>(config.selectors.navList),
    getNavItems: () => getAllElements<HTMLAnchorElement>(config.selectors.navItem),
    getNavSectionTitles: () =>
      getAllElements<HTMLElement>(config.selectors.navSectionTitle),
    getNextLink: () => getElement<HTMLAnchorElement>(config.selectors.nextLink),
    getMenuButton: () => getElement<HTMLButtonElement>(config.selectors.menuButton),
    getCloseButton: () =>
      getElement<HTMLButtonElement>(config.selectors.closeButton),

    getVisibleNavItems: () =>
      getAllElements<HTMLAnchorElement>(config.selectors.navItem).filter(
        (item) => !item.classList.contains(config.classes.filterHidden)
      ),
  };
}

// ============================================================================
// Sidebar Controller
// ============================================================================

export function createSidebarController(
  config: KeyboardNavConfig,
  dom: ReturnType<typeof createDOMHelper>,
  state: KeyboardNavState
) {
  function open() {
    const sidebar = dom.getSidebar();
    const overlay = dom.getOverlay();

    sidebar?.classList.add(config.classes.sidebarOpen);
    overlay?.classList.add(config.classes.overlayVisible);

    // Restore scroll position
    if (sidebar) {
      sidebar.scrollTop = state.sidebarScrollPosition;
    }
  }

  function close() {
    const sidebar = dom.getSidebar();
    const overlay = dom.getOverlay();

    // Save scroll position before closing
    if (sidebar) {
      state.sidebarScrollPosition = sidebar.scrollTop;
    }

    sidebar?.classList.remove(config.classes.sidebarOpen);
    overlay?.classList.remove(config.classes.overlayVisible);
  }

  function toggle() {
    const sidebar = dom.getSidebar();
    if (sidebar?.classList.contains(config.classes.sidebarOpen)) {
      close();
    } else {
      open();
    }
  }

  function isOpen() {
    return (
      dom.getSidebar()?.classList.contains(config.classes.sidebarOpen) ?? false
    );
  }

  return { open, close, toggle, isOpen };
}

// ============================================================================
// Filter Controller
// ============================================================================

export function createFilterController(
  config: KeyboardNavConfig,
  dom: ReturnType<typeof createDOMHelper>,
  state: KeyboardNavState
) {
  function applyFilter(query: string) {
    const navItems = dom.getNavItems();
    const sectionTitles = dom.getNavSectionTitles();

    const items: NavItem[] = navItems.map((el) => ({
      element: el,
      title: el.textContent || '',
      href: el.getAttribute('href') || '',
    }));

    const itemVisibility = computeFilterVisibility(items, query);
    const sectionVisibility = computeSectionVisibility(
      sectionTitles,
      navItems,
      itemVisibility
    );

    // Apply visibility to items
    for (const [element, visible] of itemVisibility) {
      element.classList.toggle(config.classes.filterHidden, !visible);
    }

    // Apply visibility to sections
    for (const [element, visible] of sectionVisibility) {
      element.classList.toggle(config.classes.filterHidden, !visible);
    }

    // Reset highlight
    resetHighlight();
  }

  function resetHighlight() {
    state.filterHighlightIndex = -1;
    dom.getNavItems().forEach((item) => {
      item.classList.remove(config.classes.filterHighlight);
    });
  }

  function updateHighlight(newIndex: number) {
    const items = dom.getVisibleNavItems();

    // Remove previous highlight
    items.forEach((item) => item.classList.remove(config.classes.filterHighlight));

    state.filterHighlightIndex = newIndex;

    // Add new highlight
    if (newIndex >= 0 && newIndex < items.length) {
      items[newIndex].classList.add(config.classes.filterHighlight);
      items[newIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function moveHighlight(direction: 'up' | 'down') {
    const items = dom.getVisibleNavItems();
    const newIndex = calculateNextHighlightIndex(
      state.filterHighlightIndex,
      items.length,
      direction
    );
    updateHighlight(newIndex);
  }

  function selectHighlighted(): string | null {
    const items = dom.getVisibleNavItems();
    const index = state.filterHighlightIndex;

    if (index >= 0 && index < items.length) {
      return items[index].getAttribute('href');
    }

    // If only one result, select it
    if (items.length === 1) {
      return items[0].getAttribute('href');
    }

    return null;
  }

  function clear() {
    const input = dom.getFilterInput();
    if (input) {
      input.value = '';
    }
    applyFilter('');
  }

  function focus() {
    const input = dom.getFilterInput();
    input?.focus();
    input?.select();
  }

  return {
    applyFilter,
    resetHighlight,
    updateHighlight,
    moveHighlight,
    selectHighlighted,
    clear,
    focus,
  };
}

// ============================================================================
// Scroll Controller
// ============================================================================

export function createScrollController(config: KeyboardNavConfig) {
  const behavior = config.smoothScroll ? 'smooth' : 'auto';

  function scrollSmall(direction: 'up' | 'down') {
    const amount = direction === 'down' ? config.scroll.small : -config.scroll.small;
    window.scrollBy({ top: amount, behavior });
  }

  function scrollLarge(direction: 'up' | 'down') {
    const amount =
      direction === 'down'
        ? window.innerHeight * config.scroll.largeRatio
        : -window.innerHeight * config.scroll.largeRatio;
    window.scrollBy({ top: amount, behavior });
  }

  return { scrollSmall, scrollLarge };
}

// ============================================================================
// Keyboard Handler
// ============================================================================

export function createKeyboardHandler(
  config: KeyboardNavConfig,
  dom: ReturnType<typeof createDOMHelper>,
  sidebar: ReturnType<typeof createSidebarController>,
  filter: ReturnType<typeof createFilterController>,
  scroll: ReturnType<typeof createScrollController>
) {
  function handleFilterKeydown(event: KeyboardEvent) {
    const parsed = parseKeyEvent(event);

    // Arrow down or j - move highlight down
    if (
      matchesShortcut(parsed, { key: 'arrowdown' }) ||
      matchesShortcut(parsed, { key: 'j' })
    ) {
      event.preventDefault();
      filter.moveHighlight('down');
      return;
    }

    // Arrow up or k - move highlight up
    if (
      matchesShortcut(parsed, { key: 'arrowup' }) ||
      matchesShortcut(parsed, { key: 'k' })
    ) {
      event.preventDefault();
      filter.moveHighlight('up');
      return;
    }

    // Enter - select highlighted
    if (matchesShortcut(parsed, { key: 'enter' })) {
      event.preventDefault();
      const href = filter.selectHighlighted();
      if (href) {
        window.location.href = href;
      }
      return;
    }

    // Escape - clear and blur
    if (matchesShortcut(parsed, { key: 'escape' })) {
      event.preventDefault();
      filter.clear();
      dom.getFilterInput()?.blur();
      return;
    }
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    const activeElement = document.activeElement;
    const filterInput = dom.getFilterInput();

    // If in filter input, let filter handler deal with it
    if (activeElement === filterInput) {
      return;
    }

    // Block shortcuts when typing in other inputs
    if (isTypingInInput(activeElement)) {
      return;
    }

    const parsed = parseKeyEvent(event);
    const inMobileMode = isMobileMode(window.innerWidth, config.mobileBreakpoint);

    // n - Go to next article
    if (matchesShortcut(parsed, { key: 'n' })) {
      const nextLink = dom.getNextLink();
      if (nextLink) {
        event.preventDefault();
        window.location.href = nextLink.getAttribute('href') || '';
      }
      return;
    }

    // j - Scroll down (small)
    if (matchesShortcut(parsed, { key: 'j' })) {
      event.preventDefault();
      scroll.scrollSmall('down');
      return;
    }

    // k - Scroll up (small)
    if (matchesShortcut(parsed, { key: 'k' })) {
      event.preventDefault();
      scroll.scrollSmall('up');
      return;
    }

    // Ctrl+D - Scroll down (large)
    if (matchesShortcut(parsed, { key: 'd', ctrl: true })) {
      event.preventDefault();
      scroll.scrollLarge('down');
      return;
    }

    // Ctrl+U - Scroll up (large)
    if (matchesShortcut(parsed, { key: 'u', ctrl: true })) {
      event.preventDefault();
      scroll.scrollLarge('up');
      return;
    }

    // h or l - Toggle sidebar (mobile only)
    if (
      matchesShortcut(parsed, { key: 'h' }) ||
      matchesShortcut(parsed, { key: 'l' })
    ) {
      if (inMobileMode) {
        event.preventDefault();
        sidebar.toggle();
      }
      return;
    }

    // t - Focus filter input
    if (matchesShortcut(parsed, { key: 't' })) {
      event.preventDefault();
      if (inMobileMode) {
        sidebar.open();
      }
      filter.focus();
      return;
    }

    // Escape - Clear filter and close sidebar
    if (matchesShortcut(parsed, { key: 'escape' })) {
      filter.clear();
      if (inMobileMode) {
        sidebar.close();
      }
      return;
    }
  }

  return { handleFilterKeydown, handleGlobalKeydown };
}

// ============================================================================
// Main Initialization
// ============================================================================

export interface KeyboardNavInstance {
  /** Current configuration */
  config: KeyboardNavConfig;
  /** Current state */
  state: KeyboardNavState;
  /** Sidebar controller */
  sidebar: ReturnType<typeof createSidebarController>;
  /** Filter controller */
  filter: ReturnType<typeof createFilterController>;
  /** Scroll controller */
  scroll: ReturnType<typeof createScrollController>;
  /** Cleanup function to remove event listeners */
  destroy: () => void;
}

/**
 * Initialize keyboard navigation on the page
 */
export function initKeyboardNav(
  userConfig: Partial<KeyboardNavConfig> = {}
): KeyboardNavInstance {
  // Merge user config with defaults
  const config: KeyboardNavConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    selectors: { ...DEFAULT_CONFIG.selectors, ...userConfig.selectors },
    classes: { ...DEFAULT_CONFIG.classes, ...userConfig.classes },
    scroll: { ...DEFAULT_CONFIG.scroll, ...userConfig.scroll },
  };

  // Initialize state
  const state: KeyboardNavState = {
    filterHighlightIndex: -1,
    sidebarScrollPosition: 0,
  };

  // Create helpers and controllers
  const dom = createDOMHelper(config);
  const sidebar = createSidebarController(config, dom, state);
  const filter = createFilterController(config, dom, state);
  const scroll = createScrollController(config);
  const keyboard = createKeyboardHandler(config, dom, sidebar, filter, scroll);

  // Set up event listeners
  const filterInput = dom.getFilterInput();
  const menuButton = dom.getMenuButton();
  const closeButton = dom.getCloseButton();
  const overlay = dom.getOverlay();
  const navItems = dom.getNavItems();

  // Filter input events
  const onFilterInput = (e: Event) => {
    filter.applyFilter((e.target as HTMLInputElement).value);
  };
  filterInput?.addEventListener('input', onFilterInput);
  filterInput?.addEventListener('keydown', keyboard.handleFilterKeydown);

  // Sidebar control events
  menuButton?.addEventListener('click', sidebar.toggle);
  closeButton?.addEventListener('click', sidebar.close);
  overlay?.addEventListener('click', sidebar.close);

  // Close sidebar on nav item click (mobile)
  const navItemClickHandler = () => sidebar.close();
  navItems.forEach((item) => item.addEventListener('click', navItemClickHandler));

  // Global keyboard events
  document.addEventListener('keydown', keyboard.handleGlobalKeydown);

  // Highlight current nav item and scroll to it
  const currentPath = window.location.pathname;
  navItems.forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add(config.classes.active);
      setTimeout(() => {
        link.scrollIntoView({ block: 'center', behavior: 'instant' });
      }, 0);
    }
  });

  // Cleanup function
  function destroy() {
    filterInput?.removeEventListener('input', onFilterInput);
    filterInput?.removeEventListener('keydown', keyboard.handleFilterKeydown);
    menuButton?.removeEventListener('click', sidebar.toggle);
    closeButton?.removeEventListener('click', sidebar.close);
    overlay?.removeEventListener('click', sidebar.close);
    navItems.forEach((item) =>
      item.removeEventListener('click', navItemClickHandler)
    );
    document.removeEventListener('keydown', keyboard.handleGlobalKeydown);
  }

  return {
    config,
    state,
    sidebar,
    filter,
    scroll,
    destroy,
  };
}
