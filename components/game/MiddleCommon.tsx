import type { GameStartRes, PlayerActionRes, PlayerTakeActionRes } from '@/types/game';
import type { ActionsState } from './Actions';

import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useUser } from '@/contexts/UserContext';
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
  const [actionState, setActionState] = useState<ActionsState>({
    actions: ['call'],
    minBet: 0,
    maxBet: 0
  });

  const { gameStatus } = useRoomInfo();
  const { user } = useUser();

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.GameStart]: ({ pool }: GameStartRes) => {
        setTotalPool(pool);
      },

      [GameWSEvents.PlayerTakeAction]: ({ pool }: PlayerTakeActionRes) => {
        setTotalPool(pool);
      },

      [GameWSEvents.PlayerAction]: (playerActionRes: PlayerActionRes) => {
        const {
          allowedActions,
          restrict,
          userInfo: { id }
        } = playerActionRes;

        if (id !== user?.id) {
          // doAction 接口报错，导致没有取消操作栏，所以需要手动设置 isAction 为 false
          setActionState({
            actions: ['call'],
            isAction: false,
            minBet: 0,
            maxBet: 0
          })

          return;
        }

        setActionState({
          actions: allowedActions,
          minBet: restrict?.min ?? 0,
          maxBet: restrict?.max ?? 0,
          isAction: true,
        });
      },

      [GameWSEvents.GameEnd]: () => {
        setActionState({
          isAction: false,
          minBet: 0,
          maxBet: 0
        });
      }
    }
  });

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

      <Actions actionState={actionState} />
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