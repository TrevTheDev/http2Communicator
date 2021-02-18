import chai from 'chai'
import { randomBytes } from 'crypto'
import { asyncMap, asyncReduce } from '../outdated/Fn/utils.js'
import MultiStreamToDuplex from '../src/duplex/multi stream to duplex'

const { expect } = chai

let asyncArray
const log = (prefix) => (element) => {
  console.log(`${prefix}: ${element} - processed: ${asyncArray.processedElements} - unProcessed: ${asyncArray.unProcessedElements} - currentElement: ${asyncArray.currentElement ? asyncArray.currentElement.toString() : asyncArray.currentElement}`)
  return element
}

describe('async tests', () => {
  it('basic map tests', (done) => {
    asyncArray = asyncMap(log('first')).map((element) => log('second')(element * 2))

    log('before push')(asyncArray.elements)

    asyncArray.push(1, 0)
    setTimeout(() => asyncArray.push(2, 1), 250)
    setTimeout(() => asyncArray.push(4, 3), 1000)
    setTimeout(() => asyncArray.push(3, 2), 1)
    asyncArray.push(5, 4)

    log('before then')(asyncArray.elements)

    setTimeout(() => asyncArray.done(), 1200)

    asyncArray.then((success) => {
      log('success')(success)
      done()
    })
  })
  it('basic map promise tests', (done) => {
    const promiseLogger = ([value, delay]) => {
      log('first before')(value)
      return new Promise((resolve) => {
        setTimeout(() => {
          log('first after')(value)
          resolve(value)
          if (value === 5) asyncArray.done()
        }, delay)
      })
    }
    asyncArray = asyncMap(promiseLogger).map((element) => log('second')(element * 2))

    log('before push')(asyncArray.elements)

    asyncArray.push([1, 0], 0)
    asyncArray.push([2, 250], 1)
    asyncArray.push([4, 1000], 3)
    asyncArray.push([3, 1], 2)
    asyncArray.push([5, 0], 4)

    log('before then')(asyncArray.elements)

    asyncArray.then((success) => {
      log('success')(success)
      done()
    })
  })
  it('reduce', (done) => {
    const promiseLogger = ([value, delay]) => {
      log('first before')(value)
      return new Promise((resolve) => {
        setTimeout(() => {
          log('first after')(value)
          resolve(value)
          if (value === 5) asyncArray.done()
        }, delay)
      })
    }
    const accumulate = (accumulator, currentValue, currentIndex, processedArray) => {
      console.log(`accumulator: ${accumulator} - currentValue: ${currentValue} - currentIndex: ${currentIndex} - processedArray: ${processedArray} - asyncArray.reduceValue: ${asyncArray.reduceValue}`)
      const acc = accumulator || 0
      return acc + currentValue
    }
    asyncArray = asyncMap(promiseLogger).reduce(accumulate)

    log('before push')(asyncArray.elements)

    asyncArray.push([1, 0], 0)
    asyncArray.push([2, 250], 1)
    asyncArray.push([4, 1000], 3)
    asyncArray.push([3, 1], 2)
    asyncArray.push([5, 0], 4)

    log('before then')(asyncArray.elements)

    asyncArray.then((success) => {
      log('success')(success)
      done()
    })
  })
})

// const pullConst = (specs) => specs(42)
//
// const pullSquare = (specs) => {
//   specs(specs.x * specs.x + pullConst((x) => x))
// }
// const pullSum = (specs) => {
//   let square
//   const squareSpec = (result) => {
//     square = result
//     specs(specs.x + specs.y + square)
//   }
//   squareSpec.x = specs.x
//   pullSquare(squareSpec)
// }
//
// const InputAggregator = (...specs) => {
//   let i = 0
//   const then = (spec) => {
//     i+=1
//     () => {
//       spec.supplier(spec.requirements)
//       (result) => {
//         i-=1
//         spec.result = result
//       }
//     }
//   }
//   return {
//     then: (fn) => fn(...specs)
//   }
// }

// const requirement1 = {
//   customer: fnCustomer,
//   supplier: fnSupplier,
//   requirements: {
//     x: 5,
//     y: 19,
//   },
// }
// const requirement2 = {
//   customer: fnSupplier,
//   supplier: fnSupplier2,
//   requirements: {
//     x: 5,
//     y: 19,
//   },
// }

// const spec = (result) => {
//   console.log(result)
// }
// spec.x = 5
// spec.y = 12
//
// pullSum(spec)

// getObjects().then(sendToCustomer)
// extractObjects().then(sendObjects)
// readStreams().then(consolidateData)
// consolidateStreams().then(sendConsolidatedStreams)
// getStreams().then(sendStreams)
// startServer().then(awaitStreams)
//
// onCustomer().then(getObjects)
// startServer().then(awaitStreams)

class Spec {
  constructor(supplier, inputs, success = () => {}, fail = () => {}) {
    debugger
    let successCb
    let failCb
    let addSpec
    const specs = new Set()
    const endAndCleanUp = (fn) => (...results) => {
      successCb = () => {}
      failCb = () => {}
      addSpec = () => { throw new Error('spec already cancelled') }
      debugger
      specs.forEach((spec) => spec.cancel())
      if (fn) fn(...results)
    }

    this.inputs = inputs

    this.success = endAndCleanUp(success)

    this.fail = endAndCleanUp(fail)

    this.cancel = endAndCleanUp()

    this.add = (supplierS, inputsS, successS = () => {}, failS = () => {}) => {
      let resolved = false
      const childSpec = new Spec(supplierS, inputsS, (...args) => {
        if (resolved) specs.delete(childSpec)
        resolved = true
        successS(...args)
      }, (...args) => {
        if (resolved) specs.delete(childSpec)
        resolved = true
        failS(...args)
      })
      if (!resolved) {
        specs.add(childSpec)
        return childSpec
      }
    }

    supplier(this)
    return this.cancel
  }
}

const squareX = (x) => x * x

const addProducts = async (spec) => {
  const result = await new Promise((resolve) => {
    resolve(squareX(spec))
  })
  return `success: ${result}`
}

const getAnswer = new Promise((resolve) => {
  resolve(addProducts(5))
}).then((result) => {
  console.log(`success: ${result}`)
})
