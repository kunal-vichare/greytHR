import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../Constants/colors';

// Bar Chart Component (Flexbox-based)
export const BarChart = ({ data = [], maxValue = 10, height = 180 }) => {
  return (
    <View style={[styles.chartContainer, { height }]}>
      <View style={styles.chartYAxis}>
        <Text style={styles.yAxisText}>{maxValue}h</Text>
        <Text style={styles.yAxisText}>{Math.floor(maxValue / 2)}h</Text>
        <Text style={styles.yAxisText}>0h</Text>
      </View>
      
      <View style={styles.chartPlotArea}>
        {data.map((item, index) => {
          const percentage = Math.min((item.value / maxValue) * 100, 100);
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barTrack}>
                <View 
                  style={[
                    styles.barFill, 
                    { height: `${percentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
              <Text style={styles.barValue}>{item.value}h</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Progress Line Bar Component (horizontal gauge)
export const ProgressBar = ({ percentage = 0, color = COLORS.primary, height = 8 }) => {
  const clampedValue = Math.min(Math.max(percentage, 0), 100);
  return (
    <View style={styles.progressBarWrapper}>
      <View style={[styles.progressBarTrack, { height }]}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${clampedValue}%`, 
              backgroundColor: color,
              height 
            }
          ]} 
        />
      </View>
    </View>
  );
};

// Conic / Ring styled metric badge (simulating circle rings using concentric layout)
export const ProgressRingPlaceholder = ({ score = 85, title = 'Productivity' }) => {
  return (
    <View style={styles.ringContainer}>
      <View style={styles.ringOuter}>
        <View style={styles.ringInner}>
          <Text style={styles.ringScoreText}>{score}%</Text>
          <Text style={styles.ringLabelText}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginVertical: 12,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  yAxisText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  chartPlotArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    width: '100%',
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  barValue: {
    fontSize: 9,
    color: COLORS.text,
    fontWeight: 'bold',
    marginTop: 2,
  },
  
  // Progress Bar styles
  progressBarWrapper: {
    width: '100%',
    marginVertical: 6,
  },
  progressBarTrack: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    borderRadius: 4,
  },

  // Concentric circle ring styles
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ringOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    borderColor: COLORS.primary,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  ringInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScoreText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  ringLabelText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
