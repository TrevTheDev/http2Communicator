// eslint-disable-next-line max-classes-per-file
import { createUid } from '../other/shared functions.js'
import Base from './base.js'
import Speaker from './speaker.js'
import { SETTINGS, MSG_TYPES } from '../other/globals.js'

export class Question extends Base {
  /**
   * @param {ObjectStream} objectStream - objectStream to ask questions on
   * @param {ClientHttp2Stream} objectStream.stream
   * @param {ClientHttp2Session} objectStream.stream.session
   * @param {Object} json - question json
   * @param {Response=} response - if the Question is related to a particular Response
   * @returns {Question}
   */
  constructor(objectStream, json, response) {
    super(objectStream, json)
    this.id = createUid()
    this.response = response
    this.speakers = []
  }

  /**
   * routes msg to appropriate handler
   * @param {Object} msg
   */
  _handleMessage(msg) {
    if (msg.type === MSG_TYPES.reply) {
      if (this.speakers.length > 0)
        throw new Error('question answered before all speakers have been closed')
      this.resolve(msg)
    } else if (msg.type === MSG_TYPES.cancelled) this.reject(msg)
    else if (msg.type === MSG_TYPES.question) {
      // eslint-disable-next-line no-use-before-define
      const response = new Response(this.objectStream, msg)
      this.emit(MSG_TYPES.question, response)
    } else if (msg.type === MSG_TYPES.listening) this._createSpeaker(msg)
    else super._handleMessage(msg)
  }

  /**
   * creates a new speaker of type Object for Objects | Raw for other data stream types
   * an event is emitted of msg.speakerName once the speaker is ready for use
   * a PUT request is sent to SETTINGS.listenerStreams with the parentId
   * @param {String} msg.speakerName
   * @param {SETTINGS.speakerTypeObject | SETTINGS.speakerTypeRaw } msg.speakerType
   * @param {String} msg.listenerId
   */
  _createSpeaker(msg) {
    const stream = this.objectStream.stream.session.request(
      {
        ':path': SETTINGS.listenerStreams,
        ':method': 'PUT',
        'speaker-name': msg.speakerName,
        'speaker-type': msg.speakerType,
        'listener-id': msg.listenerId,
      }, { parent: this.objectStream.stream.id },
    )
    if (msg.speakerType === MSG_TYPES.object) {
      const speaker = new Speaker(msg.speakerName)
      speaker._setStream(stream)
      this.speakers.push(speaker)
      speaker.on('ended', () => {
        this.speakers.splice(this.speakers.indexOf(speaker), 1)
        if (!stream.closed) stream.close()
      })
      this.emit(msg.speakerName, speaker)
    } else if (msg.speakerType === MSG_TYPES.raw) {
      this.speakers.push(stream)
      stream.on('finish', () => { // writable: finish
        this.speakers.splice(this.speakers.indexOf(stream), 1)
        if (!stream.closed) stream.close()
      })
      this.emit(msg.speakerName, stream)
    } else throw new Error('unknown speaker type')
  }

  then(onSuccess, onFail) {
    this.objectStream.promiseDb[this.id] = this

    this.resolve = (msg) => {
      if (onSuccess) onSuccess(msg)
      delete this.objectStream.promiseDb[this.id]
      if (this.response) delete this.response.questions[this.id]
    }
    this.reject = (msg) => {
      if (onFail) onFail(msg)
      delete this.objectStream.promiseDb[this.id]
      if (this.response) delete this.response.questions[this.id]
    }

    const questionJSON = this.json

    if (this.response) {
      this.response.questions[this.id] = this
      questionJSON.originalQuestionId = this.response.id
    }
    this.say(questionJSON, MSG_TYPES.question)
  }
}

export class Response extends Base {
  /**
   * @param {ObjectStream} objectStream
   * @param {Object} json
   * @param {String} json.questionId
   * @returns {Response}
   */
  constructor(objectStream, json) {
    super(objectStream, json)
    this.id = json.questionId
    this.questions = {}
    this.objectStream.promiseDb[this.id] = this
  }

  /**
   * @param {Object} json - response to send
   * @param {String} type = SETTINGS.replyType
   */
  reply(json, type = MSG_TYPES.reply) {
    if (Object.values(this.questions).length > 0) throw new Error('not all questions resolved')
    delete this.objectStream.promiseDb[this.id]
    this.say(json, type)
  }

  /**
   * @param {Object} json - question to ask
   * @returns {Question}
   */
  ask(json) {
    return new Question(this.objectStream, json, this)
  }
}
