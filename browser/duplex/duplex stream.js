/* eslint-disable max-classes-per-file */
/* eslint-env node, browser */
/* global TransformStream */
import { Duplex } from 'stream'

// class ResponseError extends Error {
//   constructor(response) {
//     super(response.statusText || String(response.status))
//     this.response = response
//   }
// }

class FetchDuplex extends Duplex {
  constructor(url, options = {}) {
    super(options)
    this.url = url
    this.options = { /* credentials: 'include', */ disableRequestStreaming: false, ...options }
    this.reading = false
    this.first = true
    return new Promise((resolve, reject) => {
      (async () => {
        console.log('start fetched')
        const response = await fetch(this.url, { cache: 'no-store', ...this.options })
        console.log('done fetched')
        if (response.ok) {
          this.reader = response.body.getReader()
          this.id = response.headers.get('http2-duplex-id')

          // const supportsRequestStreams = !new Request('', {
          //   body: new ReadableStream(), method: 'POST',
          // }).headers.has('Content-Type')
          // console.log(supportsRequestStreams)
          //
          // if (!this.options.disableRequestStreaming && supportsRequestStreams) {
          //   const { readable, writable } = new TransformStream()
          //   console.log('fetch2')
          //   await fetch(this.url, this._writeOptions({
          //     headers: { 'http2-duplex-single': 'true' },
          //     body: readable,
          //   }))
          //   console.log('fetch2ed')
          //   this.writer = writable.getWriter()
          // }
          resolve(this)
        } else reject(response)
      })()
    })
  }

  async _read() {
    if (this.reading) return
    this.reading = true
    try {
      let value
      let done
      do {
        ({ value, done } = await this.reader.read())
        if (done)
          this.push(null)
        else if (this.first) {
          console.log('first resolved')
          // Sometimes fetch waits for first byte before resolving
          // so comms server-side sends initial dummy byte
          this.first = false
          done = !this.push(Buffer.from(value.subarray(1)))
        } else
          done = !this.push(Buffer.from(value))

        // done = !this.push(done ? null : Buffer.from(value))
      } while (!done)
    } catch (error) {
      this.push(null)
      this.emit('error', error)
    } finally {
      this.reading = false
    }
  }

  _writeOptions(extraOptions) {
    const options = {
      method: 'POST',
      cache: 'no-store',
      headers: {},
      ...this.options,
      ...extraOptions,
    }
    options.headers = {
      'http2-duplex-id': this.id,
      'Content-Type': 'application/octet-stream',
      ...options.headers,
    }
    return options
  }

  async _write(chunk, encoding, callback) {
    try {
      const data = Uint8Array.from(chunk)
      if (this.writer) {
        await this.writer.ready
        await this.writer.write(data)
      } else {
        const response = await fetch(this.url, this._writeOptions({ body: data }))
        if (!response.ok) throw new Error(response)
        await response.arrayBuffer()
        callback(null)
      }
    } catch (error) {
      callback(error)
    }
  }

  async _final(callBack) {
    try {
      if (this.writer) {
        await this.writer.ready
        await this.writer.close()
      } else {
        const response = await fetch(
          this.url,
          this._writeOptions({ headers: { 'http2-duplex-end': 'true' } }),
        )
        if (!response.ok) throw new Error(response)

        await response.arrayBuffer()
        callBack(null)
      }
    } catch (error) {
      callBack(error)
    }
  }
}

const duplexStream = (url, options) => new FetchDuplex(url, options)
export default duplexStream
