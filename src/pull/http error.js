/**
 * An error that can be sent via Http stream
 * @private
 */
class HttpError extends Error {
  /**
   *
   * @param {number} statusCode - http2 status code
   * @param {string} msg - body string
   * @param {EnhancedStream} stream - stream to respond on
   */
  constructor(statusCode, msg, stream) {
    super(msg)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.stream = stream
  }

  /**
   * sends response via stream
   */
  respondError() {
    if (!this.stream.responded) this.stream.respondError(this)
  }
}

export default HttpError
