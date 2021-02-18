/** @private */
class Router {
  /**
   * @param {module:http2.Http2SecureServer} http2Server
   * @param {Array} routes
   * @returns {Router}
   */
  constructor(http2Server, routes = []) {
    this.http2Server = http2Server
    this.routes = []
    this.http2Server.on('session', (session) => this.newSession(session))
    routes.forEach((route) => this.addRoute(...route))
  }

  /**
   * @param {RegExp} pattern
   * @param {Function} callback
   * @param {Boolean} alwaysCallOnMatch - false
   */
  addRoute(pattern, callback, alwaysCallOnMatch = false) {
    this.routes.push({ pattern, callback, alwaysCallOnMatch })
  }

  /**
   * @param {ServerHttp2Session} session
   */
  newSession(session) {
    const streamHandler = (...args) => this.newStream(...args)
    session.on('stream', streamHandler)
    session.once('close', () => session.removeListener('stream', streamHandler))
  }

  /**
   * @param {ServerHttp2Stream} stream
   * @param {Object} headers
   * @param {Number} flags
   * @param {Array} rawHeaders
   */
  newStream(stream, headers, flags, rawHeaders) {
    const requestPath = headers[':path']
    const matches = this.routes.filter((route) => requestPath.match(route.pattern))
    let result = false
    matches.forEach((route) => {
      if (!result)
        result = route.callback(stream, headers, flags, rawHeaders)
      else if (route.alwaysCallOnMatch)
        route.callback(stream, headers, flags, rawHeaders)
    })
    if (!result)
      throw new Error(`unmatched router path: ${requestPath}`)
  }
}
export default Router
