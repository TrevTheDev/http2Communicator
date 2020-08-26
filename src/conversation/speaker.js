import EventEmitter from 'events'
import ObjectStream from './object stream.js'

export default class Speaker extends EventEmitter {
  constructor(type) {
    super()
    this.type = type
  }

  say(json) { this.objectStream.send(json) }

  end(json) {
    if (json) this.say(json)
    this.objectStream.end()
    this.emit('ended')
  }

  _setStream(stream) {
    this.stream = stream
    this.objectStream = new ObjectStream(stream, this)
    this.emit('connected')
    return this
  }
}
