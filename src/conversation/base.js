import EventEmitter from 'events'

export default class Base extends EventEmitter {
  /**
   * @param {ObjectStream} objectStream
   * @param {Object} json - original json that created Base
   * @returns {Base}
   */
  constructor(objectStream, json) {
    super()
    this.objectStream = objectStream
    this.json = json
  }

  /**
   * sends json including type and questionId
   * @param {Object} json
   * @param {String} type = 'message'
   */
  say(json, type = 'message') {
    this.objectStream.send({ ...json, type, questionId: this.id })
  }

  /**
   * emits msg.type event with msg
   * @param {Object} msg
   * @param {String} msg.type
   */
  _handleMessage(msg) {
    if (msg.type) this.emit(msg.type, msg)
    else throw new Error('no type supplied')
  }
}
