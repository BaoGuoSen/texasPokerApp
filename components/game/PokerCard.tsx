import { ImageBackground } from 'expo-image';
import React, { useCallback, useEffect } from 'react';
import { useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Svg, { G, Text } from 'react-native-svg';
import type { Poke, Rank, Suit } from 'texas-poker-core';

import { themeConfig } from '@/constants/ThemeConfig';
import { GameWSEvents, gameEventManager } from '@/hooks/useWebSocketReceiver';
import { GameEndRes, StageChangeRes } from '@/types/game';

import PokerSuits from './PokerSuits';

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
  c: 'black'
};

export const PokerCard = ({ value, myIndex }: PokerCardProps) => {
  // 控制旋转角度
  const rotate = useSharedValue(0);
  const isFlippedRef = useRef(false);
  const timer = useRef<number | null>(null);

  // 处理点击事件
  const handleFlip = useCallback(
    (type: 'open' | 'close') => {
      if (type === 'close') {
        isFlippedRef.current = false;
        rotate.value = withTiming(360, {
          duration: 500,
          easing: Easing.inOut(Easing.linear)
        });
      } else {
        isFlippedRef.current = true;
        rotate.value = withTiming(180, {
          duration: 500,
          easing: Easing.inOut(Easing.linear)
        });
      }
    },
    [rotate]
  );

  useEffect(() => {
    gameEventManager.subscribe(`PokerCard_${myIndex}`, {
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
    });

    return () => {
      gameEventManager.clearAllFromKey(`PokerCard_${myIndex}`);
    };
  }, [handleFlip, myIndex, value]);

  // 定义动画样式
  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // 透视效果
        { perspective: 1000 },
        // 背面旋转角度
        { rotateY: `${rotate.value + 180}deg` }
      ]
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        // Y 轴旋转
        { rotateY: `${rotate.value}deg` }
      ]
    };
  });

  const [type, val] = useMemo(() => {
    return value.split('') as [Suit, Rank];
  }, [value]);

  return (
    <TouchableOpacity style={styles.container}>
      {/* 正面 */}
      <Animated.View
        style={[styles.card, styles.frontCard, frontAnimatedStyle]}
      >
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
          source={themeConfig.pokerBackImg}
          style={styles.card}
          contentFit="contain"
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
    height: '100%'
  },

  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // 隐藏背面
    backfaceVisibility: 'hidden',
    borderRadius: 6,
    // 使正反面重叠
    position: 'absolute'
  },

  frontCard: {
    backgroundColor: '#fff',
    // 初始状态为背面
    transform: [{ rotateY: '180deg' }]
  },

  backCard: {
    backgroundColor: themeConfig.pokerBackColor
  },

  topValue: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '25%'
  }
});
