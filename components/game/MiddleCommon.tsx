import type { GameStartRes, PlayerTakeActionRes } from '@/types/game';

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useRoomInfo } from '@/contexts/RoomContext';
import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';

import Actions from './Actions';
import GameSettle from './GameSettle';
import PublicCards from './PublicCards';
import MiddleButton from './MiddleButton';
import PublicMessage from './PublicMessage';
import ReanimatedNumber from './ReanimatedNumber';

const MiddleCommon = () => {
  const [totalPool, setTotalPool] = useState<number>(0);

  const { gameStatus } = useRoomInfo();

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.GameStart]: ({ pool }: GameStartRes) => {
        setTotalPool(pool);
      },

      [GameWSEvents.PlayerTakeAction]: ({ pool }: PlayerTakeActionRes) => {
        setTotalPool(pool);
      }
    }
  });

  useEffect(() => {
    console.log('gameStatus', gameStatus);
  }, [gameStatus]);

  return (
    <View style={styles.middle}>
      {/* 公共牌 */}
      <PublicCards />

      {/* 公共消息 */}
      <PublicMessage />

      {/* 结算 */}
      <GameSettle />

      {
        (gameStatus === 'unReady' || gameStatus === 'waiting') && (
          <MiddleButton />
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

  price: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 800
  },
});

export default MiddleCommon;