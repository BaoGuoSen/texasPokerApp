import type { Room, CreateParams } from "@/types";

import { StyleSheet, View, Text, FlatList, TouchableHighlight } from 'react-native';
import { useEffect, useState } from 'react';
import { Image, ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';

import { createGame, getAllRooms } from '@/service';
import { RoomCard } from "@/components/home/RoomCard";
import { UserCard } from "@/components/home/UserCard";
import { useMyUser } from "@/hooks/useMyUser";

const background = require('@/assets/images/Cosmic-eidex-eidex_black.svg');

export default function HomeScreen() {
  const [rooms, setRooms] = useState<Room[]>();
  const { user } = useMyUser();

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
    <ImageBackground contentFit="cover" source={background} style={styles.container}>
      {/* <LottieView
        source={require('@/assets/images/home_back_lottie.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      /> */}

      <View style={styles.infos}>
        <UserCard user={user} />

        <TouchableHighlight underlayColor="#999" onPress={createRoom} style={styles.cycle}>
          <Text style={styles.startBtn}>创建房间</Text>
        </TouchableHighlight>
      </View>

      {
        rooms?.length === 0 ? (
          <View style={styles.rooms}>
            <LottieView
              source={require('@/assets/images/home_back_lottie.json')}
              autoPlay
              loop
              style={styles.emptyList}
              resizeMode='cover'
            />
          </View>
        ) : (
          <FlatList
            style={styles.rooms}
            data={rooms}
            renderItem={({ item, index }) => <RoomCard key={index} refresh={fetchData} room={item} />}
            keyExtractor={item => item?.id}
          />
        )
      }
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#222',
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12
    // backgroundColor: '#1677ff'
  },

  rooms: {
    width: '60%',
    height: '100%',
    // backgroundColor: 'black'
  },

  emptyList: {
    width: '100%',
    height: '100%',
  },

  cycle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1677ff'
  },

  startBtn: {
    color: '#fff'
  }
});
