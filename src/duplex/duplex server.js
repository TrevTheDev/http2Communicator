import EventEmitter from 'events'
import MultiStreamToDuplex from './multi stream to duplex.js'

export default class DuplexServer extends EventEmitter {
  /**
   * @param {Object} defaultResponseHeaders
   * @returns {DuplexServer}
   */
  constructor(defaultResponseHeaders = {
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': 86400,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*', // `${session.socket.remoteAddress}`
    'Cache-Control': 'max-age=0, no-cache, must-revalidate, proxy-revalidate',
  }) {
    super()
    this.defaultResponseHeaders = defaultResponseHeaders
    this.sessions = new Map()
  }

  /**
   * @param {ServerHttp2Stream} stream
   * @param {Object} headers
   * @returns {Boolean}
   */
  handleHttp2Streams(stream, headers/* , flags, rawHeaders */) {
    const { session } = stream
    let duplexes
    if (this.sessions.has(session)) duplexes = this.sessions.get(session)
    else {
      duplexes = new Map()
      this.sessions.set(session, duplexes)
      session.once('close', () => {
        Array.from(duplexes.values()).forEach((duplex) => duplex.push(null))
        this.sessions.delete(session)
      })
    }

    const respond = (statusCode) => stream.respond({ ':status': statusCode, ...this.defaultResponseHeaders }, { endStream: true })

    const method = headers[':method']

    if (method === 'POST') {
      const id = headers['http2-duplex-id']
      const duplex = duplexes.get(id)
      if (duplex) duplex.addStream(stream, headers)
      else respond(404)
    } else if (method === 'GET') {
      const duplex = new MultiStreamToDuplex(stream, this.defaultResponseHeaders)
      duplexes.set(duplex.id, duplex)
      duplex.once('close', () => duplexes.delete(duplex.id))

      this.emit('duplex', duplex)
    } else if (method === 'OPTIONS') respond(200)
    else respond(405)
    return true
  }
}
