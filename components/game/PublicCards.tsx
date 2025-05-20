import type { GameEndRes, GameStartRes, StageChangeRes } from '@/types/game';

import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Poke } from 'texas-poker-core';

import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';

import { PokerCard } from './PokerCard';

export default function PublicCards() {
  const [publicCards, setPublicCards] = useState<(Poke | string)[]>(['', '', '', '', '']);

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.GameStart]: () => {
      },

      [GameWSEvents.StageChange]: ({ restCommonPokes }: StageChangeRes) => {
        let index = -1;

        const newPublicCards = publicCards.map((value) => {
          if (value) {
            return value;
          }

          index++;
          return restCommonPokes?.[index] || '';
        });

        setPublicCards(newPublicCards);
      },

      [GameWSEvents.GameEnd]: (gameEndRes: GameEndRes) => {
        const { restCommonPokes } = gameEndRes;
        let index = -1;

        const newPublicCards = publicCards.map((value) => {
          if (value) {
            return value;
          }

          index++;
          return restCommonPokes?.[index] || '';
        });

        setPublicCards(newPublicCards);
      }
    }
  });

  return (
    <View style={styles.publicCards}>
        {
          publicCards.map((value, index) => {
            return <PokerCard key={index} myIndex={index + 1} value={value} />
          })
        }
      </View>
  );
}

const styles = StyleSheet.create({
  publicCards: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '100%',
    height: '30%',
    paddingTop: 6,
  },
});
