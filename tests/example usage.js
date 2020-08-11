import fs from 'fs'
import ServerNode from '../src/server/server node.js'
import ClientNode from '../src/ui/client node.js'

const server = new ServerNode(undefined, { log: 'yes' })

server.on('question', async (serverResponse) => {
  console.log(`LOG STEP 1: ${JSON.stringify(serverResponse.json)}`)
  // handles any messages sent by client of type 'message' to this serverResponse
  serverResponse.on('message', (msg) => console.log(`LOG STEP 4: ${JSON.stringify(msg)}`))
  // sends 'hello' JSON message to client's question
  serverResponse.say({ first: 'your', name: 'please', step: 2 }, 'hello')
  // asks a question of client's question
  const question = serverResponse.ask({
    do: 'you', like: 'your', name: ['yes', 'no'], step: 3,
  })
  // handles any messages sent by client of type 'message' to this question
  question.on('message', (msg) => {
    console.log(`LOG STEP 5: ${JSON.stringify(msg)}`)
    question.say({ and: 'I', say: 'more', step: 6 }, 'more')
  })
  // waits for client to respond to question
  console.log(`LOG STEP 7: ${JSON.stringify(await question)}`)

  // establishes a new stream from client to server (opposite of Push Stream)
  // streams can also stream objects - known as Speaker
  const incomingStream = await serverResponse.createListener('uploadFile', 'raw')
  incomingStream.pipe(process.stdout)

  // stream file to client - Push Stream
  // streams can also stream objects - known as Speaker
  const fileSpeaker = await serverResponse.createSpeaker('downloadFile', 'raw')
  fs.createReadStream('package.json').pipe(fileSpeaker)

  // after file has been streamed, reply to the original question
  fileSpeaker.on('finish', () => serverResponse.reply({ my: 'name', is: 'server' }))
})

server.listen()

const client = new ClientNode()

// ask for something from the server (question)
const question = client.ask({ what: 'is', your: 'name', step: 1 })

// handles any messages sent by server of type 'hello' to this question
question.on('hello', (msg) => {
  console.log(`LOG STEP 2: ${JSON.stringify(msg)}`)
  // sends message to server of type 'message' to this question
  question.say({ i: 'say', stuff: true, step: 4 })
})

// handles any questions from the  server to this question
// Response object is provided
question.on('question', (response) => {
  console.log(`LOG STEP 3: ${JSON.stringify(response.json)}`)
  // handles any messages sent by server of type 'more' to this response
  response.on('more', (msg) => {
    console.log(`LOG STEP 6: ${JSON.stringify(msg)}`)
    // reply to servers question
    response.reply({
      answer: 'yes', i: 'like', my: 'name', step: 7,
    })
  })
  // sends message to server of type 'message' to this response
  response.say({ i: 'also', say: 'stuff', step: 5 })
})

// stream established by server.createListener
question.on('uploadFile', (stream) => {
  fs.createReadStream('package.json').pipe(stream)
})

// stream established by server.createSpeaker
question.on('downloadFile', (stream) => {
  stream.pipe(process.stdout)
});

(async () => {
  // await response to question
  const response = await question
  console.log(`LOG STEP 1 ANSWER: ${JSON.stringify(response)}`)
})()
