import http2 from 'http2'
import fs from 'fs'
import EventEmitter from 'events'
import { execSync } from 'child_process'
import { logServer } from './http2 logging.js'
import { trackServer } from './http2 tracking.js'
import ObjectStream from './conversation/object stream.js'
import ServerResponse from './conversation/server response.js'
import { listeners } from './conversation/listener promise.js'
import { SETTINGS, setDefaultSettings } from './globals.js'

const createCertIfAbsent = () => {
  if (!fs.existsSync(SETTINGS.keyFile)) {
    if (!fs.existsSync(SETTINGS.certDir)) fs.mkdirSync(SETTINGS.certDir)
    const out = execSync(`openssl req -nodes -new -x509 -subj "${SETTINGS.certArgs}" -keyout "${SETTINGS.keyFile}" -out "${SETTINGS.certFile}"`)
    console.log(out)
  }
}

export default class ServerNode extends EventEmitter {
  constructor(http2Server, settings) {
    super()
    setDefaultSettings(settings)
    if (!http2Server) {
      createCertIfAbsent()
      http2Server = http2.createSecureServer({
        key: fs.readFileSync(SETTINGS.keyFile),
        cert: fs.readFileSync(SETTINGS.certFile),
      })
    }
    this.http2Server = http2Server

    if (SETTINGS.log) logServer(http2Server)
    trackServer(this)

    http2Server.on('stream', (stream, headers) => {
      if (headers[':path'] === SETTINGS.serverPath) {
        stream.respond({
          ':status': 200,
          'content-type': 'application/json; charset=utf-8',
        })
        const objectStream = new ObjectStream(stream)
        objectStream.on('object', async (object) => {
          const { type, questionId } = object
          if (objectStream.promiseDb[questionId])
            objectStream.promiseDb[questionId]._handleMessage(object)
          else if (type === 'question')
            this.emit('question', new ServerResponse(objectStream, object))
          else if (type === 'done') {
            this.emit('done')
            stream.end()
          } else throw new Error('unknown object')
        })
      } else if (headers[':path'] === SETTINGS.listenerPath)
        listeners[headers['listener-id']].resolve(stream)
    })
  }

  listen(port = SETTINGS.serverPort, hostname = SETTINGS.serverHostName) {
    this.http2Server.listen(port, hostname)
  }
}
