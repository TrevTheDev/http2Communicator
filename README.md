# http2Communicator

JSON and stream messaging over HTTP2.

# How To Use

## Basic Usage

On the Client

```javascript
const response = await client.ask({ whatever: 'question or resource request' })
```

On the Server

```javascript
server.on('question', async (serverResponse)=>{
	serverResponse.reply({ response: 'what ever' })        
})
```

## More Advanced Example

### On The Server

```javascript
import ServerNode from ''

const server = new ServerNode()

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
```

### On the Client

```javascript
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
```

# API Reference

## ServerNode

The host of the http2 server.

Instantiation:

```javascript
const server = new ServerNode(http2Server, settings)
```

- `http2Server` \<http2Server\> optional http2Server - if one is not provide a new http2SecureServer instance is created based on settings.
- `settings` \<object\> settings:
  - serverPort: 8443,
  - serverHostName: '127.0.0.1',
  - serverAddress: 'https://localhost:8443'
  - http2ConnectionOptions: {
      rejectUnauthorized: false,
      enablePush: true,
    }
  - serverPath: '/http2Communicator'
  - listenerPath: '/http2Stream'
  - keyFile: './dev certificate/selfsigned.key'
  - certFile: './dev certificate/selfsigned.crt'
  - log: true

#### serverNode.listen(port, hostname)

starts server listening

- `port` \<number\> optional - see settings
- `hostname` \<string\> optional - see settings serverHostName

#### serverNode.gracefulShutdown()

- returns \<Promise\> Promise that gracefully closes all streams

## Question

Extends `Base`

Instantiation:

```javascript
const question = new Question(objectStream, json, response)
```

A Question is a request `json` that awaits a response `json`.  On `await` the Question is sent.

- `objectStream` \<ObjectStream\> objectStream to ask questions on
- `json` \<object\> question json
- `response` \<Response=\> if the Question is related to a particular `Response` - a "sub" question
- returns \<Question\> a promise that resolves to the the response json

#### Properties

- `id` \<string\> a Unique Identifier
- `response` \<Response\> Response object if any
- `speakers` \<Object[]\> Array of active `Speakers`
- `response` \<Response=\> if the Question is related to a particular `Response` - a "sub" question

#### Messages Handled

- `reply` on receipt this resolves the Question Promise.  It will throw if there are any open `Speakers`
- `cancelled` on receipt this rejects the Question Promise with `cancelled` message
- `question` emits a `question` event with a new `Response` object
- `listening` emits a `speakerType` event with a `Speaker `|`Stream` object

## ServerResponse

Extends `Response`

Instantiation:

```javascript
const serverResponse = new ServerResponse(objectStream, questionJSON)
```

A `ServerResponse` send a response `json`  based on the original `Question` . 

- `objectStream` \<ObjectStream\> objectStream to respond on
- `questionJSON` \<object\> question's json
- returns \<ServerResponse\>

#### Properties

- `speakers` \<Speaker[]\> array of connected `Speakers`|`Streams`
- `Listeners` \<Speaker[]\>  array of connected listening `Speakers`|`Streams`

### serverResponse.createSpeaker(speakerName, speakerType, optional)

Creates a new `Speaker`|`Stream` that the serverReponse can send either Objects on or anything else.

- `speakerName` \<string\> event that will be emitted on the client
- `speakerType` \<string='object'\> speaker will be a `Speaker` if 'object' or a `Stream` if 'raw'
- `optional` \<boolean=false\> if true then no promise is returned, rather returned `Speaker` will emit `speakerType` event on stream
- returns \<Promise->Speaker |Speaker \> a promise that resolves to a Speaker or a Speaker

### serverResponse.createListener(speakerName, speakerType)

Creates a new listening `Speaker`|`Stream` that the serverReponse can receive either Objects on or anything else.

- `speakerName` \<string\> event that will be emitted on the client
- `speakerType` \<string='object'\> speaker will be a `Speaker` if 'object' or a `Stream` if 'raw'
- returns \<Promise->Speaker |Promise->Stream\> a promise that resolves to a `Speaker` or a `Stream`

### serverResponse.reply(json, type)

Sends json response to this `Question` - serverResponse is ended.  Type can also be `cancelled` to reject the `Question`.  Throws if any `Questions`, `Speakers` or `Listeners` remain connected.

- `json` \<object\> json response to question
- `type` \<string='reply'\>

## Response

Extends `Base`

Instantiation:

```javascript
const response = new Response(objectStream, json)
```

A Response send a response `json`  based on the original `Question` . 

- `objectStream` \<ObjectStream\> objectStream to respond on
- `json` \<object\> question json
- returns \<Response\>

#### Properties

- `id` \<string\> the original question id
- `questions` \<Object[]\> Array of `Questions` asked by this `Response` awaiting answers

### response.reply(json, type)

Sends json response to this `Question` and resolves promise.  Type can also be `cancelled` to reject the `Question`.  Throws if any `questions` remain outstanding

- `json` \<object\> json response to question
- `type` \<string='reply'\>

### response.ask(json)

Asks a new `Question` related to this `Response`

- `json` \<object\> question to ask
- returns \<Question\> a Question promise that resolves after the response is received

## Base

Base class for `Question` and `Response`

#### Properties

- `id` \<string\> a unique identifier
- `objectStream` \<ObjectStream\> Object stream used for communications
- `json` \<Object\> Json that created this `Base`

#### Messages Handled

- any messages not handled by the children are `emit` as their message type

### base.say(json, type)

Sends a json object of type via the `ObjectStream`

## ObjectStream

An object stream converts a stream of bytes into a stream of JSON objects.  It emits a new event `object` for each object received

- `stream` \<stream.Readable|stream.Duplex\> stream to become object stream
- `eventTarget` \<eventTarget> optional target that will emit the `object`, `end`, `finish`, `closed` events

## Speaker

Instantiation via SpeakerResponse.createSpeaker and SpeakerResponse.createListener

Sends objects in one direction of an `ObjectStream`

### speaker.say(json)

sends `json` over `ObjectStream`

### speaker.end(json)

sends `json` over `ObjectStream` and ends `ObjectStream`

## 















