import functionBx from './function bx.js'
import { executeOnlyOnce } from './utils.js'

const getStreamWriter = functionBx({
  options: { returnExecFunctionOnly: true },
  /**
   * @param {ServerHttp2Stream} stream
   * @param {OutgoingHttpHeaders} headers
   */
  process: (stream, headers) => {
    const writeHeaders = executeOnlyOnce(() => stream.respond(headers))
    const write = (msg, type) => {
      writeHeaders()
      return type === 'JSON' ? stream.write(JSON.stringify(msg)) : stream.write(msg)
    }
    const writer = {
      write(msg, type = 'JSON') {
        write(msg, type)
        return writer
      },
      end(msg, type = 'JSON') {
        write(msg, type)
        return new Promise((resolve) => {
          stream.end(undefined, undefined, () => {
            stream.close(undefined, () => {
              resolve()
            })
          })
        })
      },
    }
    return writer
  },
})

const readSteamToEnd = async (readable) => {
  const data = []
  for await (const chunk of readable) {
    console.log(chunk)
    data.push(chunk.toString())
  }
  return data
}

const readStreamReducer = async (firstReadStream, dataHandler) => {
  const readStreams = { }
  let busyReading = false
  let killed = false
  let i = 0
  let currentReadStream
  const readNextStreamSequentially = async () => {
    if (readStreams[i] && !busyReading && !killed) {
      busyReading = true
      currentReadStream = readStreams[i]
      i += 1
      const data = await readSteamToEnd(currentReadStream)
      dataHandler(data)
      busyReading = false
      readNextStreamSequentially()
    }
  }
  const steamController = {
    async addReadStream(stream, index) {
      readStreams[index] = stream
      return await readNextStreamSequentially()
    },
    killReading() {
      killed = true
    },
  }
}

const spec = (result) => {
  console.log(result)
}
const pullSum = (specs) => {
  specs(specs.x + specs.y)
}

spec.x = 5
spec.y = 10

pullSum(spec)
