export const COLORS = {
  // Brand Colors
  primary: '#4F46E5',        // Modern Indigo
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  
  secondary: '#10B981',      // Emerald Green
  secondaryDark: '#047857',
  
  accent: '#8B5CF6',         // Royal Violet
  accentDark: '#6D28D9',
  
  // Theme Backgrounds
  background: '#0B0F19',     // Rich deep obsidian blue-gray
  cardBg: '#161F30',         // Sleek slate card background
  cardBgGlass: 'rgba(22, 31, 48, 0.75)',
  modalBg: '#111827',
  
  // Text Colors
  text: '#F8FAFC',           // Pure white-gray for maximum readability
  textMuted: '#94A3B8',      // Slate grey for helper labels
  textDim: '#64748B',        // Muted gray for inactive or disabled items
  textDark: '#0B0F19',       // For high contrast black text (on light buttons)
  
  // Status Colors
  success: '#10B981',        // Green
  warning: '#F59E0B',        // Amber
  danger: '#EF4444',         // Rose red
  info: '#06B6D4',           // Cyan
  
  // Boarders & Dividers
  border: '#24334C',         // Indigo-slate border color
  borderLight: 'rgba(148, 163, 184, 0.15)',
  
  // Gradients (represented as array of hex codes for react-native-linear-gradient or logic-based rendering)
  gradients: {
    primary: ['#4F46E5', '#3730A3'],
    secondary: ['#10B981', '#059669'],
    accent: ['#8B5CF6', '#6D28D9'],
    danger: ['#EF4444', '#DC2626'],
    warning: ['#F59E0B', '#D97706'],
    card: ['#1E293B', '#111827'],
    glass: ['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.8)'],
    dashboard: ['#0B0F19', '#111827']
  }
};
