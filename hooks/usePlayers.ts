
import type { Player } from '@/types'

import { useEffect, useState } from 'react';

import { useUser } from '@/contexts/UserContext';
import { getRoomInfo } from '@/service';

interface IProps {
  roomId: string;
}

/** 获取当前房间所有玩家 */
export function usePlayers(props: IProps) {
  const { roomId }  = props;
  const { user } = useUser();
  const [playersOnSeat, setPlayersOnSeat] = useState<Player[]>([]);
  const [playersHang, setPlayersHang] = useState<Player[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { playersOnSeat, playersHang } = await getRoomInfo({ id: roomId });

      const playersOnSeatWithMe = playersOnSeat.map(item => {
        return { ...item, me: user?.id === item.id}
      })

      const playersHangWithMe = playersHang.map(item => {
        return { ...item, me: user?.id === item.id}
      })

      setPlayersOnSeat(playersOnSeatWithMe);
      setPlayersHang(playersHangWithMe);
    }

    fetchData();
  }, [roomId])

  return { players: playersOnSeat, playersHang };
}
