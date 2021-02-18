/* eslint-env browser */
import connectToServer from './duplex/duplex stream.js'
import { setDefaultSettings, SETTINGS } from '../src/other/globals.js'
// import { logSession, logStream } from './other/http2 logging.js'
// import ObjectStream from '../src/conversation/object stream.js'
// import { Question } from '../src/conversation/question.js'
import browserNewQuestion from '../src/pull/browser get object from stream.js'

const connection = async (settings) => {
  debugger
  const cObj = {}
  setDefaultSettings(settings)
  const stream = await connectToServer(`${SETTINGS.serverAddress}/${SETTINGS.browserStreams}`, undefined, undefined, (error) => {
    cObj.ask = () => { throw new Error('connection already closed') }
    throw error
  })
  cObj.ask = (json) => browserNewQuestion(stream, json)
  return cObj
}
export default connection
// export default class BrowserClient extends EventEmitter {
//   /**
//    * @param {SETTINGS?} settings
//    * @returns {BrowserClient}
//    */
//   constructor(settings) {
//     setDefaultSettings(settings)
//     super()
//     return new Promise((resolve, reject) => {
//       (async () => {
//         try {
//           this.stream = await duplexStream(`${SETTINGS.serverAddress}/browserStreams`)
//           // this.objectStream = new ObjectStream(this.stream, this)
//           // this.on('object', async (object) => {
//           //   const { questionId, originalQuestionId } = object
//           //   if (this.objectStream.promiseDb[originalQuestionId])
//           //     this.objectStream.promiseDb[originalQuestionId]._handleMessage(object)
//           //   else if (this.objectStream.promiseDb[questionId])
//           //     this.objectStream.promiseDb[questionId]._handleMessage(object)
//           //     // else if (object.type === 'done')
//           //   //   console.log('done')
//           //   else throw new Error('unknown object')
//           // })
//           resolve(this)
//         } catch (e) {
//           reject(e)
//         }
//       })()
//     })
//   }
//
//   /**
//    * @param {Object} json
//    * @returns {Question}
//    */
//   ask(json) { return browserNewQuestion(this.stream, json) }
//
//   /**
//    * @returns {Promise}
//    */
//   end() {
//     return new Promise((resolve) => {
//       this.stream.end(undefined, undefined, resolve)
//     })
//   }
// }
