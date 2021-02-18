const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = [{
  mode,
  entry: './browser/browser client.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'http2 duplex stream.js',
  },
  devtool: 'eval-source-map',
  target: 'web',
}, {
  mode,
  entry: './tests/browser client.test.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'http2 duplex stream.test.js',
  },
  devtool: 'eval-source-map',
  target: 'web',
  // resolve: { fallback: { stream: require.resolve('stream-browserify') } },
},
]
