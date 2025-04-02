import type { Poke } from 'texas-poker-core/types/Deck/constant';
import type { Player } from '@/types';
import type {
  SetRoleRes,
  GameStatus,
  WsData,
  PlayerOnSeatRes
} from '@/types/game';

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

import { startGame, endGame, readyGame, joinRoom } from '@/service';
import { useUser } from '@/contexts/UserContext';
import { GameStartRes } from '/types/game';

export default function Game() {
  const {
    roomId = '',
    ownerId
  } = useGlobalSearchParams() as { roomId: string; ownerId: string; };

  const navigation = useNavigation();
  const { user } = useUser();
  const { 
    playersOnSeat,
    playersOnWatch,
    setPlayersOnSeat,
    setPlayersHang,
    fetchAllUsers
   } = usePlayers({ roomId });

  const [leftPlayers, setLeftPlayers] = useState<Player[]>([]);
  const [rightPlayers, setRightPlayers] = useState<Player[]>([]);
  const [publicCards, setPublicCards] = useState<(Poke | string)[]>(['', '', '', '', '']);
  const [status, setStatus] = useState<GameStatus>('unReady');
  const [totalPool, setTotalPool] = useState<number>(0);

  const {
    status: wsStatus
  } = useWebSocketReceiver({
    url: `wss://texas.wishufree.com/ws?userId=${user?.id}&roomId=${roomId}`,
    onMessage: async (data) => {
      const wsData = data as WsData;

      console.log('收到游戏数据:', wsData.type, wsData.data);

      if (wsData.type === 'initial connect') {
        // 如果当前用户不是房主，则加入房间
        if (user?.id !== Number(ownerId)) {
          await joinRoom({ id: roomId, userId: Number(user?.id) });
        }

        fetchAllUsers();
        return;
      }

      // 设置角色
      if (wsData.type === 'set-role') {
        const setRoleRes = wsData.data as SetRoleRes[];

        if (status === 'unReady') {
          // 游戏第一次发牌
          // 给在座的每个 player 添加 role
          const playersWithRole = playersOnSeat.map((player) => {
            const role = setRoleRes.find((item) => item.userId === player.id)?.role;

            return {
              ...player,
              role
            }
          })

          setStatus('waiting');
          setPlayersOnSeat(playersWithRole);
        } else {
          // 游戏结束
        }

        return;
      }

      // 发手牌阶段
      if (wsData.type === 'game-start') {
        // const { handPokes } = wsData.data as GameStartRes;

        // setPublicCards(handPokes);
      }

      if (wsData.type === 'player-join') {
        const playerOnSeatRes = wsData.data as PlayerOnSeatRes;

        setPlayersOnSeat([...playersOnSeat, playerOnSeatRes]);
      }
    }
  });

  const resetGame = () => {
    setStatus('waiting')
    setPublicCards(['', '', '', '', ''])
  }

  const end = async () => {
    resetGame();
    await endGame({ id: roomId })

    Alert.alert('当前游戏结束')
  }

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

    setStatus('running');
    setTotalPool(totalPool);
    // setPublicCards(commonPokes);
  }

  useEffect(() => {
    if (playersOnSeat.length !== 0) {
      const [leftPlayers, rightPlayers] = splitArray(playersOnSeat);

      setLeftPlayers(leftPlayers);
      setRightPlayers(rightPlayers);
    }
  }, [playersOnSeat, playersOnWatch, wsStatus])

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

      <LeftSide players={leftPlayers} playersHang={playersOnWatch} />

      <MiddleCommon
        publicCards={publicCards}
        totalPool={totalPool}
        status={status}
        ownerId={ownerId}
        roomId={roomId}
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
