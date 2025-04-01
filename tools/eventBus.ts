type EventCallback = (...args: any[]) => void;
class EventBus {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback?: EventCallback) {
    if (!callback) {
      delete this.events[event]; // 清除所有该事件的监听
    } else {
      this.events[event] = this.events[event]?.filter(cb => cb !== callback) || [];
    }
  }

  once(event: string, callback: EventCallback) {
    const onceCallback: EventCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback); // 执行后自动移除监听
    };
    this.on(event, onceCallback);
  }

  emit(event: string, ...args: any[]) {
    this.events[event]?.forEach(callback => callback(...args));
  }
}
const bus = new EventBus();
export default  bus;
