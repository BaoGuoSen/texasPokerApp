type Callback<T = any> = (data: T) => void;

class EventManager {
  private subscribers: Map<string, Callback[]> = new Map();

  subscribe<T>(event: string, callback: Callback<T>) {
    const events = this.subscribers.get(event) || [];
    events.push(callback);

    this.subscribers.set(event, events);
  }

  unsubscribe(event: string, callback: Callback) {
    const events = this.subscribers.get(event)?.filter(cb => cb !== callback);

    if (events) this.subscribers.set(event, events);
  }

  publish<T>(event: string, data: T) {
    this.subscribers.get(event)?.forEach(cb => cb(data));
  }

  clear() {
    this.subscribers.clear();
  }
}

export const eventManager = new EventManager();