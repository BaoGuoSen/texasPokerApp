import type { Player } from '@/types';

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { PlayerCard } from './PlayerCard';

const RightSidePlayers = ({ players }: { players: Player[] }) => {
  return (
    <View style={styles.right}>
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
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '25%',
    height: '100%',
  },
});

export default RightSidePlayers;