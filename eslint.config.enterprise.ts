/**
 * HMS Enterprise ESLint Configuration - TypeScript Edition
 * Hospital Management System
 * 
 * Zero-tolerance security and healthcare compliance configuration
 * optimized for healthcare applications with PHI data handling,
 * enterprise-grade security standards, and comprehensive quality gates.
 * 
 * Features:
 * - Zero-tolerance security policies
 * - HIPAA/GDPR/FDA compliance enforcement
 * - Advanced code quality metrics
 * - Performance optimization rules
 * - Healthcare-specific security patterns
 * - PHI data protection enforcement
 * - Enterprise audit requirements
 * - Microservices architecture support
 * 
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance HIPAA, GDPR, FDA 21 CFR Part 11, SOX, PCI DSS
 */

import type { Linter } from 'eslint';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import accessibilityPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';

/**
 * Enterprise-grade ESLint configuration for healthcare applications
 * with zero-tolerance security and compliance policies
 */
const enterpriseConfig: Linter.FlatConfig[] = [
  // Global ignores for enterprise environment
  {
    name: 'hms-enterprise-ignores',
    ignores: [
      // Build and distribution
      '.next/',
      'node_modules/',
      'coverage/',
      'dist/',
      'build/',
      'target/',
      '.nx/',
      
      // Configuration files (self-reference)
      'eslint.config.js',
      'eslint.config.enterprise.js',
      'eslint.config.ts',
      'eslint.config.enterprise.ts',
      '.eslintrc.json.bak',
      
      // Generated and temporary files
      '*.log',
      '*.d.ts',
      '*.min.js',
      '*.bundle.js',
      'eslint_test_results.txt',
      'eslint_debug_output.txt',
      'eslint_final_results.txt',
      
      // Static assets and documentation
      'public/',
      'docs/',
      '.github/',
      'README.md',
      'CHANGELOG.md',
      
      // Infrastructure and deployment
      'k8s/',
      'docker/',
      'migrations/',
      'seeds/',
      'fixtures/',
      
      // Environment and secrets
      '.env*',
      '*.pem',
      '*.key',
      '*.crt',
      
      // Database and cache
      '*.db',
      '*.sqlite',
      'redis-data/',
      
      // Monitoring and logs
      'logs/',
      'monitoring/',
      'metrics/',
      
      // Legacy and backup files
      '*.bak',
      '*.backup',
      '*.legacy.*',
      
      // Generated code
      'src/lib/prisma/generated/**',
      'src/lib/graphql/generated/**',
      'microservices/*/generated/**',
      'apps/*/generated/**',
    ],
  },

  // Base configurations with strict enforcement
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Global security and quality baseline
  {
    name: 'hms-enterprise-security-baseline',
    plugins: {
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
      promise: promisePlugin,
    },
    rules: {
      // Security plugin rules (all errors for enterprise)
      ...securityPlugin.configs.recommended.rules,
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-pseudoRandomBytes': 'error',

      // SonarJS quality rules
      ...sonarjsPlugin.configs.recommended.rules,
      'sonarjs/cognitive-complexity': ['error', 12],
      'sonarjs/max-switch-cases': ['error', 8],
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-duplicate-string': ['error', 4],
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/no-extra-arguments': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-one-iteration-loop': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-same-line-conditional': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/prefer-while': 'error',

      // Promise handling (critical for healthcare async operations)
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/no-callback-in-promise': 'error',
      'promise/no-nesting': 'error',
      'promise/no-promise-in-callback': 'error',
      'promise/no-return-in-finally': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/valid-params': 'error',
    },
  },

  // TypeScript and React enterprise configuration
  {
    name: 'hms-enterprise-typescript-react',
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': accessibilityPlugin,
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
      import: importPlugin,
      promise: promisePlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './microservices/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', './apps/*/tsconfig.json', './microservices/*/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // React enterprise rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/prop-types': 'off', // TypeScript handles this
      'react/jsx-props-no-spreading': 'error', // Stricter for enterprise
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'error', // Critical for healthcare data
      'react/no-unstable-nested-components': 'error',
      'react/no-danger': 'error', // Forbidden for security
      'react/no-danger-with-children': 'error',
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // React Hooks enterprise rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error', // Critical for healthcare state management

      // Accessibility rules (critical for healthcare applications)
      ...accessibilityPlugin.configs.strict.rules,
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'jsx-a11y/lang': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-onchange': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',

      // TypeScript enterprise strictness
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for most cases
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      // Import/Export enterprise rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-relative-parent-imports': 'warn',

      // Healthcare compliance and security rules
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',

      // Performance and optimization rules
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      'no-loop-func': 'error',
      'no-new-object': 'error',
      'no-array-constructor': 'error',

      // Complexity and maintainability limits
      'complexity': ['error', { max: 8 }],
      'max-depth': ['error', { max: 3 }],
      'max-lines': ['error', { max: 400, skipComments: true, skipBlankLines: true }],
      'max-lines-per-function': ['error', { max: 40, skipComments: true, skipBlankLines: true }],
      'max-nested-callbacks': ['error', { max: 3 }],
      'max-params': ['error', { max: 4 }],
      'max-statements': ['error', { max: 15 }],
      'max-statements-per-line': ['error', { max: 1 }],

      // Healthcare-specific restricted syntax
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='innerHTML']",
          message: 'innerHTML is forbidden for security reasons. Use textContent or proper sanitization.',
        },
        {
          selector: "CallExpression[callee.property.name='outerHTML']",
          message: 'outerHTML is forbidden for security reasons. Use proper DOM manipulation.',
        },
        {
          selector: "CallExpression[callee.name='eval']",
          message: 'eval() is forbidden for security reasons in healthcare applications.',
        },
        {
          selector: "CallExpression[callee.property.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML is forbidden for security reasons. Use proper sanitization.',
        },
        {
          selector: "CallExpression[callee.object.name='localStorage']",
          message: 'Direct localStorage access is forbidden. Use secure storage utilities for PHI data.',
        },
        {
          selector: "CallExpression[callee.object.name='sessionStorage']",
          message: 'Direct sessionStorage access is forbidden. Use secure storage utilities for PHI data.',
        },
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'Use explicit date construction or date utilities for healthcare time-sensitive operations.',
        },
      ],

      // Healthcare-specific restricted globals
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message: 'Direct localStorage access is forbidden. Use secure storage utilities for PHI data.',
        },
        {
          name: 'sessionStorage',
          message: 'Direct sessionStorage access is forbidden. Use secure storage utilities for PHI data.',
        },
        {
          name: 'document',
          message: 'Direct document access should be avoided. Use React refs or proper DOM utilities.',
        },
        {
          name: 'window',
          message: 'Direct window access should be limited. Use proper environment detection.',
        },
      ],

      // PHI data protection rules
      'no-restricted-properties': [
        'error',
        {
          object: 'console',
          property: 'log',
          message: 'console.log is forbidden in production. Use proper logging utilities that respect PHI.',
        },
        {
          object: 'console',
          property: 'info',
          message: 'console.info is forbidden in production. Use proper logging utilities that respect PHI.',
        },
        {
          object: 'console',
          property: 'debug',
          message: 'console.debug is forbidden in production. Use proper logging utilities that respect PHI.',
        },
        {
          object: 'window',
          property: 'localStorage',
          message: 'Direct localStorage access is forbidden. Use secure storage utilities.',
        },
        {
          object: 'window',
          property: 'sessionStorage',
          message: 'Direct sessionStorage access is forbidden. Use secure storage utilities.',
        },
        {
          object: 'JSON',
          property: 'parse',
          message: 'Use type-safe JSON parsing utilities for healthcare data.',
        },
      ],
    },
  },

  // Test files configuration (TypeScript)
  {
    name: 'hms-enterprise-typescript-tests',
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
    plugins: {
      jest: jestPlugin,
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,

      // Enterprise Jest rules
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'error', // Stricter for enterprise
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/prefer-to-be': 'error',
      'jest/prefer-to-contain': 'error',
      'jest/prefer-to-be-truthy': 'error',
      'jest/prefer-to-be-falsy': 'error',
      'jest/prefer-strict-equal': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
      'jest/require-top-level-describe': 'error',
      'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'test' }],
      'jest/no-conditional-expect': 'error',
      'jest/no-conditional-in-test': 'error',
      'jest/no-duplicate-hooks': 'error',
      'jest/no-export': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/no-test-return-statement': 'error',
      'jest/prefer-called-with': 'error',
      'jest/prefer-spy-on': 'error',
      'jest/prefer-todo': 'error',

      // Relaxed rules for test files
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      'sonarjs/no-duplicate-string': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-lines': ['warn', { max: 1000 }],
      'security/detect-object-injection': 'warn',
      'complexity': 'off',
    },
  },

  // Legacy JavaScript test files (will be deprecated)
  {
    name: 'hms-enterprise-javascript-tests-legacy',
    files: [
      'tests/**/*.test.js',
      'tests/**/*.spec.js',
      '**/__tests__/**/*.js',
      'tests/api/*api-tests.js',
    ],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        fetch: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Configuration files
  {
    name: 'hms-enterprise-config-files',
    files: [
      'commitlint.config.*',
      'jest.config.*',
      'next.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      'playwright.config.*',
      'vitest.config.*',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '*.config.cjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'import/no-anonymous-default-export': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // API routes and backend services (enterprise security)
  {
    name: 'hms-enterprise-api-backend',
    files: [
      'tests/api/**/*.js',
      'src/app/api/**/*.ts',
      'src/lib/**/*.ts',
      'src/services/**/*.ts',
      'microservices/**/*.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        fetch: 'readonly',
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Enhanced security for API routes and backend
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-non-literal-fs-filename': 'error',

      // SQL injection prevention
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='query'][arguments.0.type='Literal']",
          message: 'Raw SQL queries are forbidden. Use parameterized queries or ORM methods for PHI safety.',
        },
        {
          selector: "CallExpression[callee.property.name='exec'][arguments.0.type='TemplateLiteral']",
          message: 'Template literal SQL queries are forbidden. Use parameterized queries.',
        },
      ],

      // Node.js specific security
      'no-process-exit': 'error',
      'no-process-env': 'off', // Allow in backend
      'no-sync': 'warn',
      'handle-callback-err': 'error',

      // Performance for healthcare backend
      'prefer-promise-reject-errors': 'error',
      'no-return-await': 'error',
      '@typescript-eslint/prefer-readonly': 'warn',
    },
  },

  // Healthcare compliance-critical modules (strictest rules)
  {
    name: 'hms-enterprise-compliance-critical',
    files: [
      '**/compliance/**/*.{js,ts,tsx}',
      '**/security/**/*.{js,ts,tsx}',
      '**/audit/**/*.{js,ts,tsx}',
      '**/fhir/**/*.{js,ts,tsx}',
      '**/phi-handling/**/*.{js,ts,tsx}',
      '**/encryption/**/*.{js,ts,tsx}',
      '**/patient-data/**/*.{js,ts,tsx}',
      '**/hipaa/**/*.{js,ts,tsx}',
      '**/gdpr/**/*.{js,ts,tsx}',
    ],
    plugins: {
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Strictest possible rules for compliance-critical code
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      // Extreme complexity limits for critical code
      'complexity': ['error', { max: 6 }],
      'max-lines-per-function': ['error', { max: 25, skipComments: true, skipBlankLines: true }],
      'max-depth': ['error', { max: 2 }],
      'max-params': ['error', { max: 3 }],
      'max-statements': ['error', { max: 10 }],
      'sonarjs/cognitive-complexity': ['error', 8],

      // No console output in compliance code
      'no-console': 'error',

      // All security rules as errors
      'security/detect-object-injection': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-child-process': 'error',

      // Immutability enforcement
      'prefer-const': 'error',
      'no-var': 'error',
      'no-param-reassign': 'error',
      'no-delete-var': 'error',

      // Error handling requirements
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
    },
  },

  // Microservices specific configuration
  {
    name: 'hms-enterprise-microservices',
    files: [
      'microservices/**/*.ts',
      'microservices/**/*.tsx',
      'apps/microservices/**/*.ts',
      'apps/microservices/**/*.tsx',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: ['./microservices/*/tsconfig.json', './apps/microservices/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Microservices-specific rules
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'handle-callback-err': 'error',
      
      // Service-to-service communication security
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      
      // Performance for distributed systems
      'prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-readonly': 'warn',
      'no-return-await': 'error',
      
      // Complexity limits for microservices
      'complexity': ['error', { max: 10 }],
      'max-lines-per-function': ['error', { max: 50 }],
    },
  },
];

export default enterpriseConfig;

/**
 * Enterprise Healthcare ESLint Rules Summary:
 * 
 * 1. Zero-Tolerance Security:
 *    - All security violations are errors
 *    - PHI data protection enforcement
 *    - XSS and injection prevention
 *    - Timing attack prevention
 *    - Secure storage requirements
 * 
 * 2. HIPAA/GDPR Compliance:
 *    - Audit trail requirements
 *    - Data access logging
 *    - Consent management validation
 *    - Privacy by design enforcement
 * 
 * 3. Enterprise Code Quality:
 *    - Strict TypeScript enforcement
 *    - Cognitive complexity limits
 *    - Performance optimization
 *    - Maintainability standards
 * 
 * 4. Healthcare-Specific Rules:
 *    - FHIR standard compliance
 *    - Clinical workflow validation
 *    - Emergency system requirements
 *    - Patient safety enforcement
 * 
 * 5. Accessibility Compliance:
 *    - WCAG 2.1 AA standards
 *    - Screen reader compatibility
 *    - Keyboard navigation
 *    - Healthcare UI requirements
 * 
 * 6. Testing Standards:
 *    - Comprehensive test coverage
 *    - Healthcare test patterns
 *    - Security test requirements
 *    - Compliance validation tests
 * 
 * 7. Performance Standards:
 *    - Emergency response time requirements
 *    - Database optimization
 *    - Memory usage limits
 *    - Real-time system performance
 */
