const tsEslint = require('typescript-eslint');
const baseConfig = require('../../../eslint.base.config.js');

module.exports = [
  ...baseConfig,
  ...tsEslint.configs.strictTypeChecked.map((config) => ({
    files: ['**/*.ts'],
    ...config,
  })),
  {
    files: ['**/*.json'],
    rules: {
      'no-irregular-whitespace': 'off',
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  {
    files: [
      '**/test-setup.ts',
      '**/*.http-spec.ts',
      '**/*.spec.ts',
      '**/*.unit.ts',
      '**/*.int.ts',
      '**/*.int-spec.ts',
      '**/*.mock.ts',
    ],
    rules: {},
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { project: ['libs/share/three-utils/tsconfig.*?.json'] },
    },
  },
];
