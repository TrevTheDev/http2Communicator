/* eslint-env node, browser */
import Stream from 'stream-browserify'

const { Duplex } = Stream

const runFnsOnlyOnce = () => {
  let called = false
  // eslint-disable-next-line no-return-assign
  return (fn) => (...args) => called || ((called = true) && fn(...args))
}

// noinspection ExceptionCaughtLocallyJS
class FetchDuplex extends Duplex {
  /**
   * @param {String} url
   * @param {RequestInit} fetchOptions
   * @param {DuplexOptions} duplexOptions
   * @returns {Promise<FetchDuplex>}
   */
  constructor(url, reader, id, fetchOptions = {}, duplexOptions = {}, errorCb) {
    super(duplexOptions)
    let idx = 0
    let reading = false
    let first = true
    const once = runFnsOnlyOnce()
    const errorFn = once((...args) => {
      debugger
      errorCb(...args)
    })

    this._read = () => {
      if (reading) {
        // debugger
        return
      }
      reading = true;
      (async () => {
        try {
          let value
          let done
          do {
            // eslint-disable-next-line no-await-in-loop
            ({ value, done } = await reader.read())
            if (done) this.push(null)
            else if (first) {
              // Sometimes fetch waits for first byte before resolving
              // so comms server-side sends initial dummy byte
              first = false
              done = !this.push(Buffer.from(value.subarray(1)))
            } else
              done = !this.push(Buffer.from(value))
          } while (!done)
          reading = false
        } catch (error) { errorFn(error) }
      })()
    }

    /**
     * @param {any} chunk
     * @param {String} encoding
     * @param {Function} callback
     */
    this._write = (chunk, encoding, callback) => {
      (async () => {
        try {
          const response = await this._fetch({ body: Uint8Array.from(chunk) })
          if (!response.ok) errorFn(response)
          else {
            await response.arrayBuffer()
            callback(null)
          }
        } catch (error) { errorFn(error) }
      })()
    }

    /**
     * @param {RequestInit} additionalRequestInit
     * @returns {Promise<Response>}
     */

    this._fetch = (additionalRequestInit) => {
      const options = {
        method: 'POST',
        cache: 'no-store',
        headers: {},
        ...fetchOptions,
        ...additionalRequestInit,
      }
      options.headers = {
        'Content-Type': 'application/octet-stream',
        ...options.headers,
        'http2-duplex-id': id,
        'http2-duplex-idx': idx,
      }
      idx += 1
      return fetch(url, options)
    }

    this.on('end', () => {
      debugger
    })

    this.on('finish', () => {
      debugger
    })

    this.on('close', () => {
      debugger
    })
  }

  /**
   * @param {Function} callBack
   */
  // _final(callBack) {
  //   try {
  //     // if (this.writer) {
  //     //   await this.writer.ready
  //     //   await this.writer.close()
  //     // } else {
  //     // { headers: { 'http2-duplex-end': 'true' } }
  //     // const str = JSON.stringify({ type: 'done' })
  //     // let ascii = ''
  //     // for (let i = 3; i >= 0; i -= 1)
  //     //   // eslint-disable-next-line no-bitwise
  //     //   ascii += String.fromCharCode((str.length >> (8 * i)) & 255)
  //     // const send = ascii + str
  //     // const response = await this._fetch({ body: send })
  //     // if (!response.ok) throw new Error(JSON.stringify(response))
  //     //
  //     // await response.arrayBuffer()
  //     debugger
  //     callBack()
  //     // }
  //   } catch (error) {
  //     callBack(error)
  //   }
  // }
}

/**
 * @param {String} url
 * @param {RequestInit} fetchOptions
 * @param {DuplexOptions} duplexOptions
 * @returns {FetchDuplex}
 */
// eslint-disable-next-line max-len
const connectToServer = (url, fetchOptions = {}, duplexOptions = {}, errorCb) => new Promise((resolve, reject) => {
  (async () => {
    try {
      const response = await fetch(url, { ...fetchOptions, cache: 'no-store' })
      if (response.ok) {
        resolve(new FetchDuplex(
          url,
          response.body.getReader(),
          response.headers.get('http2-duplex-id'),
          fetchOptions,
          duplexOptions,
          errorCb,
        ))
      } else
        reject(response)
    } catch (e) {
      debugger
      reject(e)
    }
  })()
})

export default connectToServer
