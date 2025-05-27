import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { GameConfig } from '@/constants/gameConfig';
import useWebSocketReceiver, {
  GameWSEvents,
  gameEventManager
} from '@/hooks/useWebSocketReceiver';
import type { GameEndRes } from '@/types/game';

/**
 * 游戏结算
 */
const GameSettle = () => {
  const [texts, setTexts] = useState<string[]>([]);
  const translateX = useRef(new Animated.Value(300)).current;
  const timer = useRef<NodeJS.Timeout | null>(null);

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.GameStart]: () => {
        setTexts([]);

        timer.current && clearTimeout(timer.current);
      },

      [GameWSEvents.GameSettle]: (gameEndRes: GameEndRes) => {
        const { settleList } = gameEndRes;

        setTexts(
          settleList.map(
            (item) => `Winner: ${item.userInfo.name} +${item.amount}`
          )
        );

        timer.current = setTimeout(() => {
          // 结算动画结束后，发布客户端游戏结束事件
          gameEventManager.publish(GameWSEvents.ClientGameEnd, gameEndRes);
          setTexts([]);
        }, GameConfig.settleDuration);
      }
    }
  });

  useEffect(() => {
    if (texts.length > 0) {
      fadeIn();

      timer.current = setTimeout(fadeOut, GameConfig.settleDuration);
      return () => {
        timer.current && clearTimeout(timer.current);
      };
    }
  }, [texts]);

  // 淡入动画
  const fadeIn = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  };

  // 淡出动画
  const fadeOut = () => {
    Animated.timing(translateX, {
      toValue: 300,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={[styles.container]}>
      {texts.map((text, index) => {
        return (
          <Animated.Text
            key={index}
            style={[styles.text, { transform: [{ translateX }] }]}
          >
            {text}
          </Animated.Text>
        );
      })}
    </Animated.View>
  );
};

// 样式
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    height: '100%',
    overflow: 'hidden',
    maxWidth: '100%'
  },

  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left'
  }
});

export default GameSettle;
