import { createSer, createDes } from '../src/index.js'
import type { Ser, Des } from '../src/index'

let buffer


{ // Serialize
  const todos = [
    { userId: 1, id: 1, completed: false, title: "delectus aut autem" },
    { userId: 1, id: 2, completed: true, title: "quis ut nam facilis et officia qui" },
  ]
  const ser: Ser = createSer()
  ser.serializeArray(todos, (ser, todo) => {
    ser.serializeUInt32(todo.id)
    ser.serializeUInt32(todo.userId)
    ser.serializeString(todo.title)
    ser.serializeBoolean(todo.completed)
  })
  buffer = ser.getBuffer()
}

{ // Deserialize
  const des: Des = createDes(buffer)
  const todos = des.deserializeArray((des) => {
    const id = des.deserializeUInt32()
    const userId = des.deserializeUInt32()
    const title = des.deserializeString()
    const completed = des.deserializeBoolean()
    return { id, userId, title, completed }
  })
  console.log(todos)
}
