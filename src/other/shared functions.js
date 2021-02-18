/* eslint-disable import/prefer-default-export */
// import Crypto from 'crypto-browserify'

// const { randomBytes } = Crypto// import Crypto from 'crypto-browserify'

// const { randomBytes } = Crypto

/**
 * generates a random unique identification string
 * @private
 * @returns {uid}
 */
const createUid = () => Array.from({ length: 20 }, () => Math.random().toString(36)[2]).join('')

export { createUid }
// randomBytes(64).toString('base64')
