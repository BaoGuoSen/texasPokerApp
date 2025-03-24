import type { User } from 'texas-poker-core/types/Player';
import type { Poke } from 'texas-poker-core/types/Deck/constant';

interface Player extends User {
  // avatar: string;
  // name: string;
  backgroudUrl: string;
  handCards: (Poke | string)[]
}

interface Room {
  id: string;
  // 房主信息
  owner:  User;
  // waiting 未开始; on 进行中
  status: "waiting" | "on";
  // 房间是否公开
  private: boolean;
  // 玩家总人数
  totalCount: number;
  // 坐席上的玩家个数
  onSeatCount: number;
  // 观战席玩家个数
  hangCount: number;
  // 是否允许玩家观战
  allowPlayersToWatch: boolean;
  // 最大允许玩家数量
  maximumCountOfPlayers: number;
  // 最小下注金额
  lowestBetAmount: number;
}

export interface CreateParams {
  /**
   * 最低下注金额
   */
  lowestBetAmount: number;
  /**
   * 最大玩家人数
   */
  maximumCountOfPlayers: number;
  /**
   * 是否允许玩家观战
   */
  allowPlayersToWatch: boolean;
  /**
   * 用户
   */
  // userId: number;
}

export type { Player, Room };