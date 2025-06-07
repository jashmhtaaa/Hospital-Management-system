const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Test Environment
  testEnvironment: 'jsdom',
  
  // Setup Files
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/tests/setup/test-setup.ts',
    '<rootDir>/tests/setup/security-setup.ts',
    '<rootDir>/tests/setup/fhir-setup.ts'
  ],
  
  // Module Paths
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  
  // Module Name Mapping
  moduleNameMapper: {
    // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/shared/src/$1',
    '^@microservices/(.*)$': '<rootDir>/microservices/$1/src/$1',
    '^@api/(.*)$': '<rootDir>/src/app/api/$1',
    '^@prisma/(.*)$': '<rootDir>/prisma/$1',
    '^@fhir/(.*)$': '<rootDir>/src/lib/fhir/$1',
    '^@security/(.*)$': '<rootDir>/src/lib/security/$1',
    '^@compliance/(.*)$': '<rootDir>/src/lib/compliance/$1',
    '^@monitoring/(.*)$': '<rootDir>/src/lib/monitoring/$1',
    '^@analytics/(.*)$': '<rootDir>/src/lib/analytics/$1',
    
    // Static assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/tests/__mocks__/fileMock.js',
    
    // CSS Modules
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  
  // Test Match Patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/microservices/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/microservices/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Test Path Ignore Patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/microservices/*/target/',
    '<rootDir>/microservices/*/build/'
  ],
  
  // Transform
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    '^.+\\.css$': '<rootDir>/tests/transforms/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/tests/transforms/fileTransform.js'
  },
  
  // Transform Ignore Patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|@fhir-typescript|@azure/msal-browser|@azure/msal-react)/)',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  
  // Coverage Configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'microservices/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
    '!src/app/layout.tsx',
    '!src/app/loading.tsx',
    '!src/app/error.tsx',
    '!src/app/not-found.tsx',
    '!src/app/global-error.tsx',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/build/**'
  ],
  
  // Coverage Thresholds - Enterprise Level
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/lib/security/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './src/lib/compliance/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './src/lib/fhir/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Coverage Reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'json-summary',
    'clover',
    'cobertura'
  ],
  
  // Coverage Directory
  coverageDirectory: 'coverage',
  
  // Test Results Processor
  testResultsProcessor: 'jest-sonar-reporter',
  
  // Reporters
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'HMS Enterprise Test Report',
      outputPath: 'test-results/test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true
    }],
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml',
      suiteName: 'HMS Enterprise Tests',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }],
    ['jest-stare', {
      resultDir: 'test-results/jest-stare',
      reportTitle: 'HMS Enterprise Test Results',
      additionalResultsProcessors: ['jest-html-reporter'],
      coverageLink: '../coverage/lcov-report/index.html'
    }]
  ],
  
  // Test Environment Options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
    pretendToBeVisual: true,
    resources: 'usable'
  },
  
  // Global Setup and Teardown
  globalSetup: '<rootDir>/tests/setup/global-setup.ts',
  globalTeardown: '<rootDir>/tests/setup/global-teardown.ts',
  
  // Test Timeout
  testTimeout: 30000,
  
  // Verbose Output
  verbose: true,
  
  // Display Individual Test Results
  displayName: {
    name: 'HMS Enterprise',
    color: 'blue'
  },
  
  // Error on Deprecated Features
  errorOnDeprecated: true,
  
  // Clear Mocks
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Max Workers for Parallel Testing
  maxWorkers: '50%',
  
  // Watch Plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Custom Test Sequences
  projects: [
    {
      displayName: 'Frontend Unit Tests',
      testMatch: ['<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom'
    },
    {
      displayName: 'Component Tests',
      testMatch: ['<rootDir>/src/components/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/component-setup.ts']
    },
    {
      displayName: 'API Tests',
      testMatch: ['<rootDir>/src/app/api/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/api-setup.ts']
    },
    {
      displayName: 'Service Tests',
      testMatch: ['<rootDir>/src/services/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/service-setup.ts']
    },
    {
      displayName: 'Security Tests',
      testMatch: ['<rootDir>/src/lib/security/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/security-setup.ts']
    },
    {
      displayName: 'FHIR Tests',
      testMatch: ['<rootDir>/src/lib/fhir/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/fhir-setup.ts']
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      testTimeout: 60000,
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration-setup.ts']
    }
  ],
  
  // Module File Extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  
  // Snapshot Serializers
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  
  // Notification Mode
  notifyMode: 'failure-change',
  
  // Bail on First Failure in CI
  bail: process.env.CI ? 1 : 0,
  
  // Force Exit
  forceExit: process.env.CI ? true : false,
  
  // Detect Open Handles
  detectOpenHandles: true,
  
  // Run Tests in Parallel
  runInBand: false,
  
  // Max Concurrent Tests
  maxConcurrency: 5
};

// Create Jest config
module.exports = createJestConfig(customJestConfig);
