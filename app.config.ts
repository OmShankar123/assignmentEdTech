import 'tsx/cjs';

import { ConfigContext, ExpoConfig } from 'expo/config';

import Env from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  slug: 'minilms',
  scheme: 'minilms',
  experiments: {
    reactCompiler: true,
  },
  version: Env.EXPO_PUBLIC_VERSION,
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.EXPO_PUBLIC_PACKAGE_NAME,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: Env.EXPO_PUBLIC_PACKAGE_NAME,
  },
  web: {
    favicon: './src/assets/favicon.png',
  },
  plugins: [
    'expo-localization',
    'expo-router',
    'expo-font',
    'react-native-edge-to-edge',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './src/assets/splash.png',
        imageWidth: 300,
        resizeMode: 'contain',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '16.0',
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow MiniLMS to access your photos to update your profile picture.',
      },
    ],
    ['./plugins/withIosDeploymentTarget.js', { deploymentTarget: '16.0' }],
  ],
});
