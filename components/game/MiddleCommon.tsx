import type { GameStatus } from '@/types';

import React from 'react';
import { ImageBackground } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Poke } from 'texas-poker-core/types/Deck/constant';

import { ThemeConfig } from "@/constants/ThemeConfig";
import { useUser } from '@/contexts/UserContext';
import { PokerCard } from './PokerCard';
import Actions from './Actions';

interface IProps {
  publicCards: (Poke | string)[];
  totalPool: number;
  status: GameStatus;
  ownerId: string;
  handleDeal: () => void;
  handleReady: () => void;
}

const MiddleCommon = (props: IProps) => {
  const {
    publicCards,
    totalPool,
    status,
    ownerId,
    handleDeal,
    handleReady
  } = props;

  const { user } = useUser();

  return (
    <View style={styles.middle}>
      <View style={styles.publicCards}>
        {
          publicCards.map((value, index) => {
            return <PokerCard key={index} hidden={!value} value={value} />
          })
        }
      </View>

      {
        user?.id === Number(ownerId) && status === 'waiting' && (
          <ImageBackground
            style={styles.priceContainer}
          >
            <TouchableOpacity onPress={handleReady} style={styles.begin}>
              <ImageBackground style={styles.imageBack} source={ThemeConfig.gameBackImg}>
                <Text style={styles.startBtn}>开始游戏</Text>
              </ImageBackground>
            </TouchableOpacity>
          </ImageBackground>
        )
      }

      {
        status === 'ready' && (
          <ImageBackground
            style={styles.priceContainer}
          >
            <TouchableOpacity onPress={handleDeal} style={styles.begin}>
              <ImageBackground style={styles.imageBack} source={ThemeConfig.gameBackImg}>
                <Text style={styles.startBtn}>庄家发牌</Text>
              </ImageBackground>
            </TouchableOpacity>
          </ImageBackground>
        )
      }

      {
        status === 'begining' && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${totalPool}</Text>
          </View>
        )
      }

      <Actions />
    </View>
  );
};

const styles = StyleSheet.create({
  middle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    height: '100%',
  },

  publicCards: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '100%',
    height: '30%',
    paddingTop: 6,
  },

  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: '50%',
    width: '100%',
    height: '40%',
  },

  begin: {
    width: '50%',
    height: '50%',
    borderRadius: 16,
    backgroundColor: '#007BFF'
  },

  imageBack: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startBtn: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 36
  },

  coin: {
    width: 200,
    height: 100,
    borderRadius: 36,
  },

  price: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 800
  },
});

export default MiddleCommon;