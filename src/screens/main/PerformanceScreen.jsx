import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { AppContext } from '../../Context/AppContext';
import { AuthContext } from '../../Context/AuthContext';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/Chart';

export const PerformanceScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const { getEmployeePerformance, employees } = useContext(AppContext);

  const isAdmin = currentUser?.role === 'admin';
  const userId = currentUser?.id;

  // Admin select employee state
  // const companyEmployees = employees?.filter(e => e.companyId === currentUser?.companyId);
  const [selectedEmp, setSelectedEmp] = useState(companyEmployees[0] || null);

  // Manager feedback input
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState({}); // empId -> feedback

  const currentEmpId = isAdmin ? (selectedEmp?.id || 'EMP-202') : userId;
  const performance = getEmployeePerformance(currentEmpId);

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter some feedback first.');
      return;
    }
    setSubmittedFeedback(prev => ({
      ...prev,
      [selectedEmp.id]: feedbackText
    }));
    Alert.alert('Success', `Feedback submitted to ${selectedEmp.name}.`);
    setFeedbackText('');
  };

  const getStatusColor = (score) => {
    if (score >= 90) return COLORS.secondary;
    if (score >= 80) return COLORS.primaryLight;
    return COLORS.warning;
  };

  const getStatusLabel = (score) => {
    if (score >= 90) return STRINGS.highPerformer;
    if (score >= 80) return STRINGS.satisfactory;
    return STRINGS.needsImprovement;
  };

  return (
    <View style={styles.container}>
      <Header title={STRINGS.performanceTitle} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Employee selector (Admin Only) */}
        {isAdmin && companyEmployees.length > 0 && (
          <Card header="Select Team Member" style={styles.selectorCard}>
            <View style={styles.selectorRow}>
              {companyEmployees.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  style={[styles.selectorTab, selectedEmp?.id === emp.id ? styles.activeSelectorTab : null]}
                  onPress={() => setSelectedEmp(emp)}
                >
                  <Text style={[styles.selectorTabText, selectedEmp?.id === emp.id ? styles.activeSelectorTabText : null]}>
                    {emp.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.selectorEmpId}>{emp.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Analytics Card */}
        <Card header={`${isAdmin ? (selectedEmp?.name || 'Employee') : 'My'} Performance Scorecard`}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreNum}>{performance.productivityScore}%</Text>
              <Text style={styles.scoreLabel}>{STRINGS.performanceScore}</Text>
            </View>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreNum}>{performance.avgHours}h</Text>
              <Text style={styles.scoreLabel}>{STRINGS.averageHoursText}</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{STRINGS.taskCompletionText}</Text>
              <Text style={styles.metricVal}>{performance.completionRate}%</Text>
            </View>
            <ProgressBar percentage={performance.completionRate} color={COLORS.secondary} />
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Clock-In Consistency</Text>
              <Text style={styles.metricVal}>94%</Text>
            </View>
            <ProgressBar percentage={94} color={COLORS.primaryLight} />
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>Performance Status Rank:</Text>
            <View style={[styles.statusTag, { borderColor: getStatusColor(performance.productivityScore) }]}>
              <Text style={[styles.statusTagText, { color: getStatusColor(performance.productivityScore) }]}>
                {getStatusLabel(performance.productivityScore)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Manager Feedback Form (Admin Only) */}
        {isAdmin && selectedEmp && (
          <Card header={`Submit Review for ${selectedEmp.name}`} style={styles.feedbackFormCard}>
            <Input
              label="Review & Feedback"
              placeholder="e.g. Great velocity, maintain communication logs..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              inputStyle={styles.feedbackInput}
            />
            <Button
              title="Submit Feedback"
              type="secondary"
              onPress={handleSubmitFeedback}
              style={styles.submitBtn}
            />
          </Card>
        )}

        {/* Feedback Display Card (Employee Only or Admin review summary) */}
        <Card header={STRINGS.managerFeedbackTitle} style={styles.feedbackCard}>
          <Text style={styles.feedbackText}>
            {isAdmin
              ? (submittedFeedback[selectedEmp?.id] || performance.feedback)
              : (submittedFeedback[userId] || performance.feedback)
            }
          </Text>
          <View style={styles.feedbackFooter}>
            <Text style={styles.reviewerText}>Reviewer: Sarah Jenkins (Admin)</Text>
            <Text style={styles.reviewerDate}>Cycle: Q2 2026</Text>
          </View>
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
  selectorCard: {
    marginBottom: 16,
  },
  selectorRow: {
    flexDirection: 'row',
  },
  selectorTab: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeSelectorTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectorTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  activeSelectorTabText: {
    color: COLORS.text,
  },
  selectorEmpId: {
    fontSize: 9,
    color: COLORS.textDim,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  scoreBlock: {
    alignItems: 'center',
  },
  scoreNum: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  statusTitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 0.8,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  feedbackFormCard: {
    marginTop: 16,
  },
  feedbackInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: 8,
    marginVertical: 0,
  },
  feedbackCard: {
    marginTop: 16,
  },
  feedbackText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  feedbackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  reviewerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  reviewerDate: {
    fontSize: 10,
    color: COLORS.textDim,
  },
});

export default PerformanceScreen;
