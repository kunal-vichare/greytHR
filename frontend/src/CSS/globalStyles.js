import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../Constants/colors';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  // Main Container layouts
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  
  // Flex Utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Cards & Containers
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardGlass: {
    backgroundColor: COLORS.cardBgGlass,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // Typography Styles
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 12,
    letterSpacing: 0.3,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  bodyTextMuted: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  boldText: {
    fontWeight: '700',
  },
  
  // Form elements styling
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputField: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  inputFieldError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
  
  // Buttons
  btn: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    backgroundColor: COLORS.secondary,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  btnTextPrimary: {
    color: COLORS.text,
  },
  btnTextOutline: {
    color: COLORS.primary,
  },
  
  // Badges & Indicators
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeAdmin: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: COLORS.accent,
    borderWidth: 0.5,
  },
  badgeEmployee: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderColor: COLORS.primary,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Utility Dimensions
  windowWidth: width,
  windowHeight: height,
});
