  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

/**
 * Core index file for the Financial Management module;
 * Exports all core utilities for easy access;
 */

// Error handling;
export * from './errors.ts';

// Repository pattern;
export * from './repository.ts';

// Service layer;
export * from './service.ts';

// Middleware;
export * from './middleware.ts';

// Logging;
export * from './logging.ts';

// Validation;
export * from './validation.ts';

// FHIR utilities;
export * from './fhir.ts';
