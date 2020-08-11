export const SETTINGS = {}

export const setDefaultSettings = (settings) => {
  Object.assign(SETTINGS, {
    serverPort: 8443,
    serverHostName: '127.0.0.1',
    serverAddress: 'https://localhost:8443',
    http2ConnectionOptions: {
      rejectUnauthorized: false,
      enablePush: true,
    },
    serverPath: '/http2Communicator',
    listenerPath: '/http2Stream',
    certDir: './dev certificate',
    keyFile: './dev certificate/selfsigned.key',
    certFile: './dev certificate/selfsigned.crt',
    certArgs: '/C=US/ST=Denial/L=Springfield/O=Dis/CN=*',
    log: 'all',

    replyType: 'reply',
    cancelledType: 'cancelled',
    questionType: 'question',
    listeningType: 'listening',
    errorType: 'error',
    speakerTypeObject: 'object',
    speakerTypeRaw: 'raw',
  })
  if (settings) Object.assign(SETTINGS, settings)
}
