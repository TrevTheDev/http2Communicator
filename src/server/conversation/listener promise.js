import { v4 as uuid } from 'uuid'
import { SETTINGS } from '../globals.js'

export const listeners = {}

export default class ListenerPromise {
  constructor(response, speakerName, speakerType) {
    this.response = response
    this.speakerName = speakerName
    this.speakerType = speakerType
  }

  then(...thenArgs) {
    const uid = uuid()
    listeners[uid] = this
    this.response.listeners.push(this)
    this.resolve = (stream) => {
      stream.respond({
        ':status': 200,
        'content-type': 'application/json; charset=utf-8',
      })
      // stream.end()
      delete listeners[uid]
      stream.once('end', () => {
        this.response.listeners.splice(this.response.listeners.indexOf(this), 1)
        stream.close()
      })
      thenArgs[0](stream)
    }
    this.reject = (msg) => {
      delete listeners[uid]
      this.response.listeners.splice(this.response.listeners.indexOf(this), 1)
      thenArgs[1](msg)
    }
    this.response.say({
      listenerId: uid, speakerName: this.speakerName, speakerType: this.speakerType,
    }, SETTINGS.listeningType)
  }
}
