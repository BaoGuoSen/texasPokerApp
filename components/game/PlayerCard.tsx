import { Image, ImageBackground } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { roleMap } from 'texas-poker-core';

import { themeConfig } from '@/constants/ThemeConfig';
import { GameWSEvents, gameEventManager } from '@/hooks/useWebSocketReceiver';
import type { Player } from '@/types';
import type {
  GameEndRes,
  GameStartRes,
  PlayerActionRes,
  PlayerTakeActionRes
} from '@/types/game';

import { HandPokerCard } from './HandPokerCard';
import ReanimatedNumber from './ReanimatedNumber';

export function PlayerCard({
  balance = 0,
  name = '人机',
  role,
  avatar = themeConfig.defaultAvatar,
  backgroudUrl = themeConfig.playerBackImg,
  pokes = ['', ''],
  me = false,
  id
}: Player) {
  const [isActive, setIsActive] = useState(false);
  const [isShowHandsPokes, setIsShowHandsPokes] = useState(false);
  const [myAction, setMyAction] = useState('');
  const [isFold, setIsFold] = useState(false);
  const translateY = useSharedValue(0);

  // 定义动画样式
  const fadeOutStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  useEffect(() => {
    if (isFold) {
      translateY.value = withTiming(-1000, {
        duration: 500,
        easing: Easing.out(Easing.ease)
      });
    } else {
      // 还原
      translateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.ease)
      });
    }
  }, [isFold, translateY]);

  useEffect(() => {
    gameEventManager.subscribe(`PlayerCard${id}`, {
      [GameWSEvents.GameStart]: (gameStartRes: GameStartRes) => {
        const { defaultBets } = gameStartRes;

        const defaultBet = defaultBets.find((item) => item.userInfo.id === id);

        if (defaultBet) {
          setMyAction(`bet ${defaultBet.amount}`);
        }
      },

      [GameWSEvents.PlayerAction]: (playerActionRes: PlayerActionRes) => {
        const { userInfo } = playerActionRes;

        setIsActive(userInfo.id === id);
      },

      [GameWSEvents.PlayerTakeAction]: (
        playerTakeActionRes: PlayerTakeActionRes
      ) => {
        const { userInfo, actionType, amount } = playerTakeActionRes;

        if (actionType === 'fold' && userInfo.id === id) {
          setIsFold(true);
        }

        if (userInfo.id === id) {
          setMyAction(`${actionType} ${amount}`);
        }
      },

      [GameWSEvents.GameEnd]: (gameEndRes: GameEndRes) => {
        setIsShowHandsPokes(gameEndRes.showHandPokes);
        setIsActive(false);
      },

      [GameWSEvents.ClientGameEnd]: () => {
        setMyAction('');
        setIsShowHandsPokes(false);
        setIsFold(false);
      }
    });

    return () => {
      gameEventManager.clearAllFromKey(`PlayerCard${id}`);
    };
  }, [id]);

  // 控制动画进度
  const progress = useSharedValue(0);

  // 定义动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // 旋转动画
        { rotate: `${progress.value * 360}deg` }
      ]
    };
  });

  // 启动动画
  useEffect(() => {
    if (isActive) {
      progress.value = withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.linear
        }),
        // 无限循环
        -1
        // true // 往返动画
      );
    } else {
      // 停止动画
      progress.value = withTiming(0);
    }
  }, [isActive, progress]);

  return (
    <Animated.View style={[styles.animated, fadeOutStyle]}>
      <ImageBackground
        style={styles.container}
        contentFit="cover"
        source={backgroudUrl}
      >
        <View style={[styles.avatarContainer]}>
          {me && <View style={styles.meTitle} />}

          {role && <Text style={styles.role}>{roleMap.get(role) || ''}</Text>}

          <Image
            source={avatar}
            contentFit="cover"
            style={[styles.avator, me ? styles.me : '']}
          />

          {/* 边框动画 */}
          {isActive && (
            <Animated.View style={[styles.borderContainer, animatedStyle]}>
              <Svg width="60" height="60">
                <Circle
                  cx="30"
                  cy="30"
                  // 半径略小于头像
                  r="29"
                  // 边框颜色
                  stroke="red"
                  // 边框宽度
                  strokeWidth="4"
                  fill="none"
                  // 虚线样式
                  strokeDasharray="10 5"
                />
              </Svg>
            </Animated.View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.myAction}>{myAction}</Text>
          <ReanimatedNumber
            value={balance}
            textStyle={styles.price}
            expandScale={1.1}
          />
        </View>

        <View style={styles.handPokerContainer}>
          {pokes.map((item, index) => {
            return (
              <HandPokerCard
                key={index}
                value={item}
                me={me}
                isShowHandsPokes={isShowHandsPokes}
              />
            );
          })}
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animated: {
    width: '100%',
    height: '100%',
    maxHeight: '18%'
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingLeft: 4,
    paddingRight: 2,
    borderWidth: 0.3,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: 'transparent'
  },

  avatarContainer: {
    position: 'relative',
    width: '25%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  avator: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: '50%'
  },

  borderContainer: {
    position: 'absolute',
    width: 60,
    height: 60
  },

  me: {
    borderWidth: 2,
    borderColor: 'green'
  },

  meTitle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'green',
    borderRadius: '50%',
    top: 0,
    left: 0
  },

  role: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: 'red',
    fontSize: 12,
    fontWeight: 700,
    zIndex: 100
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '100%',
    flex: 1,
    paddingTop: 2,
    paddingLeft: 4,
    paddingBottom: 2
  },

  name: {
    color: themeConfig.playerNameColor,
    fontWeight: 700,
    fontFamily: 'SpaceMono'
  },

  myAction: {
    color: themeConfig.playerActionColor,
    fontWeight: 700
  },

  price: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 14
  },

  handPokerContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '90%',
    flex: 1,
    gap: 4
  }
});
