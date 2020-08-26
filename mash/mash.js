import MashServer from '@trevthedev/mash'
import { SETTINGS } from '../src/other/globals.js'
import ServerNode from '../src/comms server/server node.js'

const mashServer = new MashServer()
const server = new ServerNode()

server.on('question', async (serverResponse) => {
  const { code } = serverResponse.json
  try {
    // eslint-disable-next-line no-new-func
    const mainFunction = Function('Server', 'u', 'Client', `return ${code}`)
    const out = await mainFunction(
      mashServer,
      (paths, otherMashServer) => mashServer.u(paths, otherMashServer),
      serverResponse,
    )

    serverResponse.reply({ output: out.toJSON ? out.toJSON() : out })
  } catch (e) {
    const msg = { ...e }
    if (e.stack) msg.stack = e.stack
    if (e.message) msg.message = e.message
    serverResponse.reply(msg, e.type || SETTINGS.errorType)
  }
})

server.once('done', async () => {
  await mashServer.close()
})

export default server
