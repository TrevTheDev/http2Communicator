/* eslint-disable */
import HttpError from './http error.js'
import { MSG_TYPES } from '../other/globals.js'


/**
 * @namespace Answer
 * @property {Answer#questionJSON} questionJSON - the question received
 * @property {Answer#reply} reply - answers the question
 * @property {Answer#on} on - adds message types to listen for
 * @property {Answer#ask} ask - asks a question related to this answer
 * @property {Answer#say} say - sends a message related to this answer
 * @property {Answer#doneWithObject} doneWithObject - questionJSON and stream no longer required. NextObject should be pulled.
 * @borrows QuestionBase#ask as Answer#ask
 * @borrows QuestionBase#on as Answer#on
 */

/**
 * @private
 * @memberOf Answer.
 * @param {QuestionBase.constructor} baseConstructor
 * @returns {Answer.answerQuestion}
 */
const answerConstructor = (baseConstructor) => {
  /**
   * callback after reply has been made
   * @private
   * @callback Answer#doneWithQuestionCb
   */

  /**
   * Responds to an asked question.  Once answer is sent, question is considered done.
   *
   * @private
   * @function Answer.answerQuestion
   * @param {ReceivedMessageContainer} receivedMsgContainer - a simple receivedMsgContainer that will be converted to JSON and sent as the answer to the question
   * @param {Answer#doneWithQuestionCb} doneWithQuestionCb - callback after reply has been made
   * @returns {Answer}
   */
  return (receivedMsgContainer, doneWithQuestionCb) => {
    /** @type {QuestionBase} */
    const base = baseConstructor(receivedMsgContainer)

    /** @type {Answer} */
    let rFace

    /**
     *
     * @param {Object} json
     */
    const reply = (json) => {
      if (base.questions > 0) throw new HttpError(400, 'answer still has outstanding questions', receivedMsgContainer.stream)
      if (base.answers > 0) throw new HttpError(400, 'answer still has outstanding answers', receivedMsgContainer.stream)
      base.say({ body: json }, MSG_TYPES.reply)
      Object.keys(rFace).forEach((key) => delete rFace[key])
      delete base.db[receivedMsgContainer.messageObject.questionId]
      doneWithQuestionCb()
    }

    base.db[receivedMsgContainer.messageObject.questionId] = (newMsgContainer) => {
      let handled = base.messageHandler(newMsgContainer)
      if (!handled) throw new HttpError(400, `message of type '${newMsgContainer.messageObject.type}' not handled.`)
      if (newMsgContainer.doneWithObject) newMsgContainer.doneWithObject()
    }

    /** @lends Answer# */
    rFace = {
      /**
       * the question received
       *
       * @type {Object}
       */
      questionJSON: receivedMsgContainer.messageObject.body,
      /**
       * @param {Object} json
       * @param {string} type - MSG_TYPE
       */
      say: (json, type) => base.say({ body: json }, type),
      ask: base.ask,
      on: base.on,
      /**
       * questionJSON and stream no longer required.  NextObject should be pulled.
       */
      doneWithObject: () => {
        delete rFace.doneWithObject
        receivedMsgContainer.doneWithObject()
      },
      /**
       * send Object as reply to question.
       *
       * @function
       * @param {Object} json
       */
      reply,
    }
    return rFace
  }
}

export default answerConstructor
