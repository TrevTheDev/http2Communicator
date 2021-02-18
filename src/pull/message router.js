/* eslint-disable functional/functional-parameters,max-len */
import { MSG_TYPES } from '../other/globals.js'
import HttpError from './http error.js'

/**
 * @typedef {Object} MessageRouter#db
 * @property {Object.<Question#uid, QuestionBase#messageHandler>} uid - look up of Question's objectHandlerFn via uid
 */

/**
 * pulls stream, converts it to data, converts it to object(s) and sends this via the
 * MessagePuller#NextMessageCb
 *
 * @namespace
 * @private
 * @alias MessageRouter
 * @param {MessageRouter#db} db
 * @returns {MessageRouter#nextMsgHandler}
 */
const messageRouter = (db) => {
  /**
   * translates PullerMessageContainer to ReceivedMessageContainer and
   * sends it via objectHandlerFn
   *
   * @memberof MessageRouter#
   * @param {PullerMessageContainer} msgContainer
   */
  const nextMsgHandler = (msgContainer) => {
    if (msgContainer && msgContainer.messageObject) {
      if (msgContainer.messageObject.type === MSG_TYPES.error) throw new Error(msgContainer.messageObject.message)
      /** @type {QuestionBase#messageHandler} */
      const fn = db[msgContainer.messageObject.originalQuestionId || msgContainer.messageObject.questionId]
      if (!fn && msgContainer.stream) throw new HttpError(404, 'invalid questionId', msgContainer.stream)
      /**
       * Wraps `MessageObject` with helpers: `doneWithObject` and `stream`.  `doneWithObject`
       * enables user to ensure that messages are processed in order received.
       *
       * @typedef {Object} ReceivedMessageContainer
       * @public
       * @property {MessageObject} messageObject
       * @property {function} doneWithObject - called to indicate user is done with MessageObject and to pull the next MessageObject
       * @property {EnhancedStream} [stream] - the stream of the MessageObject
       */
      /** @type {ReceivedMessageContainer} */
      const message = {
        messageObject: msgContainer.messageObject,
        doneWithObject: () => {
          delete message.doneWithObject
          msgContainer.nextObject(nextMsgHandler)
        },
      }
      if (msgContainer.stream) message.stream = msgContainer.stream
      fn(message)
    } else {
      // end of stream and conversation
    }
  }
  return nextMsgHandler
}

export default messageRouter
