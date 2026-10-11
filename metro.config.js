const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add asset extensions for audio and PDF files
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'ogg',
  'mp3',
  'wav',
  'm4a',
  'pdf',
  'epub'
];

// Include all default source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
];

// Blacklist native-only modules from Web build
if (process.env.EXPO_PUBLIC_PLATFORM === 'web') {
    config.resolver.blacklistRE = [
        /node_modules\/react-native-pdf\/.*/,
        /node_modules\/react-native-blob-util\/.*/,
        /node_modules\/react-native-mmkv\/.*/,
        /node_modules\/react-native-worklets-core\/.*/
    ];
}

module.exports = config;
