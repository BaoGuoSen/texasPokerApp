import type { Player } from '@/types';

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Easing, Animated } from 'react-native';
import { Image } from 'expo-image';

import { PlayerCard } from './PlayerCard';

const LeftSide = ({
  players,
  playersHang = []
}: {
  players: Player[];
  playersHang: Player[];
}) => {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (players) {
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
    <View style={styles.left}>
      {playersHang.length > 0 && (
        <View style={styles.watchers}>
          {playersHang.slice(0, 3).map((player) => {
            return (
              <Image
                key={player.id}
                source={player.avatar}
                style={styles.avatar}
              />
            );
          })}
          <Text style={styles.watchersText}>{playersHang.length} 观战</Text>
        </View>
      )}
      <Animated.View style={[styles.players, { transform: [{ translateX }] }]}>
        {players.map((player) => {
          return <PlayerCard key={player.id} {...player} id={player.id} />;
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  left: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '25%',
    height: '100%'
  },

  watchers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 4,
    gap: 2
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%'
  },

  watchersText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 600,
    color: '#fff'
  },

  players: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 12
  }
});

export default LeftSide;
