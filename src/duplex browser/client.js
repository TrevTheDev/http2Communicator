/* eslint-env browser */
import duplexStream from './client duplex stream.js'

const doit = async () => {
  const duplex = await duplexStream('https://192.168.1.70:7000/browserStreams')
  document.addEventListener('keypress', (ev) => {
    console.log(ev.key)
    duplex.write(ev.key)
  })

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
