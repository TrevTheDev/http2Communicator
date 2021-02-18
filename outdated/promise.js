const PENDING = Symbol('PENDING')
const RESOLVED = Symbol('RESOLVED')
const REJECTED = Symbol('REJECTED')

const useImmediately = (value, withValue) => setImmediate(withValue, value) && value

const isFunction = (o) => typeof o === 'function'

const maybeThenable = (o) => o && (typeof o === 'object' || isFunction(o)) // && (typeof o.then === 'function')

const runFnsOnlyOnce = () => {
  let called = false
  return (fn) => (...args) => called || ((called = true) && fn(...args))
}

const deferred = () => {
  let callbacks = []; let state = PENDING; let value

  const settle = () => {
    if (state !== PENDING) {
      callbacks.forEach((callback) => {
        const transform = callback.transformInput[state]
        if (isFunction(transform)) {
          try {
            const transformedValue = transform(value)
            if (transformedValue === callback.promise)
              throw new TypeError('A promise cannot be chained to itself.')
            callback.propagateOutput[RESOLVED](transformedValue)
          } catch (e) {
            callback.propagateOutput[REJECTED](e)
          }
        } else callback.propagateOutput[state](value)
      })
      callbacks = []
    }
  }

  const setStateNow = (targetState) => (finalValue) => {
    state = targetState
    value = finalValue
    setImmediate(settle)
  }

  const setStateEventually = (targetState) => (settleValue) => {
    const runOnceA = runFnsOnlyOnce()
    try {
      if (maybeThenable(settleValue)) {
        const { then } = settleValue
        if (isFunction(then)) {
          then.call(
            settleValue,
            runOnceA(setStateEventually(RESOLVED)),
            runOnceA(setStateNow(REJECTED)),
          )
          return
        }
      }
      setStateNow(targetState)(settleValue)
    } catch (e) {
      runOnceA(setStateNow(REJECTED))(e)
    }
  }

  const runOnceB = runFnsOnlyOnce()
  const then = (resolved, rejected) => {
    const d = deferred()
    setImmediate(() => {
      callbacks.push({
        transformInput: { [RESOLVED]: resolved, [REJECTED]: rejected },
        propagateOutput: { [RESOLVED]: d.resolve, [REJECTED]: d.reject },
        promise: d.promise,
      })
      settle()
    })
    return d.promise
  }

  return {
    resolve: runOnceB(setStateEventually(RESOLVED)),
    reject: runOnceB(setStateNow(REJECTED)),
    promise: {
      then,
      catch: (reason) => then(null, reason),
    },
  }
}
const bs = (value) => {
  const d = deferred()
  setImmediate(d.resolve(value))
  return d.promise
}
const resolved = (value) => useImmediately(deferred(), (d) => d.resolve(value)).promise
const rejected = (value) => useImmediately(deferred(), (d) => d.reject(value)).promise

export default {
  resolved,
  rejected,
  deferred,
  promise: (executor) => {
    if (!isFunction(executor)) throw new Error('Executor must be a function')
    const pms = deferred()
    executor(pms.resolve, pms.reject)
    return pms.promise
  },
}
//
// const basicRouter = (leftRoutes, rightRoutes) => {
//   const rhs = { ...rightRoutes }
//   rhs._router = { ...leftRoutes }
//   rhs._router.rhs = rhs
//   return [rhs._router, rhs]
// }
//
// const ifFunction = (f) => (yes) => (no) => (typeof f === 'function' ? yes(f) : no(f))
//
// const pms = (executor) => {
//   if (typeof executor !== 'function') throw new Error('Executor must be a function')
//   let state_ = PromiseStates.pending
//   let chained = []
//   let internalValue
//   let finallyFn
//   const resolveRejectFn = (state, fn) => (res) => {
//     if (state_ !== PromiseStates.pending) return
//     state_ = state
//     internalValue = res
//     chained.forEach((callback) => callback[fn](res))
//     chained = []
//     if (finallyFn) finallyFn()
//   }
//   const [router, rhs] = basicRouter({
//     resolve: (...args) => setImmediate(resolveRejectFn(PromiseStates.fulfilled, 0), ...args),
//     reject: (...args) => setImmediate(resolveRejectFn(PromiseStates.rejected, 1), ...args),
//   },
//   {
//     then: (onFulfilled, onRejected) => {
//       const newPms = pms((resolve, reject) => {
//         const resolverFn = (fn1, fn2) => (res) => {
//           const fn2_ = ifFunction(fn2)((fn) => fn)((value) => () => value)
//           try {
//             const resx = fn2_(res)
//             fn1(resx)
//             // debugger
//           } catch (err) { reject(err) }
//         }
//         const _onFulfilled = resolverFn(resolve, onFulfilled)
//         const _onRejected = resolverFn(reject, onRejected)
//
//         if (state_ === PromiseStates.fulfilled) _onFulfilled(internalValue)
//         else if (state_ === PromiseStates.rejected) _onRejected(internalValue)
//         else chained.push([_onFulfilled, _onRejected])
//       })
//       return newPms
//     },
//     catch: (onReject) => rhs.then(null, onReject),
//     finally: (onFinally) => {
//       finallyFn = onFinally
//     },
//   })
//   try { executor(router.resolve, router.reject) } catch (err) { router.reject(err) }
//   return rhs
// }
//
// export default pms
