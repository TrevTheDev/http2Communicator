/* eslint-disable arrow-body-style */
import { createUid } from '../other/shared functions.js'
import { MSG_TYPES } from '../other/globals.js'
import HttpError from './http error.js'

/**
 * a promise-like object that can listen to events and `await`ed
 * @namespace Question
 * @public
 * @property {Question#then} then - await promise
 * @property {Question#on} on - adds message types to listen for
 * @property {Question#ask} ask - ask a sub question
 * @property {Question#say} say - sends a message related to this question
 * @property {Question#answerOwnQuestion} answerOwnQuestion - answers this question
 * @property {Question#cancelQuestion} cancelQuestion - cancels question
 * @borrows QuestionBase#ask as Question#ask
 * @borrows QuestionBase#on as Question#on
 */

/**
 *
 * @typedef {Object} DispatchMessageContainer
 * @private
 * @property {MessageObject} messageObject
 * @property {Question#uid} messageObject.questionId
 * @property {Object} messageObject.body
 * @property {EnhancedStream} messageObject.stream
 * @property {Question#uid} [messageObject.originalQuestionId]
 */

/**
 * @callback Question.doneCb
 * @param {Object} [result] - returned
 */

/**
 * @alias Question.constructor
 * @private
 * @param {QuestionBase.constructor} baseConstructor
 * @returns {Question.newQuestion}
 */
const questionConstructor = (baseConstructor) => {
  /**
   * Asks a new question.  If `originalQuestionId` is provided then this question will
   * be a sub question.
   *
   * @private
   * @memberof Question.
   * @function newQuestion
   * @param {DispatchMessageContainer} newQ - object to send as json question
   * @param {Question.doneCb} doneCb - called when after question has been answered and is done
   * @param {Question#uid} [originalQuestionId] - if this question is a sub question
   * @returns {Question}
   */

  return (
    /* DispatchMessageContainer */ newQ,
    /* Question.doneCb */ doneCb,
    /* Question#uid */ originalQuestionId,
  ) => {
    /**
     * Question uid
     * @alias Question#uid
     * @typedef {string}
     */
    const questionId = createUid()

    newQ.messageObject.questionId = questionId
    if (originalQuestionId) newQ.messageObject.originalQuestionId = originalQuestionId
    // debugger
    /** @type {QuestionBase} */
    const base = baseConstructor(newQ)

    /** @type {Promise} */
    let promise

    /** @type {Question} */
    const qFace = {
      on: base.on,
      /**
       * @callback Question#answeredCb
       * @param {ReceivedMessageContainer} receivedMessage - response from ask.
       */

      /**
       * @callback Question#failedCb
       * @param {ReceivedMessageContainer|*} result - response from ask.
       */

      /**
       * @memberOf Question#
       * @param {Question#answeredCb} answeredCb - response from ask.
       * @param {Question#failedCb} failedCb - response from ask.
       */
      then: (answeredCb, failedCb = () => {}) => {
        if (!promise) {
          promise = new Promise((resolve, reject) => {
            /**
             * @callback Question#questionMsgHandler
             * @param {ReceivedMessageContainer} newMsgContainer
             * @private
             */
            base.db[questionId] = (/* ReceivedMessageContainer */ newMsgContainer) => {
              /** @type {boolean} */
              let handled = base.messageHandler(newMsgContainer)
              if (newMsgContainer.messageObject.type === MSG_TYPES.reply) {
                delete base.db[questionId]
                resolve(newMsgContainer)
                handled = true
              }
              if (!handled) throw new HttpError(400, `message of type '${newMsgContainer.messageObject.type}' not handled.`)
              if (newMsgContainer.doneWithObject) newMsgContainer.doneWithObject()
            }
            // debugger
            base.say(newQ.messageObject, MSG_TYPES.question)

            delete qFace.then
            Object.assign(qFace, /** @lends Question# */{
              /**
               * @param {Object} json
               * @param {string} type - MSG_TYPE
               */
              say: (json, type) => base.say({ body: json }, type),
              ask: base.ask,
              /**
               * @function
               * @param {Object} answerObject
               */
              answerOwnQuestion: resolve,
              /**
               * enables cancellation of a question.  Note nothing is sent
               * to the other party.  The other party will also have to #TODO cancel their
               * response handle completion gracefully.
               *
               * @function
               * @param {Object} error
               */
              cancelQuestion: reject,
            })
          })
        }
        promise.then(answeredCb, failedCb)
      },
    }
    return qFace
  }
}
export default questionConstructor
