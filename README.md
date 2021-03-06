# http2Communicator

JSON and stream messaging over HTTP2.

# How To Use

## Installation

```shell
npm install @trevthedev/http2communicator
```

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
import ServerNode from '@trevthedev/http2communicator'

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

  // establishes a new stream from client to comms server (opposite of Push Stream)
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
import NodeClient from '@trevthedev/http2communicator/client'

const client = new NodeClient()

// ask for something from the comms server (question)
const question = client.ask({ what: 'is', your: 'name', step: 1 })

// handles any messages sent by comms server of type 'hello' to this question
question.on('hello', (msg) => {
  console.log(`LOG STEP 2: ${JSON.stringify(msg)}`)
    
  // sends message to comms server of type 'message' to this question
  question.say({ i: 'say', stuff: true, step: 4 })
})

// handles any questions from the  comms server to this question
// Response object is provided
question.on('question', (response) => {
  console.log(`LOG STEP 3: ${JSON.stringify(response.json)}`)
    
  // handles any messages sent by comms server of type 'more' to this response
  response.on('more', (msg) => {
    console.log(`LOG STEP 6: ${JSON.stringify(msg)}`)
      
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
  fs.createReadStream('package.json').pipe(stream)
})

// stream established by comms server.createSpeaker
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
import ServerNode from '@TrevTheDev/http2Communicator'

const server = new ServerNode(http2Server, settings)
```

- `http2Server` \<http2Server\> optional http2Server - if one is not provide a new http2SecureServer instance is created based on settings.
- `settings` \<object\> settings:
  - serverPort: 8443,
  - serverHostName: '127.0.0.1',
  - serverPath: '/http2Communicator'
  - listenerPath: '/http2Stream'
  - keyFile: './dev certificate/selfsigned.key'
  - certFile: './dev certificate/selfsigned.crt'
  - certArgs: '/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com'
  - log: true

#### serverNode.listen(port, hostname)

starts server listening

- `port` \<number\> optional - see settings
- `hostname` \<string\> optional - see settings serverHostName

#### serverNode.gracefulShutdown()

- returns \<Promise\> Promise that gracefully closes all streams

## NodeClient

A client the connects to a ServerNode.

Instantiation:

```javascript
import NodeClient from '@TrevTheDev/http2Communicator/client'

const client = new NodeClient(settings)
```

- `settings` \<object\> settings:
  - serverAddress: 'https://localhost:8443'
  - http2ConnectionOptions: {
    rejectUnauthorized: false,
    enablePush: true,
    }
  - serverPath: '/http2Communicator'
  - listenerPath: '/http2Stream'
  - log: true

#### clientNode.ask(json)

Asks a new `Question` of the `ServerNode`

- `json` \<object\> question to ask
- returns \<Question\> a `Question` promise that resolves after the response is received

#### clientNode.end()

- returns \<Promise\> Promise that gracefully closes all streams

## Question

Extends `EventEmitter`

Instantiation:

```javascript
clientNode.ask(Json)

serverResponse.ask(Json)
```

A Question is a request `json` Promise that awaits a response `json`.  On `await` the Question is sent.

- returns \<Question\> a promise that resolves to the the response json

#### Properties

- `id` \<string\> a Unique Identifier
- `objectStream` \<ObjectStream\> ObjectStream used for communications
- `json` \<Object\> Json of question
- `response` \<Response\> Response object if any
- `speakers` \<Object[]\> Array of active `Speakers`
- `response` \<Response=\> if the Question is related to a particular `Response` - a "sub" question

#### Messages Handled

- `reply` on receipt this resolves the Question Promise.  It will throw if there are any open `Speakers`
- `cancelled` on receipt this rejects the Question Promise with `cancelled` message.  It will throw if there are any open `Speakers`
- `question` emits a `question` event with a new `Response` object
- `listening` emits a `speakerType` event with a `Speaker `|`Stream` object
- any messages not of the above type are `emit`ed as their message type

### question.say(json, type)

Sends a json object of type via the `ObjectStream`.  Say will only work after `question` has been sent to `server` via `await`.

## ServerResponse

Extends `Response`

Instantiation:

```javascript
serverNode.on('question', (serverResponse) => {
    
})

```

#### Properties

- `speakers` \<Speaker[]\> array of connected `Speakers`|`Streams`
- `Listeners` \<Speaker[]\>  array of connected listening `Speakers`|`Streams`

### serverResponse.createSpeaker(speakerName, speakerType, optional)

Creates a new `Speaker`|`Stream` that the `serverReponse` can send either Objects on or anything else.

- `speakerName` \<string\> event that will be emitted on the client
- `speakerType` \<string='object'\> speaker will be a `Speaker` if 'object' or a `Stream` if 'raw'
- `optional` \<boolean=false\> if true then no promise is returned, rather returned `Speaker` will emit `speakerType` event on stream
- returns \<Promise-\>Speaker |Speaker \> a promise that resolves to a Speaker or a Speaker

### serverResponse.createListener(speakerName, speakerType)

Creates a new listening `Speaker`|`Stream` that the `serverReponse` can receive either Objects on or anything else.

- `speakerName` \<string\> event that will be emitted on the client
- `speakerType` \<string='object'\> speaker will be a `Speaker` if 'object' or a `Stream` if 'raw'
- returns \<Promise->Speaker |Promise->Stream\> a promise that resolves to a `Speaker` or a `Stream`

## Response

Extends `EventEmitter`

Instantiation:

```javascript
question.on('question', (response) => {
    
})

```

#### Properties

- `id` \<string\> a unique identifier
- `objectStream` \<ObjectStream\> ObjectStream used for communications
- `json` \<Object\> Json of received `Question`
- `questions` \<Object[]\> Array of `Questions` asked by this `Response` awaiting answers

#### Messages Handling

- any messages received are `emit`ed as their message type

### response.reply(json, type)

Sends json response to this `Question` and resolves promise.  Type can also be `cancelled` to reject the `Question`.  Throws if any `Questions`, `Speakers` or `Listeners` remain connected.

- `json` \<object\> json response to question
- `type` \<string='reply'\>

Only one `reply` should be sent.

### response.ask(json)

Asks a new `Question` related to this `Response`

- `json` \<object\> `question` to ask
- returns \<Question\> a `Question` promise that resolves after the response is received

### response.say(json, type)

Sends a json object of type via the `ObjectStream`

## ObjectStream

An object stream converts a stream of bytes into a stream of JSON objects.  It emits a new event `object` for each object received

- `stream` \<stream.Readable|stream.Duplex\> stream to become object stream
- `eventTarget` \<eventTarget> optional target that will emit the `object`, `end`, `finish`, `closed` events

## Speaker

Instantiation via `serverResponse.createSpeaker` and `serverResponse.createListener`

Sends JSON objects in one direction using an `ObjectStream`

### speaker.say(json)

sends `json` over `ObjectStream`

### speaker.end(json)

sends `json` over `ObjectStream` and ends `ObjectStream`