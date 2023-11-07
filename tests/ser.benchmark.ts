import b from 'benny'
import fs from 'node:fs'
import {
  createSer
} from '../src/index.js'

import { encode as msgpackEncode } from '@msgpack/msgpack'
import cbor from 'cbor'
import * as cborx from 'cbor-x';
import * as msgpackr from 'msgpackr'
import protobuf from 'protobufjs'
import avro from 'avsc'
import fastJson from 'fast-json-stringify'

const stringify = fastJson({
  title: 'Example Schema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      userId: { type: 'integer' },
      id: { type: 'integer' },
      title: { type: 'string' },
      completed: { type: 'boolean' }
    }
  }
})

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

const todos: Todo[] = JSON.parse(fs.readFileSync('./tests/data/todos.json', 'utf8'))

const root = await protobuf.load('./tests/data/todos.proto')
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

await b.suite(
  'Serialize',

  b.add('serdes', () => {
    ser.index = 0
    ser.serializeArray(todos, (ser, todo) => {
      ser.serializeUInt32(todo.id)
      ser.serializeUInt32(todo.userId)
      ser.serializeString(todo.title)
      ser.serializeBoolean(todo.completed)
    })
    ser.getBuffer()
  }),

  b.add('protobuf', () => {
    prtobufType.encode({ objects: todos }).finish()
  }),

  b.add('avro', () => {
    type.toBuffer(todos)
  }),

  b.add('cbor', () => {
    cbor.encode(todos)
  }),

  b.add('cborx', () => {
    cborx.encode(todos)
  }),

  b.add('msgpack', () => {
    msgpackEncode(todos)
  }),

  b.add('msgpackr', () => {
    msgpackr.pack(todos)
  }),

  b.add('JSON', () => {
    JSON.stringify(todos)
  }),

  b.add('fast-json-stringify', () => {
    stringify(todos)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'serialize', version: '1.0.0' }),
  b.save({ file: 'serialize', format: 'chart.html' })
)
