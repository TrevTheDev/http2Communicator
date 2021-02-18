/* eslint-disable no-bitwise,no-restricted-syntax */

/**
 * pulls stream, converts it to data, converts it to message and sends this via the
 * MessagePuller#NextMessageCb
 *
 * @namespace BrowserMessagePuller
 * @private
 */

import getFirstMessage from './get object from streams.js'
import EnhancedStream from './enhanced stream.js'
import messageRouter from './message router.js'
import sharedBaseInit from './shared base.js'

/**
 * pull/waits for more data and makes newDataCb whenever new data is sent to the browser
 *
 * @memberof BrowserMessagePuller#
 * @function
 * @param {MessagePuller#newDataCb} newDataCb - callback to send new data to
 */
let browserGetMoreData

/**
 * Continuously reads browser stream, sending all new data via MessagePuller#newDataCb.
 * If an error occurs during reading, errorCb is made.
 *
 * @memberof BrowserMessagePuller#
 * @param {BrowserMessagePuller#processingErrorInStream} errorCb
 * @param {EnhancedStream} stream
 */
const readBrowserStream = (errorCb, stream) => {
  /** @type {(MessagePuller#newDataCb|undefined)} */
  let cb
  /** @type {string} */
  let data = '';
  (async () => {
    try {
      for await (/** @type {ArrayBuffer} */ const chunk of stream) {
        data += new TextDecoder('utf-8').decode(chunk)
        if (cb) {
          const result = data
          /** @type {MessagePuller#newDataCb} */
          const cbTmp = cb
          data = ''
          cb = undefined
          cbTmp(result)
        }
      }
    } catch (e) { errorCb(e) }
  })()

  browserGetMoreData = (/* MessagePuller#NewDataCb */ newDataCb) => {
    if (cb) throw new Error('two gets!')
    if (data !== '') {
      /** @type {string} */
      const result = data
      data = ''
      newDataCb(result)
    } else cb = newDataCb
  }
}

/**
 * makes firstMsgCb once the first message is received
 *
 * @memberof BrowserMessagePuller#
 * @param {MessageRouter#nextMsgHandler} firstMsgCb
 */
const browserGetMsgFromStream = (firstMsgCb) => getFirstMessage(
  browserGetMoreData,
)(
  firstMsgCb,
)

/**
 * @memberOf CoreConversationApi
 * @param {FetchDuplex} stream
 * @param {Object} json
 * @returns {Question}
 */
const browserNewQuestion = (stream, json) => {
  /** @type {Question} */
  let question
  /** @type {Boolean} */
  let unexpectedClose = true

  /** @type {EnhancedStream} */
  const writeStream = new EnhancedStream(stream)

  writeStream.onClose(() => {
    if (unexpectedClose) question.cancelQuestion(new Error('stream closed unexpectedly'))
    unexpectedClose = false
  })

  /**
   * if an error occurs, cancels the question with the
   * outcome of that error
   *
   * @memberof BrowserMessagePuller#
   * @param {Error} e
   */
  const processingErrorInStream = (e) => {
    unexpectedClose = false
    debugger
    writeStream.end()
    question.cancelQuestion(e)
  }

  readBrowserStream(processingErrorInStream, writeStream)
  /** @type {MessageRouter#db} */
  const db = { }
  browserGetMsgFromStream(messageRouter(db))
  question = sharedBaseInit(db, writeStream)
    .newQuestion({ messageObject: { body: { ...json } } }, (results) => { console.log(results) })
  return question
}

export default browserNewQuestion
