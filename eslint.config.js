const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  expoConfig,
  ...tseslint.configs.recommended,
  {
    
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },

    ignores: [
      "dist",
      "node_modules",
      ".expo",
    ],
  },
]);