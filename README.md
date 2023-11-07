# SeqProto

This library provides a simple way to serialize and deserialize objects in binary format.

Install with:

```npm install seqproto```

## Usage

### Examples

For more examples, see the [examples](./examples) directory.

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

console.log({b, i, f, s, a})
```

### Object

```typescript
import { createSer, createDes } from 'seqproto'
import type { Ser, Des } from 'seqproto'

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
import { createSer, createDes } from 'seqproto'
import type { Ser, Des } from 'seqproto'

let buffer

{ // Serialize
  const todos = [
    { userId: 1, id: 1, completed: false, title: "delectus aut autem" },
    { userId: 1, id: 2, completed: true, title: "quis ut nam facilis et officia qui" },
  ]
  const ser: Ser = createSer();
  ser.serializeArray(todos, (ser, todo) => {
    ser.serializeUInt32(todo.id)
    ser.serializeUInt32(todo.userId)
    ser.serializeString(todo.title)
    ser.serializeBoolean(todo.completed)
  })
  buffer = ser.getBuffer()
}

{ // Deserialize
  const des: Des = createDes(buffer);
  const todos = des.deserializeArray((des) => {
    const id = des.deserializeUInt32()
    const userId = des.deserializeUInt32()
    const title = des.deserializeString()
    const completed = des.deserializeBoolean()
    return { id, userId, title, completed }
  })
  console.log(todos)
}
```

## API

This library exports the following functions:

- `createSer()`: creates a new serializer.
- `createDes(buffer)`: creates a new deserializer.
- `ser.serializeBoolean(b)`: serializes a boolean value.
- `des.deserializeBoolean()`: deserializes a boolean value.
- `ser.serializeUInt32(uint32)`: serializes a 32-bit unsigned integer.
- `des.deserializeUInt32(uint32)`: deserializes a 32-bit unsigned integer.
- `ser.serializeString(string)`: serializes a string.
- `des.deserializeString()`: deserializes a string.
- `ser.serializeArray(array, (ser, item) => { ... })`: serializes an array.
- `des.deserializeArray(array, (des) => { ... })`: deserializes an array.
- `ser.serializeFloat32(float32)`: serializes float 32bit.
- `des.deserializeFloat32()`: deserializes float 32bit.
- `ser.getBuffer()`: returns the serialized buffer.

## Why another serialization library?

While I have been writing this library, I have in mind the following main goals:
- **Runtime independent** - I want to have a library that runs in every javascript runtime, from Node.JS, through browsers, to CloudFlare.
- **Performance** - I want to have a library that is fast and easy to use.
- **Small size** - I want to have a library that is small and easy to use.
- **Customizable** - Due to the JavaScript nature, the data structures are limited.
- **TypeScript support** - I want to have a library that is easy to use in TypeScript.

## Contributing

Contributions are welcome! Please open an issue if you have any ideas for improvement or found a bug.

## License

Apache-2.0
