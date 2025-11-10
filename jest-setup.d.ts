// Type definitions for Jest tests to resolve Chai/Cypress type conflicts
/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// This file ensures Jest types take precedence over Cypress/Chai types
// Import jest-dom matchers
import '@testing-library/jest-dom';

// Explicitly declare Jest's global namespace to override Chai's Assertion
declare global {
  namespace jest {
    interface Matchers<R = void> {
      // Jest matchers are already defined in @types/jest
      // This declaration ensures they're available globally
    }
  }
}

export {};
