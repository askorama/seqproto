# SeqProto

[![Nodejs](https://github.com/oramasearch/seqproto/actions/workflows/nodejs.yml/badge.svg)](https://github.com/oramasearch/seqproto/actions/workflows/nodejs.yml)
![npm package minimized gzipped size (select exports)](https://img.shields.io/bundlejs/size/seqproto)

This library provides a simple way to serialize and deserialize objects in binary format.

## Why another serialization library?

While I have been writing this library, I have in mind the following main goals:
- **Runtime independent** - I want to have a library that runs in every javascript runtime, from Node.JS, through browsers, to CloudFlare.
- **Performance** - I want to have a library that is fast and easy to use.
- **Small size** - I want to have a library that is small and easy to use.
- **Customizable** - Due to the JavaScript nature, the data structures are limited.
- **TypeScript support** - I want to have a library that is easy to use in TypeScript.

## Installation

Seqproto works in any JavaScript environment. You can install it via npm:

```sh
npm install seqproto
```

Or via CDN:

```js
import { createSer, createDes } from 'https://unpkg.com/seqproto@latest/dist/esm/index.js'
```

## Usage

### Examples

For more examples, see the [examples](https://github.com/oramasearch/seqproto/tree/main/examples) directory.

```typescript
import { createSer, createDes } from 'seqproto'

// Create a serializer
const ser = createSer()

// Serialize some data
ser.serializeBoolean(true)
ser.serializeUInt32(42)
ser.serializeFloat32(-0.5)
ser.serializeString('hello world')
ser.serializeArray([1, 2, 3], (ser, n) => ser.serializeUInt32(n))

// Get ArrayBuffer with serialized data
const buffer = ser.getBuffer()

// Create a deserializer
const des = createDes(buffer)

// Deserialize data
const b = des.deserializeBoolean()
const i = des.deserializeUInt32()
const f = des.deserializeFloat32()
const s = des.deserializeString()
const a = des.deserializeArray((des) => des.deserializeUInt32())

console.log({ b, i, f, s, a })
```

### Object

```typescript
import type { Ser, Des } from 'seqproto'
import { createSer, createDes } from 'seqproto'

interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

function serializeTodo (ser: Ser, todo: Todo) {
  ser.serializeUInt32(todo.id)
  ser.serializeUInt32(todo.userId)
  ser.serializeString(todo.title)
  ser.serializeBoolean(todo.completed)
}

function deserializeTodo (des: Des): Todo {
  const id = des.deserializeUInt32()
  const userId = des.deserializeUInt32()
  const title = des.deserializeString()
  const completed = des.deserializeBoolean()
  return { id, userId, title, completed }
}

const ser: Ser = createSer()

serializeTodo(ser, {
  id: 1,
  userId: 1,
  title: 'hello',
  completed: false,
})

const buffer = ser.getBuffer()

const des: Des = createDes(buffer)
const todo = deserializeTodo(des)

console.log(JSON.stringify(todo, null, 2))
```

### Array of object

```typescript
import type { Ser, Des } from 'seqproto'
import { createSer, createDes } from 'seqproto'

let buffer

// Serialize
const todos = [
  { userId: 1, id: 1, completed: false, title: "delectus aut autem" },
  { userId: 1, id: 2, completed: true, title: "quis ut nam facilis et officia qui" }
]

const ser: Ser = createSer()

ser.serializeArray(todos, (ser, todo) => {
  ser.serializeUInt32(todo.id)
  ser.serializeUInt32(todo.userId)
  ser.serializeString(todo.title)
  ser.serializeBoolean(todo.completed)
})

buffer = ser.getBuffer()

// Deserialize
const des: Des = createDes(buffer)

const deserializedTodos = des.deserializeArray((des) => {
  const id = des.deserializeUInt32()
  const userId = des.deserializeUInt32()
  const title = des.deserializeString()
  const completed = des.deserializeBoolean()
  return { id, userId, title, completed }
})

console.log(deserializedTodos)
```

## API

This library exports the following functions:

- `createSer()`/`createSer({ bufferSize: number })`: creates a new serializer.
- `createDes(buffer)`: creates a new deserializer.
- `ser.serializeBoolean(b)`: serializes a boolean value.
- `des.deserializeBoolean()`: deserializes a boolean value.
- `ser.serializeUInt32(uint32)`: serializes a 32-bit unsigned integer.
- `des.deserializeUInt32(uint32)`: deserializes a 32-bit unsigned integer.
- `ser.serializeString(string)`: serializes a string.
- `des.deserializeString()`: deserializes a string.
- `ser.serializeArray(array, (ser, item) => { ... })`: serializes an array.
- `des.deserializeArray((des) => { ... })`: deserializes an array.
- `ser.serializeIterable(iterable, (ser, item) => { ... })`: serializes an iterable.
- `des.deserializeIterable((des) => { ... })`: deserializes an iterable.
- `ser.serializeFloat32(float32)`: serializes float 32bit.
- `des.deserializeFloat32()`: deserializes float 32bit.
- `ser.getBuffer()`: returns the serialized buffer.

## Benchmarks

We created 3 different benchmarks to compare the performance of SeqProto with JSON and Avro.

### Isolated benchmark

You can run the benchmarks with the following command:
```sh
npm run benchmark:serdes
```

Serialization / Deserialization:
| name | ops | margin | percentSlower |
| -------- | ------- | -------- | ------- |
| seqproto | 29764 | 0.72 | 0 |
| protobuf | 13698 | 0.19 | 53.98 |
| avro | 24204 | 0.14 | 18.68 |
| cbor | 803 | 0.22 | 97.3 |
| cborx | 9707 | 0.32 | 67.39 |
| msgpack | 6857 | 0.06 | 76.96 |
| msgpackr | 10449 | 0.27 | 64.89 |
| JSON | 14434 | 0.07 | 51.51 |

### Http benchmark

You can run the benchmarks using 2 shells.

1.
```sh
cd bechmarks/e2e
pnpm install
pnpm start
```
2.
```sh
cd bechmarks/e2e
pnpm run autocannon:json
pnpm run autocannon:seqproto
pnpm run autocannon:avro
```

| type     | req (in 10s) | Avg req/sec | Avg Bytes/Sec | Avg Latency (ms) |
| -------- | ---- | --------- | ---- | ---- |
| JSON     | 164k | 14892 | 275 | 0.11 |
| SeqProto | 269k | 26865.6 | 321 | 0.01 |
| Avro     | 197k | 17926.55 | 169 | 0.04 |

### e2e benchmark

You can run the benchmarks with the following command:
```sh
cd bechmarks/e2e
pnpm install
pnpm start
```
And go to http://localhost:3000/public/index.html.

| iteration    | parallelism | type | ms |
| -------- | ------- | -------- | ------- |
| 10 | 1 | JSON | 30.69999998807907 |
| 10 | 1 | SeqProto | 25.600000023841858 |
| 10 | 1 | Avro | 30.399999976158142 |
| 100 | 1 | JSON | 108.80000001192093 |
| 100 | 1 | SeqProto | 96.80000001192093 |
| 100 | 1 | Avro | 96 |
| 100 | 3 | JSON | 162.10000002384186 |
| 100 | 3 | SeqProto | 152.4000000357628 |
| 100 | 3 | Avro | 167.5 |
| 100 | 6 | JSON | 277.19999998807907 |
| 100 | 6 | SeqProto | 263.30000001192093 |
| 100 | 6 | Avro | 308.19999998807907 |

## Contributing

Contributions are welcome! Please open an issue if you have any ideas for improvement or found a bug.

## License

Apache-2.0
