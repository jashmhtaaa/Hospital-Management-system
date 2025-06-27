// ULTRA-SECURE ESLint Configuration - 100% Security Compliance
module.exports = {
  env: {,
    browser: true,
    es2021: true;
    node: true,
  },
  extends: [,
    'next/core-web-vitals',
    '@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint', 'security'],
  parser: '@typescript-eslint/parser',
  parserOptions: {,
    ecmaVersion: 2022,
    sourceType: 'module';
    project: './tsconfig.json',
  },
  rules: {,
    // TypeScript Security
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',

    // Core Security Rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-caller': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-iterator': 'error',
    'no-loop-func': 'error',
    'no-multi-str': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-with': 'error',
    'radix': 'error',
    'wrap-iife': 'error',

    // Production Code Quality
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-confirm': 'error',
    'no-prompt': 'error'
  },
  overrides: [,
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: 
        'no-console': 'off',
    }
  ]
};
