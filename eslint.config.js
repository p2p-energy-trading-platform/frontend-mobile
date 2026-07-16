import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: [
      '**/.expo/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.react-native/**',
      'eslint.config.js',
      'prettier.config.js',
    ],
  },

  expoConfig,
  ...tseslint.configs.recommended,

  {
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',

      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  prettierConfig,
]);
