/* eslint-env browser */
import duplexStream from './client duplex stream.js'

const doit = async () => {
  const duplex = await duplexStream('https://localhost:7000/example')

  document.addEventListener('keypress', (ev) => duplex.write(ev.key))

  duplex.on('readable', () => {
    let buf
    do {
      buf = duplex.read()
      if (buf !== null)
        document.body.appendChild(document.createTextNode(buf.toString()))
    } while (buf !== null)
  })
}

window.doit = doit
