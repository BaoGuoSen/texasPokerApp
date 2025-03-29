// hooks/useWebSocketReceiver.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type Config = {
  url: string;
  retries?: number;
  retryInterval?: number;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  validate?: (data: any) => boolean;
};

type WsState = {
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  retryCount: number;
  lastMessage?: any;
  error?: Error;
};

export default function useWebSocketReceiver(config: Config) {
  const [state, setState] = useState<WsState>({
    status: 'connecting',
    retryCount: 0,
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);

  // 消息处理器
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      if (config.validate && !config.validate(data)) {
        throw new Error('数据验证失败');
      }

      setState(prev => ({ ...prev, lastMessage: data }));
      config.onMessage?.(data);
    } catch (error) {
      console.error('消息处理错误:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error(String(error))
      }));
    }
  }, [config.validate, config.onMessage]);

  // 创建连接
  const connect = useCallback(() => {
    if (wsRef.current) return;

    const ws = new WebSocket(config.url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) return;
      setState(prev => ({
        ...prev,
        status: 'connected',
        retryCount: 0,
        error: undefined
      }));
    };

    ws.onmessage = handleMessage;

    ws.onerror = (error) => {
      if (!isMounted.current) return;
      config.onError?.(error);
      setState(prev => ({ 
        ...prev, 
        status: 'reconnecting',
        error: new Error('连接发生错误') 
      }));
    };

    ws.onclose = (event) => {
      if (!isMounted.current) return;
      
      if (event.code !== 1000) {
        const retry = state.retryCount < (config.retries ?? 3);
        const nextCount = retry ? state.retryCount + 1 : 0;
        
        setState(prev => ({
          ...prev,
          status: retry ? 'reconnecting' : 'disconnected',
          retryCount: nextCount
        }));

        if (retry) {
          reconnectTimer.current = setTimeout(
            connect, 
            config.retryInterval ?? 3000
          );
        }
      }
    };
  }, [config.url, config.retries, config.retryInterval]);

  // 处理应用状态变化
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && state.status === 'disconnected') {
        connect();
      } else if (nextState === 'background' && wsRef.current) {
        wsRef.current.close(1000, 'App background');
      }
    };

    const subscription = AppState.addEventListener(
      'change', 
      handleAppStateChange
    );
    
    return () => subscription.remove();
  }, [state.status]);

  // 初始化连接
  useEffect(() => {
    isMounted.current = true;
    connect();
    
    return () => {
      isMounted.current = false;
      wsRef.current?.close();
      clearTimeout(reconnectTimer.current);
    };
  }, []);

  // 暴露手动重连方法
  const reconnect = useCallback(() => {
    clearTimeout(reconnectTimer.current);
    setState(prev => ({ ...prev, retryCount: 0 }));
    connect();
  }, [connect]);

  return {
    ...state,
    reconnect,
    resetError: () => setState(prev => ({ ...prev, error: undefined }))
  };
}