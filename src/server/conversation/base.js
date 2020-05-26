import EventEmitter from 'events'

/**
 * Base class for Question and Response
 * @extends EventEmitter
 */
export default class Base extends EventEmitter {
  constructor(objectStream, json) {
    super()
    this.objectStream = objectStream
    this.json = json
    // this.resolve = (msg) => msg
    // this.reject = (msg) => msg
  }

  say(json, type = 'message') {
    this.objectStream.send({ ...json, type, questionId: this.id })
  }

  _handleMessage(msg) {
    if (msg.type) this.emit(msg.type, msg)
    else throw new Error('no type supplied')
  }
}
