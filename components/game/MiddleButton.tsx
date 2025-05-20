import React from 'react';
import { ImageBackground } from 'expo-image';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { ThemeConfig } from '@/constants/ThemeConfig';
import { useUser } from '@/contexts/UserContext';
import { useRoomInfo } from '@/contexts/RoomContext';

import { readyGame, startGame } from '@/service';

const MiddleButton = () => {
  const { user } = useUser();
  const { gameStatus, curButtonUserId, ownerId, roomId } = useRoomInfo();

  const handleReady = async () => {
    await readyGame({ id: roomId });
  };

  const handleDeal = async () => {
    await startGame({ id: roomId });
  };

  return (
    <View style={styles.buttons}>
      {user?.id === Number(ownerId) && gameStatus === 'unReady' && (
        <ImageBackground style={styles.priceContainer}>
          <TouchableOpacity onPress={handleReady} style={styles.begin}>
            <ImageBackground
              style={styles.imageBack}
              source={ThemeConfig.gameBackImg}
            >
              <Text style={styles.startBtn}>开始游戏</Text>
            </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      )}

      {gameStatus === 'waiting' && curButtonUserId === user?.id && (
        <ImageBackground style={styles.priceContainer}>
          <TouchableOpacity onPress={handleDeal} style={styles.begin}>
            <ImageBackground
              style={styles.imageBack}
              source={ThemeConfig.gameBackImg}
            >
              <Text style={styles.startBtn}>庄家发牌</Text>
            </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    display: 'flex',
    width: '100%',
    height: '40%',
    overflow: 'hidden'
  },

  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },

  begin: {
    marginTop: 30,
    width: '40%',
    height: '60%',
    borderRadius: 16,
    backgroundColor: '#007BFF'
  },

  imageBack: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  startBtn: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 36
  }
});

export default MiddleButton;
