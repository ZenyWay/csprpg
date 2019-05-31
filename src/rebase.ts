/**
 * inspired from https://www.npmjs.com/package/altered-base (by Kenneth Sedgwick)
 *
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

/**
 * simple O(n^2) implementation of a conversion algorithm from bytes (radix 256)
 * to any other radix between 2 and 255,
 * sufficiently fast for n up to of a few thousand digits.
 * For higher orders of magnitude, look for divide-and-conquer implementations
 * which should achieve O(n*log(n)).
 */
export default function rebase (radix: number, bytes: Uint8Array): Uint8Array {
  const digits = Math.ceil((bytes.length << 3) / Math.log2(radix))
  const rebased = new Uint16Array(digits)
  for (const byte of bytes) {
    let carry = byte
    for (let i = 0; i < rebased.length; i++) {
      const word =
        (rebased[i] << 8) + // multiply by the source radix (256)
        carry // and add the new byte (i = 0) or normalization carry
      if (word) {
        if (word >= radix) {
          // normalize to target radix if needed
          carry = Math.floor(word / radix)
          rebased[i] = word - radix * carry // word % radix
        } else {
          carry = 0
          rebased[i] = word
        }
      }
    }
  }
  return Uint8Array.from(rebased)
}

/**
 * convert bytes to their corresponding digits in the given alphabet.
 */
export function bytesToDigits (alphabet: string[], bytes: Uint8Array): string {
  let str = ''
  let i = bytes.length
  while (i--) {
    const digit = alphabet[bytes[i]]
    if (!isString(digit)) throw new TypeError('invalid byte')
    str += digit
  }
  return str
}

function isString (val) {
  return typeof (val && val.valueOf()) === 'string'
}
