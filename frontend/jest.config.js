module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-firebase|@notifee|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|@gorhom|react-redux|@reduxjs|immer|redux)/)',
  ],
};
