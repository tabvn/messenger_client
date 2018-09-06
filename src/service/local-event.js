import { EventEmitter } from 'fbemitter'

export default class LocalEvent {

  constructor () {

    this.eventEmitter = new EventEmitter()

    this.subscriptions = []

  }

  subscribe (topic, cb) {

    const s = this.subscriptions.find((s) => s.topic === topic)
    if (s) {
      return s.listener
    }
    const listener = this.eventEmitter.addListener(topic, cb)

    const subscription = {
      topic: topic,
      cb: cb,
      listener: listener
    }

    this.subscriptions.push(subscription)

    return listener
  }

  unsubscribe (topic, listener = null) {
    if (listener) {
      listener.remove()

      return
    }

    const subscriptions = this.subscriptions.filter((s) => s.topic === topic)

    if (subscriptions.length) {
      subscriptions.forEach((s) => {
        s.listener.remove()
      })
    }

  }

  emit (topic, data) {

    this.eventEmitter.emit(topic, data)
  }

}