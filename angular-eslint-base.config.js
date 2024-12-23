const baseConfig = require('./eslint.base.config');
const nx = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...tsEslint.configs.strictTypeChecked.map((config) => ({
    files: ['**/*.ts'],
    ...config,
  })),
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/alt-text': 'off',
      // buggy when turned on
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
];
