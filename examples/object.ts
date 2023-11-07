import { createSer, createDes } from '../src/index.js'
import type { Ser, Des } from '../src/index'

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
