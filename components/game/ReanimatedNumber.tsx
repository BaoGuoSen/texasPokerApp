import React, { useEffect } from 'react';
import { TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';

const ReanimatedNumber = ({
  value,
  textStyle = {},
  expandScale = 1.3,
}: {
  value: number,
  textStyle: TextStyle,
  expandScale?: number,
}) => {
  const animatedValue = useSharedValue(value);
  const scale = useSharedValue(1);

  useEffect(() => {
    // 先放大再缩回
    scale.value = withSequence(
      withTiming(expandScale, { duration: 200 }),
      withTiming(1, { duration: 300, easing: Easing.out(Easing.elastic(1)) }),
    );

    animatedValue.value = withTiming(value, { duration: 1000 });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[animatedStyle, textStyle]}>
      ${Math.floor(animatedValue.value).toLocaleString()}
    </Animated.Text>
  );
};

export default ReanimatedNumber;