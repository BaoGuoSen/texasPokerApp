
import type { Player } from '@/types'

import { useEffect, useState } from 'react';

import { getRoomInfo } from '@/service';

interface IProps {
  roomId: string;
}

const mockPlayers: Player[] = [
  {
    id: 1,
    balance: 20090,
    backgroudUrl: require('@/assets/images/background_1.png'),
    avator: require('@/assets/images/avator_1.png'),
    name: 'theSen',
    handCards: ['s2', 'ha']
  },
  {
    id: 2,
    balance: 200,
    backgroudUrl: require('@/assets/images/background_2.png'),
    avator: require('@/assets/images/avator_3.png'),
    name: '煊',
    handCards: ['', '']
  },
  {
    id: 3,
    balance: 100,
    backgroudUrl: require('@/assets/images/background_3.png'),
    avator: require('@/assets/images/avator_2.png'),
    name: '老毛',
    handCards: ['', '']
  },
  // {
  //   id: 4,
  //   balance: 90,
  //   backgroudUrl: require('@/assets/images/background_3.png'),
  //   avator: require('@/assets/images/avator_1.png'),
  //   name: '林'
  // },
  // {
  //   id: 5,
  //   balance: 99,
  //   backgroudUrl: require('@/assets/images/background_3.png'),
  //   avator: require('@/assets/images/avator_2.png'),
  //   name: '羽'
  // },
  // {
  //   id: 6,
  //   balance: 99,
  //   backgroudUrl: require('@/assets/images/background_1.png'),
  //   avator: require('@/assets/images/avator_3.png'),
  //   name: 'wxl'
  // },
  // {
  //   id: 7,
  //   balance: 0,
  //   backgroudUrl: require('@/assets/images/background_3.png'),
  //   avator: require('@/assets/images/avator_1.png'),
  //   name: '德玛西亚'
  // }
]

/** 获取当前房间所有玩家 */
export function usePlayers(props: IProps) {
  const { roomId }  = props;
  const [playersOnSeat, setPlayersOnSeat] = useState<Player[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { playersOnSeat } = await getRoomInfo({ id: roomId });

      // @ts-ignore
      setPlayersOnSeat(playersOnSeat);
    }

    fetchData();
  }, [roomId])

  return { players: playersOnSeat };
}
