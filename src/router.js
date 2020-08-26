export default class Router {
  constructor(http2Server, routes = []) {
    this.http2Server = http2Server
    this.routes = []
    this.sessions = new Set()
    this.http2Server.on('session', (session) => this.newSession(session))
    routes.forEach((route) => this.addRoute(...route))
  }

  addRoute(pattern, callback, alwaysCallOnMatch = false) {
    this.routes.push({ pattern, callback, alwaysCallOnMatch })
  }

  newSession(session) {
    this.sessions.add(session)
    session.once('close', () => this.sessions.delete(session))

    session.on('stream', (stream, headers, flags, rawHeaders) => this.newStream(stream, headers, flags, rawHeaders))
  }

  newStream(stream, headers, flags, rawHeaders) {
    const matches = this.routes.filter((route) => headers[':path'].match(route.pattern))
    let result = false
    matches.forEach((route) => {
      if (!result)
        result = route.callback(stream, headers, flags, rawHeaders)
      else if (route.alwaysCallOnMatch)
        route.callback(stream, headers, flags, rawHeaders)
    })
    if (!result)
      throw new Error(`unmatched router path: ${headers[':path']}`)
  }
}
