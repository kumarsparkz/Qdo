import { View, StyleSheet, ViewProps } from 'react-native'
import { ReactNode } from 'react'

interface CardProps extends ViewProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, variant = 'default', padding = 'md', style, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        styles[variant],
        styles[`padding_${padding}`],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: 'transparent',
    elevation: 0,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: 8,
  },
  padding_md: {
    padding: 16,
  },
  padding_lg: {
    padding: 24,
  },
})
