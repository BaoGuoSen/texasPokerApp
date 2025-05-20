import type { GameStatus } from './game';
import type { Role, User, Poke, Stage } from 'texas-poker-core';

interface Player extends User {
  // avatar: string;
  // name: string;
  backgroudUrl?: string;
  pokes?: (Poke | string)[];
  role?: Role;
  me?: boolean;
}

interface Room {
  id: string;
  // 房主信息
  owner: User;
  status: GameStatus;
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
  /** 思考时间 */
  thinkingTime: number;
}

export interface Position {
  userId: number;
  pokes: (Poke | string)[];
  role: Role;
}

export interface GameRes {
  positions: Position[];
  commonPokes: Poke[];
  totalPool: number;
  stage: Stage;
}

export type { Player, Room };
