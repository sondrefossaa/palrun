// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add support for path aliases
config.resolver.extraNodeModules = {
  "@": `${__dirname}/`,
  "@/*": `${__dirname}/*`,
};

// Add asset extensions
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = config;
