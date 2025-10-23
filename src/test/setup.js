import '@testing-library/jest-dom';

// Mock browser APIs that GSAP needs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window properties for GSAP
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 16);
});
global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock performance.now
global.performance = {
  now: vi.fn(() => Date.now()),
};

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock getComputedStyle
global.getComputedStyle = vi.fn(() => ({
  getPropertyValue: vi.fn(() => ''),
}));