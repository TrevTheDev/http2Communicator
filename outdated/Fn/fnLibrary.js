import functionBx from './function bx.js'
import { show, _asyncMap } from './utils.js'

const consoleLog = functionBx({
  options: { returnExecFunctionOnly: true },
  process: (stringToLog) => {
    console.log(stringToLog)
    return stringToLog
  },
})

const add = functionBx({
  inputs: {
    a: { sticky: true },
    c: { required: false, defaultValue: () => 10 },
  },
  outputs: { sum: { customers: [consoleLog] } },
  process: (a, b, c) => ({ sum: a + b + c }),
})

console.log(`fx: ${show(add.exec(2, 4))}`)
console.log(`fx: ${show(add.a(2))}`)
console.log(`fx: ${add.c(20).constructor.name}`)
const b = add.b(100)
console.log(`fx: ${b.constructor.name}`)
console.log(`fx: ${add.b(200).constructor.name}`)
console.log(`fx: ${add.c(50).constructor.name}`)
console.log(`fx: ${add.b(300).constructor.name}`)

const formatName = functionBx({
  process: (name) => `*hello ${name}*`,
})

const sayHello = functionBx({
  options: { returnExecFunctionOnly: true },
  inputs: {
    name: { supplier: formatName.name },
  },
  outputs: { msg: { customers: [consoleLog] } },
  process: (name, sundryText) => ({ msg: `${name} ${sundryText}` }),
})
const xc = sayHello('trevor', (() => 'cool dude!')())
console.log(xc)
// startServer.then.waitForStreams.then.mapStreams
//   .catch.shutdownServer
//   .catch.logFailure

const av = _asyncMap((element) => {
  console.log(element)
  return element
}).map((element) => {
  const result = element * 2
  console.log(`2: ${result}`)
  return result
})
av.push(1, 0)
setTimeout(() => av.push(2, 1), 250)
setTimeout(() => av.push(4, 3), 1000)
setTimeout(() => av.push(3, 2), 1)
av.push(5, 4)
console.log(av.processedElements)
console.log(av.unprocessedElements)
console.log(av.elements)
setTimeout(() => av.done(), 1200)
av.then((success) => {
  console.log('success')
  console.log(success.elements)
})

const av = _asyncMap((element) => {
  console.log(element)
  return element
}).map((element) => {
  const result = element * 2
  console.log(`2: ${result}`)
  return result
})
av.push(1, 0)
setTimeout(() => av.push(2, 1), 250)
setTimeout(() => av.push(4, 3), 1000)
setTimeout(() => av.push(3, 2), 1)
av.push(5, 4)
console.log(av.processedElements)
console.log(av.unprocessedElements)
console.log(av.elements)
setTimeout(() => av.done(), 1200)
av.then((success) => {
  console.log('success')
  console.log(success.elements)
})
