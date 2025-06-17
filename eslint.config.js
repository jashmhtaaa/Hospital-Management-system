export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '.enterprise-backup/**',
      '**/*.d.ts'
    ]
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': 'error',
      'no-debugger': 'error',
      'no-alert': 'error'
    }
  }
];
