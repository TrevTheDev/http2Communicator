import { v4 as uuid } from 'uuid'
import Base from './base.js'
import Response from './response.js'
import Speaker from './speaker.js'
import { SETTINGS } from '../globals.js'

export default class Question extends Base {
  /**
   * @param {ObjectStream} objectStream - objectStream to ask questions on
   * @param {object} json - question json
   * @param {Response=} response - if the Question is related to a particular Response
   * @returns {Question}
   */
  constructor(objectStream, json, response) {
    super(objectStream, json)
    this.id = uuid()
    this.response = response
    this.speakers = []
  }

  _handleMessage(msg) {
    if (msg.type === SETTINGS.replyType) {
      if (this.speakers.length > 0)
        throw new Error('question answered before all speakers have been closed')
      this.resolve(msg)
    } else if (msg.type === SETTINGS.cancelledType) this.reject(msg)
    else if (msg.type === SETTINGS.questionType) {
      const response = new Response(this.objectStream, msg)
      this.emit(SETTINGS.questionType, response)
    } else if (msg.type === SETTINGS.listeningType) this._createSpeaker(msg)
    else super._handleMessage(msg)
  }

  _createSpeaker(msg) {
    const stream = this.objectStream.stream.session.request(
      {
        ':path': SETTINGS.listenerPath,
        ':method': 'PUT',
        'speaker-name': msg.speakerName,
        'speaker-type': msg.speakerType,
        'listener-id': msg.listenerId,
      }, { parent: this.objectStream.stream.id },
    )
    if (msg.speakerType === SETTINGS.speakerTypeObject) {
      const speaker = new Speaker(msg.speakerName)
      speaker._setStream(stream)
      this.speakers.push(speaker)
      speaker.on('ended', () => {
        this.speakers.splice(this.speakers.indexOf(speaker), 1)
        if (!stream.closed) stream.close()
      })
      this.emit(msg.speakerName, speaker)
    } else if (msg.speakerType === SETTINGS.speakerTypeRaw) {
      this.speakers.push(stream)
      stream.on('finish', () => { // writable: finish
        this.speakers.splice(this.speakers.indexOf(stream), 1)
        if (!stream.closed) stream.close()
      })
      this.emit(msg.speakerName, stream)
    } else throw new Error('unknown speaker type')
  }

  then(...thenArgs) {
    this.objectStream.promiseDb[this.id] = this

    this.resolve = (msg) => {
      thenArgs[0](msg)
      delete this.objectStream.promiseDb[this.id]
      if (this.response) delete this.response.questions[this.id]
    }
    this.reject = (msg) => {
      thenArgs[1](msg)
      delete this.objectStream.promiseDb[this.id]
      if (this.response) delete this.response.questions[this.id]
    }

    const questionJSON = this.json

    if (this.response) {
      this.response.questions[this.id] = this
      questionJSON.originalQuestionId = this.response.id
    }
    this.say(questionJSON, SETTINGS.questionType)
  }
}
