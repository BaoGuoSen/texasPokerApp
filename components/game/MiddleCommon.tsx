import type { GameEndRes, GameStartRes, PlayerTakeActionRes, StageChangeRes } from '@/types/game';

import React, { useState } from 'react';
import { ImageBackground } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Poke } from 'texas-poker-core/types/Deck/constant';

import { ThemeConfig } from "@/constants/ThemeConfig";
import { useUser } from '@/contexts/UserContext';
import { useRoomInfo } from '@/contexts/RoomContext';
import useWebSocketReceiver, { GameWSEvents } from '@/hooks/useWebSocketReceiver';

import { PokerCard } from './PokerCard';
import Actions from './Actions';

import { readyGame, startGame } from '@/service';

// interface IProps {
//   publicCards: (Poke | string)[];
//   totalPool: number;
// }

const MiddleCommon = () => {
  const [publicCards, setPublicCards] = useState<(Poke | string)[]>(['', '', '', '', '']);
  const [totalPool, setTotalPool] = useState<number>(0);
  const [intervalTimer, setIntervalTimer] = useState<NodeJS.Timeout | null>(null);

  const { user } = useUser();
  const { gameStatus, curButtonUserId, ownerId, roomId } = useRoomInfo();

  useWebSocketReceiver({
    handlers: {
      [GameWSEvents.GameStart]: ({ pool }: GameStartRes) => {
        setTotalPool(pool);

        intervalTimer && clearInterval(intervalTimer);
      },

      [GameWSEvents.PlayerTakeAction]: ({ pool }: PlayerTakeActionRes) => {
        setTotalPool(pool);
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

        if (restCommonPokes?.length === 0) {
          return;
        }

        const intervalTimer = setInterval(() => {
          index++;

          const firstEmptyIndex = publicCards.findIndex((value) => !value);
          const newPublicCards = publicCards;
          newPublicCards[firstEmptyIndex] = restCommonPokes?.[index] || '';

          setPublicCards(newPublicCards);
        }, 1500);

        setIntervalTimer(intervalTimer);
      }
    }
  });

  const handleReady = async () => {
    await readyGame({ id: roomId })
  }

  const handleDeal = async () => {
    await startGame({ id: roomId })
  }

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
        user?.id === Number(ownerId) && gameStatus === 'unReady' && (
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
        gameStatus === 'waiting' && curButtonUserId === user?.id && (
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
        gameStatus === 'running' && (
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