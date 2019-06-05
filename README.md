# csprpg

[![NPM](https://nodei.co/npm/csprpg.png?compact=true)](https://nodei.co/npm/csprpg/)

basic cryptographically secure pseudo-random password generator
based on [node crypto's randombytes](https://npmjs.com/package/randombytes)
or webCrypto.getRandomValues in the browser.

# Example

```ts
import csprpg from 'csprpg'
const log = label => console.log.bind(console, label)

const spec = {
  length: 16, // characters, default 12, min 4, max 4096
  lowercase: true, // default
  numbers: true, // default
  symbols: '!$?#@+-=', // default true = `^!$%&/{([)]=}?\\+*~#<>|,;.:-_`
  uppercase: true // default
}

log('sync')(csprpg(spec))

csprpg(spec, log('async'))
```

# API v1

```ts
export default function csprpg (
  opts?: Partial<CsprpgSpec> | CsprpgCallback,
  cb?: Partial<CsprpgSpec> | CsprpgCallback
): string

export interface CsprpgSpec {
  randombytes: typeof randombytes
  length: number
  lowercase: boolean | string
  uppercase: boolean | string
  numbers: boolean | string
  symbols: boolean | string
}

export interface CsprpgCallback {
  (err?: any, rnd?: string): void
}
```

# TypeScript

although this library is written in [TypeScript](https://www.typescriptlang.org),
it may also be imported into plain JavaScript code:
code editors will still benefit from the available type definition,
e.g. for helpful code completion.

# License

Copyright 2019 ZenyWay S.A.S., Stephane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
