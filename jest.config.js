/** @type {import('jest-expo').JestPreset} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.pre-setup.js'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  // Transform all expo/RN packages that ship ES modules or TypeScript
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|react-native|expo|@expo|expo-modules-core|@unimodules|' +
      '@react-native-community|' +
      '@tanstack|react-query-kit|react-native-mmkv|' +
      'react-native-reanimated|react-native-gesture-handler|react-native-screens|' +
      'react-native-safe-area-context|react-native-toast-message|nativewind' +
      ')/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@env$': '<rootDir>/__mocks__/@env.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/assets/**',
    '!src/localization/translations/**',
  ],
};
