import './src/gesture-handler.native';
import React, { useEffect } from 'react';
import { Alert, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigation from './src/navigation/index';
import { COLORS } from './src/Constants/colors';
import { PermissionsAndroid } from 'react-native';
import { getMessaging, onMessage, registerDeviceForRemoteMessages, getToken as getFCMToken } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';


const App = () => {
  const requestPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    await fetchFCMToken();
    if (granted === PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
      // Alert.alert('Permission granted');
    } else {
      // Alert.alert('Permission denied'); 
    }
  }

  const fetchFCMToken = async () => {
    try {
      const messaging = getMessaging();
      await registerDeviceForRemoteMessages(messaging);
      const token = await getFCMToken(messaging);
      console.log('FCM Token:', token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestPermissionAndroid();
  }, []);

  useEffect(() => {
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log("remote msg: ",remoteMessage);
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  const onDisplayNotification=async(remoteMessage)=> {
    // Request permissions (required for iOS)

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional,defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <AppNavigation />
      </NavigationContainer>
    </Provider>
  );
};

export default App;