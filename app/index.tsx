import type { Room, CreateParams } from "@/types";

import { StyleSheet, View, Text, FlatList, TouchableHighlight } from 'react-native';
import { useEffect, useState } from 'react';
import { Image, ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';

import { createGame, getAllRooms } from '@/service';
import { RoomCard } from "@/components/home/RoomCard";

export default function HomeScreen() {

  const [rooms, setRooms] = useState<Room[]>();

  const createRoom = async () => {
    await createGame({
      lowestBetAmount: 100,
      maximumCountOfPlayers: 10,
      allowPlayersToWatch: true
    })

    fetchData();
  }

  const fetchData = async () => {
    const rooms = await getAllRooms();

    setRooms(rooms);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ImageBackground  style={styles.container}>
      <LottieView
        source={require('@/assets/images/home_back_lottie.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />

      <TouchableHighlight  style={styles.infos}>
        <TouchableHighlight underlayColor="#999" onPress={createRoom} style={styles.cycle}>
          <Text  style={styles.startBtn}>创建房间</Text>
        </TouchableHighlight>
      </TouchableHighlight>

      <FlatList
        style={styles.rooms}
        data={rooms}
        renderItem={({ item, index }) => <RoomCard key={index} refresh={fetchData} room={item} />}
        keyExtractor={item => item?.id}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // gap: 2,
    width: '100%',
    height: '100%'
  },

  backgroundAnimation: {
    position: 'absolute',
    width: '40%',
    height: '100%',
    zIndex: -1, // 将动画置于底层
  },

  infos: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1677ff'
  },

  rooms: {
    // flex: 1,
    width: '60%',
    height: '100%',
    backgroundColor: 'black'
  },

  cycle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: 'black'
  },

  startBtn: {
    color: '#fff'
  }
});
