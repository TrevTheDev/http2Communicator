import { createUid } from '../src/other/shared functions.js'
import { SETTINGS } from '../src/other/globals.js'
import HttpError from '../src/pull/http error.js'
import tracker from './tracker.js'
import { objectLoopMachine } from '../src/pull/server get object from streams.js'

const createResponseJSON = (questionJSON, writeStream) => {
  let questionCnt = 0
  const { questionId } = questionJSON
  const say = (json, type = SETTINGS.replyType) => writeStream.write({ ...json, type, questionId })
  const askQuestion = (json, answerCallback) => {
    questionCnt += 1
    const newQuestionId = createUid()
    const newQuestionJSON = {
      ...json,
      type: SETTINGS.questionType,
      originalQuestionId: questionId,
      questionId: newQuestionId,
    }

    let cancelCb

    const cancelCallback = () => {
      writeStream.removeListener('close', cancelCb)
      questionCnt -= 1
      cancelCb()
    }

    const fulfillmentCb = (cbObject, cbWriteStream, cbStream, cbDoneCb) => {
      writeStream.removeListener('close', cancelCb)
      questionCnt -= 1
      answerCallback(cbObject, cbWriteStream, cbStream, cbDoneCb)
    }

    cancelCb = tracker.waitForFulfillment(newQuestionId, fulfillmentCb)
    writeStream.once('close', cancelCb)
    writeStream.write(newQuestionJSON)
    return cancelCallback
  }
  // const specialWriter = getSayer(tmpStream)
  // const createSpeaker = createSpeaker()
  // const createListener = createListener()
  const end = (data) => {
    // if (speakers.size > 0) throw new HttpError(400, 'response still has open speakers')
    // if (listeners.size > 0) throw new HttpError(400, 'response still has open listeners')
    if (questionCnt > 0) throw new HttpError(400, 'response still has outstanding questions')
    return new Promise((resolve) => writeStream.end(
      data,
      undefined,
      () => writeStream.close(undefined, resolve),
    ))
  }
  const reply = (json, type = SETTINGS.replyType) => end(JSON.stringify({ ...json, type, questionId }))

  questionJSON.code((questionJSON,
    reply,
    say,
    ask,
    specialWriter,
    createSpeaker,
    createListener,
    end) => {
  })
}

const getFormattedJSON = (object, stream) => {
  createResponseJSON(() => {
    // end
  })
}

const sendResponseJSON = (object, stream) => {
  getFormattedJSON(() => {
    // end
  })
}

const endConversation = (object, stream) => {
  sendResponseJSON(() => {
    // end
  })
}

const objectRouter = (writeStream, conversationDoneCb) => {
  const router = (object, stream) => {
    console.log(JSON.stringify(object))
    const { type } = object
    const fn = ([
      [SETTINGS.replyType, createResponseJSON],
      [SETTINGS.cancelledType, questionCancelled],
      [SETTINGS.questionType, newQuestion],
    ].find(([objectType]) => (objectType === type)) || [undefined, unknownObject])[1]

    try {
      debugger
      fn(object, stream)
    } catch (e) {
      if (writeStream.respondError) writeStream.respondError(e)
      else writeStream.end(e.toString(), 'TEXT')
    }
  }
  return objectLoopMachine(router, () => {
    (async () => {
      await writeStream.end()
      conversationDoneCb()
    })()
  })
}

export default objectRouter
