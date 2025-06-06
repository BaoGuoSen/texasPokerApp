import React, { ReactNode, createContext, useContext } from 'react';

import type { GameStatus } from '@/types/game';

// 定义 Context 类型
type RoomContextType = {
  roomId: string;
  ownerId: number;
  matchId?: number;
  curButtonUserId?: number;
  gameStatus: GameStatus;
};

// 创建 Context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// 自定义 Hook 用于访问 Context
export const useRoomInfo = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error('useRoomInfo 必须在 RoomProvider 内使用');
  }

  return context;
};

export const RoomProvider = ({
  children,
  roomId,
  matchId,
  ownerId,
  curButtonUserId,
  gameStatus
}: { children: ReactNode } & RoomContextType) => {
  return (
    <RoomContext.Provider
      value={{ roomId, matchId, ownerId, curButtonUserId, gameStatus }}
    >
      {children}
    </RoomContext.Provider>
  );
};
