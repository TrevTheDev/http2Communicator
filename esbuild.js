import esbuild from 'esbuild'
// import mocha from 'mocha/browser-entry.js'
// import browserifyAdapter from 'esbuild-plugin-browserify-adapter'

esbuild.build({
  entryPoints: ['./tests/browser client.test.js'],
  bundle: true,
  sourcemap: 'inline',
  platform: 'browser',
  minify: false,
  inject: ['./tests/node to browser shims.js'],
  // plugins: [browserifyAdapter(mocha)],
  outfile: './dist/http2 duplex stream.test.js',
})
