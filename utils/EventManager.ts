import { EventHandlerMap } from '@/hooks/useWebSocketReceiver';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<T = any> = (data: T) => void;

interface EventValue {
  callback: Callback;
  /** 事件发布的组件来源标识，用于清除组件自己的副作用而不影响其他的组件事件 */
  fromKey: string;
}

class EventManager {
  private subscribers: Map<string, EventValue[]> = new Map();

  subscribe(fromKey: string, handlers: EventHandlerMap) {
    Object.entries(handlers).forEach(([event, handler]) => {
      const curEventValues = this.subscribers.get(event) || [];

      const targetEvent = curEventValues.find(
        (item) => item.fromKey === fromKey
      );

      // 如果当前组件已经注册事件了，直接返回
      if (targetEvent) return;

      this.subscribers.set(event, [
        ...curEventValues,
        {
          fromKey,
          callback: handler
        }
      ]);
    });
  }

  unsubscribe(event: string, fromKey: string) {
    const events = this.subscribers
      .get(event)
      ?.filter((cb) => cb.fromKey !== fromKey);

    if (events) this.subscribers.set(event, events);
  }

  clearAllFromKey(fromKey: string) {
    for (const [event, EventValues] of this.subscribers) {
      const newCallbacks = EventValues?.filter(
        (item: { fromKey: string }) => item.fromKey !== fromKey
      );

      this.subscribers.set(event, newCallbacks);
    }
  }

  publish<T>(event: string, data: T) {
    this.subscribers.get(event)?.forEach((cb) => cb.callback?.(data));
  }

  clear() {
    this.subscribers.clear();
  }
}

export const eventManager = new EventManager();
