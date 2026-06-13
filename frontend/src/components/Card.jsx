import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../Constants/colors';

export const Card = ({
  children,
  style,
  onPress,
  header,
  footer,
  noPadding = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const touchProps = onPress ? { activeOpacity: 0.9, onPress } : {};

  return (
    <Container {...touchProps} style={[styles.card, style]}>
      {header && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
      )}
      <View style={[styles.content, noPadding && styles.noPadding]}>
        {children}
      </View>
      {footer && (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{footer}</Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});

export default Card;
