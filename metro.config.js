const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Hermes transform profile is for native; web must use the default babel profile
// or the bundle fails and the app renders a blank (white) screen.
if (config.server) {
  config.server.unstable_transformProfile = 'default';
}

module.exports = config;
