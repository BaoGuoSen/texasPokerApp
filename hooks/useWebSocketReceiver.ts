import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useCallback, useRef } from 'react';

import { eventManager } from '@/utils/EventManager';

export const gameEventManager = eventManager;

// 基础 WS 事件
export enum WSEvents {
  Connect = 'connect',
  Message = 'message',
  Error = 'error',
  Close = 'close'
}

/**
 * 游戏 WS 事件
 */
export enum GameWSEvents {
  /** 设置玩家角色（房主开房 and 游戏结束） */
  SetRole = 'set-role',
  /** 游戏开始 开始发手牌 */
  GameStart = 'game-start',
  /** 处于行动阶段的玩家 */
  PlayerAction = 'player-action',
  /** 向其他端推送当前正在行动的玩家id */
  PlayerActive = 'player-active',
  /** 行动玩家的操作 */
  PlayerTakeAction = 'player-take-action',
  /** 游戏进程改变 */
  StageChange = 'stage-change',
  /** 游戏结束 */
  GameEnd = 'game-end',
  /** 玩家上座 */
  PlayerOnSeat = 'player-on-seat',
  /** 玩家观战 */
  PlayerOnWatch = 'player-on-watch',
  /** 游戏结算, 由公共牌组件翻完之后发布该事件 */
  GameSettle = 'game-settle',
  /** 客户端游戏结束, 用于游戏结束后的重置, 由结算组件发布该事件 */
  ClientGameEnd = 'client-game-end'
}

type EventHandlerMap = {
  [key in WSEvents | GameWSEvents]?: (data: any) => void;
};

type Config = {
  url?: string;
  handlers: EventHandlerMap,
};

type WsState = {
  status: 'connecting' | 'connected' | 'disconnected';
  error?: Error;
};

export default function useWebSocketReceiver(config: Config) {
  const [state, setState] = useState<WsState>({
    status: 'connecting',
  });

  const wsRef = useRef<Socket | null>(null);
  const isMounted = useRef(true);

  // 消息处理器
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const { type, data } = event

      console.log('收到消息: type:', type, 'data:', data);

      eventManager.publish(type, data);
    } catch (error) {
      console.error('消息处理错误:', error);
    }
  }, []);

  // 创建连接
  const connect = useCallback(() => {
    if (wsRef.current) return;

    const ws = io(config.url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    wsRef.current = ws;

    ws.on('connect', () => {
      if (!isMounted.current) return;

      eventManager.publish(WSEvents.Connect, {
        status: 'connected',
      });
    });

    ws.on('message', handleMessage);

    ws.on('error', (error) => {
      console.log('onerror', error);

      if (!isMounted.current) return;

      eventManager.publish(WSEvents.Error, {
        status: 'disconnected',
        error: new Error('连接发生错误')
      });
    });

    ws.on('disconnect', (event) => {
      console.log('onclose', event);

      eventManager.publish(WSEvents.Close, {
        status: 'disconnected',
        error: new Error('连接发生错误')
      });
    });
  }, [config.url]);

  // 初始化连接
  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      wsRef.current?.close();
    };
  }, []);

  // 订阅事件
  useEffect(() => {
    Object.entries(config.handlers).forEach(([event, handler]) => {
      eventManager.subscribe(event, handler);
    });

    return () => {
      eventManager.clear();
    }
  }, [config.handlers]);

  return {
    ...state
  };
}