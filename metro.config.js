const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force Babel transform profile for web (Hermes is native-only)
if (!config.server) config.server = {};
config.server.unstable_transformProfile = 'default';
config.server.unstable_enablePackageExports = true;

module.exports = config;
