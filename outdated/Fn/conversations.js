const conversations = {}

const say = (stream) => (header) => {
  const sideEffect = stream.respond(header)
  return (json) => stream.send(JSON.stringify(json))
}

const end = (conversation) => (json) => {
  const result = conversation.say(json)
  if (!result)
    return false

  const endResult = conversation.stream.end()
  delete conversation.conversations[conversation.id]
  return endResult
}

const dataHandler = (clientDataHandler) => (sayer, inStream) => (data) => clientDataHandler(data, sayer, inStream)

const listen = (sayer, stream, listeningDataHandler) => {
  stream.on('data', listeningDataHandler(sayer, stream))
}

const conversations = {}

const conversation = (helloStream, defaultHeaders, dataHandler) => {
  const obj = {
    id: createUid(),
    dataHandler,
    currentSayStream: helloStream,
    currentReadStream: helloStream,
    say: (json, header) => say(this.currentSayStream)(...defaultHeaders, ...header)(json),
    end: (json, header) => end(this.currentSayStream, say(this.currentSayStream)(...defaultHeaders, ...header))(json),
    _addReadStream: (readStream, headers) => {
      doneReading = false
      const currentReadStream = readStream
      readTillEnd(readStream).then(doneReading = true)
    },
  }
  conversations[obj.id] = obj
  return obj
}

const newStreamHandler = (stream, header) => {
  if (header.id)
    if (conversations[header.id]) conversations[header.id]._addReadStream(stream, header)
    else stream.respond({})
  else
    conversation(conversations, stream, header)
}
