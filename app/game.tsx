import type { Poke } from 'texas-poker-core/types/Deck/constant';
import type { GameStatus, Player } from '@/types';

import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ImageBackground } from 'expo-image';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

import { usePlayers } from '@/hooks/usePlayers';
import useWebSocketReceiver from '@/hooks/useWebSocketReceiver';

import { splitArray } from '@/utils';
import { quitGame } from '@/utils/gameControl';
import { ThemeConfig } from "@/constants/ThemeConfig";

import LeftSide from '@/components/game/LeftSide';
import RightSidePlayers from '@/components/game/RightSidePlayers';
import MiddleCommon from '@/components/game/MiddleCommon';

import { startGame, endGame, readyGame } from '@/service';
import { useUser } from '@/contexts/UserContext';

export default function Game() {
  const {
    roomId = '',
    ownerId
  } = useGlobalSearchParams() as { roomId: string; ownerId: string; };

  const navigation = useNavigation();
  const { user } = useUser();
  const { players, playersHang } = usePlayers({ roomId });
  

  const [playersWithPokes, setPlayersWithPokes] = useState<Player[]>([]);
  const [leftPlayers, setLeftPlayers] = useState<Player[]>([]);
  const [rightPlayers, setRightPlayers] = useState<Player[]>([]);
  const [publicCards, setPublicCards] = useState<(Poke | string)[]>(['', '', '', '', '']);
  const [status, setStatus] = useState<GameStatus>('waiting');
  const [totalPool, setTotalPool] = useState<number>(0);

  const {
    status: wsStatus,
    lastMessage,
    error,
    reconnect
  } = useWebSocketReceiver({
    url: `wss://texas.wishufree.com/ws?userId=${user?.id}&roomId=${roomId}`,
    retries: 5,
    retryInterval: 3000,
    validate: (data) => {
      return !!data?.players && Array.isArray(data.players);
    },
    onMessage: (data) => {
      console.log('收到游戏数据:', data);
    }
  });

  const resetGame = () => {
    setStatus('waiting')
    setPlayersWithPokes([])
    setPublicCards(['', '', '', '', ''])
  }

  const end = async () => {
    setStatus('waiting')
    resetGame();
    await endGame({ id: roomId })

    setStatus('waiting')
    Alert.alert('当前游戏结束')
  }

  const handleReady = async () => {
    await readyGame({ id: roomId })
    setStatus('ready')
  };

  // 发牌, 仅限庄家的角色
  const handleDeal = async () => {
    await startGame({ id: roomId })
    // const {
    //   commonPokes,
    //   totalPool = 0,
    //   stage,
    //   positions
    // } = await startGame({ id: roomId })

    // const playersWithPokes = players?.map((player) => {
    //   const position = positions.find(item => item.userId === player.id);

    //   return { ...player, pokes: position?.pokes, role: position?.role };
    // })

    setStatus('begining');
    setPlayersWithPokes(playersWithPokes);
    setTotalPool(totalPool);
    // setPublicCards(commonPokes);
  }

  useEffect(() => {
    if (playersWithPokes?.length !== 0) {
      const [leftPlayers, rightPlayers] = splitArray(playersWithPokes);

      setLeftPlayers(leftPlayers);
      setRightPlayers(rightPlayers);
    } else if (players.length !== 0) {
      const [leftPlayers, rightPlayers] = splitArray(players);

      setLeftPlayers(leftPlayers);
      setRightPlayers(rightPlayers);
    }
  }, [players, playersWithPokes])

  return (
    <ImageBackground
      contentFit='cover'
      source={ThemeConfig.gameBackImg}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => quitGame(navigation, roomId)} style={styles.closeBtn}>
        <Icon name="close" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity onPress={end} style={styles.endGame}>
        <Icon name="lock-closed" size={24} color="#333" />
      </TouchableOpacity>

      <LeftSide players={leftPlayers} playersHang={playersHang} />

      <MiddleCommon
        publicCards={publicCards}
        totalPool={totalPool}
        status={status}
        ownerId={ownerId}
        handleDeal={handleDeal}
        handleReady={handleReady}
      />

      <RightSidePlayers players={rightPlayers} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    height: '100%',
    padding: 12,
    backgroundColor: ThemeConfig.gameBackColor
  },

  closeBtn: {
    position: 'absolute',
    top: 6,
    right: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#fff',
    width: 30,
    height: 30,
  },

  endGame: {
    position: 'absolute',
    top: 6,
    right: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'red',
    width: 30,
    height: 30,
  },
});
