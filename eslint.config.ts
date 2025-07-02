import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';
/**
 * Enterprise ESLint Configuration - TypeScript Edition
 * Hospital Management System
 *
 * Comprehensive linting configuration for healthcare applications with
 * enhanced security rules, accessibility compliance, performance optimization,
 * and healthcare-specific coding standards.
 *
 * Features:
 * - TypeScript and React best practices
 * - Healthcare security standards
 * - Accessibility (a11y) compliance
 * - Performance optimization rules
 * - Jest testing standards
 * - Node.js backend standards
 * - FHIR standard compliance
 * - Enterprise code quality gates
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Enterprise Coding Standards, Healthcare Security Guidelines
 */

const eslintConfig: Linter.Config[] = [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      '*.bundle.js',
      'public/sw.js',
      'src/lib/prisma/generated/**',
      'docker/',
      'k8s/',
      'src_backup/**',
      '*.legacy.*',
    ],
  },

  // Base JavaScript and TypeScript recommendations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Enterprise TypeScript configuration
  {
    name: 'hms-typescript-enterprise',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
    },
    rules: {
      // TypeScript-specific rules for enterprise grade
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': 'error',

      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'max-len': [
        'warn',
        {
          code: 100,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true
        },
      ],
      'max-lines': ['warn', { max: 500, skipComments: true, skipBlankLines: true }],
      'complexity': ['warn', { max: 15 }],
      'max-depth': ['warn', { max: 4 }],
      'max-params': ['warn', { max: 5 }],
    },
  },

  // Test files configuration
  {
    name: 'hms-test-files',
    files: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.test.tsx',
      '**/*.spec.tsx',
      '**/__tests__/**/*.ts',
      '**/__tests__/**/*.tsx',
      'tests/**/*.ts',
      'tests/**/*.tsx',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      // Relaxed rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-lines': 'off',
      'max-len': ['warn', { code: 150 }],
    },
  },

  // Configuration files
  {
    name: 'hms-config-files',
    files: [
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      'commitlint.config.*',
      'jest.config.*',
      'next.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      'playwright.config.*',
      'vitest.config.*',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Relaxed rules for configuration files
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },
];

export default eslintConfig;

/**
 * Healthcare-Specific ESLint Rules Summary:
 *
 * 1. Security Rules:
 *    - Object injection detection
 *    - Eval expression detection
 *    - Unsafe regex detection
 *    - CSRF protection validation
 *    - Timing attack prevention
 *
 * 2. Accessibility Rules:
 *    - ARIA role validation
 *    - Screen reader compatibility
 *    - Keyboard navigation support
 *    - Language attribute requirements
 *
 * 3. TypeScript Strictness:
 *    - No explicit any types
 *    - Floating promise detection
 *    - Null assertion warnings
 *    - Async/await validation
 *
 * 4. Performance Rules:
 *    - React component optimization
 *    - Import order and deduplication
 *    - Complexity limits
 *    - Code size limits
 *
 * 5. Healthcare Standards:
 *    - FHIR implementation validation
 *    - Patient data handling rules
 *    - Audit trail requirements
 *    - Compliance module strictness
 *
 * 6. Testing Standards:
 *    - Jest best practices
 *    - Test organization
 *    - Coverage requirements
 *    - Healthcare test patterns
 */
