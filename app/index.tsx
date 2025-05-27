import { useIsFocused } from '@react-navigation/native';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import { Login } from '@/components/home/Login';
import { RoomCard } from '@/components/home/RoomCard';
import { UserCard } from '@/components/home/UserCard';
import { themeConfig } from '@/constants/ThemeConfig';
import { useUser } from '@/contexts/UserContext';
import { gameEventManager } from '@/hooks/useWebSocketReceiver';
import { createGame, getAllRooms } from '@/service';
import type { Room } from '@/types';

export default function HomeScreen() {
  // 检查页面是否处于焦点状态，页面返回刷新列表数据
  const isFocused = useIsFocused();
  const [rooms, setRooms] = useState<Room[]>();
  const { user } = useUser();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const createRoom = async () => {
    const { roomId } = await createGame({
      lowestBetAmount: 100,
      maximumCountOfPlayers: 10,
      allowPlayersToWatch: false,
      // 思考时间 单位秒
      thinkingTime: 90
    });

    // 创建房间后，跳转到房间页面
    router.push({ pathname: '/game', params: { roomId, ownerId: user?.id } });
  };

  const fetchData = async () => {
    const rooms = await getAllRooms();

    setRooms(rooms);
  };

  useEffect(() => {
    if (user && isFocused) {
      // 清除游戏事件管理器中的所有订阅者
      gameEventManager.clear();
      fetchData();
    }
  }, [isFocused, user]);

  return (
    <ImageBackground
      contentFit="cover"
      source={themeConfig.gameBackImg}
      style={styles.container}
    >
      <View style={styles.infos}>
        {user ? (
          <>
            <UserCard />

            <TouchableHighlight
              underlayColor="#999"
              onPress={createRoom}
              style={styles.cycle}
            >
              <Text style={styles.startBtn}>创建房间</Text>
            </TouchableHighlight>
          </>
        ) : (
          <Login />
        )}
      </View>

      {rooms?.length === 0 ? (
        <View style={styles.rooms}>
          <LottieView
            source={themeConfig.roomEmptyLottie}
            autoPlay
            loop
            style={styles.emptyList}
            resizeMode="cover"
          />
        </View>
      ) : (
        <FlatList
          style={styles.rooms}
          data={rooms}
          renderItem={({ item, index }) => (
            <RoomCard key={index} refresh={fetchData} room={item} />
          )}
          keyExtractor={(item) => item?.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await fetchData();
                setRefreshing(false);
              }}
              // Android 刷新图标颜色
              colors={['#fff', '#fff', '#fff']}
              // iOS 刷新指示器颜色
              tintColor="#fff"
              // title="下拉刷新..." // iOS 刷新提示文字
              // iOS 刷新提示文字颜色
              titleColor="#fff"
            />
          }
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: themeConfig.homeBackColor,
    width: '100%',
    height: '100%'
  },

  backgroundAnimation: {
    position: 'absolute',
    width: '40%',
    height: '100%',
    // 将动画置于底层
    zIndex: -1
  },

  infos: {
    width: '40%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12
  },

  rooms: {
    width: '60%',
    height: '100%'
  },

  emptyList: {
    width: '100%',
    height: '100%'
  },

  cycle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#1677ff'
  },

  startBtn: {
    color: '#fff'
  }
});
