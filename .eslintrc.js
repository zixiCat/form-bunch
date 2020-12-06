/**
 * The following are the devDependencies needed,
 * you can also install them directly by using:
 * yarn add --dev eslint prettier eslint-config-google eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier
 * The devDependencies:
 * eslint
 * prettier
 * eslint-config-google
 * eslint-plugin-react
 * eslint-plugin-react-hooks
 * eslint-config-prettier
 * eslint-plugin-prettier
 * @typescript-eslint/parser
 * @typescript-eslint/eslint-plugin
 * */
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'google',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      { semi: true, endOfLine: 'auto', singleQuote: true },
    ],
  },
  ignorePatterns: ['dist', 'build', 'lib'],
};
