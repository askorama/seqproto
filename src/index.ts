
export type StrictArrayBuffer = ArrayBuffer & { buffer?: undefined }

const UINT32_BYTES = Uint32Array.BYTES_PER_ELEMENT

const TYPE_FLOAT = 0
const TYPE_UINT32 = 1
const TYPE_INT32 = 2
const POW_2_32 = 2 ** 32

export interface Ser {
  index: number
  buffer: ArrayBuffer
  wBuffer: DataView
  reset: () => void
  getBuffer: () => StrictArrayBuffer
  serializeBoolean: (b: boolean) => void
  serializeUInt32: (n: number) => void
  serializeFloat32: (n: number) => void
  serializeNumber: (n: number) => void
  serializeString: (str: string) => void
  serializeArray: <T>(arr: T[], serialize: (ser: Ser, t: T) => void) => void
  serializeIterable: <T>(iterable: Iterable<T>, serialize: (ser: Ser, t: T) => void) => void
  serializeIndexableArray: <T>(arr: T[], serialize: (ser: Ser, t: T) => void) => void
  unsafeSerializeUint32Array: (buffer: Uint32Array) => void
}

export interface Des {
  index: number
  buffer: StrictArrayBuffer
  wBuffer: DataView
  setBuffer: (buffer: StrictArrayBuffer, byteOffset?: number, byteLength?: number) => void
  deserializeBoolean: () => boolean
  deserializeUInt32: () => number
  deserializeFloat32: () => number
  deserializeNumber: () => number
  deserializeString: () => string
  deserializeArray: <T>(deserialize: (des: Des) => T) => T[]
  deserializeIterable: <T>(deserialize: (des: Des) => T) => Iterable<T>
  unsafeDeserializeUint32Array: () => Uint32Array
  getArrayElements: <T>(indexes: number[], deserialize: (des: Des, start: number, end: number) => T) => T[]
}

interface CreateSerOption {
  bufferSize?: number
}

export function createSer ({ bufferSize }: CreateSerOption = {}): Ser {
  const size = bufferSize ?? 2 ** 24
  if (size >= POW_2_32) {
    throw new Error('bufferSize option must be strictly less than 2 ** 32')
  }

  const buffer = new ArrayBuffer(size)
  return {
    index: 0,
    buffer,
    wBuffer: new DataView(buffer),
    reset: function () { this.index = 0 },
    serializeBoolean,
    serializeUInt32,
    serializeFloat32,
    serializeNumber,
    serializeString,
    serializeArray,
    serializeIterable,
    serializeIndexableArray,
    unsafeSerializeUint32Array,
    getBuffer: function () { return this.buffer.slice(0, this.index * 4) }
  }
}

export function createDes (buffer: StrictArrayBuffer): Des {
  return {
    index: 0,
    buffer,
    wBuffer: new DataView(buffer),
    setBuffer: function (buffer: StrictArrayBuffer, byteOffset?: number, byteLength?: number) {
      if (typeof byteOffset === 'number' && typeof byteLength === 'number') {
        this.index = byteOffset
        this.buffer = buffer
        this.wBuffer = new DataView(buffer)

        return
      }

      this.buffer = buffer
      this.index = 0
      this.wBuffer = new DataView(buffer)
    },
    deserializeBoolean,
    deserializeUInt32,
    deserializeFloat32,
    deserializeNumber,
    deserializeString,
    deserializeArray,
    deserializeIterable,
    getArrayElements,
    unsafeDeserializeUint32Array
  }
}

function serializeBoolean (this: Ser, b: boolean): void {
  this.wBuffer.setUint8(this.index++, b ? 1:0)
}

function deserializeBoolean (this: Ser): boolean {
  return this.wBuffer.getUint8(this.index++) === 1
}

function serializeUInt32 (this: Ser, n: number): void {
  this.wBuffer.setUint32(this.index, n)
  this.index += UINT32_BYTES
}

function deserializeUInt32 (this: Des): number {
  const rest = this.wBuffer.getUint32(this.index)
  this.index += UINT32_BYTES

  return rest
}

function serializeFloat32 (this: Ser, n: number): void {
  this.wBuffer.setFloat32(this.index, n)
  this.index += UINT32_BYTES
}

function deserializeFloat32 (this: Des): number {
  const rest = this.wBuffer.getFloat32(this.index)
  this.index += UINT32_BYTES

  return rest
}

function serializeNumber (this: Ser, n: number): void {
  // If it's not an integer
  if (n % 1 !== 0) {
    this.wBuffer.setUint32(this.index, TYPE_FLOAT)
    this.index += UINT32_BYTES

    this.serializeFloat32(n)
  } else if (n >= 0) {
    this.wBuffer.setUint32(this.index, TYPE_UINT32)
    this.index += UINT32_BYTES

    this.serializeUInt32(n)
  } else {
    this.wBuffer.setUint32(this.index, TYPE_INT32)
    this.index += UINT32_BYTES

    this.wBuffer.setUint32(this.index, POW_2_32 + n)
    this.index += UINT32_BYTES
  }
}
function deserializeNumber (this: Des): number {
  const type = this.wBuffer.getUint32(this.index)
  this.index += UINT32_BYTES

  if (type === TYPE_FLOAT) {
    return this.deserializeFloat32()
  } else if (type === TYPE_UINT32) {
    return this.deserializeUInt32()
  } else if (type === TYPE_INT32) {
    const ret = this.wBuffer.getUint32(this.index) - POW_2_32
    this.index += UINT32_BYTES

    return ret
  } else {
    throw new Error('Unknown type')
  }
}

const textEncoder = new TextEncoder()
function serializeString (this: Ser, str: string): void {
  const r = textEncoder.encodeInto(str, new Uint8Array(this.buffer, this.index + UINT32_BYTES))

  this.wBuffer.setUint32(this.index, r.written)
  this.index += UINT32_BYTES + r.written
}

const textDecoder = new TextDecoder()
function deserializeString (this: Des): string {
  const len = this.wBuffer.getUint32(this.index)
  this.index += UINT32_BYTES

  const decoded = textDecoder.decode(new Uint8Array(this.buffer, this.index, len))
  this.index += len

  return decoded
}

function serializeArray<T> (this: Ser, arr: T[], serialize: (ser: Ser, t: T) => void): void {
  const len = arr.length
  this.serializeUInt32(len)
  for (let i = 0; i < len; i++) {
    serialize(this, arr[i])
  }
}
function deserializeArray<T> (this: Des, deserialize: (ser: Des) => T): T[] {
  const len = this.deserializeUInt32()
  const arr = new Array(len)
  for (let i = 0; i < len; i++) {
    arr[i] = deserialize(this)
  }
  return arr
}

function serializeIterable<T> (this: Ser, iterable: Iterable<T>, serialize: (ser: Ser, t: T) => void): void {
  // Keep space for the length
  const currentIndex = this.index

  this.index += UINT32_BYTES

  let n = 0
  for (const t of iterable) {
    n++
    serialize(this, t)
  }

  this.wBuffer.setUint32(currentIndex, n)
}

function deserializeIterable<T> (this: Des, deserialize: (des: Des) => T): Iterable<T> {
  const len = this.deserializeUInt32()
  const aGeneratorObject = (function * (des) {
    for (let i = 0; i < len; i++) {
      yield deserialize(des)
    }
  })(this)

  return {
    [Symbol.iterator] () {
      return aGeneratorObject
    }
  }
}

function unsafeSerializeUint32Array (this: Ser, arr: Uint32Array): void {
  const length = Math.ceil(arr.byteLength / 4)

  this.wBuffer.setUint32(this.index, length)
  this.index += UINT32_BYTES

  for(let i = 0; i < arr.length; i ++) {
    this.wBuffer.setUint32(this.index, arr[i])
    this.index += UINT32_BYTES
  }
}

function unsafeDeserializeUint32Array (this: Des): Uint32Array {
  const byteLength = this.wBuffer.getUint32(this.index)
  this.index += UINT32_BYTES

  const d = new Uint32Array(byteLength)

  for(let i = 0; i < d.length; i ++) {
    d[i] = this.wBuffer.getUint32(this.index)
    this.index += UINT32_BYTES
  }

  return d
}

function serializeIndexableArray<T> (this: Ser, arr: T[], serialize: (ser: Ser, t: T) => void): void {
  const l = arr.length

  this.wBuffer.setUint32(this.index, l)
  this.index += UINT32_BYTES

  let indexOffsets = this.index

  this.index += (l * (UINT32_BYTES + UINT32_BYTES))

  // Skip the size of the array multiplied by 8 (4 bytes for the start, 4bytes for the length)
  
  for (let i = 0; i < l; i++) {
    const offsetStart = this.index
    serialize(this, arr[i])
    const offsetEnd = this.index

    this.wBuffer.setUint32(indexOffsets, offsetStart)
    indexOffsets += UINT32_BYTES

    this.wBuffer.setUint32(indexOffsets, offsetEnd - offsetStart)
    indexOffsets += UINT32_BYTES
  }
}

function getArrayElements<T> (this: Des, indexes: number[], deserialize: (des: Des, start: number, end: number) => T): T[] {
  const currentIndex = this.index + UINT32_BYTES
  const l = indexes.length
  const arr = new Array(l)

  for (let i = 0; i < l; i++) {
    const indexOffset = currentIndex + (indexes[i] * (UINT32_BYTES + UINT32_BYTES))

    const start = this.wBuffer.getUint32(indexOffset)
    const end = this.wBuffer.getUint32(indexOffset + UINT32_BYTES)

    arr[i] = deserialize(this, start, end)
  }

  return arr
}
