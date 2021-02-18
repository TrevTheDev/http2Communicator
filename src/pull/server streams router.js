import Conversations from './conversation db.js'
import HttpError from './http error.js'
import EnhancedStream from './enhanced stream.js'
// import { SETTINGS } from '../other/globals.js'

/**
 * Provides a function: `incomingStreamHandler` that takes streams, translates them into
 * conversations, questions, answers, messages etc. and returns these via the supplied
 * `userQuestionHandler`
 *
 * @namespace ServerStreamsRouter
 * @public
 */

/**
 * injects userQuestionHandler to handle all messages and
 * returns a function than can process provided streams
 *
 * @memberOf ServerStreamsRouter#
 * @param {ServerNode#MessageHandlerCb} userQuestionHandler
 * @returns {ServerStreamsRouter#incomingStreamHandler}
 */
const serverStreamsRouter = (userQuestionHandler) => {
  /**
   * function that processes all provided streams, translating them into
   * conversations, questions, answers and messages.
   *
   * @memberOf ServerStreamsRouter#
   * @param {module:http2.ServerHttp2Stream} stream
   * @param {module:http2.IncomingHttpHeaders} headers
   */
  const incomingStreamHandler = (stream, headers) => /** @lends ServerStreamsRouter */ {
    /** @type {EnhancedStream} */
    const eStream = new EnhancedStream(stream, headers)
    /** @type {string} */
    const { method } = eStream
    /**
     * @typedef {function} ServerStreamsRouter.RouteFunction
     * @private
     */

    /** @type {RouteFunction} */
    const fn = [
      ['POST', () => Conversations.addStreamToConversation(eStream)],
      ['GET', () => Conversations.start(userQuestionHandler, eStream)],
      ['OPTIONS', () => eStream.respondEnd(200)],
      [undefined, () => { throw new HttpError(405, 'Method Not Allowed', eStream) }],
    ].find(([method_]) => (method_ === method || !method_))[1]

    try {
      fn()
    } catch (e) {
      debugger
      // if (e.name === 'HttpError') {
      //   e.respondError()
      //   if (eStream.respondError) eStream.respondError(e)
      // } else throw e
    }
  }
  return incomingStreamHandler
}

export default serverStreamsRouter
