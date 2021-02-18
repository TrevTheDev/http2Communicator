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
import serverStreamsRouter from './pull/server streams router.js'

// const __dirname = dirname(fileURLToPath(import.meta.url));

class ServerNode extends EventEmitter {
  /**
   * @memberOf ServerNode#
   * @callback MessageHandlerCb
   * @param {MessageObject} result
   */
  /**
   * @param {module:http2.Http2SecureServer} http2Server
   * @param {SETTINGS} settings=SETTINGS
   * @param {ServerNode#MessageHandlerCb} userQuestionHandler
   * @returns {Promise<ServerNode>}
   */
  constructor(http2Server, settings, userQuestionHandler) {
    super()
    setDefaultSettings(settings, false)
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

        /** @type {module:http2.Http2SecureServer} */
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
            else if (type === 'done') objectStream.end()
            else throw new Error('unknown object')
          })
          // objectStream.on('end', () => this.emit('done'))
        }

        const duplexServer = new DuplexServer()
        duplexServer.on('duplex', (duplex) => {
          handleObjectStreams(new ObjectStream(duplex))
        })

        /** @type {ServerStreamsRouter#incomingStreamHandler} */
        const browserConversationFn = serverStreamsRouter(userQuestionHandler)
        /**
         * @param {module:http2.ServerHttp2Stream} stream
         * @param {module:http2.IncomingHttpHeaders} headers
         * @returns {true}
         */
        const handleBrowserStreams = (stream, headers /* , flags, rawHeaders */) => {
          browserConversationFn(stream, headers)
          return true
        }

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

        if (SETTINGS.browserStreams)
          routes.push([new RegExp(SETTINGS.browserStreams), handleBrowserStreams])

        if (SETTINGS.nodeStreams)
          routes.push([new RegExp(SETTINGS.nodeStreams), handleNodeStreams])

        if (SETTINGS.listenerStreams)
          routes.push([new RegExp(SETTINGS.listenerStreams), handleListeners])

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

export default ServerNode

// (async () => {
//   const serverNode = await (new ServerNode(undefined, { serverHostName: '0.0.0.0', serverPort: 8443 }))
//
//   serverNode.on('question', async (serverResponse) => {
//     console.log(`SERVER: LOG STEP 1: ${JSON.stringify(serverResponse.json)}`)
//     // handles any messages sent by client of type 'message' to this serverResponse
//     serverResponse.on('message', (msg) => console.log(`SERVER: LOG STEP 4: ${JSON.stringify(msg)}`))
//     // sends 'hello' JSON message to client's question
//     serverResponse.say({ first: 'your', name: 'please', step: 2 }, 'hello')
//     // asks a question of client's question
//     const question = serverResponse.ask({
//       do: 'you', like: 'your', name: ['yes', 'no'], step: 3,
//     })
//     // handles any messages sent by client of type 'message' to this question
//     question.on('message', (msg) => {
//       console.log(`SERVER: LOG STEP 5: ${JSON.stringify(msg)}`)
//       question.say({ and: 'I', say: 'more', step: 6 }, 'more')
//     })
//     // waits for client to respond to question
//     console.log(`SERVER: LOG STEP 7: ${JSON.stringify(await question)}`)
//
//     // establishes a new stream from client to comms server (opposite of Push Stream)
//     // streams can also stream objects - known as Speaker
//     const incomingStream = await serverResponse.createListener('uploadFile', 'raw')
//     incomingStream.pipe(process.stdout)
//
//     // stream file to client - Push Stream
//     // streams can also stream objects - known as Speaker
//     const fileSpeaker = await serverResponse.createSpeaker('downloadFile', 'raw')
//     fs.createReadStream('./package.json').pipe(fileSpeaker)
//
//     // after file has been streamed, reply to the original question
//     fileSpeaker.on('finish', () => serverResponse.reply({ my: 'name', is: 'server' }))
//   })
//
//   // gracefully shuts down the server
//   await serverNode.gracefulShutdown()
// })()
