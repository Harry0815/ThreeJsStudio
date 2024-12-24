const nx = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');
const baseConfig = require('../../eslint.base.config.js');

module.exports = [
  ...baseConfig,
  ...tsEslint.configs.strictTypeChecked.map((config) => ({
    files: ['**/*.ts'],
    ...config,
  })),
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.html'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/alt-text': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
    },
  },
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
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'hss',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'hss',
          style: 'camelCase',
        },
      ],
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
      parserOptions: { project: ['apps/studio/tsconfig.*?.json'] },
    },
  },
];
