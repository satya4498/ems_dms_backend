export class EventEmitter {
  constructor () {
    this.listeners = {}
  }

  static on (event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
  }

  static emit (event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data))
    }
  }

  static removeListener (event, listener) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (l) => l !== listener
      )
    }
  }

  static removeAllListeners (event) {
    if (this.listeners[event]) {
      delete this.listeners[event]
    }
  }

  static once (event, listener) {
    const onceWrapper = (data) => {
      listener(data)
      this.removeListener(event, onceWrapper)
    }
    this.on(event, onceWrapper)
  }
}
