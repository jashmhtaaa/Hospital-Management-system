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
 * FHIR Integration Tests;
 * Comprehensive tests for FHIR R4 implementation;
 */

import { describe, test, beforeAll } from '@jest/globals';
import { FHIRIntegrationUtils } from '../fhir-integration';

describe('FHIR R4 Integration Tests', () => {
  beforeAll(async () => {
    // Initialize FHIR integration;
    await FHIRIntegrationUtils.initializeFHIRIntegration();
  });

  describe('FHIR Patient Resource Tests', () => {
    test('should create a valid FHIR Patient from HMS data', () => {
