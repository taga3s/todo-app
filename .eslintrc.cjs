// use legacy module.exports
module.exports = {
  root: true,
  env: { browser: true, es6: true, node: true, "jest/globals": true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules'],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['react-refresh', 'simple-import-sort', 'jest'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  settings: {
    react: { version: 'detect' },
  },
};
