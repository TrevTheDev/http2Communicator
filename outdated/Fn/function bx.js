/* eslint-disable functional/no-class */
import parseFunction from './function parser.js'

const defaultFunctionBoxOptions = {
  autoExecute: (functionDef, inputs) => inputs.every((input) => (
    input.required
      ? input.value !== undefined && input.value !== null
      : true)),
  returnExecFunctionOnly: false,
  argumentOptions: { required: true },
}

class OutputRouter {
  constructor(routes) {
    this.route = (outcomes) => {
      const output = Object.entries(outcomes).map(([key, value]) => (
        routes[key].customers.map((customer) => customer(value))))
      if (output.length === 1 && output[0].length === 1) return output[0][0]
      return this
    }
  }
}

const getDefaultArgValue = (input) => {
  if (Object.prototype.hasOwnProperty.call(input, 'defaultValue')) {
    return (input.defaultValue instanceof Function)
      ? input.defaultValue() || null
      : input.defaultValue || null
  }
  return null
}

class FunctionBx {
  constructor(functionDef) {
    const options = { ...defaultFunctionBoxOptions, ...functionDef.options }
    let executing = false
    const keys = parseFunction(functionDef.process).params
    const inputs = keys.map((key) => {
      const param = { name: key.name, ...options.argumentOptions }
      if (functionDef.inputs && functionDef.inputs[key.name]) Object.assign(param, functionDef.inputs[key.name])
      return param
    })
    const getValues = () => inputs.map((input) => {
      if (Object.prototype.hasOwnProperty.call(input, 'value')) return input.value
    })

    const values = inputs.map((input, index) => {
      this[input.name] = (inputValue) => {
        input.value = Object.prototype.hasOwnProperty.call(input, 'supplier')
          ? input.supplier(inputValue)
          : inputValue || getDefaultArgValue(input)
        return (!executing && options.autoExecute && options.autoExecute(functionDef, inputs))
          ? this.exec(...getValues())
          : this
      }
    })

    this.exec = (...args) => {
      executing = true
      inputs.forEach((input, index) => {
        if (args[index]) this[input.name](args[index])
        else if (input.defaultValue) this[input.name](undefined)
        if (input.required && !input.value) throw new Error(`required value not provided for ${input.name}`)
      })
      executing = false
      const vls = getValues()
      const output = functionDef.process(...vls)
      inputs.forEach((input) => {
        if (!input.sticky) input.value = getDefaultArgValue(input)
      })
      if (functionDef.outputs) {
        const outputRouter = new OutputRouter(functionDef.outputs)
        return outputRouter.route(output)
      }
      return output
    }
    return options.returnExecFunctionOnly ? this.exec : this
  }
}

const functionBx = (functionDef) => new FunctionBx(functionDef)

export default functionBx
