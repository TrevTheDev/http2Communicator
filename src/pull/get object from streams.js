/* eslint-disable no-bitwise,no-restricted-syntax,max-len */

/**
 * pulls stream, converts it to data, converts it to object(s) and sends this via the
 * MessagePuller#NextMessageCb
 *
 * function to pulls streams and convert those to data is injected before
 * use enabling this to be used by servers and browsers.
 *
 * @namespace MessagePuller
 * @private
 */

/**
 * number of bytes prefixed to every JSON object
 * containing JSON object's length
 *
 * @memberof MessagePuller
 * @type {number}
 */
const NUMBER_OF_BYTES = 4

/**
 * @memberof MessagePuller
 * @param {string} numString - bytes in a string format
 * @returns {number} - integer from string bytes
 */
const fromBytesInt32 = (numString) => {
  let result = 0
  for (let i = NUMBER_OF_BYTES - 1; i >= 0; i -= 1)
    result += numString.charCodeAt(NUMBER_OF_BYTES - 1 - i) << (8 * i)
  return result
}

/**
 * returns a function that is used to pull the first object
 *
 * @callback MessagePuller#getFirstMsgFn
 * @param {MessagePuller#NextMessageCb} firstObjectCb
 * @param {Conversations#uid} [uid] - conversation uid
 */

/**
 * saves the getMoreDataFn and then returns a function that is used to pull the first object
 *
 * @memberof MessagePuller#
 * @param {ServerMessagePuller#serverGetMoreData|BrowserMessagePuller#browserGetMoreData} getMoreDataFn
 * @returns {MessagePuller#getFirstMsgFn}
 */
const getFirstMessage = (getMoreDataFn) => /** @type MessagePuller#getFirstMsgFn */ (/* MessagePuller#NextMessageCb */ firstObjectCb, /* Conversations#uid|undefined */ uid) => {
  /** @type {string} */
  let data = ''

  /**
   * json message received
   *
   * @typedef {Object} MessageObject
   * @public
   * @property {Question#uid} questionId
   * @property {MSG_TYPES} type
   * @property {Question#uid} [originalQuestionId]
   * @property {string} [message] - error message
   * @property {Object} body - json object sent
   */

  /** @type {MessageObject|undefined} */
  let object
  /**
   * @function
   * @param {MessagePuller#NextMessageCb} objectCb
   */
  let extractOneObject
  /** @type {EnhancedStream} */
  let stream
  // console.log(getMoreDataFn)

  /**
   * extracts first object from a data string
   */
  const translateDataToObject = () => {
    if (data.length > NUMBER_OF_BYTES) {
      const length = fromBytesInt32(data.substring(0, NUMBER_OF_BYTES))
      if (length <= data.length - NUMBER_OF_BYTES) {
        object = JSON.parse(data.slice(NUMBER_OF_BYTES, length + NUMBER_OF_BYTES))
        data = data.slice(length + NUMBER_OF_BYTES)
      }
    }
  }
  /**
   * Function to send MessagePuller to after it has
   * message has been received.  undefined is sent if
   * no more messages will be sent - i.e. end of conversation
   * via HTTP header 'http2-duplex-end'
   *
   * @callback MessagePuller#NextMessageCb
   * @param {(MessagePuller|undefined)} result
   */

  /**
   *
   * @param {MessagePuller#NextMessageCb} cb
   */
  const handleObject = (cb) => {
    /**
     * Wrapper that contains the MessageObject, and a function to pull
     * the next MessageObject.  It may optionally include the stream of the MessageObject.
     *
     * @interface
     * @alias PullerMessageContainer
     * @private
     * @property {PullerMessageContainer#messageObject} messageObject
     * @property {PullerMessageContainer#nextObject} nextObject
     * @property {EnhancedStream} [stream] the stream that the message was on
     */
    const pullerMessageContainer = {
      /**
       * @instance
       * @type {MessageObject}
       */
      messageObject: object,
      /**
       * @instance
       * @param {MessagePuller#NextMessageCb} nextObjectCb
       */
      nextObject: (nextObjectCb) => {
        delete pullerMessageContainer.nextObject
        object = undefined
        extractOneObject(nextObjectCb)
      },
    }
    if (stream) pullerMessageContainer.stream = stream
    cb(pullerMessageContainer)
  }

  /**
   *
   * @param {MessagePuller#NextMessageCb} cb - callback before calling stream.end
   */
  const handleEndOfStreams = (cb) => {
    cb(undefined)
    stream.end()
  }

  /**
   * waits for and processes the next stream.  Once the data is received
   * it extracts one object from it.
   *
   * @param {MessagePuller#NextMessageCb} cb
   */
  const processNextStream = (cb) => {
    if (stream) stream.respondEnd()

    /**
     * @memberOf MessagePuller#
     * @callback
     * @param {string} newData - new data that must be added for processing
     * @param {EnhancedStream} [newStream] - stream the data was on
     */
    const newDataCb = (newData, newStream) => {
      stream = newStream
      data += newData
      extractOneObject(cb)
    }
    getMoreDataFn(newDataCb, uid)
  }

  extractOneObject = (/* MessagePuller#NextMessageCb */ objectCb) => {
    translateDataToObject()
    if (object) handleObject(objectCb)
    else if (stream && stream.endRequested) handleEndOfStreams(objectCb)
    else processNextStream(objectCb)
  }

  extractOneObject(firstObjectCb)
}

export default getFirstMessage
