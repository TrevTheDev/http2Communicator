/* eslint-disable no-bitwise */
import EventEmitter from 'events'

const toBytesInt32 = (num) => {
  let ascii = ''
  for (let i = 3; i >= 0; i -= 1)
    ascii += String.fromCharCode((num >> (8 * i)) & 255)

  return ascii
}

const fromBytesInt32 = (numString) => {
  let result = 0
  for (let i = 3; i >= 0; i -= 1)
    result += numString.charCodeAt(3 - i) << (8 * i)

  return result
}
/**
 * Streams JSON objects over streams
 */
export default class ObjectStream extends EventEmitter {
  /**
   * @param {ClientHttp2Stream|ServerHttp2Stream|MultiStreamToDuplex} stream
   * @param {Object=} eventTarget
   * @returns {ObjectStream}
   */
  constructor(stream, eventTarget) {
    super()
    this.stream = stream
    this.promiseDb = {}

    this.eventTarget = eventTarget || this

    if (stream.constructor.name === 'ClientHttp2Stream') {
      this.stream.once('response', (headers, flags) => {
        this.headers = headers
        if (flags) this.flags = flags
      })
    }

    let data = ''

    const dataCb = (chunk) => {
      data += chunk.toString()
      let length = fromBytesInt32(data.substring(0, 4))
      let loop = 0

      while (length && length <= data.length - 4) {
        this.eventTarget.emit('object', JSON.parse(data.slice(4, length + 4)))
        data = data.slice(length + 4)
        length = data.length === 0 ? undefined : fromBytesInt32(data.substring(0, 4))
      }
      loop += 1
      if (loop > 3) throw new Error(`something wrong decoding data: ${data}`)
    }
    const endCb = () => this.eventTarget.emit('end')
    const finishCb = () => this.eventTarget.emit('finish')
    // const abortedCb = () => this.eventTarget.emit('aborted')
    const closedCb = (code) => {
      this.eventTarget.emit('closed', code)
      stream.removeListener('data', dataCb)
      stream.removeListener('end', endCb)
      stream.removeListener('finish', finishCb)
      stream.removeListener('close', closedCb)
    }
    // const errorCb = (error) => this.eventTarget.emit('error', error)
    // const timeoutCb = () => this.eventTarget.emit('timeout')

    stream.on('data', dataCb)
    stream.on('end', endCb)
    stream.on('finish', finishCb)
    // stream.on('aborted', abortedCb)
    stream.on('close', closedCb)

    // stream.on('error', errorCb)
    // stream.on('timeout', timeoutCb)

    // stream.once('closed', () => {
    //   stream.removeListener('end', endCb)
    //   stream.removeListener('aborted', abortedCb)
    //   stream.removeListener('closed', closedCb)
    //   stream.removeListener('error', errorCb)
    //   stream.removeListener('timeout', timeoutCb)
    // })
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
   * @param {Object} json
   */
  end(json) {
    if (Object.keys(this.promiseDb).length > 0) throw new Error('Unhandled promises in objectStream')
    if (json) this.send(json)
    this.stream.end()
  }
}
