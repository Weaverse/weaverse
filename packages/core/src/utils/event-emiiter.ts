type AnyFunction = (...args: any[]) => any

export class EventEmitter {
  listeners: Set<AnyFunction>

  constructor() {
    this.listeners = new Set()
  }

  subscribe(fn: AnyFunction) {
    this.listeners.add(fn)
    return () => this.unsubscribe(fn)
  }

  unsubscribe(fn: AnyFunction) {
    this.listeners.delete(fn)
  }

  emit(data?: any) {
    this.listeners.forEach((fn) => {
      return fn(data)
    })
  }
}
