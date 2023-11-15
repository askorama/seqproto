
export interface Ser {
  index: number
  buffer: ArrayBuffer
  uint32Array: Uint32Array
  float32Array: Float32Array
  getBuffer: () => ArrayBuffer
  serializeBoolean: (b: boolean) => void
  serializeUInt32: (n: number) => void
  serializeFloat32: (n: number) => void
  serializeString: (str: string) => void
  serializeArray: <T>(arr: T[], serialize: (ser: Ser, t: T) => void) => void
  serializeIterable: <T>(iterable: Iterable<T>, serialize: (ser: Ser, t: T) => void) => void
}
export interface Des {
  index: number
  buffer: ArrayBuffer
  uint32Array: Uint32Array
  float32Array: Float32Array
  setBuffer: (buffer: ArrayBuffer) => void
  deserializeBoolean: () => boolean
  deserializeUInt32: () => number
  deserializeFloat32: () => number
  deserializeString: () => string
  deserializeArray: <T>(deserialize: (des: Des) => T) => T[]
  deserializeIterable: <T>(deserialize: (des: Des) => T) => Iterable<T>
}

interface CreateSerOption {
  bufferSize?: number
}
export function createSer ({ bufferSize }: CreateSerOption = {}): Ser {
  const size = bufferSize ?? 2 ** 24
  if (size >= 2 ** 32) {
    throw new Error('bufferSize option must be strictly less than 2 ** 32')
  }

  const buffer = new ArrayBuffer(size)
  return {
    index: 0,
    buffer,
    uint32Array: new Uint32Array(buffer),
    float32Array: new Float32Array(buffer),
    serializeBoolean,
    serializeUInt32,
    serializeFloat32,
    serializeString,
    serializeArray,
    serializeIterable,
    getBuffer: function () { return this.buffer.slice(0, this.index * 4) }
  }
}

export function createDes (buffer: ArrayBuffer): Des {
  const n32 = Math.floor(buffer.byteLength / 4)

  return {
    index: 0,
    buffer,
    uint32Array: new Uint32Array(buffer, 0, n32),
    float32Array: new Float32Array(buffer, 0, n32),
    setBuffer: function (buffer: ArrayBuffer) {
      const n32 = Math.floor(buffer.byteLength / 4)
      this.buffer = buffer
      this.index = 0
      this.uint32Array = new Uint32Array(buffer, 0, n32)
      this.float32Array = new Float32Array(buffer, 0, n32)
    },
    deserializeBoolean,
    deserializeUInt32,
    deserializeFloat32,
    deserializeString,
    deserializeArray,
    deserializeIterable
  }
}

function serializeBoolean (this: Ser, b: boolean): void {
  this.uint32Array[this.index++] = b ? 1 : 0
}
function deserializeBoolean (this: Ser): boolean {
  return this.uint32Array[this.index++] === 1
}

function serializeUInt32 (this: Ser, n: number): void {
  this.uint32Array[this.index++] = n
}
function deserializeUInt32 (this: Des): number {
  return this.uint32Array[this.index++]
}
function serializeFloat32 (this: Ser, n: number): void {
  this.float32Array[this.index++] = n
}
function deserializeFloat32 (this: Des): number {
  return this.float32Array[this.index++]
}

const textEncoder = new TextEncoder()
function serializeString (this: Ser, str: string): void {
  const r = textEncoder.encodeInto(str, new Uint8Array(this.buffer, (this.index + 1) * 4))
  this.uint32Array[this.index] = r.written
  this.index += Math.ceil(r.written / 4) + 1
}

const textDecoder = new TextDecoder()
function deserializeString (this: Des): string {
  const len = this.uint32Array[this.index++]
  const decoded = textDecoder.decode(new Uint8Array(this.buffer, this.index * 4, len))
  this.index += Math.ceil(len / 4)
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
  const currentIndex = this.index++
  let n = 0
  for (const t of iterable) {
    n++
    serialize(this, t)
  }
  this.uint32Array[currentIndex] = n
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
