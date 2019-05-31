/**
 * Copyright 2019 ZenyWay S.A.S., Stephane M. Catala
 * @author Stephane M. Catala
 * @license Apache Version 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */

import * as randombytes from 'randombytes'
import rebase, { bytesToDigits } from './rebase'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const LOWERCASE = ALPHABET.map(char => char.toLowerCase())
const UPPERCASE = ALPHABET.map(char => char.toUpperCase())
const NUMBERS = '0123456789'.split('')
const SYMBOLS = '^!$%&/{([)]=}?\\+*~#<>|,;.:-_'.split('')

export interface CsprpgSpec {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

export interface CsprpgCallback {
  (err?: any, rnd?: string): void
}

const DEFAULT_CSPRPG_SPEC: CsprpgSpec = {
  length: 12,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true
}

const MIN_LENGTH = 4
const MAX_LENGTH = 4096
const EMPTY_ARRAY = []

/**
 * generate a cryptographically secure pseudo-random password.
 * based on [node crypto's randombytes](https://npmjs.com/package/randombytes)
 * or webCrypto.getRandomValues in the browser.
 *
 * * length defaults to 12 when not a number,
 * or to the closest bound when out of bounds (min 4, max 4096)
 * * lowercase, uppercase, numbers, and symbols all default
 * to their default value (true) when all are false.
 * * the number of characters of the returned password
 * is equal to the highest integer strictly lower than the given length
 */
export default function csprpg (
  opts?: Partial<CsprpgSpec> | CsprpgCallback,
  cb?: Partial<CsprpgSpec> | CsprpgCallback
): string {
  if (isCallbackFirst(opts, cb)) {
    return csprpg(cb, opts)
  }
  const spec = { ...DEFAULT_CSPRPG_SPEC, ...opts }
  if (!isNumber(spec.length) || isNaN(spec.length)) {
    const { length } = DEFAULT_CSPRPG_SPEC
    return csprpg({ ...spec, length }, cb as CsprpgCallback)
  }
  const length = Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, spec.length))
  const { lowercase, uppercase, numbers, symbols } = spec

  const alphabet = EMPTY_ARRAY.concat(
    lowercase ? LOWERCASE : EMPTY_ARRAY,
    uppercase ? UPPERCASE : EMPTY_ARRAY,
    numbers ? NUMBERS : EMPTY_ARRAY,
    symbols ? SYMBOLS : EMPTY_ARRAY
  )

  const radix = alphabet.length
  const units = Math.ceil((Math.log2(radix) * length) / 8)

  if (!cb) {
    return digits(randombytes(units))
  }

  randombytes(units, (err, bytes) => {
    try {
      if (err) {
        throw err
      }
      ;(cb as CsprpgCallback)(null, digits(bytes))
    } catch (err) {
      ;(cb as CsprpgCallback)(err)
    }
  })

  function digits (bytes: Uint8Array) {
    return bytesToDigits(alphabet, rebase(radix, bytes)).slice(-length)
  }
}

function isCallbackFirst (
  opts?: Partial<CsprpgSpec> | CsprpgCallback,
  cb?: Partial<CsprpgSpec> | CsprpgCallback
): opts is CsprpgCallback {
  return isFunction(opts) || (!opts && cb && !isFunction(cb))
}

function isFunction (v: any): v is Function {
  return typeof v === 'function'
}

function isNumber (v: any): v is number {
  return typeof (v && v.valueOf()) === 'number'
}
