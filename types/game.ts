import type { Stage } from "texas-poker-core/types/Controller";
import type { Poke } from "texas-poker-core/types/Deck/constant";
import type { ActionType, Player, Role } from "texas-poker-core/types/Player";

/**
 * 游戏状态
 * - unReady 未准备
 * - waiting 等待
 * - running 进行中
 * - pause 暂停
 * - end 结束
 */
export type GameStatus = 'unReady' | 'waiting' | 'running' | 'pause' | 'end';

/**
 * ws 消息类型
 * - game-ready 游戏准备 分配玩家角色
 * - game-start 游戏开始 开始发牌
 * - pre-action 处于行动阶段的玩家
 * - player-active 向其他端推送当前正在行动的玩家id
 * - player-take-action 行动玩家的操作
 * - stage-change 游戏进程改变
 * - game-end 游戏结束
 * - game-settle 游戏结算
 * - player-leave 玩家离开
 * - player-offline 玩家离线
 * - player-on-seat 玩家上座
 * - player-on-watch 玩家观战
 */
export type WsType =
'game-ready' |
'game-start' |
'pre-action' |
'player-active' |
'player-take-action' |
'stage-change' |
'game-end' |
'game-settle' |
'player-leave' |
'player-offline' |
'player-on-seat' |
'player-on-watch'

export interface GameReadyRes {
	userId: number;
  role: Role
}

export interface GameStartRes {
  handPokes: Poke[];
  stage: Stage;
  // 奖池
  pool: number;
}

/**
 * 处于行动阶段的玩家
 */
export interface PreActionRes {
  allowedActions: ActionType[];
  userId: number;
  restrict?: {
    min: number;
    max: number;
  }
}

/**
 * 向其他端推送当前正在行动的玩家id
 */
export interface PlayerActiveRes {
  userId: number
}

/**
 * 行动玩家的操作
 */
export interface PlayerTakeActionRes {
  userId: number;
  actionType: ActionType;
  amount: number;
  pool: number;
	/**
	 * 当前阶段下注金额
	 */
  currentStageBetAmount: number;
	/**
	 * 当前玩家余额
	 */
  balance: number;
}

/**
 * 游戏进程改变
 */
export interface StageChangeRes {
  // 最新游戏进程
  stage: Stage;
  // 公共牌
  commonPokes: [
    Poke
  ]
}

/**
 * 游戏结束
 */
export interface GameEndRes {
  // 剩余需要翻的牌
  commonPokes: [
    Poke
  ]
}

/**
 * 游戏结算
 */
export interface GameSettleRes {
  // 奖池的分配明细
  settleList: {
    userId: number;
    balance: number;
    amount: number;
  }[];
  // 最大牌型组合
  maxPokes: Poke[];
  // 赢家列表
  winners: number[];
  // 最大牌型 葫芦, 四条...
  maxPresentation: string;
}

/**
 * 玩家离开
 */
export interface PlayerLeaveRes extends Player {
	/**
	 * 玩家离开后，其他玩家的角色变化
	 */
  roleChangesList: {
    userId: number;
    role: Role;
  }[];
}

/**
 * 玩家离线
 */
export interface PlayerOfflineRes extends Player {
  userId: number;
}

/**
 * 玩家上座
 */
export interface PlayerOnSeatRes {
  userId: number;
  role: Role;
}

/**
 * 玩家观战
 */
export interface PlayerOnWatchRes extends Player {
  userId: number;
	/**
	 * 玩家观战后，其他玩家的角色变化
	 */
	roleChangesList: {
    userId: number;
    role: Role;
  }[];
}
