import Question from './question.js'
import Base from './base.js'
import { SETTINGS } from '../other/globals.js'

export default class Response extends Base {
  /**
   * @param {ObjectStream} objectStream
   * @param {Object} json
   * @param {String} json.questionId
   * @returns {Response}
   */
  constructor(objectStream, json) {
    super(objectStream, json)
    this.id = json.questionId
    this.questions = {}
    this.objectStream.promiseDb[this.id] = this
  }

  /**
   * @param {Object} json - response to send
   * @param {String} type = SETTINGS.replyType
   */
  reply(json, type = SETTINGS.replyType) {
    if (Object.values(this.questions).length > 0) throw new Error('not all questions resolved')
    delete this.objectStream.promiseDb[this.id]
    this.say(json, type)
  }

  /**
   * @param {Object} json - question to ask
   * @returns {Question}
   */
  ask(json) {
    return new Question(this.objectStream, json, this)
  }
}
