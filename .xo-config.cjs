// const path = require('node:path');

module.exports = {
  prettier: true,
  space: true,
  extends: ["plugin:vitest-globals/recommended"],
  plugins: ["vitest"],
  overrides: [
    {
      files: "**/*.tsx",
      // envs: ['es2021', 'browser'],
      rules: {
        // "react/react-in-jsx-scope": "off",
        "unicorn/filename-case": [
          "error",
          {
            case: "pascalCase",
          },
        ],
        "n/file-extension-in-import": "off",
        "import/extensions": "off",
      },
    },
    {
      files: "**/*.ts",
      rules: {
        "import/extensions": "off",
        "n/file-extension-in-import": "off",

      },
    },
    {
      files: "**/*.test.tsx?",
      env: {
        "vitest-globals/env": true
      },
      rules: {
        "n/file-extension-in-import": "off",
        // "import/extensions": "off",
      //   "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts", "**/*.test.tsx"],
      // packageDir: [path.join(__dirname, './packages/hooks')]}]
      },
    },
  ],
};
