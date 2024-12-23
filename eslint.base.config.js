const nx = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginimport = require('eslint-plugin-import')

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...[...tsEslint.configs.recommendedTypeChecked, ...tsEslint.configs.stylisticTypeChecked].map((config) => ({
    files: ['**/*.ts'],
    ...config,
  })),
  eslintConfigPrettier,
  {
    ignores: ['**/dist', '**/coverage', 'node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-structured-clone': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true,
        },
      ],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */,
          },
          groups: ['builtin', 'internal', 'external', 'parent', 'sibling', 'index'],
          pathGroupsExcludedImportTypes: ['internal'],
        },
      ],
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
      import: eslintPluginimport,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      'deprecation/deprecation': 'off',
      'import/no-default-export': 'off',
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignorePrimitives: {
            string: true,
            boolean: true,
            number: true,
            bigint: true,
          },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: ['rxjs/Rx'],
          patterns: ['**/../dist', '**/../src'],
        },
      ],
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'no-extra-semi': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-extra-semi': 'off',
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
    files: ['**/rollup.config.js', '**/webpack.config.js', '**/webpack.config.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    files: ['**/jest.config.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
];
