import b from 'benny'
import fs from 'node:fs'
import {
  createDes,
  createSer
} from '../src/index.js'

import { encode as msgpackEncode, decode as msgpackDecode } from '@msgpack/msgpack'
import cbor from 'cbor'
import * as cborx from 'cbor-x'
import * as msgpackr from 'msgpackr'
import protobuf from 'protobufjs'
import avro from 'avsc'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const todos: Todo[] = JSON.parse(fs.readFileSync('./tests/data/todos.json', 'utf8'))

const root = await protobuf.load('./tests/data/todos.proto')
const protobufType = root.lookupType('todos.TodosMessage')

const type = avro.Type.forSchema({
  name: 'Todos',
  type: 'array',
  items: {
    name: 'Todo',
    type: 'record',
    fields: [
      { name: 'userId', type: 'int' },
      { name: 'id', type: 'int' },
      { name: 'title', type: 'string' },
      { name: 'completed', type: 'boolean' }
    ]
  }
})
const ser = createSer()

await b.suite(
  'Serialize / Deserialize',

  b.add('seqproto', () => {
    ser.index = 0
    ser.serializeArray(todos, (ser, todo) => {
      ser.serializeUInt32(todo.id)
      ser.serializeUInt32(todo.userId)
      ser.serializeString(todo.title)
      ser.serializeBoolean(todo.completed)
    })
    const bbb = ser.getBuffer()
    const des = createDes(bbb)
    des.deserializeArray(des => {
      const id = des.deserializeUInt32()
      const userId = des.deserializeUInt32()
      const title = des.deserializeString()
      const completed = des.deserializeBoolean()
      return { id, userId, title, completed }
    })
  }),

  b.add('protobuf', () => {
    protobufType.decode(protobufType.encode({ objects: todos }).finish())
  }),

  b.add('avro', () => {
    type.fromBuffer(type.toBuffer(todos))
  }),

  b.add('cbor', () => {
    cbor.decode(cbor.encode(todos))
  }),

  b.add('cborx', () => {
    cborx.decode(cborx.encode(todos))
  }),

  b.add('msgpack', () => {
    msgpackDecode(msgpackEncode(todos))
  }),

  b.add('msgpackr', () => {
    msgpackr.unpack(msgpackr.pack(todos))
  }),

  b.add('JSON', () => {
    JSON.parse(JSON.stringify(todos))
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'serialize', version: '1.0.0' }),
  b.save({ file: 'serialize', format: 'chart.html' })
)
