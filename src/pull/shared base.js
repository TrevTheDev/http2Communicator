/* eslint-disable */
import { MSG_TYPES } from '../other/globals.js'
import questionConstructor from './question.js'
import answerConstructor from './answer.js'

/**
 * Provides shared base functionality for conversation interactions
 *
 * @namespace SharedBase
 * @private
 */

/**
 * @alias SharedBase.init
 * @param {MessageRouter#db} db - database of active conversations
 * @param {EnhancedStream} writeStream - main stream that data will be written too.
 * @returns {SharedBase#coreApi}
 */
const sharedBaseInit = (db, writeStream) => {
  /** @type {Question.newQuestion} */
  let newQuestion
  /** @type {Answer.answerQuestion} */
  let answerQuestion

  /**
   * @class QuestionBase
   * @private
   * @property {QuestionBase#ask} ask - asks a sub question
   * @property {QuestionBase#say} say - sends a message related to this question
   * @property {QuestionBase#on} on - listens for messages of a particular type
   * @property {QuestionBase#messageHandler} messageHandler
   * @property {QuestionBase#messageObject} messageObject
   * @property {QuestionBase#questions} questions - number of sub questions asked for which answers still have to be received
   * @property {QuestionBase#answers} answers - number of sub questions received, which still need to be answered to
   * @param {ReceivedMessageContainer|DispatchMessageContainer} msgContainer
   */

  /**
   * @alias QuestionBase.constructor
   * @private
   * @param {ReceivedMessageContainer|DispatchMessageContainer} msgContainer
   * @returns {QuestionBase}
   */
  const baseConstructor = (msgContainer) => {
    /** @type {Question#uid} */
    const { questionId } = msgContainer.messageObject
    /**
     * number of sub questions asked for which answers still
     * have to be received
     *
     * @type {number}
     */
    let questions = 0
    /**
     * number of sub questions received, which still need to be
     * answered to
     *
     * @type {number} */
    let answers = 0
    /**
     * @typedef {Object} QuestionBase#onEntry
     * @property {string} type - type of message to listen for
     * @property {function} fn - function handler for that type of message
     */
    /**
     * database of all listeners
     *
     * @type {QuestionBase#onEntry[]}
     */
    const msgListeners = []

    /**
     *
     *
     * @memberOf QuestionBase#
     * @param {Object} json
     * @param {MSG_TYPES} type=MSG_TYPES.message
     */
    const say = (
      json,
      type = MSG_TYPES.message
    ) => writeStream.write({...json, type, questionId})

    /**
     * asks a sub question
     *
     * @memberOf QuestionBase#
     * @param {Object} json
     * @returns {Question}
     */
    const ask = (json) => {
      questions += 1
      return newQuestion(
        { messageObject: { body: { ...json } }, stream: msgContainer.stream },
        () => { questions -= 1 },
        questionId,
      )
    }

    /**
     * @memberof QuestionBase#
     * @param {string} type - type of message to listen for - an undefined type is a catch all for all types
     * @param {function} fn - function handler for that type of message
     */
    const on = (type, fn) => msgListeners.push({ type, fn })

    return /** @lends QuestionBase# */ {
      /** @type {MessageRouter#db} */
      get db() { return db },
      /** @type {number} */
      get questions() { return questions },
      /** @type {number} */
      get answers() { return answers },
      /** @type {MessageObject} */
      get messageObject() { return msgContainer.messageObject },
      say,
      ask,
      on,
      /**
       * @param {ReceivedMessageContainer} newMsgContainer
       * @returns {boolean} whether the message was handled or not
       */
      messageHandler: (newMsgContainer) => {
        /** @type {MSG_TYPES} */
        const t = newMsgContainer.messageObject.type
        /** @type {QuestionBase#onEntry} */
        /** @type {Array<QuestionBase#onEntry>} */
        const fns = msgListeners.filter(({ type }) => type === t || type === undefined)
        if(fns.length===0) return false
        let startMsg = newMsgContainer
        if (t === MSG_TYPES.question) {
          answers += 1
          startMsg = answerQuestion(newMsgContainer, () => { answers -= 1 })
        }
        fns.reduce((newMsg,{fn})=>{
          const result = fn(...newMsg)
          return [result ? result : newMsg,startMsg]
        },[startMsg,startMsg])
        return true
        // if (!nodeFn) throw new HttpError(400, `object of type '${t}' not handled.  Only types handled are '${msgListeners.map(({ type }) => type).toString()}'`)
        // // debugger
        // if (t === MSG_TYPES.question) {
        //   answers += 1
        //   nodeFn.fn(answerQuestion(newMsgContainer, () => { answers -= 1 }))
        // } else nodeFn.fn(newMsgContainer)
      },
    }
  }

  newQuestion = questionConstructor(baseConstructor)
  answerQuestion = answerConstructor(baseConstructor)
  /**
   * @typedef {object} SharedBase#coreApi
   * @property {Question.newQuestion} newQuestion - method to ask questions
   * @property {Answer.answerQuestion} answerQuestion - method to answer question
   */
  return { newQuestion, answerQuestion }
}

export default sharedBaseInit
