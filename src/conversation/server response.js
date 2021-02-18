import { Response } from './question.js'
import Speaker from './speaker.js'
import { SETTINGS, MSG_TYPES } from '../other/globals.js'
import ListenerPromise from './listener promise.js'

export default class ServerResponse extends Response {
  /**
   * @param {ObjectStream} objectStream
   * @param {object} questionJSON
   * @returns {ServerResponse}
   */
  constructor(objectStream, questionJSON) {
    super(objectStream, questionJSON)
    this._speakers = []
    this._listeners = []
  }

  /**
   * replies to Question
   * @param {Object} json
   * @param {String} type
   */
  reply(json, type) {
    if (this._speakers.length > 0) throw new Error('response still has open _speakers')
    if (this._listeners.length > 0) throw new Error('response still has open listeners')
    super.reply(json, type)
  }

  /**
   * @param {String} speakerName
   * @param {String} speakerType = SETTINGS.speakerTypeObject
   * @param {Boolean} optional = false
   * @returns {Speaker|Promise}
   */
  createSpeaker(speakerName, speakerType = MSG_TYPES.object, optional = false) {
    const speaker = new Speaker(speakerType)
    let successCb
    const result = optional
      ? speaker
      : new Promise((success) => { successCb = success })

    this.objectStream.stream.pushStream(
      {
        ':path': SETTINGS.listenerStreams,
        'question-id': this.id,
        'speaker-name': speakerName,
        'speaker-type': speakerType,
      },
      (err, stream) => {
        if (err) throw err
        if (speakerType === MSG_TYPES.object) {
          speaker._setStream(stream)
          this._speakers.push(speaker)
          speaker.once('ended', () => this._speakers.splice(this._speakers.indexOf(speaker), 1))
          if (!optional) successCb(speaker)
        } else if (speakerType === MSG_TYPES.raw) {
          this._speakers.push(stream)
          stream.once('finish', () => this._speakers.splice(this._speakers.indexOf(stream), 1))
          if (!optional) successCb(stream)
        } else throw new Error('unknown speaker type')
      },
    )
    return result
  }

  /**
   * @param {String} speakerName
   * @param {String} speakerType = SETTINGS.speakerTypeObject
   * @returns {ListenerPromise}
   */
  createListener(speakerName, speakerType = MSG_TYPES.object) {
    return new ListenerPromise(this, speakerName, speakerType)
  }
}
