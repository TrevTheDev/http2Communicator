/* eslint-disable functional/immutable-data,
functional/functional-parameters,
default-case,
no-case-declarations,
no-continue,
no-new-func,functional/no-try-statement,
functional/no-expression-statement,
functional/no-conditional-statement,
functional/no-loop-statement,
functional/no-let */

const STATES = {
  VARIABLE: Symbol('VARIABLE'),
  DEFAULT: Symbol('DEFAULT'),
  REST: Symbol('REST'),
}

const isIn = (tokens) => (token) => tokens.some((element) => element === token)
const isWhitespace = isIn([' ', '\t', '\n', '\r'])
const isOpening = isIn(['[', '{'])
const isClosing = isIn([']', '}'])
const isStrWrap = isIn(["'", '"', '`'])

const betterEval = (obj, scope = {}) => {
  try {
    return new Function(`
      "use strict";
      return (${obj});
    `).call(scope)
  } catch (e) {
    return new Function(`
      "use strict";
      return (this.${obj});
    `).call(scope)
  }
}

const parameterParser = (fn) => {
  const scope = {}
  let state = STATES.VARIABLE
  let counter = 0
  const parsed = []
  let buffer = ''
  let destructuringType = null
  let destructuringKeys = []
  const destructuringStack = []

  const pushBuffer = () => {
    if (buffer === '') return

    switch (state) {
      case STATES.VARIABLE:
        if (destructuringType == null) parsed.push({ type: 'SIMPLE', name: buffer })
        else destructuringKeys.push({ type: 'KEY', name: buffer })

        break

      case STATES.DEFAULT:
        const topStack = (destructuringType == null)
          ? parsed.pop()
          : destructuringKeys.pop()

        const defaultParam = betterEval(buffer, scope)

        if (destructuringType == null) {
          parsed.push({
            type: 'DEFAULT',
            name: topStack.name,
            value: defaultParam,
          })
        } else {
          destructuringKeys.push({
            type: 'KEY_WITH_DEFAULT',
            name: topStack.name,
            value: defaultParam,
          })
        }
        break

      case STATES.REST:
        if (destructuringType == null)
          parsed.push({ type: 'REST', name: buffer })
        else destructuringKeys.push({ type: 'REST', name: buffer })
        break
    }
    buffer = ''
  }

  const pushDestructuringKeys = () => {
    const parsedVal = {
      type: destructuringType,
      keys: destructuringKeys,
    }
    if (destructuringStack.length > 0) {
      const [topType, topStack] = destructuringStack.pop()
      if (topType === 'object') {
        const lastStack = topStack[topStack.length - 1]
        topStack[topStack.length - 1] = {
          type: 'DESTRUCTURING',
          name: lastStack.name,
          value: parsedVal,
        }
      } else topStack.push({ type: 'DESTRUCTURING', value: parsedVal })

      destructuringKeys = topStack
      destructuringType = topType
    } else {
      parsed.push({ type: 'DESTRUCTURING', value: parsedVal })
      destructuringKeys = []
      destructuringType = null
    }
  }

  let i = -1
  while (i < fn.length) {
    i += 1
    const token = fn[i]
    switch (state) {
      case STATES.VARIABLE:
        if (isWhitespace(token)) continue
        if ((token === ':' && destructuringType === 'object')) {
          pushBuffer()
          destructuringStack.push([destructuringType, destructuringKeys])
          destructuringKeys = []
          continue
        }
        if (destructuringType === 'array' && (token === '[' || token === '{')) {
          pushBuffer()
          destructuringStack.push([destructuringType, destructuringKeys])
          destructuringKeys = []
          if (token === '[') destructuringType = 'array'
          else if (token === '{') destructuringType = 'object'
          continue
        }
        switch (token) {
          case '=':
            pushBuffer()
            state = STATES.DEFAULT
            continue
          case '{':
            destructuringType = 'object'
            continue
          case '[':
            destructuringType = 'array'
            continue
          case ',':
            pushBuffer()
            continue
          case '.':
            if (buffer === '') {
              i += 2
              state = STATES.REST
              continue
            }
        }
        if (isClosing(token) && destructuringType != null) {
          pushBuffer()
          pushDestructuringKeys()
          continue
        }
        buffer += token
        if (i === fn.length - 1) {
          pushBuffer()
          if (destructuringType !== null) pushDestructuringKeys()
        }
        break

      case STATES.DEFAULT:
        if (counter === 0 && isWhitespace(token)) continue
        if (isStrWrap(token)) {
          const closingIdx = fn.indexOf(token, i + 1)
          buffer += fn.slice(i, closingIdx + 1)
          if (destructuringType == null) pushBuffer()

          i = closingIdx
          continue
        }
        if (isClosing(token) && counter === 0 && destructuringType != null) {
          pushBuffer()
          pushDestructuringKeys()
          continue
        }
        if (isOpening(token)) counter += 1
        else if (isClosing(token)) counter -= 1

        if (counter === 0 && token === ',') {
          pushBuffer()
          state = STATES.VARIABLE
          continue
        }
        buffer += token
        if (i === fn.length - 1) {
          pushBuffer()
          if (destructuringType != null) pushDestructuringKeys()
        }
        break

      case STATES.REST:
        if (isClosing(token) && counter === 0 && destructuringType != null) {
          pushBuffer()
          pushDestructuringKeys()
          state = STATES.VARIABLE
          continue
        }
        buffer += token
        if (i === fn.length - 1) pushBuffer()

        break
    }
  }
  return parsed
}

const startsWith = (string, target, position = 0) => (
  string.slice(position, position + target.length) === target)

const parseTraditionalFunction = (fnString) => {
  fnString = fnString.slice('function'.length).trim()

  const isGenerator = fnString[0] === '*'
  if (isGenerator) fnString = fnString.slice(1).trim()

  const parameterStartIdx = fnString.indexOf('(')
  let parameterEndIdx
  let counter = 0
  for (let i = parameterStartIdx + 1; i < fnString.length; i += 1) {
    const token = fnString[i]
    if (token === ')' && counter === 0) {
      parameterEndIdx = i
      break
    }
    if (token === '(') counter += 1
    else if (token === ')') counter -= 1
  }
  const isAnonymous = parameterStartIdx === 0
  const _rawParameters = fnString.slice(parameterStartIdx + 1, parameterEndIdx)

  const bodyStartIndex = fnString.indexOf('{', parameterEndIdx)
  const body = fnString.slice(bodyStartIndex + 1, fnString.length - 1).trim()
  fnString = fnString.slice(0, bodyStartIndex).trim()

  const name = isAnonymous ? null : fnString.slice(0, parameterStartIdx)

  return {
    type: isGenerator ? 'GENERATOR' : 'TRADITIONAL',
    name,
    _rawParameters,
    body,
  }
}

const parseArrowFunction = (fnString) => {
  const arrowIndex = fnString.indexOf('=>')

  let body = fnString.slice(arrowIndex + 2).trim()
  const hasCurlyBrace = body[0] === '{'
  body = (hasCurlyBrace)
    ? body.slice(1, -1).trim()
    : `return ${body}`

  const parameterWithParentheses = fnString.slice(0, arrowIndex).trim()
  const hasParentheses = fnString[0] === '('
  const _rawParameters = (hasParentheses)
    ? parameterWithParentheses.slice(1, -1)
    : parameterWithParentheses

  return {
    type: 'ARROW',
    name: null,
    _rawParameters,
    body,
  }
}

const parseFunction = (fn) => {
  let fnString = fn.toString()
  const isAsync = startsWith(fnString.toString(), 'async')
  if (isAsync) fnString = fnString.slice('async'.length).trim()

  const isTraditionalFunction = fnString.startsWith('function')

  const parsed = (isTraditionalFunction)
    ? parseTraditionalFunction(fnString)
    : parseArrowFunction(fnString)

  parsed.async = isAsync
  parsed.params = parameterParser(parsed._rawParameters)
  return parsed
}

export default parseFunction
