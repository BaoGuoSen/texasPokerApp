import type {
  ActionType,
  Player,
  Poke,
  Role,
  Stage,
  User
} from 'texas-poker-core';

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
 * - set-role 设置玩家角色
 * - game-start 游戏开始 开始发牌
 * - pre-action 处于行动阶段的玩家
 * - player-active 向其他端推送当前正在行动的玩家id
 * - player-take-action 行动玩家的操作
 * - stage-change 游戏进程改变
 * - game-end 游戏结束
 * - player-leave 玩家离开
 * - player-offline 玩家离线
 * - player-on-seat 玩家上座
 * - player-on-watch 玩家观战
 */
export type WsType =
  | 'set-role'
  | 'game-start'
  | 'pre-action'
  | 'player-active'
  | 'player-take-action'
  | 'stage-change'
  | 'game-end'
  | 'player-leave'
  | 'player-offline'
  | 'player-on-seat'
  | 'player-on-watch'
  | 'player-join';

export interface SetRoleRes {
  userInfo: Pick<User, 'id'>;
  role: Role;
}

export interface GameStartRes {
  handPokes: Poke[];
  stage: Stage;
  // 奖池
  pool: number;
  // 对局Id
  matchId: number;
  // 默认下注金额
  defaultBets: {
    userInfo: Pick<User, 'id'>;
    amount: number;
    balance: number;
  }[];
}

/**
 * 处于行动阶段的玩家
 */
export interface PlayerActionRes {
  allowedActions: ActionType[];
  userInfo: Pick<User, 'id'>;
  restrict?: {
    min: number;
    max: number;
  };
}

/**
 * 向其他端推送当前正在行动的玩家id
 */
export interface PlayerActiveRes {
  userInfo: Pick<User, 'id'>;
}

/**
 * 行动玩家的操作
 */
export interface PlayerTakeActionRes {
  userInfo: Pick<User, 'id' | 'name' | 'balance'>;
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
  restCommonPokes: [Poke];
}

/**
 * 游戏结束
 */
export interface GameEndRes {
  // 奖池的分配明细
  settleList: {
    userInfo: User;
    amount: number;
    balance: number;
  }[];
  // 是否展示玩家手牌
  showHandPokes: boolean;
  // 其余玩家的手牌
  handPokes: {
    userInfo: Pick<User, 'id'>;
    hand: Poke[];
  }[];
  // 剩余需要的翻牌列表
  restCommonPokes: Poke[];
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
    userInfo: Pick<User, 'id'>;
    role: Role;
  }[];
}

/**
 * 玩家离线
 */
export interface PlayerOfflineRes extends Player {
  userInfo: Pick<User, 'id'>;
}

/**
 * 玩家上座
 */
export interface PlayerOnSeatRes extends User {
  userInfo: User & { me: boolean };
  role: Role;
}

/**
 * 玩家观战
 */
export interface PlayerOnWatchRes extends Player {
  userInfo: Pick<User, 'id'>;
  /**
   * 玩家观战后，其他玩家的角色变化
   */
  roleChangesList: {
    userInfo: Pick<User, 'id'>;
    role: Role;
  }[];
}

export interface WsData {
  /**
   * ws 消息类型
   * - set-role 设置玩家角色
   * - game-start 游戏开始 开始发牌
   * - pre-action 处于行动阶段的玩家
   * - player-active 向其他端推送当前正在行动的玩家id
   * - player-take-action 行动玩家的操作
   * - stage-change 游戏进程改变
   * - game-end 游戏结束
   * - player-leave 玩家离开
   * - player-offline 玩家离线
   * - player-on-seat 玩家上座
   * - player-on-watch 玩家观战
   */
  type: WsType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // data: GameReadyRes | GameStartRes | PreActionRes | PlayerActiveRes | PlayerTakeActionRes | StageChangeRes | GameEndRes | GameSettleRes | PlayerLeaveRes | PlayerOfflineRes | PlayerOnSeatRes | PlayerOnWatchRes;
}
