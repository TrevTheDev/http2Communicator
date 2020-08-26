import { Duplex } from 'stream'
import { randomBytes } from 'crypto'

export default class MultiStreamToDuplex extends Duplex {
  /**
   * @param {ServerHttp2Stream} outStream
   * @param {Object} defaultResponseHeaders
   * @returns {MultiStreamToDuplex}
   */
  constructor(outStream, defaultResponseHeaders) {
    super()
    this.outStream = outStream
    this.id = randomBytes(64).toString('base64')
    this.defaultResponseHeaders = defaultResponseHeaders
    this.inStreams = []
    this.outStream.once('close', () => {
      if (!this.closed) this.push(null)
    })
    this.once('close', () => {
      if (!this.outStream.closed) this.outStream.close()
      this.halted = true
      if (this.fin) this.fin()
      this.inStreams.forEach((inStream) => {
        if (inStream !== null && !inStream.closed) inStream.close()
      })
    })
    this.outStream.respond({
      ':status': 200,
      'http2-duplex-id': this.id,
      'Access-Control-Expose-Headers': 'http2-duplex-id',
      'Content-Type': 'application/octet-stream',
      ...this.defaultResponseHeaders,
    })
    this.outStream.write('a') // firefox requires a body to resolve fetch promise
  }

  /**
   * @param {ServerHttp2Stream} inStream
   * @param {Object} headers
   */
  addStream(inStream, headers) {
    if (this.resolveNextStream) this.resolveNextStream(inStream)
    else this.inStreams.push(inStream)
    if (inStream !== null) {
      inStream.once('close', () => {
        const index = this.inStreams.indexOf(inStream)
        if (index > -1) this.inStreams.splice(index, 1)
      })
    }
    if (headers['http2-duplex-end'] === 'true') this.end()
  }

  /**
   * @returns {Promise}
   */
  getReadableStream() {
    if (!this.nextStreamPromise) {
      this.nextStreamPromise = new Promise((resolve, reject) => {
        (async () => {
          try {
            const inStream = await this.getNextStream()
            inStream.on('readable', () => {
              delete this.nextStreamPromise
              if (this.halted) reject(new Error('cancelled before readable'))
              else resolve(inStream)
            })
          } catch (e) {
            delete this.nextStreamPromise
            reject(e)
          }
        })()
      })
    }
    return this.nextStreamPromise
  }

  /**
   * @returns {Promise}
   */
  getNextStream() {
    return new Promise((resolve, reject) => {
      if (this.inStreams.length > 0) {
        const nextStream = this.inStreams.shift()
        if (nextStream === null) reject(new Error('end of queue reached'))
        else resolve(nextStream)
      } else {
        this.resolveNextStream = (stream) => {
          delete this.resolveNextStream
          if (stream === null) reject(new Error('null sent to empty queue'))
          else resolve(stream)
        }
        this.fin = () => {
          delete this.fin
          reject(new Error('cancelled'))
        }
      }
    })
  }

  _write(chunk, encoding, callback) {
    this.outStream.write(chunk, encoding, callback)
  }

  async _read() {
    try {
      const inStream = await this.getReadableStream()
      let chunk
      // Use a loop to make sure we read all currently available data
      // eslint-disable-next-line no-cond-assign
      while ((chunk = inStream.read()) !== null)
        if (!this.push(chunk)) throw new Error('not implemented')

      inStream.respond({ ':status': 200, ...this.defaultResponseHeaders }, { endStream: true })
    } catch (e) {
      console.log(e)
      this.push(null)
    }
  }
}
