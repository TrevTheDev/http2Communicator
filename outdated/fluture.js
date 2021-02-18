import Future, {
  node, encase, chain, map, fork, go, after,
} from 'fluture'
import { readFile } from 'fs'

// We use the Future constructor to create a Future instance.
const eventualAnswer = Future((rej, res) => {
  // We give the computer time to think about the answer, which is 42.
  const timeoutId = setTimeout(res, 1000, 42)

  // Here is how we handle cancellation. This signal is received when nobody
  // is interested in the answer any more.
  return function onCancel() {
    // Clearing the timeout releases the resources we were holding.
    clearTimeout(timeoutId)
  }
})

const log = (string) => (value) => { console.log(`${string}: ${value}`) }

// Now, let's fork our computation and wait for an answer. Forking gives us
// the unsubscribe function.
const unsubscribe = fork(log('rejection'))(log('resolution'))(eventualAnswer)

// After some time passes, we might not care about the answer any more.
// Calling unsubscribe will send a cancellation signal back to the source,
// and trigger the onCancel function.
// unsubscribe()

const getPackageName = (file) => (
  node((done) => { readFile(file, 'utf8', done) })
    .pipe(chain(encase(JSON.parse)))
    .pipe(map((x) => x.name))
)

getPackageName('../package.json')
  .pipe(fork(console.error)(console.log))

fork(log('rejection'))(log('resolution'))(Future((reject, resolve) => {
  const t = setTimeout(resolve, 20, 43)
  return () => clearTimeout(t)
}))

fork(log('rejection'))(log('resolution'))(go(function* () {
  const thing = yield after(20)('world')
  const message = yield after(20)(`Hello ${thing}`)
  return `${message}!`
}))
