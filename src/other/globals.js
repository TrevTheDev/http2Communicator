/**
 * @category Misc
 * @property {SETTINGS.serverPort} serverPort=8443
 * @property {SETTINGS.serverHostName} serverHostName='127.0.0.1'
 * @property {SETTINGS.serverAddress} serverAddress='https://192.168.1.70:8443'
 * @property {SETTINGS.serverAddress2} serverAddress2='https://localhost:8443'
 * @property {SETTINGS.http2ConnectionOptions} http2ConnectionOptions={"rejectUnauthorized":false,"enablePush":true}
 * @property {SETTINGS.browserStreams} browserStreams='/browserStreams'
 * @property {SETTINGS.nodeStreams} nodeStreams='/nodeStreams'
 * @property {SETTINGS.listenerStreams} listenerStreams='/listenerStreams'
 * @property {SETTINGS.serveFilesFrom} serveFilesFrom='./dist'
 * @property {SETTINGS.defaultResponseHeaders} defaultResponseHeaders
 * @property {SETTINGS.log} log='verbose'
 * @namespace
 */
const SETTINGS = {}

/**
 * @namespace
 * @category Misc
 * @enum {string}
 */
const MSG_TYPES = {
  /** new question */
  question: 'question',
  /** reply to a question */
  reply: 'reply',
  /** default message type */
  message: 'message',
  /** answer was cancelled */
  cancelled: 'cancelled',
  /** an error occurred answering question */
  error: 'error',
  /** TBD */
  listening: 'listening',
  /** TBD */
  object: 'object',
  /** TBD */
  raw: 'raw',
}

/**
 * sets the default SETTINGS
 * @private
 * @param {SETTINGS} settings
 */
const setDefaultSettings = (settings, browser = true) => {
  Object.assign(SETTINGS, /** @lends SETTINGS */{
    /**
     * @type {string}
     * @default
     */
    browserStreams: '/browserStreams',
    /**
     * @type {string}
     * @default
     */
    listenerStreams: '/listenerStreams',
  })
  if (browser) {
    Object.assign(SETTINGS, /** @lends SETTINGS */{
      /**
       * @type {string}
       * @default
       */
      serverAddress: 'https://192.168.1.70:8443',
    })
  } else {
    Object.assign(SETTINGS, /** @lends SETTINGS */{
      /**
       * @type {number}
       * @default
       */
      serverPort: 8443,
      /**
       * @type {string}
       * @default
       */
      serverHostName: '127.0.0.1',
      /**
       * @type {string}
       * @default
       */
      serverAddress: 'https://localhost:8443',
      /**
       * @type {object}
       * @default
       */
      http2ConnectionOptions: {
        rejectUnauthorized: false,
        enablePush: true,
      },
      /**
       * @type {string}
       * @default
       */
      nodeStreams: '/nodeStreams',
      /**
       * @type {string}
       * @default './dist'
       */
      serveFilesFrom: `${process.cwd()}/dist`,
      /**
       * @type {object}
       * @default {
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': 86400,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Expose-Headers': 'http2-duplex-id, http2-duplex-idx',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/ecmascript',
      'Cache-Control': 'max-age=0, no-cache, must-revalidate, proxy-revalidate',
    }
       */
      defaultResponseHeaders: {
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': 86400,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Expose-Headers': 'http2-duplex-id, http2-duplex-idx',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/ecmascript',
        'Cache-Control': 'max-age=0, no-cache, must-revalidate, proxy-revalidate',
      },

      // certDir: './dev certificate',
      // keyFile: './dev certificate/selfsigned.key',
      // certFile: './dev certificate/selfsigned.crt',
      // certArgs: '/C=US/ST=Denial/L=Springfield/O=Dis/CN=*',
      /**
       * @type {string}
       * @default
       */
      log: 'verbose',
    })
  }
  if (settings) Object.assign(SETTINGS, settings)
}

export { SETTINGS, MSG_TYPES, setDefaultSettings }
