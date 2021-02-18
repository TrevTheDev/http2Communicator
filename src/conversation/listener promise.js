import { createUid } from '../other/shared functions.js'
import { MSG_TYPES } from '../other/globals.js'

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
    const id = createUid()
    listeners[id] = this
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

        delete listeners[id]
        if (onSuccess) onSuccess(stream)
        else stream.close()
      }

      this.reject = (msg) => {
        delete listeners[id]
        this.response._listeners.splice(this.response._listeners.indexOf(this), 1)
        if (onFail) onFail(msg)
      }

      this.response.say({
        listenerId: id, speakerName: this.speakerName, speakerType: this.speakerType,
      }, MSG_TYPES.listening)
    } catch (e) {
      if (onFail) onFail(e)
      else throw e
    }
  }
}
