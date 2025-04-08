import type { PlayerActionRes } from '@/types/game';
import type { ActionType } from 'texas-poker-core/types/Player';

import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { throttle } from 'lodash';

import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';
import { useRoomInfo } from '@/contexts/RoomContext';
import { useUser } from '@/contexts/UserContext';

import { doAction } from '@/service';
interface ActionsState {
  actions?: ActionType[];
  minBet?: number;
  maxBet?: number;
  isAction?: boolean;
  playerAction?: ActionType;
}

const Actions = () => {
  const { user } = useUser();
  const { matchId, roomId } = useRoomInfo();

  const [actionState, setActionState] = useState<ActionsState>({
    actions: ['call'],
    minBet: 0,
    maxBet: 0,
    isAction: false,
  });

  const [value, setValue] = useState(0);

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.PlayerAction]: (playerActionRes: PlayerActionRes) => {
        const { allowedActions, restrict, userId } = playerActionRes;

        if (userId !== user?.id) {
          // doAction 接口报错，导致没有取消操作栏，所以需要手动设置 isAction 为 false
          setActionState({
            ...actionState,
            isAction: false,
          })

          return;
        }

        setValue(restrict?.min ?? 0);
        setActionState({
          actions: allowedActions,
          minBet: restrict?.min ?? 0,
          maxBet: restrict?.max ?? 0,
          isAction: true,
        });
      },

      [GameWSEvents.GameEnd]: () => {
        setActionState({
          actions: ['call'],
          minBet: 0,
          maxBet: 0,
          isAction: false
        });
      }
    }
  });

  const afterAction = useCallback(() => {
    setActionState({
      actions: ['call'],
      minBet: 0,
      maxBet: 0,
      isAction: false,
    });
  }, []);

  const mainBtnLabel = useMemo(() => {
    const { actions, minBet = 0, maxBet = 0 } = actionState;

    if (actions?.includes('bet')) {
      setActionState({
        ...actionState,
        playerAction: 'bet',
      });

      return `下注 ${value}`;
    }

    if (value === minBet) {
      setActionState({
        ...actionState,
        playerAction: 'call',
      });

      return `跟注 ${minBet}`;
    }

    if (value === maxBet) {
      setActionState({
        ...actionState,
        playerAction: 'allIn',
      });

      return 'ALL IN';
    }

    if (value > minBet) {
      setActionState({
        ...actionState,
        playerAction: 'raise',
      });

      return `加注 ${value - minBet}`;
    }
  }, [value]);

  const throttledUpdate = useCallback(
    throttle((newValue: number) => {
      setValue(newValue);
    }, 50),
    []
  );

  const onMainBtn = async () => {
    if (!matchId) {
      Alert.alert('对局Id 错误');

      return;
    };

    await doAction({
      amount: value,
      actionType: actionState.playerAction ?? 'call',
      matchId,
      roomId
    })

    afterAction()
  };

  const onSubBtn = async (actionType: 'fold' | 'check') => {
    if (!matchId) {
      Alert.alert('对局Id 错误');

      return;
    };

    await doAction({
      actionType,
      matchId,
      roomId
    })

    afterAction()
  }

  return (
    <>
      {
        actionState.isAction ? (
          <View style={styles.actions}>
            <View style={styles.quickActions}>
              <Text style={styles.minMaxText}>{actionState.minBet}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={actionState.minBet}
                  maximumValue={actionState.maxBet}
                  minimumTrackTintColor="#3498db"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#2980b9"
                  step={1}
                  value={value}
                  onValueChange={throttledUpdate}
                />
              </View>
              <Text style={styles.minMaxText}>{actionState.maxBet}</Text>
            </View>

            <View style={styles.mainBtns}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => onSubBtn('fold')} style={[styles.btn, styles.fold]}>
                <Text style={[styles.btnText]}>弃牌</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={onMainBtn} style={[styles.btn, styles.bet]}>
                <Text style={[styles.btnText]}>{mainBtnLabel}</Text>
              </TouchableOpacity>

              {
                actionState.actions?.includes('check') && (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onSubBtn('check')} style={[styles.btn, styles.check]}>
                    <Text style={[styles.btnText]}>过牌</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        ) : (
          null
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'center',
    marginTop: 12,
    width: '100%',
    flex: 1,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6
  },

  quickActions: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },

  sliderContainer: {
    width: '100%',
    flex: 1,
    height: 40,
    position: 'relative',
  },

  slider: {
    width: '100%',
    height: 40,
  },

  minMaxText: {
    color: '#fff',
    fontWeight: 500,
    fontSize: 16
  },

  mainBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
    marginTop: 4,
    gap: 4
  },

  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },

  btnText: {
    color: '#fff',
    fontWeight: 500,
    fontSize: 16
  },

  fold: {
    flex: 1,
    height: '100%',
    backgroundColor: 'red'
  },

  bet: {
    flex: 3,
    height: '100%',
    backgroundColor: 'green'
  },

  check: {
    flex: 1,
    height: '100%',
    backgroundColor: '#999'
  },
});

export default Actions;