/* eslint-disable no-undef */
require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(),
  initializeApp: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => {
  const messagingInstance = {
    getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
    registerDeviceForRemoteMessages: jest.fn(() => Promise.resolve()),
    onMessage: jest.fn(() => jest.fn()),
  };
  const messaging = jest.fn(() => messagingInstance);
  messaging.getMessaging = jest.fn(() => messagingInstance);
  messaging.getToken = jest.fn(() => Promise.resolve('mock-fcm-token'));
  messaging.registerDeviceForRemoteMessages = jest.fn(() => Promise.resolve());
  messaging.onMessage = jest.fn(() => jest.fn());
  return {
    __esModule: true,
    default: messaging,
    getMessaging: messaging.getMessaging,
    getToken: messaging.getToken,
    registerDeviceForRemoteMessages: messaging.registerDeviceForRemoteMessages,
    onMessage: messaging.onMessage,
  };
});

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(() => Promise.resolve('default')),
    displayNotification: jest.fn(() => Promise.resolve('notification-id')),
    onForegroundEvent: jest.fn(() => jest.fn()),
    onBackgroundEvent: jest.fn(() => jest.fn()),
  },
  createChannel: jest.fn(() => Promise.resolve('default')),
  displayNotification: jest.fn(() => Promise.resolve('notification-id')),
}));

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const actual = jest.requireActual('@react-navigation/stack');
  return {
    ...actual,
    createStackNavigator: () => {
      const Navigator = ({ children, initialRouteName }) => {
        const screens = React.Children.toArray(children);
        const activeScreen =
          screens.find(
            screen => screen.props && screen.props.name === initialRouteName,
          ) || screens[0];
        return activeScreen || null;
      };
      const Screen = ({ component: Component, children }) => {
        if (Component) {
          return React.createElement(Component);
        }
        return children || null;
      };
      return {
        Navigator,
        Screen,
      };
    },
  };
});
