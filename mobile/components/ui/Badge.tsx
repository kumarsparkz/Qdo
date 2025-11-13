import { View, Text, StyleSheet } from 'react-native'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[`size_${size}`]]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  // Variants
  default: {
    backgroundColor: '#F3F4F6',
  },
  success: {
    backgroundColor: '#D1FAE5',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  danger: {
    backgroundColor: '#FEE2E2',
  },
  info: {
    backgroundColor: '#DBEAFE',
  },
  purple: {
    backgroundColor: '#EDE9FE',
  },
  // Sizes
  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  size_md: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  text_default: {
    color: '#374151',
  },
  text_success: {
    color: '#065F46',
  },
  text_warning: {
    color: '#92400E',
  },
  text_danger: {
    color: '#991B1B',
  },
  text_info: {
    color: '#1E40AF',
  },
  text_purple: {
    color: '#6B21A8',
  },
  text_sm: {
    fontSize: 11,
  },
  text_md: {
    fontSize: 12,
  },
})
