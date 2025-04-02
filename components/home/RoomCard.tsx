import type { Room } from "@/types";

import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';

import { deleteRoom } from '@/service';
import { useUser } from '@/contexts/UserContext';
export type IProps = {
  room: Room;
  refresh: () => void;
};

export function RoomCard({
  room, 
  refresh
}: IProps) {
  const router = useRouter();
  const { user } = useUser();

  const handlePress = async () => {
    router.push({ pathname: '/game', params: { roomId: room.id, ownerId: room.owner.id } })
  };

  const handleDelete = async () => {
    await deleteRoom({ id: room.id })

    refresh();
  };

  return (
    <TouchableHighlight onPress={handlePress} underlayColor="#999" style={styles.container}>
      <ImageBackground contentFit='cover' style={styles.content}>
        <Text style={styles.buttonText}>房号：{room?.id.slice(0, 4)} </Text>
        <Text style={styles.buttonText}>房主：{room.owner.name} </Text>
        <Text style={styles.buttonText}>玩家人数：{room.onSeatCount} </Text>
        <Text style={styles.buttonText}>观战人数：{room.hangCount} </Text>
        <Text style={styles.buttonText}>总人数：{room.totalCount}/{room.maximumCountOfPlayers}</Text>

        {
          user?.id === room.owner.id && (
            <TouchableHighlight underlayColor="#999" style={styles.delete} onPress={handleDelete}>
              <Text style={styles.deleBtn}>删除</Text>
              </TouchableHighlight>
          )
        }
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
    padding: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1677ff',
    marginVertical: 4,
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
  },

  delete: {
    width: 80,
    height: '40%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    backgroundColor: '#fff',
    borderRadius: 16
  },

  deleBtn: {
    color: 'red'
  }
});
