import { createSer, createDes } from '../src/index.js'
import type { Ser, Des } from '../src/index.js'

let buffer

{ // Serialize
  const map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three']
  ])
  const ser: Ser = createSer()
  ser.serializeIterable(map, (ser, [k, v]) => {
    ser.serializeUInt32(k)
    ser.serializeString(v)
  })
  buffer = ser.getBuffer()
}

{ // Deserialize
  const des: Des = createDes(buffer)
  const map = new Map(des.deserializeIterable((des) => {
    return [des.deserializeUInt32(), des.deserializeString()]
  }))
  console.log(map)
}
