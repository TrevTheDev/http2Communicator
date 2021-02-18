/* eslint-disable no-bitwise,no-restricted-syntax,max-len */

import getFirstMessage from './get object from streams.js'
import { MSG_TYPES } from '../other/globals.js'
import HttpError from './http error.js'
import messageRouter from './message router.js'
import sharedBaseInit from './shared base.js'

/**
 * @namespace ServerMessagePuller
 * @private
 */

/**
 * Injects function to pull next stream from conversation db.
 * Required to avoid circular dependencies
 *
 * @memberof ServerMessagePuller
 * @param {Conversations.getNextStreamInConversation} getNextStreamInConversation
 * @returns {CoreConversationApi#serverConversationHandler}
 */
const primeServerForStreams = (getNextStreamInConversation) => {
  /**
   * Pulls/awaits the next stream in the conversation,
   * once received, reads it asynchronously and sends
   * the content via newDataCb
   *
   * @memberof ServerMessagePuller#
   * @param {MessagePuller#newDataCb} newDataCb - callback to send new data to
   * @param {Conversations#uid} uid - conversation uid
   */
  const serverGetMoreData = (newDataCb, uid) => {
    /**
     * processes next stream  - also provides a callback to handle any errors.
     *
     * @memberof ServerMessagePuller#
     * @param {conversation.errorCallback} error - function to propagate any processing errors on this stream
     * @param {EnhancedStream} stream - next stream to process
     */
    const nextStreamCallback = (error, stream) => {
      (async () => {
        try {
          /** @type {string} */
          let data = ''
          for await (/** @type {string} */ const chunk of stream)
            data += chunk
          newDataCb(data, stream)
        } catch (/** @type {Error|HttpError} */e) {
          error(e)
        }
      })()
    }
    getNextStreamInConversation(uid, nextStreamCallback)
  }
  const serverGetFirstObject = getFirstMessage(serverGetMoreData)
  /** @namespace CoreConversationApi */
  /**
   * @memberOf CoreConversationApi#
   * @param {ServerNode#MessageHandlerCb} answerQuestionHandler
   * @param {EnhancedStream} writeStream
   */
  const serverConversationHandler = (answerQuestionHandler, writeStream) => {
    /** @type {MessageRouter#db} */
    const db = { }
    /** @type {MessageRouter#nextMsgHandler} */
    const nextMsgHandler = messageRouter(db)
    /** @type {SharedBase#coreApi} */
    const ci = sharedBaseInit(db, writeStream)
    serverGetFirstObject((/* PullerMessageContainer */ object) => {
      if (object.messageObject.type !== MSG_TYPES.question) {
        throw new HttpError(
          400,
          `conversation must start with a object of type '${MSG_TYPES.question}'`,
          writeStream,
        )
      }
      /** @type { ReceivedMessageContainer} */
      const tmpObj = {
        messageObject: object.messageObject,
        stream: object.stream,
        doneWithObject: () => {
          delete tmpObj.doneWithObject
          object.nextObject(nextMsgHandler)
        },
      }
      const answer = ci.answerQuestion(tmpObj, () => {
        debugger
        writeStream.end()
        // end of question
      })
      answerQuestionHandler(answer)
    }, writeStream.uid)
  }

  return serverConversationHandler
}

export default primeServerForStreams
