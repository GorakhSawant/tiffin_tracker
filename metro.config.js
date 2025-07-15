const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = projectRoot;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Add custom watch folders
config.watchFolders = [workspaceRoot];

// Configure module resolution paths
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Configure file extensions
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = [
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'bmp',
  // Fonts
  'ttf', 'otf', 'woff', 'woff2',
  // Other
  'db', 'sqlite', 'mp4', 'mp3', 'wav'
];

// Enable symlinks
config.resolver.enableSymlinks = true;

module.exports = config;
