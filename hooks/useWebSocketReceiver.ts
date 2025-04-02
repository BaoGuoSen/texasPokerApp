import { eventManager } from '@/utils/EventManager';
import { useState, useEffect, useCallback, useRef } from 'react';

// 基础 WS 事件
export enum WSEvents {
  Connect = 'connect',
  Message = 'message',
  Error = 'error',
  Close = 'close'
}

// 游戏 WS 事件 根据 wsType 定义key
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
export enum GameWSEvents  {
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
}

type EventHandlerMap = {
  [key in WSEvents | GameWSEvents]?: (data: any) => void;
};


type Config = {
  url: string;
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
  
  const wsRef = useRef<WebSocket | null>(null);
  const isMounted = useRef(true);

  // 消息处理器
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const { type, data } = JSON.parse(event.data);

      console.log('收到消息:', type, data);

      eventManager.publish(type, data);
    } catch (error) {
      console.error('消息处理错误:', error);
    }
  }, []);

  // 创建连接
  const connect = useCallback(() => {
    if (wsRef.current) return;

    const ws = new WebSocket(config.url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) return;

      eventManager.publish(WSEvents.Connect, {
        status: 'connected',
      });
    };

    ws.onmessage = handleMessage;

    ws.onerror = (error) => {
      console.log('onerror', error);

      if (!isMounted.current) return;

      eventManager.publish(WSEvents.Error, {
        status: 'disconnected',
        error: new Error('连接发生错误') 
      });
    };

    ws.onclose = (event) => {
      console.log('onclose', event);

      eventManager.publish(WSEvents.Close, {
        status: 'disconnected',
        error: new Error('连接发生错误') 
      });
    };
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
    };
  }, [config.handlers]);

  return {
    ...state
  };
}