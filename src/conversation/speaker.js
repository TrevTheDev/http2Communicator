import EventEmitter from 'events'
import ObjectStream from './object stream.js'

export default class Speaker extends EventEmitter {
  /**
   * @param {String} type
   * @returns {Speaker}
   */
  constructor(type) {
    super()
    this.type = type
  }

  /**
   * @param {Object} json
   */
  say(json) { this.objectStream.send(json) }

  /**
   * @param {Object} json
   */
  end(json) {
    if (json) this.say(json)
    this.objectStream.end()
    this.emit('ended')
  }

  /**
   * @param {Http2Stream} stream
   */
  _setStream(stream) {
    this.stream = stream
    this.objectStream = new ObjectStream(stream, this)
    this.emit('connected')
    return this
  }
}
