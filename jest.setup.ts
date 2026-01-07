import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Assign typed mock to global.localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock utils/env to avoid SyntaxError: Cannot use 'import.meta' outside a module
// We use a virtual mock or rely on path resolution
jest.mock('./utils/env', () => ({
  getEnv: (key: string) => process.env[key],
  getMode: () => process.env.NODE_ENV || 'test',
  isDev: () => process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
  isProd: () => process.env.NODE_ENV === 'production',
}));
