let streamId = 0
export const trackStream = (session, stream) => {
  streamId += 1
  stream.streamId = streamId
  session.trackedStreams[streamId] = stream
  stream.once('close', () => {
    delete session.trackedStreams[stream.streamId]
  })
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
    await Promise.all(
      Object.values(server.trackedSessions).map(async (session) => {
        await Promise.all(
          Object.values(session.trackedStreams).map(async (stream) => {
            await new Promise((resolve) => {
              if (stream.closed) resolve()
              else
                stream.end(undefined, undefined, () => resolve())
                // stream.close(undefined, () => resolve())
            })
          }),
        )
        // await new Promise((resolve) => {
        //   if (session.closed) resolve()
        //   else session.close(() => resolve())
        // })
      }),
    )

    return new Promise((resolve) => {
      server.close(() => resolve())
    })
  }

  // server.on(`stream`, (stream, headers, flags) =>
  //   console.log(`${tag} streamed`)
  // )

  // server.on(`close`, () => {})
}
