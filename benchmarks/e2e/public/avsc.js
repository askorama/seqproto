(function (f) { if (typeof exports === 'object' && typeof module !== 'undefined') { module.exports = f() } else if (typeof define === 'function' && define.amd) { define([], f) } else { let g; if (typeof window !== 'undefined') { g = window } else if (typeof global !== 'undefined') { g = global } else if (typeof self !== 'undefined') { g = self } else { g = this }g.avsc = f() } })(function () {
  let define, module, exports; return (function () { function r (e, n, t) { function o (i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error("Cannot find module '" + i + "'"); throw a.code = 'MODULE_NOT_FOUND', a } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { const n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
    1: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict'

          const objectAssign = require('object.assign/polyfill')()

          // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
          // original notice:

          /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
          function compare (a, b) {
            if (a === b) {
              return 0
            }

            let x = a.length
            let y = b.length

            for (let i = 0, len = Math.min(x, y); i < len; ++i) {
              if (a[i] !== b[i]) {
                x = a[i]
                y = b[i]
                break
              }
            }

            if (x < y) {
              return -1
            }
            if (y < x) {
              return 1
            }
            return 0
          }
          function isBuffer (b) {
            if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
              return global.Buffer.isBuffer(b)
            }
            return !!(b != null && b._isBuffer)
          }

          // based on node assert, original notice:
          // NB: The URL to the CommonJS spec is kept just for tradition.
          //     node-assert has evolved a lot since then, both in API and behavior.

          // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
          //
          // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
          //
          // Originally from narwhal.js (http://narwhaljs.org)
          // Copyright (c) 2009 Thomas Robinson <280north.com>
          //
          // Permission is hereby granted, free of charge, to any person obtaining a copy
          // of this software and associated documentation files (the 'Software'), to
          // deal in the Software without restriction, including without limitation the
          // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
          // sell copies of the Software, and to permit persons to whom the Software is
          // furnished to do so, subject to the following conditions:
          //
          // The above copyright notice and this permission notice shall be included in
          // all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
          // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
          // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

          const util = require('util/')
          const hasOwn = Object.prototype.hasOwnProperty
          const pSlice = Array.prototype.slice
          const functionsHaveNames = (function () {
            return function foo () {}.name === 'foo'
          }())
          function pToString (obj) {
            return Object.prototype.toString.call(obj)
          }
          function isView (arrbuf) {
            if (isBuffer(arrbuf)) {
              return false
            }
            if (typeof global.ArrayBuffer !== 'function') {
              return false
            }
            if (typeof ArrayBuffer.isView === 'function') {
              return ArrayBuffer.isView(arrbuf)
            }
            if (!arrbuf) {
              return false
            }
            if (arrbuf instanceof DataView) {
              return true
            }
            if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
              return true
            }
            return false
          }
          // 1. The assert module provides functions that throw
          // AssertionError's when particular conditions are not met. The
          // assert module must conform to the following interface.

          const assert = module.exports = ok

          // 2. The AssertionError is defined in assert.
          // new assert.AssertionError({ message: message,
          //                             actual: actual,
          //                             expected: expected })

          const regex = /\s*function\s+([^\(\s]*)\s*/
          // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
          function getName (func) {
            if (!util.isFunction(func)) {
              return
            }
            if (functionsHaveNames) {
              return func.name
            }
            const str = func.toString()
            const match = str.match(regex)
            return match && match[1]
          }
          assert.AssertionError = function AssertionError (options) {
            this.name = 'AssertionError'
            this.actual = options.actual
            this.expected = options.expected
            this.operator = options.operator
            if (options.message) {
              this.message = options.message
              this.generatedMessage = false
            } else {
              this.message = getMessage(this)
              this.generatedMessage = true
            }
            const stackStartFunction = options.stackStartFunction || fail
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, stackStartFunction)
            } else {
              // non v8 browsers so we can have a stacktrace
              const err = new Error()
              if (err.stack) {
                let out = err.stack

                // try to strip useless frames
                const fn_name = getName(stackStartFunction)
                const idx = out.indexOf('\n' + fn_name)
                if (idx >= 0) {
                  // once we have located the function frame
                  // we need to strip out everything before it (and its line)
                  const next_line = out.indexOf('\n', idx + 1)
                  out = out.substring(next_line + 1)
                }

                this.stack = out
              }
            }
          }

          // assert.AssertionError instanceof Error
          util.inherits(assert.AssertionError, Error)

          function truncate (s, n) {
            if (typeof s === 'string') {
              return s.length < n ? s : s.slice(0, n)
            } else {
              return s
            }
          }
          function inspect (something) {
            if (functionsHaveNames || !util.isFunction(something)) {
              return util.inspect(something)
            }
            const rawname = getName(something)
            const name = rawname ? ': ' + rawname : ''
            return '[Function' + name + ']'
          }
          function getMessage (self) {
            return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128)
          }

          // At present only the three keys mentioned above are used and
          // understood by the spec. Implementations or sub modules can pass
          // other keys to the AssertionError's constructor - they will be
          // ignored.

          // 3. All of the following functions must throw an AssertionError
          // when a corresponding condition is not met, with a message that
          // may be undefined if not provided.  All assertion methods provide
          // both the actual and expected values to the assertion error for
          // display purposes.

          function fail (actual, expected, message, operator, stackStartFunction) {
            throw new assert.AssertionError({
              message,
              actual,
              expected,
              operator,
              stackStartFunction
            })
          }

          // EXTENSION! allows for well behaved errors defined elsewhere.
          assert.fail = fail

          // 4. Pure assertion tests whether a value is truthy, as determined
          // by !!guard.
          // assert.ok(guard, message_opt);
          // This statement is equivalent to assert.equal(true, !!guard,
          // message_opt);. To test strictly for the value true, use
          // assert.strictEqual(true, guard, message_opt);.

          function ok (value, message) {
            if (!value) fail(value, true, message, '==', assert.ok)
          }
          assert.ok = ok

          // 5. The equality assertion tests shallow, coercive equality with
          // ==.
          // assert.equal(actual, expected, message_opt);

          assert.equal = function equal (actual, expected, message) {
            if (actual != expected) fail(actual, expected, message, '==', assert.equal)
          }

          // 6. The non-equality assertion tests for whether two objects are not equal
          // with != assert.notEqual(actual, expected, message_opt);

          assert.notEqual = function notEqual (actual, expected, message) {
            if (actual == expected) {
              fail(actual, expected, message, '!=', assert.notEqual)
            }
          }

          // 7. The equivalence assertion tests a deep equality relation.
          // assert.deepEqual(actual, expected, message_opt);

          assert.deepEqual = function deepEqual (actual, expected, message) {
            if (!_deepEqual(actual, expected, false)) {
              fail(actual, expected, message, 'deepEqual', assert.deepEqual)
            }
          }

          assert.deepStrictEqual = function deepStrictEqual (actual, expected, message) {
            if (!_deepEqual(actual, expected, true)) {
              fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual)
            }
          }

          function _deepEqual (actual, expected, strict, memos) {
            // 7.1. All identical values are equivalent, as determined by ===.
            if (actual === expected) {
              return true
            } else if (isBuffer(actual) && isBuffer(expected)) {
              return compare(actual, expected) === 0

              // 7.2. If the expected value is a Date object, the actual value is
              // equivalent if it is also a Date object that refers to the same time.
            } else if (util.isDate(actual) && util.isDate(expected)) {
              return actual.getTime() === expected.getTime()

              // 7.3 If the expected value is a RegExp object, the actual value is
              // equivalent if it is also a RegExp object with the same source and
              // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
            } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
              return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase

              // 7.4. Other pairs that do not both pass typeof value == 'object',
              // equivalence is determined by ==.
            } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
              return strict ? actual === expected : actual == expected

              // If both values are instances of typed arrays, wrap their underlying
              // ArrayBuffers in a Buffer each to increase performance
              // This optimization requires the arrays to have the same type as checked by
              // Object.prototype.toString (aka pToString). Never perform binary
              // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
              // bit patterns are not identical.
            } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
              return compare(new Uint8Array(actual.buffer),
                new Uint8Array(expected.buffer)) === 0

              // 7.5 For all other Object pairs, including Array objects, equivalence is
              // determined by having the same number of owned properties (as verified
              // with Object.prototype.hasOwnProperty.call), the same set of keys
              // (although not necessarily the same order), equivalent values for every
              // corresponding key, and an identical 'prototype' property. Note: this
              // accounts for both named and indexed properties on Arrays.
            } else if (isBuffer(actual) !== isBuffer(expected)) {
              return false
            } else {
              memos = memos || { actual: [], expected: [] }

              const actualIndex = memos.actual.indexOf(actual)
              if (actualIndex !== -1) {
                if (actualIndex === memos.expected.indexOf(expected)) {
                  return true
                }
              }

              memos.actual.push(actual)
              memos.expected.push(expected)

              return objEquiv(actual, expected, strict, memos)
            }
          }

          function isArguments (object) {
            return Object.prototype.toString.call(object) == '[object Arguments]'
          }

          function objEquiv (a, b, strict, actualVisitedObjects) {
            if (a === null || a === undefined || b === null || b === undefined) { return false }
            // if one is a primitive, the other must be same
            if (util.isPrimitive(a) || util.isPrimitive(b)) { return a === b }
            if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) { return false }
            const aIsArgs = isArguments(a)
            const bIsArgs = isArguments(b)
            if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) { return false }
            if (aIsArgs) {
              a = pSlice.call(a)
              b = pSlice.call(b)
              return _deepEqual(a, b, strict)
            }
            const ka = objectKeys(a)
            const kb = objectKeys(b)
            let key, i
            // having the same number of owned properties (keys incorporates
            // hasOwnProperty)
            if (ka.length !== kb.length) { return false }
            // the same set of keys (although not necessarily the same order),
            ka.sort()
            kb.sort()
            // ~~~cheap key test
            for (i = ka.length - 1; i >= 0; i--) {
              if (ka[i] !== kb[i]) { return false }
            }
            // equivalent values for every corresponding key, and
            // ~~~possibly expensive deep test
            for (i = ka.length - 1; i >= 0; i--) {
              key = ka[i]
              if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects)) { return false }
            }
            return true
          }

          // 8. The non-equivalence assertion tests for any deep inequality.
          // assert.notDeepEqual(actual, expected, message_opt);

          assert.notDeepEqual = function notDeepEqual (actual, expected, message) {
            if (_deepEqual(actual, expected, false)) {
              fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual)
            }
          }

          assert.notDeepStrictEqual = notDeepStrictEqual
          function notDeepStrictEqual (actual, expected, message) {
            if (_deepEqual(actual, expected, true)) {
              fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual)
            }
          }

          // 9. The strict equality assertion tests strict equality, as determined by ===.
          // assert.strictEqual(actual, expected, message_opt);

          assert.strictEqual = function strictEqual (actual, expected, message) {
            if (actual !== expected) {
              fail(actual, expected, message, '===', assert.strictEqual)
            }
          }

          // 10. The strict non-equality assertion tests for strict inequality, as
          // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

          assert.notStrictEqual = function notStrictEqual (actual, expected, message) {
            if (actual === expected) {
              fail(actual, expected, message, '!==', assert.notStrictEqual)
            }
          }

          function expectedException (actual, expected) {
            if (!actual || !expected) {
              return false
            }

            if (Object.prototype.toString.call(expected) == '[object RegExp]') {
              return expected.test(actual)
            }

            try {
              if (actual instanceof expected) {
                return true
              }
            } catch (e) {
              // Ignore.  The instanceof check doesn't work for arrow functions.
            }

            if (Error.isPrototypeOf(expected)) {
              return false
            }

            return expected.call({}, actual) === true
          }

          function _tryBlock (block) {
            let error
            try {
              block()
            } catch (e) {
              error = e
            }
            return error
          }

          function _throws (shouldThrow, block, expected, message) {
            let actual

            if (typeof block !== 'function') {
              throw new TypeError('"block" argument must be a function')
            }

            if (typeof expected === 'string') {
              message = expected
              expected = null
            }

            actual = _tryBlock(block)

            message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.')

            if (shouldThrow && !actual) {
              fail(actual, expected, 'Missing expected exception' + message)
            }

            const userProvidedMessage = typeof message === 'string'
            const isUnwantedException = !shouldThrow && util.isError(actual)
            const isUnexpectedException = !shouldThrow && actual && !expected

            if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
              fail(actual, expected, 'Got unwanted exception' + message)
            }

            if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
              throw actual
            }
          }

          // 11. Expected to throw an error:
          // assert.throws(block, Error_opt, message_opt);

          assert.throws = function (block, /* optional */error, /* optional */message) {
            _throws(true, block, error, message)
          }

          // EXTENSION! This is annoying to write outside this module.
          assert.doesNotThrow = function (block, /* optional */error, /* optional */message) {
            _throws(false, block, error, message)
          }

          assert.ifError = function (err) { if (err) throw err }

          // Expose a strict only variant of assert
          function strict (value, message) {
            if (!value) fail(value, true, message, '==', strict)
          }
          assert.strict = objectAssign(strict, assert, {
            equal: assert.strictEqual,
            deepEqual: assert.deepStrictEqual,
            notEqual: assert.notStrictEqual,
            notDeepEqual: assert.notDeepStrictEqual
          })
          assert.strict.strict = assert.strict

          var objectKeys = Object.keys || function (obj) {
            const keys = []
            for (const key in obj) {
              if (hasOwn.call(obj, key)) keys.push(key)
            }
            return keys
          }
        }).call(this)
      }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, { 'object.assign/polyfill': 43, 'util/': 77 }],
    2: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict'

          const possibleNames = [
            'BigInt64Array',
            'BigUint64Array',
            'Float32Array',
            'Float64Array',
            'Int16Array',
            'Int32Array',
            'Int8Array',
            'Uint16Array',
            'Uint32Array',
            'Uint8Array',
            'Uint8ClampedArray'
          ]

          const g = typeof globalThis === 'undefined' ? global : globalThis

          module.exports = function availableTypedArrays () {
            const out = []
            for (let i = 0; i < possibleNames.length; i++) {
              if (typeof g[possibleNames[i]] === 'function') {
                out[out.length] = possibleNames[i]
              }
            }
            return out
          }
        }).call(this)
      }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, {}],
    3: [function (require, module, exports) {
    /* jshint browserify: true */

      'use strict'

      /**
 * Optional entry point for browser builds.
 *
 * To use it: `require('avsc/etc/browser/avsc-services')`.
 */

      const avroTypes = require('./avsc-types')
      const services = require('../../lib/services')
      const specs = require('../../lib/specs')
      const utils = require('../../lib/utils')

      /** Slightly enhanced parsing, supporting IDL declarations. */
      function parse (any, opts) {
        const schemaOrProtocol = specs.read(any)
        return schemaOrProtocol.protocol
          ? services.Service.forProtocol(schemaOrProtocol, opts)
          : avroTypes.Type.forSchema(schemaOrProtocol, opts)
      }

      module.exports = {
        Service: services.Service,
        assembleProtocol: specs.assembleProtocol,
        discoverProtocol: services.discoverProtocol,
        parse,
        readProtocol: specs.readProtocol,
        readSchema: specs.readSchema
      }

      utils.copyOwnProperties(avroTypes, module.exports)
    }, { '../../lib/services': 8, '../../lib/specs': 9, '../../lib/utils': 11, './avsc-types': 4 }],
    4: [function (require, module, exports) {
    /* jshint browserify: true */

      'use strict'

      /**
 * Optional entry point for browser builds.
 *
 * To use it: `require('avsc/etc/browser/avsc-types')`.
 */

      const types = require('../../lib/types')

      /** Basic parse method, only supporting JSON parsing. */
      function parse (any, opts) {
        let schema
        if (typeof any === 'string') {
          try {
            schema = JSON.parse(any)
          } catch (err) {
            schema = any
          }
        } else {
          schema = any
        }
        return types.Type.forSchema(schema, opts)
      }

      module.exports = {
        Type: types.Type,
        parse,
        types: types.builtins,
        // Deprecated exports (not using `util.deprecate` since it causes stack
        // overflow errors in the browser).
        combine: types.Type.forTypes,
        infer: types.Type.forValue
      }
    }, { '../../lib/types': 10 }],
    5: [function (require, module, exports) {
    /* jshint browserify: true */

      'use strict'

      /**
 * Shim to enable schema fingerprint computation.
 *
 * MD5 implementation originally from [1], used with permission from the
 * author, and lightly edited.
 *
 * [1] http://www.myersdaily.org/joseph/javascript/md5-text.html
 *
 */

      const buffer = require('buffer')
      const Buffer = buffer.Buffer

      function createHash (algorithm) {
        if (algorithm !== 'md5') {
          throw new Error('only md5 is supported in the browser')
        }
        return new Hash()
      }

      function Hash () { this.data = undefined }
      Hash.prototype.end = function (data) { this.data = data }
      Hash.prototype.read = function () { return md5(this.data) }

      function md5cycle (x, k) {
        let a = x[0]; let b = x[1]; let c = x[2]; let d = x[3]

        a = ff(a, b, c, d, k[0], 7, -680876936)
        d = ff(d, a, b, c, k[1], 12, -389564586)
        c = ff(c, d, a, b, k[2], 17, 606105819)
        b = ff(b, c, d, a, k[3], 22, -1044525330)
        a = ff(a, b, c, d, k[4], 7, -176418897)
        d = ff(d, a, b, c, k[5], 12, 1200080426)
        c = ff(c, d, a, b, k[6], 17, -1473231341)
        b = ff(b, c, d, a, k[7], 22, -45705983)
        a = ff(a, b, c, d, k[8], 7, 1770035416)
        d = ff(d, a, b, c, k[9], 12, -1958414417)
        c = ff(c, d, a, b, k[10], 17, -42063)
        b = ff(b, c, d, a, k[11], 22, -1990404162)
        a = ff(a, b, c, d, k[12], 7, 1804603682)
        d = ff(d, a, b, c, k[13], 12, -40341101)
        c = ff(c, d, a, b, k[14], 17, -1502002290)
        b = ff(b, c, d, a, k[15], 22, 1236535329)

        a = gg(a, b, c, d, k[1], 5, -165796510)
        d = gg(d, a, b, c, k[6], 9, -1069501632)
        c = gg(c, d, a, b, k[11], 14, 643717713)
        b = gg(b, c, d, a, k[0], 20, -373897302)
        a = gg(a, b, c, d, k[5], 5, -701558691)
        d = gg(d, a, b, c, k[10], 9, 38016083)
        c = gg(c, d, a, b, k[15], 14, -660478335)
        b = gg(b, c, d, a, k[4], 20, -405537848)
        a = gg(a, b, c, d, k[9], 5, 568446438)
        d = gg(d, a, b, c, k[14], 9, -1019803690)
        c = gg(c, d, a, b, k[3], 14, -187363961)
        b = gg(b, c, d, a, k[8], 20, 1163531501)
        a = gg(a, b, c, d, k[13], 5, -1444681467)
        d = gg(d, a, b, c, k[2], 9, -51403784)
        c = gg(c, d, a, b, k[7], 14, 1735328473)
        b = gg(b, c, d, a, k[12], 20, -1926607734)

        a = hh(a, b, c, d, k[5], 4, -378558)
        d = hh(d, a, b, c, k[8], 11, -2022574463)
        c = hh(c, d, a, b, k[11], 16, 1839030562)
        b = hh(b, c, d, a, k[14], 23, -35309556)
        a = hh(a, b, c, d, k[1], 4, -1530992060)
        d = hh(d, a, b, c, k[4], 11, 1272893353)
        c = hh(c, d, a, b, k[7], 16, -155497632)
        b = hh(b, c, d, a, k[10], 23, -1094730640)
        a = hh(a, b, c, d, k[13], 4, 681279174)
        d = hh(d, a, b, c, k[0], 11, -358537222)
        c = hh(c, d, a, b, k[3], 16, -722521979)
        b = hh(b, c, d, a, k[6], 23, 76029189)
        a = hh(a, b, c, d, k[9], 4, -640364487)
        d = hh(d, a, b, c, k[12], 11, -421815835)
        c = hh(c, d, a, b, k[15], 16, 530742520)
        b = hh(b, c, d, a, k[2], 23, -995338651)

        a = ii(a, b, c, d, k[0], 6, -198630844)
        d = ii(d, a, b, c, k[7], 10, 1126891415)
        c = ii(c, d, a, b, k[14], 15, -1416354905)
        b = ii(b, c, d, a, k[5], 21, -57434055)
        a = ii(a, b, c, d, k[12], 6, 1700485571)
        d = ii(d, a, b, c, k[3], 10, -1894986606)
        c = ii(c, d, a, b, k[10], 15, -1051523)
        b = ii(b, c, d, a, k[1], 21, -2054922799)
        a = ii(a, b, c, d, k[8], 6, 1873313359)
        d = ii(d, a, b, c, k[15], 10, -30611744)
        c = ii(c, d, a, b, k[6], 15, -1560198380)
        b = ii(b, c, d, a, k[13], 21, 1309151649)
        a = ii(a, b, c, d, k[4], 6, -145523070)
        d = ii(d, a, b, c, k[11], 10, -1120210379)
        c = ii(c, d, a, b, k[2], 15, 718787259)
        b = ii(b, c, d, a, k[9], 21, -343485551)

        x[0] = add32(a, x[0])
        x[1] = add32(b, x[1])
        x[2] = add32(c, x[2])
        x[3] = add32(d, x[3])
      }

      function cmn (q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t))
        return add32((a << s) | (a >>> (32 - s)), b)
      }

      function ff (a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t)
      }

      function gg (a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t)
      }

      function hh (a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t)
      }

      function ii (a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t)
      }

      function md51 (s) {
        const n = s.length
        const state = [1732584193, -271733879, -1732584194, 271733878]; let i
        for (i = 64; i <= s.length; i += 64) {
          md5cycle(state, md5blk(s.substring(i - 64, i)))
        }

        s = s.substring(i - 64)
        const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (i = 0; i < s.length; i++) {
          tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3)
        if (i > 55) {
          md5cycle(state, tail)
          for (i = 0; i < 16; i++) {
            tail[i] = 0
          }
        }
        tail[14] = n * 8
        md5cycle(state, tail)
        return state
      }

      function md5blk (s) {
        const md5blks = []; let i
        for (i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24)
        }
        return md5blks
      }

      function md5 (s) {
        const arr = md51(s)
        const buf = Buffer.alloc ? Buffer.alloc(16) : new Buffer(16)
        let i
        for (i = 0; i < 4; i++) {
          buf.writeIntLE(arr[i], i * 4, 4)
        }
        return buf
      }

      function add32 (a, b) {
        return (a + b) & 0xFFFFFFFF
      }

      module.exports = {
        createHash
      }
    }, { buffer: 16 }],
    6: [function (require, module, exports) {
    /* jshint node: true */

      'use strict'

      /** Shim without file-system operations. */

      function createError () { return new Error('unsupported in the browser') }

      function createImportHook () {
        return function (fpath, kind, cb) { cb(createError()) }
      }

      function createSyncImportHook () {
        return function () { throw createError() }
      }

      module.exports = {
        createImportHook,
        createSyncImportHook,
        existsSync: function () { return false },
        readFileSync: function () { throw createError() }
      }
    }, {}],
    7: [function (require, module, exports) {
      (function (process) {
        (function () {
          /* jshint node: true */

          // TODO: Add streams which prefix each record with its length.

          'use strict'

          /**
 * This module defines custom streams to write and read Avro files.
 *
 * In particular, the `Block{En,De}coder` streams are able to deal with Avro
 * container files. None of the streams below depend on the filesystem however,
 * this way they can also be used in the browser (for example to parse HTTP
 * responses).
 */

          const types = require('./types')
          const utils = require('./utils')
          const buffer = require('buffer')
          const stream = require('stream')
          const util = require('util')
          const zlib = require('zlib')

          const Buffer = buffer.Buffer
          const OPTS = { namespace: 'org.apache.avro.file' }

          const LONG_TYPE = types.Type.forSchema('long', OPTS)

          const MAP_BYTES_TYPE = types.Type.forSchema({ type: 'map', values: 'bytes' }, OPTS)

          const HEADER_TYPE = types.Type.forSchema({
            name: 'Header',
            type: 'record',
            fields: [
              { name: 'magic', type: { type: 'fixed', name: 'Magic', size: 4 } },
              { name: 'meta', type: MAP_BYTES_TYPE },
              { name: 'sync', type: { type: 'fixed', name: 'Sync', size: 16 } }
            ]
          }, OPTS)

          const BLOCK_TYPE = types.Type.forSchema({
            name: 'Block',
            type: 'record',
            fields: [
              { name: 'count', type: 'long' },
              { name: 'data', type: 'bytes' },
              { name: 'sync', type: 'Sync' }
            ]
          }, OPTS)

          // First 4 bytes of an Avro object container file.
          const MAGIC_BYTES = utils.bufferFrom('Obj\x01')

          // Convenience.
          const f = util.format
          const Tap = utils.Tap

          /** Duplex stream for decoding fragments. */
          function RawDecoder (schema, opts) {
            opts = opts || {}

            const noDecode = !!opts.noDecode
            stream.Duplex.call(this, {
              readableObjectMode: !noDecode,
              allowHalfOpen: false
            })

            this._type = types.Type.forSchema(schema)
            this._tap = new Tap(utils.newBuffer(0))
            this._writeCb = null
            this._needPush = false
            this._readValue = createReader(noDecode, this._type)
            this._finished = false

            this.on('finish', function () {
              this._finished = true
              this._read()
            })
          }
          util.inherits(RawDecoder, stream.Duplex)

          RawDecoder.prototype._write = function (chunk, encoding, cb) {
            // Store the write callback and call it when we are done decoding all records
            // in this chunk. If we call it right away, we risk loading the entire input
            // in memory. We only need to store the latest callback since the stream API
            // guarantees that `_write` won't be called again until we call the previous.
            this._writeCb = cb

            const tap = this._tap
            tap.buf = Buffer.concat([tap.buf.slice(tap.pos), chunk])
            tap.pos = 0
            if (this._needPush) {
              this._needPush = false
              this._read()
            }
          }

          RawDecoder.prototype._read = function () {
            this._needPush = false

            const tap = this._tap
            const pos = tap.pos
            const val = this._readValue(tap)
            if (tap.isValid()) {
              this.push(val)
            } else if (!this._finished) {
              tap.pos = pos
              this._needPush = true
              if (this._writeCb) {
                // This should only ever be false on the first read, and only if it
                // happens before the first write.
                this._writeCb()
              }
            } else {
              this.push(null)
            }
          }

          /** Duplex stream for decoding object container files. */
          function BlockDecoder (opts) {
            opts = opts || {}

            const noDecode = !!opts.noDecode
            stream.Duplex.call(this, {
              allowHalfOpen: true, // For async decompressors.
              readableObjectMode: !noDecode
            })

            this._rType = opts.readerSchema !== undefined
              ? types.Type.forSchema(opts.readerSchema)
              : undefined
            this._wType = null
            this._codecs = opts.codecs
            this._codec = undefined
            this._parseHook = opts.parseHook
            this._tap = new Tap(utils.newBuffer(0))
            this._blockTap = new Tap(utils.newBuffer(0))
            this._syncMarker = null
            this._readValue = null
            this._noDecode = noDecode
            this._queue = new utils.OrderedQueue()
            this._decompress = null // Decompression function.
            this._index = 0 // Next block index.
            this._remaining = undefined // In the current block.
            this._needPush = false
            this._finished = false

            this.on('finish', function () {
              this._finished = true
              if (this._needPush) {
                this._read()
              }
            })
          }
          util.inherits(BlockDecoder, stream.Duplex)

          BlockDecoder.defaultCodecs = function () {
            return {
              null: function (buf, cb) { cb(null, buf) },
              deflate: zlib.inflateRaw
            }
          }

          BlockDecoder.getDefaultCodecs = BlockDecoder.defaultCodecs

          BlockDecoder.prototype._decodeHeader = function () {
            const tap = this._tap
            if (tap.buf.length < MAGIC_BYTES.length) {
              // Wait until more data arrives.
              return false
            }

            if (!MAGIC_BYTES.equals(tap.buf.slice(0, MAGIC_BYTES.length))) {
              this.emit('error', new Error('invalid magic bytes'))
              return false
            }

            const header = HEADER_TYPE._read(tap)
            if (!tap.isValid()) {
              return false
            }

            this._codec = (header.meta['avro.codec'] || 'null').toString()
            const codecs = this._codecs || BlockDecoder.getDefaultCodecs()
            this._decompress = codecs[this._codec]
            if (!this._decompress) {
              this.emit('error', new Error(f('unknown codec: %s', this._codec)))
              return
            }

            try {
              let schema = JSON.parse(header.meta['avro.schema'].toString())
              if (this._parseHook) {
                schema = this._parseHook(schema)
              }
              this._wType = types.Type.forSchema(schema)
            } catch (err) {
              this.emit('error', err)
              return
            }

            try {
              this._readValue = createReader(this._noDecode, this._wType, this._rType)
            } catch (err) {
              this.emit('error', err)
              return
            }

            this._syncMarker = header.sync
            this.emit('metadata', this._wType, this._codec, header)
            return true
          }

          BlockDecoder.prototype._write = function (chunk, encoding, cb) {
            const tap = this._tap
            tap.buf = Buffer.concat([tap.buf, chunk])
            tap.pos = 0

            if (!this._decodeHeader()) {
              process.nextTick(cb)
              return
            }

            // We got the header, switch to block decoding mode. Also, call it directly
            // in case we already have all the data (in which case `_write` wouldn't get
            // called anymore).
            this._write = this._writeChunk
            this._write(utils.newBuffer(0), encoding, cb)
          }

          BlockDecoder.prototype._writeChunk = function (chunk, encoding, cb) {
            const tap = this._tap
            tap.buf = Buffer.concat([tap.buf.slice(tap.pos), chunk])
            tap.pos = 0

            let nBlocks = 1
            let block
            while ((block = tryReadBlock(tap))) {
              if (!this._syncMarker.equals(block.sync)) {
                this.emit('error', new Error('invalid sync marker'))
                return
              }
              nBlocks++
              this._decompress(
                block.data,
                this._createBlockCallback(block.data.length, block.count, chunkCb)
              )
            }
            chunkCb()

            function chunkCb () {
              if (!--nBlocks) {
                cb()
              }
            }
          }

          BlockDecoder.prototype._createBlockCallback = function (size, count, cb) {
            const self = this
            const index = this._index++

            return function (cause, data) {
              if (cause) {
                const err = new Error(f('%s codec decompression error', self._codec))
                err.cause = cause
                self.emit('error', err)
                cb()
              } else {
                self.emit('block', new BlockInfo(count, data.length, size))
                self._queue.push(new BlockData(index, data, cb, count))
                if (self._needPush) {
                  self._read()
                }
              }
            }
          }

          BlockDecoder.prototype._read = function () {
            this._needPush = false

            const tap = this._blockTap
            if (!this._remaining) {
              const data = this._queue.pop()
              if (!data || !data.count) {
                if (this._finished) {
                  this.push(null)
                } else {
                  this._needPush = true
                }
                if (data) {
                  data.cb()
                }
                return // Wait for more data.
              }
              data.cb()
              this._remaining = data.count
              tap.buf = data.buf
              tap.pos = 0
            }

            this._remaining--
            let val
            try {
              val = this._readValue(tap)
              if (!tap.isValid()) {
                throw new Error('truncated block')
              }
            } catch (err) {
              this._remaining = 0
              this.emit('error', err) // Corrupt data.
              return
            }
            this.push(val)
          }

          /** Duplex stream for encoding. */
          function RawEncoder (schema, opts) {
            opts = opts || {}

            stream.Transform.call(this, {
              writableObjectMode: true,
              allowHalfOpen: false
            })

            this._type = types.Type.forSchema(schema)
            this._writeValue = function (tap, val) {
              try {
                this._type._write(tap, val)
              } catch (err) {
                this.emit('typeError', err, val, this._type)
              }
            }
            this._tap = new Tap(utils.newBuffer(opts.batchSize || 65536))

            this.on('typeError', function (err) { this.emit('error', err) })
          }
          util.inherits(RawEncoder, stream.Transform)

          RawEncoder.prototype._transform = function (val, encoding, cb) {
            const tap = this._tap
            const buf = tap.buf
            const pos = tap.pos

            this._writeValue(tap, val)
            if (!tap.isValid()) {
              if (pos) {
                // Emit any valid data.
                this.push(copyBuffer(tap.buf, 0, pos))
              }
              const len = tap.pos - pos
              if (len > buf.length) {
                // Not enough space for last written object, need to resize.
                tap.buf = utils.newBuffer(2 * len)
              }
              tap.pos = 0
              this._writeValue(tap, val) // Rewrite last failed write.
            }

            cb()
          }

          RawEncoder.prototype._flush = function (cb) {
            const tap = this._tap
            const pos = tap.pos
            if (pos) {
              // This should only ever be false if nothing is written to the stream.
              this.push(tap.buf.slice(0, pos))
            }
            cb()
          }

          /**
 * Duplex stream to write object container files.
 *
 * @param schema
 * @param opts {Object}
 *
 *  + `blockSize`, uncompressed.
 *  + `codec`
 *  + `codecs`
 *  + `metadata``
 *  + `noCheck`
 *  + `omitHeader`, useful to append to an existing block file.
 */
          function BlockEncoder (schema, opts) {
            opts = opts || {}

            stream.Duplex.call(this, {
              allowHalfOpen: true, // To support async compressors.
              writableObjectMode: true
            })

            let type
            if (types.Type.isType(schema)) {
              type = schema
              schema = undefined
            } else {
              // Keep full schema to be able to write it to the header later.
              type = types.Type.forSchema(schema)
            }

            this._schema = schema
            this._type = type
            this._writeValue = function (tap, val) {
              try {
                this._type._write(tap, val)
              } catch (err) {
                this.emit('typeError', err, val, this._type)
                return false
              }
              return true
            }
            this._blockSize = opts.blockSize || 65536
            this._tap = new Tap(utils.newBuffer(this._blockSize))
            this._codecs = opts.codecs
            this._codec = opts.codec || 'null'
            this._blockCount = 0
            this._syncMarker = opts.syncMarker || new utils.Lcg().nextBuffer(16)
            this._queue = new utils.OrderedQueue()
            this._pending = 0
            this._finished = false
            this._needHeader = false
            this._needPush = false

            this._metadata = opts.metadata || {}
            if (!MAP_BYTES_TYPE.isValid(this._metadata)) {
              throw new Error('invalid metadata')
            }

            const codec = this._codec
            this._compress = (this._codecs || BlockEncoder.getDefaultCodecs())[codec]
            if (!this._compress) {
              throw new Error(f('unsupported codec: %s', codec))
            }

            if (opts.omitHeader !== undefined) { // Legacy option.
              opts.writeHeader = opts.omitHeader ? 'never' : 'auto'
            }
            switch (opts.writeHeader) {
              case false:
              case 'never':
                break
              case undefined: // Backwards-compatibility (eager default would be better).
              case 'auto':
                this._needHeader = true
                break
              default:
                this._writeHeader()
            }

            this.on('finish', function () {
              this._finished = true
              if (this._blockCount) {
                this._flushChunk()
              } else if (this._finished && this._needPush) {
                // We don't need to check `_isPending` since `_blockCount` is always
                // positive after the first flush.
                this.push(null)
              }
            })

            this.on('typeError', function (err) { this.emit('error', err) })
          }
          util.inherits(BlockEncoder, stream.Duplex)

          BlockEncoder.defaultCodecs = function () {
            return {
              null: function (buf, cb) { cb(null, buf) },
              deflate: zlib.deflateRaw
            }
          }

          BlockEncoder.getDefaultCodecs = BlockEncoder.defaultCodecs

          BlockEncoder.prototype._writeHeader = function () {
            const schema = JSON.stringify(
              this._schema ? this._schema : this._type.getSchema({ exportAttrs: true })
            )
            const meta = utils.copyOwnProperties(
              this._metadata,
              { 'avro.schema': utils.bufferFrom(schema), 'avro.codec': utils.bufferFrom(this._codec) },
              true // Overwrite.
            )
            const Header = HEADER_TYPE.getRecordConstructor()
            const header = new Header(MAGIC_BYTES, meta, this._syncMarker)
            this.push(header.toBuffer())
          }

          BlockEncoder.prototype._write = function (val, encoding, cb) {
            if (this._needHeader) {
              this._writeHeader()
              this._needHeader = false
            }

            const tap = this._tap
            const pos = tap.pos
            let flushing = false

            if (this._writeValue(tap, val)) {
              if (!tap.isValid()) {
                if (pos) {
                  this._flushChunk(pos, cb)
                  flushing = true
                }
                const len = tap.pos - pos
                if (len > this._blockSize) {
                  // Not enough space for last written object, need to resize.
                  this._blockSize = len * 2
                }
                tap.buf = utils.newBuffer(this._blockSize)
                tap.pos = 0
                this._writeValue(tap, val) // Rewrite last failed write.
              }
              this._blockCount++
            } else {
              tap.pos = pos
            }

            if (!flushing) {
              cb()
            }
          }

          BlockEncoder.prototype._flushChunk = function (pos, cb) {
            const tap = this._tap
            pos = pos || tap.pos
            this._compress(tap.buf.slice(0, pos), this._createBlockCallback(pos, cb))
            this._blockCount = 0
          }

          BlockEncoder.prototype._read = function () {
            const self = this
            const data = this._queue.pop()
            if (!data) {
              if (this._finished && !this._pending) {
                process.nextTick(function () { self.push(null) })
              } else {
                this._needPush = true
              }
              return
            }

            this.push(LONG_TYPE.toBuffer(data.count, true))
            this.push(LONG_TYPE.toBuffer(data.buf.length, true))
            this.push(data.buf)
            this.push(this._syncMarker)

            if (!this._finished) {
              data.cb()
            }
          }

          BlockEncoder.prototype._createBlockCallback = function (size, cb) {
            const self = this
            const index = this._index++
            const count = this._blockCount
            this._pending++

            return function (cause, data) {
              if (cause) {
                const err = new Error(f('%s codec compression error', self._codec))
                err.cause = cause
                self.emit('error', err)
                return
              }
              self._pending--
              self.emit('block', new BlockInfo(count, size, data.length))
              self._queue.push(new BlockData(index, data, cb, count))
              if (self._needPush) {
                self._needPush = false
                self._read()
              }
            }
          }

          // Helpers.

          /** Summary information about a block. */
          function BlockInfo (count, raw, compressed) {
            this.valueCount = count
            this.rawDataLength = raw
            this.compressedDataLength = compressed
          }

          /**
 * An indexed block.
 *
 * This can be used to preserve block order since compression and decompression
 * can cause some some blocks to be returned out of order.
 */
          function BlockData (index, buf, cb, count) {
            this.index = index
            this.buf = buf
            this.cb = cb
            this.count = count | 0
          }

          /** Maybe get a block. */
          function tryReadBlock (tap) {
            const pos = tap.pos
            const block = BLOCK_TYPE._read(tap)
            if (!tap.isValid()) {
              tap.pos = pos
              return null
            }
            return block
          }

          /** Create bytes consumer, either reading or skipping records. */
          function createReader (noDecode, writerType, readerType) {
            if (noDecode) {
              return (function (skipper) {
                return function (tap) {
                  const pos = tap.pos
                  skipper(tap)
                  return tap.buf.slice(pos, tap.pos)
                }
              })(writerType._skip)
            } else if (readerType) {
              const resolver = readerType.createResolver(writerType)
              return function (tap) { return resolver._read(tap) }
            } else {
              return function (tap) { return writerType._read(tap) }
            }
          }

          /** Copy a buffer. This avoids creating a slice of the original buffer. */
          function copyBuffer (buf, pos, len) {
            const copy = utils.newBuffer(len)
            buf.copy(copy, 0, pos, pos + len)
            return copy
          }

          module.exports = {
            BLOCK_TYPE, // For tests.
            HEADER_TYPE, // Idem.
            MAGIC_BYTES, // Idem.
            streams: {
              BlockDecoder,
              BlockEncoder,
              RawDecoder,
              RawEncoder
            }
          }
        }).call(this)
      }).call(this, require('_process'))
    }, { './types': 10, './utils': 11, _process: 56, buffer: 16, stream: 73, util: 80, zlib: 15 }],
    8: [function (require, module, exports) {
      (function (process) {
        (function () {
          /* jshint node: true */

          // TODO: Add broadcast option to client `_emitMessage`, accessible for one-way
          // messages.
          // TODO: Add `server.mount` method to allow combining servers. The API is as
          // follows: a mounted server's (i.e. the method's argument) handlers have lower
          // precedence than the original server (i.e. `this`); the mounted server's
          // middlewares are only invoked for its handlers.
          // TODO: Change `objectMode` client and server channel option to `encoding`
          // (accepting `'netty'`, `'standard'`, and `null` or `undefined`). Perhaps also
          // expose encoders (API TBD).

          'use strict'

          /** This module implements Avro's IPC/RPC logic. */

          const types = require('./types')
          const utils = require('./utils')
          const buffer = require('buffer')
          const events = require('events')
          const stream = require('stream')
          const util = require('util')

          const Buffer = buffer.Buffer

          // A few convenience imports.
          const Tap = utils.Tap
          const Type = types.Type
          const debug = util.debuglog('avsc:services')
          const f = util.format

          // Various useful types. We instantiate options once, to share the registry.
          const OPTS = { namespace: 'org.apache.avro.ipc' }

          const BOOLEAN_TYPE = Type.forSchema('boolean', OPTS)

          const MAP_BYTES_TYPE = Type.forSchema({ type: 'map', values: 'bytes' }, OPTS)

          const STRING_TYPE = Type.forSchema('string', OPTS)

          const HANDSHAKE_REQUEST_TYPE = Type.forSchema({
            name: 'HandshakeRequest',
            type: 'record',
            fields: [
              { name: 'clientHash', type: { name: 'MD5', type: 'fixed', size: 16 } },
              { name: 'clientProtocol', type: ['null', 'string'], default: null },
              { name: 'serverHash', type: 'MD5' },
              { name: 'meta', type: ['null', MAP_BYTES_TYPE], default: null }
            ]
          }, OPTS)

          const HANDSHAKE_RESPONSE_TYPE = Type.forSchema({
            name: 'HandshakeResponse',
            type: 'record',
            fields: [
              {
                name: 'match',
                type: {
                  name: 'HandshakeMatch',
                  type: 'enum',
                  symbols: ['BOTH', 'CLIENT', 'NONE']
                }
              },
              { name: 'serverProtocol', type: ['null', 'string'], default: null },
              { name: 'serverHash', type: ['null', 'MD5'], default: null },
              { name: 'meta', type: ['null', MAP_BYTES_TYPE], default: null }
            ]
          }, OPTS)

          // Prefix used to differentiate between messages when sharing a stream. This
          // length should be smaller than 16. The remainder is used for disambiguating
          // between concurrent messages (the current value, 16, therefore supports ~64k
          // concurrent messages).
          const PREFIX_LENGTH = 16

          // Internal message, used to check protocol compatibility.
          const PING_MESSAGE = new Message(
            '', // Empty name (invalid for other "normal" messages).
            Type.forSchema({ name: 'PingRequest', type: 'record', fields: [] }, OPTS),
            Type.forSchema(['string'], OPTS),
            Type.forSchema('null', OPTS)
          )

          /** An Avro message, containing its request, response, etc. */
          function Message (name, reqType, errType, resType, oneWay, doc) {
            this.name = name
            if (!Type.isType(reqType, 'record')) {
              throw new Error('invalid request type')
            }
            this.requestType = reqType
            if (
              !Type.isType(errType, 'union') ||
    !Type.isType(errType.getTypes()[0], 'string')
            ) {
              throw new Error('invalid error type')
            }
            this.errorType = errType
            if (oneWay) {
              if (!Type.isType(resType, 'null') || errType.getTypes().length > 1) {
                throw new Error('inapplicable one-way parameter')
              }
            }
            this.responseType = resType
            this.oneWay = !!oneWay
            this.doc = doc !== undefined ? '' + doc : undefined
            Object.freeze(this)
          }

          Message.forSchema = function (name, schema, opts) {
            opts = opts || {}
            if (!utils.isValidName(name)) {
              throw new Error(f('invalid message name: %s', name))
            }
            // We use a record with a placeholder name here (the user might have set
            // `noAnonymousTypes`, so we can't use an anonymous one). We remove it from
            // the registry afterwards to avoid exposing it outside.
            if (!Array.isArray(schema.request)) {
              throw new Error(f('invalid message request: %s', name))
            }
            const recordName = f('%s.%sRequest', OPTS.namespace, utils.capitalize(name))
            const reqType = Type.forSchema({
              name: recordName,
              type: 'record',
              namespace: opts.namespace || '', // Don't leak request namespace.
              fields: schema.request
            }, opts)
            delete opts.registry[recordName]
            if (!schema.response) {
              throw new Error(f('invalid message response: %s', name))
            }
            const resType = Type.forSchema(schema.response, opts)
            if (schema.errors !== undefined && !Array.isArray(schema.errors)) {
              throw new Error(f('invalid message errors: %s', name))
            }
            const errType = Type.forSchema(['string'].concat(schema.errors || []), opts)
            const oneWay = !!schema['one-way']
            return new Message(name, reqType, errType, resType, oneWay, schema.doc)
          }

          Message.prototype.schema = Type.prototype.getSchema

          Message.prototype._attrs = function (opts) {
            const reqSchema = this.requestType._attrs(opts)
            const schema = {
              request: reqSchema.fields,
              response: this.responseType._attrs(opts)
            }
            const msgDoc = this.doc
            if (msgDoc !== undefined) {
              schema.doc = msgDoc
            }
            const errSchema = this.errorType._attrs(opts)
            if (errSchema.length > 1) {
              schema.errors = errSchema.slice(1)
            }
            if (this.oneWay) {
              schema['one-way'] = true
            }
            return schema
          }

          // Deprecated.

          utils.addDeprecatedGetters(
            Message,
            ['name', 'errorType', 'requestType', 'responseType']
          )

          Message.prototype.isOneWay = util.deprecate(
            function () { return this.oneWay },
            'use `.oneWay` directly instead of `.isOneWay()`'
          )

          /**
 * An Avro RPC service.
 *
 * This constructor shouldn't be called directly, but via the
 * `Service.forProtocol` method. This function performs little logic to better
 * support efficient copy.
 */
          function Service (name, messages, types, ptcl, server) {
            if (typeof name !== 'string') {
              // Let's be helpful in case this class is instantiated directly.
              return Service.forProtocol(name, messages)
            }

            this.name = name
            this._messagesByName = messages || {}
            this.messages = Object.freeze(utils.objectValues(this._messagesByName))

            this._typesByName = types || {}
            this.types = Object.freeze(utils.objectValues(this._typesByName))

            this.protocol = ptcl
            // We cache a string rather than a buffer to not retain an entire slab.
            this._hashStr = utils.getHash(JSON.stringify(ptcl)).toString('binary')
            this.doc = ptcl.doc ? '' + ptcl.doc : undefined

            // We add a server to each protocol for backwards-compatibility (to allow the
            // use of `protocol.on`). This covers all cases except the use of the
            // `strictErrors` option, which requires moving to the new API.
            this._server = server || this.createServer({ silent: true })
            Object.freeze(this)
          }

          Service.Client = Client

          Service.Server = Server

          Service.compatible = function (clientSvc, serverSvc) {
            try {
              createReaders(clientSvc, serverSvc)
            } catch (err) {
              return false
            }
            return true
          }

          Service.forProtocol = function (ptcl, opts) {
            opts = opts || {}

            let name = ptcl.protocol
            if (!name) {
              throw new Error('missing protocol name')
            }
            if (ptcl.namespace !== undefined) {
              opts.namespace = ptcl.namespace
            } else {
              const match = /^(.*)\.[^.]+$/.exec(name)
              if (match) {
                opts.namespace = match[1]
              }
            }
            name = utils.qualify(name, opts.namespace)

            if (ptcl.types) {
              ptcl.types.forEach(function (obj) { Type.forSchema(obj, opts) })
            }
            let msgs
            if (ptcl.messages) {
              msgs = {}
              Object.keys(ptcl.messages).forEach(function (key) {
                msgs[key] = Message.forSchema(key, ptcl.messages[key], opts)
              })
            }

            return new Service(name, msgs, opts.registry, ptcl)
          }

          Service.isService = function (any) {
            // Not fool-proof but likely sufficient.
            return !!any && any.hasOwnProperty('_hashStr')
          }

          Service.prototype.createClient = function (opts) {
            const client = new Client(this, opts)
            process.nextTick(function () {
              // We delay this processing such that we can attach handlers to the client
              // before any channels get created.
              if (opts && opts.server) {
                // Convenience in-memory client. This can be useful to make requests
                // relatively efficiently to an in-process server. Note that it is still
                // is less efficient than direct method calls (because of the
                // serialization, which does provide "type-safety" though).
                const obj = { objectMode: true }
                const pts = [new stream.PassThrough(obj), new stream.PassThrough(obj)]
                opts.server.createChannel({ readable: pts[0], writable: pts[1] }, obj)
                client.createChannel({ readable: pts[1], writable: pts[0] }, obj)
              } else if (opts && opts.transport) {
                // Convenience functionality for the common single channel use-case: we
                // add a single channel using default options to the client.
                client.createChannel(opts.transport)
              }
            })
            return client
          }

          Service.prototype.createServer = function (opts) {
            return new Server(this, opts)
          }

          Object.defineProperty(Service.prototype, 'hash', {
            enumerable: true,
            get: function () { return utils.bufferFrom(this._hashStr, 'binary') }
          })

          Service.prototype.message = function (name) {
            return this._messagesByName[name]
          }

          Service.prototype.type = function (name) {
            return this._typesByName[name]
          }

          Service.prototype.inspect = function () {
            return f('<Service %j>', this.name)
          }

          // Deprecated methods.

          utils.addDeprecatedGetters(
            Service,
            ['message', 'messages', 'name', 'type', 'types']
          )

          Service.prototype.createEmitter = util.deprecate(
            function (transport, opts) {
              opts = opts || {}
              const client = this.createClient({
                cache: opts.cache,
                buffering: false,
                strictTypes: opts.strictErrors,
                timeout: opts.timeout
              })
              const channel = client.createChannel(transport, opts)
              forwardErrors(client, channel)
              return channel
            },
            'use `.createClient()` instead of `.createEmitter()`'
          )

          Service.prototype.createListener = util.deprecate(
            function (transport, opts) {
              if (opts && opts.strictErrors) {
                throw new Error('use `.createServer()` to support strict errors')
              }
              return this._server.createChannel(transport, opts)
            },
            'use `.createServer().createChannel()` instead of `.createListener()`'
          )

          Service.prototype.emit = util.deprecate(
            function (name, req, channel, cb) {
              if (!channel || !this.equals(channel.client._svc$)) {
                throw new Error('invalid emitter')
              }

              const client = channel.client
              // In case the method is overridden.
              Client.prototype.emitMessage.call(client, name, req, cb && cb.bind(this))
              return channel.getPending()
            },
            'create a client via `.createClient()` to emit messages instead of `.emit()`'
          )

          Service.prototype.equals = util.deprecate(
            function (any) {
              return (
                Service.isService(any) &&
      this.getFingerprint().equals(any.getFingerprint())
              )
            },
            'equality testing is deprecated, compare the `.protocol`s instead'
          )

          Service.prototype.getFingerprint = util.deprecate(
            function (algorithm) {
              return utils.getHash(JSON.stringify(this.protocol), algorithm)
            },
            'use `.hash` instead of `.getFingerprint()`'
          )

          Service.prototype.getSchema = util.deprecate(
            Type.prototype.getSchema,
            'use `.protocol` instead of `.getSchema()`'
          )

          Service.prototype.on = util.deprecate(
            function (name, handler) {
              const self = this // This protocol.
              this._server.onMessage(name, function (req, cb) {
                return handler.call(self, req, this.channel, cb)
              })
              return this
            },
            'use `.createServer().onMessage()` instead of `.on()`'
          )

          Service.prototype.subprotocol = util.deprecate(
            function () {
              const parent = this._server
              const opts = { strictTypes: parent._strict, cache: parent._cache }
              const server = new Server(parent.service, opts)
              server._handlers = Object.create(parent._handlers)
              return new Service(
                this.name,
                this._messagesByName,
                this._typesByName,
                this.protocol,
                server
              )
            },
            '`.subprotocol()` will be removed in 5.1'
          )

          Service.prototype._attrs = function (opts) {
            const ptcl = { protocol: this.name }

            const types = []
            this.types.forEach(function (t) {
              if (t.getName() === undefined) {
                // Don't include any unnamed types (e.g. primitives).
                return
              }
              const typeSchema = t._attrs(opts)
              if (typeof typeSchema !== 'string') {
                // Some of the named types might already have been defined in a
                // previous type, in this case we don't include its reference.
                types.push(typeSchema)
              }
            })
            if (types.length) {
              ptcl.types = types
            }

            const msgNames = Object.keys(this._messagesByName)
            if (msgNames.length) {
              ptcl.messages = {}
              msgNames.forEach(function (name) {
                ptcl.messages[name] = this._messagesByName[name]._attrs(opts)
              }, this)
            }

            if (opts && opts.exportAttrs && this.doc !== undefined) {
              ptcl.doc = this.doc
            }
            return ptcl
          }

          /** Function to retrieve a remote service's protocol. */
          function discoverProtocol (transport, opts, cb) {
            if (cb === undefined && typeof opts === 'function') {
              cb = opts
              opts = undefined
            }

            const svc = new Service({ protocol: 'Empty' }, OPTS)
            let ptclStr
            svc.createClient({ timeout: opts && opts.timeout })
              .createChannel(transport, {
                scope: opts && opts.scope,
                endWritable: typeof transport === 'function' // Stateless transports only.
              }).once('handshake', function (hreq, hres) {
                ptclStr = hres.serverProtocol
                this.destroy(true)
              })
              .once('eot', function (pending, err) {
                // Stateless transports will throw an interrupted error when the
                // channel is destroyed, we ignore it here.
                if (err && !/interrupted/.test(err)) {
                  cb(err) // Likely timeout.
                } else {
                  cb(null, JSON.parse(ptclStr))
                }
              })
          }

          /** Load-balanced message sender. */
          function Client (svc, opts) {
            opts = opts || {}
            events.EventEmitter.call(this)

            // We have to suffix all client properties to be safe, since the message
            // names aren't prefixed with clients (unlike servers).
            this._svc$ = svc
            this._channels$ = [] // Active channels.
            this._fns$ = [] // Middleware functions.

            this._buffering$ = !!opts.buffering
            this._cache$ = opts.cache || {} // For backwards compatibility.
            this._policy$ = opts.channelPolicy
            this._strict$ = !!opts.strictTypes
            this._timeout$ = utils.getOption(opts, 'timeout', 10000)

            if (opts.remoteProtocols) {
              insertRemoteProtocols(this._cache$, opts.remoteProtocols, svc, true)
            }

            this._svc$.messages.forEach(function (msg) {
              this[msg.name] = this._createMessageHandler$(msg)
            }, this)
          }
          util.inherits(Client, events.EventEmitter)

          Client.prototype.activeChannels = function () {
            return this._channels$.slice()
          }

          Client.prototype.createChannel = function (transport, opts) {
            const objectMode = opts && opts.objectMode
            let channel
            if (typeof transport === 'function') {
              let writableFactory
              if (objectMode) {
                writableFactory = transport
              } else {
                // We provide a default standard-compliant codec. This should support
                // most use-cases (for example when speaking to the official Java and
                // Python implementations over HTTP, or when this library is used for
                // both the emitting and listening sides).
                writableFactory = function (cb) {
                  const encoder = new FrameEncoder()
                  const writable = transport(function (err, readable) {
                    if (err) {
                      cb(err)
                      return
                    }
                    // Since the decoder isn't exposed (so can't have an error handler
                    // attached, we forward any errors to the client). Since errors would
                    // only get thrown when the decoder flushes (if there is trailing
                    // data), at which point the source will have ended, there is no need
                    // to add re-piping logic (destination errors trigger an unpipe).
                    const decoder = new FrameDecoder()
                      .once('error', function (err) { channel.destroy(err) })
                    cb(null, readable.pipe(decoder))
                  })
                  if (writable) {
                    encoder.pipe(writable)
                    return encoder
                  }
                }
              }
              channel = new StatelessClientChannel(this, writableFactory, opts)
            } else {
              let readable, writable
              if (isStream(transport)) {
                readable = writable = transport
              } else {
                readable = transport.readable
                writable = transport.writable
              }
              if (!objectMode) {
                // To ease communication with Java servers, we provide a default codec
                // compatible with Java servers' `NettyTransportCodec`'s implementation.
                var decoder = new NettyDecoder()
                readable = readable.pipe(decoder)
                var encoder = new NettyEncoder()
                encoder.pipe(writable)
                writable = encoder
              }
              channel = new StatefulClientChannel(this, readable, writable, opts)
              if (!objectMode) {
                // Since we never expose the automatically created encoder and decoder,
                // we release them ourselves here when the channel ends. (Unlike for
                // stateless channels, it is conceivable for the underlying stream to be
                // reused afterwards).
                channel.once('eot', function () {
                  readable.unpipe(decoder)
                  encoder.unpipe(writable)
                })
                // We also forward any (trailing data) error.
                decoder.once('error', function (err) { channel.destroy(err) })
              }
            }
            const channels = this._channels$
            channels.push(channel)
            channel.once('_drain', function () {
              // Remove the channel from the list of active ones.
              channels.splice(channels.indexOf(this), 1)
            })
            // We restrict buffering to startup, otherwise we risk silently hiding errors
            // (especially since channel timeouts don't apply yet).
            this._buffering$ = false
            this.emit('channel', channel)
            return channel
          }

          Client.prototype.destroyChannels = function (opts) {
            this._channels$.forEach(function (channel) {
              channel.destroy(opts && opts.noWait)
            })
          }

          Client.prototype.emitMessage = function (name, req, opts, cb) {
            const msg = getExistingMessage(this._svc$, name)
            const wreq = new WrappedRequest(msg, {}, req)
            this._emitMessage$(wreq, opts, cb)
          }

          Client.prototype.remoteProtocols = function () {
            return getRemoteProtocols(this._cache$, true)
          }

          Object.defineProperty(Client.prototype, 'service', {
            enumerable: true,
            get: function () { return this._svc$ }
          })

          Client.prototype.use = function (/* fn ... */) {
            let i, l, fn
            for (i = 0, l = arguments.length; i < l; i++) {
              fn = arguments[i]
              this._fns$.push(fn.length < 3 ? fn(this) : fn)
            }
            return this
          }

          Client.prototype._emitMessage$ = function (wreq, opts, cb) {
            // Common logic between `client.emitMessage` and the "named" message methods.
            if (!cb && typeof opts === 'function') {
              cb = opts
              opts = undefined
            }
            const self = this
            const channels = this._channels$
            const numChannels = channels.length
            if (!numChannels) {
              if (this._buffering$) {
                debug('no active client channels, buffering call')
                this.once('channel', function () {
                  this._emitMessage$(wreq, opts, cb)
                })
              } else {
                const err = new Error('no active channels')
                process.nextTick(function () {
                  if (cb) {
                    cb.call(new CallContext(wreq._msg), err)
                  } else {
                    self.emit('error', err)
                  }
                })
              }
              return
            }

            opts = opts || {}
            if (opts.timeout === undefined) {
              opts.timeout = this._timeout$
            }

            let channel
            if (numChannels === 1) {
              // Common case, optimized away.
              channel = channels[0]
            } else if (this._policy$) {
              channel = this._policy$(this._channels$.slice())
              if (!channel) {
                debug('policy returned no channel, skipping call')
                return
              }
            } else {
              // Random selection, cheap and likely good enough for most use-cases.
              channel = channels[Math.floor(Math.random() * numChannels)]
            }

            channel._emit(wreq, opts, function (err, wres) {
              const ctx = this // Call context.
              const errType = ctx.message.errorType
              if (err) {
                // System error, likely the message wasn't sent (or an error occurred
                // while decoding the response).
                if (self._strict$) {
                  err = errType.clone(err.message, { wrapUnions: true })
                }
                done(err)
                return
              }
              if (!wres) {
                // This is a one way message.
                done()
                return
              }
              // Message transmission succeeded, we transmit the message data; massaging
              // any error strings into actual `Error` objects in non-strict mode.
              err = wres.error
              if (!self._strict$) {
                // Try to coerce an eventual error into more idiomatic JavaScript types:
                // `undefined` becomes `null` and a remote string "system" error is
                // wrapped inside an actual `Error` object.
                if (err === undefined) {
                  err = null
                } else {
                  if (Type.isType(errType, 'union:unwrapped')) {
                    if (typeof err === 'string') {
                      err = new Error(err)
                    }
                  } else if (err && err.string && typeof err.string === 'string') {
                    err = new Error(err.string)
                  }
                }
              }
              done(err, wres.response)

              function done (err, res) {
                if (cb) {
                  cb.call(ctx, err, res)
                } else if (err) {
                  self.emit('error', err)
                }
              }
            })
          }

          Client.prototype._createMessageHandler$ = function (msg) {
            // jshint -W054
            const fields = msg.requestType.getFields()
            const names = fields.map(function (f) { return f.getName() })
            let body = 'return function ' + msg.name + '('
            if (names.length) {
              body += names.join(', ') + ', '
            }
            body += 'opts, cb) {\n'
            body += '  var req = {'
            body += names.map(function (n) { return n + ': ' + n }).join(', ')
            body += '};\n'
            body += '  return this.emitMessage(\'' + msg.name + '\', req, opts, cb);\n'
            body += '};'
            return (new Function(body))()
          }

          /** Message receiver. */
          function Server (svc, opts) {
            opts = opts || {}
            events.EventEmitter.call(this)

            this.service = svc
            this._handlers = {}
            this._fns = [] // Middleware functions.
            this._channels = {} // Active channels.
            this._nextChannelId = 1

            this._cache = opts.cache || {} // Deprecated.
            this._defaultHandler = opts.defaultHandler
            this._sysErrFormatter = opts.systemErrorFormatter
            this._silent = !!opts.silent
            this._strict = !!opts.strictTypes

            if (opts.remoteProtocols) {
              insertRemoteProtocols(this._cache, opts.remoteProtocols, svc, false)
            }

            svc.messages.forEach(function (msg) {
              let name = msg.name
              if (!opts.noCapitalize) {
                name = utils.capitalize(name)
              }
              this['on' + name] = this._createMessageHandler(msg)
            }, this)
          }
          util.inherits(Server, events.EventEmitter)

          Server.prototype.activeChannels = function () {
            return utils.objectValues(this._channels)
          }

          Server.prototype.createChannel = function (transport, opts) {
            const objectMode = opts && opts.objectMode
            let channel
            if (typeof transport === 'function') {
              let readableFactory
              if (objectMode) {
                readableFactory = transport
              } else {
                readableFactory = function (cb) {
                  const decoder = new FrameDecoder()
                    .once('error', function (err) { channel.destroy(err) })
                  return transport(function (err, writable) {
                    if (err) {
                      cb(err)
                      return
                    }
                    const encoder = new FrameEncoder()
                    encoder.pipe(writable)
                    cb(null, encoder)
                  }).pipe(decoder)
                }
              }
              channel = new StatelessServerChannel(this, readableFactory, opts)
            } else {
              let readable, writable
              if (isStream(transport)) {
                readable = writable = transport
              } else {
                readable = transport.readable
                writable = transport.writable
              }
              if (!objectMode) {
                var decoder = new NettyDecoder()
                readable = readable.pipe(decoder)
                var encoder = new NettyEncoder()
                encoder.pipe(writable)
                writable = encoder
              }
              channel = new StatefulServerChannel(this, readable, writable, opts)
              if (!objectMode) {
                // Similar to client channels, since we never expose the encoder and
                // decoder, we must release them ourselves here.
                channel.once('eot', function () {
                  readable.unpipe(decoder)
                  encoder.unpipe(writable)
                })
                decoder.once('error', function (err) { channel.destroy(err) })
              }
            }

            if (!this.listeners('error').length) {
              this.on('error', this._onError)
            }
            const channelId = this._nextChannelId++
            const channels = this._channels
            channels[channelId] = channel
              .once('eot', function () { delete channels[channelId] })
            this.emit('channel', channel)
            return channel
          }

          Server.prototype.onMessage = function (name, handler) {
            getExistingMessage(this.service, name) // Check message existence.
            this._handlers[name] = handler
            return this
          }

          Server.prototype.remoteProtocols = function () {
            return getRemoteProtocols(this._cache, false)
          }

          Server.prototype.use = function (/* fn ... */) {
            let i, l, fn
            for (i = 0, l = arguments.length; i < l; i++) {
              fn = arguments[i]
              this._fns.push(fn.length < 3 ? fn(this) : fn)
            }
            return this
          }

          Server.prototype._createMessageHandler = function (msg) {
            // jshint -W054
            const name = msg.name
            const fields = msg.requestType.fields
            const numArgs = fields.length
            const args = fields.length
              ? ', ' + fields.map(function (f) { return 'req.' + f.name }).join(', ')
              : ''
            // We are careful to not lose the initial handler's number of arguments (or
            // more specifically whether it would have access to the callback or not).
            // This is useful to implement "smart promisification" logic downstream.
            let body = 'return function (handler) {\n'
            body += '  if (handler.length > ' + numArgs + ') {\n'
            body += '    return this.onMessage(\'' + name + '\', function (req, cb) {\n'
            body += '      return handler.call(this' + args + ', cb);\n'
            body += '    });\n'
            body += '  } else {\n'
            body += '    return this.onMessage(\'' + name + '\', function (req) {\n'
            body += '      return handler.call(this' + args + ');\n'
            body += '    });\n'
            body += '  }\n'
            body += '};\n'
            return (new Function(body))()
          }

          Server.prototype._onError = function (err) {
            /* istanbul ignore if */
            if (!this._silent && err.rpcCode !== 'UNKNOWN_PROTOCOL') {
              console.error()
              if (err.rpcCode) {
                console.error(err.rpcCode)
                console.error(err.cause)
              } else {
                console.error('INTERNAL_SERVER_ERROR')
                console.error(err)
              }
            }
          }

          /** Base message emitter class. See below for the two available variants. */
          function ClientChannel (client, opts) {
            opts = opts || {}
            events.EventEmitter.call(this)

            this.client = client
            this.timeout = utils.getOption(opts, 'timeout', client._timeout$)
            this._endWritable = !!utils.getOption(opts, 'endWritable', true)
            this._prefix = normalizedPrefix(opts.scope)

            const cache = client._cache$
            const clientSvc = client._svc$
            let hash = opts.serverHash
            if (!hash) {
              hash = clientSvc.hash
            }
            let adapter = cache[hash]
            if (!adapter) {
              // This might happen even if the server hash option was set if the cache
              // doesn't contain the corresponding adapter. In this case we fall back to
              // the client's protocol (as mandated by the spec).
              hash = clientSvc.hash
              adapter = cache[hash] = new Adapter(clientSvc, clientSvc, hash)
            }
            this._adapter = adapter

            this._registry = new Registry(this, PREFIX_LENGTH)
            this.pending = 0
            this.destroyed = false
            this.draining = false
            this.once('_eot', function (pending, err) {
              // Since this listener is only run once, we will only forward an error if
              // it is present during the initial `destroy` call, which is OK.
              debug('client channel EOT')
              this.destroyed = true
              this.emit('eot', pending, err)
            })
          }
          util.inherits(ClientChannel, events.EventEmitter)

          ClientChannel.prototype.destroy = function (noWait) {
            debug('destroying client channel')
            if (!this.draining) {
              this.draining = true
              this.emit('_drain')
            }
            const registry = this._registry
            const pending = this.pending
            if (noWait) {
              registry.clear()
            }
            if (noWait || !pending) {
              if (isError(noWait)) {
                debug('fatal client channel error: %s', noWait)
                this.emit('_eot', pending, noWait)
              } else {
                this.emit('_eot', pending)
              }
            } else {
              debug('client channel entering drain mode (%s pending)', pending)
            }
          }

          ClientChannel.prototype.ping = function (timeout, cb) {
            if (!cb && typeof timeout === 'function') {
              cb = timeout
              timeout = undefined
            }
            const self = this
            const wreq = new WrappedRequest(PING_MESSAGE)
            this._emit(wreq, { timeout }, function (err) {
              if (cb) {
                cb.call(self, err)
              } else if (err) {
                self.destroy(err)
              }
            })
          }

          ClientChannel.prototype._createHandshakeRequest = function (adapter, noSvc) {
            const svc = this.client._svc$
            return {
              clientHash: svc.hash,
              clientProtocol: noSvc ? null : JSON.stringify(svc.protocol),
              serverHash: adapter._hash
            }
          }

          ClientChannel.prototype._emit = function (wreq, opts, cb) {
            const msg = wreq._msg
            const wres = msg.oneWay ? undefined : new WrappedResponse(msg, {})
            const ctx = new CallContext(msg, this)
            const self = this
            this.pending++
            process.nextTick(function () {
              if (!msg.name) {
                // Ping request, bypass middleware.
                onTransition(wreq, wres, onCompletion)
              } else {
                self.emit('outgoingCall', ctx, opts)
                const fns = self.client._fns$
                debug('starting client middleware chain (%s middleware)', fns.length)
                chainMiddleware({
                  fns,
                  ctx,
                  wreq,
                  wres,
                  onTransition,
                  onCompletion,
                  onError
                })
              }
            })

            function onTransition (wreq, wres, prev) {
              // Serialize the message.
              let err, reqBuf
              if (self.destroyed) {
                err = new Error('channel destroyed')
              } else {
                try {
                  reqBuf = wreq.toBuffer()
                } catch (cause) {
                  err = serializationError(
                    f('invalid %j request', msg.name),
                    wreq,
                    [
                      { name: 'headers', type: MAP_BYTES_TYPE },
                      { name: 'request', type: msg.requestType }
                    ]
                  )
                }
              }
              if (err) {
                prev(err)
                return
              }

              // Generate the response callback.
              const timeout = (opts && opts.timeout !== undefined)
                ? opts.timeout
                : self.timeout
              let id = self._registry.add(timeout, function (err, resBuf, adapter) {
                if (!err && !msg.oneWay) {
                  try {
                    adapter._decodeResponse(resBuf, wres, msg)
                  } catch (cause) {
                    err = cause
                  }
                }
                prev(err)
              })
              id |= self._prefix

              debug('sending message %s', id)
              self._send(id, reqBuf, !!msg && msg.oneWay)
            }

            function onCompletion (err) {
              self.pending--
              cb.call(ctx, err, wres)
              if (self.draining && !self.destroyed && !self.pending) {
                self.destroy()
              }
            }

            function onError (err) {
              // This will happen if a middleware callback is called multiple times. We
              // forward the error to the client rather than emit it on the channel since
              // middleware are a client-level abstraction, so better handled there.
              self.client.emit('error', err, self)
            }
          }

          ClientChannel.prototype._getAdapter = function (hres) {
            const hash = hres.serverHash
            const cache = this.client._cache$
            let adapter = cache[hash]
            if (adapter) {
              return adapter
            }
            const ptcl = JSON.parse(hres.serverProtocol)
            const serverSvc = Service.forProtocol(ptcl)
            adapter = new Adapter(this.client._svc$, serverSvc, hash, true)
            return cache[hash] = adapter
          }

          ClientChannel.prototype._matchesPrefix = function (id) {
            return matchesPrefix(id, this._prefix)
          }

          ClientChannel.prototype._send = utils.abstractFunction

          // Deprecated.

          utils.addDeprecatedGetters(ClientChannel, ['pending', 'timeout'])

          ClientChannel.prototype.getCache = util.deprecate(
            function () { return this.client._cache$ },
            'use `.remoteProtocols()` instead of `.getCache()`'
          )

          ClientChannel.prototype.getProtocol = util.deprecate(
            function () {
              return this.client._svc$
            },
            'use `.service` instead or `.getProtocol()`'
          )

          ClientChannel.prototype.isDestroyed = util.deprecate(
            function () { return this.destroyed },
            'use `.destroyed` instead of `.isDestroyed`'
          )

          /**
 * Factory-based client channel.
 *
 * This channel doesn't keep a persistent connection to the server and requires
 * prepending a handshake to each message emitted. Usage examples include
 * talking to an HTTP server (where the factory returns an HTTP request).
 *
 * Since each message will use its own writable/readable stream pair, the
 * advantage of this channel is that it is able to keep track of which response
 * corresponds to each request without relying on transport ordering. In
 * particular, this means these channels are compatible with any server
 * implementation.
 */
          function StatelessClientChannel (client, writableFactory, opts) {
            ClientChannel.call(this, client, opts)
            this._writableFactory = writableFactory

            if (!opts || !opts.noPing) {
              // Ping the server to check whether the remote protocol is compatible.
              // If not, this will throw an error on the channel.
              debug('emitting ping request')
              this.ping()
            }
          }
          util.inherits(StatelessClientChannel, ClientChannel)

          StatelessClientChannel.prototype._send = function (id, reqBuf) {
            const cb = this._registry.get(id)
            let adapter = this._adapter
            const self = this
            process.nextTick(emit)
            return true

            function emit (retry) {
              if (self.destroyed) {
                // The request's callback will already have been called.
                return
              }

              const hreq = self._createHandshakeRequest(adapter, !retry)

              const writable = self._writableFactory.call(self, function (err, readable) {
                if (err) {
                  cb(err)
                  return
                }
                readable.on('data', function (obj) {
                  debug('received response %s', obj.id)
                  // We don't check that the prefix matches since the ID likely hasn't
                  // been propagated to the response (see default stateless codec).
                  const buf = Buffer.concat(obj.payload)
                  try {
                    var parts = readHead(HANDSHAKE_RESPONSE_TYPE, buf)
                    var hres = parts.head
                    if (hres.serverHash) {
                      adapter = self._getAdapter(hres)
                    }
                  } catch (cause) {
                    cb(cause)
                    return
                  }
                  const match = hres.match
                  debug('handshake match: %s', match)
                  self.emit('handshake', hreq, hres)
                  if (match === 'NONE') {
                    // Try again, including the full protocol this time.
                    process.nextTick(function () { emit(true) })
                  } else {
                    // Change the default adapter.
                    self._adapter = adapter
                    cb(null, parts.tail, adapter)
                  }
                })
              })
              if (!writable) {
                cb(new Error('invalid writable stream'))
                return
              }
              writable.write({
                id,
                payload: [HANDSHAKE_REQUEST_TYPE.toBuffer(hreq), reqBuf]
              })
              if (self._endWritable) {
                writable.end()
              }
            }
          }

          /**
 * Multiplexing client channel.
 *
 * These channels reuse the same streams (both readable and writable) for all
 * messages. This avoids a lot of overhead (e.g. creating new connections,
 * re-issuing handshakes) but requires the underlying transport to support
 * forwarding message IDs.
 */
          function StatefulClientChannel (client, readable, writable, opts) {
            ClientChannel.call(this, client, opts)
            this._readable = readable
            this._writable = writable
            this._connected = !!(opts && opts.noPing)
            this._readable.on('end', onEnd)
            this._writable.on('finish', onFinish)

            const self = this
            let timer = null
            this.once('eot', function () {
              if (timer) {
                clearTimeout(timer)
                timer = null
              }
              if (!self._connected) {
                // Clear any buffered calls (they are guaranteed to error out when
                // reaching the transition phase).
                self.emit('_ready')
              }
              // Remove references to this channel to avoid potential memory leaks.
              this._writable.removeListener('finish', onFinish)
              if (this._endWritable) {
                debug('ending transport')
                this._writable.end()
              }
              this._readable
                .removeListener('data', onPing)
                .removeListener('data', onMessage)
                .removeListener('end', onEnd)
            })

            let hreq // For handshake events.
            if (this._connected) {
              this._readable.on('data', onMessage)
            } else {
              this._readable.on('data', onPing)
              process.nextTick(ping)
              if (self.timeout) {
                timer = setTimeout(function () {
                  self.destroy(new Error('timeout'))
                }, self.timeout)
              }
            }

            function ping (retry) {
              if (self.destroyed) {
                return
              }
              hreq = self._createHandshakeRequest(self._adapter, !retry)
              const payload = [
                HANDSHAKE_REQUEST_TYPE.toBuffer(hreq),
                utils.bufferFrom([0, 0]) // No header, no data (empty message name).
              ]
              // We can use a static ID here since we are guaranteed that this message is
              // the only one on the channel (for this scope at least).
              self._writable.write({ id: self._prefix, payload })
            }

            function onPing (obj) {
              if (!self._matchesPrefix(obj.id)) {
                debug('discarding unscoped response %s (still connecting)', obj.id)
                return
              }
              const buf = Buffer.concat(obj.payload)
              try {
                var hres = readHead(HANDSHAKE_RESPONSE_TYPE, buf).head
                if (hres.serverHash) {
                  self._adapter = self._getAdapter(hres)
                }
              } catch (cause) {
                // This isn't a recoverable error.
                self.destroy(cause)
                return
              }
              const match = hres.match
              debug('handshake match: %s', match)
              self.emit('handshake', hreq, hres)
              if (match === 'NONE') {
                process.nextTick(function () { ping(true) })
              } else {
                debug('successfully connected')
                if (timer) {
                  clearTimeout(timer)
                  timer = null
                }
                self._readable.removeListener('data', onPing).on('data', onMessage)
                self._connected = true
                self.emit('_ready')
                hreq = null // Release reference.
              }
            }

            // Callback used after a connection has been established.
            function onMessage (obj) {
              const id = obj.id
              if (!self._matchesPrefix(id)) {
                debug('discarding unscoped message %s', id)
                return
              }
              const cb = self._registry.get(id)
              if (cb) {
                process.nextTick(function () {
                  debug('received message %s', id)
                  // Ensure that the initial callback gets called asynchronously, even
                  // for completely synchronous transports (otherwise the number of
                  // pending requests will sometimes be inconsistent between stateful and
                  // stateless transports).
                  cb(null, Buffer.concat(obj.payload), self._adapter)
                })
              }
            }

            function onEnd () { self.destroy(true) }
            function onFinish () { self.destroy() }
          }
          util.inherits(StatefulClientChannel, ClientChannel)

          StatefulClientChannel.prototype._emit = function () {
            // Override this method to allow calling `_emit` even before the channel is
            // connected. Note that we don't perform this logic in `_send` since we want
            // to guarantee that `'handshake'` events are emitted before any
            // `'outgoingCall'` events.
            if (this._connected || this.draining) {
              ClientChannel.prototype._emit.apply(this, arguments)
            } else {
              debug('queuing request')
              const args = []
              let i, l
              for (i = 0, l = arguments.length; i < l; i++) {
                args.push(arguments[i])
              }
              this.once('_ready', function () { this._emit.apply(this, args) })
            }
          }

          StatefulClientChannel.prototype._send = function (id, reqBuf, oneWay) {
            if (oneWay) {
              const self = this
              // Clear the callback, passing in an empty header.
              process.nextTick(function () {
                self._registry.get(id)(null, utils.bufferFrom([0, 0, 0]), self._adapter)
              })
            }
            return this._writable.write({ id, payload: [reqBuf] })
          }

          /** The server-side emitter equivalent. */
          function ServerChannel (server, opts) {
            opts = opts || {}
            events.EventEmitter.call(this)

            this.server = server
            this._endWritable = !!utils.getOption(opts, 'endWritable', true)
            this._prefix = normalizedPrefix(opts.scope)

            const cache = server._cache
            const svc = server.service
            const hash = svc.hash
            if (!cache[hash]) {
              // Add the channel's protocol to the cache if it isn't already there. This
              // will save a handshake the first time on channels with the same protocol.
              cache[hash] = new Adapter(svc, svc, hash)
            }
            this._adapter = null

            this.destroyed = false
            this.draining = false
            this.pending = 0
            this.once('_eot', function (pending, err) {
              debug('server channel EOT')
              this.emit('eot', pending, err)
            })
          }
          util.inherits(ServerChannel, events.EventEmitter)

          ServerChannel.prototype.destroy = function (noWait) {
            if (!this.draining) {
              this.draining = true
              this.emit('_drain')
            }
            if (noWait || !this.pending) {
              this.destroyed = true
              if (isError(noWait)) {
                debug('fatal server channel error: %s', noWait)
                this.emit('_eot', this.pending, noWait)
              } else {
                this.emit('_eot', this.pending)
              }
            }
          }

          ServerChannel.prototype._createHandshakeResponse = function (err, hreq) {
            const svc = this.server.service
            const buf = svc.hash
            const serverMatch = hreq && hreq.serverHash.equals(buf)
            return {
              match: err ? 'NONE' : (serverMatch ? 'BOTH' : 'CLIENT'),
              serverProtocol: serverMatch ? null : JSON.stringify(svc.protocol),
              serverHash: serverMatch ? null : buf
            }
          }

          ServerChannel.prototype._getAdapter = function (hreq) {
            const hash = hreq.clientHash
            let adapter = this.server._cache[hash]
            if (adapter) {
              return adapter
            }
            if (!hreq.clientProtocol) {
              throw toRpcError('UNKNOWN_PROTOCOL')
            }
            const ptcl = JSON.parse(hreq.clientProtocol)
            const clientSvc = Service.forProtocol(ptcl)
            adapter = new Adapter(clientSvc, this.server.service, hash, true)
            return this.server._cache[hash] = adapter
          }

          ServerChannel.prototype._matchesPrefix = function (id) {
            return matchesPrefix(id, this._prefix)
          }

          ServerChannel.prototype._receive = function (reqBuf, adapter, cb) {
            const self = this
            let wreq
            try {
              wreq = adapter._decodeRequest(reqBuf)
            } catch (cause) {
              cb(self._encodeSystemError(toRpcError('INVALID_REQUEST', cause)))
              return
            }

            const msg = wreq._msg
            const wres = new WrappedResponse(msg, {})
            if (!msg.name) {
              // Ping message, we don't invoke middleware logic in this case.
              wres.response = null
              cb(wres.toBuffer(), false)
              return
            }

            const ctx = new CallContext(msg, this)
            self.emit('incomingCall', ctx)
            const fns = this.server._fns
            debug('starting server middleware chain (%s middleware)', fns.length)
            self.pending++
            chainMiddleware({
              fns,
              ctx,
              wreq,
              wres,
              onTransition,
              onCompletion,
              onError
            })

            function onTransition (wreq, wres, prev) {
              const handler = self.server._handlers[msg.name]
              if (!handler) {
                // The underlying service hasn't implemented a handler.
                const defaultHandler = self.server._defaultHandler
                if (defaultHandler) {
                  // We call the default handler with arguments similar (slightly
                  // simpler, there are no phases here) to middleware such that it can
                  // easily access the message name (useful to implement proxies).
                  defaultHandler.call(ctx, wreq, wres, prev)
                } else {
                  const cause = new Error(f('no handler for %s', msg.name))
                  prev(toRpcError('NOT_IMPLEMENTED', cause))
                }
              } else {
                let pending = !msg.oneWay
                try {
                  if (pending) {
                    handler.call(ctx, wreq.request, function (err, res) {
                      pending = false
                      wres.error = err
                      wres.response = res
                      prev()
                    })
                  } else {
                    handler.call(ctx, wreq.request)
                    prev()
                  }
                } catch (err) {
                  // We catch synchronous failures (same as express) and return the
                  // failure. Note that the server process can still crash if an error
                  // is thrown after the handler returns but before the response is
                  // sent (again, same as express). We are careful to only trigger the
                  // response callback once, emitting the errors afterwards instead.
                  if (pending) {
                    pending = false
                    prev(err)
                  } else {
                    onError(err)
                  }
                }
              }
            }

            function onCompletion (err) {
              self.pending--
              const server = self.server
              let resBuf
              if (!err) {
                var resErr = wres.error
                const isStrict = server._strict
                if (!isStrict) {
                  if (isError(resErr)) {
                    // If the error type is wrapped, we must wrap the error too.
                    wres.error = msg.errorType.clone(resErr.message, { wrapUnions: true })
                  } else if (resErr === null) {
                    // We also allow `null`'s as error in this mode, converting them to
                    // the Avro-compatible `undefined`.
                    resErr = wres.error = undefined
                  }
                  if (
                    resErr === undefined &&
          wres.response === undefined &&
          msg.responseType.isValid(null)
                  ) {
                    // Finally, for messages with `null` as acceptable response type, we
                    // allow `undefined`; converting them to `null`. This allows users to
                    // write a more natural `cb()` instead of `cb(null, null)`.
                    wres.response = null
                  }
                }
                try {
                  resBuf = wres.toBuffer()
                } catch (cause) {
                  // Note that we don't add an RPC code here such that the client
                  // receives the default `INTERNAL_SERVER_ERROR` one.
                  if (wres.error !== undefined) {
                    err = serializationError(
                      f('invalid %j error', msg.name), // Sic.
                      wres,
                      [
                        { name: 'headers', type: MAP_BYTES_TYPE },
                        { name: 'error', type: msg.errorType }
                      ]
                    )
                  } else {
                    err = serializationError(
                      f('invalid %j response', msg.name),
                      wres,
                      [
                        { name: 'headers', type: MAP_BYTES_TYPE },
                        { name: 'response', type: msg.responseType }
                      ]
                    )
                  }
                }
              }
              if (!resBuf) {
                // The headers are only available if the message isn't one-way.
                resBuf = self._encodeSystemError(err, wres.headers)
              } else if (resErr !== undefined) {
                server.emit('error', toRpcError('APPLICATION_ERROR', resErr))
              }
              cb(resBuf, msg.oneWay)
              if (self.draining && !self.pending) {
                self.destroy()
              }
            }

            function onError (err) {
              // Similar to the client equivalent, we redirect this error to the server
              // since middleware are defined at server-level.
              self.server.emit('error', err, self)
            }
          }

          // Deprecated.

          utils.addDeprecatedGetters(ServerChannel, ['pending'])

          ServerChannel.prototype.getCache = util.deprecate(
            function () { return this.server._cache },
            'use `.remoteProtocols()` instead of `.getCache()`'
          )

          ServerChannel.prototype.getProtocol = util.deprecate(
            function () {
              return this.server.service
            },
            'use `.service` instead of `.getProtocol()`'
          )

          ServerChannel.prototype.isDestroyed = util.deprecate(
            function () { return this.destroyed },
            'use `.destroyed` instead of `.isDestroyed`'
          )

          /**
 * Encode an error and optional header into a valid Avro response.
 *
 * @param err {Error} Error to encode.
 * @param header {Object} Optional response header.
 */
          ServerChannel.prototype._encodeSystemError = function (err, header) {
            const server = this.server
            server.emit('error', err, this)
            let errStr
            if (server._sysErrFormatter) {
              // Format the error into a string to send over the wire.
              errStr = server._sysErrFormatter.call(this, err)
            } else if (err.rpcCode) {
              // By default, only forward the error's message when the RPC code is set
              // (i.e. when this isn't an internal server error).
              errStr = err.message
            }
            let hdrBuf
            if (header) {
              try {
                // Propagate the header if possible.
                hdrBuf = MAP_BYTES_TYPE.toBuffer(header)
              } catch (cause) {
                server.emit('error', cause, this)
              }
            }
            return Buffer.concat([
              hdrBuf || utils.bufferFrom([0]),
              utils.bufferFrom([1, 0]), // Error flag and first union index.
              STRING_TYPE.toBuffer(errStr || 'internal server error')
            ])
          }

          /**
 * Server channel for stateless transport.
 *
 * This channel expect a handshake to precede each message.
 */
          function StatelessServerChannel (server, readableFactory, opts) {
            ServerChannel.call(this, server, opts)

            this._writable = undefined
            const self = this
            let readable

            process.nextTick(function () {
              // Delay listening to allow handlers to be attached even if the factory is
              // purely synchronous.
              readable = readableFactory.call(self, function (err, writable) {
                process.nextTick(function () {
                  // We delay once more here in case this call is synchronous, to allow
                  // the readable to always be populated first.
                  if (err) {
                    onFinish(err)
                    return
                  }
                  self._writable = writable.on('finish', onFinish)
                  self.emit('_writable')
                })
              }).on('data', onRequest).on('end', onEnd)
            })

            function onRequest (obj) {
              const id = obj.id
              const buf = Buffer.concat(obj.payload)
              let err
              try {
                var parts = readHead(HANDSHAKE_REQUEST_TYPE, buf)
                var hreq = parts.head
                var adapter = self._getAdapter(hreq)
              } catch (cause) {
                err = toRpcError('INVALID_HANDSHAKE_REQUEST', cause)
              }

              const hres = self._createHandshakeResponse(err, hreq)
              self.emit('handshake', hreq, hres)
              if (err) {
                done(self._encodeSystemError(err))
              } else {
                self._receive(parts.tail, adapter, done)
              }

              function done (resBuf) {
                if (!self.destroyed) {
                  if (!self._writable) {
                    self.once('_writable', function () { done(resBuf) })
                    return
                  }
                  self._writable.write({
                    id,
                    payload: [HANDSHAKE_RESPONSE_TYPE.toBuffer(hres), resBuf]
                  })
                }
                if (self._writable && self._endWritable) {
                  self._writable.end()
                }
              }
            }

            function onEnd () { self.destroy() }

            function onFinish (err) {
              readable
                .removeListener('data', onRequest)
                .removeListener('end', onEnd)
              self.destroy(err || true)
            }
          }
          util.inherits(StatelessServerChannel, ServerChannel)

          /**
 * Stateful transport listener.
 *
 * A handshake is done when the channel first receives a message, then all
 * messages are sent without.
 */
          function StatefulServerChannel (server, readable, writable, opts) {
            ServerChannel.call(this, server, opts)
            this._adapter = undefined
            this._writable = writable.on('finish', onFinish)
            this._readable = readable.on('data', onHandshake).on('end', onEnd)

            this
              .once('_drain', function () {
                // Stop listening to incoming events.
                this._readable
                  .removeListener('data', onHandshake)
                  .removeListener('data', onRequest)
                  .removeListener('end', onEnd)
              })
              .once('eot', function () {
                // Clean up any references to the channel on the underlying streams.
                this._writable.removeListener('finish', onFinish)
                if (this._endWritable) {
                  this._writable.end()
                }
              })

            const self = this

            function onHandshake (obj) {
              const id = obj.id
              if (!self._matchesPrefix(id)) {
                return
              }
              const buf = Buffer.concat(obj.payload)
              let err
              try {
                var parts = readHead(HANDSHAKE_REQUEST_TYPE, buf)
                var hreq = parts.head
                self._adapter = self._getAdapter(hreq)
              } catch (cause) {
                err = toRpcError('INVALID_HANDSHAKE_REQUEST', cause)
              }
              const hres = self._createHandshakeResponse(err, hreq)
              self.emit('handshake', hreq, hres)
              if (err) {
                // Either the client's protocol was unknown or it isn't compatible.
                done(self._encodeSystemError(err))
              } else {
                self._readable
                  .removeListener('data', onHandshake)
                  .on('data', onRequest)
                self._receive(parts.tail, self._adapter, done)
              }

              function done (resBuf) {
                if (self.destroyed) {
                  return
                }
                self._writable.write({
                  id,
                  payload: [HANDSHAKE_RESPONSE_TYPE.toBuffer(hres), resBuf]
                })
              }
            }

            function onRequest (obj) {
              // These requests are not prefixed with handshakes.
              const id = obj.id
              if (!self._matchesPrefix(id)) {
                return
              }
              const reqBuf = Buffer.concat(obj.payload)
              self._receive(reqBuf, self._adapter, function (resBuf, oneWay) {
                if (self.destroyed || oneWay) {
                  return
                }
                self._writable.write({ id, payload: [resBuf] })
              })
            }

            function onEnd () { self.destroy() }

            function onFinish () { self.destroy(true) }
          }
          util.inherits(StatefulServerChannel, ServerChannel)

          // Helpers.

          /** Enhanced request, used inside forward middleware functions. */
          function WrappedRequest (msg, hdrs, req) {
            this._msg = msg
            this.headers = hdrs || {}
            this.request = req || {}
          }

          WrappedRequest.prototype.toBuffer = function () {
            const msg = this._msg
            return Buffer.concat([
              MAP_BYTES_TYPE.toBuffer(this.headers),
              STRING_TYPE.toBuffer(msg.name),
              msg.requestType.toBuffer(this.request)
            ])
          }

          /** Enhanced response, used inside forward middleware functions. */
          function WrappedResponse (msg, hdr, err, res) {
            this._msg = msg
            this.headers = hdr
            this.error = err
            this.response = res
          }

          WrappedResponse.prototype.toBuffer = function () {
            const hdr = MAP_BYTES_TYPE.toBuffer(this.headers)
            const hasError = this.error !== undefined
            return Buffer.concat([
              hdr,
              BOOLEAN_TYPE.toBuffer(hasError),
              hasError
                ? this._msg.errorType.toBuffer(this.error)
                : this._msg.responseType.toBuffer(this.response)
            ])
          }

          /**
 * Context for all middleware and handlers.
 *
 * It exposes a `locals` object which can be used to pass information between
 * each other during a given call.
 */
          function CallContext (msg, channel) {
            this.channel = channel
            this.locals = {}
            this.message = msg
            Object.freeze(this)
          }

          /**
 * Callback registry.
 *
 * Callbacks added must accept an error as first argument. This is used by
 * client channels to store pending calls. This class isn't exposed by the
 * public API.
 */
          function Registry (ctx, prefixLength) {
            this._ctx = ctx // Context for all callbacks.
            this._mask = ~0 >>> (prefixLength | 0) // 16 bits by default.
            this._id = 0 // Unique integer ID for each call.
            this._n = 0 // Number of pending calls.
            this._cbs = {}
          }

          Registry.prototype.get = function (id) { return this._cbs[id & this._mask] }

          Registry.prototype.add = function (timeout, fn) {
            this._id = (this._id + 1) & this._mask

            const self = this
            const id = this._id
            let timer
            if (timeout > 0) {
              timer = setTimeout(function () { cb(new Error('timeout')) }, timeout)
            }

            this._cbs[id] = cb
            this._n++
            return id

            function cb () {
              if (!self._cbs[id]) {
                // The callback has already run.
                return
              }
              delete self._cbs[id]
              self._n--
              if (timer) {
                clearTimeout(timer)
              }
              fn.apply(self._ctx, arguments)
            }
          }

          Registry.prototype.clear = function () {
            Object.keys(this._cbs).forEach(function (id) {
              this._cbs[id](new Error('interrupted'))
            }, this)
          }

          /**
 * Service resolution helper.
 *
 * It is used both by client and server channels, to respectively decode errors
 * and responses, or requests.
 */
          function Adapter (clientSvc, serverSvc, hash, isRemote) {
            this._clientSvc = clientSvc
            this._serverSvc = serverSvc
            this._hash = hash // Convenience to access it when creating handshakes.
            this._isRemote = !!isRemote
            this._readers = createReaders(clientSvc, serverSvc)
          }

          Adapter.prototype._decodeRequest = function (buf) {
            const tap = new Tap(buf)
            const hdr = MAP_BYTES_TYPE._read(tap)
            const name = STRING_TYPE._read(tap)
            let msg, req
            if (name) {
              msg = this._serverSvc.message(name)
              req = this._readers[name + '?']._read(tap)
            } else {
              msg = PING_MESSAGE
            }
            if (!tap.isValid()) {
              throw new Error(f('truncated %s request', name || 'ping$'))
            }
            return new WrappedRequest(msg, hdr, req)
          }

          Adapter.prototype._decodeResponse = function (buf, wres, msg) {
            const tap = new Tap(buf)
            utils.copyOwnProperties(MAP_BYTES_TYPE._read(tap), wres.headers, true)
            const isError = BOOLEAN_TYPE._read(tap)
            const name = msg.name
            if (name) {
              const reader = this._readers[name + (isError ? '*' : '!')]
              msg = this._clientSvc.message(name)
              if (isError) {
                wres.error = reader._read(tap)
              } else {
                wres.response = reader._read(tap)
              }
              if (!tap.isValid()) {
                throw new Error(f('truncated %s response', name))
              }
            } else {
              msg = PING_MESSAGE
            }
          }

          /** Standard "un-framing" stream. */
          function FrameDecoder () {
            stream.Transform.call(this, { readableObjectMode: true })
            this._id = undefined
            this._buf = utils.newBuffer(0)
            this._bufs = []

            this.on('finish', function () { this.push(null) })
          }
          util.inherits(FrameDecoder, stream.Transform)

          FrameDecoder.prototype._transform = function (buf, encoding, cb) {
            buf = Buffer.concat([this._buf, buf])
            let frameLength
            while (
              buf.length >= 4 &&
    buf.length >= (frameLength = buf.readInt32BE(0)) + 4
            ) {
              if (frameLength) {
                this._bufs.push(buf.slice(4, frameLength + 4))
              } else {
                const bufs = this._bufs
                this._bufs = []
                this.push({ id: null, payload: bufs })
              }
              buf = buf.slice(frameLength + 4)
            }
            this._buf = buf
            cb()
          }

          FrameDecoder.prototype._flush = function (cb) {
            if (this._buf.length || this._bufs.length) {
              const bufs = this._bufs.slice()
              bufs.unshift(this._buf)
              const err = toRpcError('TRAILING_DATA')
              // Attach the data to help debugging (e.g. if the encoded bytes contain a
              // human-readable protocol like HTTP).
              err.trailingData = Buffer.concat(bufs).toString()
              this.emit('error', err)
            }
            cb()
          }

          /** Standard framing stream. */
          function FrameEncoder () {
            stream.Transform.call(this, { writableObjectMode: true })
            this.on('finish', function () { this.push(null) })
          }
          util.inherits(FrameEncoder, stream.Transform)

          FrameEncoder.prototype._transform = function (obj, encoding, cb) {
            const bufs = obj.payload
            let i, l, buf
            for (i = 0, l = bufs.length; i < l; i++) {
              buf = bufs[i]
              this.push(intBuffer(buf.length))
              this.push(buf)
            }
            this.push(intBuffer(0))
            cb()
          }

          /** Netty-compatible decoding stream. */
          function NettyDecoder () {
            stream.Transform.call(this, { readableObjectMode: true })
            this._id = undefined
            this._frameCount = 0
            this._buf = utils.newBuffer(0)
            this._bufs = []

            this.on('finish', function () { this.push(null) })
          }
          util.inherits(NettyDecoder, stream.Transform)

          NettyDecoder.prototype._transform = function (buf, encoding, cb) {
            buf = Buffer.concat([this._buf, buf])

            while (true) {
              if (this._id === undefined) {
                if (buf.length < 8) {
                  this._buf = buf
                  cb()
                  return
                }
                this._id = buf.readInt32BE(0)
                this._frameCount = buf.readInt32BE(4)
                buf = buf.slice(8)
              }

              var frameLength
              while (
                this._frameCount &&
      buf.length >= 4 &&
      buf.length >= (frameLength = buf.readInt32BE(0)) + 4
              ) {
                this._frameCount--
                this._bufs.push(buf.slice(4, frameLength + 4))
                buf = buf.slice(frameLength + 4)
              }

              if (this._frameCount) {
                this._buf = buf
                cb()
                return
              } else {
                const obj = { id: this._id, payload: this._bufs }
                this._bufs = []
                this._id = undefined
                this.push(obj)
              }
            }
          }

          NettyDecoder.prototype._flush = FrameDecoder.prototype._flush

          /** Netty-compatible encoding stream. */
          function NettyEncoder () {
            stream.Transform.call(this, { writableObjectMode: true })
            this.on('finish', function () { this.push(null) })
          }
          util.inherits(NettyEncoder, stream.Transform)

          NettyEncoder.prototype._transform = function (obj, encoding, cb) {
            const bufs = obj.payload
            const l = bufs.length
            let buf
            // Header: [ ID, number of frames ]
            buf = utils.newBuffer(8)
            buf.writeInt32BE(obj.id, 0)
            buf.writeInt32BE(l, 4)
            this.push(buf)
            // Frames, each: [ length, bytes ]
            let i
            for (i = 0; i < l; i++) {
              buf = bufs[i]
              this.push(intBuffer(buf.length))
              this.push(buf)
            }
            cb()
          }

          /**
 * Returns a buffer containing an integer's big-endian representation.
 *
 * @param n {Number} Integer.
 */
          function intBuffer (n) {
            const buf = utils.newBuffer(4)
            buf.writeInt32BE(n)
            return buf
          }

          /**
 * Decode a type used as prefix inside a buffer.
 *
 * @param type {Type} The type of the prefix.
 * @param buf {Buffer} Encoded bytes.
 *
 * This function will return an object `{head, tail}` where head contains the
 * decoded value and tail the rest of the buffer. An error will be thrown if
 * the prefix cannot be decoded.
 */
          function readHead (type, buf) {
            const tap = new Tap(buf)
            const head = type._read(tap)
            if (!tap.isValid()) {
              throw new Error(f('truncated %j', type.schema()))
            }
            return { head, tail: tap.buf.slice(tap.pos) }
          }

          /**
 * Generate a decoder, optimizing the case where reader and writer are equal.
 *
 * @param rtype {Type} Reader's type.
 * @param wtype {Type} Writer's type.
 */
          function createReader (rtype, wtype) {
            return rtype.equals(wtype) ? rtype : rtype.createResolver(wtype)
          }

          /**
 * Generate all readers for a given protocol combination.
 *
 * @param clientSvc {Service} Client service.
 * @param serverSvc {Service} Client service.
 */
          function createReaders (clientSvc, serverSvc) {
            const obj = {}
            clientSvc.messages.forEach(function (c) {
              const n = c.name
              const s = serverSvc.message(n)
              try {
                if (!s) {
                  throw new Error(f('missing server message: %s', n))
                }
                if (s.oneWay !== c.oneWay) {
                  throw new Error(f('inconsistent one-way message: %s', n))
                }
                obj[n + '?'] = createReader(s.requestType, c.requestType)
                obj[n + '*'] = createReader(c.errorType, s.errorType)
                obj[n + '!'] = createReader(c.responseType, s.responseType)
              } catch (cause) {
                throw toRpcError('INCOMPATIBLE_PROTOCOL', cause)
              }
            })
            return obj
          }

          /**
 * Populate a cache from a list of protocols.
 *
 * @param cache {Object} Cache of adapters.
 * @param svc {Service} The local service (either client or server).
 * @param ptcls {Array} Array of protocols to insert.
 * @param isClient {Boolean} Whether the local service is a client's or
 * server's.
 */
          function insertRemoteProtocols (cache, ptcls, svc, isClient) {
            Object.keys(ptcls).forEach(function (hash) {
              const ptcl = ptcls[hash]
              let clientSvc, serverSvc
              if (isClient) {
                clientSvc = svc
                serverSvc = Service.forProtocol(ptcl)
              } else {
                clientSvc = Service.forProtocol(ptcl)
                serverSvc = svc
              }
              cache[hash] = new Adapter(clientSvc, serverSvc, hash, true)
            })
          }

          /**
 * Extract remote protocols from a cache
 *
 * @param cache {Object} Cache of adapters.
 * @param isClient {Boolean} Whether the remote protocols extracted should be
 * the servers' or clients'.
 */
          function getRemoteProtocols (cache, isClient) {
            const ptcls = {}
            Object.keys(cache).forEach(function (hs) {
              const adapter = cache[hs]
              if (adapter._isRemote) {
                const svc = isClient ? adapter._serverSvc : adapter._clientSvc
                ptcls[hs] = svc.protocol
              }
            })
            return ptcls
          }

          /**
 * Check whether something is an `Error`.
 *
 * @param any {Object} Any object.
 */
          function isError (any) {
            // Also not ideal, but avoids brittle `instanceof` checks.
            return !!any && Object.prototype.toString.call(any) === '[object Error]'
          }

          /**
 * Forward any errors emitted on the source to the destination.
 *
 * @param src {EventEmitter} The initial source of error events.
 * @param dst {EventEmitter} The new target of the source's error events. The
 * original source will be provided as second argument (the error being the
 * first).
 *
 * As a convenience, the source will be returned.
 */
          function forwardErrors (src, dst) {
            return src.on('error', function (err) {
              dst.emit('error', err, src)
            })
          }

          /**
 * Create an error.
 *
 * @param msg {String} Error message.
 * @param cause {Error} The cause of the error. It is available as `cause`
 * field on the outer error.
 */
          function toError (msg, cause) {
            const err = new Error(msg)
            err.cause = cause
            return err
          }

          /**
 * Mark an error.
 *
 * @param rpcCode {String} Code representing the failure.
 * @param cause {Error} The cause of the error. It is available as `cause`
 * field on the outer error.
 *
 * This is used to keep the argument of channels' `'error'` event errors.
 */
          function toRpcError (rpcCode, cause) {
            const err = toError(rpcCode.toLowerCase().replace(/_/g, ' '), cause)
            err.rpcCode = (cause && cause.rpcCode) ? cause.rpcCode : rpcCode
            return err
          }

          /**
 * Provide a helpful error to identify why serialization failed.
 *
 * @param err {Error} The error to decorate.
 * @param obj {...} The object containing fields to validated.
 * @param fields {Array} Information about the fields to validate.
 */
          function serializationError (msg, obj, fields) {
            const details = []
            let i, l, field
            for (i = 0, l = fields.length; i < l; i++) {
              field = fields[i]
              field.type.isValid(obj[field.name], { errorHook })
            }
            const detailsStr = details
              .map(function (obj) {
                return f('%s = %j but expected %s', obj.path, obj.value, obj.type)
              })
              .join(', ')
            const err = new Error(f('%s (%s)', msg, detailsStr))
            err.details = details
            return err

            function errorHook (parts, any, type) {
              const strs = []
              let i, l, part
              for (i = 0, l = parts.length; i < l; i++) {
                part = parts[i]
                if (isNaN(part)) {
                  strs.push('.' + part)
                } else {
                  strs.push('[' + part + ']')
                }
              }
              details.push({
                path: field.name + strs.join(''),
                value: any,
                type
              })
            }
          }

          /**
 * Compute a prefix of fixed length from a string.
 *
 * @param scope {String} Namespace to be hashed.
 */
          function normalizedPrefix (scope) {
            return scope
              ? utils.getHash(scope).readInt16BE(0) << (32 - PREFIX_LENGTH)
              : 0
          }

          /**
 * Check whether an ID matches the prefix.
 *
 * @param id {Integer} Number to check.
 * @param prefix {Integer} Already shifted prefix.
 */
          function matchesPrefix (id, prefix) {
            return ((id ^ prefix) >> (32 - PREFIX_LENGTH)) === 0
          }

          /**
 * Check whether something is a stream.
 *
 * @param any {Object} Any object.
 */
          function isStream (any) {
            // This is a hacky way of checking that the transport is a stream-like
            // object. We unfortunately can't use `instanceof Stream` checks since
            // some libraries (e.g. websocket-stream) return streams which don't
            // inherit from it.
            return !!(any && any.pipe)
          }

          /**
 * Get a message, asserting that it exists.
 *
 * @param svc {Service} The protocol to look into.
 * @param name {String} The message's name.
 */
          function getExistingMessage (svc, name) {
            const msg = svc.message(name)
            if (!msg) {
              throw new Error(f('unknown message: %s', name))
            }
            return msg
          }

          /**
 * Middleware logic.
 *
 * This is used both in clients and servers to intercept call handling (e.g. to
 * populate headers, do access control).
 *
 * @param params {Object} The following parameters:
 *  + fns {Array} Array of middleware functions.
 *  + ctx {Object} Context used to call the middleware functions, onTransition,
 *    and onCompletion.
 *  + wreq {WrappedRequest}
 *  + wres {WrappedResponse}
 *  + onTransition {Function} End of forward phase callback. It accepts an
 *    eventual error as single argument. This will be used for the backward
 *    phase. This function is guaranteed to be called at most once.
 *  + onCompletion {Function} Final handler, it takes an error as unique
 *    argument. This function is guaranteed to be only at most once.
 *  + onError {Function} Error handler, called if an intermediate callback is
 *    called multiple times.
 */
          function chainMiddleware (params) {
            const args = [params.wreq, params.wres]
            const cbs = []
            let cause // Backpropagated error.
            forward(0)

            function forward (pos) {
              let isDone = false
              if (pos < params.fns.length) {
                params.fns[pos].apply(params.ctx, args.concat(function (err, cb) {
                  if (isDone) {
                    params.onError(toError('duplicate forward middleware call', err))
                    return
                  }
                  isDone = true
                  if (
                    err || (
                      params.wres && ( // Non one-way messages.
                        params.wres.error !== undefined ||
              params.wres.response !== undefined
                      )
                    )
                  ) {
                    // Stop the forward phase, bypass the handler, and start the backward
                    // phase. Note that we ignore any callback argument in this case.
                    cause = err
                    backward()
                    return
                  }
                  if (cb) {
                    cbs.push(cb)
                  }
                  forward(++pos)
                }))
              } else {
                // Done with the middleware forward functions, call the handler.
                params.onTransition.apply(params.ctx, args.concat(function (err) {
                  if (isDone) {
                    params.onError(toError('duplicate handler call', err))
                    return
                  }
                  isDone = true
                  cause = err
                  process.nextTick(backward)
                }))
              }
            }

            function backward () {
              const cb = cbs.pop()
              if (cb) {
                let isDone = false
                cb.call(params.ctx, cause, function (err) {
                  if (isDone) {
                    params.onError(toError('duplicate backward middleware call', err))
                    return
                  }
                  // Substitute the error.
                  cause = err
                  isDone = true
                  backward()
                })
              } else {
                // Done with all middleware calls.
                params.onCompletion.call(params.ctx, cause)
              }
            }
          }

          module.exports = {
            Adapter,
            HANDSHAKE_REQUEST_TYPE,
            HANDSHAKE_RESPONSE_TYPE,
            Message,
            Registry,
            Service,
            discoverProtocol,
            streams: {
              FrameDecoder,
              FrameEncoder,
              NettyDecoder,
              NettyEncoder
            }
          }
        }).call(this)
      }).call(this, require('_process'))
    }, { './types': 10, './utils': 11, _process: 56, buffer: 16, events: 20, stream: 73, util: 80 }],
    9: [function (require, module, exports) {
    /* jshint node: true */

      // TODO: Add minimal templating.
      // TODO: Add option to prefix nested type declarations with the outer types'
      // names.

      'use strict'

      /** IDL to protocol (services) and schema (types) parsing logic. */

      const files = require('./files')
      const utils = require('./utils')
      const path = require('path')
      const util = require('util')

      const f = util.format

      // Default type references defined by Avro.
      const TYPE_REFS = {
        date: { type: 'int', logicalType: 'date' },
        decimal: { type: 'bytes', logicalType: 'decimal' },
        time_ms: { type: 'long', logicalType: 'time-millis' },
        timestamp_ms: { type: 'long', logicalType: 'timestamp-millis' }
      }

      /** Assemble an IDL file into a decoded protocol. */
      function assembleProtocol (fpath, opts, cb) {
        if (!cb && typeof opts === 'function') {
          cb = opts
          opts = undefined
        }
        opts = opts || {}
        if (!opts.importHook) {
          opts.importHook = files.createImportHook()
        }

        importFile(fpath, function (err, protocol) {
          if (err) {
            cb(err)
            return
          }
          if (!protocol) {
            cb(new Error('empty root import'))
            return
          }
          const schemas = protocol.types
          if (schemas) {
          // Strip redundant namespaces from types before returning the protocol.
          // Note that we keep empty (`''`) nested namespaces when the outer one is
          // non-empty. This allows figuring out whether unqualified imported names
          // should be qualified by the protocol's namespace: they should if their
          // namespace is `undefined` and should not if it is empty.
            const namespace = protocolNamespace(protocol) || ''
            schemas.forEach(function (schema) {
              if (schema.namespace === namespace) {
                delete schema.namespace
              }
            })
          }
          cb(null, protocol)
        })

        function importFile (fpath, cb) {
          opts.importHook(fpath, 'idl', function (err, str) {
            if (err) {
              cb(err)
              return
            }
            if (str === undefined) {
            // This signals an already imported file by the default import hooks.
            // Implementors who wish to disallow duplicate imports should provide a
            // custom hook which throws an error when a duplicate is detected.
              cb()
              return
            }
            try {
              const reader = new Reader(str, opts)
              var obj = reader._readProtocol(str, opts)
            } catch (err) {
              err.path = fpath // To help debug which file caused the error.
              cb(err)
              return
            }
            fetchImports(obj.protocol, obj.imports, path.dirname(fpath), cb)
          })
        }

        function fetchImports (protocol, imports, dpath, cb) {
          const importedProtocols = []
          next()

          function next () {
            const info = imports.shift()
            if (!info) {
            // We are done with this file. We prepend all imported types to this
            // file's and we can return the final result.
              importedProtocols.reverse()
              try {
                importedProtocols.forEach(function (imported) {
                  mergeImport(protocol, imported)
                })
              } catch (err) {
                cb(err)
                return
              }
              cb(null, protocol)
              return
            }
            const importPath = path.join(dpath, info.name)
            if (info.kind === 'idl') {
              importFile(importPath, function (err, imported) {
                if (err) {
                  cb(err)
                  return
                }
                if (imported) {
                  importedProtocols.push(imported)
                }
                next()
              })
            } else {
            // We are importing a protocol or schema file.
              opts.importHook(importPath, info.kind, function (err, str) {
                if (err) {
                  cb(err)
                  return
                }
                switch (info.kind) {
                  case 'protocol':
                  case 'schema':
                    if (str === undefined) {
                    // Skip duplicate import (see related comment above).
                      next()
                      return
                    }
                    try {
                      var obj = JSON.parse(str)
                    } catch (err) {
                      err.path = importPath
                      cb(err)
                      return
                    }
                    var imported = info.kind === 'schema' ? { types: [obj] } : obj
                    importedProtocols.push(imported)
                    next()
                    return
                  default:
                    cb(new Error(f('invalid import kind: %s', info.kind)))
                }
              })
            }
          }
        }

        function mergeImport (protocol, imported) {
        // Merge first the types (where we don't need to check for duplicates
        // since instantiating the service will take care of it), then the messages
        // (where we need to, as duplicates will overwrite each other).
          const schemas = imported.types || []
          schemas.reverse()
          schemas.forEach(function (schema) {
            if (!protocol.types) {
              protocol.types = []
            }
            // Ensure the imported protocol's namespace is inherited correctly (it
            // might be different from the current one).
            if (schema.namespace === undefined) {
              schema.namespace = protocolNamespace(imported) || ''
            }
            protocol.types.unshift(schema)
          })
          Object.keys(imported.messages || {}).forEach(function (name) {
            if (!protocol.messages) {
              protocol.messages = {}
            }
            if (protocol.messages[name]) {
              throw new Error(f('duplicate message: %s', name))
            }
            protocol.messages[name] = imported.messages[name]
          })
        }
      }

      // Parsing functions.

      /**
 * Convenience function to parse multiple inputs into protocols and schemas.
 *
 * It should cover most basic use-cases but has a few limitations:
 *
 * + It doesn't allow passing options to the parsing step.
 * + The protocol/type inference logic can be deceived.
 *
 * The parsing logic is as follows:
 *
 * + If `str` contains `path.sep` (on windows `\`, otherwise `/`) and is a path
 *   to an existing file, it will first be read as JSON, then as an IDL
 *   specification if JSON parsing failed. If either succeeds, the result is
 *   returned, otherwise the next steps are run using the file's content
 *   instead of the input path.
 * + If `str` is a valid JSON string, it is parsed then returned.
 * + If `str` is a valid IDL protocol specification, it is parsed and returned
 *   if no imports are present (and an error is thrown if there are any
 *   imports).
 * + If `str` is a valid IDL type specification, it is parsed and returned.
 * + If neither of the above cases apply, `str` is returned.
 */
      function read (str) {
        let schema
        if (typeof str === 'string' && ~str.indexOf(path.sep) && files.existsSync(str)) {
        // Try interpreting `str` as path to a file contain a JSON schema or an IDL
        // protocol. Note that we add the second check to skip primitive references
        // (e.g. `"int"`, the most common use-case for `avro.parse`).
          const contents = files.readFileSync(str, { encoding: 'utf8' })
          try {
            return JSON.parse(contents)
          } catch (err) {
            const opts = { importHook: files.createSyncImportHook() }
            assembleProtocol(str, opts, function (err, protocolSchema) {
              schema = err ? contents : protocolSchema
            })
          }
        } else {
          schema = str
        }
        if (typeof schema !== 'string' || schema === 'null') {
        // This last predicate is to allow `read('null')` to work similarly to
        // `read('int')` and other primitives (null needs to be handled separately
        // since it is also a valid JSON identifier).
          return schema
        }
        try {
          return JSON.parse(schema)
        } catch (err) {
          try {
            return Reader.readProtocol(schema)
          } catch (err) {
            try {
              return Reader.readSchema(schema)
            } catch (err) {
              return schema
            }
          }
        }
      }

      function Reader (str, opts) {
        opts = opts || {}

        this._tk = new Tokenizer(str)
        this._ackVoidMessages = !!opts.ackVoidMessages
        this._implicitTags = !opts.delimitedCollections
        this._typeRefs = opts.typeRefs || TYPE_REFS
      }

      Reader.readProtocol = function (str, opts) {
        const reader = new Reader(str, opts)
        const protocol = reader._readProtocol()
        if (protocol.imports.length) {
        // Imports can only be resolved when the IDL file is provided via its
        // path, we fail rather than silently ignore imports.
          throw new Error('unresolvable import')
        }
        return protocol.protocol
      }

      Reader.readSchema = function (str, opts) {
        const reader = new Reader(str, opts)
        const doc = reader._readJavadoc()
        const schema = reader._readType(doc === undefined ? {} : { doc }, true)
        reader._tk.next({ id: '(eof)' }) // Check that we have read everything.
        return schema
      }

      Reader.prototype._readProtocol = function () {
        const tk = this._tk
        const imports = []
        const types = []
        const messages = {}
        let pos

        // Outer declarations (outside of the protocol block).
        this._readImports(imports)
        const protocolSchema = {}
        const protocolJavadoc = this._readJavadoc()
        if (protocolJavadoc !== undefined) {
          protocolSchema.doc = protocolJavadoc
        }
        this._readAnnotations(protocolSchema)
        tk.next({ val: 'protocol' })
        if (!tk.next({ val: '{', silent: true })) {
        // Named protocol.
          protocolSchema.protocol = tk.next({ id: 'name' }).val
          tk.next({ val: '{' })
        }

        // Inner declarations.
        while (!tk.next({ val: '}', silent: true })) {
          if (!this._readImports(imports)) {
            let javadoc = this._readJavadoc()
            let typeSchema = this._readType({}, true)
            const numImports = this._readImports(imports, true)
            let message
            // We mark our position and try to parse a message from here.
            pos = tk.pos
            if (!numImports && (message = this._readMessage(typeSchema))) {
            // Note that if any imports were found, we cannot be parsing a message.
              if (javadoc !== undefined && message.schema.doc === undefined) {
                message.schema.doc = javadoc
              }
              let oneWay = false
              if (
                message.schema.response === 'void' ||
          message.schema.response.type === 'void'
              ) {
                oneWay = !this._ackVoidMessages && !message.schema.errors
                if (message.schema.response === 'void') {
                  message.schema.response = 'null'
                } else {
                  message.schema.response.type = 'null'
                }
              }
              if (oneWay) {
                message.schema['one-way'] = true
              }
              if (messages[message.name]) {
              // We have to do this check here otherwise the duplicate will be
              // overwritten (and service instantiation won't be able to catch it).
                throw new Error(f('duplicate message: %s', message.name))
              }
              messages[message.name] = message.schema
            } else {
            // This was a standalone type definition.
              if (javadoc) {
                if (typeof typeSchema === 'string') {
                  typeSchema = { doc: javadoc, type: typeSchema }
                } else if (typeSchema.doc === undefined) {
                  typeSchema.doc = javadoc
                }
              }
              types.push(typeSchema)
              // We backtrack until just before the type's type name and swallow an
              // eventual semi-colon (to make type declarations more consistent).
              tk.pos = pos
              tk.next({ val: ';', silent: true })
            }
            javadoc = undefined
          }
        }
        tk.next({ id: '(eof)' })
        if (types.length) {
          protocolSchema.types = types
        }
        if (Object.keys(messages).length) {
          protocolSchema.messages = messages
        }
        return { protocol: protocolSchema, imports }
      }

      Reader.prototype._readAnnotations = function (schema) {
        const tk = this._tk
        while (tk.next({ val: '@', silent: true })) {
        // Annotations are allowed to have names which aren't valid Avro names,
        // we must advance until we hit the first left parenthesis.
          const parts = []
          while (!tk.next({ val: '(', silent: true })) {
            parts.push(tk.next().val)
          }
          schema[parts.join('')] = tk.next({ id: 'json' }).val
          tk.next({ val: ')' })
        }
      }

      Reader.prototype._readMessage = function (responseSchema) {
        const tk = this._tk
        const schema = { request: [], response: responseSchema }
        this._readAnnotations(schema)
        const name = tk.next().val
        if (tk.next().val !== '(') {
        // This isn't a message.
          return
        }
        if (!tk.next({ val: ')', silent: true })) {
          do {
            schema.request.push(this._readField())
          } while (!tk.next({ val: ')', silent: true }) && tk.next({ val: ',' }))
        }
        const token = tk.next()
        switch (token.val) {
          case 'throws':
          // It doesn't seem like the IDL is explicit about which syntax to used
          // for multiple errors. We will assume a comma-separated list.
            schema.errors = []
            do {
              schema.errors.push(this._readType())
            } while (!tk.next({ val: ';', silent: true }) && tk.next({ val: ',' }))
            break
          case 'oneway':
            schema['one-way'] = true
            tk.next({ val: ';' })
            break
          case ';':
            break
          default:
            throw tk.error('invalid message suffix', token)
        }
        return { name, schema }
      }

      Reader.prototype._readJavadoc = function () {
        const token = this._tk.next({ id: 'javadoc', emitJavadoc: true, silent: true })
        if (token) {
          return token.val
        }
      }

      Reader.prototype._readField = function () {
        const tk = this._tk
        const javadoc = this._readJavadoc()
        const schema = { type: this._readType() }
        if (javadoc !== undefined && schema.doc === undefined) {
          schema.doc = javadoc
        }
        this._readAnnotations(schema)
        schema.name = tk.next({ id: 'name' }).val
        if (tk.next({ val: '=', silent: true })) {
          schema.default = tk.next({ id: 'json' }).val
        }
        return schema
      }

      Reader.prototype._readType = function (schema, top) {
        schema = schema || {}
        this._readAnnotations(schema)
        schema.type = this._tk.next({ id: 'name' }).val
        switch (schema.type) {
          case 'record':
          case 'error':
            return this._readRecord(schema)
          case 'fixed':
            return this._readFixed(schema)
          case 'enum':
            return this._readEnum(schema, top)
          case 'map':
            return this._readMap(schema)
          case 'array':
            return this._readArray(schema)
          case 'union':
            if (Object.keys(schema).length > 1) {
              throw new Error('union annotations are not supported')
            }
            return this._readUnion()
          default:
          // Reference.
            var ref = this._typeRefs[schema.type]
            if (ref) {
              delete schema.type // Always overwrite the type.
              utils.copyOwnProperties(ref, schema)
            }
            return Object.keys(schema).length > 1 ? schema : schema.type
        }
      }

      Reader.prototype._readFixed = function (schema) {
        const tk = this._tk
        if (!tk.next({ val: '(', silent: true })) {
          schema.name = tk.next({ id: 'name' }).val
          tk.next({ val: '(' })
        }
        schema.size = parseInt(tk.next({ id: 'number' }).val)
        tk.next({ val: ')' })
        return schema
      }

      Reader.prototype._readMap = function (schema) {
        const tk = this._tk
        // Brackets are unwieldy when declaring inline types. We allow for them to be
        // omitted (but we keep the consistency that if the entry bracket is present,
        // the exit one must be as well). Note that this is non-standard.
        const silent = this._implicitTags
        const implicitTags = tk.next({ val: '<', silent }) === undefined
        schema.values = this._readType()
        tk.next({ val: '>', silent: implicitTags })
        return schema
      }

      Reader.prototype._readArray = function (schema) {
        const tk = this._tk
        const silent = this._implicitTags
        const implicitTags = tk.next({ val: '<', silent }) === undefined
        schema.items = this._readType()
        tk.next({ val: '>', silent: implicitTags })
        return schema
      }

      Reader.prototype._readEnum = function (schema, top) {
        const tk = this._tk
        if (!tk.next({ val: '{', silent: true })) {
          schema.name = tk.next({ id: 'name' }).val
          tk.next({ val: '{' })
        }
        schema.symbols = []
        do {
          schema.symbols.push(tk.next().val)
        } while (!tk.next({ val: '}', silent: true }) && tk.next({ val: ',' }))
        // To avoid confusing syntax, reader enums (i.e. enums with a default value)
        // can only be defined top-level.
        if (top && tk.next({ val: '=', silent: true })) {
          schema.default = tk.next().val
          tk.next({ val: ';' })
        }
        return schema
      }

      Reader.prototype._readUnion = function () {
        const tk = this._tk
        const arr = []
        tk.next({ val: '{' })
        do {
          arr.push(this._readType())
        } while (!tk.next({ val: '}', silent: true }) && tk.next({ val: ',' }))
        return arr
      }

      Reader.prototype._readRecord = function (schema) {
        const tk = this._tk
        if (!tk.next({ val: '{', silent: true })) {
          schema.name = tk.next({ id: 'name' }).val
          tk.next({ val: '{' })
        }
        schema.fields = []
        while (!tk.next({ val: '}', silent: true })) {
          schema.fields.push(this._readField())
          tk.next({ val: ';' })
        }
        return schema
      }

      Reader.prototype._readImports = function (imports, maybeMessage) {
        const tk = this._tk
        let numImports = 0
        const pos = tk.pos
        while (tk.next({ val: 'import', silent: true })) {
          if (!numImports && maybeMessage && tk.next({ val: '(', silent: true })) {
          // This will happen if a message is named import.
            tk.pos = pos
            return
          }
          const kind = tk.next({ id: 'name' }).val
          const fname = JSON.parse(tk.next({ id: 'string' }).val)
          tk.next({ val: ';' })
          imports.push({ kind, name: fname })
          numImports++
        }
        return numImports
      }

      // Helpers.

      /**
 * Simple class to split an input string into tokens.
 *
 * There are different types of tokens, characterized by their `id`:
 *
 * + `number` numbers.
 * + `name` references.
 * + `string` double-quoted.
 * + `operator`, anything else, always single character.
 * + `javadoc`, only emitted when `next` is called with `emitJavadoc` set.
 * + `json`, only emitted when `next` is called with `'json'` as `id` (the
 *   tokenizer doesn't have enough context to predict these).
 */
      function Tokenizer (str) {
        this._str = str
        this.pos = 0
      }

      Tokenizer.prototype.next = function (opts) {
        const token = { pos: this.pos, id: undefined, val: undefined }
        const javadoc = this._skip(opts && opts.emitJavadoc)
        if (typeof javadoc === 'string') {
          token.id = 'javadoc'
          token.val = javadoc
        } else {
          const pos = this.pos
          const str = this._str
          const c = str.charAt(pos)
          if (!c) {
            token.id = '(eof)'
          } else {
            if (opts && opts.id === 'json') {
              token.id = 'json'
              this.pos = this._endOfJson()
            } else if (c === '"') {
              token.id = 'string'
              this.pos = this._endOfString()
            } else if (/[0-9]/.test(c)) {
              token.id = 'number'
              this.pos = this._endOf(/[0-9]/)
            } else if (/[`A-Za-z_.]/.test(c)) {
              token.id = 'name'
              this.pos = this._endOf(/[`A-Za-z0-9_.]/)
            } else {
              token.id = 'operator'
              this.pos = pos + 1
            }
            token.val = str.slice(pos, this.pos)
            if (token.id === 'json') {
            // Let's be nice and give a more helpful error message when this occurs
            // (JSON parsing errors wouldn't let us find the location otherwise).
              try {
                token.val = JSON.parse(token.val)
              } catch (err) {
                throw this.error('invalid JSON', token)
              }
            } else if (token.id === 'name') {
            // Unescape names (our parser doesn't need them).
              token.val = token.val.replace(/`/g, '')
            }
          }
        }

        let err
        if (opts && opts.id && opts.id !== token.id) {
          err = this.error(f('expected ID %s', opts.id), token)
        } else if (opts && opts.val && opts.val !== token.val) {
          err = this.error(f('expected value %s', opts.val), token)
        }
        if (!err) {
          return token
        } else if (opts && opts.silent) {
          this.pos = token.pos // Backtrack to start of token.
          return undefined
        } else {
          throw err
        }
      }

      Tokenizer.prototype.error = function (reason, context) {
      // Context must be either a token or a position.
        const isToken = typeof context !== 'number'
        const pos = isToken ? context.pos : context
        const str = this._str
        let lineNum = 1
        let lineStart = 0
        let i
        for (i = 0; i < pos; i++) {
          if (str.charAt(i) === '\n') {
            lineNum++
            lineStart = i
          }
        }
        const msg = isToken ? f('invalid token %j: %s', context, reason) : reason
        const err = new Error(msg)
        err.token = isToken ? context : undefined
        err.lineNum = lineNum
        err.colNum = pos - lineStart
        return err
      }

      /** Skip whitespace and comments. */
      Tokenizer.prototype._skip = function (emitJavadoc) {
        const str = this._str
        let isJavadoc = false
        let pos, c

        while ((c = str.charAt(this.pos)) && /\s/.test(c)) {
          this.pos++
        }
        pos = this.pos
        if (c === '/') {
          switch (str.charAt(this.pos + 1)) {
            case '/':
              this.pos += 2
              while ((c = str.charAt(this.pos)) && c !== '\n') {
                this.pos++
              }
              return this._skip(emitJavadoc)
            case '*':
              this.pos += 2
              if (str.charAt(this.pos) === '*') {
                isJavadoc = true
              }
              while ((c = str.charAt(this.pos++))) {
                if (c === '*' && str.charAt(this.pos) === '/') {
                  this.pos++
                  if (isJavadoc && emitJavadoc) {
                    return extractJavadoc(str.slice(pos + 3, this.pos - 2))
                  }
                  return this._skip(emitJavadoc)
                }
              }
              throw this.error('unterminated comment', pos)
          }
        }
      }

      /** Generic end of method. */
      Tokenizer.prototype._endOf = function (pat) {
        let pos = this.pos
        const str = this._str
        while (pat.test(str.charAt(pos))) {
          pos++
        }
        return pos
      }

      /** Find end of a string. */
      Tokenizer.prototype._endOfString = function () {
        let pos = this.pos + 1 // Skip first double quote.
        const str = this._str
        let c
        while ((c = str.charAt(pos))) {
          if (c === '"') {
          // The spec doesn't explicitly say so, but IDLs likely only
          // allow double quotes for strings (C- and Java-style).
            return pos + 1
          }
          if (c === '\\') {
            pos += 2
          } else {
            pos++
          }
        }
        throw this.error('unterminated string', pos - 1)
      }

      /** Find end of JSON object, throwing an error if the end is reached first. */
      Tokenizer.prototype._endOfJson = function () {
        const pos = utils.jsonEnd(this._str, this.pos)
        if (pos < 0) {
          throw this.error('invalid JSON', pos)
        }
        return pos
      }

      /**
 * Extract Javadoc contents from the comment.
 *
 * The parsing done is very simple and simply removes the line prefixes and
 * leading / trailing empty lines. It's better to be conservative with
 * formatting rather than risk losing information.
 */
      function extractJavadoc (str) {
        const lines = str
          .replace(/^[ \t]+|[ \t]+$/g, '') // Trim whitespace.
          .split('\n').map(function (line, i) {
            return i ? line.replace(/^\s*\*\s?/, '') : line
          })
        while (lines.length && !lines[0]) {
          lines.shift()
        }
        while (lines.length && !lines[lines.length - 1]) {
          lines.pop()
        }
        return lines.join('\n')
      }

      /** Returns the namespace generated by a protocol. */
      function protocolNamespace (protocol) {
        if (protocol.namespace) {
          return protocol.namespace
        }
        const match = /^(.*)\.[^.]+$/.exec(protocol.protocol)
        return match ? match[1] : undefined
      }

      module.exports = {
        Tokenizer,
        assembleProtocol,
        read,
        readProtocol: Reader.readProtocol,
        readSchema: Reader.readSchema
      }
    }, { './files': 6, './utils': 11, path: 55, util: 80 }],
    10: [function (require, module, exports) {
    /* jshint node: true */

      // TODO: Make it easier to implement custom types. This will likely require
      // exposing the `Tap` object, perhaps under another name. Probably worth a
      // major release.
      // TODO: Allow configuring when to write the size when writing arrays and maps,
      // and customizing their block size.
      // TODO: Code-generate `compare` and `clone` record and union methods.

      'use strict'

      /**
 * This module defines all Avro data types and their serialization logic.
 *
 */

      const utils = require('./utils')
      const buffer = require('buffer') // For `SlowBuffer`.
      const util = require('util')

      const Buffer = buffer.Buffer
      const SlowBuffer = buffer.SlowBuffer

      // Convenience imports.
      const Tap = utils.Tap
      const debug = util.debuglog('avsc:types')
      const f = util.format

      // All non-union concrete (i.e. non-logical) Avro types.
      const TYPES = {
        array: ArrayType,
        boolean: BooleanType,
        bytes: BytesType,
        double: DoubleType,
        enum: EnumType,
        error: RecordType,
        fixed: FixedType,
        float: FloatType,
        int: IntType,
        long: LongType,
        map: MapType,
        null: NullType,
        record: RecordType,
        string: StringType
      }

      // Random generator.
      const RANDOM = new utils.Lcg()

      // Encoding tap (shared for performance).
      const TAP = new Tap(new SlowBuffer(1024))

      // Currently active logical type, used for name redirection.
      let LOGICAL_TYPE = null

      // Underlying types of logical types currently being instantiated. This is used
      // to be able to reference names (i.e. for branches) during instantiation.
      const UNDERLYING_TYPES = []

      /**
 * "Abstract" base Avro type.
 *
 * This class' constructor will register any named types to support recursive
 * schemas. All type values are represented in memory similarly to their JSON
 * representation, except for:
 *
 * + `bytes` and `fixed` which are represented as `Buffer`s.
 * + `union`s which will be "unwrapped" unless the `wrapUnions` option is set.
 *
 *  See individual subclasses for details.
 */
      function Type (schema, opts) {
        let type
        if (LOGICAL_TYPE) {
          type = LOGICAL_TYPE
          UNDERLYING_TYPES.push([LOGICAL_TYPE, this])
          LOGICAL_TYPE = null
        } else {
          type = this
        }

        // Lazily instantiated hash string. It will be generated the first time the
        // type's default fingerprint is computed (for example when using `equals`).
        // We use a mutable object since types are frozen after instantiation.
        this._hash = new Hash()
        this.name = undefined
        this.aliases = undefined
        this.doc = (schema && schema.doc) ? '' + schema.doc : undefined

        if (schema) {
        // This is a complex (i.e. non-primitive) type.
          let name = schema.name
          const namespace = schema.namespace === undefined
            ? opts && opts.namespace
            : schema.namespace
          if (name !== undefined) {
          // This isn't an anonymous type.
            name = maybeQualify(name, namespace)
            if (isPrimitive(name)) {
            // Avro doesn't allow redefining primitive names.
              throw new Error(f('cannot rename primitive type: %j', name))
            }
            const registry = opts && opts.registry
            if (registry) {
              if (registry[name] !== undefined) {
                throw new Error(f('duplicate type name: %s', name))
              }
              registry[name] = type
            }
          } else if (opts && opts.noAnonymousTypes) {
            throw new Error(f('missing name property in schema: %j', schema))
          }
          this.name = name
          this.aliases = schema.aliases
            ? schema.aliases.map(function (s) { return maybeQualify(s, namespace) })
            : []
        }
      }

      Type.forSchema = function (schema, opts) {
        opts = opts || {}
        opts.registry = opts.registry || {}

        let UnionType = (function (wrapUnions) {
          if (wrapUnions === true) {
            wrapUnions = 'always'
          } else if (wrapUnions === false) {
            wrapUnions = 'never'
          } else if (wrapUnions === undefined) {
            wrapUnions = 'auto'
          } else if (typeof wrapUnions === 'string') {
            wrapUnions = wrapUnions.toLowerCase()
          }
          switch (wrapUnions) {
            case 'always':
              return WrappedUnionType
            case 'never':
              return UnwrappedUnionType
            case 'auto':
              return undefined // Determined dynamically later on.
            default:
              throw new Error(f('invalid wrap unions option: %j', wrapUnions))
          }
        })(opts.wrapUnions)

        if (schema === null) {
        // Let's be helpful for this common error.
          throw new Error('invalid type: null (did you mean "null"?)')
        }

        if (Type.isType(schema)) {
          return schema
        }

        let type
        if (opts.typeHook && (type = opts.typeHook(schema, opts))) {
          if (!Type.isType(type)) {
            throw new Error(f('invalid typehook return value: %j', type))
          }
          return type
        }

        if (typeof schema === 'string') { // Type reference.
          schema = maybeQualify(schema, opts.namespace)
          type = opts.registry[schema]
          if (type) {
          // Type was already defined, return it.
            return type
          }
          if (isPrimitive(schema)) {
          // Reference to a primitive type. These are also defined names by default
          // so we create the appropriate type and it to the registry for future
          // reference.
            return opts.registry[schema] = Type.forSchema({ type: schema }, opts)
          }
          throw new Error(f('undefined type name: %s', schema))
        }

        if (schema.logicalType && opts.logicalTypes && !LOGICAL_TYPE) {
          const DerivedType = opts.logicalTypes[schema.logicalType]
          if (DerivedType) {
            const namespace = opts.namespace
            const registry = {}
            Object.keys(opts.registry).forEach(function (key) {
              registry[key] = opts.registry[key]
            })
            try {
              debug('instantiating logical type for %s', schema.logicalType)
              return new DerivedType(schema, opts)
            } catch (err) {
              debug('failed to instantiate logical type for %s', schema.logicalType)
              if (opts.assertLogicalTypes) {
              // The spec mandates that we fall through to the underlying type if
              // the logical type is invalid. We provide this option to ease
              // debugging.
                throw err
              }
              LOGICAL_TYPE = null
              opts.namespace = namespace
              opts.registry = registry
            }
          }
        }

        if (Array.isArray(schema)) { // Union.
        // We temporarily clear the logical type since we instantiate the branch's
        // types before the underlying union's type (necessary to decide whether the
        // union is ambiguous or not).
          const logicalType = LOGICAL_TYPE
          LOGICAL_TYPE = null
          const types = schema.map(function (obj) {
            return Type.forSchema(obj, opts)
          })
          if (!UnionType) {
            UnionType = isAmbiguous(types) ? WrappedUnionType : UnwrappedUnionType
          }
          LOGICAL_TYPE = logicalType
          type = new UnionType(types, opts)
        } else { // New type definition.
          type = (function (typeName) {
            const Type = TYPES[typeName]
            if (Type === undefined) {
              throw new Error(f('unknown type: %j', typeName))
            }
            return new Type(schema, opts)
          })(schema.type)
        }
        return type
      }

      Type.forValue = function (val, opts) {
        opts = opts || {}

        // Sentinel used when inferring the types of empty arrays.
        opts.emptyArrayType = opts.emptyArrayType || Type.forSchema({
          type: 'array', items: 'null'
        })

        // Optional custom inference hook.
        if (opts.valueHook) {
          const type = opts.valueHook(val, opts)
          if (type !== undefined) {
            if (!Type.isType(type)) {
              throw new Error(f('invalid value hook return value: %j', type))
            }
            return type
          }
        }

        // Default inference logic.
        switch (typeof val) {
          case 'string':
            return Type.forSchema('string', opts)
          case 'boolean':
            return Type.forSchema('boolean', opts)
          case 'number':
            if ((val | 0) === val) {
              return Type.forSchema('int', opts)
            } else if (Math.abs(val) < 9007199254740991) {
              return Type.forSchema('float', opts)
            }
            return Type.forSchema('double', opts)
          case 'object':
            if (val === null) {
              return Type.forSchema('null', opts)
            } else if (Array.isArray(val)) {
              if (!val.length) {
                return opts.emptyArrayType
              }
              return Type.forSchema({
                type: 'array',
                items: Type.forTypes(
                  val.map(function (v) { return Type.forValue(v, opts) }),
                  opts
                )
              }, opts)
            } else if (Buffer.isBuffer(val)) {
              return Type.forSchema('bytes', opts)
            }
            var fieldNames = Object.keys(val)
            if (fieldNames.some(function (s) { return !utils.isValidName(s) })) {
            // We have to fall back to a map.
              return Type.forSchema({
                type: 'map',
                values: Type.forTypes(fieldNames.map(function (s) {
                  return Type.forValue(val[s], opts)
                }), opts)
              }, opts)
            }
            return Type.forSchema({
              type: 'record',
              fields: fieldNames.map(function (s) {
                return { name: s, type: Type.forValue(val[s], opts) }
              })
            }, opts)
          default:
            throw new Error(f('cannot infer type from: %j', val))
        }
      }

      Type.forTypes = function (types, opts) {
        if (!types.length) {
          throw new Error('no types to combine')
        }
        if (types.length === 1) {
          return types[0] // Nothing to do.
        }
        opts = opts || {}

        // Extract any union types, with special care for wrapped unions (see below).
        let expanded = []
        let numWrappedUnions = 0
        let isValidWrappedUnion = true
        types.forEach(function (type) {
          switch (type.typeName) {
            case 'union:unwrapped':
              isValidWrappedUnion = false
              expanded = expanded.concat(type.types)
              break
            case 'union:wrapped':
              numWrappedUnions++
              expanded = expanded.concat(type.types)
              break
            case 'null':
              expanded.push(type)
              break
            default:
              isValidWrappedUnion = false
              expanded.push(type)
          }
        })
        if (numWrappedUnions) {
          if (!isValidWrappedUnion) {
          // It is only valid to combine wrapped unions when no other type is
          // present other than wrapped unions and nulls (otherwise the values of
          // others wouldn't be valid in the resulting union).
            throw new Error('cannot combine wrapped union')
          }
          const branchTypes = {}
          expanded.forEach(function (type) {
            const name = type.branchName
            const branchType = branchTypes[name]
            if (!branchType) {
              branchTypes[name] = type
            } else if (!type.equals(branchType)) {
              throw new Error('inconsistent branch type')
            }
          })
          const wrapUnions = opts.wrapUnions
          let unionType
          opts.wrapUnions = true
          try {
            unionType = Type.forSchema(Object.keys(branchTypes).map(function (name) {
              return branchTypes[name]
            }), opts)
          } catch (err) {
            opts.wrapUnions = wrapUnions
            throw err
          }
          opts.wrapUnions = wrapUnions
          return unionType
        }

        // Group types by category, similar to the logic for unwrapped unions.
        const bucketized = {}
        expanded.forEach(function (type) {
          const bucket = getTypeBucket(type)
          let bucketTypes = bucketized[bucket]
          if (!bucketTypes) {
            bucketized[bucket] = bucketTypes = []
          }
          bucketTypes.push(type)
        })

        // Generate the "augmented" type for each group.
        const buckets = Object.keys(bucketized)
        const augmented = buckets.map(function (bucket) {
          let bucketTypes = bucketized[bucket]
          if (bucketTypes.length === 1) {
            return bucketTypes[0]
          } else {
            switch (bucket) {
              case 'null':
              case 'boolean':
                return bucketTypes[0]
              case 'number':
                return combineNumbers(bucketTypes)
              case 'string':
                return combineStrings(bucketTypes, opts)
              case 'buffer':
                return combineBuffers(bucketTypes, opts)
              case 'array':
              // Remove any sentinel arrays (used when inferring from empty arrays)
              // to avoid making things nullable when they shouldn't be.
                bucketTypes = bucketTypes.filter(function (t) {
                  return t !== opts.emptyArrayType
                })
                if (!bucketTypes.length) {
                // We still don't have a real type, just return the sentinel.
                  return opts.emptyArrayType
                }
                return Type.forSchema({
                  type: 'array',
                  items: Type.forTypes(bucketTypes.map(function (t) {
                    return t.itemsType
                  }), opts)
                }, opts)
              default:
                return combineObjects(bucketTypes, opts)
            }
          }
        })

        if (augmented.length === 1) {
          return augmented[0]
        } else {
        // We return an (unwrapped) union of all augmented types.
          return Type.forSchema(augmented, opts)
        }
      }

      Type.isType = function (/* any, [prefix] ... */) {
        const l = arguments.length
        if (!l) {
          return false
        }

        const any = arguments[0]
        if (
          !any ||
    typeof any._update !== 'function' ||
    typeof any.fingerprint !== 'function'
        ) {
        // Not fool-proof, but most likely good enough.
          return false
        }

        if (l === 1) {
        // No type names specified, we are done.
          return true
        }

        // We check if at least one of the prefixes matches.
        const typeName = any.typeName
        let i
        for (i = 1; i < l; i++) {
          if (typeName.indexOf(arguments[i]) === 0) {
            return true
          }
        }
        return false
      }

      Type.__reset = function (size) {
        debug('resetting type buffer to %d', size)
        TAP.buf = new SlowBuffer(size)
      }

      Object.defineProperty(Type.prototype, 'branchName', {
        enumerable: true,
        get: function () {
          const type = Type.isType(this, 'logical') ? this.underlyingType : this
          if (type.name) {
            return type.name
          }
          if (Type.isType(type, 'abstract')) {
            return type._concreteTypeName
          }
          return Type.isType(type, 'union') ? undefined : type.typeName
        }
      })

      Type.prototype.clone = function (val, opts) {
        if (opts) {
          opts = {
            coerce: !!opts.coerceBuffers | 0, // Coerce JSON to Buffer.
            fieldHook: opts.fieldHook,
            qualifyNames: !!opts.qualifyNames,
            skip: !!opts.skipMissingFields,
            wrap: !!opts.wrapUnions | 0 // Wrap first match into union.
          }
          return this._copy(val, opts)
        } else {
        // If no modifications are required, we can get by with a serialization
        // roundtrip (generally much faster than a standard deep copy).
          return this.fromBuffer(this.toBuffer(val))
        }
      }

      Type.prototype.compare = utils.abstractFunction

      Type.prototype.compareBuffers = function (buf1, buf2) {
        return this._match(new Tap(buf1), new Tap(buf2))
      }

      Type.prototype.createResolver = function (type, opts) {
        if (!Type.isType(type)) {
        // More explicit error message than the "incompatible type" thrown
        // otherwise (especially because of the overridden `toJSON` method).
          throw new Error(f('not a type: %j', type))
        }

        if (!Type.isType(this, 'union', 'logical') && Type.isType(type, 'logical')) {
        // Trying to read a logical type as a built-in: unwrap the logical type.
        // Note that we exclude unions to support resolving into unions containing
        // logical types.
          return this.createResolver(type.underlyingType, opts)
        }

        opts = opts || {}
        opts.registry = opts.registry || {}

        let resolver, key
        if (
          Type.isType(this, 'record', 'error') &&
    Type.isType(type, 'record', 'error')
        ) {
        // We allow conversions between records and errors.
          key = this.name + ':' + type.name // ':' is illegal in Avro type names.
          resolver = opts.registry[key]
          if (resolver) {
            return resolver
          }
        }

        resolver = new Resolver(this)
        if (key) { // Register resolver early for recursive schemas.
          opts.registry[key] = resolver
        }

        if (Type.isType(type, 'union')) {
          const resolvers = type.types.map(function (t) {
            return this.createResolver(t, opts)
          }, this)
          resolver._read = function (tap) {
            const index = tap.readLong()
            const resolver = resolvers[index]
            if (resolver === undefined) {
              throw new Error(f('invalid union index: %s', index))
            }
            return resolvers[index]._read(tap)
          }
        } else {
          this._update(resolver, type, opts)
        }

        if (!resolver._read) {
          throw new Error(f('cannot read %s as %s', type, this))
        }
        return Object.freeze(resolver)
      }

      Type.prototype.decode = function (buf, pos, resolver) {
        const tap = new Tap(buf, pos)
        const val = readValue(this, tap, resolver)
        if (!tap.isValid()) {
          return { value: undefined, offset: -1 }
        }
        return { value: val, offset: tap.pos }
      }

      Type.prototype.encode = function (val, buf, pos) {
        const tap = new Tap(buf, pos)
        this._write(tap, val)
        if (!tap.isValid()) {
        // Don't throw as there is no way to predict this. We also return the
        // number of missing bytes to ease resizing.
          return buf.length - tap.pos
        }
        return tap.pos
      }

      Type.prototype.equals = function (type, opts) {
        const canon = ( // Canonical equality.
          Type.isType(type) &&
    this.fingerprint().equals(type.fingerprint())
        )
        if (!canon || !(opts && opts.strict)) {
          return canon
        }
        return (
          JSON.stringify(this.schema({ exportAttrs: true })) ===
    JSON.stringify(type.schema({ exportAttrs: true }))
        )
      }

      Type.prototype.fingerprint = function (algorithm) {
        if (!algorithm) {
          if (!this._hash.str) {
            const schemaStr = JSON.stringify(this.schema())
            this._hash.str = utils.getHash(schemaStr).toString('binary')
          }
          return utils.bufferFrom(this._hash.str, 'binary')
        } else {
          return utils.getHash(JSON.stringify(this.schema()), algorithm)
        }
      }

      Type.prototype.fromBuffer = function (buf, resolver, noCheck) {
        const tap = new Tap(buf)
        const val = readValue(this, tap, resolver, noCheck)
        if (!tap.isValid()) {
          throw new Error('truncated buffer')
        }
        if (!noCheck && tap.pos < buf.length) {
          throw new Error('trailing data')
        }
        return val
      }

      Type.prototype.fromString = function (str) {
        return this._copy(JSON.parse(str), { coerce: 2 })
      }

      Type.prototype.inspect = function () {
        const typeName = this.typeName
        const className = getClassName(typeName)
        if (isPrimitive(typeName)) {
        // The class name is sufficient to identify the type.
          return f('<%s>', className)
        } else {
        // We add a little metadata for convenience.
          const obj = this.schema({ exportAttrs: true, noDeref: true })
          if (typeof obj === 'object' && !Type.isType(this, 'logical')) {
            obj.type = undefined // Would be redundant with constructor name.
          }
          return f('<%s %j>', className, obj)
        }
      }

      Type.prototype.isValid = function (val, opts) {
      // We only have a single flag for now, so no need to complicate things.
        const flags = (opts && opts.noUndeclaredFields) | 0
        const errorHook = opts && opts.errorHook
        let hook, path
        if (errorHook) {
          path = []
          hook = function (any, type) {
            errorHook.call(this, path.slice(), any, type, val)
          }
        }
        return this._check(val, flags, hook, path)
      }

      Type.prototype.random = utils.abstractFunction

      Type.prototype.schema = function (opts) {
      // Copy the options to avoid mutating the original options object when we add
      // the registry of dereferenced types.
        return this._attrs({
          exportAttrs: !!(opts && opts.exportAttrs),
          noDeref: !!(opts && opts.noDeref)
        })
      }

      Type.prototype.toBuffer = function (val) {
        TAP.pos = 0
        this._write(TAP, val)
        const buf = utils.newBuffer(TAP.pos)
        if (TAP.isValid()) {
          TAP.buf.copy(buf, 0, 0, TAP.pos)
        } else {
          this._write(new Tap(buf), val)
        }
        return buf
      }

      Type.prototype.toJSON = function () {
      // Convenience to allow using `JSON.stringify(type)` to get a type's schema.
        return this.schema({ exportAttrs: true })
      }

      Type.prototype.toString = function (val) {
        if (val === undefined) {
        // Consistent behavior with standard `toString` expectations.
          return JSON.stringify(this.schema({ noDeref: true }))
        }
        return JSON.stringify(this._copy(val, { coerce: 3 }))
      }

      Type.prototype.wrap = function (val) {
        const Branch = this._branchConstructor
        return Branch === null ? null : new Branch(val)
      }

      Type.prototype._attrs = function (opts) {
      // This function handles a lot of the common logic to schema generation
      // across types, for example keeping track of which types have already been
      // de-referenced (i.e. derefed).
        opts.derefed = opts.derefed || {}
        const name = this.name
        if (name !== undefined) {
          if (opts.noDeref || opts.derefed[name]) {
            return name
          }
          opts.derefed[name] = true
        }
        let schema = {}
        // The order in which we add fields to the `schema` object matters here.
        // Since JS objects are unordered, this implementation (unfortunately) relies
        // on engines returning properties in the same order that they are inserted
        // in. This is not in the JS spec, but can be "somewhat" safely assumed (see
        // http://stackoverflow.com/q/5525795/1062617).
        if (this.name !== undefined) {
          schema.name = name
        }
        schema.type = this.typeName
        const derefedSchema = this._deref(schema, opts)
        if (derefedSchema !== undefined) {
        // We allow the original schema to be overridden (this will happen for
        // primitive types and logical types).
          schema = derefedSchema
        }
        if (opts.exportAttrs) {
          if (this.aliases && this.aliases.length) {
            schema.aliases = this.aliases
          }
          if (this.doc !== undefined) {
            schema.doc = this.doc
          }
        }
        return schema
      }

      Type.prototype._createBranchConstructor = function () {
      // jshint -W054
        const name = this.branchName
        if (name === 'null') {
          return null
        }
        const attr = ~name.indexOf('.') ? 'this[\'' + name + '\']' : 'this.' + name
        const body = 'return function Branch$(val) { ' + attr + ' = val; };'
        const Branch = (new Function(body))()
        Branch.type = this
        Branch.prototype.unwrap = new Function('return ' + attr + ';')
        Branch.prototype.unwrapped = Branch.prototype.unwrap // Deprecated.
        return Branch
      }

      Type.prototype._peek = function (tap) {
        const pos = tap.pos
        const val = this._read(tap)
        tap.pos = pos
        return val
      }

      Type.prototype._check = utils.abstractFunction
      Type.prototype._copy = utils.abstractFunction
      Type.prototype._deref = utils.abstractFunction
      Type.prototype._match = utils.abstractFunction
      Type.prototype._read = utils.abstractFunction
      Type.prototype._skip = utils.abstractFunction
      Type.prototype._update = utils.abstractFunction
      Type.prototype._write = utils.abstractFunction

      // "Deprecated" getters (will be explicitly deprecated in 5.1).

      Type.prototype.getAliases = function () { return this.aliases }

      Type.prototype.getFingerprint = Type.prototype.fingerprint

      Type.prototype.getName = function (asBranch) {
        return (this.name || !asBranch) ? this.name : this.branchName
      }

      Type.prototype.getSchema = Type.prototype.schema

      Type.prototype.getTypeName = function () { return this.typeName }

      // Implementations.

      /**
 * Base primitive Avro type.
 *
 * Most of the primitive types share the same cloning and resolution
 * mechanisms, provided by this class. This class also lets us conveniently
 * check whether a type is a primitive using `instanceof`.
 */
      function PrimitiveType (noFreeze) {
        Type.call(this)
        this._branchConstructor = this._createBranchConstructor()
        if (!noFreeze) {
        // Abstract long types can't be frozen at this stage.
          Object.freeze(this)
        }
      }
      util.inherits(PrimitiveType, Type)

      PrimitiveType.prototype._update = function (resolver, type) {
        if (type.typeName === this.typeName) {
          resolver._read = this._read
        }
      }

      PrimitiveType.prototype._copy = function (val) {
        this._check(val, undefined, throwInvalidError)
        return val
      }

      PrimitiveType.prototype._deref = function () { return this.typeName }

      PrimitiveType.prototype.compare = utils.compare

      /** Nulls. */
      function NullType () { PrimitiveType.call(this) }
      util.inherits(NullType, PrimitiveType)

      NullType.prototype._check = function (val, flags, hook) {
        const b = val === null
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      NullType.prototype._read = function () { return null }

      NullType.prototype._skip = function () {}

      NullType.prototype._write = function (tap, val) {
        if (val !== null) {
          throwInvalidError(val, this)
        }
      }

      NullType.prototype._match = function () { return 0 }

      NullType.prototype.compare = NullType.prototype._match

      NullType.prototype.typeName = 'null'

      NullType.prototype.random = NullType.prototype._read

      /** Booleans. */
      function BooleanType () { PrimitiveType.call(this) }
      util.inherits(BooleanType, PrimitiveType)

      BooleanType.prototype._check = function (val, flags, hook) {
        const b = typeof val === 'boolean'
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      BooleanType.prototype._read = function (tap) { return tap.readBoolean() }

      BooleanType.prototype._skip = function (tap) { tap.skipBoolean() }

      BooleanType.prototype._write = function (tap, val) {
        if (typeof val !== 'boolean') {
          throwInvalidError(val, this)
        }
        tap.writeBoolean(val)
      }

      BooleanType.prototype._match = function (tap1, tap2) {
        return tap1.matchBoolean(tap2)
      }

      BooleanType.prototype.typeName = 'boolean'

      BooleanType.prototype.random = function () { return RANDOM.nextBoolean() }

      /** Integers. */
      function IntType () { PrimitiveType.call(this) }
      util.inherits(IntType, PrimitiveType)

      IntType.prototype._check = function (val, flags, hook) {
        const b = val === (val | 0)
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      IntType.prototype._read = function (tap) { return tap.readInt() }

      IntType.prototype._skip = function (tap) { tap.skipInt() }

      IntType.prototype._write = function (tap, val) {
        if (val !== (val | 0)) {
          throwInvalidError(val, this)
        }
        tap.writeInt(val)
      }

      IntType.prototype._match = function (tap1, tap2) {
        return tap1.matchInt(tap2)
      }

      IntType.prototype.typeName = 'int'

      IntType.prototype.random = function () { return RANDOM.nextInt(1000) | 0 }

      /**
 * Longs.
 *
 * We can't capture all the range unfortunately since JavaScript represents all
 * numbers internally as `double`s, so the default implementation plays safe
 * and throws rather than potentially silently change the data. See `__with` or
 * `AbstractLongType` below for a way to implement a custom long type.
 */
      function LongType () { PrimitiveType.call(this) }
      util.inherits(LongType, PrimitiveType)

      LongType.prototype._check = function (val, flags, hook) {
        const b = typeof val === 'number' && val % 1 === 0 && isSafeLong(val)
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      LongType.prototype._read = function (tap) {
        const n = tap.readLong()
        if (!isSafeLong(n)) {
          throw new Error('potential precision loss')
        }
        return n
      }

      LongType.prototype._skip = function (tap) { tap.skipLong() }

      LongType.prototype._write = function (tap, val) {
        if (typeof val !== 'number' || val % 1 || !isSafeLong(val)) {
          throwInvalidError(val, this)
        }
        tap.writeLong(val)
      }

      LongType.prototype._match = function (tap1, tap2) {
        return tap1.matchLong(tap2)
      }

      LongType.prototype._update = function (resolver, type) {
        switch (type.typeName) {
          case 'int':
            resolver._read = type._read
            break
          case 'abstract:long':
          case 'long':
            resolver._read = this._read // In case `type` is an `AbstractLongType`.
        }
      }

      LongType.prototype.typeName = 'long'

      LongType.prototype.random = function () { return RANDOM.nextInt() }

      LongType.__with = function (methods, noUnpack) {
        methods = methods || {} // Will give a more helpful error message.
        // We map some of the methods to a different name to be able to intercept
        // their input and output (otherwise we wouldn't be able to perform any
        // unpacking logic, and the type wouldn't work when nested).
        const mapping = {
          toBuffer: '_toBuffer',
          fromBuffer: '_fromBuffer',
          fromJSON: '_fromJSON',
          toJSON: '_toJSON',
          isValid: '_isValid',
          compare: 'compare'
        }
        const type = new AbstractLongType(noUnpack)
        Object.keys(mapping).forEach(function (name) {
          if (methods[name] === undefined) {
            throw new Error(f('missing method implementation: %s', name))
          }
          type[mapping[name]] = methods[name]
        })
        return Object.freeze(type)
      }

      /** Floats. */
      function FloatType () { PrimitiveType.call(this) }
      util.inherits(FloatType, PrimitiveType)

      FloatType.prototype._check = function (val, flags, hook) {
        const b = typeof val === 'number'
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      FloatType.prototype._read = function (tap) { return tap.readFloat() }

      FloatType.prototype._skip = function (tap) { tap.skipFloat() }

      FloatType.prototype._write = function (tap, val) {
        if (typeof val !== 'number') {
          throwInvalidError(val, this)
        }
        tap.writeFloat(val)
      }

      FloatType.prototype._match = function (tap1, tap2) {
        return tap1.matchFloat(tap2)
      }

      FloatType.prototype._update = function (resolver, type) {
        switch (type.typeName) {
          case 'float':
          case 'int':
            resolver._read = type._read
            break
          case 'abstract:long':
          case 'long':
          // No need to worry about precision loss here since we're always rounding
          // to float anyway.
            resolver._read = function (tap) { return tap.readLong() }
        }
      }

      FloatType.prototype.typeName = 'float'

      FloatType.prototype.random = function () { return RANDOM.nextFloat(1e3) }

      /** Doubles. */
      function DoubleType () { PrimitiveType.call(this) }
      util.inherits(DoubleType, PrimitiveType)

      DoubleType.prototype._check = function (val, flags, hook) {
        const b = typeof val === 'number'
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      DoubleType.prototype._read = function (tap) { return tap.readDouble() }

      DoubleType.prototype._skip = function (tap) { tap.skipDouble() }

      DoubleType.prototype._write = function (tap, val) {
        if (typeof val !== 'number') {
          throwInvalidError(val, this)
        }
        tap.writeDouble(val)
      }

      DoubleType.prototype._match = function (tap1, tap2) {
        return tap1.matchDouble(tap2)
      }

      DoubleType.prototype._update = function (resolver, type) {
        switch (type.typeName) {
          case 'double':
          case 'float':
          case 'int':
            resolver._read = type._read
            break
          case 'abstract:long':
          case 'long':
          // Similar to inside `FloatType`, no need to worry about precision loss
          // here since we're always rounding to double anyway.
            resolver._read = function (tap) { return tap.readLong() }
        }
      }

      DoubleType.prototype.typeName = 'double'

      DoubleType.prototype.random = function () { return RANDOM.nextFloat() }

      /** Strings. */
      function StringType () { PrimitiveType.call(this) }
      util.inherits(StringType, PrimitiveType)

      StringType.prototype._check = function (val, flags, hook) {
        const b = typeof val === 'string'
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      StringType.prototype._read = function (tap) { return tap.readString() }

      StringType.prototype._skip = function (tap) { tap.skipString() }

      StringType.prototype._write = function (tap, val) {
        if (typeof val !== 'string') {
          throwInvalidError(val, this)
        }
        tap.writeString(val)
      }

      StringType.prototype._match = function (tap1, tap2) {
        return tap1.matchString(tap2)
      }

      StringType.prototype._update = function (resolver, type) {
        switch (type.typeName) {
          case 'bytes':
          case 'string':
            resolver._read = this._read
        }
      }

      StringType.prototype.typeName = 'string'

      StringType.prototype.random = function () {
        return RANDOM.nextString(RANDOM.nextInt(32))
      }

      /**
 * Bytes.
 *
 * These are represented in memory as `Buffer`s rather than binary-encoded
 * strings. This is more efficient (when decoding/encoding from bytes, the
 * common use-case), idiomatic, and convenient.
 *
 * Note the coercion in `_copy`.
 */
      function BytesType () { PrimitiveType.call(this) }
      util.inherits(BytesType, PrimitiveType)

      BytesType.prototype._check = function (val, flags, hook) {
        const b = Buffer.isBuffer(val)
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      BytesType.prototype._read = function (tap) { return tap.readBytes() }

      BytesType.prototype._skip = function (tap) { tap.skipBytes() }

      BytesType.prototype._write = function (tap, val) {
        if (!Buffer.isBuffer(val)) {
          throwInvalidError(val, this)
        }
        tap.writeBytes(val)
      }

      BytesType.prototype._match = function (tap1, tap2) {
        return tap1.matchBytes(tap2)
      }

      BytesType.prototype._update = StringType.prototype._update

      BytesType.prototype._copy = function (obj, opts) {
        let buf
        switch ((opts && opts.coerce) | 0) {
          case 3: // Coerce buffers to strings.
            this._check(obj, undefined, throwInvalidError)
            return obj.toString('binary')
          case 2: // Coerce strings to buffers.
            if (typeof obj !== 'string') {
              throw new Error(f('cannot coerce to buffer: %j', obj))
            }
            buf = utils.bufferFrom(obj, 'binary')
            this._check(buf, undefined, throwInvalidError)
            return buf
          case 1: // Coerce buffer JSON representation to buffers.
            if (!isJsonBuffer(obj)) {
              throw new Error(f('cannot coerce to buffer: %j', obj))
            }
            buf = utils.bufferFrom(obj.data)
            this._check(buf, undefined, throwInvalidError)
            return buf
          default: // Copy buffer.
            this._check(obj, undefined, throwInvalidError)
            return utils.bufferFrom(obj)
        }
      }

      BytesType.prototype.compare = Buffer.compare

      BytesType.prototype.typeName = 'bytes'

      BytesType.prototype.random = function () {
        return RANDOM.nextBuffer(RANDOM.nextInt(32))
      }

      /** Base "abstract" Avro union type. */
      function UnionType (schema, opts) {
        Type.call(this)

        if (!Array.isArray(schema)) {
          throw new Error(f('non-array union schema: %j', schema))
        }
        if (!schema.length) {
          throw new Error('empty union')
        }
        this.types = Object.freeze(schema.map(function (obj) {
          return Type.forSchema(obj, opts)
        }))

        this._branchIndices = {}
        this.types.forEach(function (type, i) {
          if (Type.isType(type, 'union')) {
            throw new Error('unions cannot be directly nested')
          }
          const branch = type.branchName
          if (this._branchIndices[branch] !== undefined) {
            throw new Error(f('duplicate union branch name: %j', branch))
          }
          this._branchIndices[branch] = i
        }, this)
      }
      util.inherits(UnionType, Type)

      UnionType.prototype._branchConstructor = function () {
        throw new Error('unions cannot be directly wrapped')
      }

      UnionType.prototype._skip = function (tap) {
        this.types[tap.readLong()]._skip(tap)
      }

      UnionType.prototype._match = function (tap1, tap2) {
        const n1 = tap1.readLong()
        const n2 = tap2.readLong()
        if (n1 === n2) {
          return this.types[n1]._match(tap1, tap2)
        } else {
          return n1 < n2 ? -1 : 1
        }
      }

      UnionType.prototype._deref = function (schema, opts) {
        return this.types.map(function (t) { return t._attrs(opts) })
      }

      UnionType.prototype.getTypes = function () { return this.types }

      /**
 * "Natural" union type.
 *
 * This representation doesn't require a wrapping object and is therefore
 * simpler and generally closer to what users expect. However it cannot be used
 * to represent all Avro unions since some lead to ambiguities (e.g. if two
 * number types are in the union).
 *
 * Currently, this union supports at most one type in each of the categories
 * below:
 *
 * + `null`
 * + `boolean`
 * + `int`, `long`, `float`, `double`
 * + `string`, `enum`
 * + `bytes`, `fixed`
 * + `array`
 * + `map`, `record`
 */
      function UnwrappedUnionType (schema, opts) {
        UnionType.call(this, schema, opts)

        this._dynamicBranches = null
        this._bucketIndices = {}
        this.types.forEach(function (type, index) {
          if (Type.isType(type, 'abstract', 'logical')) {
            if (!this._dynamicBranches) {
              this._dynamicBranches = []
            }
            this._dynamicBranches.push({ index, type })
          } else {
            const bucket = getTypeBucket(type)
            if (this._bucketIndices[bucket] !== undefined) {
              throw new Error(f('ambiguous unwrapped union: %j', this))
            }
            this._bucketIndices[bucket] = index
          }
        }, this)

        Object.freeze(this)
      }
      util.inherits(UnwrappedUnionType, UnionType)

      UnwrappedUnionType.prototype._getIndex = function (val) {
        let index = this._bucketIndices[getValueBucket(val)]
        if (this._dynamicBranches) {
        // Slower path, we must run the value through all branches.
          index = this._getBranchIndex(val, index)
        }
        return index
      }

      UnwrappedUnionType.prototype._getBranchIndex = function (any, index) {
        const logicalBranches = this._dynamicBranches
        let i, l, branch
        for (i = 0, l = logicalBranches.length; i < l; i++) {
          branch = logicalBranches[i]
          if (branch.type._check(any)) {
            if (index === undefined) {
              index = branch.index
            } else {
            // More than one branch matches the value so we aren't guaranteed to
            // infer the correct type. We throw rather than corrupt data. This can
            // be fixed by "tightening" the logical types.
              throw new Error('ambiguous conversion')
            }
          }
        }
        return index
      }

      UnwrappedUnionType.prototype._check = function (val, flags, hook, path) {
        const index = this._getIndex(val)
        const b = index !== undefined
        if (b) {
          return this.types[index]._check(val, flags, hook, path)
        }
        if (hook) {
          hook(val, this)
        }
        return b
      }

      UnwrappedUnionType.prototype._read = function (tap) {
        const index = tap.readLong()
        const branchType = this.types[index]
        if (branchType) {
          return branchType._read(tap)
        } else {
          throw new Error(f('invalid union index: %s', index))
        }
      }

      UnwrappedUnionType.prototype._write = function (tap, val) {
        const index = this._getIndex(val)
        if (index === undefined) {
          throwInvalidError(val, this)
        }
        tap.writeLong(index)
        if (val !== null) {
          this.types[index]._write(tap, val)
        }
      }

      UnwrappedUnionType.prototype._update = function (resolver, type, opts) {
      // jshint -W083
      // (The loop exits after the first function is created.)
        let i, l, typeResolver
        for (i = 0, l = this.types.length; i < l; i++) {
          try {
            typeResolver = this.types[i].createResolver(type, opts)
          } catch (err) {
            continue
          }
          resolver._read = function (tap) { return typeResolver._read(tap) }
          return
        }
      }

      UnwrappedUnionType.prototype._copy = function (val, opts) {
        const coerce = opts && opts.coerce | 0
        const wrap = opts && opts.wrap | 0
        let index
        if (wrap === 2) {
        // We are parsing a default, so always use the first branch's type.
          index = 0
        } else {
          switch (coerce) {
            case 1:
            // Using the `coerceBuffers` option can cause corruption and erroneous
            // failures with unwrapped unions (in rare cases when the union also
            // contains a record which matches a buffer's JSON representation).
              if (isJsonBuffer(val) && this._bucketIndices.buffer !== undefined) {
                index = this._bucketIndices.buffer
              } else {
                index = this._getIndex(val)
              }
              break
            case 2:
            // Decoding from JSON, we must unwrap the value.
              if (val === null) {
                index = this._bucketIndices.null
              } else if (typeof val === 'object') {
                const keys = Object.keys(val)
                if (keys.length === 1) {
                  index = this._branchIndices[keys[0]]
                  val = val[keys[0]]
                }
              }
              break
            default:
              index = this._getIndex(val)
          }
          if (index === undefined) {
            throwInvalidError(val, this)
          }
        }
        const type = this.types[index]
        if (val === null || wrap === 3) {
          return type._copy(val, opts)
        } else {
          switch (coerce) {
            case 3:
            // Encoding to JSON, we wrap the value.
              var obj = {}
              obj[type.branchName] = type._copy(val, opts)
              return obj
            default:
              return type._copy(val, opts)
          }
        }
      }

      UnwrappedUnionType.prototype.compare = function (val1, val2) {
        const index1 = this._getIndex(val1)
        const index2 = this._getIndex(val2)
        if (index1 === undefined) {
          throwInvalidError(val1, this)
        } else if (index2 === undefined) {
          throwInvalidError(val2, this)
        } else if (index1 === index2) {
          return this.types[index1].compare(val1, val2)
        } else {
          return utils.compare(index1, index2)
        }
      }

      UnwrappedUnionType.prototype.typeName = 'union:unwrapped'

      UnwrappedUnionType.prototype.random = function () {
        const index = RANDOM.nextInt(this.types.length)
        return this.types[index].random()
      }

      /**
 * Compatible union type.
 *
 * Values of this type are represented in memory similarly to their JSON
 * representation (i.e. inside an object with single key the name of the
 * contained type).
 *
 * This is not ideal, but is the most efficient way to unambiguously support
 * all unions. Here are a few reasons why the wrapping object is necessary:
 *
 * + Unions with multiple number types would have undefined behavior, unless
 *   numbers are wrapped (either everywhere, leading to large performance and
 *   convenience costs; or only when necessary inside unions, making it hard to
 *   understand when numbers are wrapped or not).
 * + Fixed types would have to be wrapped to be distinguished from bytes.
 * + Using record's constructor names would work (after a slight change to use
 *   the fully qualified name), but would mean that generic objects could no
 *   longer be valid records (making it inconvenient to do simple things like
 *   creating new records).
 */
      function WrappedUnionType (schema, opts) {
        UnionType.call(this, schema, opts)
        Object.freeze(this)
      }
      util.inherits(WrappedUnionType, UnionType)

      WrappedUnionType.prototype._check = function (val, flags, hook, path) {
        let b = false
        if (val === null) {
        // Shortcut type lookup in this case.
          b = this._branchIndices.null !== undefined
        } else if (typeof val === 'object') {
          const keys = Object.keys(val)
          if (keys.length === 1) {
          // We require a single key here to ensure that writes are correct and
          // efficient as soon as a record passes this check.
            const name = keys[0]
            const index = this._branchIndices[name]
            if (index !== undefined) {
              if (hook) {
              // Slow path.
                path.push(name)
                b = this.types[index]._check(val[name], flags, hook, path)
                path.pop()
                return b
              } else {
                return this.types[index]._check(val[name], flags)
              }
            }
          }
        }
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      WrappedUnionType.prototype._read = function (tap) {
        const type = this.types[tap.readLong()]
        if (!type) {
          throw new Error(f('invalid union index'))
        }
        const Branch = type._branchConstructor
        if (Branch === null) {
          return null
        } else {
          return new Branch(type._read(tap))
        }
      }

      WrappedUnionType.prototype._write = function (tap, val) {
        let index, keys, name
        if (val === null) {
          index = this._branchIndices.null
          if (index === undefined) {
            throwInvalidError(val, this)
          }
          tap.writeLong(index)
        } else {
          keys = Object.keys(val)
          if (keys.length === 1) {
            name = keys[0]
            index = this._branchIndices[name]
          }
          if (index === undefined) {
            throwInvalidError(val, this)
          }
          tap.writeLong(index)
          this.types[index]._write(tap, val[name])
        }
      }

      WrappedUnionType.prototype._update = function (resolver, type, opts) {
      // jshint -W083
      // (The loop exits after the first function is created.)
        let i, l, typeResolver, Branch
        for (i = 0, l = this.types.length; i < l; i++) {
          try {
            typeResolver = this.types[i].createResolver(type, opts)
          } catch (err) {
            continue
          }
          Branch = this.types[i]._branchConstructor
          if (Branch) {
            resolver._read = function (tap) {
              return new Branch(typeResolver._read(tap))
            }
          } else {
            resolver._read = function () { return null }
          }
          return
        }
      }

      WrappedUnionType.prototype._copy = function (val, opts) {
        const wrap = opts && opts.wrap | 0
        if (wrap === 2) {
          const firstType = this.types[0]
          // Promote into first type (used for schema defaults).
          if (val === null && firstType.typeName === 'null') {
            return null
          }
          return new firstType._branchConstructor(firstType._copy(val, opts))
        }
        if (val === null && this._branchIndices.null !== undefined) {
          return null
        }

        let i, l, obj
        if (typeof val === 'object') {
          const keys = Object.keys(val)
          if (keys.length === 1) {
            const name = keys[0]
            i = this._branchIndices[name]
            if (i === undefined && opts.qualifyNames) {
            // We are a bit more flexible than in `_check` here since we have
            // to deal with other serializers being less strict, so we fall
            // back to looking up unqualified names.
              let j, type
              for (j = 0, l = this.types.length; j < l; j++) {
                type = this.types[j]
                if (type.name && name === utils.unqualify(type.name)) {
                  i = j
                  break
                }
              }
            }
            if (i !== undefined) {
              obj = this.types[i]._copy(val[name], opts)
            }
          }
        }
        if (wrap === 1 && obj === undefined) {
        // Try promoting into first match (convenience, slow).
          i = 0
          l = this.types.length
          while (i < l && obj === undefined) {
            try {
              obj = this.types[i]._copy(val, opts)
            } catch (err) {
              i++
            }
          }
        }
        if (obj !== undefined) {
          return wrap === 3 ? obj : new this.types[i]._branchConstructor(obj)
        }
        throwInvalidError(val, this)
      }

      WrappedUnionType.prototype.compare = function (val1, val2) {
        const name1 = val1 === null ? 'null' : Object.keys(val1)[0]
        const name2 = val2 === null ? 'null' : Object.keys(val2)[0]
        const index = this._branchIndices[name1]
        if (name1 === name2) {
          return name1 === 'null'
            ? 0
            : this.types[index].compare(val1[name1], val2[name1])
        } else {
          return utils.compare(index, this._branchIndices[name2])
        }
      }

      WrappedUnionType.prototype.typeName = 'union:wrapped'

      WrappedUnionType.prototype.random = function () {
        const index = RANDOM.nextInt(this.types.length)
        const type = this.types[index]
        const Branch = type._branchConstructor
        if (!Branch) {
          return null
        }
        return new Branch(type.random())
      }

      /**
 * Avro enum type.
 *
 * Represented as strings (with allowed values from the set of symbols). Using
 * integers would be a reasonable option, but the performance boost is arguably
 * offset by the legibility cost and the extra deviation from the JSON encoding
 * convention.
 *
 * An integer representation can still be used (e.g. for compatibility with
 * TypeScript `enum`s) by overriding the `EnumType` with a `LongType` (e.g. via
 * `parse`'s registry).
 */
      function EnumType (schema, opts) {
        Type.call(this, schema, opts)
        if (!Array.isArray(schema.symbols) || !schema.symbols.length) {
          throw new Error(f('invalid enum symbols: %j', schema.symbols))
        }
        this.symbols = Object.freeze(schema.symbols.slice())
        this._indices = {}
        this.symbols.forEach(function (symbol, i) {
          if (!utils.isValidName(symbol)) {
            throw new Error(f('invalid %s symbol: %j', this, symbol))
          }
          if (this._indices[symbol] !== undefined) {
            throw new Error(f('duplicate %s symbol: %j', this, symbol))
          }
          this._indices[symbol] = i
        }, this)
        this.default = schema.default
        if (this.default !== undefined && this._indices[this.default] === undefined) {
          throw new Error(f('invalid %s default: %j', this, this.default))
        }
        this._branchConstructor = this._createBranchConstructor()
        Object.freeze(this)
      }
      util.inherits(EnumType, Type)

      EnumType.prototype._check = function (val, flags, hook) {
        const b = this._indices[val] !== undefined
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      EnumType.prototype._read = function (tap) {
        const index = tap.readLong()
        const symbol = this.symbols[index]
        if (symbol === undefined) {
          throw new Error(f('invalid %s enum index: %s', this.name, index))
        }
        return symbol
      }

      EnumType.prototype._skip = function (tap) { tap.skipLong() }

      EnumType.prototype._write = function (tap, val) {
        const index = this._indices[val]
        if (index === undefined) {
          throwInvalidError(val, this)
        }
        tap.writeLong(index)
      }

      EnumType.prototype._match = function (tap1, tap2) {
        return tap1.matchLong(tap2)
      }

      EnumType.prototype.compare = function (val1, val2) {
        return utils.compare(this._indices[val1], this._indices[val2])
      }

      EnumType.prototype._update = function (resolver, type, opts) {
        const symbols = this.symbols
        if (
          type.typeName === 'enum' &&
    hasCompatibleName(this, type, !opts.ignoreNamespaces) &&
    (
      type.symbols.every(function (s) { return ~symbols.indexOf(s) }) ||
      this.default !== undefined
    )
        ) {
          resolver.symbols = type.symbols.map(function (s) {
            return this._indices[s] === undefined ? this.default : s
          }, this)
          resolver._read = type._read
        }
      }

      EnumType.prototype._copy = function (val) {
        this._check(val, undefined, throwInvalidError)
        return val
      }

      EnumType.prototype._deref = function (schema) {
        schema.symbols = this.symbols
      }

      EnumType.prototype.getSymbols = function () { return this.symbols }

      EnumType.prototype.typeName = 'enum'

      EnumType.prototype.random = function () {
        return RANDOM.choice(this.symbols)
      }

      /** Avro fixed type. Represented simply as a `Buffer`. */
      function FixedType (schema, opts) {
        Type.call(this, schema, opts)
        if (schema.size !== (schema.size | 0) || schema.size < 0) {
          throw new Error(f('invalid %s size', this.branchName))
        }
        this.size = schema.size | 0
        this._branchConstructor = this._createBranchConstructor()
        Object.freeze(this)
      }
      util.inherits(FixedType, Type)

      FixedType.prototype._check = function (val, flags, hook) {
        const b = Buffer.isBuffer(val) && val.length === this.size
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      FixedType.prototype._read = function (tap) {
        return tap.readFixed(this.size)
      }

      FixedType.prototype._skip = function (tap) {
        tap.skipFixed(this.size)
      }

      FixedType.prototype._write = function (tap, val) {
        if (!Buffer.isBuffer(val) || val.length !== this.size) {
          throwInvalidError(val, this)
        }
        tap.writeFixed(val, this.size)
      }

      FixedType.prototype._match = function (tap1, tap2) {
        return tap1.matchFixed(tap2, this.size)
      }

      FixedType.prototype.compare = Buffer.compare

      FixedType.prototype._update = function (resolver, type, opts) {
        if (
          type.typeName === 'fixed' &&
    this.size === type.size &&
    hasCompatibleName(this, type, !opts.ignoreNamespaces)
        ) {
          resolver.size = this.size
          resolver._read = this._read
        }
      }

      FixedType.prototype._copy = BytesType.prototype._copy

      FixedType.prototype._deref = function (schema) { schema.size = this.size }

      FixedType.prototype.getSize = function () { return this.size }

      FixedType.prototype.typeName = 'fixed'

      FixedType.prototype.random = function () {
        return RANDOM.nextBuffer(this.size)
      }

      /** Avro map. Represented as vanilla objects. */
      function MapType (schema, opts) {
        Type.call(this)
        if (!schema.values) {
          throw new Error(f('missing map values: %j', schema))
        }
        this.valuesType = Type.forSchema(schema.values, opts)
        this._branchConstructor = this._createBranchConstructor()
        Object.freeze(this)
      }
      util.inherits(MapType, Type)

      MapType.prototype._check = function (val, flags, hook, path) {
        if (!val || typeof val !== 'object' || Array.isArray(val)) {
          if (hook) {
            hook(val, this)
          }
          return false
        }

        const keys = Object.keys(val)
        let b = true
        let i, l, j, key
        if (hook) {
        // Slow path.
          j = path.length
          path.push('')
          for (i = 0, l = keys.length; i < l; i++) {
            key = path[j] = keys[i]
            if (!this.valuesType._check(val[key], flags, hook, path)) {
              b = false
            }
          }
          path.pop()
        } else {
          for (i = 0, l = keys.length; i < l; i++) {
            if (!this.valuesType._check(val[keys[i]], flags)) {
              return false
            }
          }
        }
        return b
      }

      MapType.prototype._read = function (tap) {
        const values = this.valuesType
        const val = {}
        let n
        while ((n = readArraySize(tap))) {
          while (n--) {
            const key = tap.readString()
            val[key] = values._read(tap)
          }
        }
        return val
      }

      MapType.prototype._skip = function (tap) {
        const values = this.valuesType
        let len, n
        while ((n = tap.readLong())) {
          if (n < 0) {
            len = tap.readLong()
            tap.pos += len
          } else {
            while (n--) {
              tap.skipString()
              values._skip(tap)
            }
          }
        }
      }

      MapType.prototype._write = function (tap, val) {
        if (!val || typeof val !== 'object' || Array.isArray(val)) {
          throwInvalidError(val, this)
        }

        const values = this.valuesType
        const keys = Object.keys(val)
        const n = keys.length
        let i, key
        if (n) {
          tap.writeLong(n)
          for (i = 0; i < n; i++) {
            key = keys[i]
            tap.writeString(key)
            values._write(tap, val[key])
          }
        }
        tap.writeLong(0)
      }

      MapType.prototype._match = function () {
        throw new Error('maps cannot be compared')
      }

      MapType.prototype._update = function (rsv, type, opts) {
        if (type.typeName === 'map') {
          rsv.valuesType = this.valuesType.createResolver(type.valuesType, opts)
          rsv._read = this._read
        }
      }

      MapType.prototype._copy = function (val, opts) {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const values = this.valuesType
          const keys = Object.keys(val)
          let i, l, key
          const copy = {}
          for (i = 0, l = keys.length; i < l; i++) {
            key = keys[i]
            copy[key] = values._copy(val[key], opts)
          }
          return copy
        }
        throwInvalidError(val, this)
      }

      MapType.prototype.compare = MapType.prototype._match

      MapType.prototype.typeName = 'map'

      MapType.prototype.getValuesType = function () { return this.valuesType }

      MapType.prototype.random = function () {
        const val = {}
        let i, l
        for (i = 0, l = RANDOM.nextInt(10); i < l; i++) {
          val[RANDOM.nextString(RANDOM.nextInt(20))] = this.valuesType.random()
        }
        return val
      }

      MapType.prototype._deref = function (schema, opts) {
        schema.values = this.valuesType._attrs(opts)
      }

      /** Avro array. Represented as vanilla arrays. */
      function ArrayType (schema, opts) {
        Type.call(this)
        if (!schema.items) {
          throw new Error(f('missing array items: %j', schema))
        }
        this.itemsType = Type.forSchema(schema.items, opts)
        this._branchConstructor = this._createBranchConstructor()
        Object.freeze(this)
      }
      util.inherits(ArrayType, Type)

      ArrayType.prototype._check = function (val, flags, hook, path) {
        if (!Array.isArray(val)) {
          if (hook) {
            hook(val, this)
          }
          return false
        }
        const items = this.itemsType
        let b = true
        let i, l, j
        if (hook) {
        // Slow path.
          j = path.length
          path.push('')
          for (i = 0, l = val.length; i < l; i++) {
            path[j] = '' + i
            if (!items._check(val[i], flags, hook, path)) {
              b = false
            }
          }
          path.pop()
        } else {
          for (i = 0, l = val.length; i < l; i++) {
            if (!items._check(val[i], flags)) {
              return false
            }
          }
        }
        return b
      }

      ArrayType.prototype._read = function (tap) {
        const items = this.itemsType
        let i = 0
        let val, n
        while ((n = tap.readLong())) {
          if (n < 0) {
            n = -n
            tap.skipLong() // Skip size.
          }
          // Initializing the array on the first batch gives a ~10% speedup. See
          // https://github.com/mtth/avsc/pull/338 for more context.
          val = val || new Array(n)
          while (n--) {
            val[i++] = items._read(tap)
          }
        }
        return val || []
      }

      ArrayType.prototype._skip = function (tap) {
        const items = this.itemsType
        let len, n
        while ((n = tap.readLong())) {
          if (n < 0) {
            len = tap.readLong()
            tap.pos += len
          } else {
            while (n--) {
              items._skip(tap)
            }
          }
        }
      }

      ArrayType.prototype._write = function (tap, val) {
        if (!Array.isArray(val)) {
          throwInvalidError(val, this)
        }
        const items = this.itemsType
        const n = val.length
        let i
        if (n) {
          tap.writeLong(n)
          for (i = 0; i < n; i++) {
            items._write(tap, val[i])
          }
        }
        tap.writeLong(0)
      }

      ArrayType.prototype._match = function (tap1, tap2) {
        let n1 = tap1.readLong()
        let n2 = tap2.readLong()
        let f
        while (n1 && n2) {
          f = this.itemsType._match(tap1, tap2)
          if (f) {
            return f
          }
          if (!--n1) {
            n1 = readArraySize(tap1)
          }
          if (!--n2) {
            n2 = readArraySize(tap2)
          }
        }
        return utils.compare(n1, n2)
      }

      ArrayType.prototype._update = function (resolver, type, opts) {
        if (type.typeName === 'array') {
          resolver.itemsType = this.itemsType.createResolver(type.itemsType, opts)
          resolver._read = this._read
        }
      }

      ArrayType.prototype._copy = function (val, opts) {
        if (!Array.isArray(val)) {
          throwInvalidError(val, this)
        }
        const items = new Array(val.length)
        let i, l
        for (i = 0, l = val.length; i < l; i++) {
          items[i] = this.itemsType._copy(val[i], opts)
        }
        return items
      }

      ArrayType.prototype._deref = function (schema, opts) {
        schema.items = this.itemsType._attrs(opts)
      }

      ArrayType.prototype.compare = function (val1, val2) {
        const n1 = val1.length
        const n2 = val2.length
        let i, l, f
        for (i = 0, l = Math.min(n1, n2); i < l; i++) {
          if ((f = this.itemsType.compare(val1[i], val2[i]))) {
            return f
          }
        }
        return utils.compare(n1, n2)
      }

      ArrayType.prototype.getItemsType = function () { return this.itemsType }

      ArrayType.prototype.typeName = 'array'

      ArrayType.prototype.random = function () {
        const arr = []
        let i, l
        for (i = 0, l = RANDOM.nextInt(10); i < l; i++) {
          arr.push(this.itemsType.random())
        }
        return arr
      }

      /**
 * Avro record.
 *
 * Values are represented as instances of a programmatically generated
 * constructor (similar to a "specific record"), available via the
 * `getRecordConstructor` method. This "specific record class" gives
 * significant speedups over using generics objects.
 *
 * Note that vanilla objects are still accepted as valid as long as their
 * fields match (this makes it much more convenient to do simple things like
 * update nested records).
 *
 * This type is also used for errors (similar, except for the extra `Error`
 * constructor call) and for messages (see comment below).
 */
      function RecordType (schema, opts) {
      // Force creation of the options object in case we need to register this
      // record's name.
        opts = opts || {}

        // Save the namespace to restore it as we leave this record's scope.
        const namespace = opts.namespace
        if (schema.namespace !== undefined) {
          opts.namespace = schema.namespace
        } else if (schema.name) {
        // Fully qualified names' namespaces are used when no explicit namespace
        // attribute was specified.
          const ns = utils.impliedNamespace(schema.name)
          if (ns !== undefined) {
            opts.namespace = ns
          }
        }
        Type.call(this, schema, opts)

        if (!Array.isArray(schema.fields)) {
          throw new Error(f('non-array record fields: %j', schema.fields))
        }
        if (utils.hasDuplicates(schema.fields, function (f) { return f.name })) {
          throw new Error(f('duplicate field name: %j', schema.fields))
        }
        this._fieldsByName = {}
        this.fields = Object.freeze(schema.fields.map(function (f) {
          const field = new Field(f, opts)
          this._fieldsByName[field.name] = field
          return field
        }, this))
        this._branchConstructor = this._createBranchConstructor()
        this._isError = schema.type === 'error'
        this.recordConstructor = this._createConstructor(
          opts.errorStackTraces,
          opts.omitRecordMethods
        )
        this._read = this._createReader()
        this._skip = this._createSkipper()
        this._write = this._createWriter()
        this._check = this._createChecker()

        opts.namespace = namespace
        Object.freeze(this)
      }
      util.inherits(RecordType, Type)

      RecordType.prototype._getConstructorName = function () {
        return this.name
          ? utils.capitalize(utils.unqualify(this.name))
          : this._isError ? 'Error$' : 'Record$'
      }

      RecordType.prototype._createConstructor = function (errorStack, plainRecords) {
      // jshint -W054
        const outerArgs = []
        const innerArgs = []
        const ds = [] // Defaults.
        let innerBody = ''
        let i, l, field, name, defaultValue, hasDefault, stackField
        for (i = 0, l = this.fields.length; i < l; i++) {
          field = this.fields[i]
          defaultValue = field.defaultValue
          hasDefault = defaultValue() !== undefined
          name = field.name
          if (
            errorStack && this._isError && name === 'stack' &&
      Type.isType(field.type, 'string') && !hasDefault
          ) {
          // We keep track of whether we've encountered a valid stack field (in
          // particular, without a default) to populate a stack trace below.
            stackField = field
          }
          innerArgs.push('v' + i)
          innerBody += '  '
          if (!hasDefault) {
            innerBody += 'this.' + name + ' = v' + i + ';\n'
          } else {
            innerBody += 'if (v' + i + ' === undefined) { '
            innerBody += 'this.' + name + ' = d' + ds.length + '(); '
            innerBody += '} else { this.' + name + ' = v' + i + '; }\n'
            outerArgs.push('d' + ds.length)
            ds.push(defaultValue)
          }
        }
        if (stackField) {
        // We should populate a stack trace.
          innerBody += '  if (this.stack === undefined) { '
          /* istanbul ignore else */
          if (typeof Error.captureStackTrace === 'function') {
          // v8 runtimes, the easy case.
            innerBody += 'Error.captureStackTrace(this, this.constructor);'
          } else {
          // A few other runtimes (e.g. SpiderMonkey), might not work everywhere.
            innerBody += 'this.stack = Error().stack;'
          }
          innerBody += ' }\n'
        }
        let outerBody = 'return function ' + this._getConstructorName() + '('
        outerBody += innerArgs.join() + ') {\n' + innerBody + '};'
        const Record = new Function(outerArgs.join(), outerBody).apply(undefined, ds)
        if (plainRecords) {
          return Record
        }

        const self = this
        Record.getType = function () { return self }
        Record.type = self
        if (this._isError) {
          util.inherits(Record, Error)
          Record.prototype.name = this._getConstructorName()
        }
        Record.prototype.clone = function (o) { return self.clone(this, o) }
        Record.prototype.compare = function (v) { return self.compare(this, v) }
        Record.prototype.isValid = function (o) { return self.isValid(this, o) }
        Record.prototype.toBuffer = function () { return self.toBuffer(this) }
        Record.prototype.toString = function () { return self.toString(this) }
        Record.prototype.wrap = function () { return self.wrap(this) }
        Record.prototype.wrapped = Record.prototype.wrap // Deprecated.
        return Record
      }

      RecordType.prototype._createChecker = function () {
      // jshint -W054
        const names = []
        const values = []
        const name = this._getConstructorName()
        let body = 'return function check' + name + '(v, f, h, p) {\n'
        body += '  if (\n'
        body += '    v === null ||\n'
        body += '    typeof v != \'object\' ||\n'
        body += '    (f && !this._checkFields(v))\n'
        body += '  ) {\n'
        body += '    if (h) { h(v, this); }\n'
        body += '    return false;\n'
        body += '  }\n'
        if (!this.fields.length) {
        // Special case, empty record. We handle this directly.
          body += '  return true;\n'
        } else {
          for (let i = 0, l = this.fields.length; i < l; i++) {
            let field = this.fields[i]
            names.push('t' + i)
            values.push(field.type)
            if (field.defaultValue() !== undefined) {
              body += '  var v' + i + ' = v.' + field.name + ';\n'
            }
          }
          body += '  if (h) {\n'
          body += '    var b = 1;\n'
          body += '    var j = p.length;\n'
          body += '    p.push(\'\');\n'
          let i, l, field
          for (i = 0, l = this.fields.length; i < l; i++) {
            field = this.fields[i]
            body += '    p[j] = \'' + field.name + '\';\n'
            body += '    b &= '
            if (field.defaultValue() === undefined) {
              body += 't' + i + '._check(v.' + field.name + ', f, h, p);\n'
            } else {
              body += 'v' + i + ' === undefined || '
              body += 't' + i + '._check(v' + i + ', f, h, p);\n'
            }
          }
          body += '    p.pop();\n'
          body += '    return !!b;\n'
          body += '  } else {\n    return (\n      '
          body += this.fields.map(function (field, i) {
            return field.defaultValue() === undefined
              ? 't' + i + '._check(v.' + field.name + ', f)'
              : '(v' + i + ' === undefined || t' + i + '._check(v' + i + ', f))'
          }).join(' &&\n      ')
          body += '\n    );\n  }\n'
        }
        body += '};'
        return new Function(names.join(), body).apply(undefined, values)
      }

      RecordType.prototype._createReader = function () {
      // jshint -W054
        const names = []
        const values = [this.recordConstructor]
        let i, l
        for (i = 0, l = this.fields.length; i < l; i++) {
          names.push('t' + i)
          values.push(this.fields[i].type)
        }
        const name = this._getConstructorName()
        let body = 'return function read' + name + '(t) {\n'
        body += '  return new ' + name + '(\n    '
        body += names.map(function (s) { return s + '._read(t)' }).join(',\n    ')
        body += '\n  );\n};'
        names.unshift(name)
        // We can do this since the JS spec guarantees that function arguments are
        // evaluated from left to right.
        return new Function(names.join(), body).apply(undefined, values)
      }

      RecordType.prototype._createSkipper = function () {
      // jshint -W054
        const args = []
        let body = 'return function skip' + this._getConstructorName() + '(t) {\n'
        const values = []
        let i, l
        for (i = 0, l = this.fields.length; i < l; i++) {
          args.push('t' + i)
          values.push(this.fields[i].type)
          body += '  t' + i + '._skip(t);\n'
        }
        body += '}'
        return new Function(args.join(), body).apply(undefined, values)
      }

      RecordType.prototype._createWriter = function () {
      // jshint -W054
      // We still do default handling here, in case a normal JS object is passed.
        const args = []
        const name = this._getConstructorName()
        let body = 'return function write' + name + '(t, v) {\n'
        const values = []
        let i, l, field, value
        for (i = 0, l = this.fields.length; i < l; i++) {
          field = this.fields[i]
          args.push('t' + i)
          values.push(field.type)
          body += '  '
          if (field.defaultValue() === undefined) {
            body += 't' + i + '._write(t, v.' + field.name + ');\n'
          } else {
            value = field.type.toBuffer(field.defaultValue()).toString('binary')
            // Convert the default value to a binary string ahead of time. We aren't
            // converting it to a buffer to avoid retaining too much memory. If we
            // had our own buffer pool, this could be an idea in the future.
            args.push('d' + i)
            values.push(value)
            body += 'var v' + i + ' = v.' + field.name + ';\n'
            body += 'if (v' + i + ' === undefined) {\n'
            body += '    t.writeBinary(d' + i + ', ' + value.length + ');\n'
            body += '  } else {\n    t' + i + '._write(t, v' + i + ');\n  }\n'
          }
        }
        body += '}'
        return new Function(args.join(), body).apply(undefined, values)
      }

      RecordType.prototype._update = function (resolver, type, opts) {
      // jshint -W054
        if (!hasCompatibleName(this, type, !opts.ignoreNamespaces)) {
          throw new Error(f('no alias found for %s', type.name))
        }

        const rFields = this.fields
        const wFields = type.fields
        const wFieldsMap = utils.toMap(wFields, function (f) { return f.name })

        const innerArgs = [] // Arguments for reader constructor.
        const resolvers = {} // Resolvers keyed by writer field name.
        let i, j, field, name, names, matches, fieldResolver
        for (i = 0; i < rFields.length; i++) {
          field = rFields[i]
          names = getAliases(field)
          matches = []
          for (j = 0; j < names.length; j++) {
            name = names[j]
            if (wFieldsMap[name]) {
              matches.push(name)
            }
          }
          if (matches.length > 1) {
            throw new Error(
              f('ambiguous aliasing for %s.%s (%s)', type.name, field.name, matches)
            )
          }
          if (!matches.length) {
            if (field.defaultValue() === undefined) {
              throw new Error(
                f('no matching field for default-less %s.%s', type.name, field.name)
              )
            }
            innerArgs.push('undefined')
          } else {
            name = matches[0]
            fieldResolver = {
              resolver: field.type.createResolver(wFieldsMap[name].type, opts),
              name: '_' + field.name // Reader field name.
            }
            if (!resolvers[name]) {
              resolvers[name] = [fieldResolver]
            } else {
              resolvers[name].push(fieldResolver)
            }
            innerArgs.push(fieldResolver.name)
          }
        }

        // See if we can add a bypass for unused fields at the end of the record.
        let lazyIndex = -1
        i = wFields.length
        while (i && resolvers[wFields[--i].name] === undefined) {
          lazyIndex = i
        }

        const uname = this._getConstructorName()
        const args = [uname]
        const values = [this.recordConstructor]
        let body = '  return function read' + uname + '(t, b) {\n'
        for (i = 0; i < wFields.length; i++) {
          if (i === lazyIndex) {
            body += '  if (!b) {\n'
          }
          field = type.fields[i]
          name = field.name
          if (resolvers[name] === undefined) {
            body += (~lazyIndex && i >= lazyIndex) ? '    ' : '  '
            args.push('r' + i)
            values.push(field.type)
            body += 'r' + i + '._skip(t);\n'
          } else {
            j = resolvers[name].length
            while (j--) {
              body += (~lazyIndex && i >= lazyIndex) ? '    ' : '  '
              args.push('r' + i + 'f' + j)
              fieldResolver = resolvers[name][j]
              values.push(fieldResolver.resolver)
              body += 'var ' + fieldResolver.name + ' = '
              body += 'r' + i + 'f' + j + '._' + (j ? 'peek' : 'read') + '(t);\n'
            }
          }
        }
        if (~lazyIndex) {
          body += '  }\n'
        }
        body += '  return new ' + uname + '(' + innerArgs.join() + ');\n};'

        resolver._read = new Function(args.join(), body).apply(undefined, values)
      }

      RecordType.prototype._match = function (tap1, tap2) {
        const fields = this.fields
        let i, l, field, order, type
        for (i = 0, l = fields.length; i < l; i++) {
          field = fields[i]
          order = field._order
          type = field.type
          if (order) {
            order *= type._match(tap1, tap2)
            if (order) {
              return order
            }
          } else {
            type._skip(tap1)
            type._skip(tap2)
          }
        }
        return 0
      }

      RecordType.prototype._checkFields = function (obj) {
        const keys = Object.keys(obj)
        let i, l
        for (i = 0, l = keys.length; i < l; i++) {
          if (!this._fieldsByName[keys[i]]) {
            return false
          }
        }
        return true
      }

      RecordType.prototype._copy = function (val, opts) {
      // jshint -W058
        const hook = opts && opts.fieldHook
        const values = [undefined]
        let i, l, field, value
        for (i = 0, l = this.fields.length; i < l; i++) {
          field = this.fields[i]
          value = val[field.name]
          if (value === undefined && field.hasOwnProperty('defaultValue')) {
            value = field.defaultValue()
          }
          if ((opts && !opts.skip) || value !== undefined) {
            value = field.type._copy(value, opts)
          }
          if (hook) {
            value = hook(field, value, this)
          }
          values.push(value)
        }
        const Record = this.recordConstructor
        return new (Record.bind.apply(Record, values))()
      }

      RecordType.prototype._deref = function (schema, opts) {
        schema.fields = this.fields.map(function (field) {
          const fieldType = field.type
          const fieldSchema = {
            name: field.name,
            type: fieldType._attrs(opts)
          }
          if (opts.exportAttrs) {
            const val = field.defaultValue()
            if (val !== undefined) {
            // We must both unwrap all unions and coerce buffers to strings.
              fieldSchema.default = fieldType._copy(val, { coerce: 3, wrap: 3 })
            }
            const fieldOrder = field.order
            if (fieldOrder !== 'ascending') {
              fieldSchema.order = fieldOrder
            }
            const fieldAliases = field.aliases
            if (fieldAliases.length) {
              fieldSchema.aliases = fieldAliases
            }
            const fieldDoc = field.doc
            if (fieldDoc !== undefined) {
              fieldSchema.doc = fieldDoc
            }
          }
          return fieldSchema
        })
      }

      RecordType.prototype.compare = function (val1, val2) {
        const fields = this.fields
        let i, l, field, name, order, type
        for (i = 0, l = fields.length; i < l; i++) {
          field = fields[i]
          name = field.name
          order = field._order
          type = field.type
          if (order) {
            order *= type.compare(val1[name], val2[name])
            if (order) {
              return order
            }
          }
        }
        return 0
      }

      RecordType.prototype.random = function () {
      // jshint -W058
        const fields = this.fields.map(function (f) { return f.type.random() })
        fields.unshift(undefined)
        const Record = this.recordConstructor
        return new (Record.bind.apply(Record, fields))()
      }

      RecordType.prototype.field = function (name) {
        return this._fieldsByName[name]
      }

      RecordType.prototype.getField = RecordType.prototype.field

      RecordType.prototype.getFields = function () { return this.fields }

      RecordType.prototype.getRecordConstructor = function () {
        return this.recordConstructor
      }

      Object.defineProperty(RecordType.prototype, 'typeName', {
        enumerable: true,
        get: function () { return this._isError ? 'error' : 'record' }
      })

      /** Derived type abstract class. */
      function LogicalType (schema, opts) {
        this._logicalTypeName = schema.logicalType
        Type.call(this)
        LOGICAL_TYPE = this
        try {
          this._underlyingType = Type.forSchema(schema, opts)
        } finally {
          LOGICAL_TYPE = null
          // Remove the underlying type now that we're done instantiating. Note that
          // in some (rare) cases, it might not have been inserted; for example, if
          // this constructor was manually called with an already instantiated type.
          const l = UNDERLYING_TYPES.length
          if (l && UNDERLYING_TYPES[l - 1][0] === this) {
            UNDERLYING_TYPES.pop()
          }
        }
        // We create a separate branch constructor for logical types to keep them
        // monomorphic.
        if (Type.isType(this.underlyingType, 'union')) {
          this._branchConstructor = this.underlyingType._branchConstructor
        } else {
          this._branchConstructor = this.underlyingType._createBranchConstructor()
        }
      // We don't freeze derived types to allow arbitrary properties. Implementors
      // can still do so in the subclass' constructor at their convenience.
      }
      util.inherits(LogicalType, Type)

      Object.defineProperty(LogicalType.prototype, 'typeName', {
        enumerable: true,
        get: function () { return 'logical:' + this._logicalTypeName }
      })

      Object.defineProperty(LogicalType.prototype, 'underlyingType', {
        enumerable: true,
        get: function () {
          if (this._underlyingType) {
            return this._underlyingType
          }
          // If the field wasn't present, it means the logical type isn't complete
          // yet: we're waiting on its underlying type to be fully instantiated. In
          // this case, it will be present in the `UNDERLYING_TYPES` array.
          let i, l, arr
          for (i = 0, l = UNDERLYING_TYPES.length; i < l; i++) {
            arr = UNDERLYING_TYPES[i]
            if (arr[0] === this) {
              return arr[1]
            }
          }
        }
      })

      LogicalType.prototype.getUnderlyingType = function () {
        return this.underlyingType
      }

      LogicalType.prototype._read = function (tap) {
        return this._fromValue(this.underlyingType._read(tap))
      }

      LogicalType.prototype._write = function (tap, any) {
        this.underlyingType._write(tap, this._toValue(any))
      }

      LogicalType.prototype._check = function (any, flags, hook, path) {
        try {
          var val = this._toValue(any)
        } catch (err) {
        // Handled below.
        }
        if (val === undefined) {
          if (hook) {
            hook(any, this)
          }
          return false
        }
        return this.underlyingType._check(val, flags, hook, path)
      }

      LogicalType.prototype._copy = function (any, opts) {
        const type = this.underlyingType
        switch (opts && opts.coerce) {
          case 3: // To string.
            return type._copy(this._toValue(any), opts)
          case 2: // From string.
            return this._fromValue(type._copy(any, opts))
          default: // Normal copy.
            return this._fromValue(type._copy(this._toValue(any), opts))
        }
      }

      LogicalType.prototype._update = function (resolver, type, opts) {
        const _fromValue = this._resolve(type, opts)
        if (_fromValue) {
          resolver._read = function (tap) { return _fromValue(type._read(tap)) }
        }
      }

      LogicalType.prototype.compare = function (obj1, obj2) {
        const val1 = this._toValue(obj1)
        const val2 = this._toValue(obj2)
        return this.underlyingType.compare(val1, val2)
      }

      LogicalType.prototype.random = function () {
        return this._fromValue(this.underlyingType.random())
      }

      LogicalType.prototype._deref = function (schema, opts) {
        const type = this.underlyingType
        const isVisited = type.name !== undefined && opts.derefed[type.name]
        schema = type._attrs(opts)
        if (!isVisited && opts.exportAttrs) {
          if (typeof schema === 'string') {
            schema = { type: schema }
          }
          schema.logicalType = this._logicalTypeName
          this._export(schema)
        }
        return schema
      }

      LogicalType.prototype._skip = function (tap) {
        this.underlyingType._skip(tap)
      }

      // Unlike the other methods below, `_export` has a reasonable default which we
      // can provide (not exporting anything).
      LogicalType.prototype._export = function (/* schema */) {}

      // Methods to be implemented.
      LogicalType.prototype._fromValue = utils.abstractFunction
      LogicalType.prototype._toValue = utils.abstractFunction
      LogicalType.prototype._resolve = utils.abstractFunction

      // General helpers.

      /**
 * Customizable long.
 *
 * This allows support of arbitrarily large long (e.g. larger than
 * `Number.MAX_SAFE_INTEGER`). See `LongType.__with` method above. Note that we
 * can't use a logical type because we need a "lower-level" hook here: passing
 * through through the standard long would cause a loss of precision.
 */
      function AbstractLongType (noUnpack) {
        this._concreteTypeName = 'long'
        PrimitiveType.call(this, true)
        // Note that this type "inherits" `LongType` (i.e. gain its prototype
        // methods) but only "subclasses" `PrimitiveType` to avoid being prematurely
        // frozen.
        this._noUnpack = !!noUnpack
      }
      util.inherits(AbstractLongType, LongType)

      AbstractLongType.prototype.typeName = 'abstract:long'

      AbstractLongType.prototype._check = function (val, flags, hook) {
        const b = this._isValid(val)
        if (!b && hook) {
          hook(val, this)
        }
        return b
      }

      AbstractLongType.prototype._read = function (tap) {
        let buf, pos
        if (this._noUnpack) {
          pos = tap.pos
          tap.skipLong()
          buf = tap.buf.slice(pos, tap.pos)
        } else {
          buf = tap.unpackLongBytes(tap)
        }
        if (tap.isValid()) {
          return this._fromBuffer(buf)
        }
      }

      AbstractLongType.prototype._write = function (tap, val) {
        if (!this._isValid(val)) {
          throwInvalidError(val, this)
        }
        const buf = this._toBuffer(val)
        if (this._noUnpack) {
          tap.writeFixed(buf)
        } else {
          tap.packLongBytes(buf)
        }
      }

      AbstractLongType.prototype._copy = function (val, opts) {
        switch (opts && opts.coerce) {
          case 3: // To string.
            return this._toJSON(val)
          case 2: // From string.
            return this._fromJSON(val)
          default: // Normal copy.
          // Slow but guarantees most consistent results. Faster alternatives would
          // require assumptions on the long class used (e.g. immutability).
            return this._fromJSON(this._toJSON(val))
        }
      }

      AbstractLongType.prototype._deref = function () { return 'long' }

      AbstractLongType.prototype._update = function (resolver, type) {
        const self = this
        switch (type.typeName) {
          case 'int':
            resolver._read = function (tap) {
              return self._fromJSON(type._read(tap))
            }
            break
          case 'abstract:long':
          case 'long':
            resolver._read = function (tap) { return self._read(tap) }
        }
      }

      AbstractLongType.prototype.random = function () {
        return this._fromJSON(LongType.prototype.random())
      }

      // Methods to be implemented by the user.
      AbstractLongType.prototype._fromBuffer = utils.abstractFunction
      AbstractLongType.prototype._toBuffer = utils.abstractFunction
      AbstractLongType.prototype._fromJSON = utils.abstractFunction
      AbstractLongType.prototype._toJSON = utils.abstractFunction
      AbstractLongType.prototype._isValid = utils.abstractFunction
      AbstractLongType.prototype.compare = utils.abstractFunction

      /** A record field. */
      function Field (schema, opts) {
        const name = schema.name
        if (typeof name !== 'string' || !utils.isValidName(name)) {
          throw new Error(f('invalid field name: %s', name))
        }

        this.name = name
        this.type = Type.forSchema(schema.type, opts)
        this.aliases = schema.aliases || []
        this.doc = schema.doc !== undefined ? '' + schema.doc : undefined

        this._order = (function (order) {
          switch (order) {
            case 'ascending':
              return 1
            case 'descending':
              return -1
            case 'ignore':
              return 0
            default:
              throw new Error(f('invalid order: %j', order))
          }
        })(schema.order === undefined ? 'ascending' : schema.order)

        const value = schema.default
        if (value !== undefined) {
        // We need to convert defaults back to a valid format (unions are
        // disallowed in default definitions, only the first type of each union is
        // allowed instead).
        // http://apache-avro.679487.n3.nabble.com/field-union-default-in-Java-td1175327.html
          const type = this.type
          let val
          try {
            val = type._copy(value, { coerce: 2, wrap: 2 })
          } catch (err) {
            let msg = f('incompatible field default %j (%s)', value, err.message)
            if (Type.isType(type, 'union')) {
              msg += f(
                ', union defaults must match the first branch\'s type (%j)',
                type.types[0]
              )
            }
            throw new Error(msg)
          }
          // The clone call above will throw an error if the default is invalid.
          if (isPrimitive(type.typeName) && type.typeName !== 'bytes') {
          // These are immutable.
            this.defaultValue = function () { return val }
          } else {
            this.defaultValue = function () { return type._copy(val) }
          }
        }

        Object.freeze(this)
      }

      Field.prototype.defaultValue = function () {} // Undefined default.

      Object.defineProperty(Field.prototype, 'order', {
        enumerable: true,
        get: function () {
          return ['descending', 'ignore', 'ascending'][this._order + 1]
        }
      })

      Field.prototype.getAliases = function () { return this.aliases }

      Field.prototype.getDefault = Field.prototype.defaultValue

      Field.prototype.getName = function () { return this.name }

      Field.prototype.getOrder = function () { return this.order }

      Field.prototype.getType = function () { return this.type }

      /**
 * Resolver to read a writer's schema as a new schema.
 *
 * @param readerType {Type} The type to convert to.
 */
      function Resolver (readerType) {
      // Add all fields here so that all resolvers share the same hidden class.
        this._readerType = readerType
        this._read = null
        this.itemsType = null
        this.size = 0
        this.symbols = null
        this.valuesType = null
      }

      Resolver.prototype._peek = Type.prototype._peek

      Resolver.prototype.inspect = function () { return '<Resolver>' }

      /** Mutable hash container. */
      function Hash () {
        this.str = undefined
      }

      /**
 * Read a value from a tap.
 *
 * @param type {Type} The type to decode.
 * @param tap {Tap} The tap to read from. No checks are performed here.
 * @param resolver {Resolver} Optional resolver. It must match the input type.
 * @param lazy {Boolean} Skip trailing fields when using a resolver.
 */
      function readValue (type, tap, resolver, lazy) {
        if (resolver) {
          if (resolver._readerType !== type) {
            throw new Error('invalid resolver')
          }
          return resolver._read(tap, lazy)
        } else {
          return type._read(tap)
        }
      }

      /**
 * Get all aliases for a type (including its name).
 *
 * @param obj {Type|Object} Typically a type or a field. Its aliases property
 * must exist and be an array.
 */
      function getAliases (obj) {
        const names = {}
        if (obj.name) {
          names[obj.name] = true
        }
        const aliases = obj.aliases
        let i, l
        for (i = 0, l = aliases.length; i < l; i++) {
          names[aliases[i]] = true
        }
        return Object.keys(names)
      }

      /** Checks if a type can be read as another based on name resolution rules. */
      function hasCompatibleName (reader, writer, strict) {
        if (!writer.name) {
          return true
        }
        const name = strict ? writer.name : utils.unqualify(writer.name)
        const aliases = getAliases(reader)
        let i, l, alias
        for (i = 0, l = aliases.length; i < l; i++) {
          alias = aliases[i]
          if (!strict) {
            alias = utils.unqualify(alias)
          }
          if (alias === name) {
            return true
          }
        }
        return false
      }

      /**
 * Check whether a type's name is a primitive.
 *
 * @param name {String} Type name (e.g. `'string'`, `'array'`).
 */
      function isPrimitive (typeName) {
      // Since we use this module's own `TYPES` object, we can use `instanceof`.
        const type = TYPES[typeName]
        return type && type.prototype instanceof PrimitiveType
      }

      /**
 * Return a type's class name from its Avro type name.
 *
 * We can't simply use `constructor.name` since it isn't supported in all
 * browsers.
 *
 * @param typeName {String} Type name.
 */
      function getClassName (typeName) {
        if (typeName === 'error') {
          typeName = 'record'
        } else {
          const match = /^([^:]+):(.*)$/.exec(typeName)
          if (match) {
            if (match[1] === 'union') {
              typeName = match[2] + 'Union'
            } else {
            // Logical type.
              typeName = match[1]
            }
          }
        }
        return utils.capitalize(typeName) + 'Type'
      }

      /**
 * Get the number of elements in an array block.
 *
 * @param tap {Tap} A tap positioned at the beginning of an array block.
 */
      function readArraySize (tap) {
        let n = tap.readLong()
        if (n < 0) {
          n = -n
          tap.skipLong() // Skip size.
        }
        return n
      }

      /**
 * Check whether a long can be represented without precision loss.
 *
 * @param n {Number} The number.
 *
 * Two things to note:
 *
 * + We are not using the `Number` constants for compatibility with older
 *   browsers.
 * + We must remove one from each bound because of rounding errors.
 */
      function isSafeLong (n) {
        return n >= -9007199254740990 && n <= 9007199254740990
      }

      /**
 * Check whether an object is the JSON representation of a buffer.
 */
      function isJsonBuffer (obj) {
        return obj && obj.type === 'Buffer' && Array.isArray(obj.data)
      }

      /**
 * Throw a somewhat helpful error on invalid object.
 *
 * @param path {Array} Passed from hook, but unused (because empty where this
 * function is used, since we aren't keeping track of it for effiency).
 * @param val {...} The object to reject.
 * @param type {Type} The type to check against.
 *
 * This method is mostly used from `_write` to signal an invalid object for a
 * given type. Note that this provides less information than calling `isValid`
 * with a hook since the path is not propagated (for efficiency reasons).
 */
      function throwInvalidError (val, type) {
        throw new Error(f('invalid %j: %j', type.schema(), val))
      }

      function maybeQualify (name, ns) {
        const unqualified = utils.unqualify(name)
        // Primitives are always in the global namespace.
        return isPrimitive(unqualified) ? unqualified : utils.qualify(name, ns)
      }

      /**
 * Get a type's bucket when included inside an unwrapped union.
 *
 * @param type {Type} Any type.
 */
      function getTypeBucket (type) {
        const typeName = type.typeName
        switch (typeName) {
          case 'double':
          case 'float':
          case 'int':
          case 'long':
            return 'number'
          case 'bytes':
          case 'fixed':
            return 'buffer'
          case 'enum':
            return 'string'
          case 'map':
          case 'error':
          case 'record':
            return 'object'
          default:
            return typeName
        }
      }

      /**
 * Infer a value's bucket (see unwrapped unions for more details).
 *
 * @param val {...} Any value.
 */
      function getValueBucket (val) {
        if (val === null) {
          return 'null'
        }
        const bucket = typeof val
        if (bucket === 'object') {
        // Could be bytes, fixed, array, map, or record.
          if (Array.isArray(val)) {
            return 'array'
          } else if (Buffer.isBuffer(val)) {
            return 'buffer'
          }
        }
        return bucket
      }

      /**
 * Check whether a collection of types leads to an ambiguous union.
 *
 * @param types {Array} Array of types.
 */
      function isAmbiguous (types) {
        const buckets = {}
        let i, l, bucket, type
        for (i = 0, l = types.length; i < l; i++) {
          type = types[i]
          if (!Type.isType(type, 'logical')) {
            bucket = getTypeBucket(type)
            if (buckets[bucket]) {
              return true
            }
            buckets[bucket] = true
          }
        }
        return false
      }

      /**
 * Combine number types.
 *
 * Note that never have to create a new type here, we are guaranteed to be able
 * to reuse one of the input types as super-type.
 */
      function combineNumbers (types) {
        const typeNames = ['int', 'long', 'float', 'double']
        let superIndex = -1
        let superType = null
        let i, l, type, index
        for (i = 0, l = types.length; i < l; i++) {
          type = types[i]
          index = typeNames.indexOf(type.typeName)
          if (index > superIndex) {
            superIndex = index
            superType = type
          }
        }
        return superType
      }

      /**
 * Combine enums and strings.
 *
 * The order of the returned symbols is undefined and the returned enum is
 *
 */
      function combineStrings (types, opts) {
        const symbols = {}
        let i, l, type, typeSymbols
        for (i = 0, l = types.length; i < l; i++) {
          type = types[i]
          if (type.typeName === 'string') {
          // If at least one of the types is a string, it will be the supertype.
            return type
          }
          typeSymbols = type.symbols
          var j, m
          for (j = 0, m = typeSymbols.length; j < m; j++) {
            symbols[typeSymbols[j]] = true
          }
        }
        return Type.forSchema({ type: 'enum', symbols: Object.keys(symbols) }, opts)
      }

      /**
 * Combine bytes and fixed.
 *
 * This function is optimized to avoid creating new types when possible: in
 * case of a size mismatch between fixed types, it will continue looking
 * through the array to find an existing bytes type (rather than exit early by
 * creating one eagerly).
 */
      function combineBuffers (types, opts) {
        let size = -1
        let i, l, type
        for (i = 0, l = types.length; i < l; i++) {
          type = types[i]
          if (type.typeName === 'bytes') {
            return type
          }
          if (size === -1) {
            size = type.size
          } else if (type.size !== size) {
          // Don't create a bytes type right away, we might be able to reuse one
          // later on in the types array. Just mark this for now.
            size = -2
          }
        }
        return size < 0 ? Type.forSchema('bytes', opts) : types[0]
      }

      /**
 * Combine maps and records.
 *
 * Field defaults are kept when possible (i.e. when no coercion to a map
 * happens), with later definitions overriding previous ones.
 */
      function combineObjects (types, opts) {
        const allTypes = [] // Field and value types.
        const fieldTypes = {} // Record field types grouped by field name.
        const fieldDefaults = {}
        let isValidRecord = true

        // Check whether the final type will be a map or a record.
        let i, l, type, fields
        for (i = 0, l = types.length; i < l; i++) {
          type = types[i]
          if (type.typeName === 'map') {
            isValidRecord = false
            allTypes.push(type.valuesType)
          } else {
            fields = type.fields
            var j, m, field, fieldDefault, fieldName, fieldType
            for (j = 0, m = fields.length; j < m; j++) {
              field = fields[j]
              fieldName = field.name
              fieldType = field.type
              allTypes.push(fieldType)
              if (isValidRecord) {
                if (!fieldTypes[fieldName]) {
                  fieldTypes[fieldName] = []
                }
                fieldTypes[fieldName].push(fieldType)
                fieldDefault = field.defaultValue()
                if (fieldDefault !== undefined) {
                // Later defaults will override any previous ones.
                  fieldDefaults[fieldName] = fieldDefault
                }
              }
            }
          }
        }

        if (isValidRecord) {
        // Check that no fields are missing and that we have the approriate
        // defaults for those which are.
          var fieldNames = Object.keys(fieldTypes)
          for (i = 0, l = fieldNames.length; i < l; i++) {
            fieldName = fieldNames[i]
            if (
              fieldTypes[fieldName].length < types.length &&
        fieldDefaults[fieldName] === undefined
            ) {
            // At least one of the records is missing a field with no default.
              if (opts && opts.strictDefaults) {
                isValidRecord = false
              } else {
                fieldTypes[fieldName].unshift(Type.forSchema('null', opts))
                fieldDefaults[fieldName] = null
              }
            }
          }
        }

        let schema
        if (isValidRecord) {
          schema = {
            type: 'record',
            fields: fieldNames.map(function (s) {
              let fieldType = Type.forTypes(fieldTypes[s], opts)
              const fieldDefault = fieldDefaults[s]
              if (
                fieldDefault !== undefined &&
          ~fieldType.typeName.indexOf('union')
              ) {
              // Ensure that the default's corresponding type is first.
                const unionTypes = fieldType.types.slice()
                let i, l
                for (i = 0, l = unionTypes.length; i < l; i++) {
                  if (unionTypes[i].isValid(fieldDefault)) {
                    break
                  }
                }
                if (i > 0) {
                  const unionType = unionTypes[0]
                  unionTypes[0] = unionTypes[i]
                  unionTypes[i] = unionType
                  fieldType = Type.forSchema(unionTypes, opts)
                }
              }
              return {
                name: s,
                type: fieldType,
                default: fieldDefaults[s]
              }
            })
          }
        } else {
          schema = {
            type: 'map',
            values: Type.forTypes(allTypes, opts)
          }
        }
        return Type.forSchema(schema, opts)
      }

      module.exports = {
        Type,
        getTypeBucket,
        getValueBucket,
        isPrimitive,
        builtins: (function () {
          const types = {
            LogicalType,
            UnwrappedUnionType,
            WrappedUnionType
          }
          const typeNames = Object.keys(TYPES)
          let i, l, typeName
          for (i = 0, l = typeNames.length; i < l; i++) {
            typeName = typeNames[i]
            types[getClassName(typeName)] = TYPES[typeName]
          }
          return types
        })()
      }
    }, { './utils': 11, buffer: 16, util: 80 }],
    11: [function (require, module, exports) {
    /* jshint node: true */

      // TODO: Make long comparison impervious to precision loss.
      // TODO: Optimize binary comparison methods.

      'use strict'

      /** Various utilities used across this library. */

      const buffer = require('buffer')
      const crypto = require('crypto')
      const util = require('util')

      const Buffer = buffer.Buffer

      // Shared buffer pool for all taps.
      const POOL = new BufferPool(4096)

      // Valid (field, type, and symbol) name regex.
      const NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

      // Convenience imports.
      const f = util.format

      /**
 * Create a new empty buffer.
 *
 * @param size {Number} The buffer's size.
 */
      function newBuffer (size) {
        if (typeof Buffer.alloc === 'function') {
          return Buffer.alloc(size)
        } else {
          return new Buffer(size)
        }
      }

      /**
 * Create a new buffer with the input contents.
 *
 * @param data {Array|String} The buffer's data.
 * @param enc {String} Encoding, used if data is a string.
 */
      function bufferFrom (data, enc) {
        if (typeof Buffer.from === 'function') {
          return Buffer.from(data, enc)
        } else {
          return new Buffer(data, enc)
        }
      }

      /**
 * Uppercase the first letter of a string.
 *
 * @param s {String} The string.
 */
      function capitalize (s) { return s.charAt(0).toUpperCase() + s.slice(1) }

      /**
 * Compare two numbers.
 *
 * @param n1 {Number} The first one.
 * @param n2 {Number} The second one.
 */
      function compare (n1, n2) { return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1) }

      /**
 * Get option or default if undefined.
 *
 * @param opts {Object} Options.
 * @param key {String} Name of the option.
 * @param def {...} Default value.
 *
 * This is useful mostly for true-ish defaults and false-ish values (where the
 * usual `||` idiom breaks down).
 */
      function getOption (opts, key, def) {
        const value = opts[key]
        return value === undefined ? def : value
      }

      /**
 * Compute a string's hash.
 *
 * @param str {String} The string to hash.
 * @param algorithm {String} The algorithm used. Defaults to MD5.
 */
      function getHash (str, algorithm) {
        algorithm = algorithm || 'md5'
        const hash = crypto.createHash(algorithm)
        hash.end(str)
        return hash.read()
      }

      /**
 * Find index of value in array.
 *
 * @param arr {Array} Can also be a false-ish value.
 * @param v {Object} Value to find.
 *
 * Returns -1 if not found, -2 if found multiple times.
 */
      function singleIndexOf (arr, v) {
        let pos = -1
        let i, l
        if (!arr) {
          return -1
        }
        for (i = 0, l = arr.length; i < l; i++) {
          if (arr[i] === v) {
            if (pos >= 0) {
              return -2
            }
            pos = i
          }
        }
        return pos
      }

      /**
 * Convert array to map.
 *
 * @param arr {Array} Elements.
 * @param fn {Function} Function returning an element's key.
 */
      function toMap (arr, fn) {
        const obj = {}
        let i, elem
        for (i = 0; i < arr.length; i++) {
          elem = arr[i]
          obj[fn(elem)] = elem
        }
        return obj
      }

      /**
 * Convert map to array of values (polyfill for `Object.values`).
 *
 * @param obj {Object} Map.
 */
      function objectValues (obj) {
        return Object.keys(obj).map(function (key) { return obj[key] })
      }

      /**
 * Check whether an array has duplicates.
 *
 * @param arr {Array} The array.
 * @param fn {Function} Optional function to apply to each element.
 */
      function hasDuplicates (arr, fn) {
        const obj = Object.create(null)
        let i, l, elem
        for (i = 0, l = arr.length; i < l; i++) {
          elem = arr[i]
          if (fn) {
            elem = fn(elem)
          }
          if (obj[elem]) {
            return true
          }
          obj[elem] = true
        }
        return false
      }

      /**
 * Copy properties from one object to another.
 *
 * @param src {Object} The source object.
 * @param dst {Object} The destination object.
 * @param overwrite {Boolean} Whether to overwrite existing destination
 * properties. Defaults to false.
 */
      function copyOwnProperties (src, dst, overwrite) {
        const names = Object.getOwnPropertyNames(src)
        let i, l, name
        for (i = 0, l = names.length; i < l; i++) {
          name = names[i]
          if (!dst.hasOwnProperty(name) || overwrite) {
            const descriptor = Object.getOwnPropertyDescriptor(src, name)
            Object.defineProperty(dst, name, descriptor)
          }
        }
        return dst
      }

      /**
 * Check whether a string is a valid Avro identifier.
 */
      function isValidName (str) { return NAME_PATTERN.test(str) }

      /**
 * Verify and return fully qualified name.
 *
 * @param name {String} Full or short name. It can be prefixed with a dot to
 * force global namespace.
 * @param namespace {String} Optional namespace.
 */
      function qualify (name, namespace) {
        if (~name.indexOf('.')) {
          name = name.replace(/^\./, '') // Allow absolute referencing.
        } else if (namespace) {
          name = namespace + '.' + name
        }
        name.split('.').forEach(function (part) {
          if (!isValidName(part)) {
            throw new Error(f('invalid name: %j', name))
          }
        })
        return name
      }

      /**
 * Remove namespace from a name.
 *
 * @param name {String} Full or short name.
 */
      function unqualify (name) {
        const parts = name.split('.')
        return parts[parts.length - 1]
      }

      /**
 * Return the namespace implied by a name.
 *
 * @param name {String} Full or short name. If short, the returned namespace
 *  will be empty.
 */
      function impliedNamespace (name) {
        const match = /^(.*)\.[^.]+$/.exec(name)
        return match ? match[1] : undefined
      }

      /**
 * Returns offset in the string of the end of JSON object (-1 if past the end).
 *
 * To keep the implementation simple, this function isn't a JSON validator. It
 * will gladly return a result for invalid JSON (which is OK since that will be
 * promptly rejected by the JSON parser). What matters is that it is guaranteed
 * to return the correct end when presented with valid JSON.
 *
 * @param str {String} Input string containing serialized JSON..
 * @param pos {Number} Starting position.
 */
      function jsonEnd (str, pos) {
        pos = pos | 0

        // Handle the case of a simple literal separately.
        let c = str.charAt(pos++)
        if (/[\d-]/.test(c)) {
          while (/[eE\d.+-]/.test(str.charAt(pos))) {
            pos++
          }
          return pos
        } else if (/true|null/.test(str.slice(pos - 1, pos + 3))) {
          return pos + 3
        } else if (/false/.test(str.slice(pos - 1, pos + 4))) {
          return pos + 4
        }

        // String, object, or array.
        let depth = 0
        let literal = false
        do {
          switch (c) {
            case '{':
            case '[':
              if (!literal) { depth++ }
              break
            case '}':
            case ']':
              if (!literal && !--depth) {
                return pos
              }
              break
            case '"':
              literal = !literal
              if (!depth && !literal) {
                return pos
              }
              break
            case '\\':
              pos++ // Skip the next character.
          }
        } while ((c = str.charAt(pos++)))

        return -1
      }

      /** "Abstract" function to help with "subclassing". */
      function abstractFunction () { throw new Error('abstract') }

      /** Batch-deprecate "getters" from an object's prototype. */
      function addDeprecatedGetters (obj, props) {
        const proto = obj.prototype
        let i, l, prop, getter
        for (i = 0, l = props.length; i < l; i++) {
          prop = props[i]
          getter = 'get' + capitalize(prop)
          proto[getter] = util.deprecate(
            createGetter(prop),
            'use `.' + prop + '` instead of `.' + getter + '()`'
          )
        }

        function createGetter (prop) {
          return function () {
            const delegate = this[prop]
            return typeof delegate === 'function'
              ? delegate.apply(this, arguments)
              : delegate
          }
        }
      }

      /**
 * Simple buffer pool to avoid allocating many small buffers.
 *
 * This provides significant speedups in recent versions of node (6+).
 */
      function BufferPool (len) {
        this._len = len | 0
        this._pos = 0
        this._slab = newBuffer(this._len)
      }

      BufferPool.prototype.alloc = function (len) {
        if (len < 0) {
          throw new Error('negative length')
        }
        const maxLen = this._len
        if (len > maxLen) {
          return newBuffer(len)
        }
        if (this._pos + len > maxLen) {
          this._slab = newBuffer(maxLen)
          this._pos = 0
        }
        return this._slab.slice(this._pos, this._pos += len)
      }

      /**
 * Generator of random things.
 *
 * Inspired by: http://stackoverflow.com/a/424445/1062617
 */
      function Lcg (seed) {
        const a = 1103515245
        const c = 12345
        const m = Math.pow(2, 31)
        let state = Math.floor(seed || Math.random() * (m - 1))

        this._max = m
        this._nextInt = function () { return state = (a * state + c) % m }
      }

      Lcg.prototype.nextBoolean = function () {
      // jshint -W018
        return !!(this._nextInt() % 2)
      }

      Lcg.prototype.nextInt = function (start, end) {
        if (end === undefined) {
          end = start
          start = 0
        }
        end = end === undefined ? this._max : end
        return start + Math.floor(this.nextFloat() * (end - start))
      }

      Lcg.prototype.nextFloat = function (start, end) {
        if (end === undefined) {
          end = start
          start = 0
        }
        end = end === undefined ? 1 : end
        return start + (end - start) * this._nextInt() / this._max
      }

      Lcg.prototype.nextString = function (len, flags) {
        len |= 0
        flags = flags || 'aA'
        let mask = ''
        if (flags.indexOf('a') > -1) {
          mask += 'abcdefghijklmnopqrstuvwxyz'
        }
        if (flags.indexOf('A') > -1) {
          mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        }
        if (flags.indexOf('#') > -1) {
          mask += '0123456789'
        }
        if (flags.indexOf('!') > -1) {
          mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'
        }
        const result = []
        for (let i = 0; i < len; i++) {
          result.push(this.choice(mask))
        }
        return result.join('')
      }

      Lcg.prototype.nextBuffer = function (len) {
        const arr = []
        let i
        for (i = 0; i < len; i++) {
          arr.push(this.nextInt(256))
        }
        return bufferFrom(arr)
      }

      Lcg.prototype.choice = function (arr) {
        const len = arr.length
        if (!len) {
          throw new Error('choosing from empty array')
        }
        return arr[this.nextInt(len)]
      }

      /**
 * Ordered queue which returns items consecutively.
 *
 * This is actually a heap by index, with the added requirements that elements
 * can only be retrieved consecutively.
 */
      function OrderedQueue () {
        this._index = 0
        this._items = []
      }

      OrderedQueue.prototype.push = function (item) {
        const items = this._items
        let i = items.length | 0
        let j
        items.push(item)
        while (i > 0 && items[i].index < items[j = ((i - 1) >> 1)].index) {
          item = items[i]
          items[i] = items[j]
          items[j] = item
          i = j
        }
      }

      OrderedQueue.prototype.pop = function () {
        const items = this._items
        const len = (items.length - 1) | 0
        const first = items[0]
        if (!first || first.index > this._index) {
          return null
        }
        this._index++
        if (!len) {
          items.pop()
          return first
        }
        items[0] = items.pop()
        const mid = len >> 1
        let i = 0
        let i1, i2, j, item, c, c1, c2
        while (i < mid) {
          item = items[i]
          i1 = (i << 1) + 1
          i2 = (i + 1) << 1
          c1 = items[i1]
          c2 = items[i2]
          if (!c2 || c1.index <= c2.index) {
            c = c1
            j = i1
          } else {
            c = c2
            j = i2
          }
          if (c.index >= item.index) {
            break
          }
          items[j] = item
          items[i] = c
          i = j
        }
        return first
      }

      /**
 * A tap is a buffer which remembers what has been already read.
 *
 * It is optimized for performance, at the cost of failing silently when
 * overflowing the buffer. This is a purposeful trade-off given the expected
 * rarity of this case and the large performance hit necessary to enforce
 * validity. See `isValid` below for more information.
 */
      function Tap (buf, pos) {
        this.buf = buf
        this.pos = pos | 0
        if (this.pos < 0) {
          throw new Error('negative offset')
        }
      }

      /**
 * Check that the tap is in a valid state.
 *
 * For efficiency reasons, none of the methods below will fail if an overflow
 * occurs (either read, skip, or write). For this reason, it is up to the
 * caller to always check that the read, skip, or write was valid by calling
 * this method.
 */
      Tap.prototype.isValid = function () { return this.pos <= this.buf.length }

      Tap.prototype._invalidate = function () { this.pos = this.buf.length + 1 }

      // Read, skip, write methods.
      //
      // These should fail silently when the buffer overflows. Note this is only
      // required to be true when the functions are decoding valid objects. For
      // example errors will still be thrown if a bad count is read, leading to a
      // negative position offset (which will typically cause a failure in
      // `readFixed`).

      Tap.prototype.readBoolean = function () { return !!this.buf[this.pos++] }

      Tap.prototype.skipBoolean = function () { this.pos++ }

      Tap.prototype.writeBoolean = function (b) { this.buf[this.pos++] = !!b }

      Tap.prototype.readInt = Tap.prototype.readLong = function () {
        let n = 0
        let k = 0
        const buf = this.buf
        let b, h, f, fk

        do {
          b = buf[this.pos++]
          h = b & 0x80
          n |= (b & 0x7f) << k
          k += 7
        } while (h && k < 28)

        if (h) {
        // Switch to float arithmetic, otherwise we might overflow.
          f = n
          fk = 268435456 // 2 ** 28.
          do {
            b = buf[this.pos++]
            f += (b & 0x7f) * fk
            fk *= 128
          } while (b & 0x80)
          return (f % 2 ? -(f + 1) : f) / 2
        }

        return (n >> 1) ^ -(n & 1)
      }

      Tap.prototype.skipInt = Tap.prototype.skipLong = function () {
        const buf = this.buf
        while (buf[this.pos++] & 0x80) {}
      }

      Tap.prototype.writeInt = Tap.prototype.writeLong = function (n) {
        const buf = this.buf
        let f, m

        if (n >= -1073741824 && n < 1073741824) {
        // Won't overflow, we can use integer arithmetic.
          m = n >= 0 ? n << 1 : (~n << 1) | 1
          do {
            buf[this.pos] = m & 0x7f
            m >>= 7
          } while (m && (buf[this.pos++] |= 0x80))
        } else {
        // We have to use slower floating arithmetic.
          f = n >= 0 ? n * 2 : (-n * 2) - 1
          do {
            buf[this.pos] = f & 0x7f
            f /= 128
          } while (f >= 1 && (buf[this.pos++] |= 0x80))
        }
        this.pos++
      }

      Tap.prototype.readFloat = function () {
        const buf = this.buf
        const pos = this.pos
        this.pos += 4
        if (this.pos > buf.length) {
          return 0
        }
        return this.buf.readFloatLE(pos)
      }

      Tap.prototype.skipFloat = function () { this.pos += 4 }

      Tap.prototype.writeFloat = function (f) {
        const buf = this.buf
        const pos = this.pos
        this.pos += 4
        if (this.pos > buf.length) {
          return
        }
        return this.buf.writeFloatLE(f, pos)
      }

      Tap.prototype.readDouble = function () {
        const buf = this.buf
        const pos = this.pos
        this.pos += 8
        if (this.pos > buf.length) {
          return 0
        }
        return this.buf.readDoubleLE(pos)
      }

      Tap.prototype.skipDouble = function () { this.pos += 8 }

      Tap.prototype.writeDouble = function (d) {
        const buf = this.buf
        const pos = this.pos
        this.pos += 8
        if (this.pos > buf.length) {
          return
        }
        return this.buf.writeDoubleLE(d, pos)
      }

      Tap.prototype.readFixed = function (len) {
        const pos = this.pos
        this.pos += len
        if (this.pos > this.buf.length) {
          return
        }
        const fixed = POOL.alloc(len)
        this.buf.copy(fixed, 0, pos, pos + len)
        return fixed
      }

      Tap.prototype.skipFixed = function (len) { this.pos += len }

      Tap.prototype.writeFixed = function (buf, len) {
        len = len || buf.length
        const pos = this.pos
        this.pos += len
        if (this.pos > this.buf.length) {
          return
        }
        buf.copy(this.buf, pos, 0, len)
      }

      Tap.prototype.readBytes = function () {
        const len = this.readLong()
        if (len < 0) {
          this._invalidate()
          return
        }
        return this.readFixed(len)
      }

      Tap.prototype.skipBytes = function () {
        const len = this.readLong()
        if (len < 0) {
          this._invalidate()
          return
        }
        this.pos += len
      }

      Tap.prototype.writeBytes = function (buf) {
        const len = buf.length
        this.writeLong(len)
        this.writeFixed(buf, len)
      }

      /* istanbul ignore else */
      if (typeof Buffer.prototype.utf8Slice === 'function') {
      // Use this optimized function when available.
        Tap.prototype.readString = function () {
          const len = this.readLong()
          if (len < 0) {
            this._invalidate()
            return ''
          }
          const pos = this.pos
          const buf = this.buf
          this.pos += len
          if (this.pos > buf.length) {
            return
          }
          return this.buf.utf8Slice(pos, pos + len)
        }
      } else {
        Tap.prototype.readString = function () {
          const len = this.readLong()
          if (len < 0) {
            this._invalidate()
            return ''
          }
          const pos = this.pos
          const buf = this.buf
          this.pos += len
          if (this.pos > buf.length) {
            return
          }
          return this.buf.slice(pos, pos + len).toString()
        }
      }

      Tap.prototype.skipString = function () {
        const len = this.readLong()
        if (len < 0) {
          this._invalidate()
          return
        }
        this.pos += len
      }

      Tap.prototype.writeString = function (s) {
        const len = Buffer.byteLength(s)
        const buf = this.buf
        this.writeLong(len)
        let pos = this.pos
        this.pos += len
        if (this.pos > buf.length) {
          return
        }
        if (len > 64 && typeof Buffer.prototype.utf8Write === 'function') {
        // This method is roughly 50% faster than the manual implementation below
        // for long strings (which is itself faster than the generic `Buffer#write`
        // at least in most browsers, where `utf8Write` is not available).
          buf.utf8Write(s, pos, len)
        } else {
          let i, l, c1, c2
          for (i = 0, l = len; i < l; i++) {
            c1 = s.charCodeAt(i)
            if (c1 < 0x80) {
              buf[pos++] = c1
            } else if (c1 < 0x800) {
              buf[pos++] = c1 >> 6 | 0xc0
              buf[pos++] = c1 & 0x3f | 0x80
            } else if (
              (c1 & 0xfc00) === 0xd800 &&
        ((c2 = s.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
            ) {
              c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff)
              i++
              buf[pos++] = c1 >> 18 | 0xf0
              buf[pos++] = c1 >> 12 & 0x3f | 0x80
              buf[pos++] = c1 >> 6 & 0x3f | 0x80
              buf[pos++] = c1 & 0x3f | 0x80
            } else {
              buf[pos++] = c1 >> 12 | 0xe0
              buf[pos++] = c1 >> 6 & 0x3f | 0x80
              buf[pos++] = c1 & 0x3f | 0x80
            }
          }
        }
      }

      /* istanbul ignore else */
      if (typeof Buffer.prototype.latin1Write === 'function') {
      // `binaryWrite` has been renamed to `latin1Write` in Node v6.4.0, see
      // https://github.com/nodejs/node/pull/7111. Note that the `'binary'`
      // encoding argument still works however.
        Tap.prototype.writeBinary = function (str, len) {
          const pos = this.pos
          this.pos += len
          if (this.pos > this.buf.length) {
            return
          }
          this.buf.latin1Write(str, pos, len)
        }
      } else if (typeof Buffer.prototype.binaryWrite === 'function') {
        Tap.prototype.writeBinary = function (str, len) {
          const pos = this.pos
          this.pos += len
          if (this.pos > this.buf.length) {
            return
          }
          this.buf.binaryWrite(str, pos, len)
        }
      } else {
      // Slowest implementation.
        Tap.prototype.writeBinary = function (s, len) {
          const pos = this.pos
          this.pos += len
          if (this.pos > this.buf.length) {
            return
          }
          this.buf.write(s, pos, len, 'binary')
        }
      }

      // Binary comparison methods.
      //
      // These are not guaranteed to consume the objects they are comparing when
      // returning a non-zero result (allowing for performance benefits), so no other
      // operations should be done on either tap after a compare returns a non-zero
      // value. Also, these methods do not have the same silent failure requirement
      // as read, skip, and write since they are assumed to be called on valid
      // buffers.

      Tap.prototype.matchBoolean = function (tap) {
        return this.buf[this.pos++] - tap.buf[tap.pos++]
      }

      Tap.prototype.matchInt = Tap.prototype.matchLong = function (tap) {
        const n1 = this.readLong()
        const n2 = tap.readLong()
        return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1)
      }

      Tap.prototype.matchFloat = function (tap) {
        const n1 = this.readFloat()
        const n2 = tap.readFloat()
        return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1)
      }

      Tap.prototype.matchDouble = function (tap) {
        const n1 = this.readDouble()
        const n2 = tap.readDouble()
        return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1)
      }

      Tap.prototype.matchFixed = function (tap, len) {
        return this.readFixed(len).compare(tap.readFixed(len))
      }

      Tap.prototype.matchBytes = Tap.prototype.matchString = function (tap) {
        const l1 = this.readLong()
        const p1 = this.pos
        this.pos += l1
        const l2 = tap.readLong()
        const p2 = tap.pos
        tap.pos += l2
        const b1 = this.buf.slice(p1, this.pos)
        const b2 = tap.buf.slice(p2, tap.pos)
        return b1.compare(b2)
      }

      // Functions for supporting custom long classes.
      //
      // The two following methods allow the long implementations to not have to
      // worry about Avro's zigzag encoding, we directly expose longs as unpacked.

      Tap.prototype.unpackLongBytes = function () {
        const res = newBuffer(8)
        let n = 0
        let i = 0 // Byte index in target buffer.
        let j = 6 // Bit offset in current target buffer byte.
        const buf = this.buf
        let b, neg

        b = buf[this.pos++]
        neg = b & 1
        res.fill(0)

        n |= (b & 0x7f) >> 1
        while (b & 0x80) {
          b = buf[this.pos++]
          n |= (b & 0x7f) << j
          j += 7
          if (j >= 8) {
          // Flush byte.
            j -= 8
            res[i++] = n
            n >>= 8
          }
        }
        res[i] = n

        if (neg) {
          invert(res, 8)
        }

        return res
      }

      Tap.prototype.packLongBytes = function (buf) {
        const neg = (buf[7] & 0x80) >> 7
        const res = this.buf
        let j = 1
        let k = 0
        let m = 3
        let n

        if (neg) {
          invert(buf, 8)
          n = 1
        } else {
          n = 0
        }

        const parts = [
          buf.readUIntLE(0, 3),
          buf.readUIntLE(3, 3),
          buf.readUIntLE(6, 2)
        ]
        // Not reading more than 24 bits because we need to be able to combine the
        // "carry" bits from the previous part and JavaScript only supports bitwise
        // operations on 32 bit integers.
        while (m && !parts[--m]) {} // Skip trailing 0s.

        // Leading parts (if any), we never bail early here since we need the
        // continuation bit to be set.
        while (k < m) {
          n |= parts[k++] << j
          j += 24
          while (j > 7) {
            res[this.pos++] = (n & 0x7f) | 0x80
            n >>= 7
            j -= 7
          }
        }

        // Final part, similar to normal packing aside from the initial offset.
        n |= parts[m] << j
        do {
          res[this.pos] = n & 0x7f
          n >>= 7
        } while (n && (res[this.pos++] |= 0x80))
        this.pos++

        // Restore original buffer (could make this optional?).
        if (neg) {
          invert(buf, 8)
        }
      }

      // Helpers.

      /**
 * Invert all bits in a buffer.
 *
 * @param buf {Buffer} Non-empty buffer to invert.
 * @param len {Number} Buffer length (must be positive).
 */
      function invert (buf, len) {
        while (len--) {
          buf[len] = ~buf[len]
        }
      }

      module.exports = {
        abstractFunction,
        addDeprecatedGetters,
        bufferFrom,
        capitalize,
        copyOwnProperties,
        getHash,
        compare,
        getOption,
        impliedNamespace,
        isValidName,
        jsonEnd,
        newBuffer,
        objectValues,
        qualify,
        toMap,
        singleIndexOf,
        hasDuplicates,
        unqualify,
        BufferPool,
        Lcg,
        OrderedQueue,
        Tap
      }
    }, { buffer: 16, crypto: 5, util: 80 }],
    12: [function (require, module, exports) {
      'use strict'

      exports.byteLength = byteLength
      exports.toByteArray = toByteArray
      exports.fromByteArray = fromByteArray

      const lookup = []
      const revLookup = []
      const Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

      const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      for (let i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i]
        revLookup[code.charCodeAt(i)] = i
      }

      // Support decoding URL-safe base64 strings, as Node.js does.
      // See: https://en.wikipedia.org/wiki/Base64#URL_applications
      revLookup['-'.charCodeAt(0)] = 62
      revLookup['_'.charCodeAt(0)] = 63

      function getLens (b64) {
        const len = b64.length

        if (len % 4 > 0) {
          throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len

        const placeHoldersLen = validLen === len
          ? 0
          : 4 - (validLen % 4)

        return [validLen, placeHoldersLen]
      }

      // base64 is 4/3 + up to two characters of the original data
      function byteLength (b64) {
        const lens = getLens(b64)
        const validLen = lens[0]
        const placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }

      function _byteLength (b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
      }

      function toByteArray (b64) {
        let tmp
        const lens = getLens(b64)
        const validLen = lens[0]
        const placeHoldersLen = lens[1]

        const arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

        let curByte = 0

        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLen > 0
          ? validLen - 4
          : validLen

        let i
        for (i = 0; i < len; i += 4) {
          tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
          arr[curByte++] = (tmp >> 16) & 0xFF
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 2) {
          tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
          arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 1) {
          tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
          arr[curByte++] = (tmp >> 8) & 0xFF
          arr[curByte++] = tmp & 0xFF
        }

        return arr
      }

      function tripletToBase64 (num) {
        return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
      }

      function encodeChunk (uint8, start, end) {
        let tmp
        const output = []
        for (let i = start; i < end; i += 3) {
          tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
          output.push(tripletToBase64(tmp))
        }
        return output.join('')
      }

      function fromByteArray (uint8) {
        let tmp
        const len = uint8.length
        const extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        const parts = []
        const maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
          parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
          tmp = uint8[len - 1]
          parts.push(
            lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
          )
        } else if (extraBytes === 2) {
          tmp = (uint8[len - 2] << 8) + uint8[len - 1]
          parts.push(
            lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
          )
        }

        return parts.join('')
      }
    }, {}],
    13: [function (require, module, exports) {

    }, {}],
    14: [function (require, module, exports) {
      (function (process, Buffer) {
        (function () {
          'use strict'
          /* eslint camelcase: "off" */

          const assert = require('assert')

          const Zstream = require('pako/lib/zlib/zstream')
          const zlib_deflate = require('pako/lib/zlib/deflate.js')
          const zlib_inflate = require('pako/lib/zlib/inflate.js')
          const constants = require('pako/lib/zlib/constants')

          for (const key in constants) {
            exports[key] = constants[key]
          }

          // zlib modes
          exports.NONE = 0
          exports.DEFLATE = 1
          exports.INFLATE = 2
          exports.GZIP = 3
          exports.GUNZIP = 4
          exports.DEFLATERAW = 5
          exports.INFLATERAW = 6
          exports.UNZIP = 7

          const GZIP_HEADER_ID1 = 0x1f
          const GZIP_HEADER_ID2 = 0x8b

          /**
 * Emulate Node's zlib C++ layer for use by the JS layer in index.js
 */
          function Zlib (mode) {
            if (typeof mode !== 'number' || mode < exports.DEFLATE || mode > exports.UNZIP) {
              throw new TypeError('Bad argument')
            }

            this.dictionary = null
            this.err = 0
            this.flush = 0
            this.init_done = false
            this.level = 0
            this.memLevel = 0
            this.mode = mode
            this.strategy = 0
            this.windowBits = 0
            this.write_in_progress = false
            this.pending_close = false
            this.gzip_id_bytes_read = 0
          }

          Zlib.prototype.close = function () {
            if (this.write_in_progress) {
              this.pending_close = true
              return
            }

            this.pending_close = false

            assert(this.init_done, 'close before init')
            assert(this.mode <= exports.UNZIP)

            if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
              zlib_deflate.deflateEnd(this.strm)
            } else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) {
              zlib_inflate.inflateEnd(this.strm)
            }

            this.mode = exports.NONE

            this.dictionary = null
          }

          Zlib.prototype.write = function (flush, input, in_off, in_len, out, out_off, out_len) {
            return this._write(true, flush, input, in_off, in_len, out, out_off, out_len)
          }

          Zlib.prototype.writeSync = function (flush, input, in_off, in_len, out, out_off, out_len) {
            return this._write(false, flush, input, in_off, in_len, out, out_off, out_len)
          }

          Zlib.prototype._write = function (async, flush, input, in_off, in_len, out, out_off, out_len) {
            assert.equal(arguments.length, 8)

            assert(this.init_done, 'write before init')
            assert(this.mode !== exports.NONE, 'already finalized')
            assert.equal(false, this.write_in_progress, 'write already in progress')
            assert.equal(false, this.pending_close, 'close is pending')

            this.write_in_progress = true

            assert.equal(false, flush === undefined, 'must provide flush value')

            this.write_in_progress = true

            if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
              throw new Error('Invalid flush value')
            }

            if (input == null) {
              input = Buffer.alloc(0)
              in_len = 0
              in_off = 0
            }

            this.strm.avail_in = in_len
            this.strm.input = input
            this.strm.next_in = in_off
            this.strm.avail_out = out_len
            this.strm.output = out
            this.strm.next_out = out_off
            this.flush = flush

            if (!async) {
              // sync version
              this._process()

              if (this._checkError()) {
                return this._afterSync()
              }
              return
            }

            // async version
            const self = this
            process.nextTick(function () {
              self._process()
              self._after()
            })

            return this
          }

          Zlib.prototype._afterSync = function () {
            const avail_out = this.strm.avail_out
            const avail_in = this.strm.avail_in

            this.write_in_progress = false

            return [avail_in, avail_out]
          }

          Zlib.prototype._process = function () {
            let next_expected_header_byte = null

            // If the avail_out is left at 0, then it means that it ran out
            // of room.  If there was avail_out left over, then it means
            // that all of the input was consumed.
            switch (this.mode) {
              case exports.DEFLATE:
              case exports.GZIP:
              case exports.DEFLATERAW:
                this.err = zlib_deflate.deflate(this.strm, this.flush)
                break
              case exports.UNZIP:
                if (this.strm.avail_in > 0) {
                  next_expected_header_byte = this.strm.next_in
                }

                switch (this.gzip_id_bytes_read) {
                  case 0:
                    if (next_expected_header_byte === null) {
                      break
                    }

                    if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
                      this.gzip_id_bytes_read = 1
                      next_expected_header_byte++

                      if (this.strm.avail_in === 1) {
                        // The only available byte was already read.
                        break
                      }
                    } else {
                      this.mode = exports.INFLATE
                      break
                    }

                    // fallthrough
                  case 1:
                    if (next_expected_header_byte === null) {
                      break
                    }

                    if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
                      this.gzip_id_bytes_read = 2
                      this.mode = exports.GUNZIP
                    } else {
                      // There is no actual difference between INFLATE and INFLATERAW
                      // (after initialization).
                      this.mode = exports.INFLATE
                    }

                    break
                  default:
                    throw new Error('invalid number of gzip magic number bytes read')
                }

                // fallthrough
              case exports.INFLATE:
              case exports.GUNZIP:
              case exports.INFLATERAW:
                this.err = zlib_inflate.inflate(this.strm, this.flush

                  // If data was encoded with dictionary
                ); if (this.err === exports.Z_NEED_DICT && this.dictionary) {
                  // Load it
                  this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary)
                  if (this.err === exports.Z_OK) {
                    // And try to decode again
                    this.err = zlib_inflate.inflate(this.strm, this.flush)
                  } else if (this.err === exports.Z_DATA_ERROR) {
                    // Both inflateSetDictionary() and inflate() return Z_DATA_ERROR.
                    // Make it possible for After() to tell a bad dictionary from bad
                    // input.
                    this.err = exports.Z_NEED_DICT
                  }
                }
                while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0x00) {
                  // Bytes remain in input buffer. Perhaps this is another compressed
                  // member in the same archive, or just trailing garbage.
                  // Trailing zero bytes are okay, though, since they are frequently
                  // used for padding.

                  this.reset()
                  this.err = zlib_inflate.inflate(this.strm, this.flush)
                }
                break
              default:
                throw new Error('Unknown mode ' + this.mode)
            }
          }

          Zlib.prototype._checkError = function () {
            // Acceptable error states depend on the type of zlib stream.
            switch (this.err) {
              case exports.Z_OK:
              case exports.Z_BUF_ERROR:
                if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
                  this._error('unexpected end of file')
                  return false
                }
                break
              case exports.Z_STREAM_END:
                // normal statuses, not fatal
                break
              case exports.Z_NEED_DICT:
                if (this.dictionary == null) {
                  this._error('Missing dictionary')
                } else {
                  this._error('Bad dictionary')
                }
                return false
              default:
                // something else.
                this._error('Zlib error')
                return false
            }

            return true
          }

          Zlib.prototype._after = function () {
            if (!this._checkError()) {
              return
            }

            const avail_out = this.strm.avail_out
            const avail_in = this.strm.avail_in

            this.write_in_progress = false

            // call the write() cb
            this.callback(avail_in, avail_out)

            if (this.pending_close) {
              this.close()
            }
          }

          Zlib.prototype._error = function (message) {
            if (this.strm.msg) {
              message = this.strm.msg
            }
            this.onerror(message, this.err

              // no hope of rescue.
            ); this.write_in_progress = false
            if (this.pending_close) {
              this.close()
            }
          }

          Zlib.prototype.init = function (windowBits, level, memLevel, strategy, dictionary) {
            assert(arguments.length === 4 || arguments.length === 5, 'init(windowBits, level, memLevel, strategy, [dictionary])')

            assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits')
            assert(level >= -1 && level <= 9, 'invalid compression level')

            assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel')

            assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, 'invalid strategy')

            this._init(level, windowBits, memLevel, strategy, dictionary)
            this._setDictionary()
          }

          Zlib.prototype.params = function () {
            throw new Error('deflateParams Not supported')
          }

          Zlib.prototype.reset = function () {
            this._reset()
            this._setDictionary()
          }

          Zlib.prototype._init = function (level, windowBits, memLevel, strategy, dictionary) {
            this.level = level
            this.windowBits = windowBits
            this.memLevel = memLevel
            this.strategy = strategy

            this.flush = exports.Z_NO_FLUSH

            this.err = exports.Z_OK

            if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) {
              this.windowBits += 16
            }

            if (this.mode === exports.UNZIP) {
              this.windowBits += 32
            }

            if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) {
              this.windowBits = -1 * this.windowBits
            }

            this.strm = new Zstream()

            switch (this.mode) {
              case exports.DEFLATE:
              case exports.GZIP:
              case exports.DEFLATERAW:
                this.err = zlib_deflate.deflateInit2(this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy)
                break
              case exports.INFLATE:
              case exports.GUNZIP:
              case exports.INFLATERAW:
              case exports.UNZIP:
                this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits)
                break
              default:
                throw new Error('Unknown mode ' + this.mode)
            }

            if (this.err !== exports.Z_OK) {
              this._error('Init error')
            }

            this.dictionary = dictionary

            this.write_in_progress = false
            this.init_done = true
          }

          Zlib.prototype._setDictionary = function () {
            if (this.dictionary == null) {
              return
            }

            this.err = exports.Z_OK

            switch (this.mode) {
              case exports.DEFLATE:
              case exports.DEFLATERAW:
                this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary)
                break
              default:
                break
            }

            if (this.err !== exports.Z_OK) {
              this._error('Failed to set dictionary')
            }
          }

          Zlib.prototype._reset = function () {
            this.err = exports.Z_OK

            switch (this.mode) {
              case exports.DEFLATE:
              case exports.DEFLATERAW:
              case exports.GZIP:
                this.err = zlib_deflate.deflateReset(this.strm)
                break
              case exports.INFLATE:
              case exports.INFLATERAW:
              case exports.GUNZIP:
                this.err = zlib_inflate.inflateReset(this.strm)
                break
              default:
                break
            }

            if (this.err !== exports.Z_OK) {
              this._error('Failed to reset stream')
            }
          }

          exports.Zlib = Zlib
        }).call(this)
      }).call(this, require('_process'), require('buffer').Buffer)
    }, { _process: 56, assert: 1, buffer: 16, 'pako/lib/zlib/constants': 46, 'pako/lib/zlib/deflate.js': 48, 'pako/lib/zlib/inflate.js': 50, 'pako/lib/zlib/zstream': 54 }],
    15: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict'

          const Buffer = require('buffer').Buffer
          const Transform = require('stream').Transform
          const binding = require('./binding')
          const util = require('util')
          const assert = require('assert').ok
          const kMaxLength = require('buffer').kMaxLength
          const kRangeErrorMessage = 'Cannot create final Buffer. It would be larger ' + 'than 0x' + kMaxLength.toString(16) + ' bytes'

          // zlib doesn't provide these, so kludge them in following the same
          // const naming scheme zlib uses.
          binding.Z_MIN_WINDOWBITS = 8
          binding.Z_MAX_WINDOWBITS = 15
          binding.Z_DEFAULT_WINDOWBITS = 15

          // fewer than 64 bytes per chunk is stupid.
          // technically it could work with as few as 8, but even 64 bytes
          // is absurdly low.  Usually a MB or more is best.
          binding.Z_MIN_CHUNK = 64
          binding.Z_MAX_CHUNK = Infinity
          binding.Z_DEFAULT_CHUNK = 16 * 1024

          binding.Z_MIN_MEMLEVEL = 1
          binding.Z_MAX_MEMLEVEL = 9
          binding.Z_DEFAULT_MEMLEVEL = 8

          binding.Z_MIN_LEVEL = -1
          binding.Z_MAX_LEVEL = 9
          binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION

          // expose all the zlib constants
          const bkeys = Object.keys(binding)
          for (let bk = 0; bk < bkeys.length; bk++) {
            const bkey = bkeys[bk]
            if (bkey.match(/^Z/)) {
              Object.defineProperty(exports, bkey, {
                enumerable: true, value: binding[bkey], writable: false
              })
            }
          }

          // translation table for return codes.
          const codes = {
            Z_OK: binding.Z_OK,
            Z_STREAM_END: binding.Z_STREAM_END,
            Z_NEED_DICT: binding.Z_NEED_DICT,
            Z_ERRNO: binding.Z_ERRNO,
            Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
            Z_DATA_ERROR: binding.Z_DATA_ERROR,
            Z_MEM_ERROR: binding.Z_MEM_ERROR,
            Z_BUF_ERROR: binding.Z_BUF_ERROR,
            Z_VERSION_ERROR: binding.Z_VERSION_ERROR
          }

          const ckeys = Object.keys(codes)
          for (let ck = 0; ck < ckeys.length; ck++) {
            const ckey = ckeys[ck]
            codes[codes[ckey]] = ckey
          }

          Object.defineProperty(exports, 'codes', {
            enumerable: true, value: Object.freeze(codes), writable: false
          })

          exports.Deflate = Deflate
          exports.Inflate = Inflate
          exports.Gzip = Gzip
          exports.Gunzip = Gunzip
          exports.DeflateRaw = DeflateRaw
          exports.InflateRaw = InflateRaw
          exports.Unzip = Unzip

          exports.createDeflate = function (o) {
            return new Deflate(o)
          }

          exports.createInflate = function (o) {
            return new Inflate(o)
          }

          exports.createDeflateRaw = function (o) {
            return new DeflateRaw(o)
          }

          exports.createInflateRaw = function (o) {
            return new InflateRaw(o)
          }

          exports.createGzip = function (o) {
            return new Gzip(o)
          }

          exports.createGunzip = function (o) {
            return new Gunzip(o)
          }

          exports.createUnzip = function (o) {
            return new Unzip(o)
          }

          // Convenience methods.
          // compress/decompress a string or buffer in one step.
          exports.deflate = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new Deflate(opts), buffer, callback)
          }

          exports.deflateSync = function (buffer, opts) {
            return zlibBufferSync(new Deflate(opts), buffer)
          }

          exports.gzip = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new Gzip(opts), buffer, callback)
          }

          exports.gzipSync = function (buffer, opts) {
            return zlibBufferSync(new Gzip(opts), buffer)
          }

          exports.deflateRaw = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new DeflateRaw(opts), buffer, callback)
          }

          exports.deflateRawSync = function (buffer, opts) {
            return zlibBufferSync(new DeflateRaw(opts), buffer)
          }

          exports.unzip = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new Unzip(opts), buffer, callback)
          }

          exports.unzipSync = function (buffer, opts) {
            return zlibBufferSync(new Unzip(opts), buffer)
          }

          exports.inflate = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new Inflate(opts), buffer, callback)
          }

          exports.inflateSync = function (buffer, opts) {
            return zlibBufferSync(new Inflate(opts), buffer)
          }

          exports.gunzip = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new Gunzip(opts), buffer, callback)
          }

          exports.gunzipSync = function (buffer, opts) {
            return zlibBufferSync(new Gunzip(opts), buffer)
          }

          exports.inflateRaw = function (buffer, opts, callback) {
            if (typeof opts === 'function') {
              callback = opts
              opts = {}
            }
            return zlibBuffer(new InflateRaw(opts), buffer, callback)
          }

          exports.inflateRawSync = function (buffer, opts) {
            return zlibBufferSync(new InflateRaw(opts), buffer)
          }

          function zlibBuffer (engine, buffer, callback) {
            let buffers = []
            let nread = 0

            engine.on('error', onError)
            engine.on('end', onEnd)

            engine.end(buffer)
            flow()

            function flow () {
              let chunk
              while ((chunk = engine.read()) !== null) {
                buffers.push(chunk)
                nread += chunk.length
              }
              engine.once('readable', flow)
            }

            function onError (err) {
              engine.removeListener('end', onEnd)
              engine.removeListener('readable', flow)
              callback(err)
            }

            function onEnd () {
              let buf
              let err = null

              if (nread >= kMaxLength) {
                err = new RangeError(kRangeErrorMessage)
              } else {
                buf = Buffer.concat(buffers, nread)
              }

              buffers = []
              engine.close()
              callback(err, buf)
            }
          }

          function zlibBufferSync (engine, buffer) {
            if (typeof buffer === 'string') buffer = Buffer.from(buffer)

            if (!Buffer.isBuffer(buffer)) throw new TypeError('Not a string or buffer')

            const flushFlag = engine._finishFlushFlag

            return engine._processChunk(buffer, flushFlag)
          }

          // generic zlib
          // minimal 2-byte header
          function Deflate (opts) {
            if (!(this instanceof Deflate)) return new Deflate(opts)
            Zlib.call(this, opts, binding.DEFLATE)
          }

          function Inflate (opts) {
            if (!(this instanceof Inflate)) return new Inflate(opts)
            Zlib.call(this, opts, binding.INFLATE)
          }

          // gzip - bigger header, same deflate compression
          function Gzip (opts) {
            if (!(this instanceof Gzip)) return new Gzip(opts)
            Zlib.call(this, opts, binding.GZIP)
          }

          function Gunzip (opts) {
            if (!(this instanceof Gunzip)) return new Gunzip(opts)
            Zlib.call(this, opts, binding.GUNZIP)
          }

          // raw - no header
          function DeflateRaw (opts) {
            if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts)
            Zlib.call(this, opts, binding.DEFLATERAW)
          }

          function InflateRaw (opts) {
            if (!(this instanceof InflateRaw)) return new InflateRaw(opts)
            Zlib.call(this, opts, binding.INFLATERAW)
          }

          // auto-detect header.
          function Unzip (opts) {
            if (!(this instanceof Unzip)) return new Unzip(opts)
            Zlib.call(this, opts, binding.UNZIP)
          }

          function isValidFlushFlag (flag) {
            return flag === binding.Z_NO_FLUSH || flag === binding.Z_PARTIAL_FLUSH || flag === binding.Z_SYNC_FLUSH || flag === binding.Z_FULL_FLUSH || flag === binding.Z_FINISH || flag === binding.Z_BLOCK
          }

          // the Zlib class they all inherit from
          // This thing manages the queue of requests, and returns
          // true or false if there is anything in the queue when
          // you call the .write() method.

          function Zlib (opts, mode) {
            const _this = this

            this._opts = opts = opts || {}
            this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK

            Transform.call(this, opts)

            if (opts.flush && !isValidFlushFlag(opts.flush)) {
              throw new Error('Invalid flush flag: ' + opts.flush)
            }
            if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
              throw new Error('Invalid flush flag: ' + opts.finishFlush)
            }

            this._flushFlag = opts.flush || binding.Z_NO_FLUSH
            this._finishFlushFlag = typeof opts.finishFlush !== 'undefined' ? opts.finishFlush : binding.Z_FINISH

            if (opts.chunkSize) {
              if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
                throw new Error('Invalid chunk size: ' + opts.chunkSize)
              }
            }

            if (opts.windowBits) {
              if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
                throw new Error('Invalid windowBits: ' + opts.windowBits)
              }
            }

            if (opts.level) {
              if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
                throw new Error('Invalid compression level: ' + opts.level)
              }
            }

            if (opts.memLevel) {
              if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
                throw new Error('Invalid memLevel: ' + opts.memLevel)
              }
            }

            if (opts.strategy) {
              if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
                throw new Error('Invalid strategy: ' + opts.strategy)
              }
            }

            if (opts.dictionary) {
              if (!Buffer.isBuffer(opts.dictionary)) {
                throw new Error('Invalid dictionary: it should be a Buffer instance')
              }
            }

            this._handle = new binding.Zlib(mode)

            const self = this
            this._hadError = false
            this._handle.onerror = function (message, errno) {
              // there is no way to cleanly recover.
              // continuing only obscures problems.
              _close(self)
              self._hadError = true

              const error = new Error(message)
              error.errno = errno
              error.code = exports.codes[errno]
              self.emit('error', error)
            }

            let level = exports.Z_DEFAULT_COMPRESSION
            if (typeof opts.level === 'number') level = opts.level

            let strategy = exports.Z_DEFAULT_STRATEGY
            if (typeof opts.strategy === 'number') strategy = opts.strategy

            this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary)

            this._buffer = Buffer.allocUnsafe(this._chunkSize)
            this._offset = 0
            this._level = level
            this._strategy = strategy

            this.once('end', this.close)

            Object.defineProperty(this, '_closed', {
              get: function () {
                return !_this._handle
              },
              configurable: true,
              enumerable: true
            })
          }

          util.inherits(Zlib, Transform)

          Zlib.prototype.params = function (level, strategy, callback) {
            if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
              throw new RangeError('Invalid compression level: ' + level)
            }
            if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
              throw new TypeError('Invalid strategy: ' + strategy)
            }

            if (this._level !== level || this._strategy !== strategy) {
              const self = this
              this.flush(binding.Z_SYNC_FLUSH, function () {
                assert(self._handle, 'zlib binding closed')
                self._handle.params(level, strategy)
                if (!self._hadError) {
                  self._level = level
                  self._strategy = strategy
                  if (callback) callback()
                }
              })
            } else {
              process.nextTick(callback)
            }
          }

          Zlib.prototype.reset = function () {
            assert(this._handle, 'zlib binding closed')
            return this._handle.reset()
          }

          // This is the _flush function called by the transform class,
          // internally, when the last chunk has been written.
          Zlib.prototype._flush = function (callback) {
            this._transform(Buffer.alloc(0), '', callback)
          }

          Zlib.prototype.flush = function (kind, callback) {
            const _this2 = this

            const ws = this._writableState

            if (typeof kind === 'function' || kind === undefined && !callback) {
              callback = kind
              kind = binding.Z_FULL_FLUSH
            }

            if (ws.ended) {
              if (callback) process.nextTick(callback)
            } else if (ws.ending) {
              if (callback) this.once('end', callback)
            } else if (ws.needDrain) {
              if (callback) {
                this.once('drain', function () {
                  return _this2.flush(kind, callback)
                })
              }
            } else {
              this._flushFlag = kind
              this.write(Buffer.alloc(0), '', callback)
            }
          }

          Zlib.prototype.close = function (callback) {
            _close(this, callback)
            process.nextTick(emitCloseNT, this)
          }

          function _close (engine, callback) {
            if (callback) process.nextTick(callback)

            // Caller may invoke .close after a zlib error (which will null _handle).
            if (!engine._handle) return

            engine._handle.close()
            engine._handle = null
          }

          function emitCloseNT (self) {
            self.emit('close')
          }

          Zlib.prototype._transform = function (chunk, encoding, cb) {
            let flushFlag
            const ws = this._writableState
            const ending = ws.ending || ws.ended
            const last = ending && (!chunk || ws.length === chunk.length)

            if (chunk !== null && !Buffer.isBuffer(chunk)) return cb(new Error('invalid input'))

            if (!this._handle) return cb(new Error('zlib binding closed'))

            // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag
            // (or whatever flag was provided using opts.finishFlush).
            // If it's explicitly flushing at some other time, then we use
            // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
            // goodness.
            if (last) flushFlag = this._finishFlushFlag; else {
              flushFlag = this._flushFlag
              // once we've flushed the last of the queue, stop flushing and
              // go back to the normal behavior.
              if (chunk.length >= ws.length) {
                this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH
              }
            }

            this._processChunk(chunk, flushFlag, cb)
          }

          Zlib.prototype._processChunk = function (chunk, flushFlag, cb) {
            let availInBefore = chunk && chunk.length
            let availOutBefore = this._chunkSize - this._offset
            let inOff = 0

            const self = this

            const async = typeof cb === 'function'

            if (!async) {
              var buffers = []
              var nread = 0

              let error
              this.on('error', function (er) {
                error = er
              })

              assert(this._handle, 'zlib binding closed')
              do {
                var res = this._handle.writeSync(flushFlag, chunk, // in
                  inOff, // in_off
                  availInBefore, // in_len
                  this._buffer, // out
                  this._offset, // out_off
                  availOutBefore) // out_len
              } while (!this._hadError && callback(res[0], res[1]))

              if (this._hadError) {
                throw error
              }

              if (nread >= kMaxLength) {
                _close(this)
                throw new RangeError(kRangeErrorMessage)
              }

              const buf = Buffer.concat(buffers, nread)
              _close(this)

              return buf
            }

            assert(this._handle, 'zlib binding closed')
            const req = this._handle.write(flushFlag, chunk, // in
              inOff, // in_off
              availInBefore, // in_len
              this._buffer, // out
              this._offset, // out_off
              availOutBefore) // out_len

            req.buffer = chunk
            req.callback = callback

            function callback (availInAfter, availOutAfter) {
              // When the callback is used in an async write, the callback's
              // context is the `req` object that was created. The req object
              // is === this._handle, and that's why it's important to null
              // out the values after they are done being used. `this._handle`
              // can stay in memory longer than the callback and buffer are needed.
              if (this) {
                this.buffer = null
                this.callback = null
              }

              if (self._hadError) return

              const have = availOutBefore - availOutAfter
              assert(have >= 0, 'have should not go down')

              if (have > 0) {
                const out = self._buffer.slice(self._offset, self._offset + have)
                self._offset += have
                // serve some output to the consumer.
                if (async) {
                  self.push(out)
                } else {
                  buffers.push(out)
                  nread += out.length
                }
              }

              // exhausted the output buffer, or used all the input create a new one.
              if (availOutAfter === 0 || self._offset >= self._chunkSize) {
                availOutBefore = self._chunkSize
                self._offset = 0
                self._buffer = Buffer.allocUnsafe(self._chunkSize)
              }

              if (availOutAfter === 0) {
                // Not actually done.  Need to reprocess.
                // Also, update the availInBefore to the availInAfter value,
                // so that if we have to hit it a third (fourth, etc.) time,
                // it'll have the correct byte counts.
                inOff += availInBefore - availInAfter
                availInBefore = availInAfter

                if (!async) return true

                const newReq = self._handle.write(flushFlag, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize)
                newReq.callback = callback // this same function
                newReq.buffer = chunk
                return
              }

              if (!async) return false

              // finished with the chunk.
              cb()
            }
          }

          util.inherits(Deflate, Zlib)
          util.inherits(Inflate, Zlib)
          util.inherits(Gzip, Zlib)
          util.inherits(Gunzip, Zlib)
          util.inherits(DeflateRaw, Zlib)
          util.inherits(InflateRaw, Zlib)
          util.inherits(Unzip, Zlib)
        }).call(this)
      }).call(this, require('_process'))
    }, { './binding': 14, _process: 56, assert: 1, buffer: 16, stream: 73, util: 80 }],
    16: [function (require, module, exports) {
      (function (Buffer) {
        (function () {
          /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
          /* eslint-disable no-proto */

          'use strict'

          const base64 = require('base64-js')
          const ieee754 = require('ieee754')

          exports.Buffer = Buffer
          exports.SlowBuffer = SlowBuffer
          exports.INSPECT_MAX_BYTES = 50

          const K_MAX_LENGTH = 0x7fffffff
          exports.kMaxLength = K_MAX_LENGTH

          /**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
          Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

          if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
            console.error(
              'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
            )
          }

          function typedArraySupport () {
            // Can typed array instances can be augmented?
            try {
              const arr = new Uint8Array(1)
              arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
              return arr.foo() === 42
            } catch (e) {
              return false
            }
          }

          Object.defineProperty(Buffer.prototype, 'parent', {
            enumerable: true,
            get: function () {
              if (!Buffer.isBuffer(this)) return undefined
              return this.buffer
            }
          })

          Object.defineProperty(Buffer.prototype, 'offset', {
            enumerable: true,
            get: function () {
              if (!Buffer.isBuffer(this)) return undefined
              return this.byteOffset
            }
          })

          function createBuffer (length) {
            if (length > K_MAX_LENGTH) {
              throw new RangeError('The value "' + length + '" is invalid for option "size"')
            }
            // Return an augmented `Uint8Array` instance
            const buf = new Uint8Array(length)
            buf.__proto__ = Buffer.prototype
            return buf
          }

          /**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

          function Buffer (arg, encodingOrOffset, length) {
            // Common case.
            if (typeof arg === 'number') {
              if (typeof encodingOrOffset === 'string') {
                throw new TypeError(
                  'The "string" argument must be of type string. Received type number'
                )
              }
              return allocUnsafe(arg)
            }
            return from(arg, encodingOrOffset, length)
          }

          // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
          if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
            Object.defineProperty(Buffer, Symbol.species, {
              value: null,
              configurable: true,
              enumerable: false,
              writable: false
            })
          }

          Buffer.poolSize = 8192 // not used by this implementation

          function from (value, encodingOrOffset, length) {
            if (typeof value === 'string') {
              return fromString(value, encodingOrOffset)
            }

            if (ArrayBuffer.isView(value)) {
              return fromArrayLike(value)
            }

            if (value == null) {
              throw TypeError(
                'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
              )
            }

            if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
              return fromArrayBuffer(value, encodingOrOffset, length)
            }

            if (typeof value === 'number') {
              throw new TypeError(
                'The "value" argument must not be of type number. Received type number'
              )
            }

            const valueOf = value.valueOf && value.valueOf()
            if (valueOf != null && valueOf !== value) {
              return Buffer.from(valueOf, encodingOrOffset, length)
            }

            const b = fromObject(value)
            if (b) return b

            if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
              return Buffer.from(
                value[Symbol.toPrimitive]('string'), encodingOrOffset, length
              )
            }

            throw new TypeError(
              'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
            )
          }

          /**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
          Buffer.from = function (value, encodingOrOffset, length) {
            return from(value, encodingOrOffset, length)
          }

          // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
          // https://github.com/feross/buffer/pull/148
          Buffer.prototype.__proto__ = Uint8Array.prototype
          Buffer.__proto__ = Uint8Array

          function assertSize (size) {
            if (typeof size !== 'number') {
              throw new TypeError('"size" argument must be of type number')
            } else if (size < 0) {
              throw new RangeError('The value "' + size + '" is invalid for option "size"')
            }
          }

          function alloc (size, fill, encoding) {
            assertSize(size)
            if (size <= 0) {
              return createBuffer(size)
            }
            if (fill !== undefined) {
              // Only pay attention to encoding if it's a string. This
              // prevents accidentally sending in a number that would
              // be interpretted as a start offset.
              return typeof encoding === 'string'
                ? createBuffer(size).fill(fill, encoding)
                : createBuffer(size).fill(fill)
            }
            return createBuffer(size)
          }

          /**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
          Buffer.alloc = function (size, fill, encoding) {
            return alloc(size, fill, encoding)
          }

          function allocUnsafe (size) {
            assertSize(size)
            return createBuffer(size < 0 ? 0 : checked(size) | 0)
          }

          /**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
          Buffer.allocUnsafe = function (size) {
            return allocUnsafe(size)
          }
          /**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
          Buffer.allocUnsafeSlow = function (size) {
            return allocUnsafe(size)
          }

          function fromString (string, encoding) {
            if (typeof encoding !== 'string' || encoding === '') {
              encoding = 'utf8'
            }

            if (!Buffer.isEncoding(encoding)) {
              throw new TypeError('Unknown encoding: ' + encoding)
            }

            const length = byteLength(string, encoding) | 0
            let buf = createBuffer(length)

            const actual = buf.write(string, encoding)

            if (actual !== length) {
              // Writing a hex string, for example, that contains invalid characters will
              // cause everything after the first invalid character to be ignored. (e.g.
              // 'abxxcd' will be treated as 'ab')
              buf = buf.slice(0, actual)
            }

            return buf
          }

          function fromArrayLike (array) {
            const length = array.length < 0 ? 0 : checked(array.length) | 0
            const buf = createBuffer(length)
            for (let i = 0; i < length; i += 1) {
              buf[i] = array[i] & 255
            }
            return buf
          }

          function fromArrayBuffer (array, byteOffset, length) {
            if (byteOffset < 0 || array.byteLength < byteOffset) {
              throw new RangeError('"offset" is outside of buffer bounds')
            }

            if (array.byteLength < byteOffset + (length || 0)) {
              throw new RangeError('"length" is outside of buffer bounds')
            }

            let buf
            if (byteOffset === undefined && length === undefined) {
              buf = new Uint8Array(array)
            } else if (length === undefined) {
              buf = new Uint8Array(array, byteOffset)
            } else {
              buf = new Uint8Array(array, byteOffset, length)
            }

            // Return an augmented `Uint8Array` instance
            buf.__proto__ = Buffer.prototype
            return buf
          }

          function fromObject (obj) {
            if (Buffer.isBuffer(obj)) {
              const len = checked(obj.length) | 0
              const buf = createBuffer(len)

              if (buf.length === 0) {
                return buf
              }

              obj.copy(buf, 0, 0, len)
              return buf
            }

            if (obj.length !== undefined) {
              if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
                return createBuffer(0)
              }
              return fromArrayLike(obj)
            }

            if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
              return fromArrayLike(obj.data)
            }
          }

          function checked (length) {
            // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
            // length is NaN (which is otherwise coerced to zero.)
            if (length >= K_MAX_LENGTH) {
              throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
            }
            return length | 0
          }

          function SlowBuffer (length) {
            if (+length != length) { // eslint-disable-line eqeqeq
              length = 0
            }
            return Buffer.alloc(+length)
          }

          Buffer.isBuffer = function isBuffer (b) {
            return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
          }

          Buffer.compare = function compare (a, b) {
            if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
            if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
            if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
              throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
              )
            }

            if (a === b) return 0

            let x = a.length
            let y = b.length

            for (let i = 0, len = Math.min(x, y); i < len; ++i) {
              if (a[i] !== b[i]) {
                x = a[i]
                y = b[i]
                break
              }
            }

            if (x < y) return -1
            if (y < x) return 1
            return 0
          }

          Buffer.isEncoding = function isEncoding (encoding) {
            switch (String(encoding).toLowerCase()) {
              case 'hex':
              case 'utf8':
              case 'utf-8':
              case 'ascii':
              case 'latin1':
              case 'binary':
              case 'base64':
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return true
              default:
                return false
            }
          }

          Buffer.concat = function concat (list, length) {
            if (!Array.isArray(list)) {
              throw new TypeError('"list" argument must be an Array of Buffers')
            }

            if (list.length === 0) {
              return Buffer.alloc(0)
            }

            let i
            if (length === undefined) {
              length = 0
              for (i = 0; i < list.length; ++i) {
                length += list[i].length
              }
            }

            const buffer = Buffer.allocUnsafe(length)
            let pos = 0
            for (i = 0; i < list.length; ++i) {
              let buf = list[i]
              if (isInstance(buf, Uint8Array)) {
                buf = Buffer.from(buf)
              }
              if (!Buffer.isBuffer(buf)) {
                throw new TypeError('"list" argument must be an Array of Buffers')
              }
              buf.copy(buffer, pos)
              pos += buf.length
            }
            return buffer
          }

          function byteLength (string, encoding) {
            if (Buffer.isBuffer(string)) {
              return string.length
            }
            if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
              return string.byteLength
            }
            if (typeof string !== 'string') {
              throw new TypeError(
                'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
              )
            }

            const len = string.length
            const mustMatch = (arguments.length > 2 && arguments[2] === true)
            if (!mustMatch && len === 0) return 0

            // Use a for loop to avoid recursion
            let loweredCase = false
            for (;;) {
              switch (encoding) {
                case 'ascii':
                case 'latin1':
                case 'binary':
                  return len
                case 'utf8':
                case 'utf-8':
                  return utf8ToBytes(string).length
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return len * 2
                case 'hex':
                  return len >>> 1
                case 'base64':
                  return base64ToBytes(string).length
                default:
                  if (loweredCase) {
                    return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
                  }
                  encoding = ('' + encoding).toLowerCase()
                  loweredCase = true
              }
            }
          }
          Buffer.byteLength = byteLength

          function slowToString (encoding, start, end) {
            let loweredCase = false

            // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
            // property of a typed array.

            // This behaves neither like String nor Uint8Array in that we set start/end
            // to their upper/lower bounds if the value passed is out of range.
            // undefined is handled specially as per ECMA-262 6th Edition,
            // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
            if (start === undefined || start < 0) {
              start = 0
            }
            // Return early if start > this.length. Done here to prevent potential uint32
            // coercion fail below.
            if (start > this.length) {
              return ''
            }

            if (end === undefined || end > this.length) {
              end = this.length
            }

            if (end <= 0) {
              return ''
            }

            // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
            end >>>= 0
            start >>>= 0

            if (end <= start) {
              return ''
            }

            if (!encoding) encoding = 'utf8'

            while (true) {
              switch (encoding) {
                case 'hex':
                  return hexSlice(this, start, end)

                case 'utf8':
                case 'utf-8':
                  return utf8Slice(this, start, end)

                case 'ascii':
                  return asciiSlice(this, start, end)

                case 'latin1':
                case 'binary':
                  return latin1Slice(this, start, end)

                case 'base64':
                  return base64Slice(this, start, end)

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return utf16leSlice(this, start, end)

                default:
                  if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                  encoding = (encoding + '').toLowerCase()
                  loweredCase = true
              }
            }
          }

          // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
          // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
          // reliably in a browserify context because there could be multiple different
          // copies of the 'buffer' package in use. This method works even for Buffer
          // instances that were created from another copy of the `buffer` package.
          // See: https://github.com/feross/buffer/issues/154
          Buffer.prototype._isBuffer = true

          function swap (b, n, m) {
            const i = b[n]
            b[n] = b[m]
            b[m] = i
          }

          Buffer.prototype.swap16 = function swap16 () {
            const len = this.length
            if (len % 2 !== 0) {
              throw new RangeError('Buffer size must be a multiple of 16-bits')
            }
            for (let i = 0; i < len; i += 2) {
              swap(this, i, i + 1)
            }
            return this
          }

          Buffer.prototype.swap32 = function swap32 () {
            const len = this.length
            if (len % 4 !== 0) {
              throw new RangeError('Buffer size must be a multiple of 32-bits')
            }
            for (let i = 0; i < len; i += 4) {
              swap(this, i, i + 3)
              swap(this, i + 1, i + 2)
            }
            return this
          }

          Buffer.prototype.swap64 = function swap64 () {
            const len = this.length
            if (len % 8 !== 0) {
              throw new RangeError('Buffer size must be a multiple of 64-bits')
            }
            for (let i = 0; i < len; i += 8) {
              swap(this, i, i + 7)
              swap(this, i + 1, i + 6)
              swap(this, i + 2, i + 5)
              swap(this, i + 3, i + 4)
            }
            return this
          }

          Buffer.prototype.toString = function toString () {
            const length = this.length
            if (length === 0) return ''
            if (arguments.length === 0) return utf8Slice(this, 0, length)
            return slowToString.apply(this, arguments)
          }

          Buffer.prototype.toLocaleString = Buffer.prototype.toString

          Buffer.prototype.equals = function equals (b) {
            if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
            if (this === b) return true
            return Buffer.compare(this, b) === 0
          }

          Buffer.prototype.inspect = function inspect () {
            let str = ''
            const max = exports.INSPECT_MAX_BYTES
            str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
            if (this.length > max) str += ' ... '
            return '<Buffer ' + str + '>'
          }

          Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
            if (isInstance(target, Uint8Array)) {
              target = Buffer.from(target, target.offset, target.byteLength)
            }
            if (!Buffer.isBuffer(target)) {
              throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
              )
            }

            if (start === undefined) {
              start = 0
            }
            if (end === undefined) {
              end = target ? target.length : 0
            }
            if (thisStart === undefined) {
              thisStart = 0
            }
            if (thisEnd === undefined) {
              thisEnd = this.length
            }

            if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
              throw new RangeError('out of range index')
            }

            if (thisStart >= thisEnd && start >= end) {
              return 0
            }
            if (thisStart >= thisEnd) {
              return -1
            }
            if (start >= end) {
              return 1
            }

            start >>>= 0
            end >>>= 0
            thisStart >>>= 0
            thisEnd >>>= 0

            if (this === target) return 0

            let x = thisEnd - thisStart
            let y = end - start
            const len = Math.min(x, y)

            const thisCopy = this.slice(thisStart, thisEnd)
            const targetCopy = target.slice(start, end)

            for (let i = 0; i < len; ++i) {
              if (thisCopy[i] !== targetCopy[i]) {
                x = thisCopy[i]
                y = targetCopy[i]
                break
              }
            }

            if (x < y) return -1
            if (y < x) return 1
            return 0
          }

          // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
          // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
          //
          // Arguments:
          // - buffer - a Buffer to search
          // - val - a string, Buffer, or number
          // - byteOffset - an index into `buffer`; will be clamped to an int32
          // - encoding - an optional encoding, relevant is val is a string
          // - dir - true for indexOf, false for lastIndexOf
          function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
            // Empty buffer means no match
            if (buffer.length === 0) return -1

            // Normalize byteOffset
            if (typeof byteOffset === 'string') {
              encoding = byteOffset
              byteOffset = 0
            } else if (byteOffset > 0x7fffffff) {
              byteOffset = 0x7fffffff
            } else if (byteOffset < -0x80000000) {
              byteOffset = -0x80000000
            }
            byteOffset = +byteOffset // Coerce to Number.
            if (numberIsNaN(byteOffset)) {
              // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
              byteOffset = dir ? 0 : (buffer.length - 1)
            }

            // Normalize byteOffset: negative offsets start from the end of the buffer
            if (byteOffset < 0) byteOffset = buffer.length + byteOffset
            if (byteOffset >= buffer.length) {
              if (dir) return -1
              else byteOffset = buffer.length - 1
            } else if (byteOffset < 0) {
              if (dir) byteOffset = 0
              else return -1
            }

            // Normalize val
            if (typeof val === 'string') {
              val = Buffer.from(val, encoding)
            }

            // Finally, search either indexOf (if dir is true) or lastIndexOf
            if (Buffer.isBuffer(val)) {
              // Special case: looking for empty string/buffer always fails
              if (val.length === 0) {
                return -1
              }
              return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
            } else if (typeof val === 'number') {
              val = val & 0xFF // Search for a byte value [0-255]
              if (typeof Uint8Array.prototype.indexOf === 'function') {
                if (dir) {
                  return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                } else {
                  return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                }
              }
              return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
            }

            throw new TypeError('val must be string, number or Buffer')
          }

          function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
            let indexSize = 1
            let arrLength = arr.length
            let valLength = val.length

            if (encoding !== undefined) {
              encoding = String(encoding).toLowerCase()
              if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
                if (arr.length < 2 || val.length < 2) {
                  return -1
                }
                indexSize = 2
                arrLength /= 2
                valLength /= 2
                byteOffset /= 2
              }
            }

            function read (buf, i) {
              if (indexSize === 1) {
                return buf[i]
              } else {
                return buf.readUInt16BE(i * indexSize)
              }
            }

            let i
            if (dir) {
              let foundIndex = -1
              for (i = byteOffset; i < arrLength; i++) {
                if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                  if (foundIndex === -1) foundIndex = i
                  if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                } else {
                  if (foundIndex !== -1) i -= i - foundIndex
                  foundIndex = -1
                }
              }
            } else {
              if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
              for (i = byteOffset; i >= 0; i--) {
                let found = true
                for (let j = 0; j < valLength; j++) {
                  if (read(arr, i + j) !== read(val, j)) {
                    found = false
                    break
                  }
                }
                if (found) return i
              }
            }

            return -1
          }

          Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
            return this.indexOf(val, byteOffset, encoding) !== -1
          }

          Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
          }

          Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
            return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
          }

          function hexWrite (buf, string, offset, length) {
            offset = Number(offset) || 0
            const remaining = buf.length - offset
            if (!length) {
              length = remaining
            } else {
              length = Number(length)
              if (length > remaining) {
                length = remaining
              }
            }

            const strLen = string.length

            if (length > strLen / 2) {
              length = strLen / 2
            }
            for (var i = 0; i < length; ++i) {
              const parsed = parseInt(string.substr(i * 2, 2), 16)
              if (numberIsNaN(parsed)) return i
              buf[offset + i] = parsed
            }
            return i
          }

          function utf8Write (buf, string, offset, length) {
            return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
          }

          function asciiWrite (buf, string, offset, length) {
            return blitBuffer(asciiToBytes(string), buf, offset, length)
          }

          function latin1Write (buf, string, offset, length) {
            return asciiWrite(buf, string, offset, length)
          }

          function base64Write (buf, string, offset, length) {
            return blitBuffer(base64ToBytes(string), buf, offset, length)
          }

          function ucs2Write (buf, string, offset, length) {
            return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
          }

          Buffer.prototype.write = function write (string, offset, length, encoding) {
            // Buffer#write(string)
            if (offset === undefined) {
              encoding = 'utf8'
              length = this.length
              offset = 0
              // Buffer#write(string, encoding)
            } else if (length === undefined && typeof offset === 'string') {
              encoding = offset
              length = this.length
              offset = 0
              // Buffer#write(string, offset[, length][, encoding])
            } else if (isFinite(offset)) {
              offset = offset >>> 0
              if (isFinite(length)) {
                length = length >>> 0
                if (encoding === undefined) encoding = 'utf8'
              } else {
                encoding = length
                length = undefined
              }
            } else {
              throw new Error(
                'Buffer.write(string, encoding, offset[, length]) is no longer supported'
              )
            }

            const remaining = this.length - offset
            if (length === undefined || length > remaining) length = remaining

            if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
              throw new RangeError('Attempt to write outside buffer bounds')
            }

            if (!encoding) encoding = 'utf8'

            let loweredCase = false
            for (;;) {
              switch (encoding) {
                case 'hex':
                  return hexWrite(this, string, offset, length)

                case 'utf8':
                case 'utf-8':
                  return utf8Write(this, string, offset, length)

                case 'ascii':
                  return asciiWrite(this, string, offset, length)

                case 'latin1':
                case 'binary':
                  return latin1Write(this, string, offset, length)

                case 'base64':
                  // Warning: maxLength not taken into account in base64Write
                  return base64Write(this, string, offset, length)

                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return ucs2Write(this, string, offset, length)

                default:
                  if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                  encoding = ('' + encoding).toLowerCase()
                  loweredCase = true
              }
            }
          }

          Buffer.prototype.toJSON = function toJSON () {
            return {
              type: 'Buffer',
              data: Array.prototype.slice.call(this._arr || this, 0)
            }
          }

          function base64Slice (buf, start, end) {
            if (start === 0 && end === buf.length) {
              return base64.fromByteArray(buf)
            } else {
              return base64.fromByteArray(buf.slice(start, end))
            }
          }

          function utf8Slice (buf, start, end) {
            end = Math.min(buf.length, end)
            const res = []

            let i = start
            while (i < end) {
              const firstByte = buf[i]
              let codePoint = null
              let bytesPerSequence = (firstByte > 0xEF)
                ? 4
                : (firstByte > 0xDF)
                    ? 3
                    : (firstByte > 0xBF)
                        ? 2
                        : 1

              if (i + bytesPerSequence <= end) {
                var secondByte, thirdByte, fourthByte, tempCodePoint

                switch (bytesPerSequence) {
                  case 1:
                    if (firstByte < 0x80) {
                      codePoint = firstByte
                    }
                    break
                  case 2:
                    secondByte = buf[i + 1]
                    if ((secondByte & 0xC0) === 0x80) {
                      tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                      if (tempCodePoint > 0x7F) {
                        codePoint = tempCodePoint
                      }
                    }
                    break
                  case 3:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                      tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                      if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                        codePoint = tempCodePoint
                      }
                    }
                    break
                  case 4:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    fourthByte = buf[i + 3]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                      tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                      if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                        codePoint = tempCodePoint
                      }
                    }
                }
              }

              if (codePoint === null) {
                // we did not generate a valid codePoint so insert a
                // replacement char (U+FFFD) and advance only 1 byte
                codePoint = 0xFFFD
                bytesPerSequence = 1
              } else if (codePoint > 0xFFFF) {
                // encode to utf16 (surrogate pair dance)
                codePoint -= 0x10000
                res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                codePoint = 0xDC00 | codePoint & 0x3FF
              }

              res.push(codePoint)
              i += bytesPerSequence
            }

            return decodeCodePointsArray(res)
          }

          // Based on http://stackoverflow.com/a/22747272/680742, the browser with
          // the lowest limit is Chrome, with 0x10000 args.
          // We go 1 magnitude less, for safety
          const MAX_ARGUMENTS_LENGTH = 0x1000

          function decodeCodePointsArray (codePoints) {
            const len = codePoints.length
            if (len <= MAX_ARGUMENTS_LENGTH) {
              return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
            }

            // Decode in chunks to avoid "call stack size exceeded".
            let res = ''
            let i = 0
            while (i < len) {
              res += String.fromCharCode.apply(
                String,
                codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
              )
            }
            return res
          }

          function asciiSlice (buf, start, end) {
            let ret = ''
            end = Math.min(buf.length, end)

            for (let i = start; i < end; ++i) {
              ret += String.fromCharCode(buf[i] & 0x7F)
            }
            return ret
          }

          function latin1Slice (buf, start, end) {
            let ret = ''
            end = Math.min(buf.length, end)

            for (let i = start; i < end; ++i) {
              ret += String.fromCharCode(buf[i])
            }
            return ret
          }

          function hexSlice (buf, start, end) {
            const len = buf.length

            if (!start || start < 0) start = 0
            if (!end || end < 0 || end > len) end = len

            let out = ''
            for (let i = start; i < end; ++i) {
              out += toHex(buf[i])
            }
            return out
          }

          function utf16leSlice (buf, start, end) {
            const bytes = buf.slice(start, end)
            let res = ''
            for (let i = 0; i < bytes.length; i += 2) {
              res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
            }
            return res
          }

          Buffer.prototype.slice = function slice (start, end) {
            const len = this.length
            start = ~~start
            end = end === undefined ? len : ~~end

            if (start < 0) {
              start += len
              if (start < 0) start = 0
            } else if (start > len) {
              start = len
            }

            if (end < 0) {
              end += len
              if (end < 0) end = 0
            } else if (end > len) {
              end = len
            }

            if (end < start) end = start

            const newBuf = this.subarray(start, end)
            // Return an augmented `Uint8Array` instance
            newBuf.__proto__ = Buffer.prototype
            return newBuf
          }

          /*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
          function checkOffset (offset, ext, length) {
            if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
            if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
          }

          Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) checkOffset(offset, byteLength, this.length)

            let val = this[offset]
            let mul = 1
            let i = 0
            while (++i < byteLength && (mul *= 0x100)) {
              val += this[offset + i] * mul
            }

            return val
          }

          Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) {
              checkOffset(offset, byteLength, this.length)
            }

            let val = this[offset + --byteLength]
            let mul = 1
            while (byteLength > 0 && (mul *= 0x100)) {
              val += this[offset + --byteLength] * mul
            }

            return val
          }

          Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 1, this.length)
            return this[offset]
          }

          Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 2, this.length)
            return this[offset] | (this[offset + 1] << 8)
          }

          Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 2, this.length)
            return (this[offset] << 8) | this[offset + 1]
          }

          Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)

            return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
          }

          Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)

            return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
          }

          Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) checkOffset(offset, byteLength, this.length)

            let val = this[offset]
            let mul = 1
            let i = 0
            while (++i < byteLength && (mul *= 0x100)) {
              val += this[offset + i] * mul
            }
            mul *= 0x80

            if (val >= mul) val -= Math.pow(2, 8 * byteLength)

            return val
          }

          Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) checkOffset(offset, byteLength, this.length)

            let i = byteLength
            let mul = 1
            let val = this[offset + --i]
            while (i > 0 && (mul *= 0x100)) {
              val += this[offset + --i] * mul
            }
            mul *= 0x80

            if (val >= mul) val -= Math.pow(2, 8 * byteLength)

            return val
          }

          Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 1, this.length)
            if (!(this[offset] & 0x80)) return (this[offset])
            return ((0xff - this[offset] + 1) * -1)
          }

          Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 2, this.length)
            const val = this[offset] | (this[offset + 1] << 8)
            return (val & 0x8000) ? val | 0xFFFF0000 : val
          }

          Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 2, this.length)
            const val = this[offset + 1] | (this[offset] << 8)
            return (val & 0x8000) ? val | 0xFFFF0000 : val
          }

          Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)

            return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
          }

          Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)

            return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
          }

          Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)
            return ieee754.read(this, offset, true, 23, 4)
          }

          Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 4, this.length)
            return ieee754.read(this, offset, false, 23, 4)
          }

          Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 8, this.length)
            return ieee754.read(this, offset, true, 52, 8)
          }

          Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
            offset = offset >>> 0
            if (!noAssert) checkOffset(offset, 8, this.length)
            return ieee754.read(this, offset, false, 52, 8)
          }

          function checkInt (buf, value, offset, ext, max, min) {
            if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
            if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
            if (offset + ext > buf.length) throw new RangeError('Index out of range')
          }

          Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) {
              const maxBytes = Math.pow(2, 8 * byteLength) - 1
              checkInt(this, value, offset, byteLength, maxBytes, 0)
            }

            let mul = 1
            let i = 0
            this[offset] = value & 0xFF
            while (++i < byteLength && (mul *= 0x100)) {
              this[offset + i] = (value / mul) & 0xFF
            }

            return offset + byteLength
          }

          Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            byteLength = byteLength >>> 0
            if (!noAssert) {
              const maxBytes = Math.pow(2, 8 * byteLength) - 1
              checkInt(this, value, offset, byteLength, maxBytes, 0)
            }

            let i = byteLength - 1
            let mul = 1
            this[offset + i] = value & 0xFF
            while (--i >= 0 && (mul *= 0x100)) {
              this[offset + i] = (value / mul) & 0xFF
            }

            return offset + byteLength
          }

          Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
            this[offset] = (value & 0xff)
            return offset + 1
          }

          Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            return offset + 2
          }

          Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
            return offset + 2
          }

          Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
            this[offset + 3] = (value >>> 24)
            this[offset + 2] = (value >>> 16)
            this[offset + 1] = (value >>> 8)
            this[offset] = (value & 0xff)
            return offset + 4
          }

          Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
            return offset + 4
          }

          Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              const limit = Math.pow(2, (8 * byteLength) - 1)

              checkInt(this, value, offset, byteLength, limit - 1, -limit)
            }

            let i = 0
            let mul = 1
            let sub = 0
            this[offset] = value & 0xFF
            while (++i < byteLength && (mul *= 0x100)) {
              if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                sub = 1
              }
              this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
            }

            return offset + byteLength
          }

          Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              const limit = Math.pow(2, (8 * byteLength) - 1)

              checkInt(this, value, offset, byteLength, limit - 1, -limit)
            }

            let i = byteLength - 1
            let mul = 1
            let sub = 0
            this[offset + i] = value & 0xFF
            while (--i >= 0 && (mul *= 0x100)) {
              if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                sub = 1
              }
              this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
            }

            return offset + byteLength
          }

          Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
            if (value < 0) value = 0xff + value + 1
            this[offset] = (value & 0xff)
            return offset + 1
          }

          Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            return offset + 2
          }

          Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
            this[offset] = (value >>> 8)
            this[offset + 1] = (value & 0xff)
            return offset + 2
          }

          Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
            this[offset] = (value & 0xff)
            this[offset + 1] = (value >>> 8)
            this[offset + 2] = (value >>> 16)
            this[offset + 3] = (value >>> 24)
            return offset + 4
          }

          Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
            if (value < 0) value = 0xffffffff + value + 1
            this[offset] = (value >>> 24)
            this[offset + 1] = (value >>> 16)
            this[offset + 2] = (value >>> 8)
            this[offset + 3] = (value & 0xff)
            return offset + 4
          }

          function checkIEEE754 (buf, value, offset, ext, max, min) {
            if (offset + ext > buf.length) throw new RangeError('Index out of range')
            if (offset < 0) throw new RangeError('Index out of range')
          }

          function writeFloat (buf, value, offset, littleEndian, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
            }
            ieee754.write(buf, value, offset, littleEndian, 23, 4)
            return offset + 4
          }

          Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
            return writeFloat(this, value, offset, true, noAssert)
          }

          Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
            return writeFloat(this, value, offset, false, noAssert)
          }

          function writeDouble (buf, value, offset, littleEndian, noAssert) {
            value = +value
            offset = offset >>> 0
            if (!noAssert) {
              checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
            }
            ieee754.write(buf, value, offset, littleEndian, 52, 8)
            return offset + 8
          }

          Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
            return writeDouble(this, value, offset, true, noAssert)
          }

          Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
            return writeDouble(this, value, offset, false, noAssert)
          }

          // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
          Buffer.prototype.copy = function copy (target, targetStart, start, end) {
            if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
            if (!start) start = 0
            if (!end && end !== 0) end = this.length
            if (targetStart >= target.length) targetStart = target.length
            if (!targetStart) targetStart = 0
            if (end > 0 && end < start) end = start

            // Copy 0 bytes; we're done
            if (end === start) return 0
            if (target.length === 0 || this.length === 0) return 0

            // Fatal error conditions
            if (targetStart < 0) {
              throw new RangeError('targetStart out of bounds')
            }
            if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
            if (end < 0) throw new RangeError('sourceEnd out of bounds')

            // Are we oob?
            if (end > this.length) end = this.length
            if (target.length - targetStart < end - start) {
              end = target.length - targetStart + start
            }

            const len = end - start

            if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
              // Use built-in when available, missing from IE11
              this.copyWithin(targetStart, start, end)
            } else if (this === target && start < targetStart && targetStart < end) {
              // descending copy from end
              for (let i = len - 1; i >= 0; --i) {
                target[i + targetStart] = this[i + start]
              }
            } else {
              Uint8Array.prototype.set.call(
                target,
                this.subarray(start, end),
                targetStart
              )
            }

            return len
          }

          // Usage:
          //    buffer.fill(number[, offset[, end]])
          //    buffer.fill(buffer[, offset[, end]])
          //    buffer.fill(string[, offset[, end]][, encoding])
          Buffer.prototype.fill = function fill (val, start, end, encoding) {
            // Handle string cases:
            if (typeof val === 'string') {
              if (typeof start === 'string') {
                encoding = start
                start = 0
                end = this.length
              } else if (typeof end === 'string') {
                encoding = end
                end = this.length
              }
              if (encoding !== undefined && typeof encoding !== 'string') {
                throw new TypeError('encoding must be a string')
              }
              if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                throw new TypeError('Unknown encoding: ' + encoding)
              }
              if (val.length === 1) {
                const code = val.charCodeAt(0)
                if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
                  // Fast path: If `val` fits into a single byte, use that numeric value.
                  val = code
                }
              }
            } else if (typeof val === 'number') {
              val = val & 255
            }

            // Invalid ranges are not set to a default, so can range check early.
            if (start < 0 || this.length < start || this.length < end) {
              throw new RangeError('Out of range index')
            }

            if (end <= start) {
              return this
            }

            start = start >>> 0
            end = end === undefined ? this.length : end >>> 0

            if (!val) val = 0

            let i
            if (typeof val === 'number') {
              for (i = start; i < end; ++i) {
                this[i] = val
              }
            } else {
              const bytes = Buffer.isBuffer(val)
                ? val
                : Buffer.from(val, encoding)
              const len = bytes.length
              if (len === 0) {
                throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
              }
              for (i = 0; i < end - start; ++i) {
                this[i + start] = bytes[i % len]
              }
            }

            return this
          }

          // HELPER FUNCTIONS
          // ================

          const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

          function base64clean (str) {
            // Node takes equal signs as end of the Base64 encoding
            str = str.split('=')[0]
            // Node strips out invalid characters like \n and \t from the string, base64-js does not
            str = str.trim().replace(INVALID_BASE64_RE, '')
            // Node converts strings with length < 2 to ''
            if (str.length < 2) return ''
            // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
            while (str.length % 4 !== 0) {
              str = str + '='
            }
            return str
          }

          function toHex (n) {
            if (n < 16) return '0' + n.toString(16)
            return n.toString(16)
          }

          function utf8ToBytes (string, units) {
            units = units || Infinity
            let codePoint
            const length = string.length
            let leadSurrogate = null
            const bytes = []

            for (let i = 0; i < length; ++i) {
              codePoint = string.charCodeAt(i)

              // is surrogate component
              if (codePoint > 0xD7FF && codePoint < 0xE000) {
                // last char was a lead
                if (!leadSurrogate) {
                  // no lead yet
                  if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                  } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                  }

                  // valid lead
                  leadSurrogate = codePoint

                  continue
                }

                // 2 leads in a row
                if (codePoint < 0xDC00) {
                  if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                  leadSurrogate = codePoint
                  continue
                }

                // valid surrogate pair
                codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
              } else if (leadSurrogate) {
                // valid bmp char, but last char was a lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              }

              leadSurrogate = null

              // encode utf8
              if (codePoint < 0x80) {
                if ((units -= 1) < 0) break
                bytes.push(codePoint)
              } else if (codePoint < 0x800) {
                if ((units -= 2) < 0) break
                bytes.push(
                  codePoint >> 0x6 | 0xC0,
                  codePoint & 0x3F | 0x80
                )
              } else if (codePoint < 0x10000) {
                if ((units -= 3) < 0) break
                bytes.push(
                  codePoint >> 0xC | 0xE0,
                  codePoint >> 0x6 & 0x3F | 0x80,
                  codePoint & 0x3F | 0x80
                )
              } else if (codePoint < 0x110000) {
                if ((units -= 4) < 0) break
                bytes.push(
                  codePoint >> 0x12 | 0xF0,
                  codePoint >> 0xC & 0x3F | 0x80,
                  codePoint >> 0x6 & 0x3F | 0x80,
                  codePoint & 0x3F | 0x80
                )
              } else {
                throw new Error('Invalid code point')
              }
            }

            return bytes
          }

          function asciiToBytes (str) {
            const byteArray = []
            for (let i = 0; i < str.length; ++i) {
              // Node's code seems to be doing this and not & 0x7F..
              byteArray.push(str.charCodeAt(i) & 0xFF)
            }
            return byteArray
          }

          function utf16leToBytes (str, units) {
            let c, hi, lo
            const byteArray = []
            for (let i = 0; i < str.length; ++i) {
              if ((units -= 2) < 0) break

              c = str.charCodeAt(i)
              hi = c >> 8
              lo = c % 256
              byteArray.push(lo)
              byteArray.push(hi)
            }

            return byteArray
          }

          function base64ToBytes (str) {
            return base64.toByteArray(base64clean(str))
          }

          function blitBuffer (src, dst, offset, length) {
            for (var i = 0; i < length; ++i) {
              if ((i + offset >= dst.length) || (i >= src.length)) break
              dst[i + offset] = src[i]
            }
            return i
          }

          // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
          // the `instanceof` check but they should be treated as of that type.
          // See: https://github.com/feross/buffer/issues/166
          function isInstance (obj, type) {
            return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
          }
          function numberIsNaN (obj) {
            // For IE11 support
            return obj !== obj // eslint-disable-line no-self-compare
          }
        }).call(this)
      }).call(this, require('buffer').Buffer)
    }, { 'base64-js': 12, buffer: 16, ieee754: 32 }],
    17: [function (require, module, exports) {
      'use strict'

      const GetIntrinsic = require('get-intrinsic')

      const callBind = require('./')

      const $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'))

      module.exports = function callBoundIntrinsic (name, allowMissing) {
        const intrinsic = GetIntrinsic(name, !!allowMissing)
        if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
          return callBind(intrinsic)
        }
        return intrinsic
      }
    }, { './': 18, 'get-intrinsic': 24 }],
    18: [function (require, module, exports) {
      'use strict'

      const bind = require('function-bind')
      const GetIntrinsic = require('get-intrinsic')
      const setFunctionLength = require('set-function-length')

      const $TypeError = GetIntrinsic('%TypeError%')
      const $apply = GetIntrinsic('%Function.prototype.apply%')
      const $call = GetIntrinsic('%Function.prototype.call%')
      const $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply)

      let $defineProperty = GetIntrinsic('%Object.defineProperty%', true)
      const $max = GetIntrinsic('%Math.max%')

      if ($defineProperty) {
        try {
          $defineProperty({}, 'a', { value: 1 })
        } catch (e) {
          // IE 8 has a broken defineProperty
          $defineProperty = null
        }
      }

      module.exports = function callBind (originalFunction) {
        if (typeof originalFunction !== 'function') {
          throw new $TypeError('a function is required')
        }
        const func = $reflectApply(bind, $call, arguments)
        return setFunctionLength(
          func,
          1 + $max(0, originalFunction.length - (arguments.length - 1)),
          true
        )
      }

      const applyBind = function applyBind () {
        return $reflectApply(bind, $apply, arguments)
      }

      if ($defineProperty) {
        $defineProperty(module.exports, 'apply', { value: applyBind })
      } else {
        module.exports.apply = applyBind
      }
    }, { 'function-bind': 23, 'get-intrinsic': 24, 'set-function-length': 72 }],
    19: [function (require, module, exports) {
      'use strict'

      const hasPropertyDescriptors = require('has-property-descriptors')()

      const GetIntrinsic = require('get-intrinsic')

      let $defineProperty = hasPropertyDescriptors && GetIntrinsic('%Object.defineProperty%', true)
      if ($defineProperty) {
        try {
          $defineProperty({}, 'a', { value: 1 })
        } catch (e) {
          // IE 8 has a broken defineProperty
          $defineProperty = false
        }
      }

      const $SyntaxError = GetIntrinsic('%SyntaxError%')
      const $TypeError = GetIntrinsic('%TypeError%')

      const gopd = require('gopd')

      /** @type {(obj: Record<PropertyKey, unknown>, property: PropertyKey, value: unknown, nonEnumerable?: boolean | null, nonWritable?: boolean | null, nonConfigurable?: boolean | null, loose?: boolean) => void} */
      module.exports = function defineDataProperty (
        obj,
        property,
        value
      ) {
        if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
          throw new $TypeError('`obj` must be an object or a function`')
        }
        if (typeof property !== 'string' && typeof property !== 'symbol') {
          throw new $TypeError('`property` must be a string or a symbol`')
        }
        if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
          throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null')
        }
        if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
          throw new $TypeError('`nonWritable`, if provided, must be a boolean or null')
        }
        if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
          throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null')
        }
        if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
          throw new $TypeError('`loose`, if provided, must be a boolean')
        }

        const nonEnumerable = arguments.length > 3 ? arguments[3] : null
        const nonWritable = arguments.length > 4 ? arguments[4] : null
        const nonConfigurable = arguments.length > 5 ? arguments[5] : null
        const loose = arguments.length > 6 ? arguments[6] : false

        /* @type {false | TypedPropertyDescriptor<unknown>} */
        const desc = !!gopd && gopd(obj, property)

        if ($defineProperty) {
          $defineProperty(obj, property, {
            configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
            enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
            value,
            writable: nonWritable === null && desc ? desc.writable : !nonWritable
          })
        } else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
          // must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
          obj[property] = value // eslint-disable-line no-param-reassign
        } else {
          throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.')
        }
      }
    }, { 'get-intrinsic': 24, gopd: 25, 'has-property-descriptors': 26 }],
    20: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

      'use strict'

      const R = typeof Reflect === 'object' ? Reflect : null
      const ReflectApply = R && typeof R.apply === 'function'
        ? R.apply
        : function ReflectApply (target, receiver, args) {
          return Function.prototype.apply.call(target, receiver, args)
        }

      let ReflectOwnKeys
      if (R && typeof R.ownKeys === 'function') {
        ReflectOwnKeys = R.ownKeys
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys (target) {
          return Object.getOwnPropertyNames(target)
            .concat(Object.getOwnPropertySymbols(target))
        }
      } else {
        ReflectOwnKeys = function ReflectOwnKeys (target) {
          return Object.getOwnPropertyNames(target)
        }
      }

      function ProcessEmitWarning (warning) {
        if (console && console.warn) console.warn(warning)
      }

      const NumberIsNaN = Number.isNaN || function NumberIsNaN (value) {
        return value !== value
      }

      function EventEmitter () {
        EventEmitter.init.call(this)
      }
      module.exports = EventEmitter
      module.exports.once = once

      // Backwards-compat with node 0.10.x
      EventEmitter.EventEmitter = EventEmitter

      EventEmitter.prototype._events = undefined
      EventEmitter.prototype._eventsCount = 0
      EventEmitter.prototype._maxListeners = undefined

      // By default EventEmitters will print a warning if more than 10 listeners are
      // added to it. This is a useful default which helps finding memory leaks.
      let defaultMaxListeners = 10

      function checkListener (listener) {
        if (typeof listener !== 'function') {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener)
        }
      }

      Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
        enumerable: true,
        get: function () {
          return defaultMaxListeners
        },
        set: function (arg) {
          if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.')
          }
          defaultMaxListeners = arg
        }
      })

      EventEmitter.init = function () {
        if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
          this._events = Object.create(null)
          this._eventsCount = 0
        }

        this._maxListeners = this._maxListeners || undefined
      }

      // Obviously not all Emitters should be limited to 10. This function allows
      // that to be increased. Set to zero for unlimited.
      EventEmitter.prototype.setMaxListeners = function setMaxListeners (n) {
        if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.')
        }
        this._maxListeners = n
        return this
      }

      function _getMaxListeners (that) {
        if (that._maxListeners === undefined) { return EventEmitter.defaultMaxListeners }
        return that._maxListeners
      }

      EventEmitter.prototype.getMaxListeners = function getMaxListeners () {
        return _getMaxListeners(this)
      }

      EventEmitter.prototype.emit = function emit (type) {
        const args = []
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
        let doError = (type === 'error')

        const events = this._events
        if (events !== undefined) { doError = (doError && events.error === undefined) } else if (!doError) { return false }

        // If there is no 'error' event listener then throw.
        if (doError) {
          let er
          if (args.length > 0) { er = args[0] }
          if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
            throw er // Unhandled 'error' event
          }
          // At least give some kind of context to the user
          const err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''))
          err.context = er
          throw err // Unhandled 'error' event
        }

        const handler = events[type]

        if (handler === undefined) { return false }

        if (typeof handler === 'function') {
          ReflectApply(handler, this, args)
        } else {
          const len = handler.length
          const listeners = arrayClone(handler, len)
          for (var i = 0; i < len; ++i) { ReflectApply(listeners[i], this, args) }
        }

        return true
      }

      function _addListener (target, type, listener, prepend) {
        let m
        let events
        let existing

        checkListener(listener)

        events = target._events
        if (events === undefined) {
          events = target._events = Object.create(null)
          target._eventsCount = 0
        } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
          if (events.newListener !== undefined) {
            target.emit('newListener', type,
              listener.listener ? listener.listener : listener)

            // Re-assign `events` because a newListener handler could have caused the
            // this._events to be assigned to a new object
            events = target._events
          }
          existing = events[type]
        }

        if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
          existing = events[type] = listener
          ++target._eventsCount
        } else {
          if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
            existing = events[type] =
        prepend ? [listener, existing] : [existing, listener]
          // If we've already got an array, just append.
          } else if (prepend) {
            existing.unshift(listener)
          } else {
            existing.push(listener)
          }

          // Check for listener leak
          m = _getMaxListeners(target)
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true
            // No error code for this since it is a Warning
            // eslint-disable-next-line no-restricted-syntax
            const w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit')
            w.name = 'MaxListenersExceededWarning'
            w.emitter = target
            w.type = type
            w.count = existing.length
            ProcessEmitWarning(w)
          }
        }

        return target
      }

      EventEmitter.prototype.addListener = function addListener (type, listener) {
        return _addListener(this, type, listener, false)
      }

      EventEmitter.prototype.on = EventEmitter.prototype.addListener

      EventEmitter.prototype.prependListener =
    function prependListener (type, listener) {
      return _addListener(this, type, listener, true)
    }

      function onceWrapper () {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn)
          this.fired = true
          if (arguments.length === 0) { return this.listener.call(this.target) }
          return this.listener.apply(this.target, arguments)
        }
      }

      function _onceWrap (target, type, listener) {
        const state = { fired: false, wrapFn: undefined, target, type, listener }
        const wrapped = onceWrapper.bind(state)
        wrapped.listener = listener
        state.wrapFn = wrapped
        return wrapped
      }

      EventEmitter.prototype.once = function once (type, listener) {
        checkListener(listener)
        this.on(type, _onceWrap(this, type, listener))
        return this
      }

      EventEmitter.prototype.prependOnceListener =
    function prependOnceListener (type, listener) {
      checkListener(listener)
      this.prependListener(type, _onceWrap(this, type, listener))
      return this
    }

      // Emits a 'removeListener' event if and only if the listener was removed.
      EventEmitter.prototype.removeListener =
    function removeListener (type, listener) {
      let list, events, position, i, originalListener

      checkListener(listener)

      events = this._events
      if (events === undefined) { return this }

      list = events[type]
      if (list === undefined) { return this }

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) { this._events = Object.create(null) } else {
          delete events[type]
          if (events.removeListener) { this.emit('removeListener', type, list.listener || listener) }
        }
      } else if (typeof list !== 'function') {
        position = -1

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener
            position = i
            break
          }
        }

        if (position < 0) { return this }

        if (position === 0) { list.shift() } else {
          spliceOne(list, position)
        }

        if (list.length === 1) { events[type] = list[0] }

        if (events.removeListener !== undefined) { this.emit('removeListener', type, originalListener || listener) }
      }

      return this
    }

      EventEmitter.prototype.off = EventEmitter.prototype.removeListener

      EventEmitter.prototype.removeAllListeners =
    function removeAllListeners (type) {
      let listeners, events, i

      events = this._events
      if (events === undefined) { return this }

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null)
          this._eventsCount = 0
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0) { this._events = Object.create(null) } else { delete events[type] }
        }
        return this
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        const keys = Object.keys(events)
        let key
        for (i = 0; i < keys.length; ++i) {
          key = keys[i]
          if (key === 'removeListener') continue
          this.removeAllListeners(key)
        }
        this.removeAllListeners('removeListener')
        this._events = Object.create(null)
        this._eventsCount = 0
        return this
      }

      listeners = events[type]

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners)
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i])
        }
      }

      return this
    }

      function _listeners (target, type, unwrap) {
        const events = target._events

        if (events === undefined) { return [] }

        const evlistener = events[type]
        if (evlistener === undefined) { return [] }

        if (typeof evlistener === 'function') { return unwrap ? [evlistener.listener || evlistener] : [evlistener] }

        return unwrap
          ? unwrapListeners(evlistener)
          : arrayClone(evlistener, evlistener.length)
      }

      EventEmitter.prototype.listeners = function listeners (type) {
        return _listeners(this, type, true)
      }

      EventEmitter.prototype.rawListeners = function rawListeners (type) {
        return _listeners(this, type, false)
      }

      EventEmitter.listenerCount = function (emitter, type) {
        if (typeof emitter.listenerCount === 'function') {
          return emitter.listenerCount(type)
        } else {
          return listenerCount.call(emitter, type)
        }
      }

      EventEmitter.prototype.listenerCount = listenerCount
      function listenerCount (type) {
        const events = this._events

        if (events !== undefined) {
          const evlistener = events[type]

          if (typeof evlistener === 'function') {
            return 1
          } else if (evlistener !== undefined) {
            return evlistener.length
          }
        }

        return 0
      }

      EventEmitter.prototype.eventNames = function eventNames () {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : []
      }

      function arrayClone (arr, n) {
        const copy = new Array(n)
        for (let i = 0; i < n; ++i) { copy[i] = arr[i] }
        return copy
      }

      function spliceOne (list, index) {
        for (; index + 1 < list.length; index++) { list[index] = list[index + 1] }
        list.pop()
      }

      function unwrapListeners (arr) {
        const ret = new Array(arr.length)
        for (let i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i]
        }
        return ret
      }

      function once (emitter, name) {
        return new Promise(function (resolve, reject) {
          function errorListener (err) {
            emitter.removeListener(name, resolver)
            reject(err)
          }

          function resolver () {
            if (typeof emitter.removeListener === 'function') {
              emitter.removeListener('error', errorListener)
            }
            resolve([].slice.call(arguments))
          };

          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true })
          if (name !== 'error') {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true })
          }
        })
      }

      function addErrorHandlerIfEventEmitter (emitter, handler, flags) {
        if (typeof emitter.on === 'function') {
          eventTargetAgnosticAddListener(emitter, 'error', handler, flags)
        }
      }

      function eventTargetAgnosticAddListener (emitter, name, listener, flags) {
        if (typeof emitter.on === 'function') {
          if (flags.once) {
            emitter.once(name, listener)
          } else {
            emitter.on(name, listener)
          }
        } else if (typeof emitter.addEventListener === 'function') {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen for `error` events here.
          emitter.addEventListener(name, function wrapListener (arg) {
          // IE does not have builtin `{ once: true }` support so we
          // have to do it manually.
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener)
            }
            listener(arg)
          })
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter)
        }
      }
    }, {}],
    21: [function (require, module, exports) {
      'use strict'

      const isCallable = require('is-callable')

      const toStr = Object.prototype.toString
      const hasOwnProperty = Object.prototype.hasOwnProperty

      const forEachArray = function forEachArray (array, iterator, receiver) {
        for (let i = 0, len = array.length; i < len; i++) {
          if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
              iterator(array[i], i, array)
            } else {
              iterator.call(receiver, array[i], i, array)
            }
          }
        }
      }

      const forEachString = function forEachString (string, iterator, receiver) {
        for (let i = 0, len = string.length; i < len; i++) {
          // no such thing as a sparse string.
          if (receiver == null) {
            iterator(string.charAt(i), i, string)
          } else {
            iterator.call(receiver, string.charAt(i), i, string)
          }
        }
      }

      const forEachObject = function forEachObject (object, iterator, receiver) {
        for (const k in object) {
          if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
              iterator(object[k], k, object)
            } else {
              iterator.call(receiver, object[k], k, object)
            }
          }
        }
      }

      const forEach = function forEach (list, iterator, thisArg) {
        if (!isCallable(iterator)) {
          throw new TypeError('iterator must be a function')
        }

        let receiver
        if (arguments.length >= 3) {
          receiver = thisArg
        }

        if (toStr.call(list) === '[object Array]') {
          forEachArray(list, iterator, receiver)
        } else if (typeof list === 'string') {
          forEachString(list, iterator, receiver)
        } else {
          forEachObject(list, iterator, receiver)
        }
      }

      module.exports = forEach
    }, { 'is-callable': 36 }],
    22: [function (require, module, exports) {
      'use strict'

      /* eslint no-invalid-this: 1 */

      const ERROR_MESSAGE = 'Function.prototype.bind called on incompatible '
      const toStr = Object.prototype.toString
      const max = Math.max
      const funcType = '[object Function]'

      const concatty = function concatty (a, b) {
        const arr = []

        for (let i = 0; i < a.length; i += 1) {
          arr[i] = a[i]
        }
        for (let j = 0; j < b.length; j += 1) {
          arr[j + a.length] = b[j]
        }

        return arr
      }

      const slicy = function slicy (arrLike, offset) {
        const arr = []
        for (let i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
          arr[j] = arrLike[i]
        }
        return arr
      }

      const joiny = function (arr, joiner) {
        let str = ''
        for (let i = 0; i < arr.length; i += 1) {
          str += arr[i]
          if (i + 1 < arr.length) {
            str += joiner
          }
        }
        return str
      }

      module.exports = function bind (that) {
        const target = this
        if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target)
        }
        const args = slicy(arguments, 1)

        let bound
        const binder = function () {
          if (this instanceof bound) {
            const result = target.apply(
              this,
              concatty(args, arguments)
            )
            if (Object(result) === result) {
              return result
            }
            return this
          }
          return target.apply(
            that,
            concatty(args, arguments)
          )
        }

        const boundLength = max(0, target.length - args.length)
        const boundArgs = []
        for (let i = 0; i < boundLength; i++) {
          boundArgs[i] = '$' + i
        }

        bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder)

        if (target.prototype) {
          const Empty = function Empty () {}
          Empty.prototype = target.prototype
          bound.prototype = new Empty()
          Empty.prototype = null
        }

        return bound
      }
    }, {}],
    23: [function (require, module, exports) {
      'use strict'

      const implementation = require('./implementation')

      module.exports = Function.prototype.bind || implementation
    }, { './implementation': 22 }],
    24: [function (require, module, exports) {
      'use strict'

      let undefined

      const $SyntaxError = SyntaxError
      const $Function = Function
      const $TypeError = TypeError

      // eslint-disable-next-line consistent-return
      const getEvalledConstructor = function (expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')()
        } catch (e) {}
      }

      let $gOPD = Object.getOwnPropertyDescriptor
      if ($gOPD) {
        try {
          $gOPD({}, '')
        } catch (e) {
          $gOPD = null // this is IE 8, which has a broken gOPD
        }
      }

      const throwTypeError = function () {
        throw new $TypeError()
      }
      const ThrowTypeError = $gOPD
        ? (function () {
            try {
              // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
              arguments.callee // IE 8 does not throw here
              return throwTypeError
            } catch (calleeThrows) {
              try {
                // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
                return $gOPD(arguments, 'callee').get
              } catch (gOPDthrows) {
                return throwTypeError
              }
            }
          }())
        : throwTypeError

      const hasSymbols = require('has-symbols')()
      const hasProto = require('has-proto')()

      const getProto = Object.getPrototypeOf || (
        hasProto
          ? function (x) { return x.__proto__ } // eslint-disable-line no-proto
          : null
      )

      const needsEval = {}

      const TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array)

      const INTRINSICS = {
        '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
        '%Array%': Array,
        '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
        '%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
        '%AsyncFromSyncIteratorPrototype%': undefined,
        '%AsyncFunction%': needsEval,
        '%AsyncGenerator%': needsEval,
        '%AsyncGeneratorFunction%': needsEval,
        '%AsyncIteratorPrototype%': needsEval,
        '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
        '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
        '%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
        '%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
        '%Boolean%': Boolean,
        '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
        '%Date%': Date,
        '%decodeURI%': decodeURI,
        '%decodeURIComponent%': decodeURIComponent,
        '%encodeURI%': encodeURI,
        '%encodeURIComponent%': encodeURIComponent,
        '%Error%': Error,
        '%eval%': eval, // eslint-disable-line no-eval
        '%EvalError%': EvalError,
        '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
        '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
        '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
        '%Function%': $Function,
        '%GeneratorFunction%': needsEval,
        '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
        '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
        '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
        '%isFinite%': isFinite,
        '%isNaN%': isNaN,
        '%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
        '%JSON%': typeof JSON === 'object' ? JSON : undefined,
        '%Map%': typeof Map === 'undefined' ? undefined : Map,
        '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
        '%Math%': Math,
        '%Number%': Number,
        '%Object%': Object,
        '%parseFloat%': parseFloat,
        '%parseInt%': parseInt,
        '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
        '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
        '%RangeError%': RangeError,
        '%ReferenceError%': ReferenceError,
        '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
        '%RegExp%': RegExp,
        '%Set%': typeof Set === 'undefined' ? undefined : Set,
        '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
        '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
        '%String%': String,
        '%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
        '%Symbol%': hasSymbols ? Symbol : undefined,
        '%SyntaxError%': $SyntaxError,
        '%ThrowTypeError%': ThrowTypeError,
        '%TypedArray%': TypedArray,
        '%TypeError%': $TypeError,
        '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
        '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
        '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
        '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
        '%URIError%': URIError,
        '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
        '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
        '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
      }

      if (getProto) {
        try {
          null.error // eslint-disable-line no-unused-expressions
        } catch (e) {
          // https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
          const errorProto = getProto(getProto(e))
          INTRINSICS['%Error.prototype%'] = errorProto
        }
      }

      const doEval = function doEval (name) {
        let value
        if (name === '%AsyncFunction%') {
          value = getEvalledConstructor('async function () {}')
        } else if (name === '%GeneratorFunction%') {
          value = getEvalledConstructor('function* () {}')
        } else if (name === '%AsyncGeneratorFunction%') {
          value = getEvalledConstructor('async function* () {}')
        } else if (name === '%AsyncGenerator%') {
          const fn = doEval('%AsyncGeneratorFunction%')
          if (fn) {
            value = fn.prototype
          }
        } else if (name === '%AsyncIteratorPrototype%') {
          const gen = doEval('%AsyncGenerator%')
          if (gen && getProto) {
            value = getProto(gen.prototype)
          }
        }

        INTRINSICS[name] = value

        return value
      }

      const LEGACY_ALIASES = {
        '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
        '%ArrayPrototype%': ['Array', 'prototype'],
        '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
        '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
        '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
        '%ArrayProto_values%': ['Array', 'prototype', 'values'],
        '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
        '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
        '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
        '%BooleanPrototype%': ['Boolean', 'prototype'],
        '%DataViewPrototype%': ['DataView', 'prototype'],
        '%DatePrototype%': ['Date', 'prototype'],
        '%ErrorPrototype%': ['Error', 'prototype'],
        '%EvalErrorPrototype%': ['EvalError', 'prototype'],
        '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
        '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
        '%FunctionPrototype%': ['Function', 'prototype'],
        '%Generator%': ['GeneratorFunction', 'prototype'],
        '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
        '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
        '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
        '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
        '%JSONParse%': ['JSON', 'parse'],
        '%JSONStringify%': ['JSON', 'stringify'],
        '%MapPrototype%': ['Map', 'prototype'],
        '%NumberPrototype%': ['Number', 'prototype'],
        '%ObjectPrototype%': ['Object', 'prototype'],
        '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
        '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
        '%PromisePrototype%': ['Promise', 'prototype'],
        '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
        '%Promise_all%': ['Promise', 'all'],
        '%Promise_reject%': ['Promise', 'reject'],
        '%Promise_resolve%': ['Promise', 'resolve'],
        '%RangeErrorPrototype%': ['RangeError', 'prototype'],
        '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
        '%RegExpPrototype%': ['RegExp', 'prototype'],
        '%SetPrototype%': ['Set', 'prototype'],
        '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
        '%StringPrototype%': ['String', 'prototype'],
        '%SymbolPrototype%': ['Symbol', 'prototype'],
        '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
        '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
        '%TypeErrorPrototype%': ['TypeError', 'prototype'],
        '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
        '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
        '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
        '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
        '%URIErrorPrototype%': ['URIError', 'prototype'],
        '%WeakMapPrototype%': ['WeakMap', 'prototype'],
        '%WeakSetPrototype%': ['WeakSet', 'prototype']
      }

      const bind = require('function-bind')
      const hasOwn = require('hasown')
      const $concat = bind.call(Function.call, Array.prototype.concat)
      const $spliceApply = bind.call(Function.apply, Array.prototype.splice)
      const $replace = bind.call(Function.call, String.prototype.replace)
      const $strSlice = bind.call(Function.call, String.prototype.slice)
      const $exec = bind.call(Function.call, RegExp.prototype.exec)

      /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
      const rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g
      const reEscapeChar = /\\(\\)?/g /** Used to match backslashes in property paths. */
      const stringToPath = function stringToPath (string) {
        const first = $strSlice(string, 0, 1)
        const last = $strSlice(string, -1)
        if (first === '%' && last !== '%') {
          throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`')
        } else if (last === '%' && first !== '%') {
          throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`')
        }
        const result = []
        $replace(string, rePropName, function (match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match
        })
        return result
      }
      /* end adaptation */

      const getBaseIntrinsic = function getBaseIntrinsic (name, allowMissing) {
        let intrinsicName = name
        let alias
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName]
          intrinsicName = '%' + alias[0] + '%'
        }

        if (hasOwn(INTRINSICS, intrinsicName)) {
          let value = INTRINSICS[intrinsicName]
          if (value === needsEval) {
            value = doEval(intrinsicName)
          }
          if (typeof value === 'undefined' && !allowMissing) {
            throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!')
          }

          return {
            alias,
            name: intrinsicName,
            value
          }
        }

        throw new $SyntaxError('intrinsic ' + name + ' does not exist!')
      }

      module.exports = function GetIntrinsic (name, allowMissing) {
        if (typeof name !== 'string' || name.length === 0) {
          throw new $TypeError('intrinsic name must be a non-empty string')
        }
        if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
          throw new $TypeError('"allowMissing" argument must be a boolean')
        }

        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name')
        }
        const parts = stringToPath(name)
        let intrinsicBaseName = parts.length > 0 ? parts[0] : ''

        const intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing)
        let intrinsicRealName = intrinsic.name
        let value = intrinsic.value
        let skipFurtherCaching = false

        const alias = intrinsic.alias
        if (alias) {
          intrinsicBaseName = alias[0]
          $spliceApply(parts, $concat([0, 1], alias))
        }

        for (let i = 1, isOwn = true; i < parts.length; i += 1) {
          const part = parts[i]
          const first = $strSlice(part, 0, 1)
          const last = $strSlice(part, -1)
          if (
            (
              (first === '"' || first === "'" || first === '`') ||
				(last === '"' || last === "'" || last === '`')
            ) &&
			first !== last
          ) {
            throw new $SyntaxError('property names with quotes must have matching quotes')
          }
          if (part === 'constructor' || !isOwn) {
            skipFurtherCaching = true
          }

          intrinsicBaseName += '.' + part
          intrinsicRealName = '%' + intrinsicBaseName + '%'

          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName]
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.')
              }
              return void undefined
            }
            if ($gOPD && (i + 1) >= parts.length) {
              const desc = $gOPD(value, part)
              isOwn = !!desc

              // By convention, when a data property is converted to an accessor
              // property to emulate a data property that does not suffer from
              // the override mistake, that accessor's getter is marked with
              // an `originalValue` property. Here, when we detect this, we
              // uphold the illusion by pretending to see that original data
              // property, i.e., returning the value rather than the getter
              // itself.
              if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
                value = desc.get
              } else {
                value = value[part]
              }
            } else {
              isOwn = hasOwn(value, part)
              value = value[part]
            }

            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value
            }
          }
        }
        return value
      }
    }, { 'function-bind': 23, 'has-proto': 27, 'has-symbols': 28, hasown: 31 }],
    25: [function (require, module, exports) {
      'use strict'

      const GetIntrinsic = require('get-intrinsic')

      let $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true)

      if ($gOPD) {
        try {
          $gOPD([], 'length')
        } catch (e) {
          // IE 8 has a broken gOPD
          $gOPD = null
        }
      }

      module.exports = $gOPD
    }, { 'get-intrinsic': 24 }],
    26: [function (require, module, exports) {
      'use strict'

      const GetIntrinsic = require('get-intrinsic')

      const $defineProperty = GetIntrinsic('%Object.defineProperty%', true)

      const hasPropertyDescriptors = function hasPropertyDescriptors () {
        if ($defineProperty) {
          try {
            $defineProperty({}, 'a', { value: 1 })
            return true
          } catch (e) {
            // IE 8 has a broken defineProperty
            return false
          }
        }
        return false
      }

      hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug () {
        // node v0.6 has a bug where array lengths can be Set but not Defined
        if (!hasPropertyDescriptors()) {
          return null
        }
        try {
          return $defineProperty([], 'length', { value: 1 }).length !== 1
        } catch (e) {
          // In Firefox 4-22, defining length on an array throws an exception.
          return true
        }
      }

      module.exports = hasPropertyDescriptors
    }, { 'get-intrinsic': 24 }],
    27: [function (require, module, exports) {
      'use strict'

      const test = {
        foo: {}
      }

      const $Object = Object

      module.exports = function hasProto () {
        return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object)
      }
    }, {}],
    28: [function (require, module, exports) {
      'use strict'

      const origSymbol = typeof Symbol !== 'undefined' && Symbol
      const hasSymbolSham = require('./shams')

      module.exports = function hasNativeSymbols () {
        if (typeof origSymbol !== 'function') { return false }
        if (typeof Symbol !== 'function') { return false }
        if (typeof origSymbol('foo') !== 'symbol') { return false }
        if (typeof Symbol('bar') !== 'symbol') { return false }

        return hasSymbolSham()
      }
    }, { './shams': 29 }],
    29: [function (require, module, exports) {
      'use strict'

      /* eslint complexity: [2, 18], max-statements: [2, 33] */
      module.exports = function hasSymbols () {
        if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false }
        if (typeof Symbol.iterator === 'symbol') { return true }

        const obj = {}
        let sym = Symbol('test')
        const symObj = Object(sym)
        if (typeof sym === 'string') { return false }

        if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false }
        if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false }

        // temp disabled per https://github.com/ljharb/object.assign/issues/17
        // if (sym instanceof Symbol) { return false; }
        // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
        // if (!(symObj instanceof Symbol)) { return false; }

        // if (typeof Symbol.prototype.toString !== 'function') { return false; }
        // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

        const symVal = 42
        obj[sym] = symVal
        for (sym in obj) { return false } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
        if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false }

        if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false }

        const syms = Object.getOwnPropertySymbols(obj)
        if (syms.length !== 1 || syms[0] !== sym) { return false }

        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false }

        if (typeof Object.getOwnPropertyDescriptor === 'function') {
          const descriptor = Object.getOwnPropertyDescriptor(obj, sym)
          if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false }
        }

        return true
      }
    }, {}],
    30: [function (require, module, exports) {
      'use strict'

      const hasSymbols = require('has-symbols/shams')

      module.exports = function hasToStringTagShams () {
        return hasSymbols() && !!Symbol.toStringTag
      }
    }, { 'has-symbols/shams': 29 }],
    31: [function (require, module, exports) {
      'use strict'

      const call = Function.prototype.call
      const $hasOwn = Object.prototype.hasOwnProperty
      const bind = require('function-bind')

      /** @type {(o: {}, p: PropertyKey) => p is keyof o} */
      module.exports = bind.call(call, $hasOwn)
    }, { 'function-bind': 23 }],
    32: [function (require, module, exports) {
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
      exports.read = function (buffer, offset, isLE, mLen, nBytes) {
        let e, m
        const eLen = (nBytes * 8) - mLen - 1
        const eMax = (1 << eLen) - 1
        const eBias = eMax >> 1
        let nBits = -7
        let i = isLE ? (nBytes - 1) : 0
        const d = isLE ? -1 : 1
        let s = buffer[offset + i]

        i += d

        e = s & ((1 << (-nBits)) - 1)
        s >>= (-nBits)
        nBits += eLen
        for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

        m = e & ((1 << (-nBits)) - 1)
        e >>= (-nBits)
        nBits += mLen
        for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

        if (e === 0) {
          e = 1 - eBias
        } else if (e === eMax) {
          return m ? NaN : ((s ? -1 : 1) * Infinity)
        } else {
          m = m + Math.pow(2, mLen)
          e = e - eBias
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
      }

      exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
        let e, m, c
        let eLen = (nBytes * 8) - mLen - 1
        const eMax = (1 << eLen) - 1
        const eBias = eMax >> 1
        const rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
        let i = isLE ? 0 : (nBytes - 1)
        const d = isLE ? 1 : -1
        const s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

        value = Math.abs(value)

        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0
          e = eMax
        } else {
          e = Math.floor(Math.log(value) / Math.LN2)
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--
            c *= 2
          }
          if (e + eBias >= 1) {
            value += rt / c
          } else {
            value += rt * Math.pow(2, 1 - eBias)
          }
          if (value * c >= 2) {
            e++
            c /= 2
          }

          if (e + eBias >= eMax) {
            m = 0
            e = eMax
          } else if (e + eBias >= 1) {
            m = ((value * c) - 1) * Math.pow(2, mLen)
            e = e + eBias
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
            e = 0
          }
        }

        for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

        e = (e << mLen) | m
        eLen += mLen
        for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

        buffer[offset + i - d] |= s * 128
      }
    }, {}],
    33: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
        module.exports = function inherits (ctor, superCtor) {
          ctor.super_ = superCtor
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          })
        }
      } else {
      // old school shim for old browsers
        module.exports = function inherits (ctor, superCtor) {
          ctor.super_ = superCtor
          const TempCtor = function () {}
          TempCtor.prototype = superCtor.prototype
          ctor.prototype = new TempCtor()
          ctor.prototype.constructor = ctor
        }
      }
    }, {}],
    34: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
        module.exports = function inherits (ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            })
          }
        }
      } else {
      // old school shim for old browsers
        module.exports = function inherits (ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor
            const TempCtor = function () {}
            TempCtor.prototype = superCtor.prototype
            ctor.prototype = new TempCtor()
            ctor.prototype.constructor = ctor
          }
        }
      }
    }, {}],
    35: [function (require, module, exports) {
      'use strict'

      const hasToStringTag = require('has-tostringtag/shams')()
      const callBound = require('call-bind/callBound')

      const $toString = callBound('Object.prototype.toString')

      const isStandardArguments = function isArguments (value) {
        if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
          return false
        }
        return $toString(value) === '[object Arguments]'
      }

      const isLegacyArguments = function isArguments (value) {
        if (isStandardArguments(value)) {
          return true
        }
        return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]'
      }

      const supportsStandardArguments = (function () {
        return isStandardArguments(arguments)
      }())

      isStandardArguments.isLegacyArguments = isLegacyArguments // for tests

      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments
    }, { 'call-bind/callBound': 17, 'has-tostringtag/shams': 30 }],
    36: [function (require, module, exports) {
      'use strict'

      const fnToStr = Function.prototype.toString
      let reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply
      let badArrayLike
      let isCallableMarker
      if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
        try {
          badArrayLike = Object.defineProperty({}, 'length', {
            get: function () {
              throw isCallableMarker
            }
          })
          isCallableMarker = {}
          // eslint-disable-next-line no-throw-literal
          reflectApply(function () { throw 42 }, null, badArrayLike)
        } catch (_) {
          if (_ !== isCallableMarker) {
            reflectApply = null
          }
        }
      } else {
        reflectApply = null
      }

      const constructorRegex = /^\s*class\b/
      const isES6ClassFn = function isES6ClassFunction (value) {
        try {
          const fnStr = fnToStr.call(value)
          return constructorRegex.test(fnStr)
        } catch (e) {
          return false // not a function
        }
      }

      const tryFunctionObject = function tryFunctionToStr (value) {
        try {
          if (isES6ClassFn(value)) { return false }
          fnToStr.call(value)
          return true
        } catch (e) {
          return false
        }
      }
      const toStr = Object.prototype.toString
      const objectClass = '[object Object]'
      const fnClass = '[object Function]'
      const genClass = '[object GeneratorFunction]'
      const ddaClass = '[object HTMLAllCollection]' // IE 11
      const ddaClass2 = '[object HTML document.all class]'
      const ddaClass3 = '[object HTMLCollection]' // IE 9-10
      const hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag // better: use `has-tostringtag`

      const isIE68 = !(0 in [,]) // eslint-disable-line no-sparse-arrays, comma-spacing

      let isDDA = function isDocumentDotAll () { return false }
      if (typeof document === 'object') {
        // Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
        const all = document.all
        if (toStr.call(all) === toStr.call(document.all)) {
          isDDA = function isDocumentDotAll (value) {
            /* globals document: false */
            // in IE 6-8, typeof document.all is "object" and it's truthy
            if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
              try {
                const str = toStr.call(value)
                return (
                  str === ddaClass ||
						str === ddaClass2 ||
						str === ddaClass3 || // opera 12.16
						str === objectClass // IE 6-8
                ) && value('') == null // eslint-disable-line eqeqeq
              } catch (e) { /**/ }
            }
            return false
          }
        }
      }

      module.exports = reflectApply
        ? function isCallable (value) {
          if (isDDA(value)) { return true }
          if (!value) { return false }
          if (typeof value !== 'function' && typeof value !== 'object') { return false }
          try {
            reflectApply(value, null, badArrayLike)
          } catch (e) {
            if (e !== isCallableMarker) { return false }
          }
          return !isES6ClassFn(value) && tryFunctionObject(value)
        }
        : function isCallable (value) {
          if (isDDA(value)) { return true }
          if (!value) { return false }
          if (typeof value !== 'function' && typeof value !== 'object') { return false }
          if (hasToStringTag) { return tryFunctionObject(value) }
          if (isES6ClassFn(value)) { return false }
          const strClass = toStr.call(value)
          if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false }
          return tryFunctionObject(value)
        }
    }, {}],
    37: [function (require, module, exports) {
      'use strict'

      const toStr = Object.prototype.toString
      const fnToStr = Function.prototype.toString
      const isFnRegex = /^\s*(?:function)?\*/
      const hasToStringTag = require('has-tostringtag/shams')()
      const getProto = Object.getPrototypeOf
      const getGeneratorFunc = function () { // eslint-disable-line consistent-return
        if (!hasToStringTag) {
          return false
        }
        try {
          return Function('return function*() {}')()
        } catch (e) {
        }
      }
      let GeneratorFunction

      module.exports = function isGeneratorFunction (fn) {
        if (typeof fn !== 'function') {
          return false
        }
        if (isFnRegex.test(fnToStr.call(fn))) {
          return true
        }
        if (!hasToStringTag) {
          const str = toStr.call(fn)
          return str === '[object GeneratorFunction]'
        }
        if (!getProto) {
          return false
        }
        if (typeof GeneratorFunction === 'undefined') {
          const generatorFunc = getGeneratorFunc()
          GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false
        }
        return getProto(fn) === GeneratorFunction
      }
    }, { 'has-tostringtag/shams': 30 }],
    38: [function (require, module, exports) {
      'use strict'

      const whichTypedArray = require('which-typed-array')

      module.exports = function isTypedArray (value) {
        return !!whichTypedArray(value)
      }
    }, { 'which-typed-array': 81 }],
    39: [function (require, module, exports) {
      'use strict'

      let keysShim
      if (!Object.keys) {
        // modified from https://github.com/es-shims/es5-shim
        const has = Object.prototype.hasOwnProperty
        const toStr = Object.prototype.toString
        const isArgs = require('./isArguments') // eslint-disable-line global-require
        const isEnumerable = Object.prototype.propertyIsEnumerable
        const hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString')
        const hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype')
        const dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ]
        const equalsConstructorPrototype = function (o) {
          const ctor = o.constructor
          return ctor && ctor.prototype === o
        }
        const excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        }
        const hasAutomationEqualityBug = (function () {
          /* global window */
          if (typeof window === 'undefined') { return false }
          for (const k in window) {
            try {
              if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
                try {
                  equalsConstructorPrototype(window[k])
                } catch (e) {
                  return true
                }
              }
            } catch (e) {
              return true
            }
          }
          return false
        }())
        const equalsConstructorPrototypeIfNotBuggy = function (o) {
          /* global window */
          if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o)
          }
          try {
            return equalsConstructorPrototype(o)
          } catch (e) {
            return false
          }
        }

        keysShim = function keys (object) {
          const isObject = object !== null && typeof object === 'object'
          const isFunction = toStr.call(object) === '[object Function]'
          const isArguments = isArgs(object)
          const isString = isObject && toStr.call(object) === '[object String]'
          const theKeys = []

          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError('Object.keys called on a non-object')
          }

          const skipProto = hasProtoEnumBug && isFunction
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (let i = 0; i < object.length; ++i) {
              theKeys.push(String(i))
            }
          }

          if (isArguments && object.length > 0) {
            for (let j = 0; j < object.length; ++j) {
              theKeys.push(String(j))
            }
          } else {
            for (const name in object) {
              if (!(skipProto && name === 'prototype') && has.call(object, name)) {
                theKeys.push(String(name))
              }
            }
          }

          if (hasDontEnumBug) {
            const skipConstructor = equalsConstructorPrototypeIfNotBuggy(object)

            for (let k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k])
              }
            }
          }
          return theKeys
        }
      }
      module.exports = keysShim
    }, { './isArguments': 41 }],
    40: [function (require, module, exports) {
      'use strict'

      const slice = Array.prototype.slice
      const isArgs = require('./isArguments')

      const origKeys = Object.keys
      const keysShim = origKeys ? function keys (o) { return origKeys(o) } : require('./implementation')

      const originalKeys = Object.keys

      keysShim.shim = function shimObjectKeys () {
        if (Object.keys) {
          const keysWorksWithArguments = (function () {
            // Safari 5.0 bug
            const args = Object.keys(arguments)
            return args && args.length === arguments.length
          }(1, 2))
          if (!keysWorksWithArguments) {
            Object.keys = function keys (object) { // eslint-disable-line func-name-matching
              if (isArgs(object)) {
                return originalKeys(slice.call(object))
              }
              return originalKeys(object)
            }
          }
        } else {
          Object.keys = keysShim
        }
        return Object.keys || keysShim
      }

      module.exports = keysShim
    }, { './implementation': 39, './isArguments': 41 }],
    41: [function (require, module, exports) {
      'use strict'

      const toStr = Object.prototype.toString

      module.exports = function isArguments (value) {
        const str = toStr.call(value)
        let isArgs = str === '[object Arguments]'
        if (!isArgs) {
          isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]'
        }
        return isArgs
      }
    }, {}],
    42: [function (require, module, exports) {
      'use strict'

      // modified from https://github.com/es-shims/es6-shim
      const objectKeys = require('object-keys')
      const hasSymbols = require('has-symbols/shams')()
      const callBound = require('call-bind/callBound')
      const toObject = Object
      const $push = callBound('Array.prototype.push')
      const $propIsEnumerable = callBound('Object.prototype.propertyIsEnumerable')
      const originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null

      // eslint-disable-next-line no-unused-vars
      module.exports = function assign (target, source1) {
        if (target == null) { throw new TypeError('target must be an object') }
        const to = toObject(target) // step 1
        if (arguments.length === 1) {
          return to // step 2
        }
        for (let s = 1; s < arguments.length; ++s) {
          const from = toObject(arguments[s]) // step 3.a.i

          // step 3.a.ii:
          const keys = objectKeys(from)
          const getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols)
          if (getSymbols) {
            const syms = getSymbols(from)
            for (let j = 0; j < syms.length; ++j) {
              const key = syms[j]
              if ($propIsEnumerable(from, key)) {
                $push(keys, key)
              }
            }
          }

          // step 3.a.iii:
          for (let i = 0; i < keys.length; ++i) {
            const nextKey = keys[i]
            if ($propIsEnumerable(from, nextKey)) { // step 3.a.iii.2
              const propValue = from[nextKey] // step 3.a.iii.2.a
              to[nextKey] = propValue // step 3.a.iii.2.b
            }
          }
        }

        return to // step 4
      }
    }, { 'call-bind/callBound': 17, 'has-symbols/shams': 29, 'object-keys': 40 }],
    43: [function (require, module, exports) {
      'use strict'

      const implementation = require('./implementation')

      const lacksProperEnumerationOrder = function () {
        if (!Object.assign) {
          return false
        }
        /*
	 * v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	 * note: this does not detect the bug unless there's 20 characters
	 */
        const str = 'abcdefghijklmnopqrst'
        const letters = str.split('')
        const map = {}
        for (let i = 0; i < letters.length; ++i) {
          map[letters[i]] = letters[i]
        }
        const obj = Object.assign({}, map)
        let actual = ''
        for (const k in obj) {
          actual += k
        }
        return str !== actual
      }

      const assignHasPendingExceptions = function () {
        if (!Object.assign || !Object.preventExtensions) {
          return false
        }
        /*
	 * Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	 * which is 72% slower than our shim, and Firefox 40's native implementation.
	 */
        const thrower = Object.preventExtensions({ 1: 2 })
        try {
          Object.assign(thrower, 'xy')
        } catch (e) {
          return thrower[1] === 'y'
        }
        return false
      }

      module.exports = function getPolyfill () {
        if (!Object.assign) {
          return implementation
        }
        if (lacksProperEnumerationOrder()) {
          return implementation
        }
        if (assignHasPendingExceptions()) {
          return implementation
        }
        return Object.assign
      }
    }, { './implementation': 42 }],
    44: [function (require, module, exports) {
      'use strict'

      const TYPED_OK = (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined')

      function _has (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key)
      }

      exports.assign = function (obj /* from1, from2, from3, ... */) {
        const sources = Array.prototype.slice.call(arguments, 1)
        while (sources.length) {
          const source = sources.shift()
          if (!source) { continue }

          if (typeof source !== 'object') {
            throw new TypeError(source + 'must be non-object')
          }

          for (const p in source) {
            if (_has(source, p)) {
              obj[p] = source[p]
            }
          }
        }

        return obj
      }

      // reduce buffer size, avoiding mem copy
      exports.shrinkBuf = function (buf, size) {
        if (buf.length === size) { return buf }
        if (buf.subarray) { return buf.subarray(0, size) }
        buf.length = size
        return buf
      }

      const fnTyped = {
        arraySet: function (dest, src, src_offs, len, dest_offs) {
          if (src.subarray && dest.subarray) {
            dest.set(src.subarray(src_offs, src_offs + len), dest_offs)
            return
          }
          // Fallback to ordinary array
          for (let i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i]
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function (chunks) {
          let i, l, len, pos, chunk, result

          // calculate data length
          len = 0
          for (i = 0, l = chunks.length; i < l; i++) {
            len += chunks[i].length
          }

          // join chunks
          result = new Uint8Array(len)
          pos = 0
          for (i = 0, l = chunks.length; i < l; i++) {
            chunk = chunks[i]
            result.set(chunk, pos)
            pos += chunk.length
          }

          return result
        }
      }

      const fnUntyped = {
        arraySet: function (dest, src, src_offs, len, dest_offs) {
          for (let i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i]
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function (chunks) {
          return [].concat.apply([], chunks)
        }
      }

      // Enable/Disable typed arrays use, for testing
      //
      exports.setTyped = function (on) {
        if (on) {
          exports.Buf8 = Uint8Array
          exports.Buf16 = Uint16Array
          exports.Buf32 = Int32Array
          exports.assign(exports, fnTyped)
        } else {
          exports.Buf8 = Array
          exports.Buf16 = Array
          exports.Buf32 = Array
          exports.assign(exports, fnUntyped)
        }
      }

      exports.setTyped(TYPED_OK)
    }, {}],
    45: [function (require, module, exports) {
      'use strict'

      // Note: adler32 takes 12% for level 0 and 2% for level 6.
      // It isn't worth it to make additional optimizations as in original.
      // Small size is preferable.

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      function adler32 (adler, buf, len, pos) {
        let s1 = (adler & 0xffff) | 0
        let s2 = ((adler >>> 16) & 0xffff) | 0
        let n = 0

        while (len !== 0) {
        // Set limit ~ twice less than 5552, to keep
        // s2 in 31-bits, because we force signed ints.
        // in other case %= will fail.
          n = len > 2000 ? 2000 : len
          len -= n

          do {
            s1 = (s1 + buf[pos++]) | 0
            s2 = (s2 + s1) | 0
          } while (--n)

          s1 %= 65521
          s2 %= 65521
        }

        return (s1 | (s2 << 16)) | 0
      }

      module.exports = adler32
    }, {}],
    46: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      module.exports = {

        /* Allowed flush values; see deflate() and inflate() below for details */
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,

        /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        // Z_MEM_ERROR:     -4,
        Z_BUF_ERROR: -5,
        // Z_VERSION_ERROR: -6,

        /* compression levels */
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,

        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,

        /* Possible values of the data_type field (though see inflate()) */
        Z_BINARY: 0,
        Z_TEXT: 1,
        // Z_ASCII:                1, // = Z_TEXT (deprecated)
        Z_UNKNOWN: 2,

        /* The deflate compression method */
        Z_DEFLATED: 8
      // Z_NULL:                 null // Use -1 or null inline, depending on var type
      }
    }, {}],
    47: [function (require, module, exports) {
      'use strict'

      // Note: we can't get significant speed boost here.
      // So write code to minimize size - no pregenerated tables
      // and array tools dependencies.

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      // Use ordinary array, since untyped makes no boost here
      function makeTable () {
        let c; const table = []

        for (let n = 0; n < 256; n++) {
          c = n
          for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
          }
          table[n] = c
        }

        return table
      }

      // Create table on load. Just 255 signed longs. Not a problem.
      const crcTable = makeTable()

      function crc32 (crc, buf, len, pos) {
        const t = crcTable
        const end = pos + len

        crc ^= -1

        for (let i = pos; i < end; i++) {
          crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF]
        }

        return (crc ^ (-1)) // >>> 0;
      }

      module.exports = crc32
    }, {}],
    48: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      const utils = require('../utils/common')
      const trees = require('./trees')
      const adler32 = require('./adler32')
      const crc32 = require('./crc32')
      const msg = require('./messages')

      /* Public constants ========================================================== */
      /* =========================================================================== */

      /* Allowed flush values; see deflate() and inflate() below for details */
      const Z_NO_FLUSH = 0
      const Z_PARTIAL_FLUSH = 1
      // var Z_SYNC_FLUSH    = 2;
      const Z_FULL_FLUSH = 3
      const Z_FINISH = 4
      const Z_BLOCK = 5
      // var Z_TREES         = 6;

      /* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
      const Z_OK = 0
      const Z_STREAM_END = 1
      // var Z_NEED_DICT     = 2;
      // var Z_ERRNO         = -1;
      const Z_STREAM_ERROR = -2
      const Z_DATA_ERROR = -3
      // var Z_MEM_ERROR     = -4;
      const Z_BUF_ERROR = -5
      // var Z_VERSION_ERROR = -6;

      /* compression levels */
      // var Z_NO_COMPRESSION      = 0;
      // var Z_BEST_SPEED          = 1;
      // var Z_BEST_COMPRESSION    = 9;
      const Z_DEFAULT_COMPRESSION = -1

      const Z_FILTERED = 1
      const Z_HUFFMAN_ONLY = 2
      const Z_RLE = 3
      const Z_FIXED = 4
      const Z_DEFAULT_STRATEGY = 0

      /* Possible values of the data_type field (though see inflate()) */
      // var Z_BINARY              = 0;
      // var Z_TEXT                = 1;
      // var Z_ASCII               = 1; // = Z_TEXT
      const Z_UNKNOWN = 2

      /* The deflate compression method */
      const Z_DEFLATED = 8

      /* ============================================================================ */

      const MAX_MEM_LEVEL = 9
      /* Maximum value for memLevel in deflateInit2 */
      const MAX_WBITS = 15
      /* 32K LZ77 window */
      const DEF_MEM_LEVEL = 8

      const LENGTH_CODES = 29
      /* number of length codes, not counting the special END_BLOCK code */
      const LITERALS = 256
      /* number of literal bytes 0..255 */
      const L_CODES = LITERALS + 1 + LENGTH_CODES
      /* number of Literal or Length codes, including the END_BLOCK code */
      const D_CODES = 30
      /* number of distance codes */
      const BL_CODES = 19
      /* number of codes used to transfer the bit lengths */
      const HEAP_SIZE = 2 * L_CODES + 1
      /* maximum heap size */
      const MAX_BITS = 15
      /* All codes must not exceed MAX_BITS bits */

      const MIN_MATCH = 3
      const MAX_MATCH = 258
      const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1)

      const PRESET_DICT = 0x20

      const INIT_STATE = 42
      const EXTRA_STATE = 69
      const NAME_STATE = 73
      const COMMENT_STATE = 91
      const HCRC_STATE = 103
      const BUSY_STATE = 113
      const FINISH_STATE = 666

      const BS_NEED_MORE = 1 /* block not completed, need more input or more output */
      const BS_BLOCK_DONE = 2 /* block flush performed */
      const BS_FINISH_STARTED = 3 /* finish started, need only more output at next deflate */
      const BS_FINISH_DONE = 4 /* finish done, accept no more input or output */

      const OS_CODE = 0x03 // Unix :) . Don't detect, use this default.

      function err (strm, errorCode) {
        strm.msg = msg[errorCode]
        return errorCode
      }

      function rank (f) {
        return ((f) << 1) - ((f) > 4 ? 9 : 0)
      }

      function zero (buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0 } }

      /* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
      function flush_pending (strm) {
        const s = strm.state

        // _tr_flush_bits(s);
        let len = s.pending
        if (len > strm.avail_out) {
          len = strm.avail_out
        }
        if (len === 0) { return }

        utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out)
        strm.next_out += len
        s.pending_out += len
        strm.total_out += len
        strm.avail_out -= len
        s.pending -= len
        if (s.pending === 0) {
          s.pending_out = 0
        }
      }

      function flush_block_only (s, last) {
        trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last)
        s.block_start = s.strstart
        flush_pending(s.strm)
      }

      function put_byte (s, b) {
        s.pending_buf[s.pending++] = b
      }

      /* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
      function putShortMSB (s, b) {
        //  put_byte(s, (Byte)(b >> 8));
        //  put_byte(s, (Byte)(b & 0xff));
        s.pending_buf[s.pending++] = (b >>> 8) & 0xff
        s.pending_buf[s.pending++] = b & 0xff
      }

      /* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
      function read_buf (strm, buf, start, size) {
        let len = strm.avail_in

        if (len > size) { len = size }
        if (len === 0) { return 0 }

        strm.avail_in -= len

        // zmemcpy(buf, strm->next_in, len);
        utils.arraySet(buf, strm.input, strm.next_in, len, start)
        if (strm.state.wrap === 1) {
          strm.adler = adler32(strm.adler, buf, len, start)
        } else if (strm.state.wrap === 2) {
          strm.adler = crc32(strm.adler, buf, len, start)
        }

        strm.next_in += len
        strm.total_in += len

        return len
      }

      /* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
      function longest_match (s, cur_match) {
        let chain_length = s.max_chain_length /* max hash chain length */
        let scan = s.strstart /* current string */
        let match /* matched string */
        let len /* length of current match */
        let best_len = s.prev_length /* best match length so far */
        let nice_match = s.nice_match /* stop if match long enough */
        const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD))
          ? s.strstart - (s.w_size - MIN_LOOKAHEAD)
          : 0/* NIL */

        const _win = s.window // shortcut

        const wmask = s.w_mask
        const prev = s.prev

        /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

        const strend = s.strstart + MAX_MATCH
        let scan_end1 = _win[scan + best_len - 1]
        let scan_end = _win[scan + best_len]

        /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
        // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

        /* Do not waste too much time if we already have a good match: */
        if (s.prev_length >= s.good_match) {
          chain_length >>= 2
        }
        /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
        if (nice_match > s.lookahead) { nice_match = s.lookahead }

        // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

        do {
        // Assert(cur_match < s->strstart, "no future");
          match = cur_match

          /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

          if (_win[match + best_len] !== scan_end ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match] !== _win[scan] ||
        _win[++match] !== _win[scan + 1]) {
            continue
          }

          /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
          scan += 2
          match++
          // Assert(*scan == *match, "match[2]?");

          /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
          do {
          /* jshint noempty:false */
          } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend)

          // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

          len = MAX_MATCH - (strend - scan)
          scan = strend - MAX_MATCH

          if (len > best_len) {
            s.match_start = cur_match
            best_len = len
            if (len >= nice_match) {
              break
            }
            scan_end1 = _win[scan + best_len - 1]
            scan_end = _win[scan + best_len]
          }
        } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0)

        if (best_len <= s.lookahead) {
          return best_len
        }
        return s.lookahead
      }

      /* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
      function fill_window (s) {
        const _w_size = s.w_size
        let p, n, m, more, str

        // Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

        do {
          more = s.window_size - s.lookahead - s.strstart

          // JS ints have 32 bit, block below not needed
          /* Deal with !@#$% 64K limit: */
          // if (sizeof(int) <= 2) {
          //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
          //        more = wsize;
          //
          //  } else if (more == (unsigned)(-1)) {
          //        /* Very unlikely, but possible on 16 bit machine if
          //         * strstart == 0 && lookahead == 1 (input done a byte at time)
          //         */
          //        more--;
          //    }
          // }

          /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
          if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
            utils.arraySet(s.window, s.window, _w_size, _w_size, 0)
            s.match_start -= _w_size
            s.strstart -= _w_size
            /* we now have strstart >= MAX_DIST */
            s.block_start -= _w_size

            /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

            n = s.hash_size
            p = n
            do {
              m = s.head[--p]
              s.head[p] = (m >= _w_size ? m - _w_size : 0)
            } while (--n)

            n = _w_size
            p = n
            do {
              m = s.prev[--p]
              s.prev[p] = (m >= _w_size ? m - _w_size : 0)
            /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
            } while (--n)

            more += _w_size
          }
          if (s.strm.avail_in === 0) {
            break
          }

          /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
          // Assert(more >= 2, "more < 2");
          n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more)
          s.lookahead += n

          /* Initialize the hash value now that we have some input: */
          if (s.lookahead + s.insert >= MIN_MATCH) {
            str = s.strstart - s.insert
            s.ins_h = s.window[str]

            /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask
            // #if MIN_MATCH != 3
            //        Call update_hash() MIN_MATCH-3 more times
            // #endif
            while (s.insert) {
            /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
              s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask

              s.prev[str & s.w_mask] = s.head[s.ins_h]
              s.head[s.ins_h] = str
              str++
              s.insert--
              if (s.lookahead + s.insert < MIN_MATCH) {
                break
              }
            }
          }
          /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */
        } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0)

      /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
      //  if (s.high_water < s.window_size) {
      //    var curr = s.strstart + s.lookahead;
      //    var init = 0;
      //
      //    if (s.high_water < curr) {
      //      /* Previous high water mark below current data -- zero WIN_INIT
      //       * bytes or up to end of window, whichever is less.
      //       */
      //      init = s.window_size - curr;
      //      if (init > WIN_INIT)
      //        init = WIN_INIT;
      //      zmemzero(s->window + curr, (unsigned)init);
      //      s->high_water = curr + init;
      //    }
      //    else if (s->high_water < (ulg)curr + WIN_INIT) {
      //      /* High water mark at or above current data, but below current data
      //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
      //       * to end of window, whichever is less.
      //       */
      //      init = (ulg)curr + WIN_INIT - s->high_water;
      //      if (init > s->window_size - s->high_water)
      //        init = s->window_size - s->high_water;
      //      zmemzero(s->window + s->high_water, (unsigned)init);
      //      s->high_water += init;
      //    }
      //  }
      //
      //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
      //    "not enough room for search");
      }

      /* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
      function deflate_stored (s, flush) {
      /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
        let max_block_size = 0xffff

        if (max_block_size > s.pending_buf_size - 5) {
          max_block_size = s.pending_buf_size - 5
        }

        /* Copy as much as possible from input to output: */
        for (;;) {
        /* Fill the window as much as possible: */
          if (s.lookahead <= 1) {
          // Assert(s->strstart < s->w_size+MAX_DIST(s) ||
            //  s->block_start >= (long)s->w_size, "slide too late");
            //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
            //        s.block_start >= s.w_size)) {
            //        throw  new Error("slide too late");
            //      }

            fill_window(s)
            if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE
            }

            if (s.lookahead === 0) {
              break
            }
          /* flush the current block */
          }
          // Assert(s->block_start >= 0L, "block gone");
          //    if (s.block_start < 0) throw new Error("block gone");

          s.strstart += s.lookahead
          s.lookahead = 0

          /* Emit a stored block if pending_buf will be full: */
          const max_start = s.block_start + max_block_size

          if (s.strstart === 0 || s.strstart >= max_start) {
          /* strstart == 0 is possible when wraparound on 16-bit machine */
            s.lookahead = s.strstart - max_start
            s.strstart = max_start
            /** * FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false)
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
            /***/
          }
          /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
          if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
          /** * FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false)
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
          /***/
          }
        }

        s.insert = 0

        if (flush === Z_FINISH) {
        /** * FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true)
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED
          }
          /***/
          return BS_FINISH_DONE
        }

        if (s.strstart > s.block_start) {
        /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
        /***/
        }

        return BS_NEED_MORE
      }

      /* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
      function deflate_fast (s, flush) {
        let hash_head /* head of the hash chain */
        let bflush /* set if current block must be flushed */

        for (;;) {
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s)
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE
            }
            if (s.lookahead === 0) {
              break /* flush the current block */
            }
          }

          /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
          hash_head = 0/* NIL */
          if (s.lookahead >= MIN_MATCH) {
          /** * INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
            s.head[s.ins_h] = s.strstart
          /***/
          }

          /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
          if (hash_head !== 0/* NIL */ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
          /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
            s.match_length = longest_match(s, hash_head)
          /* longest_match() sets match_start */
          }
          if (s.match_length >= MIN_MATCH) {
          // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

            /** * _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
            bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH)

            s.lookahead -= s.match_length

            /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
            if (s.match_length <= s.max_lazy_match/* max_insert_length */ && s.lookahead >= MIN_MATCH) {
              s.match_length-- /* string at strstart already in table */
              do {
                s.strstart++
                /** * INSERT_STRING(s, s.strstart, hash_head); ***/
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
                s.head[s.ins_h] = s.strstart
                /***/
              /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
              } while (--s.match_length !== 0)
              s.strstart++
            } else {
              s.strstart += s.match_length
              s.match_length = 0
              s.ins_h = s.window[s.strstart]
              /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
              s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask

              // #if MIN_MATCH != 3
              //                Call UPDATE_HASH() MIN_MATCH-3 more times
              // #endif
            /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
            }
          } else {
          /* No match, output a literal byte */
          // Tracevv((stderr,"%c", s.window[s.strstart]));
          /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart])

            s.lookahead--
            s.strstart++
          }
          if (bflush) {
          /** * FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false)
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
          /***/
          }
        }
        s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1)
        if (flush === Z_FINISH) {
        /** * FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true)
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED
          }
          /***/
          return BS_FINISH_DONE
        }
        if (s.last_lit) {
        /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
        /***/
        }
        return BS_BLOCK_DONE
      }

      /* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
      function deflate_slow (s, flush) {
        let hash_head /* head of hash chain */
        let bflush /* set if current block must be flushed */

        let max_insert

        /* Process the input block. */
        for (;;) {
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s)
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE
            }
            if (s.lookahead === 0) { break } /* flush the current block */
          }

          /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
          hash_head = 0/* NIL */
          if (s.lookahead >= MIN_MATCH) {
          /** * INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
            s.head[s.ins_h] = s.strstart
          /***/
          }

          /* Find the longest match, discarding those <= prev_length.
     */
          s.prev_length = s.match_length
          s.prev_match = s.match_start
          s.match_length = MIN_MATCH - 1

          if (hash_head !== 0/* NIL */ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/* MAX_DIST(s) */) {
          /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
            s.match_length = longest_match(s, hash_head)
            /* longest_match() sets match_start */

            if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/* TOO_FAR */))) {
            /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
              s.match_length = MIN_MATCH - 1
            }
          }
          /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
          if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
            max_insert = s.strstart + s.lookahead - MIN_MATCH
            /* Do not insert strings in hash table beyond this. */

            // check_match(s, s.strstart-1, s.prev_match, s.prev_length);

            /** *_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
            bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH)
            /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
            s.lookahead -= s.prev_length - 1
            s.prev_length -= 2
            do {
              if (++s.strstart <= max_insert) {
              /** * INSERT_STRING(s, s.strstart, hash_head); ***/
                s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h]
                s.head[s.ins_h] = s.strstart
              /***/
              }
            } while (--s.prev_length !== 0)
            s.match_available = 0
            s.match_length = MIN_MATCH - 1
            s.strstart++

            if (bflush) {
            /** * FLUSH_BLOCK(s, 0); ***/
              flush_block_only(s, false)
              if (s.strm.avail_out === 0) {
                return BS_NEED_MORE
              }
            /***/
            }
          } else if (s.match_available) {
          /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
            // Tracevv((stderr,"%c", s->window[s->strstart-1]));
            /** * _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1])

            if (bflush) {
            /** * FLUSH_BLOCK_ONLY(s, 0) ***/
              flush_block_only(s, false)
            /***/
            }
            s.strstart++
            s.lookahead--
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
          } else {
          /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
            s.match_available = 1
            s.strstart++
            s.lookahead--
          }
        }
        // Assert (flush != Z_NO_FLUSH, "no flush?");
        if (s.match_available) {
        // Tracevv((stderr,"%c", s->window[s->strstart-1]));
        /** * _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1])

          s.match_available = 0
        }
        s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1
        if (flush === Z_FINISH) {
        /** * FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true)
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED
          }
          /***/
          return BS_FINISH_DONE
        }
        if (s.last_lit) {
        /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
        /***/
        }

        return BS_BLOCK_DONE
      }

      /* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
      function deflate_rle (s, flush) {
        let bflush /* set if current block must be flushed */
        let prev /* byte at distance one to match */
        let scan, strend /* scan goes up to strend for length of run */

        const _win = s.window

        for (;;) {
        /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
          if (s.lookahead <= MAX_MATCH) {
            fill_window(s)
            if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE
            }
            if (s.lookahead === 0) { break } /* flush the current block */
          }

          /* See how many times the previous byte repeats */
          s.match_length = 0
          if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
            scan = s.strstart - 1
            prev = _win[scan]
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
              strend = s.strstart + MAX_MATCH
              do {
              /* jshint noempty:false */
              } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend)
              s.match_length = MAX_MATCH - (strend - scan)
              if (s.match_length > s.lookahead) {
                s.match_length = s.lookahead
              }
            }
          // Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
          }

          /* Emit match if have run of MIN_MATCH or longer, else emit literal */
          if (s.match_length >= MIN_MATCH) {
          // check_match(s, s.strstart, s.strstart - 1, s.match_length);

            /** * _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
            bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH)

            s.lookahead -= s.match_length
            s.strstart += s.match_length
            s.match_length = 0
          } else {
          /* No match, output a literal byte */
          // Tracevv((stderr,"%c", s->window[s->strstart]));
          /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
            bflush = trees._tr_tally(s, 0, s.window[s.strstart])

            s.lookahead--
            s.strstart++
          }
          if (bflush) {
          /** * FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false)
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
          /***/
          }
        }
        s.insert = 0
        if (flush === Z_FINISH) {
        /** * FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true)
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED
          }
          /***/
          return BS_FINISH_DONE
        }
        if (s.last_lit) {
        /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
        /***/
        }
        return BS_BLOCK_DONE
      }

      /* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
      function deflate_huff (s, flush) {
        let bflush /* set if current block must be flushed */

        for (;;) {
        /* Make sure that we have a literal to write. */
          if (s.lookahead === 0) {
            fill_window(s)
            if (s.lookahead === 0) {
              if (flush === Z_NO_FLUSH) {
                return BS_NEED_MORE
              }
              break /* flush the current block */
            }
          }

          /* Output a literal byte */
          s.match_length = 0
          // Tracevv((stderr,"%c", s->window[s->strstart]));
          /** * _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
          bflush = trees._tr_tally(s, 0, s.window[s.strstart])
          s.lookahead--
          s.strstart++
          if (bflush) {
          /** * FLUSH_BLOCK(s, 0); ***/
            flush_block_only(s, false)
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE
            }
          /***/
          }
        }
        s.insert = 0
        if (flush === Z_FINISH) {
        /** * FLUSH_BLOCK(s, 1); ***/
          flush_block_only(s, true)
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED
          }
          /***/
          return BS_FINISH_DONE
        }
        if (s.last_lit) {
        /** * FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false)
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE
          }
        /***/
        }
        return BS_BLOCK_DONE
      }

      /* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
      function Config (good_length, max_lazy, nice_length, max_chain, func) {
        this.good_length = good_length
        this.max_lazy = max_lazy
        this.nice_length = nice_length
        this.max_chain = max_chain
        this.func = func
      }

      let configuration_table

      configuration_table = [
      /*      good lazy nice chain */
        new Config(0, 0, 0, 0, deflate_stored), /* 0 store only */
        new Config(4, 4, 8, 4, deflate_fast), /* 1 max speed, no lazy matches */
        new Config(4, 5, 16, 8, deflate_fast), /* 2 */
        new Config(4, 6, 32, 32, deflate_fast), /* 3 */

        new Config(4, 4, 16, 16, deflate_slow), /* 4 lazy matches */
        new Config(8, 16, 32, 32, deflate_slow), /* 5 */
        new Config(8, 16, 128, 128, deflate_slow), /* 6 */
        new Config(8, 32, 128, 256, deflate_slow), /* 7 */
        new Config(32, 128, 258, 1024, deflate_slow), /* 8 */
        new Config(32, 258, 258, 4096, deflate_slow) /* 9 max compression */
      ]

      /* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
      function lm_init (s) {
        s.window_size = 2 * s.w_size

        /** * CLEAR_HASH(s); ***/
        zero(s.head) // Fill with NIL (= 0);

        /* Set the default configuration parameters:
   */
        s.max_lazy_match = configuration_table[s.level].max_lazy
        s.good_match = configuration_table[s.level].good_length
        s.nice_match = configuration_table[s.level].nice_length
        s.max_chain_length = configuration_table[s.level].max_chain

        s.strstart = 0
        s.block_start = 0
        s.lookahead = 0
        s.insert = 0
        s.match_length = s.prev_length = MIN_MATCH - 1
        s.match_available = 0
        s.ins_h = 0
      }

      function DeflateState () {
        this.strm = null /* pointer back to this zlib stream */
        this.status = 0 /* as the name implies */
        this.pending_buf = null /* output still pending */
        this.pending_buf_size = 0 /* size of pending_buf */
        this.pending_out = 0 /* next pending byte to output to the stream */
        this.pending = 0 /* nb of bytes in the pending buffer */
        this.wrap = 0 /* bit 0 true for zlib, bit 1 true for gzip */
        this.gzhead = null /* gzip header information to write */
        this.gzindex = 0 /* where in extra, name, or comment */
        this.method = Z_DEFLATED /* can only be DEFLATED */
        this.last_flush = -1 /* value of flush param for previous deflate call */

        this.w_size = 0 /* LZ77 window size (32K by default) */
        this.w_bits = 0 /* log2(w_size)  (8..16) */
        this.w_mask = 0 /* w_size - 1 */

        this.window = null
        /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

        this.window_size = 0
        /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

        this.prev = null
        /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

        this.head = null /* Heads of the hash chains or NIL. */

        this.ins_h = 0 /* hash index of string to be inserted */
        this.hash_size = 0 /* number of elements in hash table */
        this.hash_bits = 0 /* log2(hash_size) */
        this.hash_mask = 0 /* hash_size-1 */

        this.hash_shift = 0
        /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

        this.block_start = 0
        /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

        this.match_length = 0 /* length of best match */
        this.prev_match = 0 /* previous match */
        this.match_available = 0 /* set if previous match exists */
        this.strstart = 0 /* start of string to insert */
        this.match_start = 0 /* start of matching string */
        this.lookahead = 0 /* number of valid bytes ahead in window */

        this.prev_length = 0
        /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

        this.max_chain_length = 0
        /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

        this.max_lazy_match = 0
        /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
        // That's alias to max_lazy_match, don't use directly
        // this.max_insert_length = 0;
        /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

        this.level = 0 /* compression level (1..9) */
        this.strategy = 0 /* favor or force Huffman coding */

        this.good_match = 0
        /* Use a faster search when the previous match is longer than this */

        this.nice_match = 0 /* Stop searching when current match exceeds this */

        /* used by trees.c: */

        /* Didn't use ct_data typedef below to suppress compiler warning */

        // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
        // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
        // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

        // Use flat array of DOUBLE size, with interleaved fata,
        // because JS does not support effective
        this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2)
        this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2)
        this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2)
        zero(this.dyn_ltree)
        zero(this.dyn_dtree)
        zero(this.bl_tree)

        this.l_desc = null /* desc. for literal tree */
        this.d_desc = null /* desc. for distance tree */
        this.bl_desc = null /* desc. for bit length tree */

        // ush bl_count[MAX_BITS+1];
        this.bl_count = new utils.Buf16(MAX_BITS + 1)
        /* number of codes at each bit length for an optimal tree */

        // int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
        this.heap = new utils.Buf16(2 * L_CODES + 1) /* heap used to build the Huffman trees */
        zero(this.heap)

        this.heap_len = 0 /* number of elements in the heap */
        this.heap_max = 0 /* element of largest frequency */
        /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

        this.depth = new utils.Buf16(2 * L_CODES + 1) // uch depth[2*L_CODES+1];
        zero(this.depth)
        /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

        this.l_buf = 0 /* buffer index for literals or lengths */

        this.lit_bufsize = 0
        /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

        this.last_lit = 0 /* running index in l_buf */

        this.d_buf = 0
        /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

        this.opt_len = 0 /* bit length of current block with optimal trees */
        this.static_len = 0 /* bit length of current block with static trees */
        this.matches = 0 /* number of string matches in current block */
        this.insert = 0 /* bytes at end of window left to insert */

        this.bi_buf = 0
        /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
        this.bi_valid = 0
        /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

        // Used for window memory init. We safely ignore it for JS. That makes
        // sense only for pointers and memory check tools.
        // this.high_water = 0;
      /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
      }

      function deflateResetKeep (strm) {
        let s

        if (!strm || !strm.state) {
          return err(strm, Z_STREAM_ERROR)
        }

        strm.total_in = strm.total_out = 0
        strm.data_type = Z_UNKNOWN

        s = strm.state
        s.pending = 0
        s.pending_out = 0

        if (s.wrap < 0) {
          s.wrap = -s.wrap
        /* was made negative by deflate(..., Z_FINISH); */
        }
        s.status = (s.wrap ? INIT_STATE : BUSY_STATE)
        strm.adler = (s.wrap === 2)
          ? 0 // crc32(0, Z_NULL, 0)
          : 1 // adler32(0, Z_NULL, 0)
        s.last_flush = Z_NO_FLUSH
        trees._tr_init(s)
        return Z_OK
      }

      function deflateReset (strm) {
        const ret = deflateResetKeep(strm)
        if (ret === Z_OK) {
          lm_init(strm.state)
        }
        return ret
      }

      function deflateSetHeader (strm, head) {
        if (!strm || !strm.state) { return Z_STREAM_ERROR }
        if (strm.state.wrap !== 2) { return Z_STREAM_ERROR }
        strm.state.gzhead = head
        return Z_OK
      }

      function deflateInit2 (strm, level, method, windowBits, memLevel, strategy) {
        if (!strm) { // === Z_NULL
          return Z_STREAM_ERROR
        }
        let wrap = 1

        if (level === Z_DEFAULT_COMPRESSION) {
          level = 6
        }

        if (windowBits < 0) { /* suppress zlib wrapper */
          wrap = 0
          windowBits = -windowBits
        } else if (windowBits > 15) {
          wrap = 2 /* write gzip wrapper instead */
          windowBits -= 16
        }

        if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
          return err(strm, Z_STREAM_ERROR)
        }

        if (windowBits === 8) {
          windowBits = 9
        }
        /* until 256-byte window bug fixed */

        const s = new DeflateState()

        strm.state = s
        s.strm = strm

        s.wrap = wrap
        s.gzhead = null
        s.w_bits = windowBits
        s.w_size = 1 << s.w_bits
        s.w_mask = s.w_size - 1

        s.hash_bits = memLevel + 7
        s.hash_size = 1 << s.hash_bits
        s.hash_mask = s.hash_size - 1
        s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH)

        s.window = new utils.Buf8(s.w_size * 2)
        s.head = new utils.Buf16(s.hash_size)
        s.prev = new utils.Buf16(s.w_size)

        // Don't need mem init magic for JS.
        // s.high_water = 0;  /* nothing written to s->window yet */

        s.lit_bufsize = 1 << (memLevel + 6) /* 16K elements by default */

        s.pending_buf_size = s.lit_bufsize * 4

        // overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
        // s->pending_buf = (uchf *) overlay;
        s.pending_buf = new utils.Buf8(s.pending_buf_size)

        // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
        // s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
        s.d_buf = 1 * s.lit_bufsize

        // s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
        s.l_buf = (1 + 2) * s.lit_bufsize

        s.level = level
        s.strategy = strategy
        s.method = method

        return deflateReset(strm)
      }

      function deflateInit (strm, level) {
        return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY)
      }

      function deflate (strm, flush) {
        let old_flush, s
        let beg, val // for gzip header write only

        if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
          return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR
        }

        s = strm.state

        if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
          return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR)
        }

        s.strm = strm /* just in case */
        old_flush = s.last_flush
        s.last_flush = flush

        /* Write the header */
        if (s.status === INIT_STATE) {
          if (s.wrap === 2) { // GZIP header
            strm.adler = 0 // crc32(0L, Z_NULL, 0);
            put_byte(s, 31)
            put_byte(s, 139)
            put_byte(s, 8)
            if (!s.gzhead) { // s->gzhead == Z_NULL
              put_byte(s, 0)
              put_byte(s, 0)
              put_byte(s, 0)
              put_byte(s, 0)
              put_byte(s, 0)
              put_byte(s, s.level === 9
                ? 2
                : (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2
                    ? 4
                    : 0))
              put_byte(s, OS_CODE)
              s.status = BUSY_STATE
            } else {
              put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
              )
              put_byte(s, s.gzhead.time & 0xff)
              put_byte(s, (s.gzhead.time >> 8) & 0xff)
              put_byte(s, (s.gzhead.time >> 16) & 0xff)
              put_byte(s, (s.gzhead.time >> 24) & 0xff)
              put_byte(s, s.level === 9
                ? 2
                : (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2
                    ? 4
                    : 0))
              put_byte(s, s.gzhead.os & 0xff)
              if (s.gzhead.extra && s.gzhead.extra.length) {
                put_byte(s, s.gzhead.extra.length & 0xff)
                put_byte(s, (s.gzhead.extra.length >> 8) & 0xff)
              }
              if (s.gzhead.hcrc) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0)
              }
              s.gzindex = 0
              s.status = EXTRA_STATE
            }
          } else // DEFLATE header
          {
            let header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8
            let level_flags = -1

            if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
              level_flags = 0
            } else if (s.level < 6) {
              level_flags = 1
            } else if (s.level === 6) {
              level_flags = 2
            } else {
              level_flags = 3
            }
            header |= (level_flags << 6)
            if (s.strstart !== 0) { header |= PRESET_DICT }
            header += 31 - (header % 31)

            s.status = BUSY_STATE
            putShortMSB(s, header)

            /* Save the adler32 of the preset dictionary: */
            if (s.strstart !== 0) {
              putShortMSB(s, strm.adler >>> 16)
              putShortMSB(s, strm.adler & 0xffff)
            }
            strm.adler = 1 // adler32(0L, Z_NULL, 0);
          }
        }

        // #ifdef GZIP
        if (s.status === EXTRA_STATE) {
          if (s.gzhead.extra/* != Z_NULL */) {
            beg = s.pending /* start of bytes to update crc */

            while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                }
                flush_pending(strm)
                beg = s.pending
                if (s.pending === s.pending_buf_size) {
                  break
                }
              }
              put_byte(s, s.gzhead.extra[s.gzindex] & 0xff)
              s.gzindex++
            }
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
            }
            if (s.gzindex === s.gzhead.extra.length) {
              s.gzindex = 0
              s.status = NAME_STATE
            }
          } else {
            s.status = NAME_STATE
          }
        }
        if (s.status === NAME_STATE) {
          if (s.gzhead.name/* != Z_NULL */) {
            beg = s.pending /* start of bytes to update crc */
            // int val;

            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                }
                flush_pending(strm)
                beg = s.pending
                if (s.pending === s.pending_buf_size) {
                  val = 1
                  break
                }
              }
              // JS specific: little magic to add zero terminator to end of string
              if (s.gzindex < s.gzhead.name.length) {
                val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff
              } else {
                val = 0
              }
              put_byte(s, val)
            } while (val !== 0)

            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
            }
            if (val === 0) {
              s.gzindex = 0
              s.status = COMMENT_STATE
            }
          } else {
            s.status = COMMENT_STATE
          }
        }
        if (s.status === COMMENT_STATE) {
          if (s.gzhead.comment/* != Z_NULL */) {
            beg = s.pending /* start of bytes to update crc */
            // int val;

            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
                }
                flush_pending(strm)
                beg = s.pending
                if (s.pending === s.pending_buf_size) {
                  val = 1
                  break
                }
              }
              // JS specific: little magic to add zero terminator to end of string
              if (s.gzindex < s.gzhead.comment.length) {
                val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff
              } else {
                val = 0
              }
              put_byte(s, val)
            } while (val !== 0)

            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)
            }
            if (val === 0) {
              s.status = HCRC_STATE
            }
          } else {
            s.status = HCRC_STATE
          }
        }
        if (s.status === HCRC_STATE) {
          if (s.gzhead.hcrc) {
            if (s.pending + 2 > s.pending_buf_size) {
              flush_pending(strm)
            }
            if (s.pending + 2 <= s.pending_buf_size) {
              put_byte(s, strm.adler & 0xff)
              put_byte(s, (strm.adler >> 8) & 0xff)
              strm.adler = 0 // crc32(0L, Z_NULL, 0);
              s.status = BUSY_STATE
            }
          } else {
            s.status = BUSY_STATE
          }
        }
        // #endif

        /* Flush as much pending output as possible */
        if (s.pending !== 0) {
          flush_pending(strm)
          if (strm.avail_out === 0) {
          /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
            s.last_flush = -1
            return Z_OK
          }

        /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
        } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
          return err(strm, Z_BUF_ERROR)
        }

        /* User must not provide more input after the first FINISH: */
        if (s.status === FINISH_STATE && strm.avail_in !== 0) {
          return err(strm, Z_BUF_ERROR)
        }

        /* Start a new block or continue the current one.
   */
        if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
          const bstate = (s.strategy === Z_HUFFMAN_ONLY)
            ? deflate_huff(s, flush)
            : (s.strategy === Z_RLE
                ? deflate_rle(s, flush)
                : configuration_table[s.level].func(s, flush))

          if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
            s.status = FINISH_STATE
          }
          if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
            if (strm.avail_out === 0) {
              s.last_flush = -1
            /* avoid BUF_ERROR next call, see above */
            }
            return Z_OK
          /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
          }
          if (bstate === BS_BLOCK_DONE) {
            if (flush === Z_PARTIAL_FLUSH) {
              trees._tr_align(s)
            } else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */
              trees._tr_stored_block(s, 0, 0, false)
              /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
              if (flush === Z_FULL_FLUSH) {
              /** * CLEAR_HASH(s); ***/ /* forget history */
                zero(s.head) // Fill with NIL (= 0);

                if (s.lookahead === 0) {
                  s.strstart = 0
                  s.block_start = 0
                  s.insert = 0
                }
              }
            }
            flush_pending(strm)
            if (strm.avail_out === 0) {
              s.last_flush = -1 /* avoid BUF_ERROR at next call, see above */
              return Z_OK
            }
          }
        }
        // Assert(strm->avail_out > 0, "bug2");
        // if (strm.avail_out <= 0) { throw new Error("bug2");}

        if (flush !== Z_FINISH) { return Z_OK }
        if (s.wrap <= 0) { return Z_STREAM_END }

        /* Write the trailer */
        if (s.wrap === 2) {
          put_byte(s, strm.adler & 0xff)
          put_byte(s, (strm.adler >> 8) & 0xff)
          put_byte(s, (strm.adler >> 16) & 0xff)
          put_byte(s, (strm.adler >> 24) & 0xff)
          put_byte(s, strm.total_in & 0xff)
          put_byte(s, (strm.total_in >> 8) & 0xff)
          put_byte(s, (strm.total_in >> 16) & 0xff)
          put_byte(s, (strm.total_in >> 24) & 0xff)
        } else {
          putShortMSB(s, strm.adler >>> 16)
          putShortMSB(s, strm.adler & 0xffff)
        }

        flush_pending(strm)
        /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
        if (s.wrap > 0) { s.wrap = -s.wrap }
        /* write the trailer only once! */
        return s.pending !== 0 ? Z_OK : Z_STREAM_END
      }

      function deflateEnd (strm) {
        let status

        if (!strm/* == Z_NULL */ || !strm.state/* == Z_NULL */) {
          return Z_STREAM_ERROR
        }

        status = strm.state.status
        if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
        ) {
          return err(strm, Z_STREAM_ERROR)
        }

        strm.state = null

        return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK
      }

      /* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
      function deflateSetDictionary (strm, dictionary) {
        let dictLength = dictionary.length

        let s
        let str, n
        let wrap
        let avail
        let next
        let input
        let tmpDict

        if (!strm/* == Z_NULL */ || !strm.state/* == Z_NULL */) {
          return Z_STREAM_ERROR
        }

        s = strm.state
        wrap = s.wrap

        if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
          return Z_STREAM_ERROR
        }

        /* when using zlib wrappers, compute Adler-32 for provided dictionary */
        if (wrap === 1) {
        /* adler32(strm->adler, dictionary, dictLength); */
          strm.adler = adler32(strm.adler, dictionary, dictLength, 0)
        }

        s.wrap = 0 /* avoid computing Adler-32 in read_buf */

        /* if dictionary would fill window, just replace the history */
        if (dictLength >= s.w_size) {
          if (wrap === 0) { /* already empty otherwise */
          /** * CLEAR_HASH(s); ***/
            zero(s.head) // Fill with NIL (= 0);
            s.strstart = 0
            s.block_start = 0
            s.insert = 0
          }
          /* use the tail */
          // dictionary = dictionary.slice(dictLength - s.w_size);
          tmpDict = new utils.Buf8(s.w_size)
          utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0)
          dictionary = tmpDict
          dictLength = s.w_size
        }
        /* insert dictionary into window and hash */
        avail = strm.avail_in
        next = strm.next_in
        input = strm.input
        strm.avail_in = dictLength
        strm.next_in = 0
        strm.input = dictionary
        fill_window(s)
        while (s.lookahead >= MIN_MATCH) {
          str = s.strstart
          n = s.lookahead - (MIN_MATCH - 1)
          do {
          /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
            s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask

            s.prev[str & s.w_mask] = s.head[s.ins_h]

            s.head[s.ins_h] = str
            str++
          } while (--n)
          s.strstart = str
          s.lookahead = MIN_MATCH - 1
          fill_window(s)
        }
        s.strstart += s.lookahead
        s.block_start = s.strstart
        s.insert = s.lookahead
        s.lookahead = 0
        s.match_length = s.prev_length = MIN_MATCH - 1
        s.match_available = 0
        strm.next_in = next
        strm.input = input
        strm.avail_in = avail
        s.wrap = wrap
        return Z_OK
      }

      exports.deflateInit = deflateInit
      exports.deflateInit2 = deflateInit2
      exports.deflateReset = deflateReset
      exports.deflateResetKeep = deflateResetKeep
      exports.deflateSetHeader = deflateSetHeader
      exports.deflate = deflate
      exports.deflateEnd = deflateEnd
      exports.deflateSetDictionary = deflateSetDictionary
      exports.deflateInfo = 'pako deflate (from Nodeca project)'

    /* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/
    }, { '../utils/common': 44, './adler32': 45, './crc32': 47, './messages': 52, './trees': 53 }],
    49: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      // See state defs from inflate.js
      const BAD = 30 /* got a data error -- remain here until reset */
      const TYPE = 12 /* i: waiting for type bits, including last-flag bit */

      /*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
      module.exports = function inflate_fast (strm, start) {
        let state
        let _in /* local strm.input */
        let last /* have enough input while in < last */
        let _out /* local strm.output */
        let beg /* inflate()'s initial strm.output */
        let end /* while out < end, enough space available */
        // #ifdef INFLATE_STRICT
        let dmax /* maximum distance from zlib header */
        // #endif
        let wsize /* window size or zero if not using window */
        let whave /* valid bytes in the window */
        let wnext /* window write index */
        // Use `s_window` instead `window`, avoid conflict with instrumentation tools
        let s_window /* allocated sliding window, if wsize != 0 */
        let hold /* local strm.hold */
        let bits /* local strm.bits */
        let lcode /* local strm.lencode */
        let dcode /* local strm.distcode */
        let lmask /* mask for first level of length codes */
        let dmask /* mask for first level of distance codes */
        let here /* retrieved table entry */
        let op /* code bits, operation, extra bits, or */
        /*  window position, window bytes to copy */
        let len /* match length, unused bytes */
        let dist /* match distance */
        let from /* where to copy match from */
        let from_source

        let input, output // JS specific, because we have no pointers

        /* copy state to local variables */
        state = strm.state
        // here = state.here;
        _in = strm.next_in
        input = strm.input
        last = _in + (strm.avail_in - 5)
        _out = strm.next_out
        output = strm.output
        beg = _out - (start - strm.avail_out)
        end = _out + (strm.avail_out - 257)
        // #ifdef INFLATE_STRICT
        dmax = state.dmax
        // #endif
        wsize = state.wsize
        whave = state.whave
        wnext = state.wnext
        s_window = state.window
        hold = state.hold
        bits = state.bits
        lcode = state.lencode
        dcode = state.distcode
        lmask = (1 << state.lenbits) - 1
        dmask = (1 << state.distbits) - 1

        /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

        top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits
            bits += 8
            hold += input[_in++] << bits
            bits += 8
          }

          here = lcode[hold & lmask]

          dolen:
          for (;;) { // Goto emulation
            op = here >>> 24/* here.bits */
            hold >>>= op
            bits -= op
            op = (here >>> 16) & 0xff/* here.op */
            if (op === 0) { /* literal */
            // Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
              output[_out++] = here & 0xffff/* here.val */
            } else if (op & 16) { /* length base */
              len = here & 0xffff/* here.val */
              op &= 15 /* number of extra bits */
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits
                  bits += 8
                }
                len += hold & ((1 << op) - 1)
                hold >>>= op
                bits -= op
              }
              // Tracevv((stderr, "inflate:         length %u\n", len));
              if (bits < 15) {
                hold += input[_in++] << bits
                bits += 8
                hold += input[_in++] << bits
                bits += 8
              }
              here = dcode[hold & dmask]

              dodist:
              for (;;) { // goto emulation
                op = here >>> 24/* here.bits */
                hold >>>= op
                bits -= op
                op = (here >>> 16) & 0xff/* here.op */

                if (op & 16) { /* distance base */
                  dist = here & 0xffff/* here.val */
                  op &= 15 /* number of extra bits */
                  if (bits < op) {
                    hold += input[_in++] << bits
                    bits += 8
                    if (bits < op) {
                      hold += input[_in++] << bits
                      bits += 8
                    }
                  }
                  dist += hold & ((1 << op) - 1)
                  // #ifdef INFLATE_STRICT
                  if (dist > dmax) {
                    strm.msg = 'invalid distance too far back'
                    state.mode = BAD
                    break top
                  }
                  // #endif
                  hold >>>= op
                  bits -= op
                  // Tracevv((stderr, "inflate:         distance %u\n", dist));
                  op = _out - beg /* max distance in output */
                  if (dist > op) { /* see if copy from window */
                    op = dist - op /* distance back in window */
                    if (op > whave) {
                      if (state.sane) {
                        strm.msg = 'invalid distance too far back'
                        state.mode = BAD
                        break top
                      }

                    // (!) This block is disabled in zlib defaults,
                    // don't enable it for binary compatibility
                    // #ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                    //                if (len <= op - whave) {
                    //                  do {
                    //                    output[_out++] = 0;
                    //                  } while (--len);
                    //                  continue top;
                    //                }
                    //                len -= op - whave;
                    //                do {
                    //                  output[_out++] = 0;
                    //                } while (--op > whave);
                    //                if (op === 0) {
                    //                  from = _out - dist;
                    //                  do {
                    //                    output[_out++] = output[from++];
                    //                  } while (--len);
                    //                  continue top;
                    //                }
                    // #endif
                    }
                    from = 0 // window index
                    from_source = s_window
                    if (wnext === 0) { /* very common case */
                      from += wsize - op
                      if (op < len) { /* some from window */
                        len -= op
                        do {
                          output[_out++] = s_window[from++]
                        } while (--op)
                        from = _out - dist /* rest from output */
                        from_source = output
                      }
                    } else if (wnext < op) { /* wrap around window */
                      from += wsize + wnext - op
                      op -= wnext
                      if (op < len) { /* some from end of window */
                        len -= op
                        do {
                          output[_out++] = s_window[from++]
                        } while (--op)
                        from = 0
                        if (wnext < len) { /* some from start of window */
                          op = wnext
                          len -= op
                          do {
                            output[_out++] = s_window[from++]
                          } while (--op)
                          from = _out - dist /* rest from output */
                          from_source = output
                        }
                      }
                    } else { /* contiguous in window */
                      from += wnext - op
                      if (op < len) { /* some from window */
                        len -= op
                        do {
                          output[_out++] = s_window[from++]
                        } while (--op)
                        from = _out - dist /* rest from output */
                        from_source = output
                      }
                    }
                    while (len > 2) {
                      output[_out++] = from_source[from++]
                      output[_out++] = from_source[from++]
                      output[_out++] = from_source[from++]
                      len -= 3
                    }
                    if (len) {
                      output[_out++] = from_source[from++]
                      if (len > 1) {
                        output[_out++] = from_source[from++]
                      }
                    }
                  } else {
                    from = _out - dist /* copy direct from output */
                    do { /* minimum length is three */
                      output[_out++] = output[from++]
                      output[_out++] = output[from++]
                      output[_out++] = output[from++]
                      len -= 3
                    } while (len > 2)
                    if (len) {
                      output[_out++] = output[from++]
                      if (len > 1) {
                        output[_out++] = output[from++]
                      }
                    }
                  }
                } else if ((op & 64) === 0) { /* 2nd level distance code */
                  here = dcode[(here & 0xffff)/* here.val */ + (hold & ((1 << op) - 1))]
                  continue dodist
                } else {
                  strm.msg = 'invalid distance code'
                  state.mode = BAD
                  break top
                }

                break // need to emulate goto via "continue"
              }
            } else if ((op & 64) === 0) { /* 2nd level length code */
              here = lcode[(here & 0xffff)/* here.val */ + (hold & ((1 << op) - 1))]
              continue dolen
            } else if (op & 32) { /* end-of-block */
            // Tracevv((stderr, "inflate:         end of block\n"));
              state.mode = TYPE
              break top
            } else {
              strm.msg = 'invalid literal/length code'
              state.mode = BAD
              break top
            }

            break // need to emulate goto via "continue"
          }
        } while (_in < last && _out < end)

        /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
        len = bits >> 3
        _in -= len
        bits -= len << 3
        hold &= (1 << bits) - 1

        /* update state and return */
        strm.next_in = _in
        strm.next_out = _out
        strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last))
        strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end))
        state.hold = hold
        state.bits = bits
      }
    }, {}],
    50: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      const utils = require('../utils/common')
      const adler32 = require('./adler32')
      const crc32 = require('./crc32')
      const inflate_fast = require('./inffast')
      const inflate_table = require('./inftrees')

      const CODES = 0
      const LENS = 1
      const DISTS = 2

      /* Public constants ========================================================== */
      /* =========================================================================== */

      /* Allowed flush values; see deflate() and inflate() below for details */
      // var Z_NO_FLUSH      = 0;
      // var Z_PARTIAL_FLUSH = 1;
      // var Z_SYNC_FLUSH    = 2;
      // var Z_FULL_FLUSH    = 3;
      const Z_FINISH = 4
      const Z_BLOCK = 5
      const Z_TREES = 6

      /* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
      const Z_OK = 0
      const Z_STREAM_END = 1
      const Z_NEED_DICT = 2
      // var Z_ERRNO         = -1;
      const Z_STREAM_ERROR = -2
      const Z_DATA_ERROR = -3
      const Z_MEM_ERROR = -4
      const Z_BUF_ERROR = -5
      // var Z_VERSION_ERROR = -6;

      /* The deflate compression method */
      const Z_DEFLATED = 8

      /* STATES ==================================================================== */
      /* =========================================================================== */

      const HEAD = 1 /* i: waiting for magic header */
      const FLAGS = 2 /* i: waiting for method and flags (gzip) */
      const TIME = 3 /* i: waiting for modification time (gzip) */
      const OS = 4 /* i: waiting for extra flags and operating system (gzip) */
      const EXLEN = 5 /* i: waiting for extra length (gzip) */
      const EXTRA = 6 /* i: waiting for extra bytes (gzip) */
      const NAME = 7 /* i: waiting for end of file name (gzip) */
      const COMMENT = 8 /* i: waiting for end of comment (gzip) */
      const HCRC = 9 /* i: waiting for header crc (gzip) */
      const DICTID = 10 /* i: waiting for dictionary check value */
      const DICT = 11 /* waiting for inflateSetDictionary() call */
      const TYPE = 12 /* i: waiting for type bits, including last-flag bit */
      const TYPEDO = 13 /* i: same, but skip check to exit inflate on new block */
      const STORED = 14 /* i: waiting for stored size (length and complement) */
      const COPY_ = 15 /* i/o: same as COPY below, but only first time in */
      const COPY = 16 /* i/o: waiting for input or output to copy stored block */
      const TABLE = 17 /* i: waiting for dynamic block table lengths */
      const LENLENS = 18 /* i: waiting for code length code lengths */
      const CODELENS = 19 /* i: waiting for length/lit and distance code lengths */
      const LEN_ = 20 /* i: same as LEN below, but only first time in */
      const LEN = 21 /* i: waiting for length/lit/eob code */
      const LENEXT = 22 /* i: waiting for length extra bits */
      const DIST = 23 /* i: waiting for distance code */
      const DISTEXT = 24 /* i: waiting for distance extra bits */
      const MATCH = 25 /* o: waiting for output space to copy string */
      const LIT = 26 /* o: waiting for output space to write literal */
      const CHECK = 27 /* i: waiting for 32-bit check value */
      const LENGTH = 28 /* i: waiting for 32-bit length (gzip) */
      const DONE = 29 /* finished check, done -- remain here until reset */
      const BAD = 30 /* got a data error -- remain here until reset */
      const MEM = 31 /* got an inflate() memory error -- remain here until reset */
      const SYNC = 32 /* looking for synchronization bytes to restart inflate() */

      /* =========================================================================== */

      const ENOUGH_LENS = 852
      const ENOUGH_DISTS = 592
      // var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

      const MAX_WBITS = 15
      /* 32K LZ77 window */
      const DEF_WBITS = MAX_WBITS

      function zswap32 (q) {
        return (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24))
      }

      function InflateState () {
        this.mode = 0 /* current inflate mode */
        this.last = false /* true if processing last block */
        this.wrap = 0 /* bit 0 true for zlib, bit 1 true for gzip */
        this.havedict = false /* true if dictionary provided */
        this.flags = 0 /* gzip header method and flags (0 if zlib) */
        this.dmax = 0 /* zlib header max distance (INFLATE_STRICT) */
        this.check = 0 /* protected copy of check value */
        this.total = 0 /* protected copy of output count */
        // TODO: may be {}
        this.head = null /* where to save gzip header information */

        /* sliding window */
        this.wbits = 0 /* log base 2 of requested window size */
        this.wsize = 0 /* window size or zero if not using window */
        this.whave = 0 /* valid bytes in the window */
        this.wnext = 0 /* window write index */
        this.window = null /* allocated sliding window, if needed */

        /* bit accumulator */
        this.hold = 0 /* input bit accumulator */
        this.bits = 0 /* number of bits in "in" */

        /* for string and stored block copying */
        this.length = 0 /* literal or length of data to copy */
        this.offset = 0 /* distance back to copy string from */

        /* for table and code decoding */
        this.extra = 0 /* extra bits needed */

        /* fixed and dynamic code tables */
        this.lencode = null /* starting table for length/literal codes */
        this.distcode = null /* starting table for distance codes */
        this.lenbits = 0 /* index bits for lencode */
        this.distbits = 0 /* index bits for distcode */

        /* dynamic table building */
        this.ncode = 0 /* number of code length code lengths */
        this.nlen = 0 /* number of length code lengths */
        this.ndist = 0 /* number of distance code lengths */
        this.have = 0 /* number of code lengths in lens[] */
        this.next = null /* next available space in codes[] */

        this.lens = new utils.Buf16(320) /* temporary storage for code lengths */
        this.work = new utils.Buf16(288) /* work area for code table building */

        /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
        // this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
        this.lendyn = null /* dynamic table for length/literal codes (JS specific) */
        this.distdyn = null /* dynamic table for distance codes (JS specific) */
        this.sane = 0 /* if false, allow invalid distance too far */
        this.back = 0 /* bits back of last unprocessed length/lit */
        this.was = 0 /* initial length of match */
      }

      function inflateResetKeep (strm) {
        let state

        if (!strm || !strm.state) { return Z_STREAM_ERROR }
        state = strm.state
        strm.total_in = strm.total_out = state.total = 0
        strm.msg = '' /* Z_NULL */
        if (state.wrap) { /* to support ill-conceived Java test suite */
          strm.adler = state.wrap & 1
        }
        state.mode = HEAD
        state.last = 0
        state.havedict = 0
        state.dmax = 32768
        state.head = null/* Z_NULL */
        state.hold = 0
        state.bits = 0
        // state.lencode = state.distcode = state.next = state.codes;
        state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS)
        state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS)

        state.sane = 1
        state.back = -1
        // Tracev((stderr, "inflate: reset\n"));
        return Z_OK
      }

      function inflateReset (strm) {
        let state

        if (!strm || !strm.state) { return Z_STREAM_ERROR }
        state = strm.state
        state.wsize = 0
        state.whave = 0
        state.wnext = 0
        return inflateResetKeep(strm)
      }

      function inflateReset2 (strm, windowBits) {
        let wrap
        let state

        /* get the state */
        if (!strm || !strm.state) { return Z_STREAM_ERROR }
        state = strm.state

        /* extract wrap request from windowBits parameter */
        if (windowBits < 0) {
          wrap = 0
          windowBits = -windowBits
        } else {
          wrap = (windowBits >> 4) + 1
          if (windowBits < 48) {
            windowBits &= 15
          }
        }

        /* set number of window bits, free window if different */
        if (windowBits && (windowBits < 8 || windowBits > 15)) {
          return Z_STREAM_ERROR
        }
        if (state.window !== null && state.wbits !== windowBits) {
          state.window = null
        }

        /* update state and reset the rest of it */
        state.wrap = wrap
        state.wbits = windowBits
        return inflateReset(strm)
      }

      function inflateInit2 (strm, windowBits) {
        let ret
        let state

        if (!strm) { return Z_STREAM_ERROR }
        // strm.msg = Z_NULL;                 /* in case we return an error */

        state = new InflateState()

        // if (state === Z_NULL) return Z_MEM_ERROR;
        // Tracev((stderr, "inflate: allocated\n"));
        strm.state = state
        state.window = null/* Z_NULL */
        ret = inflateReset2(strm, windowBits)
        if (ret !== Z_OK) {
          strm.state = null/* Z_NULL */
        }
        return ret
      }

      function inflateInit (strm) {
        return inflateInit2(strm, DEF_WBITS)
      }

      /*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
      let virgin = true

      let lenfix, distfix // We have no pointers in JS, so keep tables separate

      function fixedtables (state) {
      /* build fixed huffman tables if first call (may not be thread safe) */
        if (virgin) {
          let sym

          lenfix = new utils.Buf32(512)
          distfix = new utils.Buf32(32)

          /* literal/length table */
          sym = 0
          while (sym < 144) { state.lens[sym++] = 8 }
          while (sym < 256) { state.lens[sym++] = 9 }
          while (sym < 280) { state.lens[sym++] = 7 }
          while (sym < 288) { state.lens[sym++] = 8 }

          inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 })

          /* distance table */
          sym = 0
          while (sym < 32) { state.lens[sym++] = 5 }

          inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 })

          /* do this just once */
          virgin = false
        }

        state.lencode = lenfix
        state.lenbits = 9
        state.distcode = distfix
        state.distbits = 5
      }

      /*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
      function updatewindow (strm, src, end, copy) {
        let dist
        const state = strm.state

        /* if it hasn't been done already, allocate space for the window */
        if (state.window === null) {
          state.wsize = 1 << state.wbits
          state.wnext = 0
          state.whave = 0

          state.window = new utils.Buf8(state.wsize)
        }

        /* copy state->wsize or less output bytes into the circular window */
        if (copy >= state.wsize) {
          utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0)
          state.wnext = 0
          state.whave = state.wsize
        } else {
          dist = state.wsize - state.wnext
          if (dist > copy) {
            dist = copy
          }
          // zmemcpy(state->window + state->wnext, end - copy, dist);
          utils.arraySet(state.window, src, end - copy, dist, state.wnext)
          copy -= dist
          if (copy) {
          // zmemcpy(state->window, end - copy, copy);
            utils.arraySet(state.window, src, end - copy, copy, 0)
            state.wnext = copy
            state.whave = state.wsize
          } else {
            state.wnext += dist
            if (state.wnext === state.wsize) { state.wnext = 0 }
            if (state.whave < state.wsize) { state.whave += dist }
          }
        }
        return 0
      }

      function inflate (strm, flush) {
        let state
        let input, output // input/output buffers
        let next /* next input INDEX */
        let put /* next output INDEX */
        let have, left /* available input and output */
        let hold /* bit buffer */
        let bits /* bits in bit buffer */
        let _in, _out /* save starting available input and output */
        let copy /* number of stored or match bytes to copy */
        let from /* where to copy match bytes from */
        let from_source
        let here = 0 /* current decoding table entry */
        let here_bits, here_op, here_val // paked "here" denormalized (JS specific)
        // var last;                   /* parent table entry */
        let last_bits, last_op, last_val // paked "last" denormalized (JS specific)
        let len /* length to copy for repeats, bits to drop */
        let ret /* return code */
        const hbuf = new utils.Buf8(4) /* buffer for gzip header crc calculation */
        let opts

        let n // temporary var for NEED_BITS

        const order = /* permutation of code lengths */
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]

        if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
          return Z_STREAM_ERROR
        }

        state = strm.state
        if (state.mode === TYPE) { state.mode = TYPEDO } /* skip check */

        // --- LOAD() ---
        put = strm.next_out
        output = strm.output
        left = strm.avail_out
        next = strm.next_in
        input = strm.input
        have = strm.avail_in
        hold = state.hold
        bits = state.bits
        // ---

        _in = have
        _out = left
        ret = Z_OK

        inf_leave: // goto emulation
        for (;;) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO
                break
              }
              //= == NEEDBITS(16);
              while (bits < 16) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              if ((state.wrap & 2) && hold === 0x8b1f) { /* gzip header */
                state.check = 0/* crc32(0L, Z_NULL, 0) */
                //= == CRC2(state.check, hold);
                hbuf[0] = hold & 0xff
                hbuf[1] = (hold >>> 8) & 0xff
                state.check = crc32(state.check, hbuf, 2, 0)
                //= ==//

                //= == INITBITS();
                hold = 0
                bits = 0
                //= ==//
                state.mode = FLAGS
                break
              }
              state.flags = 0 /* expect zlib header */
              if (state.head) {
                state.head.done = false
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 0xff)/* BITS(8) */ << 8) + (hold >> 8)) % 31) {
                strm.msg = 'incorrect header check'
                state.mode = BAD
                break
              }
              if ((hold & 0x0f)/* BITS(4) */ !== Z_DEFLATED) {
                strm.msg = 'unknown compression method'
                state.mode = BAD
                break
              }
              // --- DROPBITS(4) ---//
              hold >>>= 4
              bits -= 4
              // ---//
              len = (hold & 0x0f)/* BITS(4) */ + 8
              if (state.wbits === 0) {
                state.wbits = len
              } else if (len > state.wbits) {
                strm.msg = 'invalid window size'
                state.mode = BAD
                break
              }
              state.dmax = 1 << len
              // Tracev((stderr, "inflate:   zlib header ok\n"));
              strm.adler = state.check = 1/* adler32(0L, Z_NULL, 0) */
              state.mode = hold & 0x200 ? DICTID : TYPE
              //= == INITBITS();
              hold = 0
              bits = 0
              //= ==//
              break
            case FLAGS:
            //= == NEEDBITS(16); */
              while (bits < 16) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              state.flags = hold
              if ((state.flags & 0xff) !== Z_DEFLATED) {
                strm.msg = 'unknown compression method'
                state.mode = BAD
                break
              }
              if (state.flags & 0xe000) {
                strm.msg = 'unknown header flags set'
                state.mode = BAD
                break
              }
              if (state.head) {
                state.head.text = ((hold >> 8) & 1)
              }
              if (state.flags & 0x0200) {
              //= == CRC2(state.check, hold);
                hbuf[0] = hold & 0xff
                hbuf[1] = (hold >>> 8) & 0xff
                state.check = crc32(state.check, hbuf, 2, 0)
              //= ==//
              }
              //= == INITBITS();
              hold = 0
              bits = 0
              //= ==//
              state.mode = TIME
            /* falls through */
            case TIME:
            //= == NEEDBITS(32); */
              while (bits < 32) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              if (state.head) {
                state.head.time = hold
              }
              if (state.flags & 0x0200) {
              //= == CRC4(state.check, hold)
                hbuf[0] = hold & 0xff
                hbuf[1] = (hold >>> 8) & 0xff
                hbuf[2] = (hold >>> 16) & 0xff
                hbuf[3] = (hold >>> 24) & 0xff
                state.check = crc32(state.check, hbuf, 4, 0)
              //= ==
              }
              //= == INITBITS();
              hold = 0
              bits = 0
              //= ==//
              state.mode = OS
            /* falls through */
            case OS:
            //= == NEEDBITS(16); */
              while (bits < 16) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              if (state.head) {
                state.head.xflags = (hold & 0xff)
                state.head.os = (hold >> 8)
              }
              if (state.flags & 0x0200) {
              //= == CRC2(state.check, hold);
                hbuf[0] = hold & 0xff
                hbuf[1] = (hold >>> 8) & 0xff
                state.check = crc32(state.check, hbuf, 2, 0)
              //= ==//
              }
              //= == INITBITS();
              hold = 0
              bits = 0
              //= ==//
              state.mode = EXLEN
            /* falls through */
            case EXLEN:
              if (state.flags & 0x0400) {
              //= == NEEDBITS(16); */
                while (bits < 16) {
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                }
                //= ==//
                state.length = hold
                if (state.head) {
                  state.head.extra_len = hold
                }
                if (state.flags & 0x0200) {
                //= == CRC2(state.check, hold);
                  hbuf[0] = hold & 0xff
                  hbuf[1] = (hold >>> 8) & 0xff
                  state.check = crc32(state.check, hbuf, 2, 0)
                //= ==//
                }
                //= == INITBITS();
                hold = 0
                bits = 0
              //= ==//
              } else if (state.head) {
                state.head.extra = null/* Z_NULL */
              }
              state.mode = EXTRA
            /* falls through */
            case EXTRA:
              if (state.flags & 0x0400) {
                copy = state.length
                if (copy > have) { copy = have }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length
                    if (!state.head.extra) {
                    // Use untyped array for more convenient processing later
                      state.head.extra = new Array(state.head.extra_len)
                    }
                    utils.arraySet(
                      state.head.extra,
                      input,
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      copy,
                      /* len + copy > state.head.extra_max - len ? state.head.extra_max : copy, */
                      len
                    )
                  // zmemcpy(state.head.extra + len, next,
                  //        len + copy > state.head.extra_max ?
                  //        state.head.extra_max - len : copy);
                  }
                  if (state.flags & 0x0200) {
                    state.check = crc32(state.check, input, copy, next)
                  }
                  have -= copy
                  next += copy
                  state.length -= copy
                }
                if (state.length) { break inf_leave }
              }
              state.length = 0
              state.mode = NAME
            /* falls through */
            case NAME:
              if (state.flags & 0x0800) {
                if (have === 0) { break inf_leave }
                copy = 0
                do {
                // TODO: 2 or 1 bytes?
                  len = input[next + copy++]
                  /* use constant limit because in js we should not preallocate memory */
                  if (state.head && len &&
                (state.length < 65536 /* state.head.name_max */)) {
                    state.head.name += String.fromCharCode(len)
                  }
                } while (len && copy < have)

                if (state.flags & 0x0200) {
                  state.check = crc32(state.check, input, copy, next)
                }
                have -= copy
                next += copy
                if (len) { break inf_leave }
              } else if (state.head) {
                state.head.name = null
              }
              state.length = 0
              state.mode = COMMENT
            /* falls through */
            case COMMENT:
              if (state.flags & 0x1000) {
                if (have === 0) { break inf_leave }
                copy = 0
                do {
                  len = input[next + copy++]
                  /* use constant limit because in js we should not preallocate memory */
                  if (state.head && len &&
                (state.length < 65536 /* state.head.comm_max */)) {
                    state.head.comment += String.fromCharCode(len)
                  }
                } while (len && copy < have)
                if (state.flags & 0x0200) {
                  state.check = crc32(state.check, input, copy, next)
                }
                have -= copy
                next += copy
                if (len) { break inf_leave }
              } else if (state.head) {
                state.head.comment = null
              }
              state.mode = HCRC
            /* falls through */
            case HCRC:
              if (state.flags & 0x0200) {
              //= == NEEDBITS(16); */
                while (bits < 16) {
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                }
                //= ==//
                if (hold !== (state.check & 0xffff)) {
                  strm.msg = 'header crc mismatch'
                  state.mode = BAD
                  break
                }
                //= == INITBITS();
                hold = 0
                bits = 0
              //= ==//
              }
              if (state.head) {
                state.head.hcrc = ((state.flags >> 9) & 1)
                state.head.done = true
              }
              strm.adler = state.check = 0
              state.mode = TYPE
              break
            case DICTID:
            //= == NEEDBITS(32); */
              while (bits < 32) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              strm.adler = state.check = zswap32(hold)
              //= == INITBITS();
              hold = 0
              bits = 0
              //= ==//
              state.mode = DICT
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
              // --- RESTORE() ---
                strm.next_out = put
                strm.avail_out = left
                strm.next_in = next
                strm.avail_in = have
                state.hold = hold
                state.bits = bits
                // ---
                return Z_NEED_DICT
              }
              strm.adler = state.check = 1/* adler32(0L, Z_NULL, 0) */
              state.mode = TYPE
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave }
            /* falls through */
            case TYPEDO:
              if (state.last) {
              // --- BYTEBITS() ---//
                hold >>>= bits & 7
                bits -= bits & 7
                // ---//
                state.mode = CHECK
                break
              }
              //= == NEEDBITS(3); */
              while (bits < 3) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              state.last = (hold & 0x01)/* BITS(1) */
              // --- DROPBITS(1) ---//
              hold >>>= 1
              bits -= 1
              // ---//

              switch ((hold & 0x03)/* BITS(2) */) {
                case 0: /* stored block */
                // Tracev((stderr, "inflate:     stored block%s\n",
                //        state.last ? " (last)" : ""));
                  state.mode = STORED
                  break
                case 1: /* fixed block */
                  fixedtables(state)
                  // Tracev((stderr, "inflate:     fixed codes block%s\n",
                  //        state.last ? " (last)" : ""));
                  state.mode = LEN_ /* decode codes */
                  if (flush === Z_TREES) {
                  // --- DROPBITS(2) ---//
                    hold >>>= 2
                    bits -= 2
                    // ---//
                    break inf_leave
                  }
                  break
                case 2: /* dynamic block */
                // Tracev((stderr, "inflate:     dynamic codes block%s\n",
                //        state.last ? " (last)" : ""));
                  state.mode = TABLE
                  break
                case 3:
                  strm.msg = 'invalid block type'
                  state.mode = BAD
              }
              // --- DROPBITS(2) ---//
              hold >>>= 2
              bits -= 2
              // ---//
              break
            case STORED:
            // --- BYTEBITS() ---// /* go to byte boundary */
              hold >>>= bits & 7
              bits -= bits & 7
              // ---//
              //= == NEEDBITS(32); */
              while (bits < 32) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
                strm.msg = 'invalid stored block lengths'
                state.mode = BAD
                break
              }
              state.length = hold & 0xffff
              // Tracev((stderr, "inflate:       stored length %u\n",
              //        state.length));
              //= == INITBITS();
              hold = 0
              bits = 0
              //= ==//
              state.mode = COPY_
              if (flush === Z_TREES) { break inf_leave }
            /* falls through */
            case COPY_:
              state.mode = COPY
            /* falls through */
            case COPY:
              copy = state.length
              if (copy) {
                if (copy > have) { copy = have }
                if (copy > left) { copy = left }
                if (copy === 0) { break inf_leave }
                // --- zmemcpy(put, next, copy); ---
                utils.arraySet(output, input, next, copy, put)
                // ---//
                have -= copy
                next += copy
                left -= copy
                put += copy
                state.length -= copy
                break
              }
              // Tracev((stderr, "inflate:       stored end\n"));
              state.mode = TYPE
              break
            case TABLE:
            //= == NEEDBITS(14); */
              while (bits < 14) {
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              }
              //= ==//
              state.nlen = (hold & 0x1f)/* BITS(5) */ + 257
              // --- DROPBITS(5) ---//
              hold >>>= 5
              bits -= 5
              // ---//
              state.ndist = (hold & 0x1f)/* BITS(5) */ + 1
              // --- DROPBITS(5) ---//
              hold >>>= 5
              bits -= 5
              // ---//
              state.ncode = (hold & 0x0f)/* BITS(4) */ + 4
              // --- DROPBITS(4) ---//
              hold >>>= 4
              bits -= 4
              // ---//
              // #ifndef PKZIP_BUG_WORKAROUND
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = 'too many length or distance symbols'
                state.mode = BAD
                break
              }
              // #endif
              // Tracev((stderr, "inflate:       table sizes ok\n"));
              state.have = 0
              state.mode = LENLENS
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
              //= == NEEDBITS(3);
                while (bits < 3) {
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                }
                //= ==//
                state.lens[order[state.have++]] = (hold & 0x07)// BITS(3);
                // --- DROPBITS(3) ---//
                hold >>>= 3
                bits -= 3
              // ---//
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0
              }
              // We have separate tables & no pointers. 2 commented lines below not needed.
              // state.next = state.codes;
              // state.lencode = state.next;
              // Switch to use dynamic table
              state.lencode = state.lendyn
              state.lenbits = 7

              opts = { bits: state.lenbits }
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts)
              state.lenbits = opts.bits

              if (ret) {
                strm.msg = 'invalid code lengths set'
                state.mode = BAD
                break
              }
              // Tracev((stderr, "inflate:       code lengths ok\n"));
              state.have = 0
              state.mode = CODELENS
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (;;) {
                  here = state.lencode[hold & ((1 << state.lenbits) - 1)]/* BITS(state.lenbits) */
                  here_bits = here >>> 24
                  here_op = (here >>> 16) & 0xff
                  here_val = here & 0xffff

                  if ((here_bits) <= bits) { break }
                  // --- PULLBYTE() ---//
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                // ---//
                }
                if (here_val < 16) {
                // --- DROPBITS(here.bits) ---//
                  hold >>>= here_bits
                  bits -= here_bits
                  // ---//
                  state.lens[state.have++] = here_val
                } else {
                  if (here_val === 16) {
                  //= == NEEDBITS(here.bits + 2);
                    n = here_bits + 2
                    while (bits < n) {
                      if (have === 0) { break inf_leave }
                      have--
                      hold += input[next++] << bits
                      bits += 8
                    }
                    //= ==//
                    // --- DROPBITS(here.bits) ---//
                    hold >>>= here_bits
                    bits -= here_bits
                    // ---//
                    if (state.have === 0) {
                      strm.msg = 'invalid bit length repeat'
                      state.mode = BAD
                      break
                    }
                    len = state.lens[state.have - 1]
                    copy = 3 + (hold & 0x03)// BITS(2);
                    // --- DROPBITS(2) ---//
                    hold >>>= 2
                    bits -= 2
                  // ---//
                  } else if (here_val === 17) {
                  //= == NEEDBITS(here.bits + 3);
                    n = here_bits + 3
                    while (bits < n) {
                      if (have === 0) { break inf_leave }
                      have--
                      hold += input[next++] << bits
                      bits += 8
                    }
                    //= ==//
                    // --- DROPBITS(here.bits) ---//
                    hold >>>= here_bits
                    bits -= here_bits
                    // ---//
                    len = 0
                    copy = 3 + (hold & 0x07)// BITS(3);
                    // --- DROPBITS(3) ---//
                    hold >>>= 3
                    bits -= 3
                  // ---//
                  } else {
                  //= == NEEDBITS(here.bits + 7);
                    n = here_bits + 7
                    while (bits < n) {
                      if (have === 0) { break inf_leave }
                      have--
                      hold += input[next++] << bits
                      bits += 8
                    }
                    //= ==//
                    // --- DROPBITS(here.bits) ---//
                    hold >>>= here_bits
                    bits -= here_bits
                    // ---//
                    len = 0
                    copy = 11 + (hold & 0x7f)// BITS(7);
                    // --- DROPBITS(7) ---//
                    hold >>>= 7
                    bits -= 7
                  // ---//
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = 'invalid bit length repeat'
                    state.mode = BAD
                    break
                  }
                  while (copy--) {
                    state.lens[state.have++] = len
                  }
                }
              }

              /* handle error breaks in while */
              if (state.mode === BAD) { break }

              /* check for end-of-block code (better have one) */
              if (state.lens[256] === 0) {
                strm.msg = 'invalid code -- missing end-of-block'
                state.mode = BAD
                break
              }

              /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
              state.lenbits = 9

              opts = { bits: state.lenbits }
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts)
              // We have separate tables & no pointers. 2 commented lines below not needed.
              // state.next_index = opts.table_index;
              state.lenbits = opts.bits
              // state.lencode = state.next;

              if (ret) {
                strm.msg = 'invalid literal/lengths set'
                state.mode = BAD
                break
              }

              state.distbits = 6
              // state.distcode.copy(state.codes);
              // Switch to use dynamic table
              state.distcode = state.distdyn
              opts = { bits: state.distbits }
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts)
              // We have separate tables & no pointers. 2 commented lines below not needed.
              // state.next_index = opts.table_index;
              state.distbits = opts.bits
              // state.distcode = state.next;

              if (ret) {
                strm.msg = 'invalid distances set'
                state.mode = BAD
                break
              }
              // Tracev((stderr, 'inflate:       codes ok\n'));
              state.mode = LEN_
              if (flush === Z_TREES) { break inf_leave }
            /* falls through */
            case LEN_:
              state.mode = LEN
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
              // --- RESTORE() ---
                strm.next_out = put
                strm.avail_out = left
                strm.next_in = next
                strm.avail_in = have
                state.hold = hold
                state.bits = bits
                // ---
                inflate_fast(strm, _out)
                // --- LOAD() ---
                put = strm.next_out
                output = strm.output
                left = strm.avail_out
                next = strm.next_in
                input = strm.input
                have = strm.avail_in
                hold = state.hold
                bits = state.bits
                // ---

                if (state.mode === TYPE) {
                  state.back = -1
                }
                break
              }
              state.back = 0
              for (;;) {
                here = state.lencode[hold & ((1 << state.lenbits) - 1)] /* BITS(state.lenbits) */
                here_bits = here >>> 24
                here_op = (here >>> 16) & 0xff
                here_val = here & 0xffff

                if (here_bits <= bits) { break }
                // --- PULLBYTE() ---//
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              // ---//
              }
              if (here_op && (here_op & 0xf0) === 0) {
                last_bits = here_bits
                last_op = here_op
                last_val = here_val
                for (;;) {
                  here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/* BITS(last.bits + last.op) */ >> last_bits)]
                  here_bits = here >>> 24
                  here_op = (here >>> 16) & 0xff
                  here_val = here & 0xffff

                  if ((last_bits + here_bits) <= bits) { break }
                  // --- PULLBYTE() ---//
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                // ---//
                }
                // --- DROPBITS(last.bits) ---//
                hold >>>= last_bits
                bits -= last_bits
                // ---//
                state.back += last_bits
              }
              // --- DROPBITS(here.bits) ---//
              hold >>>= here_bits
              bits -= here_bits
              // ---//
              state.back += here_bits
              state.length = here_val
              if (here_op === 0) {
              // Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
              //        "inflate:         literal '%c'\n" :
              //        "inflate:         literal 0x%02x\n", here.val));
                state.mode = LIT
                break
              }
              if (here_op & 32) {
              // Tracevv((stderr, "inflate:         end of block\n"));
                state.back = -1
                state.mode = TYPE
                break
              }
              if (here_op & 64) {
                strm.msg = 'invalid literal/length code'
                state.mode = BAD
                break
              }
              state.extra = here_op & 15
              state.mode = LENEXT
            /* falls through */
            case LENEXT:
              if (state.extra) {
              //= == NEEDBITS(state.extra);
                n = state.extra
                while (bits < n) {
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                }
                //= ==//
                state.length += hold & ((1 << state.extra) - 1)/* BITS(state.extra) */
                // --- DROPBITS(state.extra) ---//
                hold >>>= state.extra
                bits -= state.extra
                // ---//
                state.back += state.extra
              }
              // Tracevv((stderr, "inflate:         length %u\n", state.length));
              state.was = state.length
              state.mode = DIST
            /* falls through */
            case DIST:
              for (;;) {
                here = state.distcode[hold & ((1 << state.distbits) - 1)]/* BITS(state.distbits) */
                here_bits = here >>> 24
                here_op = (here >>> 16) & 0xff
                here_val = here & 0xffff

                if ((here_bits) <= bits) { break }
                // --- PULLBYTE() ---//
                if (have === 0) { break inf_leave }
                have--
                hold += input[next++] << bits
                bits += 8
              // ---//
              }
              if ((here_op & 0xf0) === 0) {
                last_bits = here_bits
                last_op = here_op
                last_val = here_val
                for (;;) {
                  here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/* BITS(last.bits + last.op) */ >> last_bits)]
                  here_bits = here >>> 24
                  here_op = (here >>> 16) & 0xff
                  here_val = here & 0xffff

                  if ((last_bits + here_bits) <= bits) { break }
                  // --- PULLBYTE() ---//
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                // ---//
                }
                // --- DROPBITS(last.bits) ---//
                hold >>>= last_bits
                bits -= last_bits
                // ---//
                state.back += last_bits
              }
              // --- DROPBITS(here.bits) ---//
              hold >>>= here_bits
              bits -= here_bits
              // ---//
              state.back += here_bits
              if (here_op & 64) {
                strm.msg = 'invalid distance code'
                state.mode = BAD
                break
              }
              state.offset = here_val
              state.extra = (here_op) & 15
              state.mode = DISTEXT
            /* falls through */
            case DISTEXT:
              if (state.extra) {
              //= == NEEDBITS(state.extra);
                n = state.extra
                while (bits < n) {
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                }
                //= ==//
                state.offset += hold & ((1 << state.extra) - 1)/* BITS(state.extra) */
                // --- DROPBITS(state.extra) ---//
                hold >>>= state.extra
                bits -= state.extra
                // ---//
                state.back += state.extra
              }
              // #ifdef INFLATE_STRICT
              if (state.offset > state.dmax) {
                strm.msg = 'invalid distance too far back'
                state.mode = BAD
                break
              }
              // #endif
              // Tracevv((stderr, "inflate:         distance %u\n", state.offset));
              state.mode = MATCH
            /* falls through */
            case MATCH:
              if (left === 0) { break inf_leave }
              copy = _out - left
              if (state.offset > copy) { /* copy from window */
                copy = state.offset - copy
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = 'invalid distance too far back'
                    state.mode = BAD
                    break
                  }
                  // (!) This block is disabled in zlib defaults,
                  // don't enable it for binary compatibility
                  // #ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                  //          Trace((stderr, "inflate.c too far\n"));
                  //          copy -= state.whave;
                  //          if (copy > state.length) { copy = state.length; }
                  //          if (copy > left) { copy = left; }
                  //          left -= copy;
                  //          state.length -= copy;
                  //          do {
                  //            output[put++] = 0;
                  //          } while (--copy);
                  //          if (state.length === 0) { state.mode = LEN; }
                  //          break;
                  // #endif
                }
                if (copy > state.wnext) {
                  copy -= state.wnext
                  from = state.wsize - copy
                } else {
                  from = state.wnext - copy
                }
                if (copy > state.length) { copy = state.length }
                from_source = state.window
              } else { /* copy from output */
                from_source = output
                from = put - state.offset
                copy = state.length
              }
              if (copy > left) { copy = left }
              left -= copy
              state.length -= copy
              do {
                output[put++] = from_source[from++]
              } while (--copy)
              if (state.length === 0) { state.mode = LEN }
              break
            case LIT:
              if (left === 0) { break inf_leave }
              output[put++] = state.length
              left--
              state.mode = LEN
              break
            case CHECK:
              if (state.wrap) {
              //= == NEEDBITS(32);
                while (bits < 32) {
                  if (have === 0) { break inf_leave }
                  have--
                  // Use '|' instead of '+' to make sure that result is signed
                  hold |= input[next++] << bits
                  bits += 8
                }
                //= ==//
                _out -= left
                strm.total_out += _out
                state.total += _out
                if (_out) {
                  strm.adler = state.check =
                /* UPDATE(state.check, put - _out, _out); */
                (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out))
                }
                _out = left
                // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = 'incorrect data check'
                  state.mode = BAD
                  break
                }
                //= == INITBITS();
                hold = 0
                bits = 0
              //= ==//
              // Tracev((stderr, "inflate:   check matches trailer\n"));
              }
              state.mode = LENGTH
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
              //= == NEEDBITS(32);
                while (bits < 32) {
                  if (have === 0) { break inf_leave }
                  have--
                  hold += input[next++] << bits
                  bits += 8
                }
                //= ==//
                if (hold !== (state.total & 0xffffffff)) {
                  strm.msg = 'incorrect length check'
                  state.mode = BAD
                  break
                }
                //= == INITBITS();
                hold = 0
                bits = 0
              //= ==//
              // Tracev((stderr, "inflate:   length matches trailer\n"));
              }
              state.mode = DONE
            /* falls through */
            case DONE:
              ret = Z_STREAM_END
              break inf_leave
            case BAD:
              ret = Z_DATA_ERROR
              break inf_leave
            case MEM:
              return Z_MEM_ERROR
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR
          }
        }

        // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

        /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

        // --- RESTORE() ---
        strm.next_out = put
        strm.avail_out = left
        strm.next_in = next
        strm.avail_in = have
        state.hold = hold
        state.bits = bits
        // ---

        if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
          if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
            state.mode = MEM
            return Z_MEM_ERROR
          }
        }
        _in -= strm.avail_in
        _out -= strm.avail_out
        strm.total_in += _in
        strm.total_out += _out
        state.total += _out
        if (state.wrap && _out) {
          strm.adler = state.check = /* UPDATE(state.check, strm.next_out - _out, _out); */
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out))
        }
        strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0)
        if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
          ret = Z_BUF_ERROR
        }
        return ret
      }

      function inflateEnd (strm) {
        if (!strm || !strm.state /* || strm->zfree == (free_func)0 */) {
          return Z_STREAM_ERROR
        }

        const state = strm.state
        if (state.window) {
          state.window = null
        }
        strm.state = null
        return Z_OK
      }

      function inflateGetHeader (strm, head) {
        let state

        /* check state */
        if (!strm || !strm.state) { return Z_STREAM_ERROR }
        state = strm.state
        if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR }

        /* save header structure */
        state.head = head
        head.done = false
        return Z_OK
      }

      function inflateSetDictionary (strm, dictionary) {
        const dictLength = dictionary.length

        let state
        let dictid
        let ret

        /* check state */
        if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR }
        state = strm.state

        if (state.wrap !== 0 && state.mode !== DICT) {
          return Z_STREAM_ERROR
        }

        /* check for correct dictionary identifier */
        if (state.mode === DICT) {
          dictid = 1 /* adler32(0, null, 0) */
          /* dictid = adler32(dictid, dictionary, dictLength); */
          dictid = adler32(dictid, dictionary, dictLength, 0)
          if (dictid !== state.check) {
            return Z_DATA_ERROR
          }
        }
        /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
        ret = updatewindow(strm, dictionary, dictLength, dictLength)
        if (ret) {
          state.mode = MEM
          return Z_MEM_ERROR
        }
        state.havedict = 1
        // Tracev((stderr, "inflate:   dictionary set\n"));
        return Z_OK
      }

      exports.inflateReset = inflateReset
      exports.inflateReset2 = inflateReset2
      exports.inflateResetKeep = inflateResetKeep
      exports.inflateInit = inflateInit
      exports.inflateInit2 = inflateInit2
      exports.inflate = inflate
      exports.inflateEnd = inflateEnd
      exports.inflateGetHeader = inflateGetHeader
      exports.inflateSetDictionary = inflateSetDictionary
      exports.inflateInfo = 'pako inflate (from Nodeca project)'

    /* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/
    }, { '../utils/common': 44, './adler32': 45, './crc32': 47, './inffast': 49, './inftrees': 51 }],
    51: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      const utils = require('../utils/common')

      const MAXBITS = 15
      const ENOUGH_LENS = 852
      const ENOUGH_DISTS = 592
      // var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

      const CODES = 0
      const LENS = 1
      const DISTS = 2

      const lbase = [ /* Length codes 257..285 base */
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
        35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
      ]

      const lext = [ /* Length codes 257..285 extra */
        16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
        19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
      ]

      const dbase = [ /* Distance codes 0..29 base */
        1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
        257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
        8193, 12289, 16385, 24577, 0, 0
      ]

      const dext = [ /* Distance codes 0..29 extra */
        16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
        23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
        28, 28, 29, 29, 64, 64
      ]

      module.exports = function inflate_table (type, lens, lens_index, codes, table, table_index, work, opts) {
        const bits = opts.bits
        // here = opts.here; /* table entry for duplication */

        let len = 0 /* a code's length in bits */
        let sym = 0 /* index of code symbols */
        let min = 0; let max = 0 /* minimum and maximum code lengths */
        let root = 0 /* number of index bits for root table */
        let curr = 0 /* number of index bits for current table */
        let drop = 0 /* code bits to drop for sub-table */
        let left = 0 /* number of prefix codes available */
        let used = 0 /* code entries in table used */
        let huff = 0 /* Huffman code */
        let incr /* for incrementing code, index */
        let fill /* index for replicating entries */
        let low /* low bits for current root entry */
        let mask /* mask for low root bits */
        let next /* next available space in table */
        let base = null /* base value table to use */
        let base_index = 0
        //  var shoextra;    /* extra bits table to use */
        let end /* use base and extra for symbol > end */
        const count = new utils.Buf16(MAXBITS + 1) // [MAXBITS+1];    /* number of codes of each length */
        const offs = new utils.Buf16(MAXBITS + 1) // [MAXBITS+1];     /* offsets in table for each length */
        let extra = null
        let extra_index = 0

        let here_bits, here_op, here_val

        /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

        /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
        for (len = 0; len <= MAXBITS; len++) {
          count[len] = 0
        }
        for (sym = 0; sym < codes; sym++) {
          count[lens[lens_index + sym]]++
        }

        /* bound code lengths, force root to be within code lengths */
        root = bits
        for (max = MAXBITS; max >= 1; max--) {
          if (count[max] !== 0) { break }
        }
        if (root > max) {
          root = max
        }
        if (max === 0) { /* no symbols to code at all */
        // table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
        // table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
        // table.val[opts.table_index++] = 0;   //here.val = (var short)0;
          table[table_index++] = (1 << 24) | (64 << 16) | 0

          // table.op[opts.table_index] = 64;
          // table.bits[opts.table_index] = 1;
          // table.val[opts.table_index++] = 0;
          table[table_index++] = (1 << 24) | (64 << 16) | 0

          opts.bits = 1
          return 0 /* no symbols, but wait for decoding to report error */
        }
        for (min = 1; min < max; min++) {
          if (count[min] !== 0) { break }
        }
        if (root < min) {
          root = min
        }

        /* check for an over-subscribed or incomplete set of lengths */
        left = 1
        for (len = 1; len <= MAXBITS; len++) {
          left <<= 1
          left -= count[len]
          if (left < 0) {
            return -1
          } /* over-subscribed */
        }
        if (left > 0 && (type === CODES || max !== 1)) {
          return -1 /* incomplete set */
        }

        /* generate offsets into symbol table for each length for sorting */
        offs[1] = 0
        for (len = 1; len < MAXBITS; len++) {
          offs[len + 1] = offs[len] + count[len]
        }

        /* sort symbols by length, by symbol order within each length */
        for (sym = 0; sym < codes; sym++) {
          if (lens[lens_index + sym] !== 0) {
            work[offs[lens[lens_index + sym]]++] = sym
          }
        }

        /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

        /* set up for code type */
        // poor man optimization - use if-else instead of switch,
        // to avoid deopts in old v8
        if (type === CODES) {
          base = extra = work /* dummy value--not used */
          end = 19
        } else if (type === LENS) {
          base = lbase
          base_index -= 257
          extra = lext
          extra_index -= 257
          end = 256
        } else { /* DISTS */
          base = dbase
          extra = dext
          end = -1
        }

        /* initialize opts for loop */
        huff = 0 /* starting code */
        sym = 0 /* starting code symbol */
        len = min /* starting code length */
        next = table_index /* current table to fill in */
        curr = root /* current table index bits */
        drop = 0 /* current bits to drop from code for index */
        low = -1 /* trigger new sub-table when len > root */
        used = 1 << root /* use root table entries */
        mask = used - 1 /* mask for comparing low */

        /* check available table space */
        if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
          return 1
        }

        /* process all codes and make table entries */
        for (;;) {
        /* create table entry */
          here_bits = len - drop
          if (work[sym] < end) {
            here_op = 0
            here_val = work[sym]
          } else if (work[sym] > end) {
            here_op = extra[extra_index + work[sym]]
            here_val = base[base_index + work[sym]]
          } else {
            here_op = 32 + 64 /* end of block */
            here_val = 0
          }

          /* replicate for those indices with low len bits equal to huff */
          incr = 1 << (len - drop)
          fill = 1 << curr
          min = fill /* save offset to next table */
          do {
            fill -= incr
            table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val | 0
          } while (fill !== 0)

          /* backwards increment the len-bit code huff */
          incr = 1 << (len - 1)
          while (huff & incr) {
            incr >>= 1
          }
          if (incr !== 0) {
            huff &= incr - 1
            huff += incr
          } else {
            huff = 0
          }

          /* go to next symbol, update count, len */
          sym++
          if (--count[len] === 0) {
            if (len === max) { break }
            len = lens[lens_index + work[sym]]
          }

          /* create new sub-table if needed */
          if (len > root && (huff & mask) !== low) {
          /* if first time, transition to sub-tables */
            if (drop === 0) {
              drop = root
            }

            /* increment past last table */
            next += min /* here min is 1 << curr */

            /* determine length of next table */
            curr = len - drop
            left = 1 << curr
            while (curr + drop < max) {
              left -= count[curr + drop]
              if (left <= 0) { break }
              curr++
              left <<= 1
            }

            /* check for enough space */
            used += 1 << curr
            if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
              return 1
            }

            /* point entry in root table to sub-table */
            low = huff & mask
            /* table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index; */
            table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0
          }
        }

        /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
        if (huff !== 0) {
        // table.op[next + huff] = 64;            /* invalid code marker */
        // table.bits[next + huff] = len - drop;
        // table.val[next + huff] = 0;
          table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0
        }

        /* set return parameters */
        // opts.table_index += used;
        opts.bits = root
        return 0
      }
    }, { '../utils/common': 44 }],
    52: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      module.exports = {
        2: 'need dictionary', /* Z_NEED_DICT       2  */
        1: 'stream end', /* Z_STREAM_END      1  */
        0: '', /* Z_OK              0  */
        '-1': 'file error', /* Z_ERRNO         (-1) */
        '-2': 'stream error', /* Z_STREAM_ERROR  (-2) */
        '-3': 'data error', /* Z_DATA_ERROR    (-3) */
        '-4': 'insufficient memory', /* Z_MEM_ERROR     (-4) */
        '-5': 'buffer error', /* Z_BUF_ERROR     (-5) */
        '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */
      }
    }, {}],
    53: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      /* eslint-disable space-unary-ops */

      const utils = require('../utils/common')

      /* Public constants ========================================================== */
      /* =========================================================================== */

      // var Z_FILTERED          = 1;
      // var Z_HUFFMAN_ONLY      = 2;
      // var Z_RLE               = 3;
      const Z_FIXED = 4
      // var Z_DEFAULT_STRATEGY  = 0;

      /* Possible values of the data_type field (though see inflate()) */
      const Z_BINARY = 0
      const Z_TEXT = 1
      // var Z_ASCII             = 1; // = Z_TEXT
      const Z_UNKNOWN = 2

      /* ============================================================================ */

      function zero (buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0 } }

      // From zutil.h

      const STORED_BLOCK = 0
      const STATIC_TREES = 1
      const DYN_TREES = 2
      /* The three kinds of block type */

      const MIN_MATCH = 3
      const MAX_MATCH = 258
      /* The minimum and maximum match lengths */

      // From deflate.h
      /* ===========================================================================
 * Internal compression state.
 */

      const LENGTH_CODES = 29
      /* number of length codes, not counting the special END_BLOCK code */

      const LITERALS = 256
      /* number of literal bytes 0..255 */

      const L_CODES = LITERALS + 1 + LENGTH_CODES
      /* number of Literal or Length codes, including the END_BLOCK code */

      const D_CODES = 30
      /* number of distance codes */

      const BL_CODES = 19
      /* number of codes used to transfer the bit lengths */

      const HEAP_SIZE = 2 * L_CODES + 1
      /* maximum heap size */

      const MAX_BITS = 15
      /* All codes must not exceed MAX_BITS bits */

      const Buf_size = 16
      /* size of bit buffer in bi_buf */

      /* ===========================================================================
 * Constants
 */

      const MAX_BL_BITS = 7
      /* Bit length codes must not exceed MAX_BL_BITS bits */

      const END_BLOCK = 256
      /* end of block literal code */

      const REP_3_6 = 16
      /* repeat previous bit length 3-6 times (2 bits of repeat count) */

      const REPZ_3_10 = 17
      /* repeat a zero length 3-10 times  (3 bits of repeat count) */

      const REPZ_11_138 = 18
      /* repeat a zero length 11-138 times  (7 bits of repeat count) */

      /* eslint-disable comma-spacing,array-bracket-spacing */
      const extra_lbits = /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]

      const extra_dbits = /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]

      const extra_blbits = /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]

      const bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]
      /* eslint-enable comma-spacing,array-bracket-spacing */

      /* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

      /* ===========================================================================
 * Local data. These are initialized only once.
 */

      // We pre-fill arrays with 0 to avoid uninitialized gaps

      const DIST_CODE_LEN = 512 /* see definition of array dist_code below */

      // !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
      const static_ltree = new Array((L_CODES + 2) * 2)
      zero(static_ltree)
      /* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

      const static_dtree = new Array(D_CODES * 2)
      zero(static_dtree)
      /* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

      const _dist_code = new Array(DIST_CODE_LEN)
      zero(_dist_code)
      /* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

      const _length_code = new Array(MAX_MATCH - MIN_MATCH + 1)
      zero(_length_code)
      /* length code for each normalized match length (0 == MIN_MATCH) */

      const base_length = new Array(LENGTH_CODES)
      zero(base_length)
      /* First normalized length for each code (0 = MIN_MATCH) */

      const base_dist = new Array(D_CODES)
      zero(base_dist)
      /* First normalized distance for each code (0 = distance of 1) */

      function StaticTreeDesc (static_tree, extra_bits, extra_base, elems, max_length) {
        this.static_tree = static_tree /* static tree or NULL */
        this.extra_bits = extra_bits /* extra bits for each code or NULL */
        this.extra_base = extra_base /* base index for extra_bits */
        this.elems = elems /* max number of elements in the tree */
        this.max_length = max_length /* max bit length for the codes */

        // show if `static_tree` has data or dummy - needed for monomorphic objects
        this.has_stree = static_tree && static_tree.length
      }

      let static_l_desc
      let static_d_desc
      let static_bl_desc

      function TreeDesc (dyn_tree, stat_desc) {
        this.dyn_tree = dyn_tree /* the dynamic tree */
        this.max_code = 0 /* largest code with non zero frequency */
        this.stat_desc = stat_desc /* the corresponding static tree */
      }

      function d_code (dist) {
        return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)]
      }

      /* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
      function put_short (s, w) {
        //    put_byte(s, (uch)((w) & 0xff));
        //    put_byte(s, (uch)((ush)(w) >> 8));
        s.pending_buf[s.pending++] = (w) & 0xff
        s.pending_buf[s.pending++] = (w >>> 8) & 0xff
      }

      /* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
      function send_bits (s, value, length) {
        if (s.bi_valid > (Buf_size - length)) {
          s.bi_buf |= (value << s.bi_valid) & 0xffff
          put_short(s, s.bi_buf)
          s.bi_buf = value >> (Buf_size - s.bi_valid)
          s.bi_valid += length - Buf_size
        } else {
          s.bi_buf |= (value << s.bi_valid) & 0xffff
          s.bi_valid += length
        }
      }

      function send_code (s, c, tree) {
        send_bits(s, tree[c * 2]/* .Code */, tree[c * 2 + 1]/* .Len */)
      }

      /* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
      function bi_reverse (code, len) {
        let res = 0
        do {
          res |= code & 1
          code >>>= 1
          res <<= 1
        } while (--len > 0)
        return res >>> 1
      }

      /* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
      function bi_flush (s) {
        if (s.bi_valid === 16) {
          put_short(s, s.bi_buf)
          s.bi_buf = 0
          s.bi_valid = 0
        } else if (s.bi_valid >= 8) {
          s.pending_buf[s.pending++] = s.bi_buf & 0xff
          s.bi_buf >>= 8
          s.bi_valid -= 8
        }
      }

      /* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
      function gen_bitlen (s, desc)
      //    deflate_state *s;
      //    tree_desc *desc;    /* the tree descriptor */
      {
        const tree = desc.dyn_tree
        const max_code = desc.max_code
        const stree = desc.stat_desc.static_tree
        const has_stree = desc.stat_desc.has_stree
        const extra = desc.stat_desc.extra_bits
        const base = desc.stat_desc.extra_base
        const max_length = desc.stat_desc.max_length
        let h /* heap index */
        let n, m /* iterate over the tree elements */
        let bits /* bit length */
        let xbits /* extra bits */
        let f /* frequency */
        let overflow = 0 /* number of elements with bit length too large */

        for (bits = 0; bits <= MAX_BITS; bits++) {
          s.bl_count[bits] = 0
        }

        /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
        tree[s.heap[s.heap_max] * 2 + 1]/* .Len */ = 0 /* root of the heap */

        for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
          n = s.heap[h]
          bits = tree[tree[n * 2 + 1]/* .Dad */ * 2 + 1]/* .Len */ + 1
          if (bits > max_length) {
            bits = max_length
            overflow++
          }
          tree[n * 2 + 1]/* .Len */ = bits
          /* We overwrite tree[n].Dad which is no longer needed */

          if (n > max_code) { continue } /* not a leaf node */

          s.bl_count[bits]++
          xbits = 0
          if (n >= base) {
            xbits = extra[n - base]
          }
          f = tree[n * 2]/* .Freq */
          s.opt_len += f * (bits + xbits)
          if (has_stree) {
            s.static_len += f * (stree[n * 2 + 1]/* .Len */ + xbits)
          }
        }
        if (overflow === 0) { return }

        // Trace((stderr,"\nbit length overflow\n"));
        /* This happens for example on obj2 and pic of the Calgary corpus */

        /* Find the first bit length which could increase: */
        do {
          bits = max_length - 1
          while (s.bl_count[bits] === 0) { bits-- }
          s.bl_count[bits]-- /* move one leaf down the tree */
          s.bl_count[bits + 1] += 2 /* move one overflow item as its brother */
          s.bl_count[max_length]--
          /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
          overflow -= 2
        } while (overflow > 0)

        /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
        for (bits = max_length; bits !== 0; bits--) {
          n = s.bl_count[bits]
          while (n !== 0) {
            m = s.heap[--h]
            if (m > max_code) { continue }
            if (tree[m * 2 + 1]/* .Len */ !== bits) {
            // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
              s.opt_len += (bits - tree[m * 2 + 1]/* .Len */) * tree[m * 2]/* .Freq */
              tree[m * 2 + 1]/* .Len */ = bits
            }
            n--
          }
        }
      }

      /* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
      function gen_codes (tree, max_code, bl_count)
      //    ct_data *tree;             /* the tree to decorate */
      //    int max_code;              /* largest code with non zero frequency */
      //    ushf *bl_count;            /* number of codes at each bit length */
      {
        const next_code = new Array(MAX_BITS + 1) /* next code value for each bit length */
        let code = 0 /* running code value */
        let bits /* bit index */
        let n /* code index */

        /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
        for (bits = 1; bits <= MAX_BITS; bits++) {
          next_code[bits] = code = (code + bl_count[bits - 1]) << 1
        }
        /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
        // Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
        //        "inconsistent bit counts");
        // Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

        for (n = 0; n <= max_code; n++) {
          const len = tree[n * 2 + 1]/* .Len */
          if (len === 0) { continue }
          /* Now reverse the bits */
          tree[n * 2]/* .Code */ = bi_reverse(next_code[len]++, len)

        // Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
        //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
        }
      }

      /* ===========================================================================
 * Initialize the various 'constant' tables.
 */
      function tr_static_init () {
        let n /* iterates over tree elements */
        let bits /* bit counter */
        let length /* length value */
        let code /* code value */
        let dist /* distance index */
        const bl_count = new Array(MAX_BITS + 1)
        /* number of codes at each bit length for an optimal tree */

        // do check in _tr_init()
        // if (static_init_done) return;

        /* For some embedded targets, global variables are not initialized: */
        /* #ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif */

        /* Initialize the mapping length (0..255) -> length code (0..28) */
        length = 0
        for (code = 0; code < LENGTH_CODES - 1; code++) {
          base_length[code] = length
          for (n = 0; n < (1 << extra_lbits[code]); n++) {
            _length_code[length++] = code
          }
        }
        // Assert (length == 256, "tr_static_init: length != 256");
        /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
        _length_code[length - 1] = code

        /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
        dist = 0
        for (code = 0; code < 16; code++) {
          base_dist[code] = dist
          for (n = 0; n < (1 << extra_dbits[code]); n++) {
            _dist_code[dist++] = code
          }
        }
        // Assert (dist == 256, "tr_static_init: dist != 256");
        dist >>= 7 /* from now on, all distances are divided by 128 */
        for (; code < D_CODES; code++) {
          base_dist[code] = dist << 7
          for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
            _dist_code[256 + dist++] = code
          }
        }
        // Assert (dist == 256, "tr_static_init: 256+dist != 512");

        /* Construct the codes of the static literal tree */
        for (bits = 0; bits <= MAX_BITS; bits++) {
          bl_count[bits] = 0
        }

        n = 0
        while (n <= 143) {
          static_ltree[n * 2 + 1]/* .Len */ = 8
          n++
          bl_count[8]++
        }
        while (n <= 255) {
          static_ltree[n * 2 + 1]/* .Len */ = 9
          n++
          bl_count[9]++
        }
        while (n <= 279) {
          static_ltree[n * 2 + 1]/* .Len */ = 7
          n++
          bl_count[7]++
        }
        while (n <= 287) {
          static_ltree[n * 2 + 1]/* .Len */ = 8
          n++
          bl_count[8]++
        }
        /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
        gen_codes(static_ltree, L_CODES + 1, bl_count)

        /* The static distance tree is trivial: */
        for (n = 0; n < D_CODES; n++) {
          static_dtree[n * 2 + 1]/* .Len */ = 5
          static_dtree[n * 2]/* .Code */ = bi_reverse(n, 5)
        }

        // Now data ready and we can init static trees
        static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS)
        static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS)
        static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS)

      // static_init_done = true;
      }

      /* ===========================================================================
 * Initialize a new block.
 */
      function init_block (s) {
        let n /* iterates over tree elements */

        /* Initialize the trees. */
        for (n = 0; n < L_CODES; n++) { s.dyn_ltree[n * 2]/* .Freq */ = 0 }
        for (n = 0; n < D_CODES; n++) { s.dyn_dtree[n * 2]/* .Freq */ = 0 }
        for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/* .Freq */ = 0 }

        s.dyn_ltree[END_BLOCK * 2]/* .Freq */ = 1
        s.opt_len = s.static_len = 0
        s.last_lit = s.matches = 0
      }

      /* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
      function bi_windup (s) {
        if (s.bi_valid > 8) {
          put_short(s, s.bi_buf)
        } else if (s.bi_valid > 0) {
        // put_byte(s, (Byte)s->bi_buf);
          s.pending_buf[s.pending++] = s.bi_buf
        }
        s.bi_buf = 0
        s.bi_valid = 0
      }

      /* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
      function copy_block (s, buf, len, header)
      // DeflateState *s;
      // charf    *buf;    /* the input data */
      // unsigned len;     /* its length */
      // int      header;  /* true if block header must be written */
      {
        bi_windup(s) /* align on byte boundary */

        if (header) {
          put_short(s, len)
          put_short(s, ~len)
        }
        //  while (len--) {
        //    put_byte(s, *buf++);
        //  }
        utils.arraySet(s.pending_buf, s.window, buf, len, s.pending)
        s.pending += len
      }

      /* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
      function smaller (tree, n, m, depth) {
        const _n2 = n * 2
        const _m2 = m * 2
        return (tree[_n2]/* .Freq */ < tree[_m2]/* .Freq */ ||
         (tree[_n2]/* .Freq */ === tree[_m2]/* .Freq */ && depth[n] <= depth[m]))
      }

      /* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
      function pqdownheap (s, tree, k)
      //    deflate_state *s;
      //    ct_data *tree;  /* the tree to restore */
      //    int k;               /* node to move down */
      {
        const v = s.heap[k]
        let j = k << 1 /* left son of k */
        while (j <= s.heap_len) {
        /* Set j to the smallest of the two sons: */
          if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
            j++
          }
          /* Exit if v is smaller than both sons */
          if (smaller(tree, v, s.heap[j], s.depth)) { break }

          /* Exchange v with the smallest son */
          s.heap[k] = s.heap[j]
          k = j

          /* And continue down the tree, setting j to the left son of k */
          j <<= 1
        }
        s.heap[k] = v
      }

      // inlined manually
      // var SMALLEST = 1;

      /* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
      function compress_block (s, ltree, dtree)
      //    deflate_state *s;
      //    const ct_data *ltree; /* literal tree */
      //    const ct_data *dtree; /* distance tree */
      {
        let dist /* distance of matched string */
        let lc /* match length or unmatched char (if dist == 0) */
        let lx = 0 /* running index in l_buf */
        let code /* the code to send */
        let extra /* number of extra bits to send */

        if (s.last_lit !== 0) {
          do {
            dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1])
            lc = s.pending_buf[s.l_buf + lx]
            lx++

            if (dist === 0) {
              send_code(s, lc, ltree) /* send a literal byte */
            // Tracecv(isgraph(lc), (stderr," '%c' ", lc));
            } else {
            /* Here, lc is the match length - MIN_MATCH */
              code = _length_code[lc]
              send_code(s, code + LITERALS + 1, ltree) /* send the length code */
              extra = extra_lbits[code]
              if (extra !== 0) {
                lc -= base_length[code]
                send_bits(s, lc, extra) /* send the extra length bits */
              }
              dist-- /* dist is now the match distance - 1 */
              code = d_code(dist)
              // Assert (code < D_CODES, "bad d_code");

              send_code(s, code, dtree) /* send the distance code */
              extra = extra_dbits[code]
              if (extra !== 0) {
                dist -= base_dist[code]
                send_bits(s, dist, extra) /* send the extra distance bits */
              }
            } /* literal or match pair ? */

            /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
            // Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
            //       "pendingBuf overflow");
          } while (lx < s.last_lit)
        }

        send_code(s, END_BLOCK, ltree)
      }

      /* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
      function build_tree (s, desc)
      //    deflate_state *s;
      //    tree_desc *desc; /* the tree descriptor */
      {
        const tree = desc.dyn_tree
        const stree = desc.stat_desc.static_tree
        const has_stree = desc.stat_desc.has_stree
        const elems = desc.stat_desc.elems
        let n, m /* iterate over heap elements */
        let max_code = -1 /* largest code with non zero frequency */
        let node /* new node being created */

        /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
        s.heap_len = 0
        s.heap_max = HEAP_SIZE

        for (n = 0; n < elems; n++) {
          if (tree[n * 2]/* .Freq */ !== 0) {
            s.heap[++s.heap_len] = max_code = n
            s.depth[n] = 0
          } else {
            tree[n * 2 + 1]/* .Len */ = 0
          }
        }

        /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
        while (s.heap_len < 2) {
          node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0)
          tree[node * 2]/* .Freq */ = 1
          s.depth[node] = 0
          s.opt_len--

          if (has_stree) {
            s.static_len -= stree[node * 2 + 1]/* .Len */
          }
        /* node is 0 or 1 so it does not have extra bits */
        }
        desc.max_code = max_code

        /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
        for (n = (s.heap_len >> 1/* int /2 */); n >= 1; n--) { pqdownheap(s, tree, n) }

        /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
        node = elems /* next internal node of the tree */
        do {
        // pqremove(s, tree, n);  /* n = node of least frequency */
        /** * pqremove ***/
          n = s.heap[1/* SMALLEST */]
          s.heap[1/* SMALLEST */] = s.heap[s.heap_len--]
          pqdownheap(s, tree, 1/* SMALLEST */)
          /***/

          m = s.heap[1/* SMALLEST */] /* m = node of next least frequency */

          s.heap[--s.heap_max] = n /* keep the nodes sorted by frequency */
          s.heap[--s.heap_max] = m

          /* Create a new node father of n and m */
          tree[node * 2]/* .Freq */ = tree[n * 2]/* .Freq */ + tree[m * 2]/* .Freq */
          s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1
          tree[n * 2 + 1]/* .Dad */ = tree[m * 2 + 1]/* .Dad */ = node

          /* and insert the new node in the heap */
          s.heap[1/* SMALLEST */] = node++
          pqdownheap(s, tree, 1/* SMALLEST */)
        } while (s.heap_len >= 2)

        s.heap[--s.heap_max] = s.heap[1/* SMALLEST */]

        /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
        gen_bitlen(s, desc)

        /* The field len is now set, we can generate the bit codes */
        gen_codes(tree, max_code, s.bl_count)
      }

      /* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
      function scan_tree (s, tree, max_code)
      //    deflate_state *s;
      //    ct_data *tree;   /* the tree to be scanned */
      //    int max_code;    /* and its largest code of non zero frequency */
      {
        let n /* iterates over all tree elements */
        let prevlen = -1 /* last emitted length */
        let curlen /* length of current code */

        let nextlen = tree[0 * 2 + 1]/* .Len */ /* length of next code */

        let count = 0 /* repeat count of the current code */
        let max_count = 7 /* max repeat count */
        let min_count = 4 /* min repeat count */

        if (nextlen === 0) {
          max_count = 138
          min_count = 3
        }
        tree[(max_code + 1) * 2 + 1]/* .Len */ = 0xffff /* guard */

        for (n = 0; n <= max_code; n++) {
          curlen = nextlen
          nextlen = tree[(n + 1) * 2 + 1]/* .Len */

          if (++count < max_count && curlen === nextlen) {
            continue
          } else if (count < min_count) {
            s.bl_tree[curlen * 2]/* .Freq */ += count
          } else if (curlen !== 0) {
            if (curlen !== prevlen) { s.bl_tree[curlen * 2]/* .Freq */++ }
            s.bl_tree[REP_3_6 * 2]/* .Freq */++
          } else if (count <= 10) {
            s.bl_tree[REPZ_3_10 * 2]/* .Freq */++
          } else {
            s.bl_tree[REPZ_11_138 * 2]/* .Freq */++
          }

          count = 0
          prevlen = curlen

          if (nextlen === 0) {
            max_count = 138
            min_count = 3
          } else if (curlen === nextlen) {
            max_count = 6
            min_count = 3
          } else {
            max_count = 7
            min_count = 4
          }
        }
      }

      /* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
      function send_tree (s, tree, max_code)
      //    deflate_state *s;
      //    ct_data *tree; /* the tree to be scanned */
      //    int max_code;       /* and its largest code of non zero frequency */
      {
        let n /* iterates over all tree elements */
        let prevlen = -1 /* last emitted length */
        let curlen /* length of current code */

        let nextlen = tree[0 * 2 + 1]/* .Len */ /* length of next code */

        let count = 0 /* repeat count of the current code */
        let max_count = 7 /* max repeat count */
        let min_count = 4 /* min repeat count */

        /* tree[max_code+1].Len = -1; */ /* guard already set */
        if (nextlen === 0) {
          max_count = 138
          min_count = 3
        }

        for (n = 0; n <= max_code; n++) {
          curlen = nextlen
          nextlen = tree[(n + 1) * 2 + 1]/* .Len */

          if (++count < max_count && curlen === nextlen) {
            continue
          } else if (count < min_count) {
            do { send_code(s, curlen, s.bl_tree) } while (--count !== 0)
          } else if (curlen !== 0) {
            if (curlen !== prevlen) {
              send_code(s, curlen, s.bl_tree)
              count--
            }
            // Assert(count >= 3 && count <= 6, " 3_6?");
            send_code(s, REP_3_6, s.bl_tree)
            send_bits(s, count - 3, 2)
          } else if (count <= 10) {
            send_code(s, REPZ_3_10, s.bl_tree)
            send_bits(s, count - 3, 3)
          } else {
            send_code(s, REPZ_11_138, s.bl_tree)
            send_bits(s, count - 11, 7)
          }

          count = 0
          prevlen = curlen
          if (nextlen === 0) {
            max_count = 138
            min_count = 3
          } else if (curlen === nextlen) {
            max_count = 6
            min_count = 3
          } else {
            max_count = 7
            min_count = 4
          }
        }
      }

      /* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
      function build_bl_tree (s) {
        let max_blindex /* index of last bit length code of non zero freq */

        /* Determine the bit length frequencies for literal and distance trees */
        scan_tree(s, s.dyn_ltree, s.l_desc.max_code)
        scan_tree(s, s.dyn_dtree, s.d_desc.max_code)

        /* Build the bit length tree: */
        build_tree(s, s.bl_desc)
        /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

        /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
        for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
          if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/* .Len */ !== 0) {
            break
          }
        }
        /* Update opt_len to include the bit length tree and counts */
        s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4
        // Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
        //        s->opt_len, s->static_len));

        return max_blindex
      }

      /* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
      function send_all_trees (s, lcodes, dcodes, blcodes)
      //    deflate_state *s;
      //    int lcodes, dcodes, blcodes; /* number of codes for each tree */
      {
        let rank /* index in bl_order */

        // Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
        // Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
        //        "too many codes");
        // Tracev((stderr, "\nbl counts: "));
        send_bits(s, lcodes - 257, 5) /* not +255 as stated in appnote.txt */
        send_bits(s, dcodes - 1, 5)
        send_bits(s, blcodes - 4, 4) /* not -3 as stated in appnote.txt */
        for (rank = 0; rank < blcodes; rank++) {
        // Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
          send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/* .Len */, 3)
        }
        // Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

        send_tree(s, s.dyn_ltree, lcodes - 1) /* literal tree */
        // Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

        send_tree(s, s.dyn_dtree, dcodes - 1) /* distance tree */
      // Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
      }

      /* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
      function detect_data_type (s) {
      /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
        let black_mask = 0xf3ffc07f
        let n

        /* Check for non-textual ("black-listed") bytes. */
        for (n = 0; n <= 31; n++, black_mask >>>= 1) {
          if ((black_mask & 1) && (s.dyn_ltree[n * 2]/* .Freq */ !== 0)) {
            return Z_BINARY
          }
        }

        /* Check for textual ("white-listed") bytes. */
        if (s.dyn_ltree[9 * 2]/* .Freq */ !== 0 || s.dyn_ltree[10 * 2]/* .Freq */ !== 0 ||
      s.dyn_ltree[13 * 2]/* .Freq */ !== 0) {
          return Z_TEXT
        }
        for (n = 32; n < LITERALS; n++) {
          if (s.dyn_ltree[n * 2]/* .Freq */ !== 0) {
            return Z_TEXT
          }
        }

        /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
        return Z_BINARY
      }

      let static_init_done = false

      /* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
      function _tr_init (s) {
        if (!static_init_done) {
          tr_static_init()
          static_init_done = true
        }

        s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc)
        s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc)
        s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc)

        s.bi_buf = 0
        s.bi_valid = 0

        /* Initialize the first block of the first file: */
        init_block(s)
      }

      /* ===========================================================================
 * Send a stored block
 */
      function _tr_stored_block (s, buf, stored_len, last)
      // DeflateState *s;
      // charf *buf;       /* input block */
      // ulg stored_len;   /* length of input block */
      // int last;         /* one if this is the last block for a file */
      {
        send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3) /* send block type */
        copy_block(s, buf, stored_len, true) /* with header */
      }

      /* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
      function _tr_align (s) {
        send_bits(s, STATIC_TREES << 1, 3)
        send_code(s, END_BLOCK, static_ltree)
        bi_flush(s)
      }

      /* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
      function _tr_flush_block (s, buf, stored_len, last)
      // DeflateState *s;
      // charf *buf;       /* input block, or NULL if too old */
      // ulg stored_len;   /* length of input block */
      // int last;         /* one if this is the last block for a file */
      {
        let opt_lenb, static_lenb /* opt_len and static_len in bytes */
        let max_blindex = 0 /* index of last bit length code of non zero freq */

        /* Build the Huffman trees unless a stored block is forced */
        if (s.level > 0) {
        /* Check if the file is binary or text */
          if (s.strm.data_type === Z_UNKNOWN) {
            s.strm.data_type = detect_data_type(s)
          }

          /* Construct the literal and distance trees */
          build_tree(s, s.l_desc)
          // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
          //        s->static_len));

          build_tree(s, s.d_desc)
          // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
          //        s->static_len));
          /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

          /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
          max_blindex = build_bl_tree(s)

          /* Determine the best encoding. Compute the block lengths in bytes. */
          opt_lenb = (s.opt_len + 3 + 7) >>> 3
          static_lenb = (s.static_len + 3 + 7) >>> 3

          // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
          //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
          //        s->last_lit));

          if (static_lenb <= opt_lenb) { opt_lenb = static_lenb }
        } else {
        // Assert(buf != (char*)0, "lost buf");
          opt_lenb = static_lenb = stored_len + 5 /* force a stored block */
        }

        if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
        /* 4: two words for the lengths */

          /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
          _tr_stored_block(s, buf, stored_len, last)
        } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
          send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3)
          compress_block(s, static_ltree, static_dtree)
        } else {
          send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3)
          send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1)
          compress_block(s, s.dyn_ltree, s.dyn_dtree)
        }
        // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
        /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
        init_block(s)

        if (last) {
          bi_windup(s)
        }
      // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
      //       s->compressed_len-7*last));
      }

      /* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
      function _tr_tally (s, dist, lc)
      //    deflate_state *s;
      //    unsigned dist;  /* distance of matched string */
      //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
      {
      // var out_length, in_length, dcode;

        s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff
        s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff

        s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff
        s.last_lit++

        if (dist === 0) {
        /* lc is the unmatched char */
          s.dyn_ltree[lc * 2]/* .Freq */++
        } else {
          s.matches++
          /* Here, lc is the match length - MIN_MATCH */
          dist-- /* dist = match distance - 1 */
          // Assert((ush)dist < (ush)MAX_DIST(s) &&
          //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
          //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

          s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/* .Freq */++
          s.dyn_dtree[d_code(dist) * 2]/* .Freq */++
        }

        // (!) This block is disabled in zlib defaults,
        // don't enable it for binary compatibility

        // #ifdef TRUNCATE_BLOCK
        //  /* Try to guess if it is profitable to stop the current block here */
        //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
        //    /* Compute an upper bound for the compressed length */
        //    out_length = s.last_lit*8;
        //    in_length = s.strstart - s.block_start;
        //
        //    for (dcode = 0; dcode < D_CODES; dcode++) {
        //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
        //    }
        //    out_length >>>= 3;
        //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
        //    //       s->last_lit, in_length, out_length,
        //    //       100L - out_length*100L/in_length));
        //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
        //      return true;
        //    }
        //  }
        // #endif

        return (s.last_lit === s.lit_bufsize - 1)
      /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
      }

      exports._tr_init = _tr_init
      exports._tr_stored_block = _tr_stored_block
      exports._tr_flush_block = _tr_flush_block
      exports._tr_tally = _tr_tally
      exports._tr_align = _tr_align
    }, { '../utils/common': 44 }],
    54: [function (require, module, exports) {
      'use strict'

      // (C) 1995-2013 Jean-loup Gailly and Mark Adler
      // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
      //
      // This software is provided 'as-is', without any express or implied
      // warranty. In no event will the authors be held liable for any damages
      // arising from the use of this software.
      //
      // Permission is granted to anyone to use this software for any purpose,
      // including commercial applications, and to alter it and redistribute it
      // freely, subject to the following restrictions:
      //
      // 1. The origin of this software must not be misrepresented; you must not
      //   claim that you wrote the original software. If you use this software
      //   in a product, an acknowledgment in the product documentation would be
      //   appreciated but is not required.
      // 2. Altered source versions must be plainly marked as such, and must not be
      //   misrepresented as being the original software.
      // 3. This notice may not be removed or altered from any source distribution.

      function ZStream () {
      /* next input byte */
        this.input = null // JS specific, because we have no pointers
        this.next_in = 0
        /* number of bytes available at input */
        this.avail_in = 0
        /* total number of input bytes read so far */
        this.total_in = 0
        /* next output byte should be put there */
        this.output = null // JS specific, because we have no pointers
        this.next_out = 0
        /* remaining free space at output */
        this.avail_out = 0
        /* total number of bytes output so far */
        this.total_out = 0
        /* last error message, NULL if no error */
        this.msg = ''/* Z_NULL */
        /* not visible by applications */
        this.state = null
        /* best guess about the data type: binary or text */
        this.data_type = 2/* Z_UNKNOWN */
        /* adler32 value of the uncompressed data */
        this.adler = 0
      }

      module.exports = ZStream
    }, {}],
    55: [function (require, module, exports) {
      (function (process) {
        (function () {
          // 'path' module extracted from Node.js v8.11.1 (only the posix part)
          // transplited with Babel

          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict'

          function assertPath (path) {
            if (typeof path !== 'string') {
              throw new TypeError('Path must be a string. Received ' + JSON.stringify(path))
            }
          }

          // Resolves . and .. elements in a path with directory names
          function normalizeStringPosix (path, allowAboveRoot) {
            let res = ''
            let lastSegmentLength = 0
            let lastSlash = -1
            let dots = 0
            let code
            for (let i = 0; i <= path.length; ++i) {
              if (i < path.length) { code = path.charCodeAt(i) } else if (code === 47 /* / */) { break } else { code = 47 } /* / */
              if (code === 47 /* / */) {
                if (lastSlash === i - 1 || dots === 1) {
                  // NOOP
                } else if (lastSlash !== i - 1 && dots === 2) {
                  if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /* . */ || res.charCodeAt(res.length - 2) !== 46 /* . */) {
                    if (res.length > 2) {
                      const lastSlashIndex = res.lastIndexOf('/')
                      if (lastSlashIndex !== res.length - 1) {
                        if (lastSlashIndex === -1) {
                          res = ''
                          lastSegmentLength = 0
                        } else {
                          res = res.slice(0, lastSlashIndex)
                          lastSegmentLength = res.length - 1 - res.lastIndexOf('/')
                        }
                        lastSlash = i
                        dots = 0
                        continue
                      }
                    } else if (res.length === 2 || res.length === 1) {
                      res = ''
                      lastSegmentLength = 0
                      lastSlash = i
                      dots = 0
                      continue
                    }
                  }
                  if (allowAboveRoot) {
                    if (res.length > 0) { res += '/..' } else { res = '..' }
                    lastSegmentLength = 2
                  }
                } else {
                  if (res.length > 0) { res += '/' + path.slice(lastSlash + 1, i) } else { res = path.slice(lastSlash + 1, i) }
                  lastSegmentLength = i - lastSlash - 1
                }
                lastSlash = i
                dots = 0
              } else if (code === 46 /* . */ && dots !== -1) {
                ++dots
              } else {
                dots = -1
              }
            }
            return res
          }

          function _format (sep, pathObject) {
            const dir = pathObject.dir || pathObject.root
            const base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '')
            if (!dir) {
              return base
            }
            if (dir === pathObject.root) {
              return dir + base
            }
            return dir + sep + base
          }

          var posix = {
            // path.resolve([from ...], to)
            resolve: function resolve () {
              let resolvedPath = ''
              let resolvedAbsolute = false
              let cwd

              for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path
                if (i >= 0) { path = arguments[i] } else {
                  if (cwd === undefined) { cwd = process.cwd() }
                  path = cwd
                }

                assertPath(path)

                // Skip empty entries
                if (path.length === 0) {
                  continue
                }

                resolvedPath = path + '/' + resolvedPath
                resolvedAbsolute = path.charCodeAt(0) === 47 /* / */
              }

              // At this point the path should be resolved to a full absolute path, but
              // handle relative paths to be safe (might happen when process.cwd() fails)

              // Normalize the path
              resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute)

              if (resolvedAbsolute) {
                if (resolvedPath.length > 0) { return '/' + resolvedPath } else { return '/' }
              } else if (resolvedPath.length > 0) {
                return resolvedPath
              } else {
                return '.'
              }
            },

            normalize: function normalize (path) {
              assertPath(path)

              if (path.length === 0) return '.'

              const isAbsolute = path.charCodeAt(0) === 47 /* / */
              const trailingSeparator = path.charCodeAt(path.length - 1) === 47 /* / */

              // Normalize the path
              path = normalizeStringPosix(path, !isAbsolute)

              if (path.length === 0 && !isAbsolute) path = '.'
              if (path.length > 0 && trailingSeparator) path += '/'

              if (isAbsolute) return '/' + path
              return path
            },

            isAbsolute: function isAbsolute (path) {
              assertPath(path)
              return path.length > 0 && path.charCodeAt(0) === 47 /* / */
            },

            join: function join () {
              if (arguments.length === 0) { return '.' }
              let joined
              for (let i = 0; i < arguments.length; ++i) {
                const arg = arguments[i]
                assertPath(arg)
                if (arg.length > 0) {
                  if (joined === undefined) { joined = arg } else { joined += '/' + arg }
                }
              }
              if (joined === undefined) { return '.' }
              return posix.normalize(joined)
            },

            relative: function relative (from, to) {
              assertPath(from)
              assertPath(to)

              if (from === to) return ''

              from = posix.resolve(from)
              to = posix.resolve(to)

              if (from === to) return ''

              // Trim any leading backslashes
              let fromStart = 1
              for (; fromStart < from.length; ++fromStart) {
                if (from.charCodeAt(fromStart) !== 47 /* / */) { break }
              }
              const fromEnd = from.length
              const fromLen = fromEnd - fromStart

              // Trim any leading backslashes
              let toStart = 1
              for (; toStart < to.length; ++toStart) {
                if (to.charCodeAt(toStart) !== 47 /* / */) { break }
              }
              const toEnd = to.length
              const toLen = toEnd - toStart

              // Compare paths to find the longest common path from root
              const length = fromLen < toLen ? fromLen : toLen
              let lastCommonSep = -1
              let i = 0
              for (; i <= length; ++i) {
                if (i === length) {
                  if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === 47 /* / */) {
                      // We get here if `from` is the exact base path for `to`.
                      // For example: from='/foo/bar'; to='/foo/bar/baz'
                      return to.slice(toStart + i + 1)
                    } else if (i === 0) {
                      // We get here if `from` is the root
                      // For example: from='/'; to='/foo'
                      return to.slice(toStart + i)
                    }
                  } else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === 47 /* / */) {
                      // We get here if `to` is the exact base path for `from`.
                      // For example: from='/foo/bar/baz'; to='/foo/bar'
                      lastCommonSep = i
                    } else if (i === 0) {
                      // We get here if `to` is the root.
                      // For example: from='/foo'; to='/'
                      lastCommonSep = 0
                    }
                  }
                  break
                }
                const fromCode = from.charCodeAt(fromStart + i)
                const toCode = to.charCodeAt(toStart + i)
                if (fromCode !== toCode) { break } else if (fromCode === 47 /* / */) { lastCommonSep = i }
              }

              let out = ''
              // Generate the relative path based on the path difference between `to`
              // and `from`
              for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
                if (i === fromEnd || from.charCodeAt(i) === 47 /* / */) {
                  if (out.length === 0) { out += '..' } else { out += '/..' }
                }
              }

              // Lastly, append the rest of the destination (`to`) path that comes after
              // the common path parts
              if (out.length > 0) { return out + to.slice(toStart + lastCommonSep) } else {
                toStart += lastCommonSep
                if (to.charCodeAt(toStart) === 47 /* / */) { ++toStart }
                return to.slice(toStart)
              }
            },

            _makeLong: function _makeLong (path) {
              return path
            },

            dirname: function dirname (path) {
              assertPath(path)
              if (path.length === 0) return '.'
              let code = path.charCodeAt(0)
              const hasRoot = code === 47 /* / */
              let end = -1
              let matchedSlash = true
              for (let i = path.length - 1; i >= 1; --i) {
                code = path.charCodeAt(i)
                if (code === 47 /* / */) {
                  if (!matchedSlash) {
                    end = i
                    break
                  }
                } else {
                  // We saw the first non-path separator
                  matchedSlash = false
                }
              }

              if (end === -1) return hasRoot ? '/' : '.'
              if (hasRoot && end === 1) return '//'
              return path.slice(0, end)
            },

            basename: function basename (path, ext) {
              if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string')
              assertPath(path)

              let start = 0
              let end = -1
              let matchedSlash = true
              let i

              if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
                if (ext.length === path.length && ext === path) return ''
                let extIdx = ext.length - 1
                let firstNonSlashEnd = -1
                for (i = path.length - 1; i >= 0; --i) {
                  const code = path.charCodeAt(i)
                  if (code === 47 /* / */) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                      start = i + 1
                      break
                    }
                  } else {
                    if (firstNonSlashEnd === -1) {
                      // We saw the first non-path separator, remember this index in case
                      // we need it if the extension ends up not matching
                      matchedSlash = false
                      firstNonSlashEnd = i + 1
                    }
                    if (extIdx >= 0) {
                      // Try to match the explicit extension
                      if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                          // We matched the extension, so mark this as the end of our path
                          // component
                          end = i
                        }
                      } else {
                        // Extension does not match, so our result is the entire path
                        // component
                        extIdx = -1
                        end = firstNonSlashEnd
                      }
                    }
                  }
                }

                if (start === end) end = firstNonSlashEnd; else if (end === -1) end = path.length
                return path.slice(start, end)
              } else {
                for (i = path.length - 1; i >= 0; --i) {
                  if (path.charCodeAt(i) === 47 /* / */) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                      start = i + 1
                      break
                    }
                  } else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false
                    end = i + 1
                  }
                }

                if (end === -1) return ''
                return path.slice(start, end)
              }
            },

            extname: function extname (path) {
              assertPath(path)
              let startDot = -1
              let startPart = 0
              let end = -1
              let matchedSlash = true
              // Track the state of characters (if any) we see before our first dot and
              // after any path separator we find
              let preDotState = 0
              for (let i = path.length - 1; i >= 0; --i) {
                const code = path.charCodeAt(i)
                if (code === 47 /* / */) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    startPart = i + 1
                    break
                  }
                  continue
                }
                if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // extension
                  matchedSlash = false
                  end = i + 1
                }
                if (code === 46 /* . */) {
                  // If this is our first dot, mark it as the start of our extension
                  if (startDot === -1) { startDot = i } else if (preDotState !== 1) { preDotState = 1 }
                } else if (startDot !== -1) {
                  // We saw a non-dot and non-path separator before our dot, so we should
                  // have a good chance at having a non-empty extension
                  preDotState = -1
                }
              }

              if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                return ''
              }
              return path.slice(startDot, end)
            },

            format: function format (pathObject) {
              if (pathObject === null || typeof pathObject !== 'object') {
                throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject)
              }
              return _format('/', pathObject)
            },

            parse: function parse (path) {
              assertPath(path)

              const ret = { root: '', dir: '', base: '', ext: '', name: '' }
              if (path.length === 0) return ret
              let code = path.charCodeAt(0)
              const isAbsolute = code === 47 /* / */
              let start
              if (isAbsolute) {
                ret.root = '/'
                start = 1
              } else {
                start = 0
              }
              let startDot = -1
              let startPart = 0
              let end = -1
              let matchedSlash = true
              let i = path.length - 1

              // Track the state of characters (if any) we see before our first dot and
              // after any path separator we find
              let preDotState = 0

              // Get non-dir info
              for (; i >= start; --i) {
                code = path.charCodeAt(i)
                if (code === 47 /* / */) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    startPart = i + 1
                    break
                  }
                  continue
                }
                if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // extension
                  matchedSlash = false
                  end = i + 1
                }
                if (code === 46 /* . */) {
                  // If this is our first dot, mark it as the start of our extension
                  if (startDot === -1) startDot = i; else if (preDotState !== 1) preDotState = 1
                } else if (startDot !== -1) {
                  // We saw a non-dot and non-path separator before our dot, so we should
                  // have a good chance at having a non-empty extension
                  preDotState = -1
                }
              }

              if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                if (end !== -1) {
                  if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end); else ret.base = ret.name = path.slice(startPart, end)
                }
              } else {
                if (startPart === 0 && isAbsolute) {
                  ret.name = path.slice(1, startDot)
                  ret.base = path.slice(1, end)
                } else {
                  ret.name = path.slice(startPart, startDot)
                  ret.base = path.slice(startPart, end)
                }
                ret.ext = path.slice(startDot, end)
              }

              if (startPart > 0) ret.dir = path.slice(0, startPart - 1); else if (isAbsolute) ret.dir = '/'

              return ret
            },

            sep: '/',
            delimiter: ':',
            win32: null,
            posix: null
          }

          posix.posix = posix

          module.exports = posix
        }).call(this)
      }).call(this, require('_process'))
    }, { _process: 56 }],
    56: [function (require, module, exports) {
    // shim for using process in browser
      const process = module.exports = {}

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      let cachedSetTimeout
      let cachedClearTimeout

      function defaultSetTimout () {
        throw new Error('setTimeout has not been defined')
      }
      function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined')
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout
          } else {
            cachedSetTimeout = defaultSetTimout
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout
          } else {
            cachedClearTimeout = defaultClearTimeout
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout
        }
      }())
      function runTimeout (fun) {
        if (cachedSetTimeout === setTimeout) {
          // normal enviroments in sane situations
          return setTimeout(fun, 0)
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout
          return setTimeout(fun, 0)
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0)
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0)
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0)
          }
        }
      }
      function runClearTimeout (marker) {
        if (cachedClearTimeout === clearTimeout) {
          // normal enviroments in sane situations
          return clearTimeout(marker)
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout
          return clearTimeout(marker)
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker)
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker)
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker)
          }
        }
      }
      let queue = []
      let draining = false
      let currentQueue
      let queueIndex = -1

      function cleanUpNextTick () {
        if (!draining || !currentQueue) {
          return
        }
        draining = false
        if (currentQueue.length) {
          queue = currentQueue.concat(queue)
        } else {
          queueIndex = -1
        }
        if (queue.length) {
          drainQueue()
        }
      }

      function drainQueue () {
        if (draining) {
          return
        }
        const timeout = runTimeout(cleanUpNextTick)
        draining = true

        let len = queue.length
        while (len) {
          currentQueue = queue
          queue = []
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run()
            }
          }
          queueIndex = -1
          len = queue.length
        }
        currentQueue = null
        draining = false
        runClearTimeout(timeout)
      }

      process.nextTick = function (fun) {
        const args = new Array(arguments.length - 1)
        if (arguments.length > 1) {
          for (let i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i]
          }
        }
        queue.push(new Item(fun, args))
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue)
        }
      }

      // v8 likes predictible objects
      function Item (fun, array) {
        this.fun = fun
        this.array = array
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array)
      }
      process.title = 'browser'
      process.browser = true
      process.env = {}
      process.argv = []
      process.version = '' // empty string to avoid regexp issues
      process.versions = {}

      function noop () {}

      process.on = noop
      process.addListener = noop
      process.once = noop
      process.off = noop
      process.removeListener = noop
      process.removeAllListeners = noop
      process.emit = noop
      process.prependListener = noop
      process.prependOnceListener = noop

      process.listeners = function (name) { return [] }

      process.binding = function (name) {
        throw new Error('process.binding is not supported')
      }

      process.cwd = function () { return '/' }
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported')
      }
      process.umask = function () { return 0 }
    }, {}],
    57: [function (require, module, exports) {
      'use strict'

      function _inheritsLoose (subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass }

      const codes = {}

      function createErrorType (code, message, Base) {
        if (!Base) {
          Base = Error
        }

        function getMessage (arg1, arg2, arg3) {
          if (typeof message === 'string') {
            return message
          } else {
            return message(arg1, arg2, arg3)
          }
        }

        const NodeError =
  /* #__PURE__ */
  (function (_Base) {
    _inheritsLoose(NodeError, _Base)

    function NodeError (arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this
    }

    return NodeError
  }(Base))

        NodeError.prototype.name = Base.name
        NodeError.prototype.code = code
        codes[code] = NodeError
      } // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js

      function oneOf (expected, thing) {
        if (Array.isArray(expected)) {
          const len = expected.length
          expected = expected.map(function (i) {
            return String(i)
          })

          if (len > 2) {
            return 'one of '.concat(thing, ' ').concat(expected.slice(0, len - 1).join(', '), ', or ') + expected[len - 1]
          } else if (len === 2) {
            return 'one of '.concat(thing, ' ').concat(expected[0], ' or ').concat(expected[1])
          } else {
            return 'of '.concat(thing, ' ').concat(expected[0])
          }
        } else {
          return 'of '.concat(thing, ' ').concat(String(expected))
        }
      } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith

      function startsWith (str, search, pos) {
        return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search
      } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith

      function endsWith (str, search, this_len) {
        if (this_len === undefined || this_len > str.length) {
          this_len = str.length
        }

        return str.substring(this_len - search.length, this_len) === search
      } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes

      function includes (str, search, start) {
        if (typeof start !== 'number') {
          start = 0
        }

        if (start + search.length > str.length) {
          return false
        } else {
          return str.indexOf(search, start) !== -1
        }
      }

      createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
        return 'The value "' + value + '" is invalid for option "' + name + '"'
      }, TypeError)
      createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
      // determiner: 'must be' or 'must not be'
        let determiner

        if (typeof expected === 'string' && startsWith(expected, 'not ')) {
          determiner = 'must not be'
          expected = expected.replace(/^not /, '')
        } else {
          determiner = 'must be'
        }

        let msg

        if (endsWith(name, ' argument')) {
        // For cases like 'first argument'
          msg = 'The '.concat(name, ' ').concat(determiner, ' ').concat(oneOf(expected, 'type'))
        } else {
          const type = includes(name, '.') ? 'property' : 'argument'
          msg = 'The "'.concat(name, '" ').concat(type, ' ').concat(determiner, ' ').concat(oneOf(expected, 'type'))
        }

        msg += '. Received type '.concat(typeof actual)
        return msg
      }, TypeError)
      createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF')
      createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
        return 'The ' + name + ' method is not implemented'
      })
      createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close')
      createErrorType('ERR_STREAM_DESTROYED', function (name) {
        return 'Cannot call ' + name + ' after a stream was destroyed'
      })
      createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times')
      createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable')
      createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end')
      createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError)
      createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
        return 'Unknown encoding: ' + arg
      }, TypeError)
      createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event')
      module.exports.codes = codes
    }, {}],
    58: [function (require, module, exports) {
      (function (process) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          // a duplex stream is just a stream that is both readable and writable.
          // Since JS doesn't have multiple prototypal inheritance, this class
          // prototypally inherits from Readable, and then parasitically from
          // Writable.

          'use strict'

          /* <replacement> */
          const objectKeys = Object.keys || function (obj) {
            const keys = []
            for (const key in obj) keys.push(key)
            return keys
          }
          /* </replacement> */

          module.exports = Duplex
          const Readable = require('./_stream_readable')
          const Writable = require('./_stream_writable')
          require('inherits')(Duplex, Readable)
          {
            // Allow the keys array to be GC'ed.
            const keys = objectKeys(Writable.prototype)
            for (let v = 0; v < keys.length; v++) {
              const method = keys[v]
              if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method]
            }
          }
          function Duplex (options) {
            if (!(this instanceof Duplex)) return new Duplex(options)
            Readable.call(this, options)
            Writable.call(this, options)
            this.allowHalfOpen = true
            if (options) {
              if (options.readable === false) this.readable = false
              if (options.writable === false) this.writable = false
              if (options.allowHalfOpen === false) {
                this.allowHalfOpen = false
                this.once('end', onend)
              }
            }
          }
          Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._writableState.highWaterMark
            }
          })
          Object.defineProperty(Duplex.prototype, 'writableBuffer', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._writableState && this._writableState.getBuffer()
            }
          })
          Object.defineProperty(Duplex.prototype, 'writableLength', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._writableState.length
            }
          })

          // the no-half-open enforcer
          function onend () {
            // If the writable side ended, then we're ok.
            if (this._writableState.ended) return

            // no more data can be written.
            // But allow more writes to happen in this tick.
            process.nextTick(onEndNT, this)
          }
          function onEndNT (self) {
            self.end()
          }
          Object.defineProperty(Duplex.prototype, 'destroyed', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              if (this._readableState === undefined || this._writableState === undefined) {
                return false
              }
              return this._readableState.destroyed && this._writableState.destroyed
            },
            set: function set (value) {
              // we ignore the value if the stream
              // has not been initialized yet
              if (this._readableState === undefined || this._writableState === undefined) {
                return
              }

              // backward compatibility, the user is explicitly
              // managing destroyed
              this._readableState.destroyed = value
              this._writableState.destroyed = value
            }
          })
        }).call(this)
      }).call(this, require('_process'))
    }, { './_stream_readable': 60, './_stream_writable': 62, _process: 56, inherits: 34 }],
    59: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // a passthrough stream.
      // basically just the most minimal sort of Transform stream.
      // Every written chunk gets output as-is.

      'use strict'

      module.exports = PassThrough
      const Transform = require('./_stream_transform')
      require('inherits')(PassThrough, Transform)
      function PassThrough (options) {
        if (!(this instanceof PassThrough)) return new PassThrough(options)
        Transform.call(this, options)
      }
      PassThrough.prototype._transform = function (chunk, encoding, cb) {
        cb(null, chunk)
      }
    }, { './_stream_transform': 61, inherits: 34 }],
    60: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict'

          module.exports = Readable

          /* <replacement> */
          let Duplex
          /* </replacement> */

          Readable.ReadableState = ReadableState

          /* <replacement> */
          const EE = require('events').EventEmitter
          const EElistenerCount = function EElistenerCount (emitter, type) {
            return emitter.listeners(type).length
          }
          /* </replacement> */

          /* <replacement> */
          const Stream = require('./internal/streams/stream')
          /* </replacement> */

          const Buffer = require('buffer').Buffer
          const OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {}
          function _uint8ArrayToBuffer (chunk) {
            return Buffer.from(chunk)
          }
          function _isUint8Array (obj) {
            return Buffer.isBuffer(obj) || obj instanceof OurUint8Array
          }

          /* <replacement> */
          const debugUtil = require('util')
          let debug
          if (debugUtil && debugUtil.debuglog) {
            debug = debugUtil.debuglog('stream')
          } else {
            debug = function debug () {}
          }
          /* </replacement> */

          const BufferList = require('./internal/streams/buffer_list')
          const destroyImpl = require('./internal/streams/destroy')
          const _require = require('./internal/streams/state')
          const getHighWaterMark = _require.getHighWaterMark
          const _require$codes = require('../errors').codes
          const ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE
          const ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF
          const ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED
          const ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT

          // Lazy loaded to improve the startup performance.
          let StringDecoder
          let createReadableStreamAsyncIterator
          let from
          require('inherits')(Readable, Stream)
          const errorOrDestroy = destroyImpl.errorOrDestroy
          const kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume']
          function prependListener (emitter, event, fn) {
            // Sadly this is not cacheable as some libraries bundle their own
            // event emitter implementation with them.
            if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn)

            // This is a hack to make sure that our error handler is attached before any
            // userland ones.  NEVER DO THIS. This is here only because this code needs
            // to continue to work with older versions of Node.js that do not include
            // the prependListener() method. The goal is to eventually remove this hack.
            if (!emitter._events || !emitter._events[event]) emitter.on(event, fn); else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn); else emitter._events[event] = [fn, emitter._events[event]]
          }
          function ReadableState (options, stream, isDuplex) {
            Duplex = Duplex || require('./_stream_duplex')
            options = options || {}

            // Duplex streams are both readable and writable, but share
            // the same options object.
            // However, some cases require setting options to different
            // values for the readable and the writable sides of the duplex stream.
            // These options can be provided separately as readableXXX and writableXXX.
            if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex

            // object stream flag. Used to make read(n) ignore n and to
            // make all the buffer merging and length checks go away
            this.objectMode = !!options.objectMode
            if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode

            // the point at which it stops calling _read() to fill the buffer
            // Note: 0 is a valid value, means "don't call _read preemptively ever"
            this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex)

            // A linked list is used to store data chunks instead of an array because the
            // linked list can remove elements from the beginning faster than
            // array.shift()
            this.buffer = new BufferList()
            this.length = 0
            this.pipes = null
            this.pipesCount = 0
            this.flowing = null
            this.ended = false
            this.endEmitted = false
            this.reading = false

            // a flag to be able to tell if the event 'readable'/'data' is emitted
            // immediately, or on a later tick.  We set this to true at first, because
            // any actions that shouldn't happen until "later" should generally also
            // not happen before the first read call.
            this.sync = true

            // whenever we return null, then we set a flag to say
            // that we're awaiting a 'readable' event emission.
            this.needReadable = false
            this.emittedReadable = false
            this.readableListening = false
            this.resumeScheduled = false
            this.paused = true

            // Should close be emitted on destroy. Defaults to true.
            this.emitClose = options.emitClose !== false

            // Should .destroy() be called after 'end' (and potentially 'finish')
            this.autoDestroy = !!options.autoDestroy

            // has it been destroyed
            this.destroyed = false

            // Crypto is kind of old and crusty.  Historically, its default string
            // encoding is 'binary' so we have to make this configurable.
            // Everything else in the universe uses 'utf8', though.
            this.defaultEncoding = options.defaultEncoding || 'utf8'

            // the number of writers that are awaiting a drain event in .pipe()s
            this.awaitDrain = 0

            // if true, a maybeReadMore has been scheduled
            this.readingMore = false
            this.decoder = null
            this.encoding = null
            if (options.encoding) {
              if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder
              this.decoder = new StringDecoder(options.encoding)
              this.encoding = options.encoding
            }
          }
          function Readable (options) {
            Duplex = Duplex || require('./_stream_duplex')
            if (!(this instanceof Readable)) return new Readable(options)

            // Checking for a Stream.Duplex instance is faster here instead of inside
            // the ReadableState constructor, at least with V8 6.5
            const isDuplex = this instanceof Duplex
            this._readableState = new ReadableState(options, this, isDuplex)

            // legacy
            this.readable = true
            if (options) {
              if (typeof options.read === 'function') this._read = options.read
              if (typeof options.destroy === 'function') this._destroy = options.destroy
            }
            Stream.call(this)
          }
          Object.defineProperty(Readable.prototype, 'destroyed', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              if (this._readableState === undefined) {
                return false
              }
              return this._readableState.destroyed
            },
            set: function set (value) {
              // we ignore the value if the stream
              // has not been initialized yet
              if (!this._readableState) {
                return
              }

              // backward compatibility, the user is explicitly
              // managing destroyed
              this._readableState.destroyed = value
            }
          })
          Readable.prototype.destroy = destroyImpl.destroy
          Readable.prototype._undestroy = destroyImpl.undestroy
          Readable.prototype._destroy = function (err, cb) {
            cb(err)
          }

          // Manually shove something into the read() buffer.
          // This returns true if the highWaterMark has not been hit yet,
          // similar to how Writable.write() returns true if you should
          // write() some more.
          Readable.prototype.push = function (chunk, encoding) {
            const state = this._readableState
            let skipChunkCheck
            if (!state.objectMode) {
              if (typeof chunk === 'string') {
                encoding = encoding || state.defaultEncoding
                if (encoding !== state.encoding) {
                  chunk = Buffer.from(chunk, encoding)
                  encoding = ''
                }
                skipChunkCheck = true
              }
            } else {
              skipChunkCheck = true
            }
            return readableAddChunk(this, chunk, encoding, false, skipChunkCheck)
          }

          // Unshift should *always* be something directly out of read()
          Readable.prototype.unshift = function (chunk) {
            return readableAddChunk(this, chunk, null, true, false)
          }
          function readableAddChunk (stream, chunk, encoding, addToFront, skipChunkCheck) {
            debug('readableAddChunk', chunk)
            const state = stream._readableState
            if (chunk === null) {
              state.reading = false
              onEofChunk(stream, state)
            } else {
              let er
              if (!skipChunkCheck) er = chunkInvalid(state, chunk)
              if (er) {
                errorOrDestroy(stream, er)
              } else if (state.objectMode || chunk && chunk.length > 0) {
                if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
                  chunk = _uint8ArrayToBuffer(chunk)
                }
                if (addToFront) {
                  if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT()); else addChunk(stream, state, chunk, true)
                } else if (state.ended) {
                  errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF())
                } else if (state.destroyed) {
                  return false
                } else {
                  state.reading = false
                  if (state.decoder && !encoding) {
                    chunk = state.decoder.write(chunk)
                    if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false); else maybeReadMore(stream, state)
                  } else {
                    addChunk(stream, state, chunk, false)
                  }
                }
              } else if (!addToFront) {
                state.reading = false
                maybeReadMore(stream, state)
              }
            }

            // We can push more data if we are below the highWaterMark.
            // Also, if we have no data yet, we can stand some more bytes.
            // This is to work around cases where hwm=0, such as the repl.
            return !state.ended && (state.length < state.highWaterMark || state.length === 0)
          }
          function addChunk (stream, state, chunk, addToFront) {
            if (state.flowing && state.length === 0 && !state.sync) {
              state.awaitDrain = 0
              stream.emit('data', chunk)
            } else {
              // update the buffer info.
              state.length += state.objectMode ? 1 : chunk.length
              if (addToFront) state.buffer.unshift(chunk); else state.buffer.push(chunk)
              if (state.needReadable) emitReadable(stream)
            }
            maybeReadMore(stream, state)
          }
          function chunkInvalid (state, chunk) {
            let er
            if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
              er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk)
            }
            return er
          }
          Readable.prototype.isPaused = function () {
            return this._readableState.flowing === false
          }

          // backwards compatibility.
          Readable.prototype.setEncoding = function (enc) {
            if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder
            const decoder = new StringDecoder(enc)
            this._readableState.decoder = decoder
            // If setEncoding(null), decoder.encoding equals utf8
            this._readableState.encoding = this._readableState.decoder.encoding

            // Iterate over current buffer to convert already stored Buffers:
            let p = this._readableState.buffer.head
            let content = ''
            while (p !== null) {
              content += decoder.write(p.data)
              p = p.next
            }
            this._readableState.buffer.clear()
            if (content !== '') this._readableState.buffer.push(content)
            this._readableState.length = content.length
            return this
          }

          // Don't raise the hwm > 1GB
          const MAX_HWM = 0x40000000
          function computeNewHighWaterMark (n) {
            if (n >= MAX_HWM) {
              // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
              n = MAX_HWM
            } else {
              // Get the next highest power of 2 to prevent increasing hwm excessively in
              // tiny amounts
              n--
              n |= n >>> 1
              n |= n >>> 2
              n |= n >>> 4
              n |= n >>> 8
              n |= n >>> 16
              n++
            }
            return n
          }

          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function howMuchToRead (n, state) {
            if (n <= 0 || state.length === 0 && state.ended) return 0
            if (state.objectMode) return 1
            if (n !== n) {
              // Only flow one buffer at a time
              if (state.flowing && state.length) return state.buffer.head.data.length; else return state.length
            }
            // If we're asking for more than the current hwm, then raise the hwm.
            if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n)
            if (n <= state.length) return n
            // Don't have enough
            if (!state.ended) {
              state.needReadable = true
              return 0
            }
            return state.length
          }

          // you can override either this method, or the async _read(n) below.
          Readable.prototype.read = function (n) {
            debug('read', n)
            n = parseInt(n, 10)
            const state = this._readableState
            const nOrig = n
            if (n !== 0) state.emittedReadable = false

            // if we're doing read(0) to trigger a readable event, but we
            // already have a bunch of data in the buffer, then just trigger
            // the 'readable' event and move on.
            if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
              debug('read: emitReadable', state.length, state.ended)
              if (state.length === 0 && state.ended) endReadable(this); else emitReadable(this)
              return null
            }
            n = howMuchToRead(n, state)

            // if we've ended, and we're now clear, then finish it up.
            if (n === 0 && state.ended) {
              if (state.length === 0) endReadable(this)
              return null
            }

            // All the actual chunk generation logic needs to be
            // *below* the call to _read.  The reason is that in certain
            // synthetic stream cases, such as passthrough streams, _read
            // may be a completely synchronous operation which may change
            // the state of the read buffer, providing enough data when
            // before there was *not* enough.
            //
            // So, the steps are:
            // 1. Figure out what the state of things will be after we do
            // a read from the buffer.
            //
            // 2. If that resulting state will trigger a _read, then call _read.
            // Note that this may be asynchronous, or synchronous.  Yes, it is
            // deeply ugly to write APIs this way, but that still doesn't mean
            // that the Readable class should behave improperly, as streams are
            // designed to be sync/async agnostic.
            // Take note if the _read call is sync or async (ie, if the read call
            // has returned yet), so that we know whether or not it's safe to emit
            // 'readable' etc.
            //
            // 3. Actually pull the requested chunks out of the buffer and return.

            // if we need a readable event, then we need to do some reading.
            let doRead = state.needReadable
            debug('need readable', doRead)

            // if we currently have less than the highWaterMark, then also read some
            if (state.length === 0 || state.length - n < state.highWaterMark) {
              doRead = true
              debug('length less than watermark', doRead)
            }

            // however, if we've ended, then there's no point, and if we're already
            // reading, then it's unnecessary.
            if (state.ended || state.reading) {
              doRead = false
              debug('reading or ended', doRead)
            } else if (doRead) {
              debug('do read')
              state.reading = true
              state.sync = true
              // if the length is currently zero, then we *need* a readable event.
              if (state.length === 0) state.needReadable = true
              // call internal read method
              this._read(state.highWaterMark)
              state.sync = false
              // If _read pushed data synchronously, then `reading` will be false,
              // and we need to re-evaluate how much data we can return to the user.
              if (!state.reading) n = howMuchToRead(nOrig, state)
            }
            let ret
            if (n > 0) ret = fromList(n, state); else ret = null
            if (ret === null) {
              state.needReadable = state.length <= state.highWaterMark
              n = 0
            } else {
              state.length -= n
              state.awaitDrain = 0
            }
            if (state.length === 0) {
              // If we have nothing in the buffer, then we want to know
              // as soon as we *do* get something into the buffer.
              if (!state.ended) state.needReadable = true

              // If we tried to read() past the EOF, then emit end on the next tick.
              if (nOrig !== n && state.ended) endReadable(this)
            }
            if (ret !== null) this.emit('data', ret)
            return ret
          }
          function onEofChunk (stream, state) {
            debug('onEofChunk')
            if (state.ended) return
            if (state.decoder) {
              const chunk = state.decoder.end()
              if (chunk && chunk.length) {
                state.buffer.push(chunk)
                state.length += state.objectMode ? 1 : chunk.length
              }
            }
            state.ended = true
            if (state.sync) {
              // if we are sync, wait until next tick to emit the data.
              // Otherwise we risk emitting data in the flow()
              // the readable code triggers during a read() call
              emitReadable(stream)
            } else {
              // emit 'readable' now to make sure it gets picked up.
              state.needReadable = false
              if (!state.emittedReadable) {
                state.emittedReadable = true
                emitReadable_(stream)
              }
            }
          }

          // Don't emit readable right away in sync mode, because this can trigger
          // another read() call => stack overflow.  This way, it might trigger
          // a nextTick recursion warning, but that's not so bad.
          function emitReadable (stream) {
            const state = stream._readableState
            debug('emitReadable', state.needReadable, state.emittedReadable)
            state.needReadable = false
            if (!state.emittedReadable) {
              debug('emitReadable', state.flowing)
              state.emittedReadable = true
              process.nextTick(emitReadable_, stream)
            }
          }
          function emitReadable_ (stream) {
            const state = stream._readableState
            debug('emitReadable_', state.destroyed, state.length, state.ended)
            if (!state.destroyed && (state.length || state.ended)) {
              stream.emit('readable')
              state.emittedReadable = false
            }

            // The stream needs another readable event if
            // 1. It is not flowing, as the flow mechanism will take
            //    care of it.
            // 2. It is not ended.
            // 3. It is below the highWaterMark, so we can schedule
            //    another readable later.
            state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark
            flow(stream)
          }

          // at this point, the user has presumably seen the 'readable' event,
          // and called read() to consume some data.  that may have triggered
          // in turn another _read(n) call, in which case reading = true if
          // it's in progress.
          // However, if we're not ended, or reading, and the length < hwm,
          // then go ahead and try to read some more preemptively.
          function maybeReadMore (stream, state) {
            if (!state.readingMore) {
              state.readingMore = true
              process.nextTick(maybeReadMore_, stream, state)
            }
          }
          function maybeReadMore_ (stream, state) {
            // Attempt to read more data if we should.
            //
            // The conditions for reading more data are (one of):
            // - Not enough data buffered (state.length < state.highWaterMark). The loop
            //   is responsible for filling the buffer with enough data if such data
            //   is available. If highWaterMark is 0 and we are not in the flowing mode
            //   we should _not_ attempt to buffer any extra data. We'll get more data
            //   when the stream consumer calls read() instead.
            // - No data in the buffer, and the stream is in flowing mode. In this mode
            //   the loop below is responsible for ensuring read() is called. Failing to
            //   call read here would abort the flow and there's no other mechanism for
            //   continuing the flow if the stream consumer has just subscribed to the
            //   'data' event.
            //
            // In addition to the above conditions to keep reading data, the following
            // conditions prevent the data from being read:
            // - The stream has ended (state.ended).
            // - There is already a pending 'read' operation (state.reading). This is a
            //   case where the the stream has called the implementation defined _read()
            //   method, but they are processing the call asynchronously and have _not_
            //   called push() with new data. In this case we skip performing more
            //   read()s. The execution ends in this method again after the _read() ends
            //   up calling push() with more data.
            while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
              const len = state.length
              debug('maybeReadMore read 0')
              stream.read(0)
              if (len === state.length)
              // didn't get any data, stop spinning.
              { break }
            }
            state.readingMore = false
          }

          // abstract method.  to be overridden in specific implementation classes.
          // call cb(er, data) where data is <= n in length.
          // for virtual (non-string, non-buffer) streams, "length" is somewhat
          // arbitrary, and perhaps not very meaningful.
          Readable.prototype._read = function (n) {
            errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'))
          }
          Readable.prototype.pipe = function (dest, pipeOpts) {
            const src = this
            const state = this._readableState
            switch (state.pipesCount) {
              case 0:
                state.pipes = dest
                break
              case 1:
                state.pipes = [state.pipes, dest]
                break
              default:
                state.pipes.push(dest)
                break
            }
            state.pipesCount += 1
            debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts)
            const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr
            const endFn = doEnd ? onend : unpipe
            if (state.endEmitted) process.nextTick(endFn); else src.once('end', endFn)
            dest.on('unpipe', onunpipe)
            function onunpipe (readable, unpipeInfo) {
              debug('onunpipe')
              if (readable === src) {
                if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                  unpipeInfo.hasUnpiped = true
                  cleanup()
                }
              }
            }
            function onend () {
              debug('onend')
              dest.end()
            }

            // when the dest drains, it reduces the awaitDrain counter
            // on the source.  This would be more elegant with a .once()
            // handler in flow(), but adding and removing repeatedly is
            // too slow.
            const ondrain = pipeOnDrain(src)
            dest.on('drain', ondrain)
            let cleanedUp = false
            function cleanup () {
              debug('cleanup')
              // cleanup event handlers once the pipe is broken
              dest.removeListener('close', onclose)
              dest.removeListener('finish', onfinish)
              dest.removeListener('drain', ondrain)
              dest.removeListener('error', onerror)
              dest.removeListener('unpipe', onunpipe)
              src.removeListener('end', onend)
              src.removeListener('end', unpipe)
              src.removeListener('data', ondata)
              cleanedUp = true

              // if the reader is waiting for a drain event from this
              // specific writer, then it would cause it to never start
              // flowing again.
              // So, if this is awaiting a drain, then we just call it now.
              // If we don't know, then assume that we are waiting for one.
              if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain()
            }
            src.on('data', ondata)
            function ondata (chunk) {
              debug('ondata')
              const ret = dest.write(chunk)
              debug('dest.write', ret)
              if (ret === false) {
                // If the user unpiped during `dest.write()`, it is possible
                // to get stuck in a permanently paused state if that write
                // also returned false.
                // => Check whether `dest` is still a piping destination.
                if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                  debug('false write response, pause', state.awaitDrain)
                  state.awaitDrain++
                }
                src.pause()
              }
            }

            // if the dest has an error, then stop piping into it.
            // however, don't suppress the throwing behavior for this.
            function onerror (er) {
              debug('onerror', er)
              unpipe()
              dest.removeListener('error', onerror)
              if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er)
            }

            // Make sure our error handler is attached before userland ones.
            prependListener(dest, 'error', onerror)

            // Both close and finish should trigger unpipe, but only once.
            function onclose () {
              dest.removeListener('finish', onfinish)
              unpipe()
            }
            dest.once('close', onclose)
            function onfinish () {
              debug('onfinish')
              dest.removeListener('close', onclose)
              unpipe()
            }
            dest.once('finish', onfinish)
            function unpipe () {
              debug('unpipe')
              src.unpipe(dest)
            }

            // tell the dest that it's being piped to
            dest.emit('pipe', src)

            // start the flow if it hasn't been started already.
            if (!state.flowing) {
              debug('pipe resume')
              src.resume()
            }
            return dest
          }
          function pipeOnDrain (src) {
            return function pipeOnDrainFunctionResult () {
              const state = src._readableState
              debug('pipeOnDrain', state.awaitDrain)
              if (state.awaitDrain) state.awaitDrain--
              if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
                state.flowing = true
                flow(src)
              }
            }
          }
          Readable.prototype.unpipe = function (dest) {
            const state = this._readableState
            const unpipeInfo = {
              hasUnpiped: false
            }

            // if we're not piping anywhere, then do nothing.
            if (state.pipesCount === 0) return this

            // just one destination.  most common case.
            if (state.pipesCount === 1) {
              // passed in one, but it's not the right one.
              if (dest && dest !== state.pipes) return this
              if (!dest) dest = state.pipes

              // got a match.
              state.pipes = null
              state.pipesCount = 0
              state.flowing = false
              if (dest) dest.emit('unpipe', this, unpipeInfo)
              return this
            }

            // slow case. multiple pipe destinations.

            if (!dest) {
              // remove all.
              const dests = state.pipes
              const len = state.pipesCount
              state.pipes = null
              state.pipesCount = 0
              state.flowing = false
              for (let i = 0; i < len; i++) {
                dests[i].emit('unpipe', this, {
                  hasUnpiped: false
                })
              }
              return this
            }

            // try to find the right one.
            const index = indexOf(state.pipes, dest)
            if (index === -1) return this
            state.pipes.splice(index, 1)
            state.pipesCount -= 1
            if (state.pipesCount === 1) state.pipes = state.pipes[0]
            dest.emit('unpipe', this, unpipeInfo)
            return this
          }

          // set up data events if they are asked for
          // Ensure readable listeners eventually get something
          Readable.prototype.on = function (ev, fn) {
            const res = Stream.prototype.on.call(this, ev, fn)
            const state = this._readableState
            if (ev === 'data') {
              // update readableListening so that resume() may be a no-op
              // a few lines down. This is needed to support once('readable').
              state.readableListening = this.listenerCount('readable') > 0

              // Try start flowing on next tick if stream isn't explicitly paused
              if (state.flowing !== false) this.resume()
            } else if (ev === 'readable') {
              if (!state.endEmitted && !state.readableListening) {
                state.readableListening = state.needReadable = true
                state.flowing = false
                state.emittedReadable = false
                debug('on readable', state.length, state.reading)
                if (state.length) {
                  emitReadable(this)
                } else if (!state.reading) {
                  process.nextTick(nReadingNextTick, this)
                }
              }
            }
            return res
          }
          Readable.prototype.addListener = Readable.prototype.on
          Readable.prototype.removeListener = function (ev, fn) {
            const res = Stream.prototype.removeListener.call(this, ev, fn)
            if (ev === 'readable') {
              // We need to check if there is someone still listening to
              // readable and reset the state. However this needs to happen
              // after readable has been emitted but before I/O (nextTick) to
              // support once('readable', fn) cycles. This means that calling
              // resume within the same tick will have no
              // effect.
              process.nextTick(updateReadableListening, this)
            }
            return res
          }
          Readable.prototype.removeAllListeners = function (ev) {
            const res = Stream.prototype.removeAllListeners.apply(this, arguments)
            if (ev === 'readable' || ev === undefined) {
              // We need to check if there is someone still listening to
              // readable and reset the state. However this needs to happen
              // after readable has been emitted but before I/O (nextTick) to
              // support once('readable', fn) cycles. This means that calling
              // resume within the same tick will have no
              // effect.
              process.nextTick(updateReadableListening, this)
            }
            return res
          }
          function updateReadableListening (self) {
            const state = self._readableState
            state.readableListening = self.listenerCount('readable') > 0
            if (state.resumeScheduled && !state.paused) {
              // flowing needs to be set to true now, otherwise
              // the upcoming resume will not flow.
              state.flowing = true

              // crude way to check if we should resume
            } else if (self.listenerCount('data') > 0) {
              self.resume()
            }
          }
          function nReadingNextTick (self) {
            debug('readable nexttick read 0')
            self.read(0)
          }

          // pause() and resume() are remnants of the legacy readable stream API
          // If the user uses them, then switch into old mode.
          Readable.prototype.resume = function () {
            const state = this._readableState
            if (!state.flowing) {
              debug('resume')
              // we flow only if there is no one listening
              // for readable, but we still have to call
              // resume()
              state.flowing = !state.readableListening
              resume(this, state)
            }
            state.paused = false
            return this
          }
          function resume (stream, state) {
            if (!state.resumeScheduled) {
              state.resumeScheduled = true
              process.nextTick(resume_, stream, state)
            }
          }
          function resume_ (stream, state) {
            debug('resume', state.reading)
            if (!state.reading) {
              stream.read(0)
            }
            state.resumeScheduled = false
            stream.emit('resume')
            flow(stream)
            if (state.flowing && !state.reading) stream.read(0)
          }
          Readable.prototype.pause = function () {
            debug('call pause flowing=%j', this._readableState.flowing)
            if (this._readableState.flowing !== false) {
              debug('pause')
              this._readableState.flowing = false
              this.emit('pause')
            }
            this._readableState.paused = true
            return this
          }
          function flow (stream) {
            const state = stream._readableState
            debug('flow', state.flowing)
            while (state.flowing && stream.read() !== null);
          }

          // wrap an old-style stream as the async data source.
          // This is *not* part of the readable stream interface.
          // It is an ugly unfortunate mess of history.
          Readable.prototype.wrap = function (stream) {
            const _this = this
            const state = this._readableState
            let paused = false
            stream.on('end', function () {
              debug('wrapped end')
              if (state.decoder && !state.ended) {
                const chunk = state.decoder.end()
                if (chunk && chunk.length) _this.push(chunk)
              }
              _this.push(null)
            })
            stream.on('data', function (chunk) {
              debug('wrapped data')
              if (state.decoder) chunk = state.decoder.write(chunk)

              // don't skip over falsy values in objectMode
              if (state.objectMode && (chunk === null || chunk === undefined)) return; else if (!state.objectMode && (!chunk || !chunk.length)) return
              const ret = _this.push(chunk)
              if (!ret) {
                paused = true
                stream.pause()
              }
            })

            // proxy all the other methods.
            // important when wrapping filters and duplexes.
            for (const i in stream) {
              if (this[i] === undefined && typeof stream[i] === 'function') {
                this[i] = (function methodWrap (method) {
                  return function methodWrapReturnFunction () {
                    return stream[method].apply(stream, arguments)
                  }
                }(i))
              }
            }

            // proxy certain important events.
            for (let n = 0; n < kProxyEvents.length; n++) {
              stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]))
            }

            // when we try to consume some more bytes, simply unpause the
            // underlying stream.
            this._read = function (n) {
              debug('wrapped _read', n)
              if (paused) {
                paused = false
                stream.resume()
              }
            }
            return this
          }
          if (typeof Symbol === 'function') {
            Readable.prototype[Symbol.asyncIterator] = function () {
              if (createReadableStreamAsyncIterator === undefined) {
                createReadableStreamAsyncIterator = require('./internal/streams/async_iterator')
              }
              return createReadableStreamAsyncIterator(this)
            }
          }
          Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._readableState.highWaterMark
            }
          })
          Object.defineProperty(Readable.prototype, 'readableBuffer', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._readableState && this._readableState.buffer
            }
          })
          Object.defineProperty(Readable.prototype, 'readableFlowing', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._readableState.flowing
            },
            set: function set (state) {
              if (this._readableState) {
                this._readableState.flowing = state
              }
            }
          })

          // exposed for testing purposes only.
          Readable._fromList = fromList
          Object.defineProperty(Readable.prototype, 'readableLength', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._readableState.length
            }
          })

          // Pluck off n bytes from an array of buffers.
          // Length is the combined lengths of all the buffers in the list.
          // This function is designed to be inlinable, so please take care when making
          // changes to the function body.
          function fromList (n, state) {
            // nothing buffered
            if (state.length === 0) return null
            let ret
            if (state.objectMode) ret = state.buffer.shift(); else if (!n || n >= state.length) {
              // read it all, truncate the list
              if (state.decoder) ret = state.buffer.join(''); else if (state.buffer.length === 1) ret = state.buffer.first(); else ret = state.buffer.concat(state.length)
              state.buffer.clear()
            } else {
              // read part of list
              ret = state.buffer.consume(n, state.decoder)
            }
            return ret
          }
          function endReadable (stream) {
            const state = stream._readableState
            debug('endReadable', state.endEmitted)
            if (!state.endEmitted) {
              state.ended = true
              process.nextTick(endReadableNT, state, stream)
            }
          }
          function endReadableNT (state, stream) {
            debug('endReadableNT', state.endEmitted, state.length)

            // Check that we didn't get one last unshift.
            if (!state.endEmitted && state.length === 0) {
              state.endEmitted = true
              stream.readable = false
              stream.emit('end')
              if (state.autoDestroy) {
                // In case of duplex streams we need a way to detect
                // if the writable side is ready for autoDestroy as well
                const wState = stream._writableState
                if (!wState || wState.autoDestroy && wState.finished) {
                  stream.destroy()
                }
              }
            }
          }
          if (typeof Symbol === 'function') {
            Readable.from = function (iterable, opts) {
              if (from === undefined) {
                from = require('./internal/streams/from')
              }
              return from(Readable, iterable, opts)
            }
          }
          function indexOf (xs, x) {
            for (let i = 0, l = xs.length; i < l; i++) {
              if (xs[i] === x) return i
            }
            return -1
          }
        }).call(this)
      }).call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, { '../errors': 57, './_stream_duplex': 58, './internal/streams/async_iterator': 63, './internal/streams/buffer_list': 64, './internal/streams/destroy': 65, './internal/streams/from': 67, './internal/streams/state': 69, './internal/streams/stream': 70, _process: 56, buffer: 16, events: 20, inherits: 34, 'string_decoder/': 74, util: 13 }],
    61: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

      // a transform stream is a readable/writable stream where you do
      // something with the data.  Sometimes it's called a "filter",
      // but that's not a great name for it, since that implies a thing where
      // some bits pass through, and others are simply ignored.  (That would
      // be a valid example of a transform, of course.)
      //
      // While the output is causally related to the input, it's not a
      // necessarily symmetric or synchronous transformation.  For example,
      // a zlib stream might take multiple plain-text writes(), and then
      // emit a single compressed chunk some time in the future.
      //
      // Here's how this works:
      //
      // The Transform stream has all the aspects of the readable and writable
      // stream classes.  When you write(chunk), that calls _write(chunk,cb)
      // internally, and returns false if there's a lot of pending writes
      // buffered up.  When you call read(), that calls _read(n) until
      // there's enough pending readable data buffered up.
      //
      // In a transform stream, the written data is placed in a buffer.  When
      // _read(n) is called, it transforms the queued up data, calling the
      // buffered _write cb's as it consumes chunks.  If consuming a single
      // written chunk would result in multiple output chunks, then the first
      // outputted bit calls the readcb, and subsequent chunks just go into
      // the read buffer, and will cause it to emit 'readable' if necessary.
      //
      // This way, back-pressure is actually determined by the reading side,
      // since _read has to be called to start processing a new chunk.  However,
      // a pathological inflate type of transform can cause excessive buffering
      // here.  For example, imagine a stream where every byte of input is
      // interpreted as an integer from 0-255, and then results in that many
      // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
      // 1kb of data being output.  In this case, you could write a very small
      // amount of input, and end up with a very large amount of output.  In
      // such a pathological inflating mechanism, there'd be no way to tell
      // the system to stop doing the transform.  A single 4MB write could
      // cause the system to run out of memory.
      //
      // However, even in such a pathological case, only a single written chunk
      // would be consumed, and then the rest would wait (un-transformed) until
      // the results of the previous transformed chunk were consumed.

      'use strict'

      module.exports = Transform
      const _require$codes = require('../errors').codes
      const ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED
      const ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK
      const ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING
      const ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0
      const Duplex = require('./_stream_duplex')
      require('inherits')(Transform, Duplex)
      function afterTransform (er, data) {
        const ts = this._transformState
        ts.transforming = false
        const cb = ts.writecb
        if (cb === null) {
          return this.emit('error', new ERR_MULTIPLE_CALLBACK())
        }
        ts.writechunk = null
        ts.writecb = null
        if (data != null)
        // single equals check for both `null` and `undefined`
        { this.push(data) }
        cb(er)
        const rs = this._readableState
        rs.reading = false
        if (rs.needReadable || rs.length < rs.highWaterMark) {
          this._read(rs.highWaterMark)
        }
      }
      function Transform (options) {
        if (!(this instanceof Transform)) return new Transform(options)
        Duplex.call(this, options)
        this._transformState = {
          afterTransform: afterTransform.bind(this),
          needTransform: false,
          transforming: false,
          writecb: null,
          writechunk: null,
          writeencoding: null
        }

        // start out asking for a readable event once data is transformed.
        this._readableState.needReadable = true

        // we have implemented the _read method, and done the other things
        // that Readable wants before the first _read call, so unset the
        // sync guard flag.
        this._readableState.sync = false
        if (options) {
          if (typeof options.transform === 'function') this._transform = options.transform
          if (typeof options.flush === 'function') this._flush = options.flush
        }

        // When the writable side finishes, then flush out anything remaining.
        this.on('prefinish', prefinish)
      }
      function prefinish () {
        const _this = this
        if (typeof this._flush === 'function' && !this._readableState.destroyed) {
          this._flush(function (er, data) {
            done(_this, er, data)
          })
        } else {
          done(this, null, null)
        }
      }
      Transform.prototype.push = function (chunk, encoding) {
        this._transformState.needTransform = false
        return Duplex.prototype.push.call(this, chunk, encoding)
      }

      // This is the part where you do stuff!
      // override this function in implementation classes.
      // 'chunk' is an input chunk.
      //
      // Call `push(newChunk)` to pass along transformed output
      // to the readable side.  You may call 'push' zero or more times.
      //
      // Call `cb(err)` when you are done with this chunk.  If you pass
      // an error, then that'll put the hurt on the whole operation.  If you
      // never call cb(), then you'll never get another chunk.
      Transform.prototype._transform = function (chunk, encoding, cb) {
        cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'))
      }
      Transform.prototype._write = function (chunk, encoding, cb) {
        const ts = this._transformState
        ts.writecb = cb
        ts.writechunk = chunk
        ts.writeencoding = encoding
        if (!ts.transforming) {
          const rs = this._readableState
          if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark)
        }
      }

      // Doesn't matter what the args are here.
      // _transform does all the work.
      // That we got here means that the readable side wants more data.
      Transform.prototype._read = function (n) {
        const ts = this._transformState
        if (ts.writechunk !== null && !ts.transforming) {
          ts.transforming = true
          this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
        } else {
        // mark that we need a transform, so that any data that comes in
        // will get processed, now that we've asked for it.
          ts.needTransform = true
        }
      }
      Transform.prototype._destroy = function (err, cb) {
        Duplex.prototype._destroy.call(this, err, function (err2) {
          cb(err2)
        })
      }
      function done (stream, er, data) {
        if (er) return stream.emit('error', er)
        if (data != null)
        // single equals check for both `null` and `undefined`
        { stream.push(data) }

        // TODO(BridgeAR): Write a test for these two error cases
        // if there's nothing in the write buffer, then that means
        // that nothing more will ever be provided
        if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0()
        if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING()
        return stream.push(null)
      }
    }, { '../errors': 57, './_stream_duplex': 58, inherits: 34 }],
    62: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          // A bit simpler than readable streams.
          // Implement an async ._write(chunk, encoding, cb), and it'll handle all
          // the drain event emission and buffering.

          'use strict'

          module.exports = Writable

          /* <replacement> */
          function WriteReq (chunk, encoding, cb) {
            this.chunk = chunk
            this.encoding = encoding
            this.callback = cb
            this.next = null
          }

          // It seems a linked list but it is not
          // there will be only 2 of these for each stream
          function CorkedRequest (state) {
            const _this = this
            this.next = null
            this.entry = null
            this.finish = function () {
              onCorkedFinish(_this, state)
            }
          }
          /* </replacement> */

          /* <replacement> */
          let Duplex
          /* </replacement> */

          Writable.WritableState = WritableState

          /* <replacement> */
          const internalUtil = {
            deprecate: require('util-deprecate')
          }
          /* </replacement> */

          /* <replacement> */
          const Stream = require('./internal/streams/stream')
          /* </replacement> */

          const Buffer = require('buffer').Buffer
          const OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {}
          function _uint8ArrayToBuffer (chunk) {
            return Buffer.from(chunk)
          }
          function _isUint8Array (obj) {
            return Buffer.isBuffer(obj) || obj instanceof OurUint8Array
          }
          const destroyImpl = require('./internal/streams/destroy')
          const _require = require('./internal/streams/state')
          const getHighWaterMark = _require.getHighWaterMark
          const _require$codes = require('../errors').codes
          const ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE
          const ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED
          const ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK
          const ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE
          const ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED
          const ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES
          const ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END
          const ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING
          const errorOrDestroy = destroyImpl.errorOrDestroy
          require('inherits')(Writable, Stream)
          function nop () {}
          function WritableState (options, stream, isDuplex) {
            Duplex = Duplex || require('./_stream_duplex')
            options = options || {}

            // Duplex streams are both readable and writable, but share
            // the same options object.
            // However, some cases require setting options to different
            // values for the readable and the writable sides of the duplex stream,
            // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
            if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex

            // object stream flag to indicate whether or not this stream
            // contains buffers or objects.
            this.objectMode = !!options.objectMode
            if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode

            // the point at which write() starts returning false
            // Note: 0 is a valid value, means that we always return false if
            // the entire buffer is not flushed immediately on write()
            this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex)

            // if _final has been called
            this.finalCalled = false

            // drain event flag.
            this.needDrain = false
            // at the start of calling end()
            this.ending = false
            // when end() has been called, and returned
            this.ended = false
            // when 'finish' is emitted
            this.finished = false

            // has it been destroyed
            this.destroyed = false

            // should we decode strings into buffers before passing to _write?
            // this is here so that some node-core streams can optimize string
            // handling at a lower level.
            const noDecode = options.decodeStrings === false
            this.decodeStrings = !noDecode

            // Crypto is kind of old and crusty.  Historically, its default string
            // encoding is 'binary' so we have to make this configurable.
            // Everything else in the universe uses 'utf8', though.
            this.defaultEncoding = options.defaultEncoding || 'utf8'

            // not an actual buffer we keep track of, but a measurement
            // of how much we're waiting to get pushed to some underlying
            // socket or file.
            this.length = 0

            // a flag to see when we're in the middle of a write.
            this.writing = false

            // when true all writes will be buffered until .uncork() call
            this.corked = 0

            // a flag to be able to tell if the onwrite cb is called immediately,
            // or on a later tick.  We set this to true at first, because any
            // actions that shouldn't happen until "later" should generally also
            // not happen before the first write call.
            this.sync = true

            // a flag to know if we're processing previously buffered items, which
            // may call the _write() callback in the same tick, so that we don't
            // end up in an overlapped onwrite situation.
            this.bufferProcessing = false

            // the callback that's passed to _write(chunk,cb)
            this.onwrite = function (er) {
              onwrite(stream, er)
            }

            // the callback that the user supplies to write(chunk,encoding,cb)
            this.writecb = null

            // the amount that is being written when _write is called.
            this.writelen = 0
            this.bufferedRequest = null
            this.lastBufferedRequest = null

            // number of pending user-supplied write callbacks
            // this must be 0 before 'finish' can be emitted
            this.pendingcb = 0

            // emit prefinish if the only thing we're waiting for is _write cbs
            // This is relevant for synchronous Transform streams
            this.prefinished = false

            // True if the error was already emitted and should not be thrown again
            this.errorEmitted = false

            // Should close be emitted on destroy. Defaults to true.
            this.emitClose = options.emitClose !== false

            // Should .destroy() be called after 'finish' (and potentially 'end')
            this.autoDestroy = !!options.autoDestroy

            // count buffered requests
            this.bufferedRequestCount = 0

            // allocate the first CorkedRequest, there is always
            // one allocated and free to use, and we maintain at most two
            this.corkedRequestsFree = new CorkedRequest(this)
          }
          WritableState.prototype.getBuffer = function getBuffer () {
            let current = this.bufferedRequest
            const out = []
            while (current) {
              out.push(current)
              current = current.next
            }
            return out
          };
          (function () {
            try {
              Object.defineProperty(WritableState.prototype, 'buffer', {
                get: internalUtil.deprecate(function writableStateBufferGetter () {
                  return this.getBuffer()
                }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
              })
            } catch (_) {}
          })()

          // Test _writableState for inheritance to account for Duplex streams,
          // whose prototype chain only points to Readable.
          let realHasInstance
          if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
            realHasInstance = Function.prototype[Symbol.hasInstance]
            Object.defineProperty(Writable, Symbol.hasInstance, {
              value: function value (object) {
                if (realHasInstance.call(this, object)) return true
                if (this !== Writable) return false
                return object && object._writableState instanceof WritableState
              }
            })
          } else {
            realHasInstance = function realHasInstance (object) {
              return object instanceof this
            }
          }
          function Writable (options) {
            Duplex = Duplex || require('./_stream_duplex')

            // Writable ctor is applied to Duplexes, too.
            // `realHasInstance` is necessary because using plain `instanceof`
            // would return false, as no `_writableState` property is attached.

            // Trying to use the custom `instanceof` for Writable here will also break the
            // Node.js LazyTransform implementation, which has a non-trivial getter for
            // `_writableState` that would lead to infinite recursion.

            // Checking for a Stream.Duplex instance is faster here instead of inside
            // the WritableState constructor, at least with V8 6.5
            const isDuplex = this instanceof Duplex
            if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options)
            this._writableState = new WritableState(options, this, isDuplex)

            // legacy.
            this.writable = true
            if (options) {
              if (typeof options.write === 'function') this._write = options.write
              if (typeof options.writev === 'function') this._writev = options.writev
              if (typeof options.destroy === 'function') this._destroy = options.destroy
              if (typeof options.final === 'function') this._final = options.final
            }
            Stream.call(this)
          }

          // Otherwise people can pipe Writable streams, which is just wrong.
          Writable.prototype.pipe = function () {
            errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE())
          }
          function writeAfterEnd (stream, cb) {
            const er = new ERR_STREAM_WRITE_AFTER_END()
            // TODO: defer error events consistently everywhere, not just the cb
            errorOrDestroy(stream, er)
            process.nextTick(cb, er)
          }

          // Checks that a user-supplied chunk is valid, especially for the particular
          // mode the stream is in. Currently this means that `null` is never accepted
          // and undefined/non-string values are only allowed in object mode.
          function validChunk (stream, state, chunk, cb) {
            let er
            if (chunk === null) {
              er = new ERR_STREAM_NULL_VALUES()
            } else if (typeof chunk !== 'string' && !state.objectMode) {
              er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk)
            }
            if (er) {
              errorOrDestroy(stream, er)
              process.nextTick(cb, er)
              return false
            }
            return true
          }
          Writable.prototype.write = function (chunk, encoding, cb) {
            const state = this._writableState
            let ret = false
            const isBuf = !state.objectMode && _isUint8Array(chunk)
            if (isBuf && !Buffer.isBuffer(chunk)) {
              chunk = _uint8ArrayToBuffer(chunk)
            }
            if (typeof encoding === 'function') {
              cb = encoding
              encoding = null
            }
            if (isBuf) encoding = 'buffer'; else if (!encoding) encoding = state.defaultEncoding
            if (typeof cb !== 'function') cb = nop
            if (state.ending) writeAfterEnd(this, cb); else if (isBuf || validChunk(this, state, chunk, cb)) {
              state.pendingcb++
              ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb)
            }
            return ret
          }
          Writable.prototype.cork = function () {
            this._writableState.corked++
          }
          Writable.prototype.uncork = function () {
            const state = this._writableState
            if (state.corked) {
              state.corked--
              if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state)
            }
          }
          Writable.prototype.setDefaultEncoding = function setDefaultEncoding (encoding) {
            // node::ParseEncoding() requires lower case.
            if (typeof encoding === 'string') encoding = encoding.toLowerCase()
            if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding)
            this._writableState.defaultEncoding = encoding
            return this
          }
          Object.defineProperty(Writable.prototype, 'writableBuffer', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._writableState && this._writableState.getBuffer()
            }
          })
          function decodeChunk (state, chunk, encoding) {
            if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
              chunk = Buffer.from(chunk, encoding)
            }
            return chunk
          }
          Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._writableState.highWaterMark
            }
          })

          // if we're already writing something, then just put this
          // in the queue, and wait our turn.  Otherwise, call _write
          // If we return false, then we need a drain event, so set that flag.
          function writeOrBuffer (stream, state, isBuf, chunk, encoding, cb) {
            if (!isBuf) {
              const newChunk = decodeChunk(state, chunk, encoding)
              if (chunk !== newChunk) {
                isBuf = true
                encoding = 'buffer'
                chunk = newChunk
              }
            }
            const len = state.objectMode ? 1 : chunk.length
            state.length += len
            const ret = state.length < state.highWaterMark
            // we must ensure that previous needDrain will not be reset to false.
            if (!ret) state.needDrain = true
            if (state.writing || state.corked) {
              const last = state.lastBufferedRequest
              state.lastBufferedRequest = {
                chunk,
                encoding,
                isBuf,
                callback: cb,
                next: null
              }
              if (last) {
                last.next = state.lastBufferedRequest
              } else {
                state.bufferedRequest = state.lastBufferedRequest
              }
              state.bufferedRequestCount += 1
            } else {
              doWrite(stream, state, false, len, chunk, encoding, cb)
            }
            return ret
          }
          function doWrite (stream, state, writev, len, chunk, encoding, cb) {
            state.writelen = len
            state.writecb = cb
            state.writing = true
            state.sync = true
            if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write')); else if (writev) stream._writev(chunk, state.onwrite); else stream._write(chunk, encoding, state.onwrite)
            state.sync = false
          }
          function onwriteError (stream, state, sync, er, cb) {
            --state.pendingcb
            if (sync) {
              // defer the callback if we are being called synchronously
              // to avoid piling up things on the stack
              process.nextTick(cb, er)
              // this can emit finish, and it will always happen
              // after error
              process.nextTick(finishMaybe, stream, state)
              stream._writableState.errorEmitted = true
              errorOrDestroy(stream, er)
            } else {
              // the caller expect this to happen before if
              // it is async
              cb(er)
              stream._writableState.errorEmitted = true
              errorOrDestroy(stream, er)
              // this can emit finish, but finish must
              // always follow error
              finishMaybe(stream, state)
            }
          }
          function onwriteStateUpdate (state) {
            state.writing = false
            state.writecb = null
            state.length -= state.writelen
            state.writelen = 0
          }
          function onwrite (stream, er) {
            const state = stream._writableState
            const sync = state.sync
            const cb = state.writecb
            if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK()
            onwriteStateUpdate(state)
            if (er) onwriteError(stream, state, sync, er, cb); else {
              // Check if we're actually ready to finish, but don't emit yet
              const finished = needFinish(state) || stream.destroyed
              if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
                clearBuffer(stream, state)
              }
              if (sync) {
                process.nextTick(afterWrite, stream, state, finished, cb)
              } else {
                afterWrite(stream, state, finished, cb)
              }
            }
          }
          function afterWrite (stream, state, finished, cb) {
            if (!finished) onwriteDrain(stream, state)
            state.pendingcb--
            cb()
            finishMaybe(stream, state)
          }

          // Must force callback to be called on nextTick, so that we don't
          // emit 'drain' before the write() consumer gets the 'false' return
          // value, and has a chance to attach a 'drain' listener.
          function onwriteDrain (stream, state) {
            if (state.length === 0 && state.needDrain) {
              state.needDrain = false
              stream.emit('drain')
            }
          }

          // if there's something in the buffer waiting, then process it
          function clearBuffer (stream, state) {
            state.bufferProcessing = true
            let entry = state.bufferedRequest
            if (stream._writev && entry && entry.next) {
              // Fast case, write everything using _writev()
              const l = state.bufferedRequestCount
              const buffer = new Array(l)
              const holder = state.corkedRequestsFree
              holder.entry = entry
              let count = 0
              let allBuffers = true
              while (entry) {
                buffer[count] = entry
                if (!entry.isBuf) allBuffers = false
                entry = entry.next
                count += 1
              }
              buffer.allBuffers = allBuffers
              doWrite(stream, state, true, state.length, buffer, '', holder.finish)

              // doWrite is almost always async, defer these to save a bit of time
              // as the hot path ends with doWrite
              state.pendingcb++
              state.lastBufferedRequest = null
              if (holder.next) {
                state.corkedRequestsFree = holder.next
                holder.next = null
              } else {
                state.corkedRequestsFree = new CorkedRequest(state)
              }
              state.bufferedRequestCount = 0
            } else {
              // Slow case, write chunks one-by-one
              while (entry) {
                const chunk = entry.chunk
                const encoding = entry.encoding
                const cb = entry.callback
                const len = state.objectMode ? 1 : chunk.length
                doWrite(stream, state, false, len, chunk, encoding, cb)
                entry = entry.next
                state.bufferedRequestCount--
                // if we didn't call the onwrite immediately, then
                // it means that we need to wait until it does.
                // also, that means that the chunk and cb are currently
                // being processed, so move the buffer counter past them.
                if (state.writing) {
                  break
                }
              }
              if (entry === null) state.lastBufferedRequest = null
            }
            state.bufferedRequest = entry
            state.bufferProcessing = false
          }
          Writable.prototype._write = function (chunk, encoding, cb) {
            cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'))
          }
          Writable.prototype._writev = null
          Writable.prototype.end = function (chunk, encoding, cb) {
            const state = this._writableState
            if (typeof chunk === 'function') {
              cb = chunk
              chunk = null
              encoding = null
            } else if (typeof encoding === 'function') {
              cb = encoding
              encoding = null
            }
            if (chunk !== null && chunk !== undefined) this.write(chunk, encoding)

            // .end() fully uncorks
            if (state.corked) {
              state.corked = 1
              this.uncork()
            }

            // ignore unnecessary end() calls.
            if (!state.ending) endWritable(this, state, cb)
            return this
          }
          Object.defineProperty(Writable.prototype, 'writableLength', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              return this._writableState.length
            }
          })
          function needFinish (state) {
            return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing
          }
          function callFinal (stream, state) {
            stream._final(function (err) {
              state.pendingcb--
              if (err) {
                errorOrDestroy(stream, err)
              }
              state.prefinished = true
              stream.emit('prefinish')
              finishMaybe(stream, state)
            })
          }
          function prefinish (stream, state) {
            if (!state.prefinished && !state.finalCalled) {
              if (typeof stream._final === 'function' && !state.destroyed) {
                state.pendingcb++
                state.finalCalled = true
                process.nextTick(callFinal, stream, state)
              } else {
                state.prefinished = true
                stream.emit('prefinish')
              }
            }
          }
          function finishMaybe (stream, state) {
            const need = needFinish(state)
            if (need) {
              prefinish(stream, state)
              if (state.pendingcb === 0) {
                state.finished = true
                stream.emit('finish')
                if (state.autoDestroy) {
                  // In case of duplex streams we need a way to detect
                  // if the readable side is ready for autoDestroy as well
                  const rState = stream._readableState
                  if (!rState || rState.autoDestroy && rState.endEmitted) {
                    stream.destroy()
                  }
                }
              }
            }
            return need
          }
          function endWritable (stream, state, cb) {
            state.ending = true
            finishMaybe(stream, state)
            if (cb) {
              if (state.finished) process.nextTick(cb); else stream.once('finish', cb)
            }
            state.ended = true
            stream.writable = false
          }
          function onCorkedFinish (corkReq, state, err) {
            let entry = corkReq.entry
            corkReq.entry = null
            while (entry) {
              const cb = entry.callback
              state.pendingcb--
              cb(err)
              entry = entry.next
            }

            // reuse the free corkReq.
            state.corkedRequestsFree.next = corkReq
          }
          Object.defineProperty(Writable.prototype, 'destroyed', {
            // making it explicit this property is not enumerable
            // because otherwise some prototype manipulation in
            // userland will fail
            enumerable: false,
            get: function get () {
              if (this._writableState === undefined) {
                return false
              }
              return this._writableState.destroyed
            },
            set: function set (value) {
              // we ignore the value if the stream
              // has not been initialized yet
              if (!this._writableState) {
                return
              }

              // backward compatibility, the user is explicitly
              // managing destroyed
              this._writableState.destroyed = value
            }
          })
          Writable.prototype.destroy = destroyImpl.destroy
          Writable.prototype._undestroy = destroyImpl.undestroy
          Writable.prototype._destroy = function (err, cb) {
            cb(err)
          }
        }).call(this)
      }).call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, { '../errors': 57, './_stream_duplex': 58, './internal/streams/destroy': 65, './internal/streams/state': 69, './internal/streams/stream': 70, _process: 56, buffer: 16, inherits: 34, 'util-deprecate': 75 }],
    63: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict'

          let _Object$setPrototypeO
          function _defineProperty (obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }
          function _toPropertyKey (arg) { const key = _toPrimitive(arg, 'string'); return typeof key === 'symbol' ? key : String(key) }
          function _toPrimitive (input, hint) { if (typeof input !== 'object' || input === null) return input; const prim = input[Symbol.toPrimitive]; if (prim !== undefined) { const res = prim.call(input, hint || 'default'); if (typeof res !== 'object') return res; throw new TypeError('@@toPrimitive must return a primitive value.') } return (hint === 'string' ? String : Number)(input) }
          const finished = require('./end-of-stream')
          const kLastResolve = Symbol('lastResolve')
          const kLastReject = Symbol('lastReject')
          const kError = Symbol('error')
          const kEnded = Symbol('ended')
          const kLastPromise = Symbol('lastPromise')
          const kHandlePromise = Symbol('handlePromise')
          const kStream = Symbol('stream')
          function createIterResult (value, done) {
            return {
              value,
              done
            }
          }
          function readAndResolve (iter) {
            const resolve = iter[kLastResolve]
            if (resolve !== null) {
              const data = iter[kStream].read()
              // we defer if data is null
              // we can be expecting either 'end' or
              // 'error'
              if (data !== null) {
                iter[kLastPromise] = null
                iter[kLastResolve] = null
                iter[kLastReject] = null
                resolve(createIterResult(data, false))
              }
            }
          }
          function onReadable (iter) {
            // we wait for the next tick, because it might
            // emit an error with process.nextTick
            process.nextTick(readAndResolve, iter)
          }
          function wrapForNext (lastPromise, iter) {
            return function (resolve, reject) {
              lastPromise.then(function () {
                if (iter[kEnded]) {
                  resolve(createIterResult(undefined, true))
                  return
                }
                iter[kHandlePromise](resolve, reject)
              }, reject)
            }
          }
          const AsyncIteratorPrototype = Object.getPrototypeOf(function () {})
          const ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
            get stream () {
              return this[kStream]
            },
            next: function next () {
              const _this = this
              // if we have detected an error in the meanwhile
              // reject straight away
              const error = this[kError]
              if (error !== null) {
                return Promise.reject(error)
              }
              if (this[kEnded]) {
                return Promise.resolve(createIterResult(undefined, true))
              }
              if (this[kStream].destroyed) {
                // We need to defer via nextTick because if .destroy(err) is
                // called, the error will be emitted via nextTick, and
                // we cannot guarantee that there is no error lingering around
                // waiting to be emitted.
                return new Promise(function (resolve, reject) {
                  process.nextTick(function () {
                    if (_this[kError]) {
                      reject(_this[kError])
                    } else {
                      resolve(createIterResult(undefined, true))
                    }
                  })
                })
              }

              // if we have multiple next() calls
              // we will wait for the previous Promise to finish
              // this logic is optimized to support for await loops,
              // where next() is only called once at a time
              const lastPromise = this[kLastPromise]
              let promise
              if (lastPromise) {
                promise = new Promise(wrapForNext(lastPromise, this))
              } else {
                // fast path needed to support multiple this.push()
                // without triggering the next() queue
                const data = this[kStream].read()
                if (data !== null) {
                  return Promise.resolve(createIterResult(data, false))
                }
                promise = new Promise(this[kHandlePromise])
              }
              this[kLastPromise] = promise
              return promise
            }
          }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
            return this
          }), _defineProperty(_Object$setPrototypeO, 'return', function _return () {
            const _this2 = this
            // destroy(err, cb) is a private API
            // we can guarantee we have that here, because we control the
            // Readable class this is attached to
            return new Promise(function (resolve, reject) {
              _this2[kStream].destroy(null, function (err) {
                if (err) {
                  reject(err)
                  return
                }
                resolve(createIterResult(undefined, true))
              })
            })
          }), _Object$setPrototypeO), AsyncIteratorPrototype)
          const createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator (stream) {
            let _Object$create
            var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
              value: stream,
              writable: true
            }), _defineProperty(_Object$create, kLastResolve, {
              value: null,
              writable: true
            }), _defineProperty(_Object$create, kLastReject, {
              value: null,
              writable: true
            }), _defineProperty(_Object$create, kError, {
              value: null,
              writable: true
            }), _defineProperty(_Object$create, kEnded, {
              value: stream._readableState.endEmitted,
              writable: true
            }), _defineProperty(_Object$create, kHandlePromise, {
              value: function value (resolve, reject) {
                const data = iterator[kStream].read()
                if (data) {
                  iterator[kLastPromise] = null
                  iterator[kLastResolve] = null
                  iterator[kLastReject] = null
                  resolve(createIterResult(data, false))
                } else {
                  iterator[kLastResolve] = resolve
                  iterator[kLastReject] = reject
                }
              },
              writable: true
            }), _Object$create))
            iterator[kLastPromise] = null
            finished(stream, function (err) {
              if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
                const reject = iterator[kLastReject]
                // reject if we are waiting for data in the Promise
                // returned by next() and store the error
                if (reject !== null) {
                  iterator[kLastPromise] = null
                  iterator[kLastResolve] = null
                  iterator[kLastReject] = null
                  reject(err)
                }
                iterator[kError] = err
                return
              }
              const resolve = iterator[kLastResolve]
              if (resolve !== null) {
                iterator[kLastPromise] = null
                iterator[kLastResolve] = null
                iterator[kLastReject] = null
                resolve(createIterResult(undefined, true))
              }
              iterator[kEnded] = true
            })
            stream.on('readable', onReadable.bind(null, iterator))
            return iterator
          }
          module.exports = createReadableStreamAsyncIterator
        }).call(this)
      }).call(this, require('_process'))
    }, { './end-of-stream': 66, _process: 56 }],
    64: [function (require, module, exports) {
      'use strict'

      function ownKeys (object, enumerableOnly) { const keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable })), keys.push.apply(keys, symbols) } return keys }
      function _objectSpread (target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]) }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)) }) } return target }
      function _defineProperty (obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }
      function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }
      function _defineProperties (target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor) } }
      function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, 'prototype', { writable: false }); return Constructor }
      function _toPropertyKey (arg) { const key = _toPrimitive(arg, 'string'); return typeof key === 'symbol' ? key : String(key) }
      function _toPrimitive (input, hint) { if (typeof input !== 'object' || input === null) return input; const prim = input[Symbol.toPrimitive]; if (prim !== undefined) { const res = prim.call(input, hint || 'default'); if (typeof res !== 'object') return res; throw new TypeError('@@toPrimitive must return a primitive value.') } return (hint === 'string' ? String : Number)(input) }
      const _require = require('buffer')
      const Buffer = _require.Buffer
      const _require2 = require('util')
      const inspect = _require2.inspect
      const custom = inspect && inspect.custom || 'inspect'
      function copyBuffer (src, target, offset) {
        Buffer.prototype.copy.call(src, target, offset)
      }
      module.exports = /* #__PURE__ */(function () {
        function BufferList () {
          _classCallCheck(this, BufferList)
          this.head = null
          this.tail = null
          this.length = 0
        }
        _createClass(BufferList, [{
          key: 'push',
          value: function push (v) {
            const entry = {
              data: v,
              next: null
            }
            if (this.length > 0) this.tail.next = entry; else this.head = entry
            this.tail = entry
            ++this.length
          }
        }, {
          key: 'unshift',
          value: function unshift (v) {
            const entry = {
              data: v,
              next: this.head
            }
            if (this.length === 0) this.tail = entry
            this.head = entry
            ++this.length
          }
        }, {
          key: 'shift',
          value: function shift () {
            if (this.length === 0) return
            const ret = this.head.data
            if (this.length === 1) this.head = this.tail = null; else this.head = this.head.next
            --this.length
            return ret
          }
        }, {
          key: 'clear',
          value: function clear () {
            this.head = this.tail = null
            this.length = 0
          }
        }, {
          key: 'join',
          value: function join (s) {
            if (this.length === 0) return ''
            let p = this.head
            let ret = '' + p.data
            while (p = p.next) ret += s + p.data
            return ret
          }
        }, {
          key: 'concat',
          value: function concat (n) {
            if (this.length === 0) return Buffer.alloc(0)
            const ret = Buffer.allocUnsafe(n >>> 0)
            let p = this.head
            let i = 0
            while (p) {
              copyBuffer(p.data, ret, i)
              i += p.data.length
              p = p.next
            }
            return ret
          }

        // Consumes a specified amount of bytes or characters from the buffered data.
        }, {
          key: 'consume',
          value: function consume (n, hasStrings) {
            let ret
            if (n < this.head.data.length) {
            // `slice` is the same for buffers and strings.
              ret = this.head.data.slice(0, n)
              this.head.data = this.head.data.slice(n)
            } else if (n === this.head.data.length) {
            // First chunk is a perfect match.
              ret = this.shift()
            } else {
            // Result spans more than one buffer.
              ret = hasStrings ? this._getString(n) : this._getBuffer(n)
            }
            return ret
          }
        }, {
          key: 'first',
          value: function first () {
            return this.head.data
          }

        // Consumes a specified amount of characters from the buffered data.
        }, {
          key: '_getString',
          value: function _getString (n) {
            let p = this.head
            let c = 1
            let ret = p.data
            n -= ret.length
            while (p = p.next) {
              const str = p.data
              const nb = n > str.length ? str.length : n
              if (nb === str.length) ret += str; else ret += str.slice(0, n)
              n -= nb
              if (n === 0) {
                if (nb === str.length) {
                  ++c
                  if (p.next) this.head = p.next; else this.head = this.tail = null
                } else {
                  this.head = p
                  p.data = str.slice(nb)
                }
                break
              }
              ++c
            }
            this.length -= c
            return ret
          }

        // Consumes a specified amount of bytes from the buffered data.
        }, {
          key: '_getBuffer',
          value: function _getBuffer (n) {
            const ret = Buffer.allocUnsafe(n)
            let p = this.head
            let c = 1
            p.data.copy(ret)
            n -= p.data.length
            while (p = p.next) {
              const buf = p.data
              const nb = n > buf.length ? buf.length : n
              buf.copy(ret, ret.length - n, 0, nb)
              n -= nb
              if (n === 0) {
                if (nb === buf.length) {
                  ++c
                  if (p.next) this.head = p.next; else this.head = this.tail = null
                } else {
                  this.head = p
                  p.data = buf.slice(nb)
                }
                break
              }
              ++c
            }
            this.length -= c
            return ret
          }

        // Make sure the linked list only shows the minimal necessary information.
        }, {
          key: custom,
          value: function value (_, options) {
            return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
            // Only inspect one level.
              depth: 0,
              // It should not recurse.
              customInspect: false
            }))
          }
        }])
        return BufferList
      }())
    }, { buffer: 16, util: 13 }],
    65: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict'

          // undocumented cb() API, needed for core, not for public API
          function destroy (err, cb) {
            const _this = this
            const readableDestroyed = this._readableState && this._readableState.destroyed
            const writableDestroyed = this._writableState && this._writableState.destroyed
            if (readableDestroyed || writableDestroyed) {
              if (cb) {
                cb(err)
              } else if (err) {
                if (!this._writableState) {
                  process.nextTick(emitErrorNT, this, err)
                } else if (!this._writableState.errorEmitted) {
                  this._writableState.errorEmitted = true
                  process.nextTick(emitErrorNT, this, err)
                }
              }
              return this
            }

            // we set destroyed to true before firing error callbacks in order
            // to make it re-entrance safe in case destroy() is called within callbacks

            if (this._readableState) {
              this._readableState.destroyed = true
            }

            // if this is a duplex stream mark the writable part as destroyed as well
            if (this._writableState) {
              this._writableState.destroyed = true
            }
            this._destroy(err || null, function (err) {
              if (!cb && err) {
                if (!_this._writableState) {
                  process.nextTick(emitErrorAndCloseNT, _this, err)
                } else if (!_this._writableState.errorEmitted) {
                  _this._writableState.errorEmitted = true
                  process.nextTick(emitErrorAndCloseNT, _this, err)
                } else {
                  process.nextTick(emitCloseNT, _this)
                }
              } else if (cb) {
                process.nextTick(emitCloseNT, _this)
                cb(err)
              } else {
                process.nextTick(emitCloseNT, _this)
              }
            })
            return this
          }
          function emitErrorAndCloseNT (self, err) {
            emitErrorNT(self, err)
            emitCloseNT(self)
          }
          function emitCloseNT (self) {
            if (self._writableState && !self._writableState.emitClose) return
            if (self._readableState && !self._readableState.emitClose) return
            self.emit('close')
          }
          function undestroy () {
            if (this._readableState) {
              this._readableState.destroyed = false
              this._readableState.reading = false
              this._readableState.ended = false
              this._readableState.endEmitted = false
            }
            if (this._writableState) {
              this._writableState.destroyed = false
              this._writableState.ended = false
              this._writableState.ending = false
              this._writableState.finalCalled = false
              this._writableState.prefinished = false
              this._writableState.finished = false
              this._writableState.errorEmitted = false
            }
          }
          function emitErrorNT (self, err) {
            self.emit('error', err)
          }
          function errorOrDestroy (stream, err) {
            // We have tests that rely on errors being emitted
            // in the same tick, so changing this is semver major.
            // For now when you opt-in to autoDestroy we allow
            // the error to be emitted nextTick. In a future
            // semver major update we should change the default to this.

            const rState = stream._readableState
            const wState = stream._writableState
            if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err); else stream.emit('error', err)
          }
          module.exports = {
            destroy,
            undestroy,
            errorOrDestroy
          }
        }).call(this)
      }).call(this, require('_process'))
    }, { _process: 56 }],
    66: [function (require, module, exports) {
    // Ported from https://github.com/mafintosh/end-of-stream with
    // permission from the author, Mathias Buus (@mafintosh).

      'use strict'

      const ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE
      function once (callback) {
        let called = false
        return function () {
          if (called) return
          called = true
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key]
          }
          callback.apply(this, args)
        }
      }
      function noop () {}
      function isRequest (stream) {
        return stream.setHeader && typeof stream.abort === 'function'
      }
      function eos (stream, opts, callback) {
        if (typeof opts === 'function') return eos(stream, null, opts)
        if (!opts) opts = {}
        callback = once(callback || noop)
        let readable = opts.readable || opts.readable !== false && stream.readable
        let writable = opts.writable || opts.writable !== false && stream.writable
        const onlegacyfinish = function onlegacyfinish () {
          if (!stream.writable) onfinish()
        }
        let writableEnded = stream._writableState && stream._writableState.finished
        var onfinish = function onfinish () {
          writable = false
          writableEnded = true
          if (!readable) callback.call(stream)
        }
        let readableEnded = stream._readableState && stream._readableState.endEmitted
        const onend = function onend () {
          readable = false
          readableEnded = true
          if (!writable) callback.call(stream)
        }
        const onerror = function onerror (err) {
          callback.call(stream, err)
        }
        const onclose = function onclose () {
          let err
          if (readable && !readableEnded) {
            if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE()
            return callback.call(stream, err)
          }
          if (writable && !writableEnded) {
            if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE()
            return callback.call(stream, err)
          }
        }
        const onrequest = function onrequest () {
          stream.req.on('finish', onfinish)
        }
        if (isRequest(stream)) {
          stream.on('complete', onfinish)
          stream.on('abort', onclose)
          if (stream.req) onrequest(); else stream.on('request', onrequest)
        } else if (writable && !stream._writableState) {
        // legacy streams
          stream.on('end', onlegacyfinish)
          stream.on('close', onlegacyfinish)
        }
        stream.on('end', onend)
        stream.on('finish', onfinish)
        if (opts.error !== false) stream.on('error', onerror)
        stream.on('close', onclose)
        return function () {
          stream.removeListener('complete', onfinish)
          stream.removeListener('abort', onclose)
          stream.removeListener('request', onrequest)
          if (stream.req) stream.req.removeListener('finish', onfinish)
          stream.removeListener('end', onlegacyfinish)
          stream.removeListener('close', onlegacyfinish)
          stream.removeListener('finish', onfinish)
          stream.removeListener('end', onend)
          stream.removeListener('error', onerror)
          stream.removeListener('close', onclose)
        }
      }
      module.exports = eos
    }, { '../../../errors': 57 }],
    67: [function (require, module, exports) {
      module.exports = function () {
        throw new Error('Readable.from is not available in the browser')
      }
    }, {}],
    68: [function (require, module, exports) {
    // Ported from https://github.com/mafintosh/pump with
    // permission from the author, Mathias Buus (@mafintosh).

      'use strict'

      let eos
      function once (callback) {
        let called = false
        return function () {
          if (called) return
          called = true
          callback.apply(void 0, arguments)
        }
      }
      const _require$codes = require('../../../errors').codes
      const ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS
      const ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED
      function noop (err) {
      // Rethrow the error if it exists to avoid swallowing it
        if (err) throw err
      }
      function isRequest (stream) {
        return stream.setHeader && typeof stream.abort === 'function'
      }
      function destroyer (stream, reading, writing, callback) {
        callback = once(callback)
        let closed = false
        stream.on('close', function () {
          closed = true
        })
        if (eos === undefined) eos = require('./end-of-stream')
        eos(stream, {
          readable: reading,
          writable: writing
        }, function (err) {
          if (err) return callback(err)
          closed = true
          callback()
        })
        let destroyed = false
        return function (err) {
          if (closed) return
          if (destroyed) return
          destroyed = true

          // request.destroy just do .end - .abort is what we want
          if (isRequest(stream)) return stream.abort()
          if (typeof stream.destroy === 'function') return stream.destroy()
          callback(err || new ERR_STREAM_DESTROYED('pipe'))
        }
      }
      function call (fn) {
        fn()
      }
      function pipe (from, to) {
        return from.pipe(to)
      }
      function popCallback (streams) {
        if (!streams.length) return noop
        if (typeof streams[streams.length - 1] !== 'function') return noop
        return streams.pop()
      }
      function pipeline () {
        for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
          streams[_key] = arguments[_key]
        }
        const callback = popCallback(streams)
        if (Array.isArray(streams[0])) streams = streams[0]
        if (streams.length < 2) {
          throw new ERR_MISSING_ARGS('streams')
        }
        let error
        var destroys = streams.map(function (stream, i) {
          const reading = i < streams.length - 1
          const writing = i > 0
          return destroyer(stream, reading, writing, function (err) {
            if (!error) error = err
            if (err) destroys.forEach(call)
            if (reading) return
            destroys.forEach(call)
            callback(error)
          })
        })
        return streams.reduce(pipe)
      }
      module.exports = pipeline
    }, { '../../../errors': 57, './end-of-stream': 66 }],
    69: [function (require, module, exports) {
      'use strict'

      const ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE
      function highWaterMarkFrom (options, isDuplex, duplexKey) {
        return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null
      }
      function getHighWaterMark (state, options, duplexKey, isDuplex) {
        const hwm = highWaterMarkFrom(options, isDuplex, duplexKey)
        if (hwm != null) {
          if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
            const name = isDuplex ? duplexKey : 'highWaterMark'
            throw new ERR_INVALID_OPT_VALUE(name, hwm)
          }
          return Math.floor(hwm)
        }

        // Default value
        return state.objectMode ? 16 : 16 * 1024
      }
      module.exports = {
        getHighWaterMark
      }
    }, { '../../../errors': 57 }],
    70: [function (require, module, exports) {
      module.exports = require('events').EventEmitter
    }, { events: 20 }],
    71: [function (require, module, exports) {
    /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
    /* eslint-disable node/no-deprecated-api */
      const buffer = require('buffer')
      const Buffer = buffer.Buffer

      // alternative to using Object.keys for old browsers
      function copyProps (src, dst) {
        for (const key in src) {
          dst[key] = src[key]
        }
      }
      if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
        module.exports = buffer
      } else {
      // Copy properties from require('buffer')
        copyProps(buffer, exports)
        exports.Buffer = SafeBuffer
      }

      function SafeBuffer (arg, encodingOrOffset, length) {
        return Buffer(arg, encodingOrOffset, length)
      }

      SafeBuffer.prototype = Object.create(Buffer.prototype)

      // Copy static methods from Buffer
      copyProps(Buffer, SafeBuffer)

      SafeBuffer.from = function (arg, encodingOrOffset, length) {
        if (typeof arg === 'number') {
          throw new TypeError('Argument must not be a number')
        }
        return Buffer(arg, encodingOrOffset, length)
      }

      SafeBuffer.alloc = function (size, fill, encoding) {
        if (typeof size !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        const buf = Buffer(size)
        if (fill !== undefined) {
          if (typeof encoding === 'string') {
            buf.fill(fill, encoding)
          } else {
            buf.fill(fill)
          }
        } else {
          buf.fill(0)
        }
        return buf
      }

      SafeBuffer.allocUnsafe = function (size) {
        if (typeof size !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        return Buffer(size)
      }

      SafeBuffer.allocUnsafeSlow = function (size) {
        if (typeof size !== 'number') {
          throw new TypeError('Argument must be a number')
        }
        return buffer.SlowBuffer(size)
      }
    }, { buffer: 16 }],
    72: [function (require, module, exports) {
      'use strict'

      const GetIntrinsic = require('get-intrinsic')
      const define = require('define-data-property')
      const hasDescriptors = require('has-property-descriptors')()
      const gOPD = require('gopd')

      const $TypeError = GetIntrinsic('%TypeError%')
      const $floor = GetIntrinsic('%Math.floor%')

      module.exports = function setFunctionLength (fn, length) {
        if (typeof fn !== 'function') {
          throw new $TypeError('`fn` is not a function')
        }
        if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
          throw new $TypeError('`length` must be a positive 32-bit integer')
        }

        const loose = arguments.length > 2 && !!arguments[2]

        let functionLengthIsConfigurable = true
        let functionLengthIsWritable = true
        if ('length' in fn && gOPD) {
          const desc = gOPD(fn, 'length')
          if (desc && !desc.configurable) {
            functionLengthIsConfigurable = false
          }
          if (desc && !desc.writable) {
            functionLengthIsWritable = false
          }
        }

        if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
          if (hasDescriptors) {
            define(fn, 'length', length, true, true)
          } else {
            define(fn, 'length', length)
          }
        }
        return fn
      }
    }, { 'define-data-property': 19, 'get-intrinsic': 24, gopd: 25, 'has-property-descriptors': 26 }],
    73: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

      module.exports = Stream

      const EE = require('events').EventEmitter
      const inherits = require('inherits')

      inherits(Stream, EE)
      Stream.Readable = require('readable-stream/lib/_stream_readable.js')
      Stream.Writable = require('readable-stream/lib/_stream_writable.js')
      Stream.Duplex = require('readable-stream/lib/_stream_duplex.js')
      Stream.Transform = require('readable-stream/lib/_stream_transform.js')
      Stream.PassThrough = require('readable-stream/lib/_stream_passthrough.js')
      Stream.finished = require('readable-stream/lib/internal/streams/end-of-stream.js')
      Stream.pipeline = require('readable-stream/lib/internal/streams/pipeline.js')

      // Backwards-compat with node 0.4.x
      Stream.Stream = Stream

      // old-style streams.  Note that the pipe method (the only relevant
      // part of this class) is overridden in the Readable class.

      function Stream () {
        EE.call(this)
      }

      Stream.prototype.pipe = function (dest, options) {
        const source = this

        function ondata (chunk) {
          if (dest.writable) {
            if (dest.write(chunk) === false && source.pause) {
              source.pause()
            }
          }
        }

        source.on('data', ondata)

        function ondrain () {
          if (source.readable && source.resume) {
            source.resume()
          }
        }

        dest.on('drain', ondrain)

        // If the 'end' option is not supplied, dest.end() will be called when
        // source gets the 'end' or 'close' events.  Only dest.end() once.
        if (!dest._isStdio && (!options || options.end !== false)) {
          source.on('end', onend)
          source.on('close', onclose)
        }

        let didOnEnd = false
        function onend () {
          if (didOnEnd) return
          didOnEnd = true

          dest.end()
        }

        function onclose () {
          if (didOnEnd) return
          didOnEnd = true

          if (typeof dest.destroy === 'function') dest.destroy()
        }

        // don't leave dangling pipes when there are errors.
        function onerror (er) {
          cleanup()
          if (EE.listenerCount(this, 'error') === 0) {
            throw er // Unhandled stream error in pipe.
          }
        }

        source.on('error', onerror)
        dest.on('error', onerror)

        // remove all the event listeners that were added.
        function cleanup () {
          source.removeListener('data', ondata)
          dest.removeListener('drain', ondrain)

          source.removeListener('end', onend)
          source.removeListener('close', onclose)

          source.removeListener('error', onerror)
          dest.removeListener('error', onerror)

          source.removeListener('end', cleanup)
          source.removeListener('close', cleanup)

          dest.removeListener('close', cleanup)
        }

        source.on('end', cleanup)
        source.on('close', cleanup)

        dest.on('close', cleanup)

        dest.emit('pipe', source)

        // Allow for unix-like usage: A.pipe(B).pipe(C)
        return dest
      }
    }, { events: 20, inherits: 34, 'readable-stream/lib/_stream_duplex.js': 58, 'readable-stream/lib/_stream_passthrough.js': 59, 'readable-stream/lib/_stream_readable.js': 60, 'readable-stream/lib/_stream_transform.js': 61, 'readable-stream/lib/_stream_writable.js': 62, 'readable-stream/lib/internal/streams/end-of-stream.js': 66, 'readable-stream/lib/internal/streams/pipeline.js': 68 }],
    74: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

      'use strict'

      /* <replacement> */

      const Buffer = require('safe-buffer').Buffer
      /* </replacement> */

      const isEncoding = Buffer.isEncoding || function (encoding) {
        encoding = '' + encoding
        switch (encoding && encoding.toLowerCase()) {
          case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
            return true
          default:
            return false
        }
      }

      function _normalizeEncoding (enc) {
        if (!enc) return 'utf8'
        let retried
        while (true) {
          switch (enc) {
            case 'utf8':
            case 'utf-8':
              return 'utf8'
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return 'utf16le'
            case 'latin1':
            case 'binary':
              return 'latin1'
            case 'base64':
            case 'ascii':
            case 'hex':
              return enc
            default:
              if (retried) return // undefined
              enc = ('' + enc).toLowerCase()
              retried = true
          }
        }
      };

      // Do not cache `Buffer.isEncoding` when checking encoding names as some
      // modules monkey-patch it to support additional encodings
      function normalizeEncoding (enc) {
        const nenc = _normalizeEncoding(enc)
        if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc)
        return nenc || enc
      }

      // StringDecoder provides an interface for efficiently splitting a series of
      // buffers into a series of JS strings without breaking apart multi-byte
      // characters.
      exports.StringDecoder = StringDecoder
      function StringDecoder (encoding) {
        this.encoding = normalizeEncoding(encoding)
        let nb
        switch (this.encoding) {
          case 'utf16le':
            this.text = utf16Text
            this.end = utf16End
            nb = 4
            break
          case 'utf8':
            this.fillLast = utf8FillLast
            nb = 4
            break
          case 'base64':
            this.text = base64Text
            this.end = base64End
            nb = 3
            break
          default:
            this.write = simpleWrite
            this.end = simpleEnd
            return
        }
        this.lastNeed = 0
        this.lastTotal = 0
        this.lastChar = Buffer.allocUnsafe(nb)
      }

      StringDecoder.prototype.write = function (buf) {
        if (buf.length === 0) return ''
        let r
        let i
        if (this.lastNeed) {
          r = this.fillLast(buf)
          if (r === undefined) return ''
          i = this.lastNeed
          this.lastNeed = 0
        } else {
          i = 0
        }
        if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i)
        return r || ''
      }

      StringDecoder.prototype.end = utf8End

      // Returns only complete characters in a Buffer
      StringDecoder.prototype.text = utf8Text

      // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
      StringDecoder.prototype.fillLast = function (buf) {
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed)
          return this.lastChar.toString(this.encoding, 0, this.lastTotal)
        }
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length)
        this.lastNeed -= buf.length
      }

      // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
      // continuation byte. If an invalid byte is detected, -2 is returned.
      function utf8CheckByte (byte) {
        if (byte <= 0x7F) return 0; else if (byte >> 5 === 0x06) return 2; else if (byte >> 4 === 0x0E) return 3; else if (byte >> 3 === 0x1E) return 4
        return byte >> 6 === 0x02 ? -1 : -2
      }

      // Checks at most 3 bytes at the end of a Buffer in order to detect an
      // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
      // needed to complete the UTF-8 character (if applicable) are returned.
      function utf8CheckIncomplete (self, buf, i) {
        let j = buf.length - 1
        if (j < i) return 0
        let nb = utf8CheckByte(buf[j])
        if (nb >= 0) {
          if (nb > 0) self.lastNeed = nb - 1
          return nb
        }
        if (--j < i || nb === -2) return 0
        nb = utf8CheckByte(buf[j])
        if (nb >= 0) {
          if (nb > 0) self.lastNeed = nb - 2
          return nb
        }
        if (--j < i || nb === -2) return 0
        nb = utf8CheckByte(buf[j])
        if (nb >= 0) {
          if (nb > 0) {
            if (nb === 2) nb = 0; else self.lastNeed = nb - 3
          }
          return nb
        }
        return 0
      }

      // Validates as many continuation bytes for a multi-byte UTF-8 character as
      // needed or are available. If we see a non-continuation byte where we expect
      // one, we "replace" the validated continuation bytes we've seen so far with
      // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
      // behavior. The continuation byte check is included three times in the case
      // where all of the continuation bytes for a character exist in the same buffer.
      // It is also done this way as a slight performance increase instead of using a
      // loop.
      function utf8CheckExtraBytes (self, buf, p) {
        if ((buf[0] & 0xC0) !== 0x80) {
          self.lastNeed = 0
          return '\ufffd'
        }
        if (self.lastNeed > 1 && buf.length > 1) {
          if ((buf[1] & 0xC0) !== 0x80) {
            self.lastNeed = 1
            return '\ufffd'
          }
          if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xC0) !== 0x80) {
              self.lastNeed = 2
              return '\ufffd'
            }
          }
        }
      }

      // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
      function utf8FillLast (buf) {
        const p = this.lastTotal - this.lastNeed
        const r = utf8CheckExtraBytes(this, buf, p)
        if (r !== undefined) return r
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, p, 0, this.lastNeed)
          return this.lastChar.toString(this.encoding, 0, this.lastTotal)
        }
        buf.copy(this.lastChar, p, 0, buf.length)
        this.lastNeed -= buf.length
      }

      // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
      // partial character, the character's bytes are buffered until the required
      // number of bytes are available.
      function utf8Text (buf, i) {
        const total = utf8CheckIncomplete(this, buf, i)
        if (!this.lastNeed) return buf.toString('utf8', i)
        this.lastTotal = total
        const end = buf.length - (total - this.lastNeed)
        buf.copy(this.lastChar, 0, end)
        return buf.toString('utf8', i, end)
      }

      // For UTF-8, a replacement character is added when ending on a partial
      // character.
      function utf8End (buf) {
        const r = buf && buf.length ? this.write(buf) : ''
        if (this.lastNeed) return r + '\ufffd'
        return r
      }

      // UTF-16LE typically needs two bytes per character, but even if we have an even
      // number of bytes available, we need to check if we end on a leading/high
      // surrogate. In that case, we need to wait for the next two bytes in order to
      // decode the last character properly.
      function utf16Text (buf, i) {
        if ((buf.length - i) % 2 === 0) {
          const r = buf.toString('utf16le', i)
          if (r) {
            const c = r.charCodeAt(r.length - 1)
            if (c >= 0xD800 && c <= 0xDBFF) {
              this.lastNeed = 2
              this.lastTotal = 4
              this.lastChar[0] = buf[buf.length - 2]
              this.lastChar[1] = buf[buf.length - 1]
              return r.slice(0, -1)
            }
          }
          return r
        }
        this.lastNeed = 1
        this.lastTotal = 2
        this.lastChar[0] = buf[buf.length - 1]
        return buf.toString('utf16le', i, buf.length - 1)
      }

      // For UTF-16LE we do not explicitly append special replacement characters if we
      // end on a partial character, we simply let v8 handle that.
      function utf16End (buf) {
        const r = buf && buf.length ? this.write(buf) : ''
        if (this.lastNeed) {
          const end = this.lastTotal - this.lastNeed
          return r + this.lastChar.toString('utf16le', 0, end)
        }
        return r
      }

      function base64Text (buf, i) {
        const n = (buf.length - i) % 3
        if (n === 0) return buf.toString('base64', i)
        this.lastNeed = 3 - n
        this.lastTotal = 3
        if (n === 1) {
          this.lastChar[0] = buf[buf.length - 1]
        } else {
          this.lastChar[0] = buf[buf.length - 2]
          this.lastChar[1] = buf[buf.length - 1]
        }
        return buf.toString('base64', i, buf.length - n)
      }

      function base64End (buf) {
        const r = buf && buf.length ? this.write(buf) : ''
        if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed)
        return r
      }

      // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
      function simpleWrite (buf) {
        return buf.toString(this.encoding)
      }

      function simpleEnd (buf) {
        return buf && buf.length ? this.write(buf) : ''
      }
    }, { 'safe-buffer': 71 }],
    75: [function (require, module, exports) {
      (function (global) {
        (function () {
          /**
 * Module exports.
 */

          module.exports = deprecate

          /**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

          function deprecate (fn, msg) {
            if (config('noDeprecation')) {
              return fn
            }

            let warned = false
            function deprecated () {
              if (!warned) {
                if (config('throwDeprecation')) {
                  throw new Error(msg)
                } else if (config('traceDeprecation')) {
                  console.trace(msg)
                } else {
                  console.warn(msg)
                }
                warned = true
              }
              return fn.apply(this, arguments)
            }

            return deprecated
          }

          /**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

          function config (name) {
            // accessing global.localStorage can trigger a DOMException in sandboxed iframes
            try {
              if (!global.localStorage) return false
            } catch (_) {
              return false
            }
            const val = global.localStorage[name]
            if (val == null) return false
            return String(val).toLowerCase() === 'true'
          }
        }).call(this)
      }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, {}],
    76: [function (require, module, exports) {
      module.exports = function isBuffer (arg) {
        return arg && typeof arg === 'object' &&
    typeof arg.copy === 'function' &&
    typeof arg.fill === 'function' &&
    typeof arg.readUInt8 === 'function'
      }
    }, {}],
    77: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          const formatRegExp = /%[sdj%]/g
          exports.format = function (f) {
            if (!isString(f)) {
              const objects = []
              for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]))
              }
              return objects.join(' ')
            }

            var i = 1
            const args = arguments
            const len = args.length
            let str = String(f).replace(formatRegExp, function (x) {
              if (x === '%%') return '%'
              if (i >= len) return x
              switch (x) {
                case '%s': return String(args[i++])
                case '%d': return Number(args[i++])
                case '%j':
                  try {
                    return JSON.stringify(args[i++])
                  } catch (_) {
                    return '[Circular]'
                  }
                default:
                  return x
              }
            })
            for (let x = args[i]; i < len; x = args[++i]) {
              if (isNull(x) || !isObject(x)) {
                str += ' ' + x
              } else {
                str += ' ' + inspect(x)
              }
            }
            return str
          }

          // Mark that a method should not be used.
          // Returns a modified function which warns once by default.
          // If --no-deprecation is set, then it is a no-op.
          exports.deprecate = function (fn, msg) {
            // Allow for deprecating things in the process of starting up.
            if (isUndefined(global.process)) {
              return function () {
                return exports.deprecate(fn, msg).apply(this, arguments)
              }
            }

            if (process.noDeprecation === true) {
              return fn
            }

            let warned = false
            function deprecated () {
              if (!warned) {
                if (process.throwDeprecation) {
                  throw new Error(msg)
                } else if (process.traceDeprecation) {
                  console.trace(msg)
                } else {
                  console.error(msg)
                }
                warned = true
              }
              return fn.apply(this, arguments)
            }

            return deprecated
          }

          const debugs = {}
          let debugEnviron
          exports.debuglog = function (set) {
            if (isUndefined(debugEnviron)) { debugEnviron = process.env.NODE_DEBUG || '' }
            set = set.toUpperCase()
            if (!debugs[set]) {
              if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                const pid = process.pid
                debugs[set] = function () {
                  const msg = exports.format.apply(exports, arguments)
                  console.error('%s %d: %s', set, pid, msg)
                }
              } else {
                debugs[set] = function () {}
              }
            }
            return debugs[set]
          }

          /**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
          /* legacy: obj, showHidden, depth, colors */
          function inspect (obj, opts) {
            // default options
            const ctx = {
              seen: [],
              stylize: stylizeNoColor
            }
            // legacy...
            if (arguments.length >= 3) ctx.depth = arguments[2]
            if (arguments.length >= 4) ctx.colors = arguments[3]
            if (isBoolean(opts)) {
              // legacy...
              ctx.showHidden = opts
            } else if (opts) {
              // got an "options" object
              exports._extend(ctx, opts)
            }
            // set default options
            if (isUndefined(ctx.showHidden)) ctx.showHidden = false
            if (isUndefined(ctx.depth)) ctx.depth = 2
            if (isUndefined(ctx.colors)) ctx.colors = false
            if (isUndefined(ctx.customInspect)) ctx.customInspect = true
            if (ctx.colors) ctx.stylize = stylizeWithColor
            return formatValue(ctx, obj, ctx.depth)
          }
          exports.inspect = inspect

          // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
          inspect.colors = {
            bold: [1, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            white: [37, 39],
            grey: [90, 39],
            black: [30, 39],
            blue: [34, 39],
            cyan: [36, 39],
            green: [32, 39],
            magenta: [35, 39],
            red: [31, 39],
            yellow: [33, 39]
          }

          // Don't use 'blue' not visible on cmd.exe
          inspect.styles = {
            special: 'cyan',
            number: 'yellow',
            boolean: 'yellow',
            undefined: 'grey',
            null: 'bold',
            string: 'green',
            date: 'magenta',
            // "name": intentionally not styling
            regexp: 'red'
          }

          function stylizeWithColor (str, styleType) {
            const style = inspect.styles[styleType]

            if (style) {
              return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm'
            } else {
              return str
            }
          }

          function stylizeNoColor (str, styleType) {
            return str
          }

          function arrayToHash (array) {
            const hash = {}

            array.forEach(function (val, idx) {
              hash[val] = true
            })

            return hash
          }

          function formatValue (ctx, value, recurseTimes) {
            // Provide a hook for user-specified inspect functions.
            // Check that value is an object with an inspect function on it
            if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
              let ret = value.inspect(recurseTimes, ctx)
              if (!isString(ret)) {
                ret = formatValue(ctx, ret, recurseTimes)
              }
              return ret
            }

            // Primitive types cannot have properties
            const primitive = formatPrimitive(ctx, value)
            if (primitive) {
              return primitive
            }

            // Look up the keys of the object.
            let keys = Object.keys(value)
            const visibleKeys = arrayToHash(keys)

            if (ctx.showHidden) {
              keys = Object.getOwnPropertyNames(value)
            }

            // IE doesn't make error fields non-enumerable
            // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
            if (isError(value) &&
      (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
              return formatError(value)
            }

            // Some type of object without properties can be shortcutted.
            if (keys.length === 0) {
              if (isFunction(value)) {
                const name = value.name ? ': ' + value.name : ''
                return ctx.stylize('[Function' + name + ']', 'special')
              }
              if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
              }
              if (isDate(value)) {
                return ctx.stylize(Date.prototype.toString.call(value), 'date')
              }
              if (isError(value)) {
                return formatError(value)
              }
            }

            let base = ''; let array = false; let braces = ['{', '}']

            // Make Array say that they are Array
            if (isArray(value)) {
              array = true
              braces = ['[', ']']
            }

            // Make functions say that they are functions
            if (isFunction(value)) {
              const n = value.name ? ': ' + value.name : ''
              base = ' [Function' + n + ']'
            }

            // Make RegExps say that they are RegExps
            if (isRegExp(value)) {
              base = ' ' + RegExp.prototype.toString.call(value)
            }

            // Make dates with properties first say the date
            if (isDate(value)) {
              base = ' ' + Date.prototype.toUTCString.call(value)
            }

            // Make error with message first say the error
            if (isError(value)) {
              base = ' ' + formatError(value)
            }

            if (keys.length === 0 && (!array || value.length == 0)) {
              return braces[0] + base + braces[1]
            }

            if (recurseTimes < 0) {
              if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
              } else {
                return ctx.stylize('[Object]', 'special')
              }
            }

            ctx.seen.push(value)

            let output
            if (array) {
              output = formatArray(ctx, value, recurseTimes, visibleKeys, keys)
            } else {
              output = keys.map(function (key) {
                return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
              })
            }

            ctx.seen.pop()

            return reduceToSingleString(output, base, braces)
          }

          function formatPrimitive (ctx, value) {
            if (isUndefined(value)) { return ctx.stylize('undefined', 'undefined') }
            if (isString(value)) {
              const simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                .replace(/'/g, "\\'")
                .replace(/\\"/g, '"') + '\''
              return ctx.stylize(simple, 'string')
            }
            if (isNumber(value)) { return ctx.stylize('' + value, 'number') }
            if (isBoolean(value)) { return ctx.stylize('' + value, 'boolean') }
            // For some reason typeof null is "object", so special case here.
            if (isNull(value)) { return ctx.stylize('null', 'null') }
          }

          function formatError (value) {
            return '[' + Error.prototype.toString.call(value) + ']'
          }

          function formatArray (ctx, value, recurseTimes, visibleKeys, keys) {
            const output = []
            for (let i = 0, l = value.length; i < l; ++i) {
              if (hasOwnProperty(value, String(i))) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                  String(i), true))
              } else {
                output.push('')
              }
            }
            keys.forEach(function (key) {
              if (!key.match(/^\d+$/)) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                  key, true))
              }
            })
            return output
          }

          function formatProperty (ctx, value, recurseTimes, visibleKeys, key, array) {
            let name, str, desc
            desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }
            if (desc.get) {
              if (desc.set) {
                str = ctx.stylize('[Getter/Setter]', 'special')
              } else {
                str = ctx.stylize('[Getter]', 'special')
              }
            } else {
              if (desc.set) {
                str = ctx.stylize('[Setter]', 'special')
              }
            }
            if (!hasOwnProperty(visibleKeys, key)) {
              name = '[' + key + ']'
            }
            if (!str) {
              if (ctx.seen.indexOf(desc.value) < 0) {
                if (isNull(recurseTimes)) {
                  str = formatValue(ctx, desc.value, null)
                } else {
                  str = formatValue(ctx, desc.value, recurseTimes - 1)
                }
                if (str.indexOf('\n') > -1) {
                  if (array) {
                    str = str.split('\n').map(function (line) {
                      return '  ' + line
                    }).join('\n').substr(2)
                  } else {
                    str = '\n' + str.split('\n').map(function (line) {
                      return '   ' + line
                    }).join('\n')
                  }
                }
              } else {
                str = ctx.stylize('[Circular]', 'special')
              }
            }
            if (isUndefined(name)) {
              if (array && key.match(/^\d+$/)) {
                return str
              }
              name = JSON.stringify('' + key)
              if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.substr(1, name.length - 2)
                name = ctx.stylize(name, 'name')
              } else {
                name = name.replace(/'/g, "\\'")
                  .replace(/\\"/g, '"')
                  .replace(/(^"|"$)/g, "'")
                name = ctx.stylize(name, 'string')
              }
            }

            return name + ': ' + str
          }

          function reduceToSingleString (output, base, braces) {
            let numLinesEst = 0
            const length = output.reduce(function (prev, cur) {
              numLinesEst++
              if (cur.indexOf('\n') >= 0) numLinesEst++
              return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1
            }, 0)

            if (length > 60) {
              return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1]
            }

            return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1]
          }

          // NOTE: These type checking functions intentionally don't use `instanceof`
          // because it is fragile and can be easily faked with `Object.create()`.
          function isArray (ar) {
            return Array.isArray(ar)
          }
          exports.isArray = isArray

          function isBoolean (arg) {
            return typeof arg === 'boolean'
          }
          exports.isBoolean = isBoolean

          function isNull (arg) {
            return arg === null
          }
          exports.isNull = isNull

          function isNullOrUndefined (arg) {
            return arg == null
          }
          exports.isNullOrUndefined = isNullOrUndefined

          function isNumber (arg) {
            return typeof arg === 'number'
          }
          exports.isNumber = isNumber

          function isString (arg) {
            return typeof arg === 'string'
          }
          exports.isString = isString

          function isSymbol (arg) {
            return typeof arg === 'symbol'
          }
          exports.isSymbol = isSymbol

          function isUndefined (arg) {
            return arg === void 0
          }
          exports.isUndefined = isUndefined

          function isRegExp (re) {
            return isObject(re) && objectToString(re) === '[object RegExp]'
          }
          exports.isRegExp = isRegExp

          function isObject (arg) {
            return typeof arg === 'object' && arg !== null
          }
          exports.isObject = isObject

          function isDate (d) {
            return isObject(d) && objectToString(d) === '[object Date]'
          }
          exports.isDate = isDate

          function isError (e) {
            return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error)
          }
          exports.isError = isError

          function isFunction (arg) {
            return typeof arg === 'function'
          }
          exports.isFunction = isFunction

          function isPrimitive (arg) {
            return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' || // ES6 symbol
         typeof arg === 'undefined'
          }
          exports.isPrimitive = isPrimitive

          exports.isBuffer = require('./support/isBuffer')

          function objectToString (o) {
            return Object.prototype.toString.call(o)
          }

          function pad (n) {
            return n < 10 ? '0' + n.toString(10) : n.toString(10)
          }

          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec']

          // 26 Feb 16:19:34
          function timestamp () {
            const d = new Date()
            const time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':')
            return [d.getDate(), months[d.getMonth()], time].join(' ')
          }

          // log is just a thin wrapper to console.log that prepends a timestamp
          exports.log = function () {
            console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments))
          }

          /**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
          exports.inherits = require('inherits')

          exports._extend = function (origin, add) {
            // Don't do anything if add isn't an object
            if (!add || !isObject(add)) return origin

            const keys = Object.keys(add)
            let i = keys.length
            while (i--) {
              origin[keys[i]] = add[keys[i]]
            }
            return origin
          }

          function hasOwnProperty (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop)
          }
        }).call(this)
      }).call(this, require('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, { './support/isBuffer': 76, _process: 56, inherits: 33 }],
    78: [function (require, module, exports) {
      arguments[4][76][0].apply(exports, arguments)
    }, { dup: 76 }],
    79: [function (require, module, exports) {
    // Currently in sync with Node.js lib/internal/util/types.js
    // https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

      'use strict'

      const isArgumentsObject = require('is-arguments')
      const isGeneratorFunction = require('is-generator-function')
      const whichTypedArray = require('which-typed-array')
      const isTypedArray = require('is-typed-array')

      function uncurryThis (f) {
        return f.call.bind(f)
      }

      const BigIntSupported = typeof BigInt !== 'undefined'
      const SymbolSupported = typeof Symbol !== 'undefined'

      const ObjectToString = uncurryThis(Object.prototype.toString)

      const numberValue = uncurryThis(Number.prototype.valueOf)
      const stringValue = uncurryThis(String.prototype.valueOf)
      const booleanValue = uncurryThis(Boolean.prototype.valueOf)

      if (BigIntSupported) {
        var bigIntValue = uncurryThis(BigInt.prototype.valueOf)
      }

      if (SymbolSupported) {
        var symbolValue = uncurryThis(Symbol.prototype.valueOf)
      }

      function checkBoxedPrimitive (value, prototypeValueOf) {
        if (typeof value !== 'object') {
          return false
        }
        try {
          prototypeValueOf(value)
          return true
        } catch (e) {
          return false
        }
      }

      exports.isArgumentsObject = isArgumentsObject
      exports.isGeneratorFunction = isGeneratorFunction
      exports.isTypedArray = isTypedArray

      // Taken from here and modified for better browser support
      // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
      function isPromise (input) {
        return (
          (
            typeof Promise !== 'undefined' &&
			input instanceof Promise
          ) ||
		(
		  input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
        )
      }
      exports.isPromise = isPromise

      function isArrayBufferView (value) {
        if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value)
        }

        return (
          isTypedArray(value) ||
    isDataView(value)
        )
      }
      exports.isArrayBufferView = isArrayBufferView

      function isUint8Array (value) {
        return whichTypedArray(value) === 'Uint8Array'
      }
      exports.isUint8Array = isUint8Array

      function isUint8ClampedArray (value) {
        return whichTypedArray(value) === 'Uint8ClampedArray'
      }
      exports.isUint8ClampedArray = isUint8ClampedArray

      function isUint16Array (value) {
        return whichTypedArray(value) === 'Uint16Array'
      }
      exports.isUint16Array = isUint16Array

      function isUint32Array (value) {
        return whichTypedArray(value) === 'Uint32Array'
      }
      exports.isUint32Array = isUint32Array

      function isInt8Array (value) {
        return whichTypedArray(value) === 'Int8Array'
      }
      exports.isInt8Array = isInt8Array

      function isInt16Array (value) {
        return whichTypedArray(value) === 'Int16Array'
      }
      exports.isInt16Array = isInt16Array

      function isInt32Array (value) {
        return whichTypedArray(value) === 'Int32Array'
      }
      exports.isInt32Array = isInt32Array

      function isFloat32Array (value) {
        return whichTypedArray(value) === 'Float32Array'
      }
      exports.isFloat32Array = isFloat32Array

      function isFloat64Array (value) {
        return whichTypedArray(value) === 'Float64Array'
      }
      exports.isFloat64Array = isFloat64Array

      function isBigInt64Array (value) {
        return whichTypedArray(value) === 'BigInt64Array'
      }
      exports.isBigInt64Array = isBigInt64Array

      function isBigUint64Array (value) {
        return whichTypedArray(value) === 'BigUint64Array'
      }
      exports.isBigUint64Array = isBigUint64Array

      function isMapToString (value) {
        return ObjectToString(value) === '[object Map]'
      }
      isMapToString.working = (
        typeof Map !== 'undefined' &&
  isMapToString(new Map())
      )

      function isMap (value) {
        if (typeof Map === 'undefined') {
          return false
        }

        return isMapToString.working
          ? isMapToString(value)
          : value instanceof Map
      }
      exports.isMap = isMap

      function isSetToString (value) {
        return ObjectToString(value) === '[object Set]'
      }
      isSetToString.working = (
        typeof Set !== 'undefined' &&
  isSetToString(new Set())
      )
      function isSet (value) {
        if (typeof Set === 'undefined') {
          return false
        }

        return isSetToString.working
          ? isSetToString(value)
          : value instanceof Set
      }
      exports.isSet = isSet

      function isWeakMapToString (value) {
        return ObjectToString(value) === '[object WeakMap]'
      }
      isWeakMapToString.working = (
        typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
      )
      function isWeakMap (value) {
        if (typeof WeakMap === 'undefined') {
          return false
        }

        return isWeakMapToString.working
          ? isWeakMapToString(value)
          : value instanceof WeakMap
      }
      exports.isWeakMap = isWeakMap

      function isWeakSetToString (value) {
        return ObjectToString(value) === '[object WeakSet]'
      }
      isWeakSetToString.working = (
        typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
      )
      function isWeakSet (value) {
        return isWeakSetToString(value)
      }
      exports.isWeakSet = isWeakSet

      function isArrayBufferToString (value) {
        return ObjectToString(value) === '[object ArrayBuffer]'
      }
      isArrayBufferToString.working = (
        typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
      )
      function isArrayBuffer (value) {
        if (typeof ArrayBuffer === 'undefined') {
          return false
        }

        return isArrayBufferToString.working
          ? isArrayBufferToString(value)
          : value instanceof ArrayBuffer
      }
      exports.isArrayBuffer = isArrayBuffer

      function isDataViewToString (value) {
        return ObjectToString(value) === '[object DataView]'
      }
      isDataViewToString.working = (
        typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
      )
      function isDataView (value) {
        if (typeof DataView === 'undefined') {
          return false
        }

        return isDataViewToString.working
          ? isDataViewToString(value)
          : value instanceof DataView
      }
      exports.isDataView = isDataView

      // Store a copy of SharedArrayBuffer in case it's deleted elsewhere
      const SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined
      function isSharedArrayBufferToString (value) {
        return ObjectToString(value) === '[object SharedArrayBuffer]'
      }
      function isSharedArrayBuffer (value) {
        if (typeof SharedArrayBufferCopy === 'undefined') {
          return false
        }

        if (typeof isSharedArrayBufferToString.working === 'undefined') {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy())
        }

        return isSharedArrayBufferToString.working
          ? isSharedArrayBufferToString(value)
          : value instanceof SharedArrayBufferCopy
      }
      exports.isSharedArrayBuffer = isSharedArrayBuffer

      function isAsyncFunction (value) {
        return ObjectToString(value) === '[object AsyncFunction]'
      }
      exports.isAsyncFunction = isAsyncFunction

      function isMapIterator (value) {
        return ObjectToString(value) === '[object Map Iterator]'
      }
      exports.isMapIterator = isMapIterator

      function isSetIterator (value) {
        return ObjectToString(value) === '[object Set Iterator]'
      }
      exports.isSetIterator = isSetIterator

      function isGeneratorObject (value) {
        return ObjectToString(value) === '[object Generator]'
      }
      exports.isGeneratorObject = isGeneratorObject

      function isWebAssemblyCompiledModule (value) {
        return ObjectToString(value) === '[object WebAssembly.Module]'
      }
      exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule

      function isNumberObject (value) {
        return checkBoxedPrimitive(value, numberValue)
      }
      exports.isNumberObject = isNumberObject

      function isStringObject (value) {
        return checkBoxedPrimitive(value, stringValue)
      }
      exports.isStringObject = isStringObject

      function isBooleanObject (value) {
        return checkBoxedPrimitive(value, booleanValue)
      }
      exports.isBooleanObject = isBooleanObject

      function isBigIntObject (value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue)
      }
      exports.isBigIntObject = isBigIntObject

      function isSymbolObject (value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue)
      }
      exports.isSymbolObject = isSymbolObject

      function isBoxedPrimitive (value) {
        return (
          isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
        )
      }
      exports.isBoxedPrimitive = isBoxedPrimitive

      function isAnyArrayBuffer (value) {
        return typeof Uint8Array !== 'undefined' && (
          isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
        )
      }
      exports.isAnyArrayBuffer = isAnyArrayBuffer;

      ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function (method) {
        Object.defineProperty(exports, method, {
          enumerable: false,
          value: function () {
            throw new Error(method + ' is not supported in userland')
          }
        })
      })
    }, { 'is-arguments': 35, 'is-generator-function': 37, 'is-typed-array': 38, 'which-typed-array': 81 }],
    80: [function (require, module, exports) {
      (function (process) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors (obj) {
    const keys = Object.keys(obj)
    const descriptors = {}
    for (let i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i])
    }
    return descriptors
  }

          const formatRegExp = /%[sdj%]/g
          exports.format = function (f) {
            if (!isString(f)) {
              const objects = []
              for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]))
              }
              return objects.join(' ')
            }

            var i = 1
            const args = arguments
            const len = args.length
            let str = String(f).replace(formatRegExp, function (x) {
              if (x === '%%') return '%'
              if (i >= len) return x
              switch (x) {
                case '%s': return String(args[i++])
                case '%d': return Number(args[i++])
                case '%j':
                  try {
                    return JSON.stringify(args[i++])
                  } catch (_) {
                    return '[Circular]'
                  }
                default:
                  return x
              }
            })
            for (let x = args[i]; i < len; x = args[++i]) {
              if (isNull(x) || !isObject(x)) {
                str += ' ' + x
              } else {
                str += ' ' + inspect(x)
              }
            }
            return str
          }

          // Mark that a method should not be used.
          // Returns a modified function which warns once by default.
          // If --no-deprecation is set, then it is a no-op.
          exports.deprecate = function (fn, msg) {
            if (typeof process !== 'undefined' && process.noDeprecation === true) {
              return fn
            }

            // Allow for deprecating things in the process of starting up.
            if (typeof process === 'undefined') {
              return function () {
                return exports.deprecate(fn, msg).apply(this, arguments)
              }
            }

            let warned = false
            function deprecated () {
              if (!warned) {
                if (process.throwDeprecation) {
                  throw new Error(msg)
                } else if (process.traceDeprecation) {
                  console.trace(msg)
                } else {
                  console.error(msg)
                }
                warned = true
              }
              return fn.apply(this, arguments)
            }

            return deprecated
          }

          const debugs = {}
          let debugEnvRegex = /^$/

          if (process.env.NODE_DEBUG) {
            let debugEnv = process.env.NODE_DEBUG
            debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
              .replace(/\*/g, '.*')
              .replace(/,/g, '$|^')
              .toUpperCase()
            debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i')
          }
          exports.debuglog = function (set) {
            set = set.toUpperCase()
            if (!debugs[set]) {
              if (debugEnvRegex.test(set)) {
                const pid = process.pid
                debugs[set] = function () {
                  const msg = exports.format.apply(exports, arguments)
                  console.error('%s %d: %s', set, pid, msg)
                }
              } else {
                debugs[set] = function () {}
              }
            }
            return debugs[set]
          }

          /**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
          /* legacy: obj, showHidden, depth, colors */
          function inspect (obj, opts) {
            // default options
            const ctx = {
              seen: [],
              stylize: stylizeNoColor
            }
            // legacy...
            if (arguments.length >= 3) ctx.depth = arguments[2]
            if (arguments.length >= 4) ctx.colors = arguments[3]
            if (isBoolean(opts)) {
              // legacy...
              ctx.showHidden = opts
            } else if (opts) {
              // got an "options" object
              exports._extend(ctx, opts)
            }
            // set default options
            if (isUndefined(ctx.showHidden)) ctx.showHidden = false
            if (isUndefined(ctx.depth)) ctx.depth = 2
            if (isUndefined(ctx.colors)) ctx.colors = false
            if (isUndefined(ctx.customInspect)) ctx.customInspect = true
            if (ctx.colors) ctx.stylize = stylizeWithColor
            return formatValue(ctx, obj, ctx.depth)
          }
          exports.inspect = inspect

          // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
          inspect.colors = {
            bold: [1, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            white: [37, 39],
            grey: [90, 39],
            black: [30, 39],
            blue: [34, 39],
            cyan: [36, 39],
            green: [32, 39],
            magenta: [35, 39],
            red: [31, 39],
            yellow: [33, 39]
          }

          // Don't use 'blue' not visible on cmd.exe
          inspect.styles = {
            special: 'cyan',
            number: 'yellow',
            boolean: 'yellow',
            undefined: 'grey',
            null: 'bold',
            string: 'green',
            date: 'magenta',
            // "name": intentionally not styling
            regexp: 'red'
          }

          function stylizeWithColor (str, styleType) {
            const style = inspect.styles[styleType]

            if (style) {
              return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm'
            } else {
              return str
            }
          }

          function stylizeNoColor (str, styleType) {
            return str
          }

          function arrayToHash (array) {
            const hash = {}

            array.forEach(function (val, idx) {
              hash[val] = true
            })

            return hash
          }

          function formatValue (ctx, value, recurseTimes) {
            // Provide a hook for user-specified inspect functions.
            // Check that value is an object with an inspect function on it
            if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
              let ret = value.inspect(recurseTimes, ctx)
              if (!isString(ret)) {
                ret = formatValue(ctx, ret, recurseTimes)
              }
              return ret
            }

            // Primitive types cannot have properties
            const primitive = formatPrimitive(ctx, value)
            if (primitive) {
              return primitive
            }

            // Look up the keys of the object.
            let keys = Object.keys(value)
            const visibleKeys = arrayToHash(keys)

            if (ctx.showHidden) {
              keys = Object.getOwnPropertyNames(value)
            }

            // IE doesn't make error fields non-enumerable
            // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
            if (isError(value) &&
      (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
              return formatError(value)
            }

            // Some type of object without properties can be shortcutted.
            if (keys.length === 0) {
              if (isFunction(value)) {
                const name = value.name ? ': ' + value.name : ''
                return ctx.stylize('[Function' + name + ']', 'special')
              }
              if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
              }
              if (isDate(value)) {
                return ctx.stylize(Date.prototype.toString.call(value), 'date')
              }
              if (isError(value)) {
                return formatError(value)
              }
            }

            let base = ''; let array = false; let braces = ['{', '}']

            // Make Array say that they are Array
            if (isArray(value)) {
              array = true
              braces = ['[', ']']
            }

            // Make functions say that they are functions
            if (isFunction(value)) {
              const n = value.name ? ': ' + value.name : ''
              base = ' [Function' + n + ']'
            }

            // Make RegExps say that they are RegExps
            if (isRegExp(value)) {
              base = ' ' + RegExp.prototype.toString.call(value)
            }

            // Make dates with properties first say the date
            if (isDate(value)) {
              base = ' ' + Date.prototype.toUTCString.call(value)
            }

            // Make error with message first say the error
            if (isError(value)) {
              base = ' ' + formatError(value)
            }

            if (keys.length === 0 && (!array || value.length == 0)) {
              return braces[0] + base + braces[1]
            }

            if (recurseTimes < 0) {
              if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
              } else {
                return ctx.stylize('[Object]', 'special')
              }
            }

            ctx.seen.push(value)

            let output
            if (array) {
              output = formatArray(ctx, value, recurseTimes, visibleKeys, keys)
            } else {
              output = keys.map(function (key) {
                return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array)
              })
            }

            ctx.seen.pop()

            return reduceToSingleString(output, base, braces)
          }

          function formatPrimitive (ctx, value) {
            if (isUndefined(value)) { return ctx.stylize('undefined', 'undefined') }
            if (isString(value)) {
              const simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                .replace(/'/g, "\\'")
                .replace(/\\"/g, '"') + '\''
              return ctx.stylize(simple, 'string')
            }
            if (isNumber(value)) { return ctx.stylize('' + value, 'number') }
            if (isBoolean(value)) { return ctx.stylize('' + value, 'boolean') }
            // For some reason typeof null is "object", so special case here.
            if (isNull(value)) { return ctx.stylize('null', 'null') }
          }

          function formatError (value) {
            return '[' + Error.prototype.toString.call(value) + ']'
          }

          function formatArray (ctx, value, recurseTimes, visibleKeys, keys) {
            const output = []
            for (let i = 0, l = value.length; i < l; ++i) {
              if (hasOwnProperty(value, String(i))) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                  String(i), true))
              } else {
                output.push('')
              }
            }
            keys.forEach(function (key) {
              if (!key.match(/^\d+$/)) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                  key, true))
              }
            })
            return output
          }

          function formatProperty (ctx, value, recurseTimes, visibleKeys, key, array) {
            let name, str, desc
            desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] }
            if (desc.get) {
              if (desc.set) {
                str = ctx.stylize('[Getter/Setter]', 'special')
              } else {
                str = ctx.stylize('[Getter]', 'special')
              }
            } else {
              if (desc.set) {
                str = ctx.stylize('[Setter]', 'special')
              }
            }
            if (!hasOwnProperty(visibleKeys, key)) {
              name = '[' + key + ']'
            }
            if (!str) {
              if (ctx.seen.indexOf(desc.value) < 0) {
                if (isNull(recurseTimes)) {
                  str = formatValue(ctx, desc.value, null)
                } else {
                  str = formatValue(ctx, desc.value, recurseTimes - 1)
                }
                if (str.indexOf('\n') > -1) {
                  if (array) {
                    str = str.split('\n').map(function (line) {
                      return '  ' + line
                    }).join('\n').slice(2)
                  } else {
                    str = '\n' + str.split('\n').map(function (line) {
                      return '   ' + line
                    }).join('\n')
                  }
                }
              } else {
                str = ctx.stylize('[Circular]', 'special')
              }
            }
            if (isUndefined(name)) {
              if (array && key.match(/^\d+$/)) {
                return str
              }
              name = JSON.stringify('' + key)
              if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.slice(1, -1)
                name = ctx.stylize(name, 'name')
              } else {
                name = name.replace(/'/g, "\\'")
                  .replace(/\\"/g, '"')
                  .replace(/(^"|"$)/g, "'")
                name = ctx.stylize(name, 'string')
              }
            }

            return name + ': ' + str
          }

          function reduceToSingleString (output, base, braces) {
            let numLinesEst = 0
            const length = output.reduce(function (prev, cur) {
              numLinesEst++
              if (cur.indexOf('\n') >= 0) numLinesEst++
              return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1
            }, 0)

            if (length > 60) {
              return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1]
            }

            return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1]
          }

          // NOTE: These type checking functions intentionally don't use `instanceof`
          // because it is fragile and can be easily faked with `Object.create()`.
          exports.types = require('./support/types')

          function isArray (ar) {
            return Array.isArray(ar)
          }
          exports.isArray = isArray

          function isBoolean (arg) {
            return typeof arg === 'boolean'
          }
          exports.isBoolean = isBoolean

          function isNull (arg) {
            return arg === null
          }
          exports.isNull = isNull

          function isNullOrUndefined (arg) {
            return arg == null
          }
          exports.isNullOrUndefined = isNullOrUndefined

          function isNumber (arg) {
            return typeof arg === 'number'
          }
          exports.isNumber = isNumber

          function isString (arg) {
            return typeof arg === 'string'
          }
          exports.isString = isString

          function isSymbol (arg) {
            return typeof arg === 'symbol'
          }
          exports.isSymbol = isSymbol

          function isUndefined (arg) {
            return arg === void 0
          }
          exports.isUndefined = isUndefined

          function isRegExp (re) {
            return isObject(re) && objectToString(re) === '[object RegExp]'
          }
          exports.isRegExp = isRegExp
          exports.types.isRegExp = isRegExp

          function isObject (arg) {
            return typeof arg === 'object' && arg !== null
          }
          exports.isObject = isObject

          function isDate (d) {
            return isObject(d) && objectToString(d) === '[object Date]'
          }
          exports.isDate = isDate
          exports.types.isDate = isDate

          function isError (e) {
            return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error)
          }
          exports.isError = isError
          exports.types.isNativeError = isError

          function isFunction (arg) {
            return typeof arg === 'function'
          }
          exports.isFunction = isFunction

          function isPrimitive (arg) {
            return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' || // ES6 symbol
         typeof arg === 'undefined'
          }
          exports.isPrimitive = isPrimitive

          exports.isBuffer = require('./support/isBuffer')

          function objectToString (o) {
            return Object.prototype.toString.call(o)
          }

          function pad (n) {
            return n < 10 ? '0' + n.toString(10) : n.toString(10)
          }

          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec']

          // 26 Feb 16:19:34
          function timestamp () {
            const d = new Date()
            const time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':')
            return [d.getDate(), months[d.getMonth()], time].join(' ')
          }

          // log is just a thin wrapper to console.log that prepends a timestamp
          exports.log = function () {
            console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments))
          }

          /**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
          exports.inherits = require('inherits')

          exports._extend = function (origin, add) {
            // Don't do anything if add isn't an object
            if (!add || !isObject(add)) return origin

            const keys = Object.keys(add)
            let i = keys.length
            while (i--) {
              origin[keys[i]] = add[keys[i]]
            }
            return origin
          }

          function hasOwnProperty (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop)
          }

          const kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined

          exports.promisify = function promisify (original) {
            if (typeof original !== 'function') { throw new TypeError('The "original" argument must be of type Function') }

            if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
              var fn = original[kCustomPromisifiedSymbol]
              if (typeof fn !== 'function') {
                throw new TypeError('The "util.promisify.custom" argument must be of type Function')
              }
              Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                value: fn, enumerable: false, writable: false, configurable: true
              })
              return fn
            }

            function fn () {
              let promiseResolve, promiseReject
              const promise = new Promise(function (resolve, reject) {
                promiseResolve = resolve
                promiseReject = reject
              })

              const args = []
              for (let i = 0; i < arguments.length; i++) {
                args.push(arguments[i])
              }
              args.push(function (err, value) {
                if (err) {
                  promiseReject(err)
                } else {
                  promiseResolve(value)
                }
              })

              try {
                original.apply(this, args)
              } catch (err) {
                promiseReject(err)
              }

              return promise
            }

            Object.setPrototypeOf(fn, Object.getPrototypeOf(original))

            if (kCustomPromisifiedSymbol) {
              Object.defineProperty(fn, kCustomPromisifiedSymbol, {
                value: fn, enumerable: false, writable: false, configurable: true
              })
            }
            return Object.defineProperties(
              fn,
              getOwnPropertyDescriptors(original)
            )
          }

          exports.promisify.custom = kCustomPromisifiedSymbol

          function callbackifyOnRejected (reason, cb) {
            // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
            // Because `null` is a special error value in callbacks which means "no error
            // occurred", we error-wrap so the callback consumer can distinguish between
            // "the promise rejected with null" or "the promise fulfilled with undefined".
            if (!reason) {
              const newReason = new Error('Promise was rejected with a falsy value')
              newReason.reason = reason
              reason = newReason
            }
            return cb(reason)
          }

          function callbackify (original) {
            if (typeof original !== 'function') {
              throw new TypeError('The "original" argument must be of type Function')
            }

            // We DO NOT return the promise as it gives the user a false sense that
            // the promise is actually somehow related to the callback's execution
            // and that the callback throwing will reject the promise.
            function callbackified () {
              const args = []
              for (let i = 0; i < arguments.length; i++) {
                args.push(arguments[i])
              }

              const maybeCb = args.pop()
              if (typeof maybeCb !== 'function') {
                throw new TypeError('The last argument must be of type Function')
              }
              const self = this
              const cb = function () {
                return maybeCb.apply(self, arguments)
              }
              // In true node style we process the callback on `nextTick` with all the
              // implications (stack, `uncaughtException`, `async_hooks`)
              original.apply(this, args)
                .then(function (ret) { process.nextTick(cb.bind(null, null, ret)) },
                  function (rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) })
            }

            Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original))
            Object.defineProperties(callbackified,
              getOwnPropertyDescriptors(original))
            return callbackified
          }
          exports.callbackify = callbackify
        }).call(this)
      }).call(this, require('_process'))
    }, { './support/isBuffer': 78, './support/types': 79, _process: 56, inherits: 34 }],
    81: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict'

          const forEach = require('for-each')
          const availableTypedArrays = require('available-typed-arrays')
          const callBind = require('call-bind')
          const callBound = require('call-bind/callBound')
          const gOPD = require('gopd')

          const $toString = callBound('Object.prototype.toString')
          const hasToStringTag = require('has-tostringtag/shams')()

          const g = typeof globalThis === 'undefined' ? global : globalThis
          const typedArrays = availableTypedArrays()

          const $slice = callBound('String.prototype.slice')
          const getPrototypeOf = Object.getPrototypeOf // require('getprototypeof');

          const $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf (array, value) {
            for (let i = 0; i < array.length; i += 1) {
              if (array[i] === value) {
                return i
              }
            }
            return -1
          }
          const cache = { __proto__: null }
          if (hasToStringTag && gOPD && getPrototypeOf) {
            forEach(typedArrays, function (typedArray) {
              const arr = new g[typedArray]()
              if (Symbol.toStringTag in arr) {
                const proto = getPrototypeOf(arr)
                let descriptor = gOPD(proto, Symbol.toStringTag)
                if (!descriptor) {
                  const superProto = getPrototypeOf(proto)
                  descriptor = gOPD(superProto, Symbol.toStringTag)
                }
                cache['$' + typedArray] = callBind(descriptor.get)
              }
            })
          } else {
            forEach(typedArrays, function (typedArray) {
              const arr = new g[typedArray]()
              const fn = arr.slice || arr.set
              if (fn) {
                cache['$' + typedArray] = callBind(fn)
              }
            })
          }

          const tryTypedArrays = function tryAllTypedArrays (value) {
            let found = false
            forEach(cache, function (getter, typedArray) {
              if (!found) {
                try {
                  if ('$' + getter(value) === typedArray) {
                    found = $slice(typedArray, 1)
                  }
                } catch (e) { /**/ }
              }
            })
            return found
          }

          const trySlices = function tryAllSlices (value) {
            let found = false
            forEach(cache, function (getter, name) {
              if (!found) {
                try {
                  getter(value)
                  found = $slice(name, 1)
                } catch (e) { /**/ }
              }
            })
            return found
          }

          module.exports = function whichTypedArray (value) {
            if (!value || typeof value !== 'object') { return false }
            if (!hasToStringTag) {
              const tag = $slice($toString(value), 8, -1)
              if ($indexOf(typedArrays, tag) > -1) {
                return tag
              }
              if (tag !== 'Object') {
                return false
              }
              // node < 0.6 hits here on real Typed Arrays
              return trySlices(value)
            }
            if (!gOPD) { return null } // unknown engine
            return tryTypedArrays(value)
          }
        }).call(this)
      }).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})
    }, { 'available-typed-arrays': 2, 'call-bind': 18, 'call-bind/callBound': 17, 'for-each': 21, gopd: 25, 'has-tostringtag/shams': 30 }],
    82: [function (require, module, exports) {
    /* jshint browser: true, node: true */

      'use strict'

      /**
 * Main browserify entry point.
 *
 * This version of the entry point adds a couple browser-specific utilities to
 * read and write blobs.
 */

      const avroServices = require('./avsc-services')
      const containers = require('../../lib/containers')
      const utils = require('../../lib/utils')
      const stream = require('stream')
      const util = require('util')

      /** Transform stream which lazily reads a blob's contents. */
      function BlobReader (blob, opts) {
        stream.Readable.call(this)
        opts = opts || {}

        this._batchSize = opts.batchSize || 65536
        this._blob = blob
        this._pos = 0
      }
      util.inherits(BlobReader, stream.Readable)

      BlobReader.prototype._read = function () {
        const pos = this._pos
        if (pos >= this._blob.size) {
          this.push(null)
          return
        }

        this._pos += this._batchSize
        const blob = this._blob.slice(pos, this._pos, this._blob.type)
        const reader = new FileReader()
        const self = this
        reader.addEventListener('loadend', function cb (evt) {
          reader.removeEventListener('loadend', cb, false)
          if (evt.error) {
            self.emit('error', evt.error)
          } else {
            self.push(utils.bufferFrom(reader.result))
          }
        }, false)
        reader.readAsArrayBuffer(blob)
      }

      /** Transform stream which builds a blob from all data written to it. */
      function BlobWriter () {
        stream.Transform.call(this, { readableObjectMode: true })
        this._bufs = []
      }
      util.inherits(BlobWriter, stream.Transform)

      BlobWriter.prototype._transform = function (buf, encoding, cb) {
        this._bufs.push(buf)
        cb()
      }

      BlobWriter.prototype._flush = function (cb) {
        this.push(new Blob(this._bufs, { type: 'application/octet-binary' }))
        cb()
      }

      /** Read an Avro-container stored as a blob. */
      function createBlobDecoder (blob, opts) {
        return new BlobReader(blob).pipe(new containers.streams.BlockDecoder(opts))
      }

      /**
 * Store Avro values into an Avro-container blob.
 *
 * The returned stream will emit a single value, the blob, when ended.
 */
      function createBlobEncoder (schema, opts) {
        const encoder = new containers.streams.BlockEncoder(schema, opts)
        const builder = new BlobWriter()
        encoder.pipe(builder)
        return new stream.Duplex({
          objectMode: true,
          read: function () {
          // Not the fastest implementation, but it will only be called at most
          // once (since the builder only ever emits a single value) so it'll do.
          // It's also likely impractical to create very large blobs.
            const val = builder.read()
            if (val) {
              done(val)
            } else {
              builder.once('readable', done)
            }
            const self = this
            function done (val) {
              self.push(val || builder.read())
              self.push(null)
            }
          },
          write: function (val, encoding, cb) {
            return encoder.write(val, encoding, cb)
          }
        }).on('finish', function () { encoder.end() })
      }

      module.exports = {
        createBlobDecoder,
        createBlobEncoder,
        streams: containers.streams
      }

      utils.copyOwnProperties(avroServices, module.exports)
    }, { '../../lib/containers': 7, '../../lib/utils': 11, './avsc-services': 3, stream: 73, util: 80 }]
  }, {}, [82])(82)
})
