/* eslint-disable max-classes-per-file */
/* eslint-env node, browser */
import { Duplex } from 'stream'

class ResponseError extends Error {
  constructor(response) {
    super(response.statusText || String(response.status))
    this.response = response
  }
}

class FetchDuplex extends Duplex {
  constructor(url, options) {
    super(options)
    this.url = url
    this.options = {
      disableRequestStreaming: false,
      // mode: 'no-cors',
      // headers: { 'sec-fetch-mode': 'no-cors' },
      ...options,
    }
    this.first = true
    this.reading = false
  }

  async init() {
    const response = await fetch(this.url, { cache: 'no-store', ...this.options })
    if (!response.ok) throw new ResponseError(response)

    this.reader = response.body.getReader()
    this.id = response.headers.get('http2-duplex-id')
    if (!this.id)
      console.log(this.id)

    if (!this.options.disableRequestStreaming
      && !new Request('', {
        body: new ReadableStream(),
        method: 'POST',
      }).headers.has('Content-Type')) {
      const { readable, writable } = new TransformStream()
      await fetch(this.url, this._writeOptions({
        headers: { 'http2-duplex-single': 'true' },
        body: readable,
      }))
      this.writer = writable.getWriter()
    }
  }

  async _read() {
    if (this.reading) return
    this.reading = true
    try {
      let value
      let done
      do {
        ({ value, done } = await this.reader.read())
        if (done) this.push(null)
        else if (this.first) {
          // Sometimes fetch waits for first byte before resolving
          // so server-side sends initial dummy byte
          this.first = false
          done = !this.push(Buffer.from(value.subarray(1)))
        } else
          done = !this.push(Buffer.from(value))
      } while (!done)
    } catch (ex) {
      this.push(null)
      this.emit('error', ex)
    } finally {
      this.reading = false
    }
  }

  _writeOptions(extraOptions) {
    const options = {
      method: 'POST',
      cache: 'no-store',
      headers: {},
      ...extraOptions,
      ...this.options,
    }
    options.headers = {
      'http2-duplex-id': this.id,
      'Content-Type': 'application/octet-stream',
      ...options.headers,
    }
    return options
  }

  async _write(chunk, encoding, cb) {
    try {
      const data = Uint8Array.from(chunk)
      if (this.writer) {
        await this.writer.ready
        return await this.writer.write(data)
      }
      const opts = this._writeOptions({ body: data })
      console.log(opts)
      const response = await fetch(this.url, opts)
      if (!response.ok) throw new ResponseError(response)

      await response.arrayBuffer()
    } catch (error) {
      return cb(error)
    }
    return cb()
  }

  async _final(cb) {
    try {
      if (this.writer) {
        await this.writer.ready
        return await this.writer.close()
      }
      const response = await fetch(this.url, this._writeOptions(
        { headers: { 'http2-duplex-end': 'true' } },
      ))
      if (!response.ok) throw new ResponseError(response)

      await response.arrayBuffer()
    } catch (error) {
      return cb(error)
    }
    return cb()
  }
}

const duplexStream = async (url, options) => {
  const duplex = new FetchDuplex(url, options)
  await duplex.init()
  return duplex
}
export default duplexStream
