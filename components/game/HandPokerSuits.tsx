import type { Suit } from 'texas-poker-core';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

// 渲染黑桃
const Spade = () => (
  <Image style={styles.suitIcon} source={require('@/assets/images/spade.png')} />
);

const Heart = () => (
  <Image style={styles.suitIcon} source={require('@/assets/images/heart.png')} />
);

const Club = () => (
  <Image style={styles.suitIcon} source={require('@/assets/images/club.png')} />
)

const Diamond = () => (
  <Image style={styles.suitIcon} source={require('@/assets/images/diamond.png')} />
)

const HandPokerSuits = ({ type }: { type: Suit }) => {
  return (
    <View>
      {
        type === 's' && (
          <Spade />
        )
      }
      {
        type === 'h' && (
          <Heart />
        )
      }
      {
        type === 'c' && (
          <Club />
        )
      }
      {
        type === 'd' && (
          <Diamond />
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  suitIcon: {
    width: 22,
    height: '100%'
  }
});

export default HandPokerSuits;