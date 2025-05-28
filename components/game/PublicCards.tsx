import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Poke } from 'texas-poker-core';

import { GameWSEvents, gameEventManager } from '@/hooks/useWebSocketReceiver';
import type { GameEndRes, StageChangeRes } from '@/types/game';

import { PokerCard } from './PokerCard';

export default function PublicCards() {
  const [publicCards, setPublicCards] = useState<(Poke | string)[]>([
    '',
    '',
    '',
    '',
    ''
  ]);

  useEffect(() => {
    gameEventManager.subscribe('PublicCards', {
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
    });

    return () => {
      gameEventManager.clearAllFromKey('PublicCards');
    };
  }, [publicCards]);

  return (
    <View style={styles.publicCards}>
      {publicCards.map((value, index) => {
        return <PokerCard key={index} myIndex={index + 1} value={value} />;
      })}
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
    paddingTop: 6
  }
});
