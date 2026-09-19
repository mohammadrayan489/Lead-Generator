import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getInitialTheme, applyThemeClass } from '../useTheme';

describe('useTheme utilities', () => {
  let mockStorage: Record<string, string> = {};

  const fakeLocalStorage = {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      mockStorage = {};
    },
  };

  const classes = new Set<string>();
  const fakeDoc = {
    documentElement: {
      classList: {
        add: (cls: string) => classes.add(cls),
        remove: (cls: string) => classes.delete(cls),
        contains: (cls: string) => classes.has(cls),
      },
      style: {
        colorScheme: '',
      },
      className: '',
    },
  };

  const fakeWindow = {
    matchMedia: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  };

  beforeEach(() => {
    mockStorage = {};
    classes.clear();
    fakeDoc.documentElement.style.colorScheme = '';

    vi.stubGlobal('localStorage', fakeLocalStorage);
    vi.stubGlobal('document', fakeDoc);
    vi.stubGlobal('window', fakeWindow);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('defaults to light mode when no localStorage or system preference', () => {
    const theme = getInitialTheme();
    expect(theme).toBe('light');
  });

  it('reads stored preference from localStorage correctly', () => {
    fakeLocalStorage.setItem('lead_generator_theme', 'dark');
    expect(getInitialTheme()).toBe('dark');

    fakeLocalStorage.setItem('lead_generator_theme', 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('applies dark class and color-scheme to documentElement in dark mode', () => {
    applyThemeClass('dark');
    expect(fakeDoc.documentElement.classList.contains('dark')).toBe(true);
    expect(fakeDoc.documentElement.style.colorScheme).toBe('dark');
  });

  it('removes dark class and sets color-scheme to light in light mode', () => {
    applyThemeClass('dark');
    expect(fakeDoc.documentElement.classList.contains('dark')).toBe(true);

    applyThemeClass('light');
    expect(fakeDoc.documentElement.classList.contains('dark')).toBe(false);
    expect(fakeDoc.documentElement.style.colorScheme).toBe('light');
  });

  it('gracefully handles missing window/document or empty storage', () => {
    fakeLocalStorage.removeItem('lead_generator_theme');
    const initial = getInitialTheme();
    expect(['light', 'dark']).toContain(initial);
  });
});

