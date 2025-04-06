import type { Poke } from 'texas-poker-core/types/Deck/constant';
import type { Player } from '@/types';
import type {
  SetRoleRes,
  GameStatus,
  GameStartRes,
  PlayerOnSeatRes,
  PlayerOnWatchRes,
  PlayerTakeActionRes,
  GameEndRes
} from '@/types/game';

import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ImageBackground } from 'expo-image';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

import { usePlayers } from '@/hooks/usePlayers';
import useWebSocketReceiver, { GameWSEvents, WSEvents } from '@/hooks/useWebSocketReceiver';

import { splitArray } from '@/utils';
import { quitGame } from '@/utils/gameControl';
import { ThemeConfig } from "@/constants/ThemeConfig";

import LeftSide from '@/components/game/LeftSide';
import RightSidePlayers from '@/components/game/RightSidePlayers';
import MiddleCommon from '@/components/game/MiddleCommon';

import { joinRoom } from '@/service';
import { useUser } from '@/contexts/UserContext';
import { RoomProvider } from '@/contexts/RoomContext';

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
  const [status, setStatus] = useState<GameStatus>('unReady');
  const [matchId, setMatchId] = useState<number | undefined>();
  const [curButtonUserId, setCurButtonUserId] = useState<number | undefined>();

  useWebSocketReceiver({
    url: `wss://texas.wishufree.com?userId=${user?.id}&roomId=${roomId}`,
    handlers: {
      [WSEvents.Connect]: async () => {
        // 如果当前用户不是房主，则加入房间
        if (user?.id !== Number(ownerId)) {
          await joinRoom({ id: roomId, userId: Number(user?.id) });
        }

        fetchAllUsers();
      },

      [GameWSEvents.SetRole]: (setRoleRes: SetRoleRes[]) => {
        if (status === 'unReady') {
          // 第一次由房主确认游戏玩家后，给在座的每个 player 添加 role
          const playersWithRole = playersOnSeat.map((player) => {
            const role = setRoleRes.find((item) => item.userId === player.id)?.role;

            return {
              ...player,
              role
            }
          })

          const curButtonUserId = playersWithRole.find((player) => player.role === 'button')?.id;

          setStatus('waiting');
          setPlayersOnSeat(playersWithRole);
          setCurButtonUserId(curButtonUserId);
        }
      },

      [GameWSEvents.GameStart]: (gameStartRes: GameStartRes) => {
        const { handPokes, matchId } = gameStartRes;

        const playerWithPokes = playersOnSeat.map((player) => {
          if (player.me) {
            return { ...player, pokes: handPokes };
          }

          return player;
        })

        setStatus('running');
        setPlayersOnSeat(playerWithPokes);
        setMatchId(matchId);
      },

      [GameWSEvents.PlayerTakeAction]: (playerTakeActionRes: PlayerTakeActionRes) => {
        const { userId, balance } = playerTakeActionRes;

        const newPlayersOnSeat = playersOnSeat.map((player) => {
          if (player.id === userId) {
            return { ...player, balance };
          }

          return player;
        })

        setPlayersOnSeat(newPlayersOnSeat);
      },

      [GameWSEvents.PlayerOnSeat]: (playerOnSeatRes: PlayerOnSeatRes) => {
        setPlayersOnSeat([...playersOnSeat, playerOnSeatRes]);
      },

      [GameWSEvents.PlayerOnWatch]: (playerOnWatchRes: PlayerOnWatchRes) => {
        // TODO 暂时没有观战入口
      },

      [GameWSEvents.GameEnd]: (gameEndRes: GameEndRes) => {
        const { settleList } = gameEndRes;

        const newPlayersOnSeat = playersOnSeat.map((player) => {
          const settle = settleList.find((item) => item.userId === player.id);

          return { ...player, balance: settle?.balance ?? 0 };
        })

        setPlayersOnSeat(newPlayersOnSeat);
        resetGame();
      }
    }
  });

  const resetGame = () => {
    setStatus('waiting');
  }

  // const end = async () => {
  //   resetGame();
  //   await endGame({ id: roomId })

  //   Alert.alert('当前游戏结束')
  // }

  useEffect(() => {
    if (playersOnSeat.length !== 0) {
      const [leftPlayers, rightPlayers] = splitArray(playersOnSeat);

      setLeftPlayers(leftPlayers);
      setRightPlayers(rightPlayers);
    }
  }, [playersOnSeat, playersOnWatch])

  return (
    <RoomProvider
      roomId={roomId} 
      matchId={matchId} 
      ownerId={Number(ownerId)} 
      curButtonUserId={curButtonUserId}
      gameStatus={status}
    >
      <ImageBackground
        contentFit='cover'
        source={ThemeConfig.gameBackImg}
        style={styles.container}
    >
      <TouchableOpacity onPress={() => quitGame(navigation, roomId)} style={styles.closeBtn}>
        <Icon name="close" size={24} color="#333" />
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={end} style={styles.endGame}>
        <Icon name="lock-closed" size={24} color="#333" />
      </TouchableOpacity> */}

      <LeftSide players={leftPlayers} playersHang={playersOnWatch} />

      <MiddleCommon />

        <RightSidePlayers players={rightPlayers} />
      </ImageBackground>
    </RoomProvider>
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
    right: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    zIndex: 100,
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
