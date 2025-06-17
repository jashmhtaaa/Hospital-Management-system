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
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
      'eqeqeq': 'off',
      'no-debugger': 'off',
      'no-alert': 'off',
      'no-undef': 'off'
    }
  }
];
