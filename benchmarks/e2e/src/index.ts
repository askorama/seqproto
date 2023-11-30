import fastify from 'fastify'
import { readFile } from 'fs/promises'
import { createSer } from 'seqproto'
import avro from 'avsc'
import fStatic from '@fastify/static'
import path from 'node:path'

// Load data

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}
const todos: Todo[] = JSON.parse(await readFile('./src/data/todos.json', 'utf8'))

// Avro schema
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

// seqproto serializer
const ser = createSer()

const server = fastify()

server.register(fStatic, {
  root: path.resolve('public'),
  prefix: '/public/', // optional: default '/'
  cacheControl: true, // optional: default true
})

server.get('/seqproto.js', async (request, reply) => {
  reply.type('application/javascript')
  return readFile('./node_modules/seqproto/dist/esm/index.js', 'utf8')
})

server.get('/todos', {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'number' },
            id: { type: 'number' },
            title: { type: 'string' },
            completed: { type: 'boolean' }
          }
        }
      }
    }
  }
}, async (request) => {
  if (request.headers.accept === 'application/seqproto') { 
    ser.reset()
    ser.serializeArray(todos, (ser, todo) => {
      ser.serializeUInt32(todo.id)
      ser.serializeUInt32(todo.userId)
      ser.serializeString(todo.title)
      ser.serializeBoolean(todo.completed)
    })
    const arrBuffer = ser.getBuffer()
    return new Uint8Array(arrBuffer)
  }
  if (request.headers.accept === 'application/avro') { 
    return type.toBuffer(todos)
  }

  return todos
})

const d = await server.listen({ port: 3000 })
console.log(d)

