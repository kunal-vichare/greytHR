import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/main/DashboardScreen';
import AttendanceScreen from '../screens/main/AttendanceScreen';
import LeaveScreen from '../screens/main/LeaveScreen';
import AnnouncementsScreen from '../screens/main/AnnouncementsScreen';
import PerformanceScreen from '../screens/main/PerformanceScreen';
import FieldForceScreen from '../FieldForce/FieldForceScreen';

const Stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0F19' },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Leave" component={LeaveScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Performance" component={PerformanceScreen} />
      <Stack.Screen name="FieldForce" component={FieldForceScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
