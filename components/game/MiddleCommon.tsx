import type { GameStartRes, PlayerTakeActionRes } from '@/types/game';

import React, { useState } from 'react';
import { ImageBackground } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { ThemeConfig } from "@/constants/ThemeConfig";
import { useUser } from '@/contexts/UserContext';
import { useRoomInfo } from '@/contexts/RoomContext';
import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';

import Actions from './Actions';
import GameSettle from './GameSettle';
import PublicCards from './PublicCards';
import PublicMessage from './PublicMessage';
import ReanimatedNumber from './ReanimatedNumber';

import { readyGame, startGame } from '@/service';

const MiddleCommon = () => {
  const [totalPool, setTotalPool] = useState<number>(0);
  const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timeout | null>(null);

  const { user } = useUser();
  const { gameStatus, curButtonUserId, ownerId, roomId } = useRoomInfo();

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.GameStart]: ({ pool }: GameStartRes) => {
        setTotalPool(pool);

        intervalTimer && clearInterval(intervalTimer);
      },

      [GameWSEvents.PlayerTakeAction]: ({ pool }: PlayerTakeActionRes) => {
        setTotalPool(pool);
      }
    }
  });

  const handleReady = async () => {
    await readyGame({ id: roomId })
  }

  const handleDeal = async () => {
    await startGame({ id: roomId })
  }

  return (
    <View style={styles.middle}>
      {/* 公共牌 */}
      <PublicCards />

      {/* 公共消息 */}
      <PublicMessage />

      {/* 结算 */}
      <GameSettle />

      {
        user?.id === Number(ownerId) && gameStatus === 'unReady' && (
          <ImageBackground
            style={styles.priceContainer}
          >
            <TouchableOpacity onPress={handleReady} style={styles.begin}>
              <ImageBackground style={styles.imageBack} source={ThemeConfig.gameBackImg}>
                <Text style={styles.startBtn}>开始游戏</Text>
              </ImageBackground>
            </TouchableOpacity>
          </ImageBackground>
        )
      }

      {
        gameStatus === 'waiting' && curButtonUserId === user?.id && (
          <ImageBackground
            style={styles.priceContainer}
          >
            <TouchableOpacity onPress={handleDeal} style={styles.begin}>
              <ImageBackground style={styles.imageBack} source={ThemeConfig.gameBackImg}>
                <Text style={styles.startBtn}>庄家发牌</Text>
              </ImageBackground>
            </TouchableOpacity>
          </ImageBackground>
        )
      }

      {
        gameStatus === 'running' && (
          <View style={styles.priceContainer}>
            <ReanimatedNumber value={totalPool} textStyle={styles.price} />
          </View>
        )
      }

      <Actions />
    </View>
  );
};

const styles = StyleSheet.create({
  middle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },

  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: '50%',
    width: '100%',
    height: '40%',
  },

  begin: {
    width: '50%',
    height: '50%',
    borderRadius: 16,
    backgroundColor: '#007BFF'
  },

  imageBack: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startBtn: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 36
  },

  coin: {
    width: 200,
    height: 100,
    borderRadius: 36,
  },

  price: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 800
  },
});

export default MiddleCommon;