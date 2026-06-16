import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, FlatList } from 'react-native';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { AppContext } from '../../Context/AppContext';
import { AuthContext } from '../../Context/AuthContext';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { BarChart } from '../../components/Chart';

export const AttendanceScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const { attendanceLogs, activeCheckIn, clockIn, clockOut, getEmployeePerformance } = useContext(AppContext);

  const userId = currentUser?.id;
  const isAdmin = currentUser?.role === 'admin';

  // Filter logs for this specific employee
  const userLogs = isAdmin 
    ? attendanceLogs // Admin sees all logs
    : attendanceLogs.filter(log => log.userId === userId);

  const isClockedIn = !!activeCheckIn[userId];
  const performance = getEmployeePerformance(userId || 'EMP-202');

  const chartData = performance.weeklyTrend.map(item => ({
    label: item.day,
    value: item.hours,
  }));

  const handleClockToggle = () => {
    if (isClockedIn) {
      const result = clockOut(userId);
      if (result.success) {
        Alert.alert('Checked Out', `${STRINGS.checkOutSuccess} ${result.log.checkOut}.`);
      }
    } else {
      const result = clockIn(userId);
      if (result.success) {
        Alert.alert('Checked In', `${STRINGS.checkInSuccess} ${result.checkInTime}`);
      } else {
        Alert.alert('Error', result.error);
      }
    }
  };

  const renderLogItem = ({ item }) => {
    return (
      <View style={styles.logItem}>
        <View style={styles.logLeft}>
          <Text style={styles.logDate}>{item.date}</Text>
          {isAdmin && <Text style={styles.logUser}>ID: {item.userId}</Text>}
          <Text style={styles.logTime}>In: {item.checkIn}  |  Out: {item.checkOut || '--'}</Text>
        </View>
        <View style={styles.logRight}>
          <Text style={styles.logDuration}>{item.duration || '--'}</Text>
          <View style={[styles.statusIndicator, item.status === 'Present' ? styles.presentBadge : styles.leaveBadge]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={STRINGS.attendanceTitle} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Clock console */}
        {!isAdmin && (
          <Card header="Shift Control Desk" style={styles.consoleCard}>
            <View style={styles.consoleContent}>
              <View style={styles.clockCircle}>
                <Text style={styles.clockLabel}>{STRINGS.elapsedTime}</Text>
                <Text style={styles.clockTimer}>
                  {isClockedIn ? 'Active Shift' : '00:00:00'}
                </Text>
                <Text style={styles.clockSubLabel}>
                  {isClockedIn ? `Checked In: ${activeCheckIn[userId]?.checkInTime}` : 'Offline'}
                </Text>
              </View>
              
              <Button
                title={isClockedIn ? STRINGS.clockOutBtn : STRINGS.clockInBtn}
                type={isClockedIn ? 'danger' : 'secondary'}
                onPress={handleClockToggle}
                style={styles.consoleBtn}
              />
            </View>
          </Card>
        )}

        {/* Analytics chart (Employee only) */}
        {!isAdmin && (
          <Card header={STRINGS.workingHoursTrend} style={styles.chartCard}>
            <BarChart data={chartData} maxValue={12} />
            <Text style={styles.chartDescription}>
              Displaying hours logged during standard shifts this week.
            </Text>
          </Card>
        )}

        {/* History List */}
        <Text style={styles.historyTitle}>{STRINGS.attendanceTitle} History</Text>
        <Card noPadding style={styles.listCard}>
          {userLogs.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No attendance records logged.</Text>
            </View>
          ) : (
            <FlatList
              data={userLogs}
              renderItem={renderLogItem}
              keyExtractor={item => item.id}
              scrollEnabled={false} // since it's nested inside a ScrollView
              ItemSeparatorComponent={Separator}
            />
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  consoleCard: {
    marginBottom: 16,
  },
  consoleContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  clockCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.03)',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  clockLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clockTimer: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginVertical: 4,
  },
  clockSubLabel: {
    fontSize: 10,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  consoleBtn: {
    width: '80%',
    marginVertical: 0,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartDescription: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  listCard: {
    marginBottom: 10,
  },
  emptyList: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logLeft: {
    flex: 1,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  logUser: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  logRight: {
    alignItems: 'flex-end',
  },
  logDuration: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  presentBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 0.5,
    borderColor: COLORS.secondary,
  },
  leaveBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 0.5,
    borderColor: COLORS.danger,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});

const Separator = () => <View style={styles.separator} />;

export default AttendanceScreen;
