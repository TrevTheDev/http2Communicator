/* eslint-env node */
import devcert from 'devcert'
// import { /* join, */ dirname } from 'path'
// import { fileURLToPath } from 'url'
import { createSecureServer } from 'http2'
import EventEmitter from 'events'

import { logServer } from './other/http2 logging.js'
import { trackServer } from './other/http2 tracking.js'
import Router from './router.js'

import DuplexServer from './duplex/duplex server.js'
import FileServer from './file server.js'

import ObjectStream from './conversation/object stream.js'
import ServerResponse from './conversation/server response.js'

import { listeners } from './conversation/listener promise.js'

import { SETTINGS, setDefaultSettings } from './other/globals.js'

// const __dirname = dirname(fileURLToPath(import.meta.url));

export default class ServerNode extends EventEmitter {
  constructor(http2Server, settings) {
    super()
    setDefaultSettings(settings)
    return new Promise((resolve) => {
      (async () => {
        if (!http2Server) {
          const ssl = await devcert.certificateFor('LOCALHOST')
          http2Server = createSecureServer({
            key: ssl.key,
            cert: ssl.cert,
          })
          http2Server.listen(SETTINGS.serverPort, SETTINGS.serverHostName)
          console.log(`listening on https://${SETTINGS.serverHostName}:${SETTINGS.serverPort}`)
        }

        this.http2Server = http2Server

        logServer(this.http2Server, 'server', SETTINGS.log)
        trackServer(this)

        const handleObjectStreams = (objectStream) => {
          objectStream.on('object', async (object) => {
            const { type, questionId } = object
            if (objectStream.promiseDb[questionId])
              objectStream.promiseDb[questionId]._handleMessage(object)
            else if (type === 'question')
              this.emit('question', new ServerResponse(objectStream, object))
            else if (type === 'done')
              objectStream.end()
            else throw new Error('unknown object')
          })
          // objectStream.on('end', () => this.emit('done'))
        }

        const duplexServer = new DuplexServer()
        duplexServer.on('duplex', (duplex) => {
          duplex.pipe(duplex)
          // handleObjectStreams(new ObjectStream(duplex))
        })

        const handleNodeStreams = (stream/* , headers, flags, rawHeaders */) => {
          stream.respond({
            ':status': 200,
            'content-type': 'application/json; charset=utf-8',
          })
          handleObjectStreams(new ObjectStream(stream))
          return true
        }

        const handleListeners = (stream, headers/* , flags, rawHeaders */) => {
          listeners[headers['listener-id']].resolve(stream)
          return true
        }
        const routes = []

        if (SETTINGS.browserStreams) {
          routes.push([
            new RegExp(SETTINGS.browserStreams),
            (...args) => duplexServer.handleHttp2Streams(...args),
          ])
        }
        if (SETTINGS.nodeStreams)
          routes.push([new RegExp(SETTINGS.nodeStreams), (...args) => handleNodeStreams(...args)])

        if (SETTINGS.listenerStreams)
          routes.push([new RegExp(SETTINGS.listenerStreams), (...args) => handleListeners(...args)])

        if (SETTINGS.serveFilesFrom)
          routes.push([/.*/, FileServer])
        else {
          routes.push([/.*/, (stream) => {
            stream.respond({ ':status': 404, 'Cache-Control': 'no-cache' })
          }])
        }

        const router = new Router(this.http2Server, routes)
        resolve(this)
      })()
    })
  }
}

const serverNode = new ServerNode(undefined, { serverHostName: '0.0.0.0', serverPort: 7000 });
(async () => {
  await serverNode
})()
