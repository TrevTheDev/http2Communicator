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
  constructor(url, fetchOptions = {}, duplexOptions = {}, doneCb) {
    super(duplexOptions)
    let idx = 0
    let reading = false
    let first = true
    let successCb
    let failureCb
    let pms
    const once = runFnsOnlyOnce()

    this.then = (success, failure) => {
      debugger
      if (!pms) {
        pms = new Promise((resolve, reject) => {
          debugger
          const doneFn = (fn) => once((...args) => {
            doneCb()
            fn(...args)
          })
          successCb = doneFn(resolve)
          failureCb = doneFn(reject);
          (async () => {
            try {
              const response = await fetch(url, { cache: 'no-store', ...fetchOptions })
              if (response.ok) {
                this.reader = response.body.getReader()
                this.id = response.headers.get('http2-duplex-id')
                successCb(this)
              } else
                failureCb(response)
            } catch (e) {
              debugger
              failureCb(e)
            }
          })()
        })
      }
      pms.then(success, failure)
    }

    this._read = () => {
      if (reading) return
      reading = true;
      (async () => {
        try {
          let value
          let done
          do {
            // eslint-disable-next-line no-await-in-loop
            ({ value, done } = await this.reader.read())
            if (done) this.push(null)
            else if (first) {
              // Sometimes fetch waits for first byte before resolving
              // so comms server-side sends initial dummy byte
              first = false
              done = !this.push(Buffer.from(value.subarray(1)))
            } else
              done = !this.push(Buffer.from(value))
          } while (!done)
        } catch (error) { failureCb(error) } finally { reading = false }
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
          if (!response.ok) throw new Error(JSON.stringify(response))
          await response.arrayBuffer()
          callback(null)
        } catch (error) { failureCb(error) }
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
        'http2-duplex-id': this.id,
        'http2-duplex-idx': idx,
        'Content-Type': 'application/octet-stream',
        ...options.headers,
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
const duplexStream = (url, fetchOptions = {}, duplexOptions = {}, doneCb) => new Promise((resolve, reject) => {
  (async () => {
    try {
      const response = await fetch(url, { ...fetchOptions, cache: 'no-store' })
      if (response.ok) {
        const reader = response.body.getReader()
        const id = response.headers.get('http2-duplex-id')

        const strm = new FetchDuplex(reader, id)

        resolve(strm)
      } else
        reject(response)
    } catch (e) {
      debugger
      resolve(e)
    }
  })()
})
// const x = new FetchDuplex(url, fetchOptions, duplexOptions, doneCb)

export default duplexStream
