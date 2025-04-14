import type { ActionType } from 'texas-poker-core/types/Player';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { throttle } from 'lodash';

import { useRoomInfo } from '@/contexts/RoomContext';

import { doAction } from '@/service';
export interface ActionsState {
  actions?: ActionType[];
  minBet?: number;
  maxBet?: number;
  isAction?: boolean;
  playerAction?: ActionType;
}

const Actions = (props: {
  actionState: ActionsState;
}) => {
  const { matchId, roomId } = useRoomInfo();

  const [value, setValue] = useState<number | undefined>();
  const [isShowSlider, setIsShowSlider] = useState<boolean>();
  const [actionType, setActionType] = useState<ActionType>('call');

  const mainBtnLabel = useMemo(() => {
    const { actions, minBet = 0, maxBet = 0 } = props.actionState;
    const betValue = value ?? minBet;

    if (betValue === maxBet) {
      setActionType('allIn')

      return 'ALL IN';
    }

    if (actions?.includes('bet')) {
      setActionType('bet')

      return `下注 ${betValue}`;
    }

    // 没有 amout 行为，取消滑动条
    if (!actions?.some(item => ['bet', 'raise', 'call'].includes(item))) {
      setIsShowSlider(false);
      setActionType('allIn');

      // 主按钮只能是 ALL IN
      return 'ALL IN';
    }

    if (betValue === minBet) {
      setActionType('call')

      return `跟注 ${minBet}`;
    }

    if (betValue > minBet) {
      setActionType('raise')

      return `加注 ${betValue - minBet}`;
    }
  }, [value, props.actionState]);

  const throttledUpdate = useCallback(
    throttle((newValue: number) => {
      setValue(newValue);
    }, 50),
    []
  );

  useEffect(() => {
    return () => {
      setValue(undefined);
      setIsShowSlider(true);
    }
  }, [props.actionState])

  // useEffect(() => {
  //   return () => {
  //     setIsShowSlider(true);
  //   }
  // }, [props.actionState.actions])

  const onMainBtn = async () => {
    if (!matchId) {
      Alert.alert('对局Id 错误');

      return;
    };

    const amount = value ?? props.actionState.minBet;

    await doAction({
      amount: actionType === 'allIn' ? undefined : amount,
      actionType,
      matchId,
      roomId
    })
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
  }

  const sliderRender = useMemo(() => {
    return
  }, [props.actionState.minBet, props.actionState.maxBet, value])

  return (
    <>
      {
        props.actionState.isAction ? (
          <View style={styles.actions}>
            {
              isShowSlider && (
                <View style={styles.quickActions}>
                  <Text style={styles.minMaxText}>{props.actionState.minBet}</Text>
                  <View style={styles.sliderContainer}>
                    { props.actionState.minBet && props.actionState.maxBet && (
                      <Slider
                        style={styles.slider}
                        minimumValue={props.actionState.minBet}
                        maximumValue={props.actionState.maxBet}
                        minimumTrackTintColor="#3498db"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#2980b9"
                        step={1}
                        value={value}
                        onValueChange={throttledUpdate}
                      />
                    )}
                  </View>
                  <Text style={styles.minMaxText}>{props.actionState.maxBet}</Text>
                </View>
              )
            }

            <View style={styles.mainBtns}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => onSubBtn('fold')} style={[styles.btn, styles.fold]}>
                <Text style={[styles.btnText]}>弃牌</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={onMainBtn} style={[styles.btn, styles.bet]}>
                <Text style={[styles.btnText]}>{mainBtnLabel}</Text>
              </TouchableOpacity>

              {
                props.actionState.actions?.includes('check') && (
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