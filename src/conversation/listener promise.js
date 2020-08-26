import { randomBytes } from 'crypto'
import { SETTINGS } from '../other/globals.js'

export const listeners = {}

export default class ListenerPromise {
  constructor(response, speakerName, speakerType) {
    this.response = response
    this.speakerName = speakerName
    this.speakerType = speakerType
  }

  then(onSuccess, onFail) {
    const uid = randomBytes(64).toString('base64')
    listeners[uid] = this
    this.response.listeners.push(this)

    try {
      this.resolve = (stream) => {
        stream.once('end', () => {
          this.response.listeners.splice(this.response.listeners.indexOf(this), 1)
          stream.close()
        })
        stream.respond({
          ':status': 200,
          'content-type': 'application/json; charset=utf-8',
        })

        delete listeners[uid]
        if (onSuccess) onSuccess(stream)
        else stream.close()
      }

      this.reject = (msg) => {
        delete listeners[uid]
        this.response.listeners.splice(this.response.listeners.indexOf(this), 1)
        if (onFail) onFail(msg)
      }

      this.response.say({
        listenerId: uid, speakerName: this.speakerName, speakerType: this.speakerType,
      }, SETTINGS.listeningType)
    } catch (e) {
      if (onFail) onFail(e)
      else throw e
    }
  }
}
