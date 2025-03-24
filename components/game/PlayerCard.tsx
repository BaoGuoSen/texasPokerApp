import type { Player } from '@/types'

import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { HandPokerCard } from './HandPokerCard';
import { useMyUser } from '@/hooks/useMyUser';
import { useEffect } from 'react';

const PlaceholderAvator = require('@/assets/images/avator_1.png');
const PlaceholderBack = require('@/assets/images/background_3.png');

export function PlayerCard({
  id,
  balance = 0,
  name = '人机',
  avatar = PlaceholderAvator,
  backgroudUrl = PlaceholderBack,
  handCards = ['', ''],
  isActive = true,
}: Player & { isActive: boolean; }) {
  const { user } = useMyUser();

  const progress = useSharedValue(0); // 控制动画进度

  // 定义动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${progress.value * 360}deg` }, // 旋转动画
      ],
    };
  });

  // 启动动画
  useEffect(() => {
    if (isActive) {
      progress.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1, // 无限循环
        true // 往返动画
      );
    } else {
      progress.value = withTiming(0); // 停止动画
    }
  }, [isActive]);

  return (
    <ImageBackground style={styles.container} contentFit='cover' source={backgroudUrl}>
      <View style={[styles.avatarContainer]}>
        <Image source={avatar} style={[styles.avator]} />
        {/* <Image source={avatar} style={[styles.avator, user?.id === id ? styles.me: '']} /> */}

        {/* 边框动画 */}
        <Animated.View style={[styles.borderContainer, animatedStyle]}>
          <Svg width="60" height="60">
            <Circle
              cx="30"
              cy="30"
              r="29" // 半径略小于头像
              stroke="red" // 边框颜色
              strokeWidth="4" // 边框宽度
              fill="none"
              strokeDasharray="10 5" // 虚线样式
            />
          </Svg>
        </Animated.View>
      </View>


      <View style={styles.content}>
        <View style={styles.handPokerContainer}>
          {
            handCards.map((item, index) => {
              return <HandPokerCard key={index} value={item} />
            })
          }
        </View>

        <View style={styles.info}>
          <Text style={styles.price}>$ {balance}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    maxHeight: '19%',
    paddingRight: 6,
    backgroundColor: '#fff'
  },

  avatarContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avator: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: '50%',
  },

  borderContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
  },

  me: {
    borderWidth: 1,
    borderColor: 'red'
  },

  content: {
    marginRight: 12,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6
  },

  handPokerContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    height: '80%',
    width: '100%',
    gap: 6,
    paddingBottom: 4
  },

  info: {
    display: 'flex',
    flexDirection: 'row-reverse',
    // alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    paddingLeft: 12
  },

  name: {
    color: 'yellow',
    fontWeight: 700,
  },

  price: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 14
  }
});
