import type { Poke, Suit, Rank } from 'texas-poker-core/types/Deck/constant';

import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import React from 'react';
import Svg, { Text, G } from 'react-native-svg';

import { ThemeConfig } from "@/constants/ThemeConfig";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import PokerSuits from './PokerSuits';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GameWSEvents } from '@/hooks/useWebSocketReceiver';
import useWebSocketReceiver, { gameEventManager } from '@/hooks/useWebSocketReceiver';
import { StageChangeRes, GameEndRes } from '@/types/game';

export type PokerCardProps = {
  value: Poke | string;
  /** 公共牌顺序，从左到右 1-5 */
  myIndex?: number;
};

// 定义花色颜色
const suitColors = {
  s: 'black',
  h: 'red',
  d: 'red',
  c: 'black',
};

export const PokerCard = ({
  value,
  myIndex,
}: PokerCardProps) => {
  const rotate = useSharedValue(0); // 控制旋转角度
  const isFlippedRef = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.StageChange]: ({ stage }: StageChangeRes) => {
        // 翻前三张牌
        if (stage === 'flop') {
          if (myIndex === 1 || myIndex === 2 || myIndex === 3) {
            handleFlip('open');
          }

          return;
        }

        // 翻第4张牌
        if (stage === 'turn') {
          if (myIndex === 4) {
            handleFlip('open');
          }
        }

        // 翻第5张牌
        if (stage === 'river') {
          if (myIndex === 5) {
            handleFlip('open');
          }
        }
      },

      [GameWSEvents.GameEnd]: (gameEndRes: GameEndRes) => {
        const { restCommonPokes } = gameEndRes;

        // 依次翻剩余的牌, 一秒翻一张
        if (restCommonPokes.length > 0) {
          // 翻牌的起点
          let startIndex = 5 - restCommonPokes.length + 1;

          for (let i = 0; i < restCommonPokes.length; i++) {
            timer.current = setTimeout(() => {
              myIndex === startIndex && handleFlip('open');

              startIndex++;
            }, 1000 * i);
          }

          // 翻完牌后，关闭所有牌
          timer.current = setTimeout(() => {
            gameEventManager.publish(GameWSEvents.GameSettle, gameEndRes);
          }, 1000 * restCommonPokes.length);
        } else {
          gameEventManager.publish(GameWSEvents.GameSettle, gameEndRes);
        }
      },

      [GameWSEvents.ClientGameEnd]: () => {
        handleFlip('close');
        // TODO 触发洗牌动画, 清空计时器
        timer.current && clearTimeout(timer.current);
      }
    }
  });

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

  const [type, val] = useMemo(() => {
    return value.split('') as [Suit, Rank];
  }, [value]);

  // 处理点击事件
  const handleFlip = (type: 'open' | 'close') => {
    if (type === 'close') {
      isFlippedRef.current = false;
      rotate.value = withTiming(360, {
        duration: 500,
        easing: Easing.inOut(Easing.linear),
      });
    } else {
      isFlippedRef.current = true;
      rotate.value = withTiming(180, {
        duration: 500,
        easing: Easing.inOut(Easing.linear),
      });
    }
  };


  return (
    <TouchableOpacity style={styles.container}>
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
          source={ThemeConfig.pokerBackImg}
          style={styles.card}
          contentFit='contain'
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

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
    position: 'absolute', // 使正反面重叠
  },

  frontCard: {
    backgroundColor: '#fff',
    transform: [{ rotateY: '180deg' }], // 初始状态为背面
  },

  backCard: {
    backgroundColor: ThemeConfig.pokerBackColor,
  },

  topValue: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '25%'
  }
});
