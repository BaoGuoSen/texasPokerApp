import { ImageBackground } from 'expo-image';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

import LeftSide from '@/components/game/LeftSide';
import MiddleCommon from '@/components/game/MiddleCommon';
import RightSidePlayers from '@/components/game/RightSidePlayers';
import { themeConfig } from '@/constants/ThemeConfig';
import { RoomProvider } from '@/contexts/RoomContext';
import { useUser } from '@/contexts/UserContext';
import { usePlayers } from '@/hooks/usePlayers';
import useWebSocketReceiver, {
  GameWSEvents,
  WSEvents
} from '@/hooks/useWebSocketReceiver';
import { joinRoom } from '@/service';
import type { Player } from '@/types';
import type {
  GameEndRes,
  GameStartRes,
  GameStatus,
  PlayerOnSeatRes,
  PlayerTakeActionRes,
  SetRoleRes
} from '@/types/game';
import { splitArray } from '@/utils';
import { quitGame } from '@/utils/gameControl';

export default function Game() {
  const { roomId = '', ownerId } = useGlobalSearchParams() as {
    roomId: string;
    ownerId: string;
  };

  const navigation = useNavigation();
  const { user } = useUser();
  const { playersOnSeat, playersOnWatch, setPlayersOnSeat, fetchAllUsers } =
    usePlayers({ roomId });

  const [leftPlayers, setLeftPlayers] = useState<Player[]>([]);
  const [rightPlayers, setRightPlayers] = useState<Player[]>([]);
  const [status, setStatus] = useState<GameStatus>('unReady');
  const [matchId, setMatchId] = useState<number | undefined>();
  const [curButtonUserId, setCurButtonUserId] = useState<number | undefined>();
  const [endRoles, setEndRoles] = useState<SetRoleRes[]>([]);

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
        const curButtonUserId = setRoleRes.find(
          (player) => player.role === 'button'
        )?.userInfo.id;
        setCurButtonUserId(curButtonUserId);

        if (status === 'unReady') {
          // 第一次由房主确认游戏玩家后，给在座的每个 player 添加 role
          const playersWithRole = playersOnSeat.map((player) => {
            const role = setRoleRes.find(
              (item) => item.userInfo.id === player.id
            )?.role;

            return {
              ...player,
              role
            };
          });

          setStatus('waiting');
          setPlayersOnSeat(playersWithRole);
        } else {
          // 游戏结束的设置角色
          setEndRoles(setRoleRes);
        }
      },

      [GameWSEvents.GameStart]: (gameStartRes: GameStartRes) => {
        const { handPokes, matchId } = gameStartRes;

        const playerWithPokes = playersOnSeat.map((player) => {
          if (player.me) {
            return { ...player, pokes: handPokes };
          }

          return player;
        });

        setStatus('running');
        setPlayersOnSeat(playerWithPokes);
        setMatchId(matchId);
      },

      [GameWSEvents.PlayerTakeAction]: (
        playerTakeActionRes: PlayerTakeActionRes
      ) => {
        const { userInfo: { id } = {}, balance } = playerTakeActionRes;

        const newPlayersOnSeat = playersOnSeat.map((player) => {
          if (player.id === id) {
            return { ...player, balance };
          }

          return player;
        });

        setPlayersOnSeat(newPlayersOnSeat);
      },

      [GameWSEvents.PlayerOnSeat]: (playerOnSeatRes: PlayerOnSeatRes) => {
        setPlayersOnSeat([...playersOnSeat, playerOnSeatRes.userInfo]);
      },

      [GameWSEvents.PlayerOnWatch]: () => {
        // TODO 暂时没有观战入口
      },

      [GameWSEvents.ClientGameEnd]: (gameEndRes: GameEndRes) => {
        // 设置新一轮的角色
        const { settleList = [] } = gameEndRes;

        const newPlayersOnSeat = playersOnSeat.map((player) => {
          const settle = settleList.find(
            (item) => item.userInfo.id === player.id
          );
          const role = endRoles.find(
            (item) => item.userInfo.id === player.id
          )?.role;

          return {
            ...player,
            balance: settle?.amount ?? player.balance,
            pokes: ['', ''],
            role
          };
        });

        setPlayersOnSeat(newPlayersOnSeat);
        resetGame();
      }
    }
  });

  const resetGame = () => {
    setStatus('waiting');
  };

  useEffect(() => {
    if (playersOnSeat.length !== 0) {
      const [leftPlayers, rightPlayers] = splitArray(playersOnSeat);

      setLeftPlayers(leftPlayers);
      setRightPlayers(rightPlayers);
    }
  }, [playersOnSeat, playersOnWatch]);

  return (
    <RoomProvider
      roomId={roomId}
      matchId={matchId}
      ownerId={Number(ownerId)}
      curButtonUserId={curButtonUserId}
      gameStatus={status}
    >
      <ImageBackground
        contentFit="cover"
        source={themeConfig.gameBackImg}
        style={styles.container}
      >
        <TouchableOpacity
          onPress={() => quitGame(navigation, roomId)}
          style={styles.closeBtn}
        >
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
    backgroundColor: themeConfig.gameBackColor
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
    zIndex: 100
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
    height: 30
  }
});
