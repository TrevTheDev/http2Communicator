const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = {
  entry: './src/duplex/client.js',
  output: {
    path: path.resolve(__dirname, 'src/duplex'),
    filename: 'bundle.js',
  },
  mode,
  devtool: 'eval-source-map',
}
