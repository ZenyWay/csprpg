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

const csprpg = require('..').default
const test = require('tape')
const RANDOM_BYTES = {
  A: [
    117,
    15,
    135,
    205,
    146,
    192,
    247,
    201,
    74,
    220,
    223,
    147,
    76,
    229,
    54,
    32,
    74,
    241,
    5,
    165,
    164,
    208,
    198,
    240,
    127,
    237,
    79,
    55,
    75,
    131,
    133,
    195,
    94,
    14,
    46,
    253,
    87,
    4,
    180,
    228,
    104,
    239
  ],
  B: [
    235,
    188,
    24,
    142,
    56,
    137,
    241,
    183,
    24,
    172,
    97,
    190,
    124,
    253,
    65,
    32,
    102,
    187,
    154,
    228,
    198,
    65,
    133,
    108,
    167,
    128,
    30,
    245,
    221,
    233,
    254,
    123,
    191,
    66,
    115,
    150,
    174,
    151,
    217,
    3,
    169,
    193,
    165,
    153,
    187,
    82,
    49,
    69,
    83,
    193,
    95,
    89
  ],
  C: [
    114,
    124,
    167,
    167,
    168,
    251,
    174,
    169,
    163,
    53,
    126,
    88,
    11,
    203,
    14,
    244,
    6,
    44,
    211,
    130,
    174,
    53,
    41,
    141,
    77,
    73,
    80,
    205,
    227,
    220,
    158,
    98,
    205,
    150,
    17,
    65,
    218,
    159,
    38,
    138,
    157,
    210,
    204,
    17,
    156,
    0,
    72
  ]
}

const RANDOM_DIGITS = {
  A: 'ydbzhjc5d5ajkxkwjzbcowxo01kyjupmb5ln32tn7biqp9sri4vrvl0ptm9ogr1r',
  B: 's;:]:F)oJ#h<_bXi.[[f&k^>!R}HH05z87NS<jxuvmc),9Lm#0&,*C#M!O;G~fYd',
  C: ':o&7t4u9z7*7g;#z5i+kg4.-(g#t;m8#h;0!n7uq>u_43:&p8+n8t49ra46kb5=g'
}

const SYMBOLS = '#$%&_=+-*/<>()!?,;.:'

test('when called without callback argument', t => {
  t.test('it returns a string', st => {
    const res = csprpg()
    st.plan(1)
    st.equal(typeof res, 'string')
  })
  t.test(
    'it calls randombytes with the specified length ' +
      'and rebases its output to the specified alphabet',
    st => {
      const spec = {
        randombytes,
        length: RANDOM_DIGITS.A.length,
        uppercase: false,
        symbols: false
      }
      st.plan(2)
      const res = csprpg(spec)
      st.equal(res, RANDOM_DIGITS.A)

      function randombytes (length) {
        st.equal(length, RANDOM_BYTES.A.length)
        return Uint8Array.from(RANDOM_BYTES.A)
      }
    }
  )
  t.test(
    'it defaults to numbers, lowercase, uppercase and symbols ' +
      'if all are specified false',
    st => {
      const spec = {
        randombytes,
        length: RANDOM_DIGITS.B.length,
        numbers: false,
        lowercase: false,
        uppercase: false,
        symbols: false
      }
      st.plan(1)
      const res = csprpg(spec)
      st.equal(res, RANDOM_DIGITS.B)

      function randombytes (length, cb) {
        return Uint8Array.from(RANDOM_BYTES.B)
      }
    }
  )
  t.test(
    'it replaces the default character set when given a string instead of true',
    st => {
      const spec = {
        randombytes,
        length: RANDOM_DIGITS.C.length,
        uppercase: false,
        symbols: SYMBOLS
      }
      st.plan(1)
      const res = csprpg(spec)
      st.equal(res, RANDOM_DIGITS.C)

      function randombytes (length) {
        return Uint8Array.from(RANDOM_BYTES.C)
      }
    }
  )
})

test('when called with a callback argument', t => {
  t.test('it calls the callback with a null and a string', st => {
    st.plan(2)
    csprpg((err, val) => {
      st.equal(err, null)
      st.equal(typeof val, 'string')
    })
  })
  t.test(
    'it calls randombytes with the specified length ' +
      'and rebases its async output to the specified alphabet',
    st => {
      const spec = {
        randombytes,
        length: RANDOM_DIGITS.B.length,
        numbers: false,
        lowercase: false,
        uppercase: false,
        symbols: false
      }
      st.plan(3)
      csprpg(spec, (err, res) => {
        st.equal(res, RANDOM_DIGITS.B)
      })

      function randombytes (length, cb) {
        st.equal(length, RANDOM_BYTES.B.length)
        st.equal(typeof cb, 'function')
        cb(null, Uint8Array.from(RANDOM_BYTES.B))
      }
    }
  )
})
