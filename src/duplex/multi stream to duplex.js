// import Stream from 'stream-browserify'
import { Duplex } from 'stream'
import { createUid } from '../other/shared functions.js'

export default class MultiStreamToDuplex extends Duplex {
  /**
   * @param {ServerHttp2Stream} outStream
   * @param {Object} defaultResponseHeaders
   * @returns {MultiStreamToDuplex}
   */
  constructor(outStream, defaultResponseHeaders) {
    super()
    this.outStream = outStream
    this.id = createUid()
    this.defaultResponseHeaders = defaultResponseHeaders
    this.inStreams = []
    // this.outStream.once('close', () => {
    //   debugger
    //   if (!this.closed) this.push(null)
    // })
    this.once('close', () => {
      if (!this.outStream.closed) this.outStream.close()
      this.inStreams.forEach((inStream) => {
        if (inStream !== null && !inStream.closed) inStream.close()
      })
    })
    this.once('finish', () => {
      this.outStream.end(undefined, undefined, () => this.outStream.close())
    })
    // this.once('end', () => {
    //   debugger
    //   this.outStream.end(undefined, undefined, () => this.outStream.close())
    // })
    this.outStream.on('end', () => {
      debugger
      this.outStream.close()
    })
    this.outStream.respond({
      ...this.defaultResponseHeaders,
      ':status': 200,
      'http2-duplex-id': this.id,
    })
    this.outStream.write('a') // firefox requires a body to resolve fetch promise
  }

  /**
   * @param {ServerHttp2Stream} inStream
   * @param {Object} headers
   */
  addInStream(inStream, headers) {
    this.inStreams.push(inStream)
    this.emit('newInStream')
    if (headers && headers['http2-duplex-end'] === 'true') this.end()
  }

  processInStreams() {
    (async () => {
      if (!this.processing) {
        this.processing = true
        const inStream = this.inStreams.shift()
        if (inStream) {
          // eslint-disable-next-line no-restricted-syntax
          for await (const chunk of inStream)
            if (!this.push(chunk)) throw new Error('not implemented')
        }
        this.processing = false
        this.processInStreams()
      }
    })()
  }

  _write(chunk, encoding, callback) {
    this.outStream.write(chunk, encoding, callback)
  }

  _final(callback) {
    this.addInStream(null)
    this.once('inStreamsDone', () => {
      this.push(null)
      callback()
    })
  }

  async _read() {
    if (!(await this.readQueueToEnd())) {
      this.removeAllListeners('newInStream')
      this.once('newInStream', async () => this._read())
    }
  }

  async readQueueToEnd() {
    if (this.readBusy === true) return false
    const inStream = this.inStreams.shift()
    if (inStream === undefined) return false
    this.readBusy = true
    if (inStream === null) {
      this.emit('inStreamsDone')
      return true
    }
    await this.readStreamToEnd(inStream)
    this.readBusy = false
    return this.readQueueToEnd()
  }

  readStreamToEnd(inStream) {
    return new Promise((resolve) => {
      inStream.on('data', (chunk) => {
        console.log(chunk.toString())
        if (!this.push(chunk)) throw new Error('not implemented')
      })
      inStream.on('end', () => {
        inStream.respond({ ':status': 200, ...this.defaultResponseHeaders }, { endStream: true })
        inStream.close()
        resolve()
      })
    })
  }
}
