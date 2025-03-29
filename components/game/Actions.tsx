import type { ActionType } from 'texas-poker-core/types/Player';

import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { throttle } from 'lodash';

interface ActionsProps {
  actions?: ActionType[];
  minBet?: number;
  maxBet?: number;
  isAction?: boolean;
}

const Actions = (props: ActionsProps) => {
  const {
    actions = ['call'],
    minBet = 0,
    maxBet = 10000,
    isAction = false
  } = props;

  const [value, setValue] = useState(50);
  const [playerAction, setPlayerAction] = useState<ActionType>();

  const mainBtnLabel = useMemo(() => {
    if (actions.includes('bet')) {
      setPlayerAction('bet');

      return `下注 ${value}`;
    }

    if (value === minBet) {
      setPlayerAction('call');

      return `跟注 ${minBet}`;
    }

    if (value === maxBet) {
      setPlayerAction('allIn');

      return 'ALL IN';
    }

    if (value > minBet) {
      setPlayerAction('raise');

      return `加注 ${value - minBet}`;
    }
  }, [value]);

  const throttledUpdate = useCallback(
    throttle((newValue: number) => {
      setValue(newValue);
    }, 50),
    []
  );

  const onMainBtn = useCallback(() => {

  }, []);

  const onFold = useCallback(() => {
    setPlayerAction('fold');
  }, []);

  const onCheck = useCallback(() => {
    setPlayerAction('check');
  }, []);

  return (
    <>
      {
        isAction ? (
          <View style={styles.actions}>
            <View style={styles.quickActions}>
              <Text style={styles.minMaxText}>{minBet}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={minBet}
                  maximumValue={maxBet}
                  minimumTrackTintColor="#3498db"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#2980b9"
                  step={1}
                  value={value}
                  onValueChange={throttledUpdate}
                />
              </View>
              <Text style={styles.minMaxText}>{maxBet}</Text>
            </View>

            <View style={styles.mainBtns}>
              <TouchableOpacity activeOpacity={0.7} onPress={onFold} style={[styles.btn, styles.fold]}>
                <Text style={[styles.btnText]}>弃牌</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={onMainBtn} style={[styles.btn, styles.bet]}>
                <Text style={[styles.btnText]}>{mainBtnLabel}</Text>
              </TouchableOpacity>

              {
                actions.includes('check') && (
                  <TouchableOpacity activeOpacity={0.7} onPress={onCheck} style={[styles.btn, styles.check]}>
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