import EventEmitter from 'events'
import http2 from 'http2'
import ObjectStream from '../server/conversation/object stream.js'
import { logStream, logSession } from '../server/http2 logging.js'
import Question from '../server/conversation/question.js'
import { SETTINGS, setDefaultSettings } from '../server/globals.js'

export default class ClientNode extends EventEmitter {
  constructor(settings) {
    super()
    setDefaultSettings(settings)
    this.session = http2.connect(SETTINGS.serverAddress, SETTINGS.http2ConnectionOptions)
    logSession(this.session, 'client', SETTINGS.log)

    this.stream = this.session.request({
      ':method': 'POST',
      ':path': SETTINGS.serverPath,
      'content-type': 'application/json',
    })

    logStream(this.stream, 'client', SETTINGS.log)

    this.objectStream = new ObjectStream(this.stream, this)

    this.on('object', async (object) => {
      const { questionId, originalQuestionId } = object
      if (this.objectStream.promiseDb[originalQuestionId])
        this.objectStream.promiseDb[originalQuestionId]._handleMessage(object)
      else if (this.objectStream.promiseDb[questionId])
        this.objectStream.promiseDb[questionId]._handleMessage(object)
      else throw new Error('unknown object')
    })

    this.session.on('stream', (pushedStream, requestHeaders) => {
      pushedStream.on('push', () => {
        const question = this.objectStream.promiseDb[requestHeaders['question-id']]
        if (question) {
          if (requestHeaders['speaker-type'] === SETTINGS.speakerTypeRaw)
            question.emit(requestHeaders['speaker-name'], pushedStream)
          else {
            const oStream = new ObjectStream(pushedStream)
            oStream.headers = requestHeaders
            question.emit(requestHeaders['speaker-name'], oStream)
          }
        } else
          pushedStream.close(http2.constants.NGHTTP2_REFUSED_STREAM)
      })
    })

    this.stream.once('finish', () => {})
  }

  ask(json) { return new Question(this.objectStream, json) }

  end() {
    this.objectStream.end({ type: 'done' })
    return new Promise((resolve) => {
      this.stream.close(undefined, () => {
        this.session.close(() => resolve())
      })
    })
  }
}
