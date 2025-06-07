/**
 * HMS Enterprise ESLint Configuration
 * 
 * Zero-tolerance security and healthcare compliance configuration
 * Optimized for healthcare applications with PHI data handling
 * 
 * @version 2.0.0
 * @compliance HIPAA, GDPR, FDA 21 CFR Part 11
 */

const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");
const jestPlugin = require("eslint-plugin-jest");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const securityPlugin = require("eslint-plugin-security");
const sonarjsPlugin = require("eslint-plugin-sonarjs");

module.exports = [
  {
    ignores: [
      ".next/",
      "node_modules/",
      "eslint.config.js",
      "eslint.config.enterprise.js",
      ".eslintrc.json.bak",
      "eslint_test_results.txt",
      "eslint_debug_output.txt",
      "eslint_final_results.txt",
      "coverage/",
      "dist/",
      "build/",
      "*.log",
      "*.d.ts",
      "public/",
      ".github/",
      "k8s/",
      "migrations/",
    ]
  },
  
  // Base configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  
  // Security configuration
  {
    plugins: {
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
      ...sonarjsPlugin.configs.recommended.rules,
    }
  },
  
  // TypeScript and React configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "react": reactPlugin,
      "react-hooks": reactHooksPlugin,
      "security": securityPlugin,
      "sonarjs": sonarjsPlugin,
    },
    languageOptions: {
      globals: { 
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "argsIgnorePattern": "^_", 
          "varsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      
      // Healthcare-specific security rules
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-require": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-pseudoRandomBytes": "error",
      
      // Code quality rules (SonarJS)
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/max-switch-cases": ["error", 10],
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-duplicate-string": ["error", 5],
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-extra-arguments": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      "sonarjs/no-ignored-return": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-one-iteration-loop": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-same-line-conditional": "error",
      "sonarjs/no-small-switch": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/no-useless-catch": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/prefer-object-literal": "error",
      "sonarjs/prefer-single-boolean-return": "error",
      "sonarjs/prefer-while": "error",
      
      // Healthcare compliance rules
      "no-console": ["error", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-undef": "error",
      "no-unused-expressions": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      
      // Performance rules
      "prefer-template": "error",
      "prefer-spread": "error",
      "prefer-rest-params": "error",
      "prefer-arrow-callback": "error",
      "object-shorthand": "error",
      
      // Complexity rules
      "complexity": ["error", 10],
      "max-depth": ["error", 4],
      "max-lines": ["error", 500],
      "max-lines-per-function": ["error", 50],
      "max-nested-callbacks": ["error", 3],
      "max-params": ["error", 4],
      "max-statements": ["error", 20],
      
      // Custom healthcare rules
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.property.name='innerHTML']",
          "message": "innerHTML is not allowed for security reasons. Use textContent or proper sanitization."
        },
        {
          "selector": "CallExpression[callee.property.name='outerHTML']",
          "message": "outerHTML is not allowed for security reasons. Use proper DOM manipulation."
        },
        {
          "selector": "CallExpression[callee.name='eval']",
          "message": "eval() is forbidden for security reasons."
        },
        {
          "selector": "CallExpression[callee.property.name='dangerouslySetInnerHTML']",
          "message": "dangerouslySetInnerHTML is not allowed for security reasons. Use proper sanitization."
        }
      ],
      
      "no-restricted-globals": [
        "error",
        {
          "name": "localStorage",
          "message": "Direct localStorage access is not allowed. Use secure storage utilities for PHI data."
        },
        {
          "name": "sessionStorage",
          "message": "Direct sessionStorage access is not allowed. Use secure storage utilities for PHI data."
        }
      ],
      
      // PHI data protection rules
      "no-restricted-properties": [
        "error",
        {
          "object": "console",
          "property": "log",
          "message": "console.log is not allowed in production. Use proper logging utilities."
        },
        {
          "object": "window",
          "property": "localStorage",
          "message": "Direct localStorage access is forbidden. Use secure storage utilities."
        },
        {
          "object": "window",
          "property": "sessionStorage",
          "message": "Direct sessionStorage access is forbidden. Use secure storage utilities."
        }
      ],
    }
  },
  
  // Test files configuration
  {
    files: [
      "**/*.test.ts", 
      "**/*.spec.ts", 
      "**/*.test.tsx", 
      "**/*.spec.tsx", 
      "**/__tests__/**/*.ts", 
      "**/__tests__/**/*.tsx"
    ],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      // Relaxed rules for test files
      "@typescript-eslint/no-explicit-any": "warn",
      "sonarjs/no-duplicate-string": "off",
      "max-lines-per-function": "off",
      "max-statements": "off",
      "security/detect-object-injection": "warn",
      
      // Jest-specific rules
      "jest/expect-expect": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "jest/consistent-test-it": ["error", { "fn": "test", "withinDescribe": "it" }],
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node
      }
    }
  },
  
  // JavaScript test files
  {
    files: [
      "tests/**/*.test.js", 
      "tests/**/*.spec.js", 
      "**/__tests__/**/*.js",
      "tests/api/*api-tests.js"
    ],
    ...jestPlugin.configs['flat/recommended'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node
      }
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      "no-undef": "off", // Jest globals
    }
  },
  
  // Configuration files
  {
    files: [
      "commitlint.config.js",
      "jest.config.js",
      "next.config.js",
      "next.config.ts",
      "postcss.config.js",
      "tailwind.config.js",
      "tailwind.config.ts",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs"
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "sonarjs/no-duplicate-string": "off",
    }
  },
  
  // API route files (healthcare-specific)
  {
    files: ["tests/api/**/*.js", "src/app/api/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
        fetch: "readonly"
      }
    },
    rules: {
      // Enhanced security for API routes
      "security/detect-object-injection": "error",
      "security/detect-non-literal-regexp": "error",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.property.name='query'][arguments.0.type='Literal']",
          "message": "Raw SQL queries are not allowed. Use parameterized queries or ORM methods."
        }
      ]
    }
  },
  
  // Healthcare compliance files
  {
    files: [
      "**/compliance/**/*.{js,ts,tsx}",
      "**/security/**/*.{js,ts,tsx}",
      "**/audit/**/*.{js,ts,tsx}",
      "**/fhir/**/*.{js,ts,tsx}",
      "**/phi-handling/**/*.{js,ts,tsx}"
    ],
    rules: {
      // Extra strict rules for compliance-critical code
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "complexity": ["error", 8],
      "max-lines-per-function": ["error", 30],
      "max-depth": ["error", 3],
      "sonarjs/cognitive-complexity": ["error", 10],
      "no-console": "error",
      "security/detect-object-injection": "error",
      "security/detect-possible-timing-attacks": "error",
    }
  }
];
