import { View, Text, StyleSheet } from 'react-native'
import { useMemo } from 'react'

const TIPS = [
  {
    quote: "What is important is seldom urgent and what is urgent is seldom important.",
    author: "Dwight D. Eisenhower",
  },
  {
    quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    quote: "Until we can manage time, we can manage nothing else.",
    author: "Peter Drucker",
  },
  {
    quote: "Action expresses priorities.",
    author: "Mahatma Gandhi",
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    quote: "You can do anything, but not everything.",
    author: "David Allen",
  },
  {
    quote: "Decide what you want, decide what you are willing to exchange for it.",
    author: "H.L. Hunt",
  },
]

export function MotivationalTip() {
  // Get a random tip based on the day
  const tip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    return TIPS[dayOfYear % TIPS.length]
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>"{tip.quote}"</Text>
      <Text style={styles.author}>— {tip.author}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#4338CA',
    lineHeight: 22,
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
    textAlign: 'right',
  },
})
