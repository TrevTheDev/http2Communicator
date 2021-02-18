/* eslint-disable no-bitwise,max-len */
import { createUid } from '../other/shared functions.js'
import { SETTINGS } from '../other/globals.js'

const NUMBER_OF_BYTES = 4

const toBytesInt32 = (num) => {
  let ascii = ''
  for (let i = NUMBER_OF_BYTES - 1; i >= 0; i -= 1)
    ascii += String.fromCharCode((num >> (8 * i)) & 255)

  return ascii
}
/**
 * prepares stream ( after Response has occurred - if server ) for writing by
 * adding write methods
 * @memberof EnhancedStream
 * @param {EnhancedStream} eStream
 * @param {module:http2.Http2Stream|FetchDuplex} stream
 * @returns {EnhancedStream}
 */
const makeStreamWritable = (eStream, stream) => {
  let writable = true
  Object.defineProperties(eStream, /** @lends EnhancedStream */{
    /**
     * returns true if stream can be written too
     *
     * @memberof EnhancedStream#
     * @readonly
     * @returns {boolean}
     */
    writable: { get() { return writable } },
    /**
     * @memberof EnhancedStream#
     * @method
     * @param {string} msgString - string to write to stream
     * @throws stream has already ended - cannot write to it
     */
    writeRaw: {
      value: (msgString) => {
        if (!writable) throw new Error('stream has already ended - cannot write to it')
        stream.write(msgString)
      },
    },
    /**
     * writes an `msgObject` using JSON.stringify to a stream
     *
     * @memberof EnhancedStream#
     * @method
     * @param {object} msgObject - simple object to JSON.stringify and write to stream.
     */
    write: {
      value: (msgObject) => {
        const str = JSON.stringify(msgObject)
        eStream.writeRaw(toBytesInt32(str.length) + str)
      },
    },
    /**
     * Ends and closes the stream
     *
     * @memberof EnhancedStream#
     * @method
     * @param {object} [msgObject] - object to send to server before ending and closing stream
     * @param {doneCb} [doneCb] - callback after stream has been closed
     * @throws stream has already ended - cannot write to it
     */
    end: {
      value: (msgObject, doneCb) => {
        if (!writable) throw new Error('stream has already ended - cannot end twice')
        writable = false
        if (msgObject) eStream.write(msgObject)
        stream.end(undefined, undefined, () => {
          if (stream.close) stream.close(undefined, doneCb)
          else if (doneCb) doneCb()
        })
      },
    },
  })
  return eStream
}

/**
 * @memberof EnhancedStream
 * @function
 * @param {EnhancedStream} eStream
 * @param {module:http2.ServerHttp2Stream} stream
 * @param {module:http2.IncomingHttpHeaders} requestHeaders
 * @returns {EnhancedStream}
 */
const enhanceToServerStream = (eStream, stream, requestHeaders) => /** @lends EnhancedStream# */ {
  /**
   *
   * @param {module:http2.OutgoingHttpHeaders} headerOverrides
   * @returns {module:http2.OutgoingHttpHeaders}
   */
  const responseHeaders = (headerOverrides) => {
    const headers = { ...SETTINGS.defaultResponseHeaders, 'Content-Type': 'text/plain; charset=UTF-8', ...headerOverrides }
    if (eStream.uid) headers['http2-duplex-id'] = eStream.uid
    if (eStream.idx) headers['http2-duplex-idx'] = eStream.idx
    return headers
  }
  const throwAlreadyResponded = () => { throw new Error('already responded on eStream steam - unable to respond twice') }
  let responded = false
  let setUid
  Object.defineProperties(eStream, /** @lends EnhancedStream# */{
    /**
     * @readonly
     * @type {object}
     */
    requestHeaders: { value: requestHeaders },
    /**
     * @readonly
     * @type {string}
     */
    method: { value: requestHeaders[':method'] },
    /**
     * stream's index number
     *
     * @readonly
     * @type {number}
     */
    idx: { value: parseInt(requestHeaders['http2-duplex-idx'], 10) },
    /**
     * @readonly
     * @type {boolean}
     */
    endRequested: { value: requestHeaders['http2-duplex-end'] === 'true' },
    /**
     * conversation's uid
     *
     * @readonly
     * @type {Conversations#uid}
     */
    uid: { get() { return requestHeaders['http2-duplex-id'] || setUid } },
    /**
     * true if the ResponseHeader has already been sent
     *
     * @readonly
     * @type {boolean}
     */
    responded: { get() { return responded } },
    /**
     * [SERVER ONLY] responds on Http2Stream and prevents any further responses
     *
     * @method
     * @param {number} code - default status code
     * @param {object} headerOverrides - any additional http2 to include
     * @throws already responded on eStream steam - unable to respond twice
     */
    respond: {
      value: (code = 200, headerOverrides = {}) => {
        if (eStream.responded) throwAlreadyResponded()
        responded = true
        stream.respond({ ':status': code, ...responseHeaders(headerOverrides) })
        makeStreamWritable(eStream, stream)
      },
    },
    /**
     * [SERVER ONLY] responds on Http2Stream starting conversation - writes 'a'
     * for firefox
     *
     * @method
     * @param {doneCb} doneCb
     * @returns {Conversations#uid} uid - conversations uid
     */
    respondConversation: {
      value: (doneCb) => {
        setUid = createUid()
        eStream.respond(200)
        stream.write('a')// firefox requires a body to resolve fetch promise
        eStream.onClose(doneCb)
        return eStream.uid
      },
    },
    /**
     * [SERVER ONLY] responds on Http2Stream with `code`
     * and `msg`
     *
     * @method
     * @param {number} code
     * @param {object=} msg
     */
    respondEnd: {
      value: (code = 200, msg) => {
        eStream.respond(code)
        if (msg) eStream.write(msg)
        return eStream.end()
      },
    },
    /**
     * [SERVER ONLY] responds on Http2Stream with `httpError`
     *
     * @method
     * @param {HttpError} httpError
     */
    respondError: {
      value: (httpError) => eStream.respondEnd(httpError.statusCode, httpError.message, 'TEXT', 'text/plain; charset=utf-8'),
    },
  })
}

/**
 * Wrapper object for Http2Stream
 * @private
 * @property {EnhancedStream#write} write - writes an `msgObject` using JSON.stringify to a stream
 * @property {EnhancedStream#end} end - ends and closes stream - can send a msg and get a callback onclose
 * @property {EnhancedStream#writeRaw} writeRaw - writes string literals to stream
 * @property {EnhancedStream#respondConversation} respondConversation - responds on Http2Stream starting conversation - returns conversation uid SERVER ONLY
 * @property {EnhancedStream#respondError} respondError - responds on Http2Stream with `httpError` SERVER ONLY
 * @property {EnhancedStream#respondEnd} respondEnd - responds on Http2Stream with `code` and `msg` ending communication SERVER ONLY
 * @property {EnhancedStream#respond} respond - responds on Http2Stream and prevents any further responses SERVER ONLY
 * @property {EnhancedStream#onClose} onClose - adds a callback that will occur once the underlying stream is `close`d
 * @property {EnhancedStream#requestHeaders} requestHeaders - [requestHeaders SERVER ONLY
 * @property {EnhancedStream#method} method - request headers method SERVER ONLY
 * @property {EnhancedStream#uid} uid - unique id of conversation SERVER ONLY
 * @property {EnhancedStream#idx} idx - current index number of communications SERVER ONLY
 * @property {EnhancedStream#endRequested} endRequested - whether http header 'http2-duplex-end' set to true SERVER ONLY
 * @property {EnhancedStream#responded} responded - true if responded, else undefined SERVER ONLY
 * @property {EnhancedStream#writable} writable - true if stream can be written too.
 */
class EnhancedStream {
  /**
   *
   * @param {module:http2.Http2Stream|module:http2.ServerHttp2Stream|FetchDuplex} stream
   * @param {module:http2.IncomingHttpHeaders} [requestHeaders] - only required for server
   */
  constructor(stream, requestHeaders) {
    this._stream = stream
    if (requestHeaders) enhanceToServerStream(this, stream, requestHeaders)
    else makeStreamWritable(this, stream)
    // if (this.then)
    //   debugger

    // this.then = (...args) => stream.then(...args)
    // this[Symbol.asyncIterator] = (...args) => stream[Symbol.asyncIterator](...args)
    /**
     * Adds a callback that will occur once the underlying stream is `close`d
     * @memberof EnhancedStream#
     * @method onClose
     * @param {doneCb} doneCb - callback after stream has been closed
     */
    this.onClose = (doneCb) => stream.once('close', doneCb)
  }

  [Symbol.asyncIterator](...args) {
    return this._stream[Symbol.asyncIterator](...args)
  }
}
export default EnhancedStream
