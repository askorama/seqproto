import b from 'benny'
import {
  createDes,
  createSer
} from '../../src/index.js'
import fs from 'node:fs'

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

const todos: Todo[] = JSON.parse(fs.readFileSync('./benchmarks/isolated/data/todos.json', 'utf8'))

const root = await protobuf.load('./benchmarks/isolated/data/todos.proto')
const prtobufType = root.lookupType('todos.TodosMessage')

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
ser.reset()
ser.serializeArray(todos, (ser, todo) => {
  ser.serializeUInt32(todo.id)
  ser.serializeUInt32(todo.userId)
  ser.serializeString(todo.title)
  ser.serializeBoolean(todo.completed)
})
const bbb = ser.getBuffer()

const des = createDes(new ArrayBuffer(1))

const protobufBuff = prtobufType.encode({ objects: todos }).finish()
const avroBuff = type.toBuffer(todos)
const cborBuff = cbor.encode(todos)
const cborxBuff = cborx.encode(todos)
const msgpackBuff = msgpackEncode(todos)
const msgpackrBuff = msgpackr.pack(todos)
const jsonStr = JSON.stringify(todos)

await b.suite(
  'Deserialize',

  b.add('seqproto', () => {
    des.setBuffer(bbb)
    des.deserializeArray(des => {
      const id = des.deserializeUInt32()
      const userId = des.deserializeUInt32()
      const title = des.deserializeString()
      const completed = des.deserializeBoolean()
      return { id, userId, title, completed }
    })
  }),

  b.add('avro', () => {
    type.fromBuffer(avroBuff)
  }),

  b.add('protobuf', () => {
    prtobufType.decode(protobufBuff)
  }),

  b.add('cbor', () => {
    cbor.decode(cborBuff)
  }),

  b.add('cborx', () => {
    cborx.decode(cborxBuff)
  }),

  b.add('msgpack', () => {
    msgpackDecode(msgpackBuff)
  }),

  b.add('msgpackr', () => {
    msgpackr.unpack(msgpackrBuff)
  }),

  b.add('JSON', () => {
    JSON.parse(jsonStr)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'deserialize', version: '1.0.0' }),
  b.save({ file: 'deserialize', format: 'table.html' })
)
