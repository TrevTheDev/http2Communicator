let streamId = 0
export const trackStream = (session, stream) => {
  streamId += 1
  stream.streamId = streamId
  session.trackedStreams[streamId] = stream
  stream.once('close', () => delete session.trackedStreams[stream.streamId])
}

let sessionId = 0
export const trackSession = (server, session) => {
  session.trackedStreams = {}
  sessionId += 1
  session.sessionId = sessionId
  server.trackedSessions[sessionId] = session

  session.once('close', () => delete server.trackedSessions[session.sessionId])
  session.on('stream', (stream) => trackStream(session, stream))
}

export const trackServer = (CommsServer) => {
  const server = CommsServer.http2Server
  server.trackedSessions = {}
  server.on('session', (session) => trackSession(server, session))

  CommsServer.gracefulShutdown = async () => {
    console.log('gracefulShutdown started')
    await Promise.all(
      Object.values(server.trackedSessions).map((session) => new Promise((resolveSession) => {
        (async () => {
          await Promise.all(
            Object.values(session.trackedStreams).map((stream) => new Promise((resolve) => {
              if (stream.closed) resolve()
              else {
                stream.close(undefined, () => {
                  resolve()
                })
              }
            })),
          )
          session.close(() => {
            resolveSession()
          })
        })()
      })),
    )

    return new Promise((resolve) => {
      server.close(() => {
        resolve()
        console.log('gracefulShutdown done')
      })
    })
  }
}
