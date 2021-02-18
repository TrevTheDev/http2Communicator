import ServerNode from '../src/server.js'
import { MSG_TYPES } from '../src/other/globals.js'

// describe('test comms server', () => {
//   before(() => {
//   })
//   it('u()', async () => {
//
//   })
// });

(async () => {
  const serverNode = await (new ServerNode(undefined, {
    serverHostName: '0.0.0.0',
    serverPort: 8443,
  }, (response) => {
    // debugger
    let conversationHandler

    const qHandler = (question) => {
      // debugger
      question.doneWithObject()
      conversationHandler(question)
      question.say({ ...question.questionJSON, count: question.questionJSON.count + 1 }, 'question received')
      question.on('answer question', (answer) => {
        // debugger
        answer.doneWithObject()
        question.reply({ ...answer.messageObject.body, count: answer.messageObject.body.count + 1 })
      })
    }

    conversationHandler = (client) => {
      client.on('echo', (echo) => {
        // debugger
        echo.doneWithObject()
        client.say({ ...echo.messageObject.body, count: echo.messageObject.body.count + 1 }, 'echoed')
      })
      client.on('ask question', async (msg) => {
        // debugger
        msg.doneWithObject()
        const newQuestion = client.ask({
          ...msg.messageObject.body,
          count: msg.messageObject.body.count + 1,
        })
        conversationHandler(newQuestion)
        const result = await newQuestion
        client.say({ ...result }, 'result received')
      })
      client.on('throw', (msg) => {
        // debugger
        msg.doneWithObject()
        throw new Error(msg.messageObject.body.error)
      })
      client.on('shutdown', (msg) => {
        // debugger
        msg.doneWithObject()
        serverNode.close()
      })
      client.on(MSG_TYPES.question, qHandler)
    }

    qHandler(response)
  }))

  // serverNode.on('question', async (serverResponse) => {
  //   console.log(`SERVER: LOG STEP 1: ${JSON.stringify(serverResponse.json)}`)
  //   // handles any messages sent by client of type 'message' to this serverResponse
  //   serverResponse.on('message', (msg) =>
  //   console.log(`SERVER: LOG STEP 4: ${JSON.stringify(msg)}`))
  //   // sends 'hello' JSON message to client's question
  //   serverResponse.say({ first: 'your', name: 'please', step: 2 }, 'hello')
  //   // asks a question of client's question
  //   const question = serverResponse.ask({
  //     do: 'you', like: 'your', name: ['yes', 'no'], step: 3,
  //   })
  //   // handles any messages sent by client of type 'message' to this question
  //   question.on('message', (msg) => {
  //     console.log(`SERVER: LOG STEP 5: ${JSON.stringify(msg)}`)
  //     question.say({ and: 'I', say: 'more', step: 6 }, 'more')
  //   })
  //   // waits for client to respond to question
  //   console.log(`SERVER: LOG STEP 7: ${JSON.stringify(await question)}`)
  //
  //   // establishes a new stream from client to comms server (opposite of Push Stream)
  //   // streams can also stream objects - known as Speaker
  //   const incomingStream = await serverResponse.createListener('uploadFile', 'raw')
  //   incomingStream.pipe(process.stdout)
  //
  //   // stream file to client - Push Stream
  //   // streams can also stream objects - known as Speaker
  //   const fileSpeaker = await serverResponse.createSpeaker('downloadFile', 'raw')
  //   fs.createReadStream('./package.json').pipe(fileSpeaker)
  //
  //   // after file has been streamed, reply to the original question
  //   fileSpeaker.on('finish', () => serverResponse.reply({ my: 'name', is: 'server' }))
  // })
  //
  // // gracefully shuts down the server
  // await serverNode.gracefulShutdown()
})()
