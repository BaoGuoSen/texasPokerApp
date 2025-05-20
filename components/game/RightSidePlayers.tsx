import type { Player } from '@/types';

import React, { useRef, useEffect } from 'react';
import { Easing, Animated, StyleSheet } from 'react-native';

import { PlayerCard } from './PlayerCard';

const RightSidePlayers = ({ players = [] }: { players: Player[] }) => {
  const translateX = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (players.length > 0) {
      fadeIn();
    }
  }, [players]);

  // 淡入动画
  const fadeIn = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={[styles.right, { transform: [{ translateX }] }]}>
      {players.map((player) => {
        return <PlayerCard key={player.id} {...player} id={player.id} />;
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '25%',
    height: '100%',
    overflow: 'hidden'
  }
});

export default RightSidePlayers;
