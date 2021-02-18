/* eslint-disable max-len */
import HttpError from './http error.js'
import primeServerForStreams from './server conversation handler.js'
import { MSG_TYPES } from '../other/globals.js'

/**
 * api for server conversations and stream tracking db
 */

/**
 * database object that contains all conversations and streams
 *
 * @memberof Conversations#
 */
const db = {}

/**
 * @memberof Conversations#
 * @type {CoreConversationApi#serverConversationHandler}
 */
let serverConversationHandler

/**
 * conversation uid
 * @typedef {string} Conversations#uid
 */

/**
 *
 * @namespace
 * @property {Conversations.end} end - ends the conversation, closing all open streams
 * @property {Conversations.start} start - starts a new conversation
 * @property {Conversations.addStreamToConversation} addStreamToConversation - adds a stream to an existing conversation
 * @property {Conversations.getNextStreamInConversation} getNextStreamInConversation - processes the next stream in a conversation
 * @private
 */
const Conversations = {
  /**
   * callback after done
   * @callback Conversations.doneCb
   * @returns {void}
   */
  /**
   * `end`s and then `close`s all `streams` associated with a conversation `uid`
   *
   * @param {Conversations#uid} uid
   * @param {Conversations.doneCb} [done]
   */
  end: (uid, done) => {
    const exArr = ['idx', 'cb', 'error'/* , 'writeStream' */]
    const pms = Object.entries(db[uid])
      .filter(([key, stream]) => !exArr.includes(key) && stream.writable)
      .map(([, stream]) => new Promise((resolve) => stream.end(
        undefined,
        resolve,
      )))
    Promise.all(pms).then(() => {
      delete db[uid]
      if (done) done()
    })
  },

  /**
   * starts a new conversation and routes any questions to `userQuestionHandler`
   *
   * @param {ServerNode#MessageHandlerCb} userQuestionHandler
   * @param {EnhancedStream} eStream
   * @throws *
   */
  start: (userQuestionHandler, eStream) => {
    /** @type {Conversations#uid} */
    const uid = eStream.respondConversation(() => Conversations.end(uid))
    /**
     * Record of current state of Conversation, stored in db
     *
     * @interface Conversation
     * @private
     * @property {number} idx - last idx processed
     * @property {EnhancedStream} writeStream - writeStream of conversation
     * @property {ServerMessagePuller#nextStreamCallback|undefined} cb - push next stream
     * @property {conversation.errorCallback} error - function to handle any processing errors on a conversation
     * @property {Object.<number, EnhancedStream>} [number] - array of streams in queue to be processed
     */
    db[uid] = {
      idx: 0,
      writeStream: eStream,
      /**
       * callback if error has occurred in conversation.
       * callback is created in ConversationDb.start
       *
       * @callback conversation.errorCallback
       * @param {Object|HttpError} e
       */
      error: (e) => {
        debugger
        if (e.name === 'HttpError') {
          e.respondError()
          if (!eStream.responded) eStream.respondError(e)
          eStream.end()
        } else if (eStream.writable) {
          eStream.write({ type: MSG_TYPES.error, message: e.message })
          eStream.end()
        } else throw e
      },
    }
    serverConversationHandler(userQuestionHandler, eStream)
  },

  /**
   * if only stream in queue, then processes stream and adds one to expected idx
   * else adds it to the queue in idx order
   *
   * @param {EnhancedStream} eStream
   */
  addStreamToConversation: (eStream) => {
    const { uid } = eStream
    /** @type {Conversation} */
    const conversation = db[uid]
    // debugger
    if (!conversation) throw new HttpError(404, 'conversation not found', eStream)
    const streamIdx = eStream.idx
    if (conversation.idx > streamIdx) throw new HttpError(404, 'idx already handled', eStream)

    const { idx, cb, error } = conversation
    if (idx === streamIdx && cb) {
      conversation.idx += 1
      delete conversation.cb
      cb(error, eStream)
    } else {
      conversation[streamIdx] = eStream
      eStream.onClose(() => delete conversation[streamIdx])
    }
  },

  /**
   * places nextStreamCb in db to wait for the next stream, or if the stream is already
   * enqueue, makes the nextStreamCb
   *
   * @param {Conversations#uid} uid
   * @param {ServerMessagePuller#nextStreamCallback} nextStreamCb
   */
  getNextStreamInConversation: (uid, nextStreamCb) => {
    /** @type {Conversation} */
    const conversation = db[uid]
    if (!conversation) throw new Error('conversation not found')
    const { idx, cb, error } = conversation
    if (cb) throw new Error("can't have two callbacks at once!")
    const eStream = conversation[idx]
    if (eStream) {
      conversation.idx += 1
      delete conversation[idx]
      nextStreamCb(error, eStream)
    } else conversation.cb = nextStreamCb
  },
}

/**
 * injects next stream handler function into `server conversation handler.js`
 * to avoid circular dependencies
 * @ignore
 */
serverConversationHandler = primeServerForStreams(Conversations.getNextStreamInConversation)

export default Conversations
