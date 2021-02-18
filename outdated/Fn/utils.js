const seen = []

//  $$show :: String
const $$show = '@@show'

export const show = (x) => {
  //  entry :: Object -> String -> String
  const entry = (o) => (k) => `${show(k)}: ${show(o[k])}`
  //  sortedKeys :: Object -> Array String
  const sortedKeys = (o) => (Object.keys(o)).sort()

  if (seen.indexOf(x) >= 0) return '<Circular>'

  switch (Object.prototype.toString.call(x)) {
    case '[object Boolean]':
      return typeof x === 'object'
        ? `new Boolean (${show(x.valueOf())})`
        : x.toString()

    case '[object Number]':
      return typeof x === 'object'
        ? `new Number (${show(x.valueOf())})`
        : 1 / x === -Infinity ? '-0' : x.toString(10)

    case '[object String]':
      return typeof x === 'object'
        ? `new String (${show(x.valueOf())})`
        : JSON.stringify(x)

    case '[object Date]':
      return `new Date (${show(isNaN(x.valueOf()) ? NaN : x.toISOString())})`

    case '[object Error]':
      return `new ${x.name} (${show(x.message)})`

    case '[object Arguments]':
      return `function () { return arguments; } (${(Array.prototype.map.call(x, show)).join(', ')})`

    case '[object Array]':
      seen.push(x)
      try {
        return `[${((x.map(show)).concat(
          sortedKeys(x)
            .filter((k) => !(/^\d+$/.test(k)))
            .map(entry(x)),
        )).join(', ')}]`
      } finally {
        seen.pop()
      }

    case '[object Object]':
      seen.push(x)
      try {
        return (
          $$show in x
          && (x.constructor == null || x.constructor.prototype !== x)
            ? x[$$show]()
            : `{${((sortedKeys(x)).map(entry(x))).join(', ')}}`
        )
      } finally {
        seen.pop()
      }

    case '[object Set]':
      seen.push(x)
      try {
        return `new Set (${show(Array.from(x.values()))})`
      } finally {
        seen.pop()
      }

    case '[object Map]':
      seen.push(x)
      try {
        return `new Map (${show(Array.from(x.entries()))})`
      } finally {
        seen.pop()
      }

    default:
      return String(x)
  }
}

/**
 * Accepts a function `fn` and returns a function that guards invocation of
 * `fn` such that `fn` can only ever be called once, no matter how many times
 * the returned function is invoked. The first value calculated is returned in
 * subsequent invocations.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a... -> b) -> (a... -> b)
 * @param {Function} fn The function to wrap in a call-only-once wrapper.
 * @return {Function} The wrapped function.
 * @example
 *
 *      const addOneOnce = R.once(x => x + 1);
 *      addOneOnce(10); //=> 11
 *      addOneOnce(addOneOnce(50)); //=> 11
 */
export const executeOnlyOnce = (fn) => {
  let called = false
  let result
  return (...args) => {
    called = true
    if (called) return result
    result = fn(...args)
    return result
  }
}

const DONE = Symbol('done')

const isPromise = (value) => value && value.then && typeof value.then === 'function'

const asyncArray = (processor) => {
  const elements = {}
  let idx = 0
  let insertIdx = 0
  let done = false
  let processing = false
  let currentElement
  let deleteHistory = false
  const publicIface = {}
  const controller = {
    setProcessor(processorFn) {
      processor = processorFn
      controller.processNextItem = () => {
        if (processing && !done && elements[idx]) {
          if (deleteHistory && elements[idx - 1]) delete elements[idx - 1]
          currentElement = elements[idx]
          if (elements[idx] === DONE) done = true
          const itemDoneCB = () => {
            if (!done) idx += 1
            controller.processNextItem()
          }
          const type = processor(currentElement, idx, itemDoneCB)
        }
      }
      controller.startProcessing = () => {
        publicIface.done = (ingoreUnprocessedElements = false) => {
          publicIface.push(DONE) // TODO test if unprocessed items further queue
          if (ingoreUnprocessedElements && publicIface.unprocessedElements.length > 0) throw new Error('unprocessed items in queue')
          controller.processNextItem()
          delete publicIface.done
        }
        processing = true
        delete publicIface.startProcessing
        controller.processNextItem()
      }
      controller.deleteHistory = () => deleteHistory = true
      Object.defineProperty(publicIface, 'idx', {
        get: () => idx,
      })
      Object.defineProperty(publicIface, 'currentElement', {
        get: () => currentElement,
      })
      Object.defineProperty(publicIface, 'processedElements', {
        get: () => publicIface.elements.slice(0, idx),
      })
      Object.defineProperty(publicIface, 'unProcessedElements', {
        get: () => {
          const arr = publicIface.elements
          return arr.slice(idx, arr.length)
        },
      })
      delete controller.setProcessor
      return publicIface
    },
  }
  controller.publicIface = publicIface
  Object.defineProperty(publicIface, 'elements', {
    get: () => {
      const arr = Object.keys(elements).map((key) => parseInt(key, 10)).sort().map((key) => elements[key])
      return done ? arr.slice(0, -1) : arr
    },
  })

  publicIface.push = (element, index) => {
    if (index && index < idx) throw new Error("can't add item already processed")
    if (done) throw new Error('async processing already done')
    elements[index || insertIdx] = element
    insertIdx += 1
    if (processor) controller.processNextItem()
    else if (element === DONE) done = true
  }

  if (processor) controller.setProcessor(processor)
  return controller
}

const configInArray = (inArray, fn, deleteHistory, controller) => {
  inArray.setProcessor(fn)
  if (deleteHistory) inArray.deleteHistory()
  inArray.parent = controller
  inArray.root = controller.root
  inArray.startProcessing()
  return controller.publicIface
}

const createInArray = (fn, deleteHistory) => {
  const inArray = asyncArray(fn)
  if (deleteHistory) inArray.deleteHistory()

  inArray.publicIface.then = (...args) => {
    inArray.startProcessing()
    const promise = new Promise((success, fail) => {
      inArray.resolve = (result) => success(result)
      inArray.reject = (msg) => fail(msg)
    })
    return promise.then(...args)
  }

  inArray.root = inArray
  return inArray
}

const _asyncForEach = (fn, deleteHistory, inArray, controller) => {
  const foreach = (element, index, itemDoneCB) => {
    if (element === DONE) controller.resolve()
    else {
      fn(element)
      itemDoneCB()
    }
  }

  return (inArray)
    ? configInArray(inArray, foreach, deleteHistory, controller)
    : createInArray(foreach, deleteHistory).publicIface
}

export const asyncForEach = (fn, deleteHistory = true) => _asyncForEach(fn, deleteHistory)

const _asyncReduce = (fn, initialValue, deleteHistory, inArray, controller) => {
  const outArray = asyncArray()

  let accumulator = initialValue

  const reduce = (currentValue, currentIndex, itemDoneCB) => {
    if (currentValue === DONE) controller.resolve(accumulator)
    else {
      const result = fn(accumulator, currentValue, currentIndex, inArray.processedElements)
      if (isPromise(result)) {
        result.then((result) => {
          accumulator = result
          itemDoneCB()
        })
      } else {
        accumulator = result
        itemDoneCB()
      }
    }
  }

  if (inArray) {
    Object.defineProperty(controller.publicIface, 'reduceValue', {
      get: () => accumulator,
    })
    return configInArray(inArray, reduce, deleteHistory, controller)
  }

  inArray = createInArray(reduce, deleteHistory)

  Object.defineProperty(inArray.publicIface, 'reduceValue', {
    get: () => accumulator,
  })

  return inArray.publicIface
}

export const asyncReduce = (fn, initialValue = undefined, deleteHistory = true) => _asyncReduce(fn, initialValue, deleteHistory)

const _asyncMap = (fn, deleteHistory, inArray, controller) => {
  const outArray = asyncArray()
  let hasChild = false

  const map = (element, index, itemDoneCB) => {
    if (element === DONE) {
      outArray.publicIface.push(DONE, index)
      if (!hasChild) controller.resolve(outArray.publicIface.elements)
    } else {
      const result = fn(element)
      if (isPromise(result)) result.then((resolve) => outArray.publicIface.push(resolve, index))
      else outArray.publicIface.push(result, index)
      itemDoneCB()
    }
  }

  if (inArray)
    return configInArray(inArray, map, deleteHistory, controller)

  inArray = createInArray(map, deleteHistory)

  inArray.publicIface.map = (fnMap) => {
    hasChild = true
    return _asyncMap(fnMap, deleteHistory, outArray, inArray)
  }

  inArray.publicIface.reduce = (fnReducer, initialValue) => {
    hasChild = true
    return _asyncReduce(fnReducer, initialValue, deleteHistory, outArray, inArray)
  }

  inArray.publicIface.forEach = (fnEach) => {
    hasChild = true
    return _asyncForEach(fnEach, deleteHistory, outArray, inArray)
  }

  return inArray.publicIface
}

export const asyncMap = (fn, deleteHistory = true) => _asyncMap(fn, deleteHistory)
