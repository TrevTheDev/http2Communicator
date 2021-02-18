import fs from 'fs'
import ServerNode from '../src/server.js'
import NodeClient from '../src/node client.js'

/*
for brevity sake this example contains both server and client code - usually
these would be on two different machines and two different source files.
 */

const clientCode = async () => {
  // client code ***********************************************************************
  const client = new NodeClient()

  // ask for something from the comms server (question)
  const question = client.ask({ what: 'is', your: 'name', step: 1 })

  // handles any messages sent by comms server of type 'hello' to this question
  question.on('hello', (msg) => {
    console.log(`CLIENT: LOG STEP 2: ${JSON.stringify(msg)}`)
    // sends message to comms server of type 'message' to this question
    question.say({ i: 'say', stuff: true, step: 4 })
  })

  // handles any questions from the  comms server to this question
  // Response object is provided
  question.on('question', (response) => {
    console.log(`CLIENT: LOG STEP 3: ${JSON.stringify(response.json)}`)
    // handles any messages sent by comms server of type 'more' to this response
    response.on('more', (msg) => {
      console.log(`CLIENT: LOG STEP 6: ${JSON.stringify(msg)}`)
      // reply to servers question
      response.reply({
        answer: 'yes', i: 'like', my: 'name', step: 7,
      })
    })
    // sends message to comms server of type 'message' to this response
    response.say({ i: 'also', say: 'stuff', step: 5 })
  })

  // stream established by comms server.createListener
  question.on('uploadFile', (stream) => {
    fs.createReadStream('./package.json').pipe(stream)
  })

  // stream established by comms server.createSpeaker
  question.on('downloadFile', (stream) => {
    stream.pipe(process.stdout)
  })

  // await response to question
  const response = await question
  console.log(`CLIENT: LOG STEP 1 ANSWER: ${JSON.stringify(response)}`)

  // gracefully ends comms with the server
  await client.end()
}

(async () => {
  // server code ***********************************************************************
  // start up the server
  const server = await (new ServerNode(undefined, { log: 'verbose' }))

  // the server waits for and responds to `question` objects

  server.on('question', async (serverResponse) => {
    console.log(`SERVER: LOG STEP 1: ${JSON.stringify(serverResponse.json)}`)
    // handles any messages sent by client of type 'message' to this serverResponse
    serverResponse.on('message', (msg) => console.log(`SERVER: LOG STEP 4: ${JSON.stringify(msg)}`))
    // sends 'hello' JSON message to client's question
    serverResponse.say({ first: 'your', name: 'please', step: 2 }, 'hello')
    // asks a question of client's question
    const question = serverResponse.ask({
      do: 'you', like: 'your', name: ['yes', 'no'], step: 3,
    })
    // handles any messages sent by client of type 'message' to this question
    question.on('message', (msg) => {
      console.log(`SERVER: LOG STEP 5: ${JSON.stringify(msg)}`)
      question.say({ and: 'I', say: 'more', step: 6 }, 'more')
    })
    // waits for client to respond to question
    console.log(`SERVER: LOG STEP 7: ${JSON.stringify(await question)}`)

    // establishes a new stream from client to comms server (opposite of Push Stream)
    // streams can also stream objects - known as Speaker
    const incomingStream = await serverResponse.createListener('uploadFile', 'raw')
    incomingStream.pipe(process.stdout)

    // stream file to client - Push Stream
    // streams can also stream objects - known as Speaker
    const fileSpeaker = await serverResponse.createSpeaker('downloadFile', 'raw')
    fs.createReadStream('./package.json').pipe(fileSpeaker)

    // after file has been streamed, reply to the original question
    fileSpeaker.on('finish', () => serverResponse.reply({ my: 'name', is: 'server' }))
  })

  // the server would not normally initiated the client instance - but does here
  // only so that this example can run from a single file.
  await clientCode()

  // gracefully shuts down the server
  await server.gracefulShutdown()
})()
