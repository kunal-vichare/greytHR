import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { AuthContext } from '../../Context/AuthContext';
import { AppContext } from '../../Context/AppContext';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressBar, ProgressRingPlaceholder } from '../../components/Chart';

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useContext(AuthContext);
  const { 
    announcements, 
    leaveBalances, 
    activeCheckIn, 
    clockIn, 
    clockOut, 
    getEmployeePerformance,
    employees
  } = useContext(AppContext);

  const isAdmin = currentUser?.role === 'admin';
  const userId = currentUser?.id;
  const userBalances = leaveBalances[userId] || { casual: 5, sick: 5, earned: 5 };
  const totalLeaveLeft = userBalances.casual + userBalances.sick + userBalances.earned;

  const isClockedIn = !!activeCheckIn[userId];
  const performance = getEmployeePerformance(userId || 'EMP-202');

  const handleClockToggle = () => {
    if (isClockedIn) {
      const result = clockOut(userId);
      if (result.success) {
        Alert.alert('Checked Out', `${STRINGS.checkOutSuccess} ${result.log.checkOut}. Duration: ${result.log.duration}`);
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

  const latestAnnouncement = announcements[0] || { title: 'No announcements', content: 'You are all caught up.' };

  return (
    <View style={styles.container}>
      <Header title={STRINGS.appName} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeBanner}>
          <View>
            <Text style={styles.welcomeText}>{STRINGS.welcomeBack}</Text>
            <Text style={styles.userName}>{currentUser?.name}</Text>
            <Text style={styles.userRole}>{currentUser?.designation}</Text>
          </View>
          <View style={[styles.badge, isAdmin ? styles.badgeAdmin : styles.badgeEmployee]}>
            <Text style={styles.badgeText}>
              {isAdmin ? STRINGS.adminBadge : STRINGS.employeeBadge}
            </Text>
          </View>
        </View>

        {/* Company Workspace Banner */}
        <View style={styles.companyInfoCard}>
          <Text style={styles.companyLabel}>{STRINGS.companyCodeText}</Text>
          <Text style={styles.companyValue}>{currentUser?.companyName} ({currentUser?.companyId})</Text>
        </View>

        {/* Navigation Grid Buttons */}
        <Text style={styles.sectionTitle}>Quick Access Tools</Text>
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('Attendance')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>📅</Text>
            <Text style={styles.gridText}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('Leave')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>🌴</Text>
            <Text style={styles.gridText}>Leave</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('Announcements')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>📢</Text>
            <Text style={styles.gridText}>Noticeboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => navigation.navigate('Performance')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>📈</Text>
            <Text style={styles.gridText}>Performance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, styles.fullWidthGridItem]} 
            onPress={() => navigation.navigate('FieldForce')}
            activeOpacity={0.8}
          >
            <Text style={styles.gridIcon}>📍</Text>
            <Text style={styles.gridText}>Field Force GPS check-in</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Widget */}
        {!isAdmin && (
          <Card header={STRINGS.todayStatus} style={styles.cardSpacing}>
            <View style={styles.attendanceRow}>
              <View>
                <Text style={styles.attendanceStateText}>
                  {isClockedIn ? 'SHIFT IS ACTIVE' : 'SHIFT NOT STARTED'}
                </Text>
                <Text style={styles.attendanceTimeSubText}>
                  {isClockedIn ? `Checked in at: ${activeCheckIn[userId]?.checkInTime}` : 'Tap below to log in today'}
                </Text>
              </View>
              <Button 
                title={isClockedIn ? STRINGS.clockOutBtn : STRINGS.clockInBtn} 
                type={isClockedIn ? 'danger' : 'secondary'}
                onPress={handleClockToggle}
                style={styles.clockBtn}
              />
            </View>
          </Card>
        )}

        {/* Main Stats Summary */}
        <View style={styles.statsRow}>
          {isAdmin ? (
            <Card style={styles.halfCard} header="Active Staff">
              <Text style={styles.bigStatNum}>{employees.filter(e => e.companyId === currentUser?.companyId).length}</Text>
              <Text style={styles.statSubText}>Enrolled Workers</Text>
            </Card>
          ) : (
            <Card style={styles.halfCard} header={STRINGS.leavesRemaining}>
              <Text style={styles.bigStatNum}>{totalLeaveLeft}</Text>
              <Text style={styles.statSubText}>Total Available Days</Text>
            </Card>
          )}

          <Card style={styles.halfCard} header={STRINGS.upcomingHoliday}>
            <Text style={styles.holidayName}>Solstice</Text>
            <Text style={styles.holidayDate}>June 23rd</Text>
          </Card>
        </View>

        {/* Noticeboard preview */}
        <Card header={STRINGS.announcementsFeed} style={styles.cardSpacing}>
          <Text style={styles.announcementTitle}>{latestAnnouncement.title}</Text>
          <Text style={styles.announcementExcerpt} numberOfLines={2}>
            {latestAnnouncement.content}
          </Text>
          <TouchableOpacity 
            style={styles.viewAllBtn} 
            onPress={() => navigation.navigate('Announcements')}
          >
            <Text style={styles.viewAllText}>{STRINGS.viewAll} Announcements →</Text>
          </TouchableOpacity>
        </Card>

        {/* Productivity Score Chart (Employee only) */}
        {!isAdmin && (
          <Card header="Performance Analytics Overview" style={styles.cardSpacing}>
            <View style={styles.analyticsRow}>
              <ProgressRingPlaceholder score={performance.productivityScore} title="Efficiency" />
              <View style={styles.analyticsTextDetails}>
                <Text style={styles.analyticsTitleText}>Overall Productivity Status</Text>
                <Text style={styles.analyticsBodyText}>
                  Your completion score is currently standing at <Text style={styles.bold}>{performance.completionRate}%</Text>, and you log an average of <Text style={styles.bold}>{performance.avgHours} hours</Text> daily.
                </Text>
                
                <Text style={styles.barLabel}>Task Completion Rate</Text>
                <ProgressBar percentage={performance.completionRate} color={COLORS.secondary} />
              </View>
            </View>
          </Card>
        )}

        {/* Analytics Summary (Admin only) */}
        {isAdmin && (
          <Card header="Workspace Productivity Summary" style={styles.cardSpacing}>
            <Text style={styles.analyticsTitleText}>Company Target Completion Rate</Text>
            <ProgressBar percentage={88} color={COLORS.secondary} />
            <Text style={styles.progressLabelText}>88% Completion rate this month</Text>

            <Text style={styles.analyticsTitleTextWithMargin}>Average Staff Working Hours</Text>
            <ProgressBar percentage={92} color={COLORS.primaryLight} />
            <Text style={styles.progressLabelText}>92% efficiency rating registered</Text>
          </Card>
        )}
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
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  userRole: {
    fontSize: 13,
    color: COLORS.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeAdmin: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 0.8,
    borderColor: COLORS.accent,
  },
  badgeEmployee: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    borderWidth: 0.8,
    borderColor: COLORS.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  companyInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 0.8,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 6,
    fontWeight: '600',
  },
  companyValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  fullWidthGridItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  gridText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  cardSpacing: {
    marginBottom: 14,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceStateText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  attendanceTimeSubText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  clockBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginVertical: 0,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  halfCard: {
    width: '48%',
    height: 115,
    marginVertical: 0,
  },
  bigStatNum: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  statSubText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.warning,
    marginTop: 6,
  },
  holidayDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  announcementExcerpt: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  viewAllBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  analyticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsTextDetails: {
    flex: 1,
    marginLeft: 16,
  },
  analyticsTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  analyticsTitleTextWithMargin: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 14,
  },
  analyticsBodyText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 15,
    marginBottom: 8,
  },
  bold: {
    color: COLORS.text,
    fontWeight: '700',
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  progressLabelText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default DashboardScreen;
