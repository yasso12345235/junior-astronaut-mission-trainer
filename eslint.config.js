// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'dist-check/*'],
  },
  {
    rules: {
      // Reanimated shared values are mutable outside render by design (e.g.
      // `.value = withTiming(...)` inside press handlers). The React Compiler
      // immutability rule cannot model that imperative API.
      'react-hooks/immutability': 'off',
    },
  },
]);
