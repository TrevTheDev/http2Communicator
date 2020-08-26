import { randomBytes } from 'crypto'
import { SETTINGS } from '../other/globals.js'

export const listeners = {}

export default class ListenerPromise {
  /**
   * @param {ServerResponse} response
   * @param {String} speakerName
   * @param {String} speakerType
   * @returns {ListenerPromise} a promise that resolves once a listener stream is connected
   */
  constructor(response, speakerName, speakerType) {
    this.response = response
    this.speakerName = speakerName
    this.speakerType = speakerType
  }

  // can only handle one .then which should be okay.
  then(onSuccess, onFail) {
    const uid = randomBytes(64).toString('base64')
    listeners[uid] = this
    this.response._listeners.push(this)

    try {
      this.resolve = (stream) => {
        stream.once('end', () => {
          this.response._listeners.splice(this.response._listeners.indexOf(this), 1)
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
        this.response._listeners.splice(this.response._listeners.indexOf(this), 1)
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
