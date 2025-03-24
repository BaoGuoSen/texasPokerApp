import type { Poke, Suit, Rank } from 'texas-poker-core/types/Deck/constant';

import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Image, ImageBackground } from 'expo-image';

import Svg, { Text, G } from 'react-native-svg';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import PokerSuits from './PokerSuits';
import { useRef } from 'react';

export type PokerCardProps = {
  value: Poke | string;
  hidden: boolean;
};

// 定义花色颜色
const suitColors = {
  s: 'black',
  h: 'red',
  d: 'red',
  c: 'black',
};

const background = require('@/assets/images/Cosmic-eidex-eidex_black.svg');

export function PokerCard({
  value,
}: PokerCardProps) {
  const [type, val] = value.split('') as [Suit, Rank]

  const rotate = useSharedValue(0); // 控制旋转角度
  const isFlipped = useRef(false); // 记录当前是否翻转

  // 定义动画样式
  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 }, // 透视效果
        { rotateY: `${rotate.value + 180}deg` }, // 背面旋转角度
      ],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotate.value}deg` }, // Y 轴旋转
        
      ],
    };
  });

  // 处理点击事件
  const handleFlip = () => {
    if (isFlipped.current) {
      rotate.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.linear),
      });
    } else {
      rotate.value = withTiming(180, {
        duration: 500,
        easing: Easing.inOut(Easing.linear),
      });
    }

    isFlipped.current = !isFlipped.current; // 切换状态
  };


  return (
    <TouchableOpacity style={styles.container} onPress={handleFlip}>
      {/* 正面 */}
      <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
        <Svg style={styles.topValue}>
          <G>
            {/* 显示数字 */}
            <Text
              x={'10%'}
              y={'100%'}
              fontSize={25}
              fill={suitColors[type]}
              fontWeight="bold"
            >
              {val?.toUpperCase() === 'T' ? '10' : val?.toUpperCase()}
            </Text>
          </G>
        </Svg>

        <PokerSuits type={type} />
      </Animated.View>

      {/* 背面 */}
      <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
        <ImageBackground
          source={background}
          style={styles.card}
          contentFit='contain'
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '15%',
    height: '100%',
  },

  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden', // 隐藏背面
    borderRadius: 6,
    // borderWidth: 1,
    // borderColor: '',
    position: 'absolute', // 使正反面重叠
  },

  frontCard: {
    backgroundColor: '#fff',
    transform: [{ rotateY: '180deg' }], // 初始状态为背面
  },

  backCard: {
    backgroundColor: '#fff',
  },

  topValue: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // flex: 1
    height: '25%'
  }
});
