/**
 * 极简事件总线。
 * 模块之间只通过事件通信，不直接引用对方内部对象。
 */
export function createEventBus() {
  const listeners = new Map()

  function on(name, handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('event handler must be a function')
    }
    if (!listeners.has(name)) listeners.set(name, new Set())
    const set = listeners.get(name)
    set.add(handler)
    return () => off(name, handler)
  }

  function off(name, handler) {
    const set = listeners.get(name)
    if (!set) return
    set.delete(handler)
    if (set.size === 0) listeners.delete(name)
  }

  function emit(name, payload) {
    const set = listeners.get(name)
    if (!set) return
    for (const handler of [...set]) {
      try {
        handler(payload)
      } catch (error) {
        console.error(`[events] handler failed for "${name}"`, error)
      }
    }
  }

  function clear() {
    listeners.clear()
  }

  return { on, off, emit, clear }
}
