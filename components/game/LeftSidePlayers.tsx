import type { Player } from '@/types';

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { PlayerCard } from './PlayerCard';

const LeftSidePlayers = ({ players }: { players: Player[] }) => {
  return (
    <View style={styles.left}>
        {
          players.map((player) => {
            return <PlayerCard
              isActive={false}
              key={player.id}
              {...player}
              id={player.id}
            />
          })
        }
      </View>
  );
};

const styles = StyleSheet.create({
  left: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 12,
    width: '25%',
    height: '100%',
  },
});

export default LeftSidePlayers;