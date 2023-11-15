import t from 'node:test'
import assert from 'node:assert'
import { createSer, createDes } from '../src/index.js'

await t.test('boolean', async t => {
  const bools = [
    true, false
  ]

  for (const expected of bools) {
    await t.test(`serialize ${JSON.stringify(expected)}`, () => {
      const ser = createSer()
      ser.serializeBoolean(expected)

      const des = createDes(ser.getBuffer())

      const actual = des.deserializeBoolean()
      assert.equal(actual, expected)
    })
  }

  await t.test('serialize multiple boolean', () => {
    const ser = createSer()
    ser.serializeBoolean(true)
    ser.serializeBoolean(true)
    ser.serializeBoolean(false)
    ser.serializeBoolean(true)

    const des = createDes(ser.getBuffer())

    const n1 = des.deserializeBoolean()
    const n2 = des.deserializeBoolean()
    const n3 = des.deserializeBoolean()
    const n4 = des.deserializeBoolean()

    assert.equal(n1, true)
    assert.equal(n2, true)
    assert.equal(n3, false)
    assert.equal(n4, true)
  })
})

await t.test('uint32', async t => {
  const numbers = [
    0, 1, 10000
  ]

  for (const expected of numbers) {
    await t.test(`serialize ${expected}`, () => {
      const ser = createSer()
      ser.serializeUInt32(expected)

      const des = createDes(ser.getBuffer())

      const actual = des.deserializeUInt32()
      assert.equal(actual, expected)
    })
  }

  await t.test('serialize multiple numbers', () => {
    const ser = createSer()
    ser.serializeUInt32(1)
    ser.serializeUInt32(5)
    ser.serializeUInt32(123)
    ser.serializeUInt32(42)

    const des = createDes(ser.getBuffer())

    const n1 = des.deserializeUInt32()
    const n2 = des.deserializeUInt32()
    const n3 = des.deserializeUInt32()
    const n4 = des.deserializeUInt32()

    assert.equal(n1, 1)
    assert.equal(n2, 5)
    assert.equal(n3, 123)
    assert.equal(n4, 42)
  })
})

await t.test('float32', async t => {
  const numbers = [
    0.01, -0.1, 99.8
  ]

  for (const expected of numbers) {
    await t.test(`serialize ${expected}`, () => {
      const ser = createSer()
      ser.serializeFloat32(expected)

      const des = createDes(ser.getBuffer())

      const actual = des.deserializeFloat32()
      assert.ok(Math.abs(actual - expected) < 0.0001)
    })
  }

  await t.test('serialize multiple numbers', () => {
    const ser = createSer()
    ser.serializeFloat32(-3)
    ser.serializeFloat32(55.5)
    ser.serializeFloat32(42.42)
    ser.serializeFloat32(33.3)

    const des = createDes(ser.getBuffer())

    const n1 = des.deserializeFloat32()
    const n2 = des.deserializeFloat32()
    const n3 = des.deserializeFloat32()
    const n4 = des.deserializeFloat32()

    assert.ok(Math.abs(n1 - -3) < 0.0001)
    assert.ok(Math.abs(n2 - 55.5) < 0.0001)
    assert.ok(Math.abs(n3 - 42.42) < 0.0001)
    assert.ok(Math.abs(n4 - 33.3) < 0.0001)
  })
})

await t.test('string', async t => {
  const strings = [
    'f',
    'fo',
    'foo',
    'fooo',
    'fooof',
    'my name is Tommaso!',
    'my name is\nTommaso!',
    'my name is Tommaso!'.repeat(100),
    '',
    '👍',
    '👍👍',
    '👍👍👍',
    '👍👍👍👍',
    '👍👍👍👍👍',
    '☃',
    '☔',
    '🌈',
    '🏳️‍🌈',
    '⭕',
    'السلام عليكم',
    '我的名字是Tommaso',
    'विकिपीडिया',
    'Привет'
  ]

  for (const expected of strings) {
    await t.test(`serialize ${expected}`, () => {
      const ser = createSer()
      ser.serializeString(expected)

      const des = createDes(ser.getBuffer())

      const actual = des.deserializeString()
      assert.equal(actual, expected)
    })
  }

  await t.test('serialize multiple numbers', () => {
    const ser = createSer()
    ser.serializeString('a')
    ser.serializeString('b')
    ser.serializeString('c')

    const des = createDes(ser.getBuffer())

    const s1 = des.deserializeString()
    const s2 = des.deserializeString()
    const s3 = des.deserializeString()

    assert.equal(s1, 'a')
    assert.equal(s2, 'b')
    assert.equal(s3, 'c')
  })
})

await t.test('array', async t => {
  await t.test('array of uint32', async t => {
    const numbers = [
      [0, 1, 10000],
      []
    ]

    for (const expected of numbers) {
      await t.test(`serialize ${JSON.stringify(expected)}`, () => {
        const ser = createSer()
        ser.serializeArray(expected, (ser, n) => ser.serializeUInt32(n))

        const des = createDes(ser.getBuffer())

        const actual = des.deserializeArray(() => des.deserializeUInt32())
        assert.deepStrictEqual(actual, expected)
      })
    }
  })

  await t.test('array of string', async t => {
    const numbers = [
      ['f', 'foo', 'foof'],
      ['f', 'foo', '👍', '🏳️‍🌈'],
      []
    ]

    for (const expected of numbers) {
      await t.test(`serialize ${JSON.stringify(expected)}`, () => {
        const ser = createSer()
        ser.serializeArray(expected, (ser, n) => ser.serializeString(n))

        const des = createDes(ser.getBuffer())

        const actual = des.deserializeArray(() => des.deserializeString())
        assert.deepStrictEqual(actual, expected)
      })
    }
  })
})

await t.test('iterable', async t => {
  await t.test('map<number, number>', async t => {
    const expected: Map<number, number> = new Map([[0, 1], [2, 3], [4, 5]])

    const ser = createSer()
    ser.serializeIterable(expected.entries(), (ser, n) => {
      ser.serializeUInt32(n[0])
      ser.serializeUInt32(n[1])
    })

    const des = createDes(ser.getBuffer())
    const m = new Map(des.deserializeIterable(() => [des.deserializeUInt32(), des.deserializeUInt32()]))
    assert.deepStrictEqual(m, expected)
  })

  await t.test('map<string, number>', async t => {
    const expected: Map<string, number> = new Map([
      ['foo', 1],
      ['bar', 3],
      ['baz', 5]
    ])

    const ser = createSer()
    ser.serializeIterable(expected.entries(), (ser, n) => {
      ser.serializeString(n[0])
      ser.serializeUInt32(n[1])
    })

    const des = createDes(ser.getBuffer())
    const m = new Map(des.deserializeIterable(() => [des.deserializeString(), des.deserializeUInt32()]))
    assert.deepStrictEqual(m, expected)
  })

  await t.test('set<number>', async t => {
    const expected: Set<number> = new Set([1, 3, 5])

    const ser = createSer()
    ser.serializeIterable(expected.values(), (ser, n) => {
      ser.serializeUInt32(n)
    })

    const des = createDes(ser.getBuffer())
    const m = new Set(des.deserializeIterable(() => des.deserializeUInt32()))
    assert.deepStrictEqual(m, expected)
  })
})

await t.test('with option', async t => {
  await t.test('bufferSize', async t => {
    {
      const ser = createSer({ bufferSize: 4 })
      assert.equal(ser.buffer.byteLength, 4)
    }
    {
      const ser = createSer({ bufferSize: 8 })
      assert.equal(ser.buffer.byteLength, 8)
    }
    {
      const ser = createSer({ bufferSize: 2 ** 32 - 4 })
      assert.equal(ser.buffer.byteLength, 2 ** 32 - 4)
    }
    {
      assert.throws(() => createSer({ bufferSize: 2 ** 32 }), err => {
        return /bufferSize option must be strictly less than 2 \*\* 32/.test((err as Error).message)
      })
    }
  })
})

await t.test('random items', async t => {
  const elements: any[] = [
    { item: 'foo', serializer: 'serializeString', deserializer: 'deserializeString' },
    { item: 'bar', serializer: 'serializeString', deserializer: 'deserializeString' },
    { item: 3, serializer: 'serializeUInt32', deserializer: 'deserializeUInt32' },
    { item: 42, serializer: 'serializeUInt32', deserializer: 'deserializeUInt32' },
    { item: 0.6, serializer: 'serializeFloat32', deserializer: 'deserializeFloat32' },
    { item: -99.42, serializer: 'serializeFloat32', deserializer: 'deserializeFloat32' }
  ]

  const permutations: any[][] = permutator(elements)

  for (const permutation of permutations) {
    await t.test(`serialize ${JSON.stringify(permutation)}`, () => {
      const ser = createSer() as any
      for (const { item, serializer } of permutation) {
        ser[serializer](item)
      }

      const des = createDes(ser.getBuffer()) as any

      const actual = Object.entries(permutation.map(({ deserializer }) => des[deserializer]()))

      const notFloat = actual.filter(([, n]) => !isFloat(n))
      assert.deepStrictEqual(notFloat, Object.entries(permutation.map(({ item }) => item))
        .filter(([, n]) => !isFloat(n)))

      const expectedFloats = Object.entries(permutation.map(({ item }) => item))
        .filter(([, n]) => isFloat(n))
        .map(([, n]) => n)
      const floats = actual.filter(([, n]) => isFloat(n))
        .map(([, n]) => n)
      for (let i = 0; i < expectedFloats.length; i++) {
        assert.ok(Math.abs(expectedFloats[i] - floats[i]) < 0.0001)
      }
    })
  }
})

function permutator (inputArr: any): any[][] {
  const results: any[] = []

  function permute (arr: any, memo: any): any[] {
    let cur
    const c = memo

    for (let i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1)
      if (arr.length === 0) {
        results.push(c.concat(cur))
      }
      permute(arr.slice(), c.concat(cur))
      arr.splice(i, 0, cur[0])
    }

    return results
  }

  return permute(inputArr, [])
}

function isFloat (n: number): boolean {
  return Number(n) === n && n % 1 !== 0
}
