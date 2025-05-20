import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TimerBar = ({ duration = 20000, resetTrigger }: { duration?: number; resetTrigger?: any }) => {
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = 0;
    progressAnim.value = withTiming(1, { duration });
  }, [resetTrigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressAnim.value,
      [0, 0.5, 1],
      ['#5EFE4F', '#FFDD00', '#FE0000'] // yeşil -> sarı -> kırmızı
    );

    return {
      width: `${progressAnim.value * 100}%`,
      backgroundColor,
    };
  });

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
});

export default TimerBar;
