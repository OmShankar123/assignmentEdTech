const expoConfig = require('eslint-config-expo/flat.js');
const prettier = require('eslint-plugin-prettier/recommended');
const compiler = require('eslint-plugin-react-compiler');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  // 1. Basic Ignores
  {
    ignores: [
      '**/dist/*',
      '**/node_modules/*',
      '**/__tests__/*',
      '**/coverage/*',
      '**/.expo/*',
      '**/.expo-shared/*',
      '**/android/*',
      '**/ios/*',
      '**/.vscode/*',
      '**/docs/*',
      '**/cli/*',
      '**/expo-env.d.ts',
      '**/babel.config.js',
      '**/metro.config.js',
    ],
  },

  // 2. Base Expo Config
  ...expoConfig,

  // 3. Prettier Integration
  prettier,

  // 4. React Compiler
  {
    plugins: {
      'react-compiler': compiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },

  // 5. Custom Rules + Import Overrides
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['src'],
        },
      },
      'import/ignore': ['node_modules', '\\.(scss|css)$'],
    },
    rules: {
      // DISABLE ALL import/* rules to prevent unrs-resolver errors
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-duplicates': 'off',
      'import/no-named-default': 'off',

      // Import Sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^react', '^@?\\w'], ['^@env', '^@/', '^'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Unused Imports - forcefully remove them
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // React Native / Expo best practices
      'react/display-name': 'off',
      'react/no-inline-styles': 'off',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
    },
  },

  // 6. TypeScript specific overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // 7. Config files specific overrides (allow require)
  {
    files: ['*.config.js', 'app.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
