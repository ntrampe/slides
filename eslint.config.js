import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'apps/web/dist', '**/generated/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/apps/server/**', '@slides/server/**'],
              message:
                'Web code must not import server modules. Use /api/v1 fetchers in apps/web/src/api.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/server/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'Server code must not depend on React.' },
            { name: 'react-dom', message: 'Server code must not depend on React.' },
          ],
          patterns: [
            {
              group: ['**/apps/web/**', '@slides/web/**'],
              message:
                'Server code must not import web/presentation modules.',
            },
          ],
        },
      ],
    },
  },
])
