import React, { useEffect } from 'react';
import { TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  useAnimatedStyle
} from 'react-native-reanimated';

const ReanimatedNumber = ({
  value,
  textStyle = {},
  expandScale = 1.3
}: {
  value: number;
  textStyle: TextStyle;
  expandScale?: number;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    // 先放大再缩回
    scale.value = withSequence(
      withTiming(expandScale, { duration: 200 }),
      withTiming(1, { duration: 300, easing: Easing.out(Easing.elastic(1)) })
    );
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.Text style={[animatedStyle, textStyle]}>
      ${value.toLocaleString()}
    </Animated.Text>
  );
};

export default ReanimatedNumber;
