const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Force Babel transform profile for web (Hermes is native-only).
  // Without this, the web bundle returns 500 and the app shows a white screen.
  if (!config.server) config.server = {};
  config.server.unstable_transformProfile = 'default';

  return config;
})();
