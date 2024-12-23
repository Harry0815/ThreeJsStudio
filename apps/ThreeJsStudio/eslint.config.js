const tsEslint = require('typescript-eslint');
const baseConfig = require('../../eslint.base.config.js');

module.exports = [
  ...baseConfig,
  ...tsEslint.configs.strictTypeChecked.map((config) => ({
    files: ['**/*.ts'],
    ...config,
  })),
  {
    files: ['**/*.json'],
    rules: {},
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
    },
  },
  {
    files: ['**/test-setup.ts', '**/*.http-spec.ts', '**/*.spec.ts', '**/*.unit.ts', '**/*.int.ts', '**/*.mock.ts'],
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { project: ['apps/ThreeJsStudio/tsconfig.*?.json'] },
    },
  },
];
