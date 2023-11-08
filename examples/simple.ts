import { createSer, createDes } from '../src/index.js'
import type { Ser, Des } from '../src/index'

const ser: Ser = createSer()

ser.serializeBoolean(true)
ser.serializeUInt32(42)
ser.serializeFloat32(-0.5)
ser.serializeString('hello world')
ser.serializeArray([1, 2, 3], (ser, n) => ser.serializeUInt32(n))

const buffer = ser.getBuffer()

const des: Des = createDes(buffer)

const b = des.deserializeBoolean()
const i = des.deserializeUInt32()
const f = des.deserializeFloat32()
const s = des.deserializeString()
const a = des.deserializeArray((des) => des.deserializeUInt32())

console.log({ b, i, f, s, a })
