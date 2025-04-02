// hooks/useWebSocketReceiver.ts
import { useState, useEffect, useCallback, useRef } from 'react';

type Config = {
  url: string;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
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
      const data = JSON.parse(event.data);

      setState(prev => ({ ...prev, lastMessage: data }));
      config.onMessage?.(data);
    } catch (error) {
      console.error('消息处理错误:', error);
    }
  }, [config.onMessage]);

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
        error: undefined
      }));
    };

    ws.onmessage = handleMessage;

    ws.onerror = (error) => {
      console.log('onerror', error);
      if (!isMounted.current) return;

      setState(prev => ({ 
        ...prev, 
        status: 'disconnected',
        error: new Error('连接发生错误') 
      }));
    };

    ws.onclose = (event) => {
      console.log('onclose', event);
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

  return {
    ...state
  };
}