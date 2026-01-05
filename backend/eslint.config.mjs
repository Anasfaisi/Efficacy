import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['node_modules/', 'dist/', 'build/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': [
                'warn',
                {
                    singleQuote: true,
                    semi: true,
                    tabWidth: 4,
                    trailingComma: 'es5',
                    bracketSpacing: true,
                    endOfLine: 'lf',
                },
            ],
            'no-console': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
    prettierConfig,
);