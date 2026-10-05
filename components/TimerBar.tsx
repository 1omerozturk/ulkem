import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GAME_RULES } from '../constants/GameConfig';

const TimerBar = ({ duration = GAME_RULES.questionTimeSeconds * 1000, resetTrigger, paused = false }: { duration?: number; resetTrigger?: any; paused?: boolean }) => {
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = 1;
    if (!paused) progressAnim.value = withTiming(0, { duration });
    return () => cancelAnimation(progressAnim);
  }, [duration, resetTrigger]);

  useEffect(() => {
    if (paused) cancelAnimation(progressAnim);
    else if (progressAnim.value > 0) {
      progressAnim.value = withTiming(0, { duration: Math.max(1, duration * progressAnim.value) });
    }
  }, [duration, paused]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressAnim.value,
      [0, 0.5, 1],
      ['#EF5350', '#FFCA58', '#39B878']
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
