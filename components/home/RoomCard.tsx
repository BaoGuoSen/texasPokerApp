import type { Room } from '@/types';

import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { ImageBackground, Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { deleteRoom } from '@/service';
import { useUser } from '@/contexts/UserContext';
export type IProps = {
  room: Room;
  refresh: () => void;
};

export function RoomCard({ room, refresh }: IProps) {
  const router = useRouter();
  const { user } = useUser();

  const handlePress = async () => {
    router.push({
      pathname: '/game',
      params: { roomId: room.id, ownerId: room.owner.id }
    });
  };

  const handleDelete = async () => {
    await deleteRoom({ id: room.id });

    refresh();
  };

  return (
    <TouchableHighlight
      onPress={handlePress}
      underlayColor="#999"
      style={styles.container}
    >
      <ImageBackground contentFit="cover" style={styles.content}>
        <View style={styles.ownerContainer}>
          <View style={styles.ownerIcon}>
            <Text style={styles.ownerIconText}>owner</Text>
          </View>
          <Image source={room.owner.avatar} style={styles.ownerAvatar} />
          <Text style={styles.ownerName}>{room.owner.name} </Text>
        </View>

        <View style={styles.roomInfoContainer}>
          <Text style={styles.roomInfoText}>房号：{room?.id.slice(0, -1)}</Text>
          <Text style={styles.roomInfoText}>
            玩家：{room.totalCount}/{room.maximumCountOfPlayers}
          </Text>
          <Text style={styles.roomInfoText}>
            小盲注：{room.lowestBetAmount}
          </Text>
          <Text style={styles.roomInfoText}>房间状态：{room.status}</Text>
        </View>

        {user?.id === room.owner.id && (
          <TouchableHighlight
            underlayColor="#999"
            style={styles.delete}
            onPress={handleDelete}
          >
            <Text style={styles.deleBtn}>删除</Text>
          </TouchableHighlight>
        )}
      </ImageBackground>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
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
    marginVertical: 4
  },

  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 36
  },

  ownerContainer: {
    position: 'relative',
    marginLeft: 36,
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%'
  },

  ownerIcon: {
    position: 'absolute',
    left: -10,
    top: 5,
    zIndex: 1,
    transform: [{ rotate: '-45deg' }]
  },

  ownerIconText: {
    color: 'pink',
    fontSize: 12,
    fontWeight: 'bold'
  },

  ownerName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },

  roomInfoContainer: {
    height: '80%',
    display: 'flex',
    gap: 2,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  roomInfoText: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: 'bold'
  },

  delete: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 50,
    height: '30%',
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
