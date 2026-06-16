import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../Constants/colors';
import { STRINGS } from '../Constants/strings';
import { AppContext } from '../Context/AppContext';
import { AuthContext } from '../Context/AuthContext';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const SITES = [
  { id: '1', name: 'Municipal Office Complex', coords: '19.0760° N, 72.8777° E' },
  { id: '2', name: 'Main HQ Office', coords: '19.0820° N, 72.8812° E' },
  { id: '3', name: 'Metro Construction Site B', coords: '19.1225° N, 72.9104° E' },
];

export const FieldForceScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const { fieldForceLogs, logFieldCheckpoint } = useContext(AppContext);

  const userId = currentUser?.id;
  const isAdmin = currentUser?.role === 'admin';

  // Filter logs
  const userLogs = isAdmin
    ? fieldForceLogs // Admin views all GPS checkins
    : fieldForceLogs.filter(log => log.userId === userId);

  const [selectedSite, setSelectedSite] = useState(SITES[0]);

  const handleLogCheckpoint = () => {
    const result = logFieldCheckpoint(userId, selectedSite.name, selectedSite.coords);
    if (result.success) {
      Alert.alert(
        'Success',
        `Site attendance registered at:\n${selectedSite.name}\n\nCoordinates: ${selectedSite.coords}`
      );
    }
  };

  const renderLogItem = ({ item }) => {
    return (
      <View style={styles.logItem}>
        <View style={styles.logLeft}>
          <Text style={styles.logSite}>{item.checkpoint}</Text>
          {isAdmin && <Text style={styles.logUser}>User ID: {item.userId}</Text>}
          <Text style={styles.logTime}>{item.time}</Text>
        </View>
        <Text style={styles.logCoords}>{item.coords}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={STRINGS.fieldForceTitle} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* GPS Console (Employee Only) */}
        {!isAdmin && (
          <Card header={STRINGS.gpsStatus} style={styles.consoleCard}>
            <View style={styles.statusBanner}>
              <View style={styles.dot} />
              <Text style={styles.statusText}>{STRINGS.gpsConnected}</Text>
            </View>

            <Text style={styles.label}>{STRINGS.checkPointPlaceholder}</Text>
            <View style={styles.siteGrid}>
              {SITES.map((site) => (
                <TouchableOpacity
                  key={site.id}
                  style={[styles.siteTab, selectedSite.id === site.id ? styles.activeSiteTab : null]}
                  onPress={() => setSelectedSite(site)}
                >
                  <Text style={[styles.siteText, selectedSite.id === site.id ? styles.activeSiteText : null]}>
                    {site.name}
                  </Text>
                  <Text style={styles.siteCoordsText}>{site.coords}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Active Site Check:</Text>
              <Text style={styles.summaryValue}>{selectedSite.name}</Text>
            </View>

            <Button
              title={STRINGS.logCheckpointBtn}
              type="secondary"
              onPress={handleLogCheckpoint}
              style={styles.submitBtn}
            />
          </Card>
        )}

        {/* History of logged locations */}
        <Text style={styles.historyHeading}>Checkpoint Log History</Text>
        <Card noPadding style={styles.listCard}>
          {userLogs.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No field check-ins logged.</Text>
            </View>
          ) : (
            <FlatList
              data={userLogs}
              renderItem={renderLogItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.secondary,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginRight: 8,
  },
  statusText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  siteGrid: {
    marginBottom: 8,
  },
  siteTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  activeSiteTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  siteText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  activeSiteText: {
    color: COLORS.text,
  },
  siteCoordsText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  divider: {
    height: 0.8,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '700',
  },
  submitBtn: {
    marginVertical: 0,
  },
  historyHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    paddingRight: 8,
  },
  logSite: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  logUser: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  logCoords: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});

const Separator = () => <View style={styles.separator} />;

export default FieldForceScreen;
