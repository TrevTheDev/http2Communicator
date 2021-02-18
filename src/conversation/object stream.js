/* eslint-disable no-bitwise */
import EventEmitter from 'events'

const NUMBER_OF_BYTES = 4

const toBytesInt32 = (num) => {
  let ascii = ''
  for (let i = NUMBER_OF_BYTES - 1; i >= 0; i -= 1)
    ascii += String.fromCharCode((num >> (8 * i)) & 255)

  return ascii
}

const fromBytesInt32 = (numString) => {
  let result = 0
  for (let i = NUMBER_OF_BYTES - 1; i >= 0; i -= 1)
    result += numString.charCodeAt(NUMBER_OF_BYTES - 1 - i) << (8 * i)

  return result
}
/**
 * @param {string} data
 * @param {function} objectCallback
 * @returns {string}
 */
const translateDataToObjects = (data, objectCallback) => {
  if (data.length > 3) {
    const length = fromBytesInt32(data.substring(0, NUMBER_OF_BYTES))
    if (length <= data.length - NUMBER_OF_BYTES) {
      objectCallback(JSON.parse(data.slice(NUMBER_OF_BYTES, length + NUMBER_OF_BYTES)))
      const remainingData = data.slice(length + NUMBER_OF_BYTES)
      return translateDataToObjects(remainingData, objectCallback)
    }
  }
  return data
}

/**
 * Streams JSON objects over streams
 */
export default class ObjectStream extends EventEmitter {
  /**
   * @param {ServerHttp2Stream|ClientHttp2Stream|MultiStreamToDuplex} stream
   * @param {Object=} eventTarget
   * @returns {ObjectStream}
   */
  constructor(stream, eventTarget) {
    super()
    this.stream = stream
    this.promiseDb = {}

    this.eventTarget = eventTarget || this

    if (this.stream.constructor.name === 'ClientHttp2Stream') {
      this.stream.once('response', (messageObject, flags) => {
        this.messageObjects = messageObject
        if (flags) this.flags = flags
      })
    }
    let remainingData = ''
    const dataCb = (chunk) => {
      const data = remainingData + chunk.toString()
      remainingData = translateDataToObjects(data, (object) => this.eventTarget.emit('object', object))
    }
    const endCb = () => this.eventTarget.emit('end')
    const finishCb = () => this.eventTarget.emit('finish')
    const closedCb = (code) => {
      this.eventTarget.emit('closed', code)
      stream.removeListener('data', dataCb)
      stream.removeListener('end', endCb)
      stream.removeListener('finish', finishCb)
      stream.removeListener('close', closedCb)
    }

    stream.on('data', dataCb)
    stream.on('end', endCb)
    stream.on('finish', finishCb)
    stream.on('close', closedCb)
  }

  /**
   * converts json to string and adds its length in the first 4 bytes
   * and then writes everything to stream
   * @param {object} json
   */
  send(json) {
    const str = JSON.stringify(json)
    const send = toBytesInt32(str.length) + str
    this.stream.write(send)
  }

  /**
   * converts json to string and writes to stream
   * ends writable stream
   * throws if there are any outstanding promises
   * @param {Object?} json
   */
  end(json) {
    if (Object.keys(this.promiseDb).length > 0) throw new Error('Unhandled promises in objectStream')
    if (json) this.send(json)
    this.stream.end()
  }
}
