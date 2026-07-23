type AnyFunction = (...args: any[]) => any

/** Provides synchronous subscription and notification for runtime updates. */
export class EventEmitter {
  /** Functions called when an update is emitted. */
  listeners: Set<AnyFunction>

  /** Creates an emitter with no listeners. */
  constructor() {
    this.listeners = new Set()
  }

  /** Adds a listener and returns a function that removes it. */
  subscribe = (fn: AnyFunction) => {
    this.listeners.add(fn)
    return () => this.unsubscribe(fn)
  }

  /** Removes a previously subscribed listener. */
  unsubscribe = (fn: AnyFunction) => {
    this.listeners.delete(fn)
  }

  /** Calls every subscribed listener with the supplied data. */
  emit = (data) => {
    for (const fn of this.listeners) {
      fn(data)
    }
  }
}
