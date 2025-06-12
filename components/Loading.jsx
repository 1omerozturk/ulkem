import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

export default function Loading() {
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [scaleAnim])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { transform: [{ scale: scaleAnim }] }]} />
      <Animated.View
        style={[
          styles.dot,
          { 
            transform: [{ scale: scaleAnim }],
            marginLeft: 10,
            animationDelay: 200,
          }
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { 
            transform: [{ scale: scaleAnim }],
            marginLeft: 10,
            animationDelay: 400,
          }
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
})