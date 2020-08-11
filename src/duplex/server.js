/* eslint-env node */
import EventEmitter from 'events'
import { randomBytes } from 'crypto'
import { Duplex, Writable } from 'stream'

/* eslint-env node */
import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSecureServer } from 'http2'
import { logServer } from '../server/http2 logging.js'

const { readFile } = fs.promises
const __dirname = dirname(fileURLToPath(import.meta.url))
const certDir = join(process.cwd(), 'dev certificate')

// function exToErr(obj, method) {
//   const origMethod = obj[method]
//   obj[method] = function (...args) {
//     try {
//       origMethod.apply(this, args)
//     } catch (ex) {
//       obj.emit('error', ex)
//     }
//   }
// }

class ServerDuplex extends Duplex {
  constructor(stream, options) {
    super(options)
    this.stream = stream
    this.options = options
    this.needChunk = false
    this.chunks = []
  }

  sink() {
    const ths = this
    return new Writable({
      ...ths.options,
      write(chunk, encoding, cb) {
        ths.chunks.push({ chunk, cb })
        ths.emit('written', chunk.length)
        if (ths.needChunk) ths._read()
      },
    })
  }

  _read() {
    if (this.chunks.length > 0) {
      this.needChunk = false
      const { chunk, cb } = this.chunks.shift()
      console.log(chunk.toString())
      if (this.push(chunk))
        process.nextTick(() => this._read())

      return cb()
    }
    this.needChunk = true
    return undefined
  }

  _write(chunk, encoding, cb) {
    this.stream.write(chunk, encoding, cb)
  }

  _final(cb) {
    if (this.stream._writableState.ending)
      return cb()

    return this.stream.end(cb)
  }
}

class Http2DuplexServer extends EventEmitter {
  constructor(http2Server, path, options) {
    super()

    this.http2Server = http2Server
    this.path = path
    this.options = options
    this.sessions = new Set()

    this.commonHeaders = {
      'Cache-Control': 'max-age=0, no-cache, must-revalidate, proxy-revalidate',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': 86400,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
    }

    this.attach()
  }

  attach() {
    if (!this.sessionListener) {
      this.sessionListener = this.processSession.bind(this)
      this.http2Server.on('session', this.sessionListener)
    }
  }

  async processSession(session) {
    const duplexes = new Map()

    this.sessions.add(session)

    session.on('close', () => {
      this.sessions.delete(session)
      for (const duplex of duplexes.values())
        duplex.push(null)
    })

    session.on('stream', async (stream, headers, flags, rawHeaders) => {
      await this.processStream(
        stream, headers, flags, rawHeaders,
        duplexes, { ...this.commonHeaders },
      )
    })
  }

  async processStream(stream, headers, flags, rawHeaders, duplexes, responseHeaders) {
    // console.log(headers)
    if (headers[':path'] !== this.path)
      this.emit('unhandledStream', stream, headers, flags, rawHeaders, duplexes, responseHeaders)
    else {
      // if (!stream.http2DuplexOwned) {
      //   exToErr(stream, 'respond')
      //   exToErr(stream, 'close')
      //   stream.http2DuplexOwned = true
      // }

      const method = headers[':method']

      if (method === 'GET')
        await this.newStream(stream, headers, flags, rawHeaders, duplexes, responseHeaders)

      else if (method === 'POST') {
        const id = headers['http2-duplex-id']
        if (!id)
          console.log(id)

        const duplex = duplexes.get(id)
        if (!duplex)
          stream.respond({ ':status': 404, ...responseHeaders }, { endStream: true })
        else {
          const respond = () => stream.respond({ ':status': 200, ...responseHeaders }, { endStream: true })

          const end = () => {
            duplex.push(null)
            duplexes.delete(id)
            respond()
          }

          if (headers['http2-duplex-end'] === 'true') end()
          else {
            const onClose = () => stream.close()

            duplex.on('close', onClose)
            stream.on('close', () => duplex.removeListener('close', onClose))

            if (headers['http2-duplex-single'] === 'true') {
              const sink = duplex.sink()
              sink.on('finish', end)
              stream.pipe(sink)
            } else {
              const contentLength = parseInt(headers['content-length'], 10)
              if (contentLength === 0) respond()
              else {
                const sink = duplex.sink()
                sink.on('finish', respond)
                stream.pipe(sink)
                if (contentLength > 0) {
                  let received = 0
                  sink.on('written', (len) => {
                    received += len
                    if (received >= contentLength) stream.push(null)
                  })
                }
              }
            }
          }
        }
      } else if (method === 'OPTIONS') {
        stream.respond({
          ':status': 200,
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': 86400,
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          ...responseHeaders,
        }, { endStream: true })
      } else {
        stream.respond({ ':status': 405, ...responseHeaders }, { endStream: true })
        this.emit('warning', new Error(`unknown method: ${method}`))
      }
    }
  }

  async newStream(stream, headers, flags, rawHeaders, duplexes, responseHeaders) {
    const duplex = new ServerDuplex(stream, this.options)
    const id = randomBytes(64).toString('base64')
    duplexes.set(id, duplex)
    // exToErr(duplex, 'end')
    const onClose = () => duplex.end()

    stream.on('close', onClose)
    duplex.on('close', () => {
      stream.removeListener('close', onClose)
      duplexes.delete(id)
      stream.close()
    })
    stream.respond({
      ':status': 200,
      'http2-duplex-id': id,
      'Access-Control-Expose-Headers': 'http2-duplex-id',
      'Content-Type': 'application/octet-stream',
      ...responseHeaders,
    })
    // Sometimes fetch waits for first byte before resolving
    stream.write('a')
    this.emit('duplex', duplex, id, headers, flags, rawHeaders, duplexes, responseHeaders)
    return duplex
  }

  destroy(obj) {
    try {
      obj.destroy()
    } catch (ex) {
      this.emit('warning', ex)
    }
  }

  detach() {
    if (this.sessionListener) {
      this.http2Server.removeListener('session', this.sessionListener)
      this.sessionListener = null
      this.sessions.forEach((session) => {
        session.removeAllListeners('stream')
        this.destroy(session)
      })
    }
  }
}

(async function () {
  const http2Server = createSecureServer({
    key: await readFile(join(certDir, 'selfsigned.key')),
    cert: await readFile(join(certDir, 'selfsigned.crt')),
  })
  logServer(http2Server, 'server', 'all')

  const http2DuplexServer = new Http2DuplexServer(http2Server, '/example')

  http2DuplexServer.on('duplex', (stream) => stream.pipe(stream))

  http2DuplexServer.on('unhandledStream', (stream, headers) => {
    const path = headers[':path']
    if (path === '/client.html') {
      return stream.respondWithFile(
        join(__dirname, path.substr(1)),
        { 'content-type': 'text/html' },
      )
    }
    if ((path === '/client.js')
      || (path === '/bundle.js')
      || (path === '/client duplex stream.js')) {
      return stream.respondWithFile(
        join(__dirname, path.substr(1)),
        { 'content-type': 'text/javascript' },
      )
    }
    return stream.respond({ ':status': 404 }, { endStream: true })
  })

  http2Server.listen(7000, '0.0.0.0')
}())
