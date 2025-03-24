import type { Room, CreateParams } from "@/types";

import { View, StyleSheet, TouchableHighlight, Text, Button } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { useNavigation, useRouter } from 'expo-router';

import { joinRoom, deleteRoom } from '@/service';

export type IProps = {
  room: Room;
  refresh: () => void;
};

export function RoomCard({
  room, 
  refresh
}: IProps) {
  const router = useRouter();
  const handlePress = async () => {
    await joinRoom({ id: room.id, userId: 7 })

    router.push({ pathname: '/game', params: { roomId: room.id } })
  };

  const handleDelete = async () => {
    await deleteRoom({ id: room.id, userId: 2 })

    refresh();
  };

  return (
    <TouchableHighlight onPress={handlePress} underlayColor="#999" style={styles.container}>
      <ImageBackground style={styles.content} source={room.owner.avatar}>
        <Text style={styles.buttonText}>房号：{room?.id.slice(0, 4)} </Text>
        <Text style={styles.buttonText}>房主：{room.owner.name}</Text>
        <Text style={styles.buttonText}> 人数：{room.onSeatCount}/{room.maximumCountOfPlayers}</Text>

        <Button title="删除" onPress={handleDelete} />
      </ImageBackground>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
    padding: 4,
    borderRadius: 4
    // marginVertical: 2,
  },

  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff'
  }
});
