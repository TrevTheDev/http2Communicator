(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", {value: module, enumerable: true})), module);
  };

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS((exports) => {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1)
        validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS((exports) => {
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS((exports) => {
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = {foo: function() {
          return 42;
        }};
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this))
          return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this))
          return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError('The "string" argument must be of type string. Received type number');
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError('The "value" argument must not be of type number. Received type number');
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b)
        return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array))
        a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array))
        b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      }
      if (a === b)
        return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf))
              buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(buffer, buf, pos);
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string);
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0)
        return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding)
        encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max)
        str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target);
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target)
        return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0)
        byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir)
          return -1;
        else
          byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1)
              foundIndex = i;
            if (i - foundIndex + 1 === valLength)
              return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1)
              i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found)
            return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed))
          return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0)
        start = 0;
      if (!end || end < 0 || end > len)
        end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer3.isBuffer(target))
        throw new TypeError("argument should be a Buffer");
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("Index out of range");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
      if (name) {
        return `${name} is outside of buffer bounds`;
      }
      return "Attempt to access memory outside buffer bounds";
    }, RangeError);
    E("ERR_INVALID_ARG_TYPE", function(name, actual) {
      return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
    }, TypeError);
    E("ERR_OUT_OF_RANGE", function(str, range, input) {
      let msg = `The value of "${str}" is out of range.`;
      let received = input;
      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === "bigint") {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
          received = addNumericalSeparator(received);
        }
        received += "n";
      }
      msg += ` It must be ${range}. Received ${received}`;
      return msg;
    }, RangeError);
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2)
        return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0)
            break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0)
            break;
          bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0)
            break;
          bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0)
            break;
          bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0)
          break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length)
          break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  });

  // node_modules/global/window.js
  var require_window = __commonJS((exports, module) => {
    var win;
    if (typeof window !== "undefined") {
      win = window;
    } else if (typeof import_global.default !== "undefined") {
      win = import_global.default;
    } else if (typeof self !== "undefined") {
      win = self;
    } else {
      win = {};
    }
    module.exports = win;
  });

  // node_modules/process/browser.js
  var require_browser = __commonJS((exports, module) => {
    var process2 = module.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        if (typeof setTimeout === "function") {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === "function") {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
      }
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e2) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
      }
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e2) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }
    function drainQueue() {
      if (draining) {
        return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }
    process2.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process2.title = "browser";
    process2.browser = true;
    process2.env = {};
    process2.argv = [];
    process2.version = "";
    process2.versions = {};
    function noop() {
    }
    process2.on = noop;
    process2.addListener = noop;
    process2.once = noop;
    process2.off = noop;
    process2.removeListener = noop;
    process2.removeAllListeners = noop;
    process2.emit = noop;
    process2.prependListener = noop;
    process2.prependOnceListener = noop;
    process2.listeners = function(name) {
      return [];
    };
    process2.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process2.cwd = function() {
      return "/";
    };
    process2.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process2.umask = function() {
      return 0;
    };
  });

  // node_modules/events/events.js
  var require_events = __commonJS((exports, module) => {
    "use strict";
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn)
        console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++)
        args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit("newListener", type, listener.listener ? listener.listener : listener);
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = {fired: false, wrapFn: void 0, target, type, listener};
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener")
            continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function eventListener() {
          if (errorListener !== void 0) {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        var errorListener;
        if (name !== "error") {
          errorListener = function errorListener2(err) {
            emitter.removeListener(name, eventListener);
            reject(err);
          };
          emitter.once("error", errorListener);
        }
        emitter.once(name, eventListener);
      });
    }
  });

  // node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS((exports, module) => {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  });

  // node_modules/readable-stream/lib/internal/streams/stream-browser.js
  var require_stream_browser = __commonJS((exports, module) => {
    module.exports = require_events().EventEmitter;
  });

  // (disabled):node_modules/util/util.js
  var require_util = __commonJS(() => {
  });

  // node_modules/readable-stream/lib/internal/streams/buffer_list.js
  var require_buffer_list = __commonJS((exports, module) => {
    "use strict";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    var _require = require_buffer();
    var Buffer3 = _require.Buffer;
    var _require2 = require_util();
    var inspect = _require2.inspect;
    var custom = inspect && inspect.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer3.prototype.copy.call(src, target, offset);
    }
    module.exports = /* @__PURE__ */ function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0)
            this.tail.next = entry;
          else
            this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0)
            this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0)
            return;
          var ret = this.head.data;
          if (this.length === 1)
            this.head = this.tail = null;
          else
            this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join(s) {
          if (this.length === 0)
            return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next) {
            ret += s + p.data;
          }
          return ret;
        }
      }, {
        key: "concat",
        value: function concat(n) {
          if (this.length === 0)
            return Buffer3.alloc(0);
          var ret = Buffer3.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str = p.data;
            var nb = n > str.length ? str.length : n;
            if (nb === str.length)
              ret += str;
            else
              ret += str.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer3.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
      }, {
        key: custom,
        value: function value(_, options) {
          return inspect(this, _objectSpread({}, options, {
            depth: 0,
            customInspect: false
          }));
        }
      }]);
      return BufferList;
    }();
  });

  // node_modules/readable-stream/lib/internal/streams/destroy.js
  var require_destroy = __commonJS((exports, module) => {
    "use strict";
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            import_process.default.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            import_process.default.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            import_process.default.nextTick(emitErrorAndCloseNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            import_process.default.nextTick(emitErrorAndCloseNT, _this, err2);
          } else {
            import_process.default.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          import_process.default.nextTick(emitCloseNT, _this);
          cb(err2);
        } else {
          import_process.default.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose)
        return;
      if (self2._readableState && !self2._readableState.emitClose)
        return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    function errorOrDestroy(stream, err) {
      var rState = stream._readableState;
      var wState = stream._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy)
        stream.destroy(err);
      else
        stream.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  });

  // node_modules/readable-stream/errors-browser.js
  var require_errors_browser = __commonJS((exports, module) => {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      var NodeError = /* @__PURE__ */ function(_Base) {
        _inheritsLoose(NodeError2, _Base);
        function NodeError2(arg1, arg2, arg3) {
          return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
        }
        return NodeError2;
      }(Base);
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        var len = expected.length;
        expected = expected.map(function(i) {
          return String(i);
        });
        if (len > 2) {
          return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
        } else if (len === 2) {
          return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
        } else {
          return "of ".concat(thing, " ").concat(expected[0]);
        }
      } else {
        return "of ".concat(thing, " ").concat(String(expected));
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      var determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      var msg;
      if (endsWith(name, " argument")) {
        msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      } else {
        var type = includes(name, ".") ? "property" : "argument";
        msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      }
      msg += ". Received type ".concat(typeof actual);
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
      return "The " + name + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name) {
      return "Cannot call " + name + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
      return "Unknown encoding: " + arg;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module.exports.codes = codes;
  });

  // node_modules/readable-stream/lib/internal/streams/state.js
  var require_state = __commonJS((exports, module) => {
    "use strict";
    var ERR_INVALID_OPT_VALUE = require_errors_browser().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module.exports = {
      getHighWaterMark
    };
  });

  // node_modules/util-deprecate/browser.js
  var require_browser2 = __commonJS((exports, module) => {
    module.exports = deprecate;
    function deprecate(fn, msg) {
      if (config2("noDeprecation")) {
        return fn;
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (config2("throwDeprecation")) {
            throw new Error(msg);
          } else if (config2("traceDeprecation")) {
            console.trace(msg);
          } else {
            console.warn(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    }
    function config2(name) {
      try {
        if (!import_global.default.localStorage)
          return false;
      } catch (_) {
        return false;
      }
      var val = import_global.default.localStorage[name];
      if (val == null)
        return false;
      return String(val).toLowerCase() === "true";
    }
  });

  // node_modules/readable-stream/lib/_stream_writable.js
  var require_stream_writable = __commonJS((exports, module) => {
    "use strict";
    module.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex2;
    Writable.WritableState = WritableState;
    var internalUtil = {
      deprecate: require_browser2()
    };
    var Stream2 = require_stream_browser();
    var Buffer3 = require_buffer().Buffer;
    var OurUint8Array = import_global.default.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer3.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer3.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors_browser().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits_browser()(Writable, Stream2);
    function nop() {
    }
    function WritableState(options, stream, isDuplex) {
      Duplex2 = Duplex2 || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex2;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function value(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable)
            return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex2 = Duplex2 || require_stream_duplex();
      var isDuplex = this instanceof Duplex2;
      if (!isDuplex && !realHasInstance.call(Writable, this))
        return new Writable(options);
      this._writableState = new WritableState(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream2.call(this);
    }
    Writable.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd(stream, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream, er);
      import_process.default.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream, er);
        import_process.default.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer3.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ending)
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableBuffer", {
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer3.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed)
        state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        import_process.default.nextTick(cb, er);
        import_process.default.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function")
        throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state) || stream.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          import_process.default.nextTick(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending)
        endWritable(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableLength", {
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          errorOrDestroy(stream, err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          import_process.default.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
          if (state.autoDestroy) {
            var rState = stream._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          import_process.default.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      cb(err);
    };
  });

  // node_modules/readable-stream/lib/_stream_duplex.js
  var require_stream_duplex = __commonJS((exports, module) => {
    "use strict";
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj) {
        keys2.push(key);
      }
      return keys2;
    };
    module.exports = Duplex2;
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    require_inherits_browser()(Duplex2, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex2.prototype[method])
          Duplex2.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex2(options) {
      if (!(this instanceof Duplex2))
        return new Duplex2(options);
      Readable.call(this, options);
      Writable.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false)
          this.readable = false;
        if (options.writable === false)
          this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend);
        }
      }
    }
    Object.defineProperty(Duplex2.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex2.prototype, "writableBuffer", {
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex2.prototype, "writableLength", {
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend() {
      if (this._writableState.ended)
        return;
      import_process.default.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex2.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
  });

  // node_modules/safe-buffer/index.js
  var require_safe_buffer = __commonJS((exports, module) => {
    /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
    var buffer = require_buffer();
    var Buffer3 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer3.from && Buffer3.alloc && Buffer3.allocUnsafe && Buffer3.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer3(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer3.prototype);
    copyProps(Buffer3, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer3(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer3(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer3(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  });

  // node_modules/string_decoder/lib/string_decoder.js
  var require_string_decoder = __commonJS((exports) => {
    "use strict";
    var Buffer3 = require_safe_buffer().Buffer;
    var isEncoding = Buffer3.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer3.isEncoding === isEncoding || !isEncoding(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer3.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed)
        return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0)
        return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  });

  // node_modules/readable-stream/lib/internal/streams/end-of-stream.js
  var require_end_of_stream = __commonJS((exports, module) => {
    "use strict";
    var ERR_STREAM_PREMATURE_CLOSE = require_errors_browser().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop() {
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function eos(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once(callback || noop);
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream.writable)
          onfinish();
      };
      var writableEnded = stream._writableState && stream._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable)
          callback.call(stream);
      };
      var readableEnded = stream._readableState && stream._readableState.endEmitted;
      var onend = function onend2() {
        readable = false;
        readableEnded = true;
        if (!writable)
          callback.call(stream);
      };
      var onerror = function onerror2(err) {
        callback.call(stream, err);
      };
      var onclose = function onclose2() {
        var err;
        if (readable && !readableEnded) {
          if (!stream._readableState || !stream._readableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
        if (writable && !writableEnded) {
          if (!stream._writableState || !stream._writableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
      };
      var onrequest = function onrequest2() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !stream._writableState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    }
    module.exports = eos;
  });

  // node_modules/readable-stream/lib/internal/streams/async_iterator.js
  var require_async_iterator = __commonJS((exports, module) => {
    "use strict";
    var _Object$setPrototypeO;
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {value, enumerable: true, configurable: true, writable: true});
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var finished = require_end_of_stream();
    var kLastResolve = Symbol("lastResolve");
    var kLastReject = Symbol("lastReject");
    var kError = Symbol("error");
    var kEnded = Symbol("ended");
    var kLastPromise = Symbol("lastPromise");
    var kHandlePromise = Symbol("handlePromise");
    var kStream = Symbol("stream");
    function createIterResult(value, done) {
      return {
        value,
        done
      };
    }
    function readAndResolve(iter) {
      var resolve = iter[kLastResolve];
      if (resolve !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      import_process.default.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve, reject) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve, reject);
        }, reject);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve, reject) {
            import_process.default.nextTick(function() {
              if (_this[kError]) {
                reject(_this[kError]);
              } else {
                resolve(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve, reject) {
        _this2[kStream].destroy(null, function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
      var _Object$create;
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
        value: function value(resolve, reject) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve;
            iterator[kLastReject] = reject;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream, function(err) {
        if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject = iterator[kLastReject];
          if (reject !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject(err);
          }
          iterator[kError] = err;
          return;
        }
        var resolve = iterator[kLastResolve];
        if (resolve !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module.exports = createReadableStreamAsyncIterator;
  });

  // node_modules/readable-stream/lib/internal/streams/from-browser.js
  var require_from_browser = __commonJS((exports, module) => {
    module.exports = function() {
      throw new Error("Readable.from is not available in the browser");
    };
  });

  // node_modules/readable-stream/lib/_stream_readable.js
  var require_stream_readable = __commonJS((exports, module) => {
    "use strict";
    module.exports = Readable;
    var Duplex2;
    Readable.ReadableState = ReadableState;
    var EE = require_events().EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream2 = require_stream_browser();
    var Buffer3 = require_buffer().Buffer;
    var OurUint8Array = import_global.default.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer3.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer3.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var debugUtil = require_util();
    var debug;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function debug2() {
      };
    }
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors_browser().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder;
    var createReadableStreamAsyncIterator;
    var from;
    require_inherits_browser()(Readable, Stream2);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream, isDuplex) {
      Duplex2 = Duplex2 || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex2;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex2 = Duplex2 || require_stream_duplex();
      if (!(this instanceof Readable))
        return new Readable(options);
      var isDuplex = this instanceof Duplex2;
      this._readableState = new ReadableState(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream2.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer3.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      debug("readableAddChunk", chunk);
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid(state, chunk);
        if (er) {
          errorOrDestroy(stream, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer3.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore(stream, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      var decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "")
        this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      debug("onEofChunk");
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_(stream);
        }
      }
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        import_process.default.nextTick(emitReadable_, stream);
      }
    }
    function emitReadable_(stream) {
      var state = stream._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        import_process.default.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== import_process.default.stdout && dest !== import_process.default.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted)
        import_process.default.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          errorOrDestroy(dest, er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, {
            hasUnpiped: false
          });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream2.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            import_process.default.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.removeListener = function(ev, fn) {
      var res = Stream2.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        import_process.default.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable.prototype.removeAllListeners = function(ev) {
      var res = Stream2.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        import_process.default.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        import_process.default.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
        ;
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable.prototype, "readableBuffer", {
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable.prototype, "readableFlowing", {
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable._fromList = fromList;
    Object.defineProperty(Readable.prototype, "readableLength", {
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList(n, state) {
      if (state.length === 0)
        return null;
      var ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.first();
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        import_process.default.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
        if (state.autoDestroy) {
          var wState = stream._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable.from = function(iterable, opts) {
        if (from === void 0) {
          from = require_from_browser();
        }
        return from(Readable, iterable, opts);
      };
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  });

  // node_modules/readable-stream/lib/_stream_transform.js
  var require_stream_transform = __commonJS((exports, module) => {
    "use strict";
    module.exports = Transform;
    var _require$codes = require_errors_browser().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex2 = require_stream_duplex();
    require_inherits_browser()(Transform, Duplex2);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex2.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex2.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      Duplex2.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
      });
    };
    function done(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream._transformState.transforming)
        throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream.push(null);
    }
  });

  // node_modules/readable-stream/lib/_stream_passthrough.js
  var require_stream_passthrough = __commonJS((exports, module) => {
    "use strict";
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    require_inherits_browser()(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  });

  // node_modules/readable-stream/lib/internal/streams/pipeline.js
  var require_pipeline = __commonJS((exports, module) => {
    "use strict";
    var eos;
    function once(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors_browser().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop(err) {
      if (err)
        throw err;
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function destroyer(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      if (eos === void 0)
        eos = require_end_of_stream();
      eos(stream, {
        readable: reading,
        writable: writing
      }, function(err) {
        if (err)
          return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed)
          return;
        if (destroyed)
          return;
        destroyed = true;
        if (isRequest(stream))
          return stream.abort();
        if (typeof stream.destroy === "function")
          return stream.destroy();
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from, to) {
      return from.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length)
        return noop;
      if (typeof streams[streams.length - 1] !== "function")
        return noop;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0]))
        streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error)
            error = err;
          if (err)
            destroys.forEach(call);
          if (reading)
            return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module.exports = pipeline;
  });

  // node_modules/stream-browserify/index.js
  var require_stream_browserify = __commonJS((exports, module) => {
    module.exports = Stream2;
    var EE = require_events().EventEmitter;
    var inherits = require_inherits_browser();
    inherits(Stream2, EE);
    Stream2.Readable = require_stream_readable();
    Stream2.Writable = require_stream_writable();
    Stream2.Duplex = require_stream_duplex();
    Stream2.Transform = require_stream_transform();
    Stream2.PassThrough = require_stream_passthrough();
    Stream2.finished = require_end_of_stream();
    Stream2.pipeline = require_pipeline();
    Stream2.Stream = Stream2;
    function Stream2() {
      EE.call(this);
    }
    Stream2.prototype.pipe = function(dest, options) {
      var source = this;
      function ondata(chunk) {
        if (dest.writable) {
          if (dest.write(chunk) === false && source.pause) {
            source.pause();
          }
        }
      }
      source.on("data", ondata);
      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend);
        source.on("close", onclose);
      }
      var didOnEnd = false;
      function onend() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        dest.end();
      }
      function onclose() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        if (typeof dest.destroy === "function")
          dest.destroy();
      }
      function onerror(er) {
        cleanup();
        if (EE.listenerCount(this, "error") === 0) {
          throw er;
        }
      }
      source.on("error", onerror);
      dest.on("error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS((exports, module) => {
    "use strict";
    module.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (sym in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS((exports, module) => {
    "use strict";
    var origSymbol = import_global.default.Symbol;
    var hasSymbolSham = require_shams();
    module.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS((exports, module) => {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var slice = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = "[object Function]";
    module.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slice.call(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(this, args.concat(slice.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return this;
        } else {
          return target.apply(that, args.concat(slice.call(arguments)));
        }
      };
      var boundLength = Math.max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs.push("$" + i);
      }
      bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS((exports, module) => {
    "use strict";
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  });

  // node_modules/has/src/index.js
  var require_src = __commonJS((exports, module) => {
    "use strict";
    var bind = require_function_bind();
    module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS((exports, module) => {
    "use strict";
    var undefined2;
    var $SyntaxError = SyntaxError;
    var $Function = Function;
    var $TypeError = TypeError;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = Object.getOwnPropertyDescriptor;
    if ($gOPD) {
      try {
        $gOPD({}, "");
      } catch (e) {
        $gOPD = null;
      }
    }
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = Object.getPrototypeOf || function(x) {
      return x.__proto__;
    };
    var asyncGenFunction = getEvalledConstructor("async function* () {}");
    var asyncGenFunctionPrototype = asyncGenFunction ? asyncGenFunction.prototype : undefined2;
    var asyncGenPrototype = asyncGenFunctionPrototype ? asyncGenFunctionPrototype.prototype : undefined2;
    var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": getEvalledConstructor("async function () {}"),
      "%AsyncGenerator%": asyncGenFunctionPrototype,
      "%AsyncGeneratorFunction%": asyncGenFunction,
      "%AsyncIteratorPrototype%": asyncGenPrototype ? getProto(asyncGenPrototype) : undefined2,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": Error,
      "%eval%": eval,
      "%EvalError%": EvalError,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": getEvalledConstructor("function* () {}"),
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto(new Map()[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": Object,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": RangeError,
      "%ReferenceError%": ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto(new Set()[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
    };
    var LEGACY_ALIASES = {
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_src();
    var $concat = bind.call(Function.call, Array.prototype.concat);
    var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
    var $replace = bind.call(Function.call, String.prototype.replace);
    var $strSlice = bind.call(Function.call, String.prototype.slice);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void 0;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS((exports, module) => {
    "use strict";
    var bind = require_function_bind();
    var GetIntrinsic = require_get_intrinsic();
    var $apply = GetIntrinsic("%Function.prototype.apply%");
    var $call = GetIntrinsic("%Function.prototype.call%");
    var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
    var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
    var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
    var $max = GetIntrinsic("%Math.max%");
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", {value: 1});
      } catch (e) {
        $defineProperty = null;
      }
    }
    module.exports = function callBind(originalFunction) {
      var func = $reflectApply(bind, $call, arguments);
      if ($gOPD && $defineProperty) {
        var desc = $gOPD(func, "length");
        if (desc.configurable) {
          $defineProperty(func, "length", {value: 1 + $max(0, originalFunction.length - (arguments.length - 1))});
        }
      }
      return func;
    };
    var applyBind = function applyBind2() {
      return $reflectApply(bind, $apply, arguments);
    };
    if ($defineProperty) {
      $defineProperty(module.exports, "apply", {value: applyBind});
    } else {
      module.exports.apply = applyBind;
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS((exports, module) => {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBind = require_call_bind();
    var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
    module.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = GetIntrinsic(name, !!allowMissing);
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBind(intrinsic);
      }
      return intrinsic;
    };
  });

  // node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS((exports, module) => {
    "use strict";
    var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var isStandardArguments = function isArguments(value) {
      if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
        return false;
      }
      return $toString(value) === "[object Arguments]";
    };
    var isLegacyArguments = function isArguments(value) {
      if (isStandardArguments(value)) {
        return true;
      }
      return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
    };
    var supportsStandardArguments = function() {
      return isStandardArguments(arguments);
    }();
    isStandardArguments.isLegacyArguments = isLegacyArguments;
    module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
  });

  // node_modules/is-generator-function/index.js
  var require_is_generator_function = __commonJS((exports, module) => {
    "use strict";
    var toStr = Object.prototype.toString;
    var fnToStr = Function.prototype.toString;
    var isFnRegex = /^\s*(?:function)?\*/;
    var hasToStringTag = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
    var getProto = Object.getPrototypeOf;
    var getGeneratorFunc = function() {
      if (!hasToStringTag) {
        return false;
      }
      try {
        return Function("return function*() {}")();
      } catch (e) {
      }
    };
    var generatorFunc = getGeneratorFunc();
    var GeneratorFunction = getProto && generatorFunc ? getProto(generatorFunc) : false;
    module.exports = function isGeneratorFunction(fn) {
      if (typeof fn !== "function") {
        return false;
      }
      if (isFnRegex.test(fnToStr.call(fn))) {
        return true;
      }
      if (!hasToStringTag) {
        var str = toStr.call(fn);
        return str === "[object GeneratorFunction]";
      }
      return getProto && getProto(fn) === GeneratorFunction;
    };
  });

  // node_modules/foreach/index.js
  var require_foreach = __commonJS((exports, module) => {
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    module.exports = function forEach(obj, fn, ctx) {
      if (toString.call(fn) !== "[object Function]") {
        throw new TypeError("iterator must be a function");
      }
      var l = obj.length;
      if (l === +l) {
        for (var i = 0; i < l; i++) {
          fn.call(ctx, obj[i], i, obj);
        }
      } else {
        for (var k in obj) {
          if (hasOwn.call(obj, k)) {
            fn.call(ctx, obj[k], k, obj);
          }
        }
      }
    };
  });

  // node_modules/array-filter/index.js
  var require_array_filter = __commonJS((exports, module) => {
    module.exports = function(arr, fn, self2) {
      if (arr.filter)
        return arr.filter(fn, self2);
      if (arr === void 0 || arr === null)
        throw new TypeError();
      if (typeof fn != "function")
        throw new TypeError();
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        if (!hasOwn.call(arr, i))
          continue;
        var val = arr[i];
        if (fn.call(self2, val, i, arr))
          ret.push(val);
      }
      return ret;
    };
    var hasOwn = Object.prototype.hasOwnProperty;
  });

  // node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS((exports, module) => {
    "use strict";
    var filter = require_array_filter();
    module.exports = function availableTypedArrays() {
      return filter([
        "BigInt64Array",
        "BigUint64Array",
        "Float32Array",
        "Float64Array",
        "Int16Array",
        "Int32Array",
        "Int8Array",
        "Uint16Array",
        "Uint32Array",
        "Uint8Array",
        "Uint8ClampedArray"
      ], function(typedArray) {
        return typeof import_global.default[typedArray] === "function";
      });
    };
  });

  // node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js
  var require_getOwnPropertyDescriptor = __commonJS((exports, module) => {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%");
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  });

  // node_modules/is-typed-array/index.js
  var require_is_typed_array = __commonJS((exports, module) => {
    "use strict";
    var forEach = require_foreach();
    var availableTypedArrays = require_available_typed_arrays();
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var hasSymbols = require_has_symbols()();
    var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === "symbol";
    var typedArrays = availableTypedArrays();
    var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i] === value) {
          return i;
        }
      }
      return -1;
    };
    var $slice = callBound("String.prototype.slice");
    var toStrTags = {};
    var gOPD = require_getOwnPropertyDescriptor();
    var getPrototypeOf = Object.getPrototypeOf;
    if (hasToStringTag && gOPD && getPrototypeOf) {
      forEach(typedArrays, function(typedArray) {
        var arr = new import_global.default[typedArray]();
        if (!(Symbol.toStringTag in arr)) {
          throw new EvalError("this engine has support for Symbol.toStringTag, but " + typedArray + " does not have the property! Please report this.");
        }
        var proto = getPrototypeOf(arr);
        var descriptor = gOPD(proto, Symbol.toStringTag);
        if (!descriptor) {
          var superProto = getPrototypeOf(proto);
          descriptor = gOPD(superProto, Symbol.toStringTag);
        }
        toStrTags[typedArray] = descriptor.get;
      });
    }
    var tryTypedArrays = function tryAllTypedArrays(value) {
      var anyTrue = false;
      forEach(toStrTags, function(getter, typedArray) {
        if (!anyTrue) {
          try {
            anyTrue = getter.call(value) === typedArray;
          } catch (e) {
          }
        }
      });
      return anyTrue;
    };
    module.exports = function isTypedArray(value) {
      if (!value || typeof value !== "object") {
        return false;
      }
      if (!hasToStringTag) {
        var tag = $slice($toString(value), 8, -1);
        return $indexOf(typedArrays, tag) > -1;
      }
      if (!gOPD) {
        return false;
      }
      return tryTypedArrays(value);
    };
  });

  // node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS((exports, module) => {
    "use strict";
    var forEach = require_foreach();
    var availableTypedArrays = require_available_typed_arrays();
    var callBound = require_callBound();
    var $toString = callBound("Object.prototype.toString");
    var hasSymbols = require_has_symbols()();
    var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === "symbol";
    var typedArrays = availableTypedArrays();
    var $slice = callBound("String.prototype.slice");
    var toStrTags = {};
    var gOPD = require_getOwnPropertyDescriptor();
    var getPrototypeOf = Object.getPrototypeOf;
    if (hasToStringTag && gOPD && getPrototypeOf) {
      forEach(typedArrays, function(typedArray) {
        if (typeof import_global.default[typedArray] === "function") {
          var arr = new import_global.default[typedArray]();
          if (!(Symbol.toStringTag in arr)) {
            throw new EvalError("this engine has support for Symbol.toStringTag, but " + typedArray + " does not have the property! Please report this.");
          }
          var proto = getPrototypeOf(arr);
          var descriptor = gOPD(proto, Symbol.toStringTag);
          if (!descriptor) {
            var superProto = getPrototypeOf(proto);
            descriptor = gOPD(superProto, Symbol.toStringTag);
          }
          toStrTags[typedArray] = descriptor.get;
        }
      });
    }
    var tryTypedArrays = function tryAllTypedArrays(value) {
      var foundName = false;
      forEach(toStrTags, function(getter, typedArray) {
        if (!foundName) {
          try {
            var name = getter.call(value);
            if (name === typedArray) {
              foundName = name;
            }
          } catch (e) {
          }
        }
      });
      return foundName;
    };
    var isTypedArray = require_is_typed_array();
    module.exports = function whichTypedArray(value) {
      if (!isTypedArray(value)) {
        return false;
      }
      if (!hasToStringTag) {
        return $slice($toString(value), 8, -1);
      }
      return tryTypedArrays(value);
    };
  });

  // node_modules/util/support/types.js
  var require_types = __commonJS((exports) => {
    "use strict";
    var isArgumentsObject = require_is_arguments();
    var isGeneratorFunction = require_is_generator_function();
    var whichTypedArray = require_which_typed_array();
    var isTypedArray = require_is_typed_array();
    function uncurryThis(f) {
      return f.call.bind(f);
    }
    var BigIntSupported = typeof BigInt !== "undefined";
    var SymbolSupported = typeof Symbol !== "undefined";
    var ObjectToString = uncurryThis(Object.prototype.toString);
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);
    if (BigIntSupported) {
      bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }
    var bigIntValue;
    if (SymbolSupported) {
      symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }
    var symbolValue;
    function checkBoxedPrimitive(value, prototypeValueOf) {
      if (typeof value !== "object") {
        return false;
      }
      try {
        prototypeValueOf(value);
        return true;
      } catch (e) {
        return false;
      }
    }
    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction;
    exports.isTypedArray = isTypedArray;
    function isPromise(input) {
      return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
    }
    exports.isPromise = isPromise;
    function isArrayBufferView(value) {
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        return ArrayBuffer.isView(value);
      }
      return isTypedArray(value) || isDataView(value);
    }
    exports.isArrayBufferView = isArrayBufferView;
    function isUint8Array(value) {
      return whichTypedArray(value) === "Uint8Array";
    }
    exports.isUint8Array = isUint8Array;
    function isUint8ClampedArray(value) {
      return whichTypedArray(value) === "Uint8ClampedArray";
    }
    exports.isUint8ClampedArray = isUint8ClampedArray;
    function isUint16Array(value) {
      return whichTypedArray(value) === "Uint16Array";
    }
    exports.isUint16Array = isUint16Array;
    function isUint32Array(value) {
      return whichTypedArray(value) === "Uint32Array";
    }
    exports.isUint32Array = isUint32Array;
    function isInt8Array(value) {
      return whichTypedArray(value) === "Int8Array";
    }
    exports.isInt8Array = isInt8Array;
    function isInt16Array(value) {
      return whichTypedArray(value) === "Int16Array";
    }
    exports.isInt16Array = isInt16Array;
    function isInt32Array(value) {
      return whichTypedArray(value) === "Int32Array";
    }
    exports.isInt32Array = isInt32Array;
    function isFloat32Array(value) {
      return whichTypedArray(value) === "Float32Array";
    }
    exports.isFloat32Array = isFloat32Array;
    function isFloat64Array(value) {
      return whichTypedArray(value) === "Float64Array";
    }
    exports.isFloat64Array = isFloat64Array;
    function isBigInt64Array(value) {
      return whichTypedArray(value) === "BigInt64Array";
    }
    exports.isBigInt64Array = isBigInt64Array;
    function isBigUint64Array(value) {
      return whichTypedArray(value) === "BigUint64Array";
    }
    exports.isBigUint64Array = isBigUint64Array;
    function isMapToString(value) {
      return ObjectToString(value) === "[object Map]";
    }
    isMapToString.working = typeof Map !== "undefined" && isMapToString(new Map());
    function isMap(value) {
      if (typeof Map === "undefined") {
        return false;
      }
      return isMapToString.working ? isMapToString(value) : value instanceof Map;
    }
    exports.isMap = isMap;
    function isSetToString(value) {
      return ObjectToString(value) === "[object Set]";
    }
    isSetToString.working = typeof Set !== "undefined" && isSetToString(new Set());
    function isSet(value) {
      if (typeof Set === "undefined") {
        return false;
      }
      return isSetToString.working ? isSetToString(value) : value instanceof Set;
    }
    exports.isSet = isSet;
    function isWeakMapToString(value) {
      return ObjectToString(value) === "[object WeakMap]";
    }
    isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(new WeakMap());
    function isWeakMap(value) {
      if (typeof WeakMap === "undefined") {
        return false;
      }
      return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
    }
    exports.isWeakMap = isWeakMap;
    function isWeakSetToString(value) {
      return ObjectToString(value) === "[object WeakSet]";
    }
    isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(new WeakSet());
    function isWeakSet(value) {
      return isWeakSetToString(value);
    }
    exports.isWeakSet = isWeakSet;
    function isArrayBufferToString(value) {
      return ObjectToString(value) === "[object ArrayBuffer]";
    }
    isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
    function isArrayBuffer(value) {
      if (typeof ArrayBuffer === "undefined") {
        return false;
      }
      return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
    }
    exports.isArrayBuffer = isArrayBuffer;
    function isDataViewToString(value) {
      return ObjectToString(value) === "[object DataView]";
    }
    isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
    function isDataView(value) {
      if (typeof DataView === "undefined") {
        return false;
      }
      return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
    }
    exports.isDataView = isDataView;
    function isSharedArrayBufferToString(value) {
      return ObjectToString(value) === "[object SharedArrayBuffer]";
    }
    isSharedArrayBufferToString.working = typeof SharedArrayBuffer !== "undefined" && isSharedArrayBufferToString(new SharedArrayBuffer());
    function isSharedArrayBuffer(value) {
      if (typeof SharedArrayBuffer === "undefined") {
        return false;
      }
      return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBuffer;
    }
    exports.isSharedArrayBuffer = isSharedArrayBuffer;
    function isAsyncFunction(value) {
      return ObjectToString(value) === "[object AsyncFunction]";
    }
    exports.isAsyncFunction = isAsyncFunction;
    function isMapIterator(value) {
      return ObjectToString(value) === "[object Map Iterator]";
    }
    exports.isMapIterator = isMapIterator;
    function isSetIterator(value) {
      return ObjectToString(value) === "[object Set Iterator]";
    }
    exports.isSetIterator = isSetIterator;
    function isGeneratorObject(value) {
      return ObjectToString(value) === "[object Generator]";
    }
    exports.isGeneratorObject = isGeneratorObject;
    function isWebAssemblyCompiledModule(value) {
      return ObjectToString(value) === "[object WebAssembly.Module]";
    }
    exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
    function isNumberObject(value) {
      return checkBoxedPrimitive(value, numberValue);
    }
    exports.isNumberObject = isNumberObject;
    function isStringObject(value) {
      return checkBoxedPrimitive(value, stringValue);
    }
    exports.isStringObject = isStringObject;
    function isBooleanObject(value) {
      return checkBoxedPrimitive(value, booleanValue);
    }
    exports.isBooleanObject = isBooleanObject;
    function isBigIntObject(value) {
      return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
    }
    exports.isBigIntObject = isBigIntObject;
    function isSymbolObject(value) {
      return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
    }
    exports.isSymbolObject = isSymbolObject;
    function isBoxedPrimitive(value) {
      return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
    }
    exports.isBoxedPrimitive = isBoxedPrimitive;
    function isAnyArrayBuffer(value) {
      return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
    }
    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
      Object.defineProperty(exports, method, {
        enumerable: false,
        value: function() {
          throw new Error(method + " is not supported in userland");
        }
      });
    });
  });

  // node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS((exports, module) => {
    module.exports = function isBuffer(arg) {
      return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
    };
  });

  // node_modules/util/util.js
  var require_util2 = __commonJS((exports) => {
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
      var keys = Object.keys(obj);
      var descriptors = {};
      for (var i = 0; i < keys.length; i++) {
        descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
      }
      return descriptors;
    };
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(" ");
      }
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x2) {
        if (x2 === "%%")
          return "%";
        if (i >= len)
          return x2;
        switch (x2) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          default:
            return x2;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += " " + x;
        } else {
          str += " " + inspect(x);
        }
      }
      return str;
    };
    exports.deprecate = function(fn, msg) {
      if (typeof import_process.default !== "undefined" && import_process.default.noDeprecation === true) {
        return fn;
      }
      if (typeof import_process.default === "undefined") {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (import_process.default.throwDeprecation) {
            throw new Error(msg);
          } else if (import_process.default.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    };
    var debugs = {};
    var debugEnvRegex = /^$/;
    if (import_process.default.env.NODE_DEBUG) {
      debugEnv = import_process.default.env.NODE_DEBUG;
      debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
      debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
    }
    var debugEnv;
    exports.debuglog = function(set) {
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (debugEnvRegex.test(set)) {
          var pid = import_process.default.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else {
          debugs[set] = function() {
          };
        }
      }
      return debugs[set];
    };
    function inspect(obj, opts) {
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      if (arguments.length >= 3)
        ctx.depth = arguments[2];
      if (arguments.length >= 4)
        ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        ctx.showHidden = opts;
      } else if (opts) {
        exports._extend(ctx, opts);
      }
      if (isUndefined(ctx.showHidden))
        ctx.showHidden = false;
      if (isUndefined(ctx.depth))
        ctx.depth = 2;
      if (isUndefined(ctx.colors))
        ctx.colors = false;
      if (isUndefined(ctx.customInspect))
        ctx.customInspect = true;
      if (ctx.colors)
        ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
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
    };
    inspect.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      regexp: "red"
    };
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
      if (style) {
        return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m";
      } else {
        return str;
      }
    }
    function stylizeNoColor(str, styleType) {
      return str;
    }
    function arrayToHash(array) {
      var hash = {};
      array.forEach(function(val, idx) {
        hash[val] = true;
      });
      return hash;
    }
    function formatValue(ctx, value, recurseTimes) {
      if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
      if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
        return formatError(value);
      }
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ": " + value.name : "";
          return ctx.stylize("[Function" + name + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, braces = ["{", "}"];
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (isFunction(value)) {
        var n = value.name ? ": " + value.name : "";
        base = " [Function" + n + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        base = " " + formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize("undefined", "undefined");
      if (isString(value)) {
        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ctx.stylize(simple, "string");
      }
      if (isNumber(value))
        return ctx.stylize("" + value, "number");
      if (isBoolean(value))
        return ctx.stylize("" + value, "boolean");
      if (isNull(value))
        return ctx.stylize("null", "null");
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
        }
      });
      return output;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || {value: value[key]};
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize("[Getter/Setter]", "special");
        } else {
          str = ctx.stylize("[Getter]", "special");
        }
      } else {
        if (desc.set) {
          str = ctx.stylize("[Setter]", "special");
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line) {
                return "  " + line;
              }).join("\n").substr(2);
            } else {
              str = "\n" + str.split("\n").map(function(line) {
                return "   " + line;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var numLinesEst = 0;
      var length = output.reduce(function(prev, cur) {
        numLinesEst++;
        if (cur.indexOf("\n") >= 0)
          numLinesEst++;
        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      if (length > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    exports.types = require_types();
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return isObject(d) && objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    exports.types.isDate = isDate;
    function isError(e) {
      return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
    }
    exports.isError = isError;
    exports.types.isNativeError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = require_isBufferBrowser();
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    function pad(n) {
      return n < 10 ? "0" + n.toString(10) : n.toString(10);
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function timestamp() {
      var d = new Date();
      var time = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())
      ].join(":");
      return [d.getDate(), months[d.getMonth()], time].join(" ");
    }
    exports.log = function() {
      console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
    };
    exports.inherits = require_inherits_browser();
    exports._extend = function(origin, add) {
      if (!add || !isObject(add))
        return origin;
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
    exports.promisify = function promisify(original) {
      if (typeof original !== "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return fn;
      }
      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function(err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });
        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }
        return promise;
      }
      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
      if (kCustomPromisifiedSymbol)
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
      return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
    };
    exports.promisify.custom = kCustomPromisifiedSymbol;
    function callbackifyOnRejected(reason, cb) {
      if (!reason) {
        var newReason = new Error("Promise was rejected with a falsy value");
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }
    function callbackify(original) {
      if (typeof original !== "function") {
        throw new TypeError('The "original" argument must be of type Function');
      }
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        var maybeCb = args.pop();
        if (typeof maybeCb !== "function") {
          throw new TypeError("The last argument must be of type Function");
        }
        var self2 = this;
        var cb = function() {
          return maybeCb.apply(self2, arguments);
        };
        original.apply(this, args).then(function(ret) {
          import_process.default.nextTick(cb.bind(null, null, ret));
        }, function(rej) {
          import_process.default.nextTick(callbackifyOnRejected.bind(null, rej, cb));
        });
      }
      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
      return callbackified;
    }
    exports.callbackify = callbackify;
  });

  // node_modules/browser-stdout/index.js
  var require_browser_stdout = __commonJS((exports, module) => {
    var WritableStream = require_stream_browserify().Writable;
    var inherits = require_util2().inherits;
    module.exports = BrowserStdout;
    inherits(BrowserStdout, WritableStream);
    function BrowserStdout(opts) {
      if (!(this instanceof BrowserStdout))
        return new BrowserStdout(opts);
      opts = opts || {};
      WritableStream.call(this, opts);
      this.label = opts.label !== void 0 ? opts.label : "stdout";
    }
    BrowserStdout.prototype._write = function(chunks, encoding, cb) {
      var output = chunks.toString ? chunks.toString() : chunks;
      if (this.label === false) {
        console.log(output);
      } else {
        console.log(this.label + ":", output);
      }
      import_process.default.nextTick(cb);
    };
  });

  // node_modules/mocha/lib/browser/parse-query.js
  var require_parse_query = __commonJS((exports, module) => {
    "use strict";
    module.exports = function parseQuery(qs) {
      return qs.replace("?", "").split("&").reduce(function(obj, pair) {
        var i = pair.indexOf("=");
        var key = pair.slice(0, i);
        var val = pair.slice(++i);
        obj[key] = decodeURIComponent(val.replace(/\+/g, "%20"));
        return obj;
      }, {});
    };
  });

  // node_modules/mocha/lib/browser/highlight-tags.js
  var require_highlight_tags = __commonJS((exports, module) => {
    "use strict";
    function highlight(js) {
      return js.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>').replace(/('.*?')/gm, '<span class="string">$1</span>').replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>').replace(/(\d+)/gm, '<span class="number">$1</span>').replace(/\bnew[ \t]+(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>').replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>');
    }
    module.exports = function highlightTags(name) {
      var code = document.getElementById("mocha").getElementsByTagName(name);
      for (var i = 0, len = code.length; i < len; ++i) {
        code[i].innerHTML = highlight(code[i].innerHTML);
      }
    };
  });

  // node_modules/escape-string-regexp/index.js
  var require_escape_string_regexp = __commonJS((exports, module) => {
    "use strict";
    module.exports = (string) => {
      if (typeof string !== "string") {
        throw new TypeError("Expected a string");
      }
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
    };
  });

  // (disabled):path
  var require_path = __commonJS(() => {
  });

  // node_modules/diff/dist/diff.js
  var require_diff = __commonJS((exports, module) => {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = global2 || self, factory(global2.Diff = {}));
    })(exports, function(exports2) {
      "use strict";
      function Diff() {
      }
      Diff.prototype = {
        diff: function diff(oldString, newString) {
          var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          var callback = options.callback;
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          this.options = options;
          var self2 = this;
          function done(value) {
            if (callback) {
              setTimeout(function() {
                callback(void 0, value);
              }, 0);
              return true;
            } else {
              return value;
            }
          }
          oldString = this.castInput(oldString);
          newString = this.castInput(newString);
          oldString = this.removeEmpty(this.tokenize(oldString));
          newString = this.removeEmpty(this.tokenize(newString));
          var newLen = newString.length, oldLen = oldString.length;
          var editLength = 1;
          var maxEditLength = newLen + oldLen;
          var bestPath = [{
            newPos: -1,
            components: []
          }];
          var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
          if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            return done([{
              value: this.join(newString),
              count: newString.length
            }]);
          }
          function execEditLength() {
            for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
              var basePath = void 0;
              var addPath = bestPath[diagonalPath - 1], removePath = bestPath[diagonalPath + 1], _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
              if (addPath) {
                bestPath[diagonalPath - 1] = void 0;
              }
              var canAdd = addPath && addPath.newPos + 1 < newLen, canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;
              if (!canAdd && !canRemove) {
                bestPath[diagonalPath] = void 0;
                continue;
              }
              if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
                basePath = clonePath(removePath);
                self2.pushComponent(basePath.components, void 0, true);
              } else {
                basePath = addPath;
                basePath.newPos++;
                self2.pushComponent(basePath.components, true, void 0);
              }
              _oldPos = self2.extractCommon(basePath, newString, oldString, diagonalPath);
              if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
                return done(buildValues(self2, basePath.components, newString, oldString, self2.useLongestToken));
              } else {
                bestPath[diagonalPath] = basePath;
              }
            }
            editLength++;
          }
          if (callback) {
            (function exec() {
              setTimeout(function() {
                if (editLength > maxEditLength) {
                  return callback();
                }
                if (!execEditLength()) {
                  exec();
                }
              }, 0);
            })();
          } else {
            while (editLength <= maxEditLength) {
              var ret = execEditLength();
              if (ret) {
                return ret;
              }
            }
          }
        },
        pushComponent: function pushComponent(components, added, removed) {
          var last = components[components.length - 1];
          if (last && last.added === added && last.removed === removed) {
            components[components.length - 1] = {
              count: last.count + 1,
              added,
              removed
            };
          } else {
            components.push({
              count: 1,
              added,
              removed
            });
          }
        },
        extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
          var newLen = newString.length, oldLen = oldString.length, newPos = basePath.newPos, oldPos = newPos - diagonalPath, commonCount = 0;
          while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
            newPos++;
            oldPos++;
            commonCount++;
          }
          if (commonCount) {
            basePath.components.push({
              count: commonCount
            });
          }
          basePath.newPos = newPos;
          return oldPos;
        },
        equals: function equals(left, right) {
          if (this.options.comparator) {
            return this.options.comparator(left, right);
          } else {
            return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
          }
        },
        removeEmpty: function removeEmpty(array) {
          var ret = [];
          for (var i = 0; i < array.length; i++) {
            if (array[i]) {
              ret.push(array[i]);
            }
          }
          return ret;
        },
        castInput: function castInput(value) {
          return value;
        },
        tokenize: function tokenize(value) {
          return value.split("");
        },
        join: function join(chars) {
          return chars.join("");
        }
      };
      function buildValues(diff, components, newString, oldString, useLongestToken) {
        var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
        for (; componentPos < componentLen; componentPos++) {
          var component = components[componentPos];
          if (!component.removed) {
            if (!component.added && useLongestToken) {
              var value = newString.slice(newPos, newPos + component.count);
              value = value.map(function(value2, i) {
                var oldValue = oldString[oldPos + i];
                return oldValue.length > value2.length ? oldValue : value2;
              });
              component.value = diff.join(value);
            } else {
              component.value = diff.join(newString.slice(newPos, newPos + component.count));
            }
            newPos += component.count;
            if (!component.added) {
              oldPos += component.count;
            }
          } else {
            component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
            oldPos += component.count;
            if (componentPos && components[componentPos - 1].added) {
              var tmp = components[componentPos - 1];
              components[componentPos - 1] = components[componentPos];
              components[componentPos] = tmp;
            }
          }
        }
        var lastComponent = components[componentLen - 1];
        if (componentLen > 1 && typeof lastComponent.value === "string" && (lastComponent.added || lastComponent.removed) && diff.equals("", lastComponent.value)) {
          components[componentLen - 2].value += lastComponent.value;
          components.pop();
        }
        return components;
      }
      function clonePath(path) {
        return {
          newPos: path.newPos,
          components: path.components.slice(0)
        };
      }
      var characterDiff = new Diff();
      function diffChars(oldStr, newStr, options) {
        return characterDiff.diff(oldStr, newStr, options);
      }
      function generateOptions(options, defaults) {
        if (typeof options === "function") {
          defaults.callback = options;
        } else if (options) {
          for (var name in options) {
            if (options.hasOwnProperty(name)) {
              defaults[name] = options[name];
            }
          }
        }
        return defaults;
      }
      var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
      var reWhitespace = /\S/;
      var wordDiff = new Diff();
      wordDiff.equals = function(left, right) {
        if (this.options.ignoreCase) {
          left = left.toLowerCase();
          right = right.toLowerCase();
        }
        return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
      };
      wordDiff.tokenize = function(value) {
        var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
        for (var i = 0; i < tokens.length - 1; i++) {
          if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
            tokens[i] += tokens[i + 2];
            tokens.splice(i + 1, 2);
            i--;
          }
        }
        return tokens;
      };
      function diffWords(oldStr, newStr, options) {
        options = generateOptions(options, {
          ignoreWhitespace: true
        });
        return wordDiff.diff(oldStr, newStr, options);
      }
      function diffWordsWithSpace(oldStr, newStr, options) {
        return wordDiff.diff(oldStr, newStr, options);
      }
      var lineDiff = new Diff();
      lineDiff.tokenize = function(value) {
        var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
        if (!linesAndNewlines[linesAndNewlines.length - 1]) {
          linesAndNewlines.pop();
        }
        for (var i = 0; i < linesAndNewlines.length; i++) {
          var line = linesAndNewlines[i];
          if (i % 2 && !this.options.newlineIsToken) {
            retLines[retLines.length - 1] += line;
          } else {
            if (this.options.ignoreWhitespace) {
              line = line.trim();
            }
            retLines.push(line);
          }
        }
        return retLines;
      };
      function diffLines(oldStr, newStr, callback) {
        return lineDiff.diff(oldStr, newStr, callback);
      }
      function diffTrimmedLines(oldStr, newStr, callback) {
        var options = generateOptions(callback, {
          ignoreWhitespace: true
        });
        return lineDiff.diff(oldStr, newStr, options);
      }
      var sentenceDiff = new Diff();
      sentenceDiff.tokenize = function(value) {
        return value.split(/(\S.+?[.!?])(?=\s+|$)/);
      };
      function diffSentences(oldStr, newStr, callback) {
        return sentenceDiff.diff(oldStr, newStr, callback);
      }
      var cssDiff = new Diff();
      cssDiff.tokenize = function(value) {
        return value.split(/([{}:;,]|\s+)/);
      };
      function diffCss(oldStr, newStr, callback) {
        return cssDiff.diff(oldStr, newStr, callback);
      }
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
          return Array.from(iter);
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var objectPrototypeToString = Object.prototype.toString;
      var jsonDiff = new Diff();
      jsonDiff.useLongestToken = true;
      jsonDiff.tokenize = lineDiff.tokenize;
      jsonDiff.castInput = function(value) {
        var _this$options = this.options, undefinedReplacement = _this$options.undefinedReplacement, _this$options$stringi = _this$options.stringifyReplacer, stringifyReplacer = _this$options$stringi === void 0 ? function(k, v) {
          return typeof v === "undefined" ? undefinedReplacement : v;
        } : _this$options$stringi;
        return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
      };
      jsonDiff.equals = function(left, right) {
        return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"));
      };
      function diffJson(oldObj, newObj, options) {
        return jsonDiff.diff(oldObj, newObj, options);
      }
      function canonicalize(obj, stack, replacementStack, replacer, key) {
        stack = stack || [];
        replacementStack = replacementStack || [];
        if (replacer) {
          obj = replacer(key, obj);
        }
        var i;
        for (i = 0; i < stack.length; i += 1) {
          if (stack[i] === obj) {
            return replacementStack[i];
          }
        }
        var canonicalizedObj;
        if (objectPrototypeToString.call(obj) === "[object Array]") {
          stack.push(obj);
          canonicalizedObj = new Array(obj.length);
          replacementStack.push(canonicalizedObj);
          for (i = 0; i < obj.length; i += 1) {
            canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
          }
          stack.pop();
          replacementStack.pop();
          return canonicalizedObj;
        }
        if (obj && obj.toJSON) {
          obj = obj.toJSON();
        }
        if (_typeof(obj) === "object" && obj !== null) {
          stack.push(obj);
          canonicalizedObj = {};
          replacementStack.push(canonicalizedObj);
          var sortedKeys = [], _key;
          for (_key in obj) {
            if (obj.hasOwnProperty(_key)) {
              sortedKeys.push(_key);
            }
          }
          sortedKeys.sort();
          for (i = 0; i < sortedKeys.length; i += 1) {
            _key = sortedKeys[i];
            canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
          }
          stack.pop();
          replacementStack.pop();
        } else {
          canonicalizedObj = obj;
        }
        return canonicalizedObj;
      }
      var arrayDiff = new Diff();
      arrayDiff.tokenize = function(value) {
        return value.slice();
      };
      arrayDiff.join = arrayDiff.removeEmpty = function(value) {
        return value;
      };
      function diffArrays(oldArr, newArr, callback) {
        return arrayDiff.diff(oldArr, newArr, callback);
      }
      function parsePatch(uniDiff) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/), delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [], list = [], i = 0;
        function parseIndex() {
          var index = {};
          list.push(index);
          while (i < diffstr.length) {
            var line = diffstr[i];
            if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
              break;
            }
            var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);
            if (header) {
              index.index = header[1];
            }
            i++;
          }
          parseFileHeader(index);
          parseFileHeader(index);
          index.hunks = [];
          while (i < diffstr.length) {
            var _line = diffstr[i];
            if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
              break;
            } else if (/^@@/.test(_line)) {
              index.hunks.push(parseHunk());
            } else if (_line && options.strict) {
              throw new Error("Unknown line " + (i + 1) + " " + JSON.stringify(_line));
            } else {
              i++;
            }
          }
        }
        function parseFileHeader(index) {
          var fileHeader = /^(---|\+\+\+)\s+(.*)$/.exec(diffstr[i]);
          if (fileHeader) {
            var keyPrefix = fileHeader[1] === "---" ? "old" : "new";
            var data = fileHeader[2].split("	", 2);
            var fileName = data[0].replace(/\\\\/g, "\\");
            if (/^".*"$/.test(fileName)) {
              fileName = fileName.substr(1, fileName.length - 2);
            }
            index[keyPrefix + "FileName"] = fileName;
            index[keyPrefix + "Header"] = (data[1] || "").trim();
            i++;
          }
        }
        function parseHunk() {
          var chunkHeaderIndex = i, chunkHeaderLine = diffstr[i++], chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
          var hunk = {
            oldStart: +chunkHeader[1],
            oldLines: typeof chunkHeader[2] === "undefined" ? 1 : +chunkHeader[2],
            newStart: +chunkHeader[3],
            newLines: typeof chunkHeader[4] === "undefined" ? 1 : +chunkHeader[4],
            lines: [],
            linedelimiters: []
          };
          if (hunk.oldLines === 0) {
            hunk.oldStart += 1;
          }
          if (hunk.newLines === 0) {
            hunk.newStart += 1;
          }
          var addCount = 0, removeCount = 0;
          for (; i < diffstr.length; i++) {
            if (diffstr[i].indexOf("--- ") === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf("+++ ") === 0 && diffstr[i + 2].indexOf("@@") === 0) {
              break;
            }
            var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? " " : diffstr[i][0];
            if (operation === "+" || operation === "-" || operation === " " || operation === "\\") {
              hunk.lines.push(diffstr[i]);
              hunk.linedelimiters.push(delimiters[i] || "\n");
              if (operation === "+") {
                addCount++;
              } else if (operation === "-") {
                removeCount++;
              } else if (operation === " ") {
                addCount++;
                removeCount++;
              }
            } else {
              break;
            }
          }
          if (!addCount && hunk.newLines === 1) {
            hunk.newLines = 0;
          }
          if (!removeCount && hunk.oldLines === 1) {
            hunk.oldLines = 0;
          }
          if (options.strict) {
            if (addCount !== hunk.newLines) {
              throw new Error("Added line count did not match for hunk at line " + (chunkHeaderIndex + 1));
            }
            if (removeCount !== hunk.oldLines) {
              throw new Error("Removed line count did not match for hunk at line " + (chunkHeaderIndex + 1));
            }
          }
          return hunk;
        }
        while (i < diffstr.length) {
          parseIndex();
        }
        return list;
      }
      function distanceIterator(start, minLine, maxLine) {
        var wantForward = true, backwardExhausted = false, forwardExhausted = false, localOffset = 1;
        return function iterator() {
          if (wantForward && !forwardExhausted) {
            if (backwardExhausted) {
              localOffset++;
            } else {
              wantForward = false;
            }
            if (start + localOffset <= maxLine) {
              return localOffset;
            }
            forwardExhausted = true;
          }
          if (!backwardExhausted) {
            if (!forwardExhausted) {
              wantForward = true;
            }
            if (minLine <= start - localOffset) {
              return -localOffset++;
            }
            backwardExhausted = true;
            return iterator();
          }
        };
      }
      function applyPatch(source, uniDiff) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        if (typeof uniDiff === "string") {
          uniDiff = parsePatch(uniDiff);
        }
        if (Array.isArray(uniDiff)) {
          if (uniDiff.length > 1) {
            throw new Error("applyPatch only works with a single input.");
          }
          uniDiff = uniDiff[0];
        }
        var lines = source.split(/\r\n|[\n\v\f\r\x85]/), delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [], hunks = uniDiff.hunks, compareLine = options.compareLine || function(lineNumber, line2, operation2, patchContent) {
          return line2 === patchContent;
        }, errorCount = 0, fuzzFactor = options.fuzzFactor || 0, minLine = 0, offset = 0, removeEOFNL, addEOFNL;
        function hunkFits(hunk2, toPos2) {
          for (var j2 = 0; j2 < hunk2.lines.length; j2++) {
            var line2 = hunk2.lines[j2], operation2 = line2.length > 0 ? line2[0] : " ", content2 = line2.length > 0 ? line2.substr(1) : line2;
            if (operation2 === " " || operation2 === "-") {
              if (!compareLine(toPos2 + 1, lines[toPos2], operation2, content2)) {
                errorCount++;
                if (errorCount > fuzzFactor) {
                  return false;
                }
              }
              toPos2++;
            }
          }
          return true;
        }
        for (var i = 0; i < hunks.length; i++) {
          var hunk = hunks[i], maxLine = lines.length - hunk.oldLines, localOffset = 0, toPos = offset + hunk.oldStart - 1;
          var iterator = distanceIterator(toPos, minLine, maxLine);
          for (; localOffset !== void 0; localOffset = iterator()) {
            if (hunkFits(hunk, toPos + localOffset)) {
              hunk.offset = offset += localOffset;
              break;
            }
          }
          if (localOffset === void 0) {
            return false;
          }
          minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
        }
        var diffOffset = 0;
        for (var _i = 0; _i < hunks.length; _i++) {
          var _hunk = hunks[_i], _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;
          diffOffset += _hunk.newLines - _hunk.oldLines;
          for (var j = 0; j < _hunk.lines.length; j++) {
            var line = _hunk.lines[j], operation = line.length > 0 ? line[0] : " ", content = line.length > 0 ? line.substr(1) : line, delimiter = _hunk.linedelimiters[j];
            if (operation === " ") {
              _toPos++;
            } else if (operation === "-") {
              lines.splice(_toPos, 1);
              delimiters.splice(_toPos, 1);
            } else if (operation === "+") {
              lines.splice(_toPos, 0, content);
              delimiters.splice(_toPos, 0, delimiter);
              _toPos++;
            } else if (operation === "\\") {
              var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;
              if (previousOperation === "+") {
                removeEOFNL = true;
              } else if (previousOperation === "-") {
                addEOFNL = true;
              }
            }
          }
        }
        if (removeEOFNL) {
          while (!lines[lines.length - 1]) {
            lines.pop();
            delimiters.pop();
          }
        } else if (addEOFNL) {
          lines.push("");
          delimiters.push("\n");
        }
        for (var _k = 0; _k < lines.length - 1; _k++) {
          lines[_k] = lines[_k] + delimiters[_k];
        }
        return lines.join("");
      }
      function applyPatches(uniDiff, options) {
        if (typeof uniDiff === "string") {
          uniDiff = parsePatch(uniDiff);
        }
        var currentIndex = 0;
        function processIndex() {
          var index = uniDiff[currentIndex++];
          if (!index) {
            return options.complete();
          }
          options.loadFile(index, function(err, data) {
            if (err) {
              return options.complete(err);
            }
            var updatedContent = applyPatch(data, index, options);
            options.patched(index, updatedContent, function(err2) {
              if (err2) {
                return options.complete(err2);
              }
              processIndex();
            });
          });
        }
        processIndex();
      }
      function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
        if (!options) {
          options = {};
        }
        if (typeof options.context === "undefined") {
          options.context = 4;
        }
        var diff = diffLines(oldStr, newStr, options);
        diff.push({
          value: "",
          lines: []
        });
        function contextLines(lines) {
          return lines.map(function(entry) {
            return " " + entry;
          });
        }
        var hunks = [];
        var oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1;
        var _loop = function _loop2(i2) {
          var current = diff[i2], lines = current.lines || current.value.replace(/\n$/, "").split("\n");
          current.lines = lines;
          if (current.added || current.removed) {
            var _curRange;
            if (!oldRangeStart) {
              var prev = diff[i2 - 1];
              oldRangeStart = oldLine;
              newRangeStart = newLine;
              if (prev) {
                curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
                oldRangeStart -= curRange.length;
                newRangeStart -= curRange.length;
              }
            }
            (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function(entry) {
              return (current.added ? "+" : "-") + entry;
            })));
            if (current.added) {
              newLine += lines.length;
            } else {
              oldLine += lines.length;
            }
          } else {
            if (oldRangeStart) {
              if (lines.length <= options.context * 2 && i2 < diff.length - 2) {
                var _curRange2;
                (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)));
              } else {
                var _curRange3;
                var contextSize = Math.min(lines.length, options.context);
                (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))));
                var hunk = {
                  oldStart: oldRangeStart,
                  oldLines: oldLine - oldRangeStart + contextSize,
                  newStart: newRangeStart,
                  newLines: newLine - newRangeStart + contextSize,
                  lines: curRange
                };
                if (i2 >= diff.length - 2 && lines.length <= options.context) {
                  var oldEOFNewline = /\n$/.test(oldStr);
                  var newEOFNewline = /\n$/.test(newStr);
                  var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;
                  if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
                    curRange.splice(hunk.oldLines, 0, "\\ No newline at end of file");
                  }
                  if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
                    curRange.push("\\ No newline at end of file");
                  }
                }
                hunks.push(hunk);
                oldRangeStart = 0;
                newRangeStart = 0;
                curRange = [];
              }
            }
            oldLine += lines.length;
            newLine += lines.length;
          }
        };
        for (var i = 0; i < diff.length; i++) {
          _loop(i);
        }
        return {
          oldFileName,
          newFileName,
          oldHeader,
          newHeader,
          hunks
        };
      }
      function formatPatch(diff) {
        var ret = [];
        if (diff.oldFileName == diff.newFileName) {
          ret.push("Index: " + diff.oldFileName);
        }
        ret.push("===================================================================");
        ret.push("--- " + diff.oldFileName + (typeof diff.oldHeader === "undefined" ? "" : "	" + diff.oldHeader));
        ret.push("+++ " + diff.newFileName + (typeof diff.newHeader === "undefined" ? "" : "	" + diff.newHeader));
        for (var i = 0; i < diff.hunks.length; i++) {
          var hunk = diff.hunks[i];
          if (hunk.oldLines === 0) {
            hunk.oldStart -= 1;
          }
          if (hunk.newLines === 0) {
            hunk.newStart -= 1;
          }
          ret.push("@@ -" + hunk.oldStart + "," + hunk.oldLines + " +" + hunk.newStart + "," + hunk.newLines + " @@");
          ret.push.apply(ret, hunk.lines);
        }
        return ret.join("\n") + "\n";
      }
      function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
        return formatPatch(structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options));
      }
      function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
        return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
      }
      function arrayEqual(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        return arrayStartsWith(a, b);
      }
      function arrayStartsWith(array, start) {
        if (start.length > array.length) {
          return false;
        }
        for (var i = 0; i < start.length; i++) {
          if (start[i] !== array[i]) {
            return false;
          }
        }
        return true;
      }
      function calcLineCount(hunk) {
        var _calcOldNewLineCount = calcOldNewLineCount(hunk.lines), oldLines = _calcOldNewLineCount.oldLines, newLines = _calcOldNewLineCount.newLines;
        if (oldLines !== void 0) {
          hunk.oldLines = oldLines;
        } else {
          delete hunk.oldLines;
        }
        if (newLines !== void 0) {
          hunk.newLines = newLines;
        } else {
          delete hunk.newLines;
        }
      }
      function merge(mine, theirs, base) {
        mine = loadPatch(mine, base);
        theirs = loadPatch(theirs, base);
        var ret = {};
        if (mine.index || theirs.index) {
          ret.index = mine.index || theirs.index;
        }
        if (mine.newFileName || theirs.newFileName) {
          if (!fileNameChanged(mine)) {
            ret.oldFileName = theirs.oldFileName || mine.oldFileName;
            ret.newFileName = theirs.newFileName || mine.newFileName;
            ret.oldHeader = theirs.oldHeader || mine.oldHeader;
            ret.newHeader = theirs.newHeader || mine.newHeader;
          } else if (!fileNameChanged(theirs)) {
            ret.oldFileName = mine.oldFileName;
            ret.newFileName = mine.newFileName;
            ret.oldHeader = mine.oldHeader;
            ret.newHeader = mine.newHeader;
          } else {
            ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
            ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
            ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
            ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
          }
        }
        ret.hunks = [];
        var mineIndex = 0, theirsIndex = 0, mineOffset = 0, theirsOffset = 0;
        while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
          var mineCurrent = mine.hunks[mineIndex] || {
            oldStart: Infinity
          }, theirsCurrent = theirs.hunks[theirsIndex] || {
            oldStart: Infinity
          };
          if (hunkBefore(mineCurrent, theirsCurrent)) {
            ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
            mineIndex++;
            theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
          } else if (hunkBefore(theirsCurrent, mineCurrent)) {
            ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
            theirsIndex++;
            mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
          } else {
            var mergedHunk = {
              oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
              oldLines: 0,
              newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
              newLines: 0,
              lines: []
            };
            mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
            theirsIndex++;
            mineIndex++;
            ret.hunks.push(mergedHunk);
          }
        }
        return ret;
      }
      function loadPatch(param, base) {
        if (typeof param === "string") {
          if (/^@@/m.test(param) || /^Index:/m.test(param)) {
            return parsePatch(param)[0];
          }
          if (!base) {
            throw new Error("Must provide a base reference or pass in a patch");
          }
          return structuredPatch(void 0, void 0, base, param);
        }
        return param;
      }
      function fileNameChanged(patch) {
        return patch.newFileName && patch.newFileName !== patch.oldFileName;
      }
      function selectField(index, mine, theirs) {
        if (mine === theirs) {
          return mine;
        } else {
          index.conflict = true;
          return {
            mine,
            theirs
          };
        }
      }
      function hunkBefore(test, check) {
        return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
      }
      function cloneHunk(hunk, offset) {
        return {
          oldStart: hunk.oldStart,
          oldLines: hunk.oldLines,
          newStart: hunk.newStart + offset,
          newLines: hunk.newLines,
          lines: hunk.lines
        };
      }
      function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
        var mine = {
          offset: mineOffset,
          lines: mineLines,
          index: 0
        }, their = {
          offset: theirOffset,
          lines: theirLines,
          index: 0
        };
        insertLeading(hunk, mine, their);
        insertLeading(hunk, their, mine);
        while (mine.index < mine.lines.length && their.index < their.lines.length) {
          var mineCurrent = mine.lines[mine.index], theirCurrent = their.lines[their.index];
          if ((mineCurrent[0] === "-" || mineCurrent[0] === "+") && (theirCurrent[0] === "-" || theirCurrent[0] === "+")) {
            mutualChange(hunk, mine, their);
          } else if (mineCurrent[0] === "+" && theirCurrent[0] === " ") {
            var _hunk$lines;
            (_hunk$lines = hunk.lines).push.apply(_hunk$lines, _toConsumableArray(collectChange(mine)));
          } else if (theirCurrent[0] === "+" && mineCurrent[0] === " ") {
            var _hunk$lines2;
            (_hunk$lines2 = hunk.lines).push.apply(_hunk$lines2, _toConsumableArray(collectChange(their)));
          } else if (mineCurrent[0] === "-" && theirCurrent[0] === " ") {
            removal(hunk, mine, their);
          } else if (theirCurrent[0] === "-" && mineCurrent[0] === " ") {
            removal(hunk, their, mine, true);
          } else if (mineCurrent === theirCurrent) {
            hunk.lines.push(mineCurrent);
            mine.index++;
            their.index++;
          } else {
            conflict(hunk, collectChange(mine), collectChange(their));
          }
        }
        insertTrailing(hunk, mine);
        insertTrailing(hunk, their);
        calcLineCount(hunk);
      }
      function mutualChange(hunk, mine, their) {
        var myChanges = collectChange(mine), theirChanges = collectChange(their);
        if (allRemoves(myChanges) && allRemoves(theirChanges)) {
          if (arrayStartsWith(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
            var _hunk$lines3;
            (_hunk$lines3 = hunk.lines).push.apply(_hunk$lines3, _toConsumableArray(myChanges));
            return;
          } else if (arrayStartsWith(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
            var _hunk$lines4;
            (_hunk$lines4 = hunk.lines).push.apply(_hunk$lines4, _toConsumableArray(theirChanges));
            return;
          }
        } else if (arrayEqual(myChanges, theirChanges)) {
          var _hunk$lines5;
          (_hunk$lines5 = hunk.lines).push.apply(_hunk$lines5, _toConsumableArray(myChanges));
          return;
        }
        conflict(hunk, myChanges, theirChanges);
      }
      function removal(hunk, mine, their, swap) {
        var myChanges = collectChange(mine), theirChanges = collectContext(their, myChanges);
        if (theirChanges.merged) {
          var _hunk$lines6;
          (_hunk$lines6 = hunk.lines).push.apply(_hunk$lines6, _toConsumableArray(theirChanges.merged));
        } else {
          conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
        }
      }
      function conflict(hunk, mine, their) {
        hunk.conflict = true;
        hunk.lines.push({
          conflict: true,
          mine,
          theirs: their
        });
      }
      function insertLeading(hunk, insert, their) {
        while (insert.offset < their.offset && insert.index < insert.lines.length) {
          var line = insert.lines[insert.index++];
          hunk.lines.push(line);
          insert.offset++;
        }
      }
      function insertTrailing(hunk, insert) {
        while (insert.index < insert.lines.length) {
          var line = insert.lines[insert.index++];
          hunk.lines.push(line);
        }
      }
      function collectChange(state) {
        var ret = [], operation = state.lines[state.index][0];
        while (state.index < state.lines.length) {
          var line = state.lines[state.index];
          if (operation === "-" && line[0] === "+") {
            operation = "+";
          }
          if (operation === line[0]) {
            ret.push(line);
            state.index++;
          } else {
            break;
          }
        }
        return ret;
      }
      function collectContext(state, matchChanges) {
        var changes = [], merged = [], matchIndex = 0, contextChanges = false, conflicted = false;
        while (matchIndex < matchChanges.length && state.index < state.lines.length) {
          var change = state.lines[state.index], match = matchChanges[matchIndex];
          if (match[0] === "+") {
            break;
          }
          contextChanges = contextChanges || change[0] !== " ";
          merged.push(match);
          matchIndex++;
          if (change[0] === "+") {
            conflicted = true;
            while (change[0] === "+") {
              changes.push(change);
              change = state.lines[++state.index];
            }
          }
          if (match.substr(1) === change.substr(1)) {
            changes.push(change);
            state.index++;
          } else {
            conflicted = true;
          }
        }
        if ((matchChanges[matchIndex] || "")[0] === "+" && contextChanges) {
          conflicted = true;
        }
        if (conflicted) {
          return changes;
        }
        while (matchIndex < matchChanges.length) {
          merged.push(matchChanges[matchIndex++]);
        }
        return {
          merged,
          changes
        };
      }
      function allRemoves(changes) {
        return changes.reduce(function(prev, change) {
          return prev && change[0] === "-";
        }, true);
      }
      function skipRemoveSuperset(state, removeChanges, delta) {
        for (var i = 0; i < delta; i++) {
          var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);
          if (state.lines[state.index + i] !== " " + changeContent) {
            return false;
          }
        }
        state.index += delta;
        return true;
      }
      function calcOldNewLineCount(lines) {
        var oldLines = 0;
        var newLines = 0;
        lines.forEach(function(line) {
          if (typeof line !== "string") {
            var myCount = calcOldNewLineCount(line.mine);
            var theirCount = calcOldNewLineCount(line.theirs);
            if (oldLines !== void 0) {
              if (myCount.oldLines === theirCount.oldLines) {
                oldLines += myCount.oldLines;
              } else {
                oldLines = void 0;
              }
            }
            if (newLines !== void 0) {
              if (myCount.newLines === theirCount.newLines) {
                newLines += myCount.newLines;
              } else {
                newLines = void 0;
              }
            }
          } else {
            if (newLines !== void 0 && (line[0] === "+" || line[0] === " ")) {
              newLines++;
            }
            if (oldLines !== void 0 && (line[0] === "-" || line[0] === " ")) {
              oldLines++;
            }
          }
        });
        return {
          oldLines,
          newLines
        };
      }
      function convertChangesToDMP(changes) {
        var ret = [], change, operation;
        for (var i = 0; i < changes.length; i++) {
          change = changes[i];
          if (change.added) {
            operation = 1;
          } else if (change.removed) {
            operation = -1;
          } else {
            operation = 0;
          }
          ret.push([operation, change.value]);
        }
        return ret;
      }
      function convertChangesToXML(changes) {
        var ret = [];
        for (var i = 0; i < changes.length; i++) {
          var change = changes[i];
          if (change.added) {
            ret.push("<ins>");
          } else if (change.removed) {
            ret.push("<del>");
          }
          ret.push(escapeHTML(change.value));
          if (change.added) {
            ret.push("</ins>");
          } else if (change.removed) {
            ret.push("</del>");
          }
        }
        return ret.join("");
      }
      function escapeHTML(s) {
        var n = s;
        n = n.replace(/&/g, "&amp;");
        n = n.replace(/</g, "&lt;");
        n = n.replace(/>/g, "&gt;");
        n = n.replace(/"/g, "&quot;");
        return n;
      }
      exports2.Diff = Diff;
      exports2.applyPatch = applyPatch;
      exports2.applyPatches = applyPatches;
      exports2.canonicalize = canonicalize;
      exports2.convertChangesToDMP = convertChangesToDMP;
      exports2.convertChangesToXML = convertChangesToXML;
      exports2.createPatch = createPatch;
      exports2.createTwoFilesPatch = createTwoFilesPatch;
      exports2.diffArrays = diffArrays;
      exports2.diffChars = diffChars;
      exports2.diffCss = diffCss;
      exports2.diffJson = diffJson;
      exports2.diffLines = diffLines;
      exports2.diffSentences = diffSentences;
      exports2.diffTrimmedLines = diffTrimmedLines;
      exports2.diffWords = diffWords;
      exports2.diffWordsWithSpace = diffWordsWithSpace;
      exports2.merge = merge;
      exports2.parsePatch = parsePatch;
      exports2.structuredPatch = structuredPatch;
      Object.defineProperty(exports2, "__esModule", {value: true});
    });
  });

  // node_modules/ms/index.js
  var require_ms = __commonJS((exports, module) => {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  });

  // node_modules/nanoid/non-secure/index.cjs
  var require_non_secure = __commonJS((exports, module) => {
    var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
    var customAlphabet = (alphabet, size) => {
      return () => {
        let id = "";
        let i = size;
        while (i--) {
          id += alphabet[Math.random() * alphabet.length | 0];
        }
        return id;
      };
    };
    var nanoid = (size = 21) => {
      let id = "";
      let i = size;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    };
    module.exports = {nanoid, customAlphabet};
  });

  // node_modules/he/he.js
  var require_he = __commonJS((exports, module) => {
    /*! https://mths.be/he v1.2.0 by @mathias | MIT license */
    (function(root) {
      var freeExports = typeof exports == "object" && exports;
      var freeModule = typeof module == "object" && module && module.exports == freeExports && module;
      var freeGlobal = typeof import_global.default == "object" && import_global.default;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      var regexAsciiWhitelist = /[\x01-\x7F]/g;
      var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
      var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
      var encodeMap = {"\xAD": "shy", "\u200C": "zwnj", "\u200D": "zwj", "\u200E": "lrm", "\u2063": "ic", "\u2062": "it", "\u2061": "af", "\u200F": "rlm", "\u200B": "ZeroWidthSpace", "\u2060": "NoBreak", "\u0311": "DownBreve", "\u20DB": "tdot", "\u20DC": "DotDot", "	": "Tab", "\n": "NewLine", "\u2008": "puncsp", "\u205F": "MediumSpace", "\u2009": "thinsp", "\u200A": "hairsp", "\u2004": "emsp13", "\u2002": "ensp", "\u2005": "emsp14", "\u2003": "emsp", "\u2007": "numsp", "\xA0": "nbsp", "\u205F\u200A": "ThickSpace", "\u203E": "oline", _: "lowbar", "\u2010": "dash", "\u2013": "ndash", "\u2014": "mdash", "\u2015": "horbar", ",": "comma", ";": "semi", "\u204F": "bsemi", ":": "colon", "\u2A74": "Colone", "!": "excl", "\xA1": "iexcl", "?": "quest", "\xBF": "iquest", ".": "period", "\u2025": "nldr", "\u2026": "mldr", "\xB7": "middot", "'": "apos", "\u2018": "lsquo", "\u2019": "rsquo", "\u201A": "sbquo", "\u2039": "lsaquo", "\u203A": "rsaquo", '"': "quot", "\u201C": "ldquo", "\u201D": "rdquo", "\u201E": "bdquo", "\xAB": "laquo", "\xBB": "raquo", "(": "lpar", ")": "rpar", "[": "lsqb", "]": "rsqb", "{": "lcub", "}": "rcub", "\u2308": "lceil", "\u2309": "rceil", "\u230A": "lfloor", "\u230B": "rfloor", "\u2985": "lopar", "\u2986": "ropar", "\u298B": "lbrke", "\u298C": "rbrke", "\u298D": "lbrkslu", "\u298E": "rbrksld", "\u298F": "lbrksld", "\u2990": "rbrkslu", "\u2991": "langd", "\u2992": "rangd", "\u2993": "lparlt", "\u2994": "rpargt", "\u2995": "gtlPar", "\u2996": "ltrPar", "\u27E6": "lobrk", "\u27E7": "robrk", "\u27E8": "lang", "\u27E9": "rang", "\u27EA": "Lang", "\u27EB": "Rang", "\u27EC": "loang", "\u27ED": "roang", "\u2772": "lbbrk", "\u2773": "rbbrk", "\u2016": "Vert", "\xA7": "sect", "\xB6": "para", "@": "commat", "*": "ast", "/": "sol", undefined: null, "&": "amp", "#": "num", "%": "percnt", "\u2030": "permil", "\u2031": "pertenk", "\u2020": "dagger", "\u2021": "Dagger", "\u2022": "bull", "\u2043": "hybull", "\u2032": "prime", "\u2033": "Prime", "\u2034": "tprime", "\u2057": "qprime", "\u2035": "bprime", "\u2041": "caret", "`": "grave", "\xB4": "acute", "\u02DC": "tilde", "^": "Hat", "\xAF": "macr", "\u02D8": "breve", "\u02D9": "dot", "\xA8": "die", "\u02DA": "ring", "\u02DD": "dblac", "\xB8": "cedil", "\u02DB": "ogon", \u02C6: "circ", \u02C7: "caron", "\xB0": "deg", "\xA9": "copy", "\xAE": "reg", "\u2117": "copysr", \u2118: "wp", "\u211E": "rx", "\u2127": "mho", "\u2129": "iiota", "\u2190": "larr", "\u219A": "nlarr", "\u2192": "rarr", "\u219B": "nrarr", "\u2191": "uarr", "\u2193": "darr", "\u2194": "harr", "\u21AE": "nharr", "\u2195": "varr", "\u2196": "nwarr", "\u2197": "nearr", "\u2198": "searr", "\u2199": "swarr", "\u219D": "rarrw", "\u219D\u0338": "nrarrw", "\u219E": "Larr", "\u219F": "Uarr", "\u21A0": "Rarr", "\u21A1": "Darr", "\u21A2": "larrtl", "\u21A3": "rarrtl", "\u21A4": "mapstoleft", "\u21A5": "mapstoup", "\u21A6": "map", "\u21A7": "mapstodown", "\u21A9": "larrhk", "\u21AA": "rarrhk", "\u21AB": "larrlp", "\u21AC": "rarrlp", "\u21AD": "harrw", "\u21B0": "lsh", "\u21B1": "rsh", "\u21B2": "ldsh", "\u21B3": "rdsh", "\u21B5": "crarr", "\u21B6": "cularr", "\u21B7": "curarr", "\u21BA": "olarr", "\u21BB": "orarr", "\u21BC": "lharu", "\u21BD": "lhard", "\u21BE": "uharr", "\u21BF": "uharl", "\u21C0": "rharu", "\u21C1": "rhard", "\u21C2": "dharr", "\u21C3": "dharl", "\u21C4": "rlarr", "\u21C5": "udarr", "\u21C6": "lrarr", "\u21C7": "llarr", "\u21C8": "uuarr", "\u21C9": "rrarr", "\u21CA": "ddarr", "\u21CB": "lrhar", "\u21CC": "rlhar", "\u21D0": "lArr", "\u21CD": "nlArr", "\u21D1": "uArr", "\u21D2": "rArr", "\u21CF": "nrArr", "\u21D3": "dArr", "\u21D4": "iff", "\u21CE": "nhArr", "\u21D5": "vArr", "\u21D6": "nwArr", "\u21D7": "neArr", "\u21D8": "seArr", "\u21D9": "swArr", "\u21DA": "lAarr", "\u21DB": "rAarr", "\u21DD": "zigrarr", "\u21E4": "larrb", "\u21E5": "rarrb", "\u21F5": "duarr", "\u21FD": "loarr", "\u21FE": "roarr", "\u21FF": "hoarr", "\u2200": "forall", "\u2201": "comp", "\u2202": "part", "\u2202\u0338": "npart", "\u2203": "exist", "\u2204": "nexist", "\u2205": "empty", "\u2207": "Del", "\u2208": "in", "\u2209": "notin", "\u220B": "ni", "\u220C": "notni", "\u03F6": "bepsi", "\u220F": "prod", "\u2210": "coprod", "\u2211": "sum", "+": "plus", "\xB1": "pm", "\xF7": "div", "\xD7": "times", "<": "lt", "\u226E": "nlt", "<\u20D2": "nvlt", "=": "equals", "\u2260": "ne", "=\u20E5": "bne", "\u2A75": "Equal", ">": "gt", "\u226F": "ngt", ">\u20D2": "nvgt", "\xAC": "not", "|": "vert", "\xA6": "brvbar", "\u2212": "minus", "\u2213": "mp", "\u2214": "plusdo", "\u2044": "frasl", "\u2216": "setmn", "\u2217": "lowast", "\u2218": "compfn", "\u221A": "Sqrt", "\u221D": "prop", "\u221E": "infin", "\u221F": "angrt", "\u2220": "ang", "\u2220\u20D2": "nang", "\u2221": "angmsd", "\u2222": "angsph", "\u2223": "mid", "\u2224": "nmid", "\u2225": "par", "\u2226": "npar", "\u2227": "and", "\u2228": "or", "\u2229": "cap", "\u2229\uFE00": "caps", "\u222A": "cup", "\u222A\uFE00": "cups", "\u222B": "int", "\u222C": "Int", "\u222D": "tint", "\u2A0C": "qint", "\u222E": "oint", "\u222F": "Conint", "\u2230": "Cconint", "\u2231": "cwint", "\u2232": "cwconint", "\u2233": "awconint", "\u2234": "there4", "\u2235": "becaus", "\u2236": "ratio", "\u2237": "Colon", "\u2238": "minusd", "\u223A": "mDDot", "\u223B": "homtht", "\u223C": "sim", "\u2241": "nsim", "\u223C\u20D2": "nvsim", "\u223D": "bsim", "\u223D\u0331": "race", "\u223E": "ac", "\u223E\u0333": "acE", "\u223F": "acd", "\u2240": "wr", "\u2242": "esim", "\u2242\u0338": "nesim", "\u2243": "sime", "\u2244": "nsime", "\u2245": "cong", "\u2247": "ncong", "\u2246": "simne", "\u2248": "ap", "\u2249": "nap", "\u224A": "ape", "\u224B": "apid", "\u224B\u0338": "napid", "\u224C": "bcong", "\u224D": "CupCap", "\u226D": "NotCupCap", "\u224D\u20D2": "nvap", "\u224E": "bump", "\u224E\u0338": "nbump", "\u224F": "bumpe", "\u224F\u0338": "nbumpe", "\u2250": "doteq", "\u2250\u0338": "nedot", "\u2251": "eDot", "\u2252": "efDot", "\u2253": "erDot", "\u2254": "colone", "\u2255": "ecolon", "\u2256": "ecir", "\u2257": "cire", "\u2259": "wedgeq", "\u225A": "veeeq", "\u225C": "trie", "\u225F": "equest", "\u2261": "equiv", "\u2262": "nequiv", "\u2261\u20E5": "bnequiv", "\u2264": "le", "\u2270": "nle", "\u2264\u20D2": "nvle", "\u2265": "ge", "\u2271": "nge", "\u2265\u20D2": "nvge", "\u2266": "lE", "\u2266\u0338": "nlE", "\u2267": "gE", "\u2267\u0338": "ngE", "\u2268\uFE00": "lvnE", "\u2268": "lnE", "\u2269": "gnE", "\u2269\uFE00": "gvnE", "\u226A": "ll", "\u226A\u0338": "nLtv", "\u226A\u20D2": "nLt", "\u226B": "gg", "\u226B\u0338": "nGtv", "\u226B\u20D2": "nGt", "\u226C": "twixt", "\u2272": "lsim", "\u2274": "nlsim", "\u2273": "gsim", "\u2275": "ngsim", "\u2276": "lg", "\u2278": "ntlg", "\u2277": "gl", "\u2279": "ntgl", "\u227A": "pr", "\u2280": "npr", "\u227B": "sc", "\u2281": "nsc", "\u227C": "prcue", "\u22E0": "nprcue", "\u227D": "sccue", "\u22E1": "nsccue", "\u227E": "prsim", "\u227F": "scsim", "\u227F\u0338": "NotSucceedsTilde", "\u2282": "sub", "\u2284": "nsub", "\u2282\u20D2": "vnsub", "\u2283": "sup", "\u2285": "nsup", "\u2283\u20D2": "vnsup", "\u2286": "sube", "\u2288": "nsube", "\u2287": "supe", "\u2289": "nsupe", "\u228A\uFE00": "vsubne", "\u228A": "subne", "\u228B\uFE00": "vsupne", "\u228B": "supne", "\u228D": "cupdot", "\u228E": "uplus", "\u228F": "sqsub", "\u228F\u0338": "NotSquareSubset", "\u2290": "sqsup", "\u2290\u0338": "NotSquareSuperset", "\u2291": "sqsube", "\u22E2": "nsqsube", "\u2292": "sqsupe", "\u22E3": "nsqsupe", "\u2293": "sqcap", "\u2293\uFE00": "sqcaps", "\u2294": "sqcup", "\u2294\uFE00": "sqcups", "\u2295": "oplus", "\u2296": "ominus", "\u2297": "otimes", "\u2298": "osol", "\u2299": "odot", "\u229A": "ocir", "\u229B": "oast", "\u229D": "odash", "\u229E": "plusb", "\u229F": "minusb", "\u22A0": "timesb", "\u22A1": "sdotb", "\u22A2": "vdash", "\u22AC": "nvdash", "\u22A3": "dashv", "\u22A4": "top", "\u22A5": "bot", "\u22A7": "models", "\u22A8": "vDash", "\u22AD": "nvDash", "\u22A9": "Vdash", "\u22AE": "nVdash", "\u22AA": "Vvdash", "\u22AB": "VDash", "\u22AF": "nVDash", "\u22B0": "prurel", "\u22B2": "vltri", "\u22EA": "nltri", "\u22B3": "vrtri", "\u22EB": "nrtri", "\u22B4": "ltrie", "\u22EC": "nltrie", "\u22B4\u20D2": "nvltrie", "\u22B5": "rtrie", "\u22ED": "nrtrie", "\u22B5\u20D2": "nvrtrie", "\u22B6": "origof", "\u22B7": "imof", "\u22B8": "mumap", "\u22B9": "hercon", "\u22BA": "intcal", "\u22BB": "veebar", "\u22BD": "barvee", "\u22BE": "angrtvb", "\u22BF": "lrtri", "\u22C0": "Wedge", "\u22C1": "Vee", "\u22C2": "xcap", "\u22C3": "xcup", "\u22C4": "diam", "\u22C5": "sdot", "\u22C6": "Star", "\u22C7": "divonx", "\u22C8": "bowtie", "\u22C9": "ltimes", "\u22CA": "rtimes", "\u22CB": "lthree", "\u22CC": "rthree", "\u22CD": "bsime", "\u22CE": "cuvee", "\u22CF": "cuwed", "\u22D0": "Sub", "\u22D1": "Sup", "\u22D2": "Cap", "\u22D3": "Cup", "\u22D4": "fork", "\u22D5": "epar", "\u22D6": "ltdot", "\u22D7": "gtdot", "\u22D8": "Ll", "\u22D8\u0338": "nLl", "\u22D9": "Gg", "\u22D9\u0338": "nGg", "\u22DA\uFE00": "lesg", "\u22DA": "leg", "\u22DB": "gel", "\u22DB\uFE00": "gesl", "\u22DE": "cuepr", "\u22DF": "cuesc", "\u22E6": "lnsim", "\u22E7": "gnsim", "\u22E8": "prnsim", "\u22E9": "scnsim", "\u22EE": "vellip", "\u22EF": "ctdot", "\u22F0": "utdot", "\u22F1": "dtdot", "\u22F2": "disin", "\u22F3": "isinsv", "\u22F4": "isins", "\u22F5": "isindot", "\u22F5\u0338": "notindot", "\u22F6": "notinvc", "\u22F7": "notinvb", "\u22F9": "isinE", "\u22F9\u0338": "notinE", "\u22FA": "nisd", "\u22FB": "xnis", "\u22FC": "nis", "\u22FD": "notnivc", "\u22FE": "notnivb", "\u2305": "barwed", "\u2306": "Barwed", "\u230C": "drcrop", "\u230D": "dlcrop", "\u230E": "urcrop", "\u230F": "ulcrop", "\u2310": "bnot", "\u2312": "profline", "\u2313": "profsurf", "\u2315": "telrec", "\u2316": "target", "\u231C": "ulcorn", "\u231D": "urcorn", "\u231E": "dlcorn", "\u231F": "drcorn", "\u2322": "frown", "\u2323": "smile", "\u232D": "cylcty", "\u232E": "profalar", "\u2336": "topbot", "\u233D": "ovbar", "\u233F": "solbar", "\u237C": "angzarr", "\u23B0": "lmoust", "\u23B1": "rmoust", "\u23B4": "tbrk", "\u23B5": "bbrk", "\u23B6": "bbrktbrk", "\u23DC": "OverParenthesis", "\u23DD": "UnderParenthesis", "\u23DE": "OverBrace", "\u23DF": "UnderBrace", "\u23E2": "trpezium", "\u23E7": "elinters", "\u2423": "blank", "\u2500": "boxh", "\u2502": "boxv", "\u250C": "boxdr", "\u2510": "boxdl", "\u2514": "boxur", "\u2518": "boxul", "\u251C": "boxvr", "\u2524": "boxvl", "\u252C": "boxhd", "\u2534": "boxhu", "\u253C": "boxvh", "\u2550": "boxH", "\u2551": "boxV", "\u2552": "boxdR", "\u2553": "boxDr", "\u2554": "boxDR", "\u2555": "boxdL", "\u2556": "boxDl", "\u2557": "boxDL", "\u2558": "boxuR", "\u2559": "boxUr", "\u255A": "boxUR", "\u255B": "boxuL", "\u255C": "boxUl", "\u255D": "boxUL", "\u255E": "boxvR", "\u255F": "boxVr", "\u2560": "boxVR", "\u2561": "boxvL", "\u2562": "boxVl", "\u2563": "boxVL", "\u2564": "boxHd", "\u2565": "boxhD", "\u2566": "boxHD", "\u2567": "boxHu", "\u2568": "boxhU", "\u2569": "boxHU", "\u256A": "boxvH", "\u256B": "boxVh", "\u256C": "boxVH", "\u2580": "uhblk", "\u2584": "lhblk", "\u2588": "block", "\u2591": "blk14", "\u2592": "blk12", "\u2593": "blk34", "\u25A1": "squ", "\u25AA": "squf", "\u25AB": "EmptyVerySmallSquare", "\u25AD": "rect", "\u25AE": "marker", "\u25B1": "fltns", "\u25B3": "xutri", "\u25B4": "utrif", "\u25B5": "utri", "\u25B8": "rtrif", "\u25B9": "rtri", "\u25BD": "xdtri", "\u25BE": "dtrif", "\u25BF": "dtri", "\u25C2": "ltrif", "\u25C3": "ltri", "\u25CA": "loz", "\u25CB": "cir", "\u25EC": "tridot", "\u25EF": "xcirc", "\u25F8": "ultri", "\u25F9": "urtri", "\u25FA": "lltri", "\u25FB": "EmptySmallSquare", "\u25FC": "FilledSmallSquare", "\u2605": "starf", "\u2606": "star", "\u260E": "phone", "\u2640": "female", "\u2642": "male", "\u2660": "spades", "\u2663": "clubs", "\u2665": "hearts", "\u2666": "diams", "\u266A": "sung", "\u2713": "check", "\u2717": "cross", "\u2720": "malt", "\u2736": "sext", "\u2758": "VerticalSeparator", "\u27C8": "bsolhsub", "\u27C9": "suphsol", "\u27F5": "xlarr", "\u27F6": "xrarr", "\u27F7": "xharr", "\u27F8": "xlArr", "\u27F9": "xrArr", "\u27FA": "xhArr", "\u27FC": "xmap", "\u27FF": "dzigrarr", "\u2902": "nvlArr", "\u2903": "nvrArr", "\u2904": "nvHarr", "\u2905": "Map", "\u290C": "lbarr", "\u290D": "rbarr", "\u290E": "lBarr", "\u290F": "rBarr", "\u2910": "RBarr", "\u2911": "DDotrahd", "\u2912": "UpArrowBar", "\u2913": "DownArrowBar", "\u2916": "Rarrtl", "\u2919": "latail", "\u291A": "ratail", "\u291B": "lAtail", "\u291C": "rAtail", "\u291D": "larrfs", "\u291E": "rarrfs", "\u291F": "larrbfs", "\u2920": "rarrbfs", "\u2923": "nwarhk", "\u2924": "nearhk", "\u2925": "searhk", "\u2926": "swarhk", "\u2927": "nwnear", "\u2928": "toea", "\u2929": "tosa", "\u292A": "swnwar", "\u2933": "rarrc", "\u2933\u0338": "nrarrc", "\u2935": "cudarrr", "\u2936": "ldca", "\u2937": "rdca", "\u2938": "cudarrl", "\u2939": "larrpl", "\u293C": "curarrm", "\u293D": "cularrp", "\u2945": "rarrpl", "\u2948": "harrcir", "\u2949": "Uarrocir", "\u294A": "lurdshar", "\u294B": "ldrushar", "\u294E": "LeftRightVector", "\u294F": "RightUpDownVector", "\u2950": "DownLeftRightVector", "\u2951": "LeftUpDownVector", "\u2952": "LeftVectorBar", "\u2953": "RightVectorBar", "\u2954": "RightUpVectorBar", "\u2955": "RightDownVectorBar", "\u2956": "DownLeftVectorBar", "\u2957": "DownRightVectorBar", "\u2958": "LeftUpVectorBar", "\u2959": "LeftDownVectorBar", "\u295A": "LeftTeeVector", "\u295B": "RightTeeVector", "\u295C": "RightUpTeeVector", "\u295D": "RightDownTeeVector", "\u295E": "DownLeftTeeVector", "\u295F": "DownRightTeeVector", "\u2960": "LeftUpTeeVector", "\u2961": "LeftDownTeeVector", "\u2962": "lHar", "\u2963": "uHar", "\u2964": "rHar", "\u2965": "dHar", "\u2966": "luruhar", "\u2967": "ldrdhar", "\u2968": "ruluhar", "\u2969": "rdldhar", "\u296A": "lharul", "\u296B": "llhard", "\u296C": "rharul", "\u296D": "lrhard", "\u296E": "udhar", "\u296F": "duhar", "\u2970": "RoundImplies", "\u2971": "erarr", "\u2972": "simrarr", "\u2973": "larrsim", "\u2974": "rarrsim", "\u2975": "rarrap", "\u2976": "ltlarr", "\u2978": "gtrarr", "\u2979": "subrarr", "\u297B": "suplarr", "\u297C": "lfisht", "\u297D": "rfisht", "\u297E": "ufisht", "\u297F": "dfisht", "\u299A": "vzigzag", "\u299C": "vangrt", "\u299D": "angrtvbd", "\u29A4": "ange", "\u29A5": "range", "\u29A6": "dwangle", "\u29A7": "uwangle", "\u29A8": "angmsdaa", "\u29A9": "angmsdab", "\u29AA": "angmsdac", "\u29AB": "angmsdad", "\u29AC": "angmsdae", "\u29AD": "angmsdaf", "\u29AE": "angmsdag", "\u29AF": "angmsdah", "\u29B0": "bemptyv", "\u29B1": "demptyv", "\u29B2": "cemptyv", "\u29B3": "raemptyv", "\u29B4": "laemptyv", "\u29B5": "ohbar", "\u29B6": "omid", "\u29B7": "opar", "\u29B9": "operp", "\u29BB": "olcross", "\u29BC": "odsold", "\u29BE": "olcir", "\u29BF": "ofcir", "\u29C0": "olt", "\u29C1": "ogt", "\u29C2": "cirscir", "\u29C3": "cirE", "\u29C4": "solb", "\u29C5": "bsolb", "\u29C9": "boxbox", "\u29CD": "trisb", "\u29CE": "rtriltri", "\u29CF": "LeftTriangleBar", "\u29CF\u0338": "NotLeftTriangleBar", "\u29D0": "RightTriangleBar", "\u29D0\u0338": "NotRightTriangleBar", "\u29DC": "iinfin", "\u29DD": "infintie", "\u29DE": "nvinfin", "\u29E3": "eparsl", "\u29E4": "smeparsl", "\u29E5": "eqvparsl", "\u29EB": "lozf", "\u29F4": "RuleDelayed", "\u29F6": "dsol", "\u2A00": "xodot", "\u2A01": "xoplus", "\u2A02": "xotime", "\u2A04": "xuplus", "\u2A06": "xsqcup", "\u2A0D": "fpartint", "\u2A10": "cirfnint", "\u2A11": "awint", "\u2A12": "rppolint", "\u2A13": "scpolint", "\u2A14": "npolint", "\u2A15": "pointint", "\u2A16": "quatint", "\u2A17": "intlarhk", "\u2A22": "pluscir", "\u2A23": "plusacir", "\u2A24": "simplus", "\u2A25": "plusdu", "\u2A26": "plussim", "\u2A27": "plustwo", "\u2A29": "mcomma", "\u2A2A": "minusdu", "\u2A2D": "loplus", "\u2A2E": "roplus", "\u2A2F": "Cross", "\u2A30": "timesd", "\u2A31": "timesbar", "\u2A33": "smashp", "\u2A34": "lotimes", "\u2A35": "rotimes", "\u2A36": "otimesas", "\u2A37": "Otimes", "\u2A38": "odiv", "\u2A39": "triplus", "\u2A3A": "triminus", "\u2A3B": "tritime", "\u2A3C": "iprod", "\u2A3F": "amalg", "\u2A40": "capdot", "\u2A42": "ncup", "\u2A43": "ncap", "\u2A44": "capand", "\u2A45": "cupor", "\u2A46": "cupcap", "\u2A47": "capcup", "\u2A48": "cupbrcap", "\u2A49": "capbrcup", "\u2A4A": "cupcup", "\u2A4B": "capcap", "\u2A4C": "ccups", "\u2A4D": "ccaps", "\u2A50": "ccupssm", "\u2A53": "And", "\u2A54": "Or", "\u2A55": "andand", "\u2A56": "oror", "\u2A57": "orslope", "\u2A58": "andslope", "\u2A5A": "andv", "\u2A5B": "orv", "\u2A5C": "andd", "\u2A5D": "ord", "\u2A5F": "wedbar", "\u2A66": "sdote", "\u2A6A": "simdot", "\u2A6D": "congdot", "\u2A6D\u0338": "ncongdot", "\u2A6E": "easter", "\u2A6F": "apacir", "\u2A70": "apE", "\u2A70\u0338": "napE", "\u2A71": "eplus", "\u2A72": "pluse", "\u2A73": "Esim", "\u2A77": "eDDot", "\u2A78": "equivDD", "\u2A79": "ltcir", "\u2A7A": "gtcir", "\u2A7B": "ltquest", "\u2A7C": "gtquest", "\u2A7D": "les", "\u2A7D\u0338": "nles", "\u2A7E": "ges", "\u2A7E\u0338": "nges", "\u2A7F": "lesdot", "\u2A80": "gesdot", "\u2A81": "lesdoto", "\u2A82": "gesdoto", "\u2A83": "lesdotor", "\u2A84": "gesdotol", "\u2A85": "lap", "\u2A86": "gap", "\u2A87": "lne", "\u2A88": "gne", "\u2A89": "lnap", "\u2A8A": "gnap", "\u2A8B": "lEg", "\u2A8C": "gEl", "\u2A8D": "lsime", "\u2A8E": "gsime", "\u2A8F": "lsimg", "\u2A90": "gsiml", "\u2A91": "lgE", "\u2A92": "glE", "\u2A93": "lesges", "\u2A94": "gesles", "\u2A95": "els", "\u2A96": "egs", "\u2A97": "elsdot", "\u2A98": "egsdot", "\u2A99": "el", "\u2A9A": "eg", "\u2A9D": "siml", "\u2A9E": "simg", "\u2A9F": "simlE", "\u2AA0": "simgE", "\u2AA1": "LessLess", "\u2AA1\u0338": "NotNestedLessLess", "\u2AA2": "GreaterGreater", "\u2AA2\u0338": "NotNestedGreaterGreater", "\u2AA4": "glj", "\u2AA5": "gla", "\u2AA6": "ltcc", "\u2AA7": "gtcc", "\u2AA8": "lescc", "\u2AA9": "gescc", "\u2AAA": "smt", "\u2AAB": "lat", "\u2AAC": "smte", "\u2AAC\uFE00": "smtes", "\u2AAD": "late", "\u2AAD\uFE00": "lates", "\u2AAE": "bumpE", "\u2AAF": "pre", "\u2AAF\u0338": "npre", "\u2AB0": "sce", "\u2AB0\u0338": "nsce", "\u2AB3": "prE", "\u2AB4": "scE", "\u2AB5": "prnE", "\u2AB6": "scnE", "\u2AB7": "prap", "\u2AB8": "scap", "\u2AB9": "prnap", "\u2ABA": "scnap", "\u2ABB": "Pr", "\u2ABC": "Sc", "\u2ABD": "subdot", "\u2ABE": "supdot", "\u2ABF": "subplus", "\u2AC0": "supplus", "\u2AC1": "submult", "\u2AC2": "supmult", "\u2AC3": "subedot", "\u2AC4": "supedot", "\u2AC5": "subE", "\u2AC5\u0338": "nsubE", "\u2AC6": "supE", "\u2AC6\u0338": "nsupE", "\u2AC7": "subsim", "\u2AC8": "supsim", "\u2ACB\uFE00": "vsubnE", "\u2ACB": "subnE", "\u2ACC\uFE00": "vsupnE", "\u2ACC": "supnE", "\u2ACF": "csub", "\u2AD0": "csup", "\u2AD1": "csube", "\u2AD2": "csupe", "\u2AD3": "subsup", "\u2AD4": "supsub", "\u2AD5": "subsub", "\u2AD6": "supsup", "\u2AD7": "suphsub", "\u2AD8": "supdsub", "\u2AD9": "forkv", "\u2ADA": "topfork", "\u2ADB": "mlcp", "\u2AE4": "Dashv", "\u2AE6": "Vdashl", "\u2AE7": "Barv", "\u2AE8": "vBar", "\u2AE9": "vBarv", "\u2AEB": "Vbar", "\u2AEC": "Not", "\u2AED": "bNot", "\u2AEE": "rnmid", "\u2AEF": "cirmid", "\u2AF0": "midcir", "\u2AF1": "topcir", "\u2AF2": "nhpar", "\u2AF3": "parsim", "\u2AFD": "parsl", "\u2AFD\u20E5": "nparsl", "\u266D": "flat", "\u266E": "natur", "\u266F": "sharp", "\xA4": "curren", "\xA2": "cent", $: "dollar", "\xA3": "pound", "\xA5": "yen", "\u20AC": "euro", "\xB9": "sup1", "\xBD": "half", "\u2153": "frac13", "\xBC": "frac14", "\u2155": "frac15", "\u2159": "frac16", "\u215B": "frac18", "\xB2": "sup2", "\u2154": "frac23", "\u2156": "frac25", "\xB3": "sup3", "\xBE": "frac34", "\u2157": "frac35", "\u215C": "frac38", "\u2158": "frac45", "\u215A": "frac56", "\u215D": "frac58", "\u215E": "frac78", \u{1D4B6}: "ascr", \u{1D552}: "aopf", \u{1D51E}: "afr", \u{1D538}: "Aopf", \u{1D504}: "Afr", \u{1D49C}: "Ascr", \u00AA: "ordf", \u00E1: "aacute", \u00C1: "Aacute", \u00E0: "agrave", \u00C0: "Agrave", \u0103: "abreve", \u0102: "Abreve", \u00E2: "acirc", \u00C2: "Acirc", \u00E5: "aring", \u00C5: "angst", \u00E4: "auml", \u00C4: "Auml", \u00E3: "atilde", \u00C3: "Atilde", \u0105: "aogon", \u0104: "Aogon", \u0101: "amacr", \u0100: "Amacr", \u00E6: "aelig", \u00C6: "AElig", \u{1D4B7}: "bscr", \u{1D553}: "bopf", \u{1D51F}: "bfr", \u{1D539}: "Bopf", \u212C: "Bscr", \u{1D505}: "Bfr", \u{1D520}: "cfr", \u{1D4B8}: "cscr", \u{1D554}: "copf", \u212D: "Cfr", \u{1D49E}: "Cscr", \u2102: "Copf", \u0107: "cacute", \u0106: "Cacute", \u0109: "ccirc", \u0108: "Ccirc", \u010D: "ccaron", \u010C: "Ccaron", \u010B: "cdot", \u010A: "Cdot", \u00E7: "ccedil", \u00C7: "Ccedil", "\u2105": "incare", \u{1D521}: "dfr", \u2146: "dd", \u{1D555}: "dopf", \u{1D4B9}: "dscr", \u{1D49F}: "Dscr", \u{1D507}: "Dfr", \u2145: "DD", \u{1D53B}: "Dopf", \u010F: "dcaron", \u010E: "Dcaron", \u0111: "dstrok", \u0110: "Dstrok", \u00F0: "eth", \u00D0: "ETH", \u2147: "ee", \u212F: "escr", \u{1D522}: "efr", \u{1D556}: "eopf", \u2130: "Escr", \u{1D508}: "Efr", \u{1D53C}: "Eopf", \u00E9: "eacute", \u00C9: "Eacute", \u00E8: "egrave", \u00C8: "Egrave", \u00EA: "ecirc", \u00CA: "Ecirc", \u011B: "ecaron", \u011A: "Ecaron", \u00EB: "euml", \u00CB: "Euml", \u0117: "edot", \u0116: "Edot", \u0119: "eogon", \u0118: "Eogon", \u0113: "emacr", \u0112: "Emacr", \u{1D523}: "ffr", \u{1D557}: "fopf", \u{1D4BB}: "fscr", \u{1D509}: "Ffr", \u{1D53D}: "Fopf", \u2131: "Fscr", \uFB00: "fflig", \uFB03: "ffilig", \uFB04: "ffllig", \uFB01: "filig", fj: "fjlig", \uFB02: "fllig", \u0192: "fnof", \u210A: "gscr", \u{1D558}: "gopf", \u{1D524}: "gfr", \u{1D4A2}: "Gscr", \u{1D53E}: "Gopf", \u{1D50A}: "Gfr", \u01F5: "gacute", \u011F: "gbreve", \u011E: "Gbreve", \u011D: "gcirc", \u011C: "Gcirc", \u0121: "gdot", \u0120: "Gdot", \u0122: "Gcedil", \u{1D525}: "hfr", \u210E: "planckh", \u{1D4BD}: "hscr", \u{1D559}: "hopf", \u210B: "Hscr", \u210C: "Hfr", \u210D: "Hopf", \u0125: "hcirc", \u0124: "Hcirc", \u210F: "hbar", \u0127: "hstrok", \u0126: "Hstrok", \u{1D55A}: "iopf", \u{1D526}: "ifr", \u{1D4BE}: "iscr", \u2148: "ii", \u{1D540}: "Iopf", \u2110: "Iscr", \u2111: "Im", \u00ED: "iacute", \u00CD: "Iacute", \u00EC: "igrave", \u00CC: "Igrave", \u00EE: "icirc", \u00CE: "Icirc", \u00EF: "iuml", \u00CF: "Iuml", \u0129: "itilde", \u0128: "Itilde", \u0130: "Idot", \u012F: "iogon", \u012E: "Iogon", \u012B: "imacr", \u012A: "Imacr", \u0133: "ijlig", \u0132: "IJlig", \u0131: "imath", \u{1D4BF}: "jscr", \u{1D55B}: "jopf", \u{1D527}: "jfr", \u{1D4A5}: "Jscr", \u{1D50D}: "Jfr", \u{1D541}: "Jopf", \u0135: "jcirc", \u0134: "Jcirc", \u0237: "jmath", \u{1D55C}: "kopf", \u{1D4C0}: "kscr", \u{1D528}: "kfr", \u{1D4A6}: "Kscr", \u{1D542}: "Kopf", \u{1D50E}: "Kfr", \u0137: "kcedil", \u0136: "Kcedil", \u{1D529}: "lfr", \u{1D4C1}: "lscr", \u2113: "ell", \u{1D55D}: "lopf", \u2112: "Lscr", \u{1D50F}: "Lfr", \u{1D543}: "Lopf", \u013A: "lacute", \u0139: "Lacute", \u013E: "lcaron", \u013D: "Lcaron", \u013C: "lcedil", \u013B: "Lcedil", \u0142: "lstrok", \u0141: "Lstrok", \u0140: "lmidot", \u013F: "Lmidot", \u{1D52A}: "mfr", \u{1D55E}: "mopf", \u{1D4C2}: "mscr", \u{1D510}: "Mfr", \u{1D544}: "Mopf", \u2133: "Mscr", \u{1D52B}: "nfr", \u{1D55F}: "nopf", \u{1D4C3}: "nscr", \u2115: "Nopf", \u{1D4A9}: "Nscr", \u{1D511}: "Nfr", \u0144: "nacute", \u0143: "Nacute", \u0148: "ncaron", \u0147: "Ncaron", \u00F1: "ntilde", \u00D1: "Ntilde", \u0146: "ncedil", \u0145: "Ncedil", "\u2116": "numero", \u014B: "eng", \u014A: "ENG", \u{1D560}: "oopf", \u{1D52C}: "ofr", \u2134: "oscr", \u{1D4AA}: "Oscr", \u{1D512}: "Ofr", \u{1D546}: "Oopf", \u00BA: "ordm", \u00F3: "oacute", \u00D3: "Oacute", \u00F2: "ograve", \u00D2: "Ograve", \u00F4: "ocirc", \u00D4: "Ocirc", \u00F6: "ouml", \u00D6: "Ouml", \u0151: "odblac", \u0150: "Odblac", \u00F5: "otilde", \u00D5: "Otilde", \u00F8: "oslash", \u00D8: "Oslash", \u014D: "omacr", \u014C: "Omacr", \u0153: "oelig", \u0152: "OElig", \u{1D52D}: "pfr", \u{1D4C5}: "pscr", \u{1D561}: "popf", \u2119: "Popf", \u{1D513}: "Pfr", \u{1D4AB}: "Pscr", \u{1D562}: "qopf", \u{1D52E}: "qfr", \u{1D4C6}: "qscr", \u{1D4AC}: "Qscr", \u{1D514}: "Qfr", \u211A: "Qopf", \u0138: "kgreen", \u{1D52F}: "rfr", \u{1D563}: "ropf", \u{1D4C7}: "rscr", \u211B: "Rscr", \u211C: "Re", \u211D: "Ropf", \u0155: "racute", \u0154: "Racute", \u0159: "rcaron", \u0158: "Rcaron", \u0157: "rcedil", \u0156: "Rcedil", \u{1D564}: "sopf", \u{1D4C8}: "sscr", \u{1D530}: "sfr", \u{1D54A}: "Sopf", \u{1D516}: "Sfr", \u{1D4AE}: "Sscr", "\u24C8": "oS", \u015B: "sacute", \u015A: "Sacute", \u015D: "scirc", \u015C: "Scirc", \u0161: "scaron", \u0160: "Scaron", \u015F: "scedil", \u015E: "Scedil", \u00DF: "szlig", \u{1D531}: "tfr", \u{1D4C9}: "tscr", \u{1D565}: "topf", \u{1D4AF}: "Tscr", \u{1D517}: "Tfr", \u{1D54B}: "Topf", \u0165: "tcaron", \u0164: "Tcaron", \u0163: "tcedil", \u0162: "Tcedil", "\u2122": "trade", \u0167: "tstrok", \u0166: "Tstrok", \u{1D4CA}: "uscr", \u{1D566}: "uopf", \u{1D532}: "ufr", \u{1D54C}: "Uopf", \u{1D518}: "Ufr", \u{1D4B0}: "Uscr", \u00FA: "uacute", \u00DA: "Uacute", \u00F9: "ugrave", \u00D9: "Ugrave", \u016D: "ubreve", \u016C: "Ubreve", \u00FB: "ucirc", \u00DB: "Ucirc", \u016F: "uring", \u016E: "Uring", \u00FC: "uuml", \u00DC: "Uuml", \u0171: "udblac", \u0170: "Udblac", \u0169: "utilde", \u0168: "Utilde", \u0173: "uogon", \u0172: "Uogon", \u016B: "umacr", \u016A: "Umacr", \u{1D533}: "vfr", \u{1D567}: "vopf", \u{1D4CB}: "vscr", \u{1D519}: "Vfr", \u{1D54D}: "Vopf", \u{1D4B1}: "Vscr", \u{1D568}: "wopf", \u{1D4CC}: "wscr", \u{1D534}: "wfr", \u{1D4B2}: "Wscr", \u{1D54E}: "Wopf", \u{1D51A}: "Wfr", \u0175: "wcirc", \u0174: "Wcirc", \u{1D535}: "xfr", \u{1D4CD}: "xscr", \u{1D569}: "xopf", \u{1D54F}: "Xopf", \u{1D51B}: "Xfr", \u{1D4B3}: "Xscr", \u{1D536}: "yfr", \u{1D4CE}: "yscr", \u{1D56A}: "yopf", \u{1D4B4}: "Yscr", \u{1D51C}: "Yfr", \u{1D550}: "Yopf", \u00FD: "yacute", \u00DD: "Yacute", \u0177: "ycirc", \u0176: "Ycirc", \u00FF: "yuml", \u0178: "Yuml", \u{1D4CF}: "zscr", \u{1D537}: "zfr", \u{1D56B}: "zopf", \u2128: "Zfr", \u2124: "Zopf", \u{1D4B5}: "Zscr", \u017A: "zacute", \u0179: "Zacute", \u017E: "zcaron", \u017D: "Zcaron", \u017C: "zdot", \u017B: "Zdot", \u01B5: "imped", \u00FE: "thorn", \u00DE: "THORN", \u0149: "napos", \u03B1: "alpha", \u0391: "Alpha", \u03B2: "beta", \u0392: "Beta", \u03B3: "gamma", \u0393: "Gamma", \u03B4: "delta", \u0394: "Delta", \u03B5: "epsi", \u03F5: "epsiv", \u0395: "Epsilon", \u03DD: "gammad", \u03DC: "Gammad", \u03B6: "zeta", \u0396: "Zeta", \u03B7: "eta", \u0397: "Eta", \u03B8: "theta", \u03D1: "thetav", \u0398: "Theta", \u03B9: "iota", \u0399: "Iota", \u03BA: "kappa", \u03F0: "kappav", \u039A: "Kappa", \u03BB: "lambda", \u039B: "Lambda", \u03BC: "mu", \u00B5: "micro", \u039C: "Mu", \u03BD: "nu", \u039D: "Nu", \u03BE: "xi", \u039E: "Xi", \u03BF: "omicron", \u039F: "Omicron", \u03C0: "pi", \u03D6: "piv", \u03A0: "Pi", \u03C1: "rho", \u03F1: "rhov", \u03A1: "Rho", \u03C3: "sigma", \u03A3: "Sigma", \u03C2: "sigmaf", \u03C4: "tau", \u03A4: "Tau", \u03C5: "upsi", \u03A5: "Upsilon", \u03D2: "Upsi", \u03C6: "phi", \u03D5: "phiv", \u03A6: "Phi", \u03C7: "chi", \u03A7: "Chi", \u03C8: "psi", \u03A8: "Psi", \u03C9: "omega", \u03A9: "ohm", \u0430: "acy", \u0410: "Acy", \u0431: "bcy", \u0411: "Bcy", \u0432: "vcy", \u0412: "Vcy", \u0433: "gcy", \u0413: "Gcy", \u0453: "gjcy", \u0403: "GJcy", \u0434: "dcy", \u0414: "Dcy", \u0452: "djcy", \u0402: "DJcy", \u0435: "iecy", \u0415: "IEcy", \u0451: "iocy", \u0401: "IOcy", \u0454: "jukcy", \u0404: "Jukcy", \u0436: "zhcy", \u0416: "ZHcy", \u0437: "zcy", \u0417: "Zcy", \u0455: "dscy", \u0405: "DScy", \u0438: "icy", \u0418: "Icy", \u0456: "iukcy", \u0406: "Iukcy", \u0457: "yicy", \u0407: "YIcy", \u0439: "jcy", \u0419: "Jcy", \u0458: "jsercy", \u0408: "Jsercy", \u043A: "kcy", \u041A: "Kcy", \u045C: "kjcy", \u040C: "KJcy", \u043B: "lcy", \u041B: "Lcy", \u0459: "ljcy", \u0409: "LJcy", \u043C: "mcy", \u041C: "Mcy", \u043D: "ncy", \u041D: "Ncy", \u045A: "njcy", \u040A: "NJcy", \u043E: "ocy", \u041E: "Ocy", \u043F: "pcy", \u041F: "Pcy", \u0440: "rcy", \u0420: "Rcy", \u0441: "scy", \u0421: "Scy", \u0442: "tcy", \u0422: "Tcy", \u045B: "tshcy", \u040B: "TSHcy", \u0443: "ucy", \u0423: "Ucy", \u045E: "ubrcy", \u040E: "Ubrcy", \u0444: "fcy", \u0424: "Fcy", \u0445: "khcy", \u0425: "KHcy", \u0446: "tscy", \u0426: "TScy", \u0447: "chcy", \u0427: "CHcy", \u045F: "dzcy", \u040F: "DZcy", \u0448: "shcy", \u0428: "SHcy", \u0449: "shchcy", \u0429: "SHCHcy", \u044A: "hardcy", \u042A: "HARDcy", \u044B: "ycy", \u042B: "Ycy", \u044C: "softcy", \u042C: "SOFTcy", \u044D: "ecy", \u042D: "Ecy", \u044E: "yucy", \u042E: "YUcy", \u044F: "yacy", \u042F: "YAcy", \u2135: "aleph", \u2136: "beth", \u2137: "gimel", \u2138: "daleth"};
      var regexEscape = /["&'<>`]/g;
      var escapeMap = {
        '"': "&quot;",
        "&": "&amp;",
        "'": "&#x27;",
        "<": "&lt;",
        ">": "&gt;",
        "`": "&#x60;"
      };
      var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
      var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
      var decodeMap = {aacute: "\xE1", Aacute: "\xC1", abreve: "\u0103", Abreve: "\u0102", ac: "\u223E", acd: "\u223F", acE: "\u223E\u0333", acirc: "\xE2", Acirc: "\xC2", acute: "\xB4", acy: "\u0430", Acy: "\u0410", aelig: "\xE6", AElig: "\xC6", af: "\u2061", afr: "\u{1D51E}", Afr: "\u{1D504}", agrave: "\xE0", Agrave: "\xC0", alefsym: "\u2135", aleph: "\u2135", alpha: "\u03B1", Alpha: "\u0391", amacr: "\u0101", Amacr: "\u0100", amalg: "\u2A3F", amp: "&", AMP: "&", and: "\u2227", And: "\u2A53", andand: "\u2A55", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A", ang: "\u2220", ange: "\u29A4", angle: "\u2220", angmsd: "\u2221", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angrt: "\u221F", angrtvb: "\u22BE", angrtvbd: "\u299D", angsph: "\u2222", angst: "\xC5", angzarr: "\u237C", aogon: "\u0105", Aogon: "\u0104", aopf: "\u{1D552}", Aopf: "\u{1D538}", ap: "\u2248", apacir: "\u2A6F", ape: "\u224A", apE: "\u2A70", apid: "\u224B", apos: "'", ApplyFunction: "\u2061", approx: "\u2248", approxeq: "\u224A", aring: "\xE5", Aring: "\xC5", ascr: "\u{1D4B6}", Ascr: "\u{1D49C}", Assign: "\u2254", ast: "*", asymp: "\u2248", asympeq: "\u224D", atilde: "\xE3", Atilde: "\xC3", auml: "\xE4", Auml: "\xC4", awconint: "\u2233", awint: "\u2A11", backcong: "\u224C", backepsilon: "\u03F6", backprime: "\u2035", backsim: "\u223D", backsimeq: "\u22CD", Backslash: "\u2216", Barv: "\u2AE7", barvee: "\u22BD", barwed: "\u2305", Barwed: "\u2306", barwedge: "\u2305", bbrk: "\u23B5", bbrktbrk: "\u23B6", bcong: "\u224C", bcy: "\u0431", Bcy: "\u0411", bdquo: "\u201E", becaus: "\u2235", because: "\u2235", Because: "\u2235", bemptyv: "\u29B0", bepsi: "\u03F6", bernou: "\u212C", Bernoullis: "\u212C", beta: "\u03B2", Beta: "\u0392", beth: "\u2136", between: "\u226C", bfr: "\u{1D51F}", Bfr: "\u{1D505}", bigcap: "\u22C2", bigcirc: "\u25EF", bigcup: "\u22C3", bigodot: "\u2A00", bigoplus: "\u2A01", bigotimes: "\u2A02", bigsqcup: "\u2A06", bigstar: "\u2605", bigtriangledown: "\u25BD", bigtriangleup: "\u25B3", biguplus: "\u2A04", bigvee: "\u22C1", bigwedge: "\u22C0", bkarow: "\u290D", blacklozenge: "\u29EB", blacksquare: "\u25AA", blacktriangle: "\u25B4", blacktriangledown: "\u25BE", blacktriangleleft: "\u25C2", blacktriangleright: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588", bne: "=\u20E5", bnequiv: "\u2261\u20E5", bnot: "\u2310", bNot: "\u2AED", bopf: "\u{1D553}", Bopf: "\u{1D539}", bot: "\u22A5", bottom: "\u22A5", bowtie: "\u22C8", boxbox: "\u29C9", boxdl: "\u2510", boxdL: "\u2555", boxDl: "\u2556", boxDL: "\u2557", boxdr: "\u250C", boxdR: "\u2552", boxDr: "\u2553", boxDR: "\u2554", boxh: "\u2500", boxH: "\u2550", boxhd: "\u252C", boxhD: "\u2565", boxHd: "\u2564", boxHD: "\u2566", boxhu: "\u2534", boxhU: "\u2568", boxHu: "\u2567", boxHU: "\u2569", boxminus: "\u229F", boxplus: "\u229E", boxtimes: "\u22A0", boxul: "\u2518", boxuL: "\u255B", boxUl: "\u255C", boxUL: "\u255D", boxur: "\u2514", boxuR: "\u2558", boxUr: "\u2559", boxUR: "\u255A", boxv: "\u2502", boxV: "\u2551", boxvh: "\u253C", boxvH: "\u256A", boxVh: "\u256B", boxVH: "\u256C", boxvl: "\u2524", boxvL: "\u2561", boxVl: "\u2562", boxVL: "\u2563", boxvr: "\u251C", boxvR: "\u255E", boxVr: "\u255F", boxVR: "\u2560", bprime: "\u2035", breve: "\u02D8", Breve: "\u02D8", brvbar: "\xA6", bscr: "\u{1D4B7}", Bscr: "\u212C", bsemi: "\u204F", bsim: "\u223D", bsime: "\u22CD", bsol: "\\", bsolb: "\u29C5", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\u2022", bump: "\u224E", bumpe: "\u224F", bumpE: "\u2AAE", bumpeq: "\u224F", Bumpeq: "\u224E", cacute: "\u0107", Cacute: "\u0106", cap: "\u2229", Cap: "\u22D2", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", capcup: "\u2A47", capdot: "\u2A40", CapitalDifferentialD: "\u2145", caps: "\u2229\uFE00", caret: "\u2041", caron: "\u02C7", Cayleys: "\u212D", ccaps: "\u2A4D", ccaron: "\u010D", Ccaron: "\u010C", ccedil: "\xE7", Ccedil: "\xC7", ccirc: "\u0109", Ccirc: "\u0108", Cconint: "\u2230", ccups: "\u2A4C", ccupssm: "\u2A50", cdot: "\u010B", Cdot: "\u010A", cedil: "\xB8", Cedilla: "\xB8", cemptyv: "\u29B2", cent: "\xA2", centerdot: "\xB7", CenterDot: "\xB7", cfr: "\u{1D520}", Cfr: "\u212D", chcy: "\u0447", CHcy: "\u0427", check: "\u2713", checkmark: "\u2713", chi: "\u03C7", Chi: "\u03A7", cir: "\u25CB", circ: "\u02C6", circeq: "\u2257", circlearrowleft: "\u21BA", circlearrowright: "\u21BB", circledast: "\u229B", circledcirc: "\u229A", circleddash: "\u229D", CircleDot: "\u2299", circledR: "\xAE", circledS: "\u24C8", CircleMinus: "\u2296", CirclePlus: "\u2295", CircleTimes: "\u2297", cire: "\u2257", cirE: "\u29C3", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", ClockwiseContourIntegral: "\u2232", CloseCurlyDoubleQuote: "\u201D", CloseCurlyQuote: "\u2019", clubs: "\u2663", clubsuit: "\u2663", colon: ":", Colon: "\u2237", colone: "\u2254", Colone: "\u2A74", coloneq: "\u2254", comma: ",", commat: "@", comp: "\u2201", compfn: "\u2218", complement: "\u2201", complexes: "\u2102", cong: "\u2245", congdot: "\u2A6D", Congruent: "\u2261", conint: "\u222E", Conint: "\u222F", ContourIntegral: "\u222E", copf: "\u{1D554}", Copf: "\u2102", coprod: "\u2210", Coproduct: "\u2210", copy: "\xA9", COPY: "\xA9", copysr: "\u2117", CounterClockwiseContourIntegral: "\u2233", crarr: "\u21B5", cross: "\u2717", Cross: "\u2A2F", cscr: "\u{1D4B8}", Cscr: "\u{1D49E}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935", cuepr: "\u22DE", cuesc: "\u22DF", cularr: "\u21B6", cularrp: "\u293D", cup: "\u222A", Cup: "\u22D3", cupbrcap: "\u2A48", cupcap: "\u2A46", CupCap: "\u224D", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7", curarrm: "\u293C", curlyeqprec: "\u22DE", curlyeqsucc: "\u22DF", curlyvee: "\u22CE", curlywedge: "\u22CF", curren: "\xA4", curvearrowleft: "\u21B6", curvearrowright: "\u21B7", cuvee: "\u22CE", cuwed: "\u22CF", cwconint: "\u2232", cwint: "\u2231", cylcty: "\u232D", dagger: "\u2020", Dagger: "\u2021", daleth: "\u2138", darr: "\u2193", dArr: "\u21D3", Darr: "\u21A1", dash: "\u2010", dashv: "\u22A3", Dashv: "\u2AE4", dbkarow: "\u290F", dblac: "\u02DD", dcaron: "\u010F", Dcaron: "\u010E", dcy: "\u0434", Dcy: "\u0414", dd: "\u2146", DD: "\u2145", ddagger: "\u2021", ddarr: "\u21CA", DDotrahd: "\u2911", ddotseq: "\u2A77", deg: "\xB0", Del: "\u2207", delta: "\u03B4", Delta: "\u0394", demptyv: "\u29B1", dfisht: "\u297F", dfr: "\u{1D521}", Dfr: "\u{1D507}", dHar: "\u2965", dharl: "\u21C3", dharr: "\u21C2", DiacriticalAcute: "\xB4", DiacriticalDot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", DiacriticalGrave: "`", DiacriticalTilde: "\u02DC", diam: "\u22C4", diamond: "\u22C4", Diamond: "\u22C4", diamondsuit: "\u2666", diams: "\u2666", die: "\xA8", DifferentialD: "\u2146", digamma: "\u03DD", disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", djcy: "\u0452", DJcy: "\u0402", dlcorn: "\u231E", dlcrop: "\u230D", dollar: "$", dopf: "\u{1D555}", Dopf: "\u{1D53B}", dot: "\u02D9", Dot: "\xA8", DotDot: "\u20DC", doteq: "\u2250", doteqdot: "\u2251", DotEqual: "\u2250", dotminus: "\u2238", dotplus: "\u2214", dotsquare: "\u22A1", doublebarwedge: "\u2306", DoubleContourIntegral: "\u222F", DoubleDot: "\xA8", DoubleDownArrow: "\u21D3", DoubleLeftArrow: "\u21D0", DoubleLeftRightArrow: "\u21D4", DoubleLeftTee: "\u2AE4", DoubleLongLeftArrow: "\u27F8", DoubleLongLeftRightArrow: "\u27FA", DoubleLongRightArrow: "\u27F9", DoubleRightArrow: "\u21D2", DoubleRightTee: "\u22A8", DoubleUpArrow: "\u21D1", DoubleUpDownArrow: "\u21D5", DoubleVerticalBar: "\u2225", downarrow: "\u2193", Downarrow: "\u21D3", DownArrow: "\u2193", DownArrowBar: "\u2913", DownArrowUpArrow: "\u21F5", DownBreve: "\u0311", downdownarrows: "\u21CA", downharpoonleft: "\u21C3", downharpoonright: "\u21C2", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVector: "\u21BD", DownLeftVectorBar: "\u2956", DownRightTeeVector: "\u295F", DownRightVector: "\u21C1", DownRightVectorBar: "\u2957", DownTee: "\u22A4", DownTeeArrow: "\u21A7", drbkarow: "\u2910", drcorn: "\u231F", drcrop: "\u230C", dscr: "\u{1D4B9}", Dscr: "\u{1D49F}", dscy: "\u0455", DScy: "\u0405", dsol: "\u29F6", dstrok: "\u0111", Dstrok: "\u0110", dtdot: "\u22F1", dtri: "\u25BF", dtrif: "\u25BE", duarr: "\u21F5", duhar: "\u296F", dwangle: "\u29A6", dzcy: "\u045F", DZcy: "\u040F", dzigrarr: "\u27FF", eacute: "\xE9", Eacute: "\xC9", easter: "\u2A6E", ecaron: "\u011B", Ecaron: "\u011A", ecir: "\u2256", ecirc: "\xEA", Ecirc: "\xCA", ecolon: "\u2255", ecy: "\u044D", Ecy: "\u042D", eDDot: "\u2A77", edot: "\u0117", eDot: "\u2251", Edot: "\u0116", ee: "\u2147", efDot: "\u2252", efr: "\u{1D522}", Efr: "\u{1D508}", eg: "\u2A9A", egrave: "\xE8", Egrave: "\xC8", egs: "\u2A96", egsdot: "\u2A98", el: "\u2A99", Element: "\u2208", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", elsdot: "\u2A97", emacr: "\u0113", Emacr: "\u0112", empty: "\u2205", emptyset: "\u2205", EmptySmallSquare: "\u25FB", emptyv: "\u2205", EmptyVerySmallSquare: "\u25AB", emsp: "\u2003", emsp13: "\u2004", emsp14: "\u2005", eng: "\u014B", ENG: "\u014A", ensp: "\u2002", eogon: "\u0119", Eogon: "\u0118", eopf: "\u{1D556}", Eopf: "\u{1D53C}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", epsilon: "\u03B5", Epsilon: "\u0395", epsiv: "\u03F5", eqcirc: "\u2256", eqcolon: "\u2255", eqsim: "\u2242", eqslantgtr: "\u2A96", eqslantless: "\u2A95", Equal: "\u2A75", equals: "=", EqualTilde: "\u2242", equest: "\u225F", Equilibrium: "\u21CC", equiv: "\u2261", equivDD: "\u2A78", eqvparsl: "\u29E5", erarr: "\u2971", erDot: "\u2253", escr: "\u212F", Escr: "\u2130", esdot: "\u2250", esim: "\u2242", Esim: "\u2A73", eta: "\u03B7", Eta: "\u0397", eth: "\xF0", ETH: "\xD0", euml: "\xEB", Euml: "\xCB", euro: "\u20AC", excl: "!", exist: "\u2203", Exists: "\u2203", expectation: "\u2130", exponentiale: "\u2147", ExponentialE: "\u2147", fallingdotseq: "\u2252", fcy: "\u0444", Fcy: "\u0424", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", ffr: "\u{1D523}", Ffr: "\u{1D509}", filig: "\uFB01", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", fjlig: "fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", fopf: "\u{1D557}", Fopf: "\u{1D53D}", forall: "\u2200", ForAll: "\u2200", fork: "\u22D4", forkv: "\u2AD9", Fouriertrf: "\u2131", fpartint: "\u2A0D", frac12: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\u215E", frasl: "\u2044", frown: "\u2322", fscr: "\u{1D4BB}", Fscr: "\u2131", gacute: "\u01F5", gamma: "\u03B3", Gamma: "\u0393", gammad: "\u03DD", Gammad: "\u03DC", gap: "\u2A86", gbreve: "\u011F", Gbreve: "\u011E", Gcedil: "\u0122", gcirc: "\u011D", Gcirc: "\u011C", gcy: "\u0433", Gcy: "\u0413", gdot: "\u0121", Gdot: "\u0120", ge: "\u2265", gE: "\u2267", gel: "\u22DB", gEl: "\u2A8C", geq: "\u2265", geqq: "\u2267", geqslant: "\u2A7E", ges: "\u2A7E", gescc: "\u2AA9", gesdot: "\u2A80", gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", gfr: "\u{1D524}", Gfr: "\u{1D50A}", gg: "\u226B", Gg: "\u22D9", ggg: "\u22D9", gimel: "\u2137", gjcy: "\u0453", GJcy: "\u0403", gl: "\u2277", gla: "\u2AA5", glE: "\u2A92", glj: "\u2AA4", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gnE: "\u2269", gneq: "\u2A88", gneqq: "\u2269", gnsim: "\u22E7", gopf: "\u{1D558}", Gopf: "\u{1D53E}", grave: "`", GreaterEqual: "\u2265", GreaterEqualLess: "\u22DB", GreaterFullEqual: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", GreaterSlantEqual: "\u2A7E", GreaterTilde: "\u2273", gscr: "\u210A", Gscr: "\u{1D4A2}", gsim: "\u2273", gsime: "\u2A8E", gsiml: "\u2A90", gt: ">", Gt: "\u226B", GT: ">", gtcc: "\u2AA7", gtcir: "\u2A7A", gtdot: "\u22D7", gtlPar: "\u2995", gtquest: "\u2A7C", gtrapprox: "\u2A86", gtrarr: "\u2978", gtrdot: "\u22D7", gtreqless: "\u22DB", gtreqqless: "\u2A8C", gtrless: "\u2277", gtrsim: "\u2273", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", Hacek: "\u02C7", hairsp: "\u200A", half: "\xBD", hamilt: "\u210B", hardcy: "\u044A", HARDcy: "\u042A", harr: "\u2194", hArr: "\u21D4", harrcir: "\u2948", harrw: "\u21AD", Hat: "^", hbar: "\u210F", hcirc: "\u0125", Hcirc: "\u0124", hearts: "\u2665", heartsuit: "\u2665", hellip: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", Hfr: "\u210C", HilbertSpace: "\u210B", hksearow: "\u2925", hkswarow: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", hookrightarrow: "\u21AA", hopf: "\u{1D559}", Hopf: "\u210D", horbar: "\u2015", HorizontalLine: "\u2500", hscr: "\u{1D4BD}", Hscr: "\u210B", hslash: "\u210F", hstrok: "\u0127", Hstrok: "\u0126", HumpDownHump: "\u224E", HumpEqual: "\u224F", hybull: "\u2043", hyphen: "\u2010", iacute: "\xED", Iacute: "\xCD", ic: "\u2063", icirc: "\xEE", Icirc: "\xCE", icy: "\u0438", Icy: "\u0418", Idot: "\u0130", iecy: "\u0435", IEcy: "\u0415", iexcl: "\xA1", iff: "\u21D4", ifr: "\u{1D526}", Ifr: "\u2111", igrave: "\xEC", Igrave: "\xCC", ii: "\u2148", iiiint: "\u2A0C", iiint: "\u222D", iinfin: "\u29DC", iiota: "\u2129", ijlig: "\u0133", IJlig: "\u0132", Im: "\u2111", imacr: "\u012B", Imacr: "\u012A", image: "\u2111", ImaginaryI: "\u2148", imagline: "\u2110", imagpart: "\u2111", imath: "\u0131", imof: "\u22B7", imped: "\u01B5", Implies: "\u21D2", in: "\u2208", incare: "\u2105", infin: "\u221E", infintie: "\u29DD", inodot: "\u0131", int: "\u222B", Int: "\u222C", intcal: "\u22BA", integers: "\u2124", Integral: "\u222B", intercal: "\u22BA", Intersection: "\u22C2", intlarhk: "\u2A17", intprod: "\u2A3C", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", iocy: "\u0451", IOcy: "\u0401", iogon: "\u012F", Iogon: "\u012E", iopf: "\u{1D55A}", Iopf: "\u{1D540}", iota: "\u03B9", Iota: "\u0399", iprod: "\u2A3C", iquest: "\xBF", iscr: "\u{1D4BE}", Iscr: "\u2110", isin: "\u2208", isindot: "\u22F5", isinE: "\u22F9", isins: "\u22F4", isinsv: "\u22F3", isinv: "\u2208", it: "\u2062", itilde: "\u0129", Itilde: "\u0128", iukcy: "\u0456", Iukcy: "\u0406", iuml: "\xEF", Iuml: "\xCF", jcirc: "\u0135", Jcirc: "\u0134", jcy: "\u0439", Jcy: "\u0419", jfr: "\u{1D527}", Jfr: "\u{1D50D}", jmath: "\u0237", jopf: "\u{1D55B}", Jopf: "\u{1D541}", jscr: "\u{1D4BF}", Jscr: "\u{1D4A5}", jsercy: "\u0458", Jsercy: "\u0408", jukcy: "\u0454", Jukcy: "\u0404", kappa: "\u03BA", Kappa: "\u039A", kappav: "\u03F0", kcedil: "\u0137", Kcedil: "\u0136", kcy: "\u043A", Kcy: "\u041A", kfr: "\u{1D528}", Kfr: "\u{1D50E}", kgreen: "\u0138", khcy: "\u0445", KHcy: "\u0425", kjcy: "\u045C", KJcy: "\u040C", kopf: "\u{1D55C}", Kopf: "\u{1D542}", kscr: "\u{1D4C0}", Kscr: "\u{1D4A6}", lAarr: "\u21DA", lacute: "\u013A", Lacute: "\u0139", laemptyv: "\u29B4", lagran: "\u2112", lambda: "\u03BB", Lambda: "\u039B", lang: "\u27E8", Lang: "\u27EA", langd: "\u2991", langle: "\u27E8", lap: "\u2A85", Laplacetrf: "\u2112", laquo: "\xAB", larr: "\u2190", lArr: "\u21D0", Larr: "\u219E", larrb: "\u21E4", larrbfs: "\u291F", larrfs: "\u291D", larrhk: "\u21A9", larrlp: "\u21AB", larrpl: "\u2939", larrsim: "\u2973", larrtl: "\u21A2", lat: "\u2AAB", latail: "\u2919", lAtail: "\u291B", late: "\u2AAD", lates: "\u2AAD\uFE00", lbarr: "\u290C", lBarr: "\u290E", lbbrk: "\u2772", lbrace: "{", lbrack: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", lcaron: "\u013E", Lcaron: "\u013D", lcedil: "\u013C", Lcedil: "\u013B", lceil: "\u2308", lcub: "{", lcy: "\u043B", Lcy: "\u041B", ldca: "\u2936", ldquo: "\u201C", ldquor: "\u201E", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", lE: "\u2266", LeftAngleBracket: "\u27E8", leftarrow: "\u2190", Leftarrow: "\u21D0", LeftArrow: "\u2190", LeftArrowBar: "\u21E4", LeftArrowRightArrow: "\u21C6", leftarrowtail: "\u21A2", LeftCeiling: "\u2308", LeftDoubleBracket: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVector: "\u21C3", LeftDownVectorBar: "\u2959", LeftFloor: "\u230A", leftharpoondown: "\u21BD", leftharpoonup: "\u21BC", leftleftarrows: "\u21C7", leftrightarrow: "\u2194", Leftrightarrow: "\u21D4", LeftRightArrow: "\u2194", leftrightarrows: "\u21C6", leftrightharpoons: "\u21CB", leftrightsquigarrow: "\u21AD", LeftRightVector: "\u294E", LeftTee: "\u22A3", LeftTeeArrow: "\u21A4", LeftTeeVector: "\u295A", leftthreetimes: "\u22CB", LeftTriangle: "\u22B2", LeftTriangleBar: "\u29CF", LeftTriangleEqual: "\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVector: "\u21BF", LeftUpVectorBar: "\u2958", LeftVector: "\u21BC", LeftVectorBar: "\u2952", leg: "\u22DA", lEg: "\u2A8B", leq: "\u2264", leqq: "\u2266", leqslant: "\u2A7D", les: "\u2A7D", lescc: "\u2AA8", lesdot: "\u2A7F", lesdoto: "\u2A81", lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessapprox: "\u2A85", lessdot: "\u22D6", lesseqgtr: "\u22DA", lesseqqgtr: "\u2A8B", LessEqualGreater: "\u22DA", LessFullEqual: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", LessLess: "\u2AA1", lesssim: "\u2272", LessSlantEqual: "\u2A7D", LessTilde: "\u2272", lfisht: "\u297C", lfloor: "\u230A", lfr: "\u{1D529}", Lfr: "\u{1D50F}", lg: "\u2276", lgE: "\u2A91", lHar: "\u2962", lhard: "\u21BD", lharu: "\u21BC", lharul: "\u296A", lhblk: "\u2584", ljcy: "\u0459", LJcy: "\u0409", ll: "\u226A", Ll: "\u22D8", llarr: "\u21C7", llcorner: "\u231E", Lleftarrow: "\u21DA", llhard: "\u296B", lltri: "\u25FA", lmidot: "\u0140", Lmidot: "\u013F", lmoust: "\u23B0", lmoustache: "\u23B0", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lnE: "\u2268", lneq: "\u2A87", lneqq: "\u2268", lnsim: "\u22E6", loang: "\u27EC", loarr: "\u21FD", lobrk: "\u27E6", longleftarrow: "\u27F5", Longleftarrow: "\u27F8", LongLeftArrow: "\u27F5", longleftrightarrow: "\u27F7", Longleftrightarrow: "\u27FA", LongLeftRightArrow: "\u27F7", longmapsto: "\u27FC", longrightarrow: "\u27F6", Longrightarrow: "\u27F9", LongRightArrow: "\u27F6", looparrowleft: "\u21AB", looparrowright: "\u21AC", lopar: "\u2985", lopf: "\u{1D55D}", Lopf: "\u{1D543}", loplus: "\u2A2D", lotimes: "\u2A34", lowast: "\u2217", lowbar: "_", LowerLeftArrow: "\u2199", LowerRightArrow: "\u2198", loz: "\u25CA", lozenge: "\u25CA", lozf: "\u29EB", lpar: "(", lparlt: "\u2993", lrarr: "\u21C6", lrcorner: "\u231F", lrhar: "\u21CB", lrhard: "\u296D", lrm: "\u200E", lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", Lscr: "\u2112", lsh: "\u21B0", Lsh: "\u21B0", lsim: "\u2272", lsime: "\u2A8D", lsimg: "\u2A8F", lsqb: "[", lsquo: "\u2018", lsquor: "\u201A", lstrok: "\u0142", Lstrok: "\u0141", lt: "<", Lt: "\u226A", LT: "<", ltcc: "\u2AA6", ltcir: "\u2A79", ltdot: "\u22D6", lthree: "\u22CB", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltri: "\u25C3", ltrie: "\u22B4", ltrif: "\u25C2", ltrPar: "\u2996", lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", macr: "\xAF", male: "\u2642", malt: "\u2720", maltese: "\u2720", map: "\u21A6", Map: "\u2905", mapsto: "\u21A6", mapstodown: "\u21A7", mapstoleft: "\u21A4", mapstoup: "\u21A5", marker: "\u25AE", mcomma: "\u2A29", mcy: "\u043C", Mcy: "\u041C", mdash: "\u2014", mDDot: "\u223A", measuredangle: "\u2221", MediumSpace: "\u205F", Mellintrf: "\u2133", mfr: "\u{1D52A}", Mfr: "\u{1D510}", mho: "\u2127", micro: "\xB5", mid: "\u2223", midast: "*", midcir: "\u2AF0", middot: "\xB7", minus: "\u2212", minusb: "\u229F", minusd: "\u2238", minusdu: "\u2A2A", MinusPlus: "\u2213", mlcp: "\u2ADB", mldr: "\u2026", mnplus: "\u2213", models: "\u22A7", mopf: "\u{1D55E}", Mopf: "\u{1D544}", mp: "\u2213", mscr: "\u{1D4C2}", Mscr: "\u2133", mstpos: "\u223E", mu: "\u03BC", Mu: "\u039C", multimap: "\u22B8", mumap: "\u22B8", nabla: "\u2207", nacute: "\u0144", Nacute: "\u0143", nang: "\u2220\u20D2", nap: "\u2249", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", napprox: "\u2249", natur: "\u266E", natural: "\u266E", naturals: "\u2115", nbsp: "\xA0", nbump: "\u224E\u0338", nbumpe: "\u224F\u0338", ncap: "\u2A43", ncaron: "\u0148", Ncaron: "\u0147", ncedil: "\u0146", Ncedil: "\u0145", ncong: "\u2247", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", ncy: "\u043D", Ncy: "\u041D", ndash: "\u2013", ne: "\u2260", nearhk: "\u2924", nearr: "\u2197", neArr: "\u21D7", nearrow: "\u2197", nedot: "\u2250\u0338", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", nequiv: "\u2262", nesear: "\u2928", nesim: "\u2242\u0338", NestedGreaterGreater: "\u226B", NestedLessLess: "\u226A", NewLine: "\n", nexist: "\u2204", nexists: "\u2204", nfr: "\u{1D52B}", Nfr: "\u{1D511}", nge: "\u2271", ngE: "\u2267\u0338", ngeq: "\u2271", ngeqq: "\u2267\u0338", ngeqslant: "\u2A7E\u0338", nges: "\u2A7E\u0338", nGg: "\u22D9\u0338", ngsim: "\u2275", ngt: "\u226F", nGt: "\u226B\u20D2", ngtr: "\u226F", nGtv: "\u226B\u0338", nharr: "\u21AE", nhArr: "\u21CE", nhpar: "\u2AF2", ni: "\u220B", nis: "\u22FC", nisd: "\u22FA", niv: "\u220B", njcy: "\u045A", NJcy: "\u040A", nlarr: "\u219A", nlArr: "\u21CD", nldr: "\u2025", nle: "\u2270", nlE: "\u2266\u0338", nleftarrow: "\u219A", nLeftarrow: "\u21CD", nleftrightarrow: "\u21AE", nLeftrightarrow: "\u21CE", nleq: "\u2270", nleqq: "\u2266\u0338", nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", nless: "\u226E", nLl: "\u22D8\u0338", nlsim: "\u2274", nlt: "\u226E", nLt: "\u226A\u20D2", nltri: "\u22EA", nltrie: "\u22EC", nLtv: "\u226A\u0338", nmid: "\u2224", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nopf: "\u{1D55F}", Nopf: "\u2115", not: "\xAC", Not: "\u2AEC", NotCongruent: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", NotElement: "\u2209", NotEqual: "\u2260", NotEqualTilde: "\u2242\u0338", NotExists: "\u2204", NotGreater: "\u226F", NotGreaterEqual: "\u2271", NotGreaterFullEqual: "\u2267\u0338", NotGreaterGreater: "\u226B\u0338", NotGreaterLess: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", NotGreaterTilde: "\u2275", NotHumpDownHump: "\u224E\u0338", NotHumpEqual: "\u224F\u0338", notin: "\u2209", notindot: "\u22F5\u0338", notinE: "\u22F9\u0338", notinva: "\u2209", notinvb: "\u22F7", notinvc: "\u22F6", NotLeftTriangle: "\u22EA", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangleEqual: "\u22EC", NotLess: "\u226E", NotLessEqual: "\u2270", NotLessGreater: "\u2278", NotLessLess: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338", NotLessTilde: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\u2AA1\u0338", notni: "\u220C", notniva: "\u220C", notnivb: "\u22FE", notnivc: "\u22FD", NotPrecedes: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", NotPrecedesSlantEqual: "\u22E0", NotReverseElement: "\u220C", NotRightTriangle: "\u22EB", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangleEqual: "\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\u22E3", NotSubset: "\u2282\u20D2", NotSubsetEqual: "\u2288", NotSucceeds: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", NotSupersetEqual: "\u2289", NotTilde: "\u2241", NotTildeEqual: "\u2244", NotTildeFullEqual: "\u2247", NotTildeTilde: "\u2249", NotVerticalBar: "\u2224", npar: "\u2226", nparallel: "\u2226", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", npr: "\u2280", nprcue: "\u22E0", npre: "\u2AAF\u0338", nprec: "\u2280", npreceq: "\u2AAF\u0338", nrarr: "\u219B", nrArr: "\u21CF", nrarrc: "\u2933\u0338", nrarrw: "\u219D\u0338", nrightarrow: "\u219B", nRightarrow: "\u21CF", nrtri: "\u22EB", nrtrie: "\u22ED", nsc: "\u2281", nsccue: "\u22E1", nsce: "\u2AB0\u0338", nscr: "\u{1D4C3}", Nscr: "\u{1D4A9}", nshortmid: "\u2224", nshortparallel: "\u2226", nsim: "\u2241", nsime: "\u2244", nsimeq: "\u2244", nsmid: "\u2224", nspar: "\u2226", nsqsube: "\u22E2", nsqsupe: "\u22E3", nsub: "\u2284", nsube: "\u2288", nsubE: "\u2AC5\u0338", nsubset: "\u2282\u20D2", nsubseteq: "\u2288", nsubseteqq: "\u2AC5\u0338", nsucc: "\u2281", nsucceq: "\u2AB0\u0338", nsup: "\u2285", nsupe: "\u2289", nsupE: "\u2AC6\u0338", nsupset: "\u2283\u20D2", nsupseteq: "\u2289", nsupseteqq: "\u2AC6\u0338", ntgl: "\u2279", ntilde: "\xF1", Ntilde: "\xD1", ntlg: "\u2278", ntriangleleft: "\u22EA", ntrianglelefteq: "\u22EC", ntriangleright: "\u22EB", ntrianglerighteq: "\u22ED", nu: "\u03BD", Nu: "\u039D", num: "#", numero: "\u2116", numsp: "\u2007", nvap: "\u224D\u20D2", nvdash: "\u22AC", nvDash: "\u22AD", nVdash: "\u22AE", nVDash: "\u22AF", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvHarr: "\u2904", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwarhk: "\u2923", nwarr: "\u2196", nwArr: "\u21D6", nwarrow: "\u2196", nwnear: "\u2927", oacute: "\xF3", Oacute: "\xD3", oast: "\u229B", ocir: "\u229A", ocirc: "\xF4", Ocirc: "\xD4", ocy: "\u043E", Ocy: "\u041E", odash: "\u229D", odblac: "\u0151", Odblac: "\u0150", odiv: "\u2A38", odot: "\u2299", odsold: "\u29BC", oelig: "\u0153", OElig: "\u0152", ofcir: "\u29BF", ofr: "\u{1D52C}", Ofr: "\u{1D512}", ogon: "\u02DB", ograve: "\xF2", Ograve: "\xD2", ogt: "\u29C1", ohbar: "\u29B5", ohm: "\u03A9", oint: "\u222E", olarr: "\u21BA", olcir: "\u29BE", olcross: "\u29BB", oline: "\u203E", olt: "\u29C0", omacr: "\u014D", Omacr: "\u014C", omega: "\u03C9", Omega: "\u03A9", omicron: "\u03BF", Omicron: "\u039F", omid: "\u29B6", ominus: "\u2296", oopf: "\u{1D560}", Oopf: "\u{1D546}", opar: "\u29B7", OpenCurlyDoubleQuote: "\u201C", OpenCurlyQuote: "\u2018", operp: "\u29B9", oplus: "\u2295", or: "\u2228", Or: "\u2A54", orarr: "\u21BB", ord: "\u2A5D", order: "\u2134", orderof: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\u2A57", orv: "\u2A5B", oS: "\u24C8", oscr: "\u2134", Oscr: "\u{1D4AA}", oslash: "\xF8", Oslash: "\xD8", osol: "\u2298", otilde: "\xF5", Otilde: "\xD5", otimes: "\u2297", Otimes: "\u2A37", otimesas: "\u2A36", ouml: "\xF6", Ouml: "\xD6", ovbar: "\u233D", OverBar: "\u203E", OverBrace: "\u23DE", OverBracket: "\u23B4", OverParenthesis: "\u23DC", par: "\u2225", para: "\xB6", parallel: "\u2225", parsim: "\u2AF3", parsl: "\u2AFD", part: "\u2202", PartialD: "\u2202", pcy: "\u043F", Pcy: "\u041F", percnt: "%", period: ".", permil: "\u2030", perp: "\u22A5", pertenk: "\u2031", pfr: "\u{1D52D}", Pfr: "\u{1D513}", phi: "\u03C6", Phi: "\u03A6", phiv: "\u03D5", phmmat: "\u2133", phone: "\u260E", pi: "\u03C0", Pi: "\u03A0", pitchfork: "\u22D4", piv: "\u03D6", planck: "\u210F", planckh: "\u210E", plankv: "\u210F", plus: "+", plusacir: "\u2A23", plusb: "\u229E", pluscir: "\u2A22", plusdo: "\u2214", plusdu: "\u2A25", pluse: "\u2A72", PlusMinus: "\xB1", plusmn: "\xB1", plussim: "\u2A26", plustwo: "\u2A27", pm: "\xB1", Poincareplane: "\u210C", pointint: "\u2A15", popf: "\u{1D561}", Popf: "\u2119", pound: "\xA3", pr: "\u227A", Pr: "\u2ABB", prap: "\u2AB7", prcue: "\u227C", pre: "\u2AAF", prE: "\u2AB3", prec: "\u227A", precapprox: "\u2AB7", preccurlyeq: "\u227C", Precedes: "\u227A", PrecedesEqual: "\u2AAF", PrecedesSlantEqual: "\u227C", PrecedesTilde: "\u227E", preceq: "\u2AAF", precnapprox: "\u2AB9", precneqq: "\u2AB5", precnsim: "\u22E8", precsim: "\u227E", prime: "\u2032", Prime: "\u2033", primes: "\u2119", prnap: "\u2AB9", prnE: "\u2AB5", prnsim: "\u22E8", prod: "\u220F", Product: "\u220F", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prop: "\u221D", Proportion: "\u2237", Proportional: "\u221D", propto: "\u221D", prsim: "\u227E", prurel: "\u22B0", pscr: "\u{1D4C5}", Pscr: "\u{1D4AB}", psi: "\u03C8", Psi: "\u03A8", puncsp: "\u2008", qfr: "\u{1D52E}", Qfr: "\u{1D514}", qint: "\u2A0C", qopf: "\u{1D562}", Qopf: "\u211A", qprime: "\u2057", qscr: "\u{1D4C6}", Qscr: "\u{1D4AC}", quaternions: "\u210D", quatint: "\u2A16", quest: "?", questeq: "\u225F", quot: '"', QUOT: '"', rAarr: "\u21DB", race: "\u223D\u0331", racute: "\u0155", Racute: "\u0154", radic: "\u221A", raemptyv: "\u29B3", rang: "\u27E9", Rang: "\u27EB", rangd: "\u2992", range: "\u29A5", rangle: "\u27E9", raquo: "\xBB", rarr: "\u2192", rArr: "\u21D2", Rarr: "\u21A0", rarrap: "\u2975", rarrb: "\u21E5", rarrbfs: "\u2920", rarrc: "\u2933", rarrfs: "\u291E", rarrhk: "\u21AA", rarrlp: "\u21AC", rarrpl: "\u2945", rarrsim: "\u2974", rarrtl: "\u21A3", Rarrtl: "\u2916", rarrw: "\u219D", ratail: "\u291A", rAtail: "\u291C", ratio: "\u2236", rationals: "\u211A", rbarr: "\u290D", rBarr: "\u290F", RBarr: "\u2910", rbbrk: "\u2773", rbrace: "}", rbrack: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", rcaron: "\u0159", Rcaron: "\u0158", rcedil: "\u0157", Rcedil: "\u0156", rceil: "\u2309", rcub: "}", rcy: "\u0440", Rcy: "\u0420", rdca: "\u2937", rdldhar: "\u2969", rdquo: "\u201D", rdquor: "\u201D", rdsh: "\u21B3", Re: "\u211C", real: "\u211C", realine: "\u211B", realpart: "\u211C", reals: "\u211D", rect: "\u25AD", reg: "\xAE", REG: "\xAE", ReverseElement: "\u220B", ReverseEquilibrium: "\u21CB", ReverseUpEquilibrium: "\u296F", rfisht: "\u297D", rfloor: "\u230B", rfr: "\u{1D52F}", Rfr: "\u211C", rHar: "\u2964", rhard: "\u21C1", rharu: "\u21C0", rharul: "\u296C", rho: "\u03C1", Rho: "\u03A1", rhov: "\u03F1", RightAngleBracket: "\u27E9", rightarrow: "\u2192", Rightarrow: "\u21D2", RightArrow: "\u2192", RightArrowBar: "\u21E5", RightArrowLeftArrow: "\u21C4", rightarrowtail: "\u21A3", RightCeiling: "\u2309", RightDoubleBracket: "\u27E7", RightDownTeeVector: "\u295D", RightDownVector: "\u21C2", RightDownVectorBar: "\u2955", RightFloor: "\u230B", rightharpoondown: "\u21C1", rightharpoonup: "\u21C0", rightleftarrows: "\u21C4", rightleftharpoons: "\u21CC", rightrightarrows: "\u21C9", rightsquigarrow: "\u219D", RightTee: "\u22A2", RightTeeArrow: "\u21A6", RightTeeVector: "\u295B", rightthreetimes: "\u22CC", RightTriangle: "\u22B3", RightTriangleBar: "\u29D0", RightTriangleEqual: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVector: "\u21BE", RightUpVectorBar: "\u2954", RightVector: "\u21C0", RightVectorBar: "\u2953", ring: "\u02DA", risingdotseq: "\u2253", rlarr: "\u21C4", rlhar: "\u21CC", rlm: "\u200F", rmoust: "\u23B1", rmoustache: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", robrk: "\u27E7", ropar: "\u2986", ropf: "\u{1D563}", Ropf: "\u211D", roplus: "\u2A2E", rotimes: "\u2A35", RoundImplies: "\u2970", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rrarr: "\u21C9", Rrightarrow: "\u21DB", rsaquo: "\u203A", rscr: "\u{1D4C7}", Rscr: "\u211B", rsh: "\u21B1", Rsh: "\u21B1", rsqb: "]", rsquo: "\u2019", rsquor: "\u2019", rthree: "\u22CC", rtimes: "\u22CA", rtri: "\u25B9", rtrie: "\u22B5", rtrif: "\u25B8", rtriltri: "\u29CE", RuleDelayed: "\u29F4", ruluhar: "\u2968", rx: "\u211E", sacute: "\u015B", Sacute: "\u015A", sbquo: "\u201A", sc: "\u227B", Sc: "\u2ABC", scap: "\u2AB8", scaron: "\u0161", Scaron: "\u0160", sccue: "\u227D", sce: "\u2AB0", scE: "\u2AB4", scedil: "\u015F", Scedil: "\u015E", scirc: "\u015D", Scirc: "\u015C", scnap: "\u2ABA", scnE: "\u2AB6", scnsim: "\u22E9", scpolint: "\u2A13", scsim: "\u227F", scy: "\u0441", Scy: "\u0421", sdot: "\u22C5", sdotb: "\u22A1", sdote: "\u2A66", searhk: "\u2925", searr: "\u2198", seArr: "\u21D8", searrow: "\u2198", sect: "\xA7", semi: ";", seswar: "\u2929", setminus: "\u2216", setmn: "\u2216", sext: "\u2736", sfr: "\u{1D530}", Sfr: "\u{1D516}", sfrown: "\u2322", sharp: "\u266F", shchcy: "\u0449", SHCHcy: "\u0429", shcy: "\u0448", SHcy: "\u0428", ShortDownArrow: "\u2193", ShortLeftArrow: "\u2190", shortmid: "\u2223", shortparallel: "\u2225", ShortRightArrow: "\u2192", ShortUpArrow: "\u2191", shy: "\xAD", sigma: "\u03C3", Sigma: "\u03A3", sigmaf: "\u03C2", sigmav: "\u03C2", sim: "\u223C", simdot: "\u2A6A", sime: "\u2243", simeq: "\u2243", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246", simplus: "\u2A24", simrarr: "\u2972", slarr: "\u2190", SmallCircle: "\u2218", smallsetminus: "\u2216", smashp: "\u2A33", smeparsl: "\u29E4", smid: "\u2223", smile: "\u2323", smt: "\u2AAA", smte: "\u2AAC", smtes: "\u2AAC\uFE00", softcy: "\u044C", SOFTcy: "\u042C", sol: "/", solb: "\u29C4", solbar: "\u233F", sopf: "\u{1D564}", Sopf: "\u{1D54A}", spades: "\u2660", spadesuit: "\u2660", spar: "\u2225", sqcap: "\u2293", sqcaps: "\u2293\uFE00", sqcup: "\u2294", sqcups: "\u2294\uFE00", Sqrt: "\u221A", sqsub: "\u228F", sqsube: "\u2291", sqsubset: "\u228F", sqsubseteq: "\u2291", sqsup: "\u2290", sqsupe: "\u2292", sqsupset: "\u2290", sqsupseteq: "\u2292", squ: "\u25A1", square: "\u25A1", Square: "\u25A1", SquareIntersection: "\u2293", SquareSubset: "\u228F", SquareSubsetEqual: "\u2291", SquareSuperset: "\u2290", SquareSupersetEqual: "\u2292", SquareUnion: "\u2294", squarf: "\u25AA", squf: "\u25AA", srarr: "\u2192", sscr: "\u{1D4C8}", Sscr: "\u{1D4AE}", ssetmn: "\u2216", ssmile: "\u2323", sstarf: "\u22C6", star: "\u2606", Star: "\u22C6", starf: "\u2605", straightepsilon: "\u03F5", straightphi: "\u03D5", strns: "\xAF", sub: "\u2282", Sub: "\u22D0", subdot: "\u2ABD", sube: "\u2286", subE: "\u2AC5", subedot: "\u2AC3", submult: "\u2AC1", subne: "\u228A", subnE: "\u2ACB", subplus: "\u2ABF", subrarr: "\u2979", subset: "\u2282", Subset: "\u22D0", subseteq: "\u2286", subseteqq: "\u2AC5", SubsetEqual: "\u2286", subsetneq: "\u228A", subsetneqq: "\u2ACB", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", succ: "\u227B", succapprox: "\u2AB8", succcurlyeq: "\u227D", Succeeds: "\u227B", SucceedsEqual: "\u2AB0", SucceedsSlantEqual: "\u227D", SucceedsTilde: "\u227F", succeq: "\u2AB0", succnapprox: "\u2ABA", succneqq: "\u2AB6", succnsim: "\u22E9", succsim: "\u227F", SuchThat: "\u220B", sum: "\u2211", Sum: "\u2211", sung: "\u266A", sup: "\u2283", Sup: "\u22D1", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", supdot: "\u2ABE", supdsub: "\u2AD8", supe: "\u2287", supE: "\u2AC6", supedot: "\u2AC4", Superset: "\u2283", SupersetEqual: "\u2287", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\u297B", supmult: "\u2AC2", supne: "\u228B", supnE: "\u2ACC", supplus: "\u2AC0", supset: "\u2283", Supset: "\u22D1", supseteq: "\u2287", supseteqq: "\u2AC6", supsetneq: "\u228B", supsetneqq: "\u2ACC", supsim: "\u2AC8", supsub: "\u2AD4", supsup: "\u2AD6", swarhk: "\u2926", swarr: "\u2199", swArr: "\u21D9", swarrow: "\u2199", swnwar: "\u292A", szlig: "\xDF", Tab: "	", target: "\u2316", tau: "\u03C4", Tau: "\u03A4", tbrk: "\u23B4", tcaron: "\u0165", Tcaron: "\u0164", tcedil: "\u0163", Tcedil: "\u0162", tcy: "\u0442", Tcy: "\u0422", tdot: "\u20DB", telrec: "\u2315", tfr: "\u{1D531}", Tfr: "\u{1D517}", there4: "\u2234", therefore: "\u2234", Therefore: "\u2234", theta: "\u03B8", Theta: "\u0398", thetasym: "\u03D1", thetav: "\u03D1", thickapprox: "\u2248", thicksim: "\u223C", ThickSpace: "\u205F\u200A", thinsp: "\u2009", ThinSpace: "\u2009", thkap: "\u2248", thksim: "\u223C", thorn: "\xFE", THORN: "\xDE", tilde: "\u02DC", Tilde: "\u223C", TildeEqual: "\u2243", TildeFullEqual: "\u2245", TildeTilde: "\u2248", times: "\xD7", timesb: "\u22A0", timesbar: "\u2A31", timesd: "\u2A30", tint: "\u222D", toea: "\u2928", top: "\u22A4", topbot: "\u2336", topcir: "\u2AF1", topf: "\u{1D565}", Topf: "\u{1D54B}", topfork: "\u2ADA", tosa: "\u2929", tprime: "\u2034", trade: "\u2122", TRADE: "\u2122", triangle: "\u25B5", triangledown: "\u25BF", triangleleft: "\u25C3", trianglelefteq: "\u22B4", triangleq: "\u225C", triangleright: "\u25B9", trianglerighteq: "\u22B5", tridot: "\u25EC", trie: "\u225C", triminus: "\u2A3A", TripleDot: "\u20DB", triplus: "\u2A39", trisb: "\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", tscr: "\u{1D4C9}", Tscr: "\u{1D4AF}", tscy: "\u0446", TScy: "\u0426", tshcy: "\u045B", TSHcy: "\u040B", tstrok: "\u0167", Tstrok: "\u0166", twixt: "\u226C", twoheadleftarrow: "\u219E", twoheadrightarrow: "\u21A0", uacute: "\xFA", Uacute: "\xDA", uarr: "\u2191", uArr: "\u21D1", Uarr: "\u219F", Uarrocir: "\u2949", ubrcy: "\u045E", Ubrcy: "\u040E", ubreve: "\u016D", Ubreve: "\u016C", ucirc: "\xFB", Ucirc: "\xDB", ucy: "\u0443", Ucy: "\u0423", udarr: "\u21C5", udblac: "\u0171", Udblac: "\u0170", udhar: "\u296E", ufisht: "\u297E", ufr: "\u{1D532}", Ufr: "\u{1D518}", ugrave: "\xF9", Ugrave: "\xD9", uHar: "\u2963", uharl: "\u21BF", uharr: "\u21BE", uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", umacr: "\u016B", Umacr: "\u016A", uml: "\xA8", UnderBar: "_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", UnionPlus: "\u228E", uogon: "\u0173", Uogon: "\u0172", uopf: "\u{1D566}", Uopf: "\u{1D54C}", uparrow: "\u2191", Uparrow: "\u21D1", UpArrow: "\u2191", UpArrowBar: "\u2912", UpArrowDownArrow: "\u21C5", updownarrow: "\u2195", Updownarrow: "\u21D5", UpDownArrow: "\u2195", UpEquilibrium: "\u296E", upharpoonleft: "\u21BF", upharpoonright: "\u21BE", uplus: "\u228E", UpperLeftArrow: "\u2196", UpperRightArrow: "\u2197", upsi: "\u03C5", Upsi: "\u03D2", upsih: "\u03D2", upsilon: "\u03C5", Upsilon: "\u03A5", UpTee: "\u22A5", UpTeeArrow: "\u21A5", upuparrows: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", uring: "\u016F", Uring: "\u016E", urtri: "\u25F9", uscr: "\u{1D4CA}", Uscr: "\u{1D4B0}", utdot: "\u22F0", utilde: "\u0169", Utilde: "\u0168", utri: "\u25B5", utrif: "\u25B4", uuarr: "\u21C8", uuml: "\xFC", Uuml: "\xDC", uwangle: "\u29A7", vangrt: "\u299C", varepsilon: "\u03F5", varkappa: "\u03F0", varnothing: "\u2205", varphi: "\u03D5", varpi: "\u03D6", varpropto: "\u221D", varr: "\u2195", vArr: "\u21D5", varrho: "\u03F1", varsigma: "\u03C2", varsubsetneq: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", varsupsetneq: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vartheta: "\u03D1", vartriangleleft: "\u22B2", vartriangleright: "\u22B3", vBar: "\u2AE8", Vbar: "\u2AEB", vBarv: "\u2AE9", vcy: "\u0432", Vcy: "\u0412", vdash: "\u22A2", vDash: "\u22A8", Vdash: "\u22A9", VDash: "\u22AB", Vdashl: "\u2AE6", vee: "\u2228", Vee: "\u22C1", veebar: "\u22BB", veeeq: "\u225A", vellip: "\u22EE", verbar: "|", Verbar: "\u2016", vert: "|", Vert: "\u2016", VerticalBar: "\u2223", VerticalLine: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", VeryThinSpace: "\u200A", vfr: "\u{1D533}", Vfr: "\u{1D519}", vltri: "\u22B2", vnsub: "\u2282\u20D2", vnsup: "\u2283\u20D2", vopf: "\u{1D567}", Vopf: "\u{1D54D}", vprop: "\u221D", vrtri: "\u22B3", vscr: "\u{1D4CB}", Vscr: "\u{1D4B1}", vsubne: "\u228A\uFE00", vsubnE: "\u2ACB\uFE00", vsupne: "\u228B\uFE00", vsupnE: "\u2ACC\uFE00", Vvdash: "\u22AA", vzigzag: "\u299A", wcirc: "\u0175", Wcirc: "\u0174", wedbar: "\u2A5F", wedge: "\u2227", Wedge: "\u22C0", wedgeq: "\u2259", weierp: "\u2118", wfr: "\u{1D534}", Wfr: "\u{1D51A}", wopf: "\u{1D568}", Wopf: "\u{1D54E}", wp: "\u2118", wr: "\u2240", wreath: "\u2240", wscr: "\u{1D4CC}", Wscr: "\u{1D4B2}", xcap: "\u22C2", xcirc: "\u25EF", xcup: "\u22C3", xdtri: "\u25BD", xfr: "\u{1D535}", Xfr: "\u{1D51B}", xharr: "\u27F7", xhArr: "\u27FA", xi: "\u03BE", Xi: "\u039E", xlarr: "\u27F5", xlArr: "\u27F8", xmap: "\u27FC", xnis: "\u22FB", xodot: "\u2A00", xopf: "\u{1D569}", Xopf: "\u{1D54F}", xoplus: "\u2A01", xotime: "\u2A02", xrarr: "\u27F6", xrArr: "\u27F9", xscr: "\u{1D4CD}", Xscr: "\u{1D4B3}", xsqcup: "\u2A06", xuplus: "\u2A04", xutri: "\u25B3", xvee: "\u22C1", xwedge: "\u22C0", yacute: "\xFD", Yacute: "\xDD", yacy: "\u044F", YAcy: "\u042F", ycirc: "\u0177", Ycirc: "\u0176", ycy: "\u044B", Ycy: "\u042B", yen: "\xA5", yfr: "\u{1D536}", Yfr: "\u{1D51C}", yicy: "\u0457", YIcy: "\u0407", yopf: "\u{1D56A}", Yopf: "\u{1D550}", yscr: "\u{1D4CE}", Yscr: "\u{1D4B4}", yucy: "\u044E", YUcy: "\u042E", yuml: "\xFF", Yuml: "\u0178", zacute: "\u017A", Zacute: "\u0179", zcaron: "\u017E", Zcaron: "\u017D", zcy: "\u0437", Zcy: "\u0417", zdot: "\u017C", Zdot: "\u017B", zeetrf: "\u2128", ZeroWidthSpace: "\u200B", zeta: "\u03B6", Zeta: "\u0396", zfr: "\u{1D537}", Zfr: "\u2128", zhcy: "\u0436", ZHcy: "\u0416", zigrarr: "\u21DD", zopf: "\u{1D56B}", Zopf: "\u2124", zscr: "\u{1D4CF}", Zscr: "\u{1D4B5}", zwj: "\u200D", zwnj: "\u200C"};
      var decodeMapLegacy = {aacute: "\xE1", Aacute: "\xC1", acirc: "\xE2", Acirc: "\xC2", acute: "\xB4", aelig: "\xE6", AElig: "\xC6", agrave: "\xE0", Agrave: "\xC0", amp: "&", AMP: "&", aring: "\xE5", Aring: "\xC5", atilde: "\xE3", Atilde: "\xC3", auml: "\xE4", Auml: "\xC4", brvbar: "\xA6", ccedil: "\xE7", Ccedil: "\xC7", cedil: "\xB8", cent: "\xA2", copy: "\xA9", COPY: "\xA9", curren: "\xA4", deg: "\xB0", divide: "\xF7", eacute: "\xE9", Eacute: "\xC9", ecirc: "\xEA", Ecirc: "\xCA", egrave: "\xE8", Egrave: "\xC8", eth: "\xF0", ETH: "\xD0", euml: "\xEB", Euml: "\xCB", frac12: "\xBD", frac14: "\xBC", frac34: "\xBE", gt: ">", GT: ">", iacute: "\xED", Iacute: "\xCD", icirc: "\xEE", Icirc: "\xCE", iexcl: "\xA1", igrave: "\xEC", Igrave: "\xCC", iquest: "\xBF", iuml: "\xEF", Iuml: "\xCF", laquo: "\xAB", lt: "<", LT: "<", macr: "\xAF", micro: "\xB5", middot: "\xB7", nbsp: "\xA0", not: "\xAC", ntilde: "\xF1", Ntilde: "\xD1", oacute: "\xF3", Oacute: "\xD3", ocirc: "\xF4", Ocirc: "\xD4", ograve: "\xF2", Ograve: "\xD2", ordf: "\xAA", ordm: "\xBA", oslash: "\xF8", Oslash: "\xD8", otilde: "\xF5", Otilde: "\xD5", ouml: "\xF6", Ouml: "\xD6", para: "\xB6", plusmn: "\xB1", pound: "\xA3", quot: '"', QUOT: '"', raquo: "\xBB", reg: "\xAE", REG: "\xAE", sect: "\xA7", shy: "\xAD", sup1: "\xB9", sup2: "\xB2", sup3: "\xB3", szlig: "\xDF", thorn: "\xFE", THORN: "\xDE", times: "\xD7", uacute: "\xFA", Uacute: "\xDA", ucirc: "\xFB", Ucirc: "\xDB", ugrave: "\xF9", Ugrave: "\xD9", uml: "\xA8", uuml: "\xFC", Uuml: "\xDC", yacute: "\xFD", Yacute: "\xDD", yen: "\xA5", yuml: "\xFF"};
      var decodeMapNumeric = {"0": "\uFFFD", "128": "\u20AC", "130": "\u201A", "131": "\u0192", "132": "\u201E", "133": "\u2026", "134": "\u2020", "135": "\u2021", "136": "\u02C6", "137": "\u2030", "138": "\u0160", "139": "\u2039", "140": "\u0152", "142": "\u017D", "145": "\u2018", "146": "\u2019", "147": "\u201C", "148": "\u201D", "149": "\u2022", "150": "\u2013", "151": "\u2014", "152": "\u02DC", "153": "\u2122", "154": "\u0161", "155": "\u203A", "156": "\u0153", "158": "\u017E", "159": "\u0178"};
      var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65e3, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
      var stringFromCharCode = String.fromCharCode;
      var object = {};
      var hasOwnProperty = object.hasOwnProperty;
      var has = function(object2, propertyName) {
        return hasOwnProperty.call(object2, propertyName);
      };
      var contains = function(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
          if (array[index] == value) {
            return true;
          }
        }
        return false;
      };
      var merge = function(options, defaults) {
        if (!options) {
          return defaults;
        }
        var result = {};
        var key2;
        for (key2 in defaults) {
          result[key2] = has(options, key2) ? options[key2] : defaults[key2];
        }
        return result;
      };
      var codePointToSymbol = function(codePoint, strict) {
        var output = "";
        if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
          if (strict) {
            parseError("character reference outside the permissible Unicode range");
          }
          return "\uFFFD";
        }
        if (has(decodeMapNumeric, codePoint)) {
          if (strict) {
            parseError("disallowed character reference");
          }
          return decodeMapNumeric[codePoint];
        }
        if (strict && contains(invalidReferenceCodePoints, codePoint)) {
          parseError("disallowed character reference");
        }
        if (codePoint > 65535) {
          codePoint -= 65536;
          output += stringFromCharCode(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        output += stringFromCharCode(codePoint);
        return output;
      };
      var hexEscape = function(codePoint) {
        return "&#x" + codePoint.toString(16).toUpperCase() + ";";
      };
      var decEscape = function(codePoint) {
        return "&#" + codePoint + ";";
      };
      var parseError = function(message) {
        throw Error("Parse error: " + message);
      };
      var encode = function(string, options) {
        options = merge(options, encode.options);
        var strict = options.strict;
        if (strict && regexInvalidRawCodePoint.test(string)) {
          parseError("forbidden code point");
        }
        var encodeEverything = options.encodeEverything;
        var useNamedReferences = options.useNamedReferences;
        var allowUnsafeSymbols = options.allowUnsafeSymbols;
        var escapeCodePoint = options.decimal ? decEscape : hexEscape;
        var escapeBmpSymbol = function(symbol) {
          return escapeCodePoint(symbol.charCodeAt(0));
        };
        if (encodeEverything) {
          string = string.replace(regexAsciiWhitelist, function(symbol) {
            if (useNamedReferences && has(encodeMap, symbol)) {
              return "&" + encodeMap[symbol] + ";";
            }
            return escapeBmpSymbol(symbol);
          });
          if (useNamedReferences) {
            string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;").replace(/&#x66;&#x6A;/g, "&fjlig;");
          }
          if (useNamedReferences) {
            string = string.replace(regexEncodeNonAscii, function(string2) {
              return "&" + encodeMap[string2] + ";";
            });
          }
        } else if (useNamedReferences) {
          if (!allowUnsafeSymbols) {
            string = string.replace(regexEscape, function(string2) {
              return "&" + encodeMap[string2] + ";";
            });
          }
          string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;");
          string = string.replace(regexEncodeNonAscii, function(string2) {
            return "&" + encodeMap[string2] + ";";
          });
        } else if (!allowUnsafeSymbols) {
          string = string.replace(regexEscape, escapeBmpSymbol);
        }
        return string.replace(regexAstralSymbols, function($0) {
          var high = $0.charCodeAt(0);
          var low = $0.charCodeAt(1);
          var codePoint = (high - 55296) * 1024 + low - 56320 + 65536;
          return escapeCodePoint(codePoint);
        }).replace(regexBmpWhitelist, escapeBmpSymbol);
      };
      encode.options = {
        allowUnsafeSymbols: false,
        encodeEverything: false,
        strict: false,
        useNamedReferences: false,
        decimal: false
      };
      var decode = function(html, options) {
        options = merge(options, decode.options);
        var strict = options.strict;
        if (strict && regexInvalidEntity.test(html)) {
          parseError("malformed character reference");
        }
        return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
          var codePoint;
          var semicolon;
          var decDigits;
          var hexDigits;
          var reference;
          var next;
          if ($1) {
            reference = $1;
            return decodeMap[reference];
          }
          if ($2) {
            reference = $2;
            next = $3;
            if (next && options.isAttributeValue) {
              if (strict && next == "=") {
                parseError("`&` did not start a character reference");
              }
              return $0;
            } else {
              if (strict) {
                parseError("named character reference was not terminated by a semicolon");
              }
              return decodeMapLegacy[reference] + (next || "");
            }
          }
          if ($4) {
            decDigits = $4;
            semicolon = $5;
            if (strict && !semicolon) {
              parseError("character reference was not terminated by a semicolon");
            }
            codePoint = parseInt(decDigits, 10);
            return codePointToSymbol(codePoint, strict);
          }
          if ($6) {
            hexDigits = $6;
            semicolon = $7;
            if (strict && !semicolon) {
              parseError("character reference was not terminated by a semicolon");
            }
            codePoint = parseInt(hexDigits, 16);
            return codePointToSymbol(codePoint, strict);
          }
          if (strict) {
            parseError("named character reference was not terminated by a semicolon");
          }
          return $0;
        });
      };
      decode.options = {
        isAttributeValue: false,
        strict: false
      };
      var escape = function(string) {
        return string.replace(regexEscape, function($0) {
          return escapeMap[$0];
        });
      };
      var he = {
        version: "1.2.0",
        encode,
        decode,
        escape,
        unescape: decode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(function() {
          return he;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          freeModule.exports = he;
        } else {
          for (var key in he) {
            has(he, key) && (freeExports[key] = he[key]);
          }
        }
      } else {
        root.he = he;
      }
    })(exports);
  });

  // node_modules/mocha/lib/errors.js
  var require_errors = __commonJS((exports, module) => {
    "use strict";
    var {format} = require_util2();
    var emitWarning = (msg, type) => {
      if (import_process.default.emitWarning) {
        import_process.default.emitWarning(msg, type);
      } else {
        import_process.default.nextTick(function() {
          console.warn(type + ": " + msg);
        });
      }
    };
    var deprecate = (msg) => {
      msg = String(msg);
      if (msg && !deprecate.cache[msg]) {
        deprecate.cache[msg] = true;
        emitWarning(msg, "DeprecationWarning");
      }
    };
    deprecate.cache = {};
    var warn = (msg) => {
      if (msg) {
        emitWarning(msg);
      }
    };
    var constants = {
      FATAL: "ERR_MOCHA_FATAL",
      INVALID_ARG_TYPE: "ERR_MOCHA_INVALID_ARG_TYPE",
      INVALID_ARG_VALUE: "ERR_MOCHA_INVALID_ARG_VALUE",
      INVALID_EXCEPTION: "ERR_MOCHA_INVALID_EXCEPTION",
      INVALID_INTERFACE: "ERR_MOCHA_INVALID_INTERFACE",
      INVALID_REPORTER: "ERR_MOCHA_INVALID_REPORTER",
      MULTIPLE_DONE: "ERR_MOCHA_MULTIPLE_DONE",
      NO_FILES_MATCH_PATTERN: "ERR_MOCHA_NO_FILES_MATCH_PATTERN",
      UNSUPPORTED: "ERR_MOCHA_UNSUPPORTED",
      INSTANCE_ALREADY_RUNNING: "ERR_MOCHA_INSTANCE_ALREADY_RUNNING",
      INSTANCE_ALREADY_DISPOSED: "ERR_MOCHA_INSTANCE_ALREADY_DISPOSED",
      FORBIDDEN_EXCLUSIVITY: "ERR_MOCHA_FORBIDDEN_EXCLUSIVITY",
      INVALID_PLUGIN_IMPLEMENTATION: "ERR_MOCHA_INVALID_PLUGIN_IMPLEMENTATION",
      INVALID_PLUGIN_DEFINITION: "ERR_MOCHA_INVALID_PLUGIN_DEFINITION",
      TIMEOUT: "ERR_MOCHA_TIMEOUT"
    };
    var MOCHA_ERRORS = new Set(Object.values(constants));
    function createNoFilesMatchPatternError(message, pattern) {
      var err = new Error(message);
      err.code = constants.NO_FILES_MATCH_PATTERN;
      err.pattern = pattern;
      return err;
    }
    function createInvalidReporterError(message, reporter) {
      var err = new TypeError(message);
      err.code = constants.INVALID_REPORTER;
      err.reporter = reporter;
      return err;
    }
    function createInvalidInterfaceError(message, ui) {
      var err = new Error(message);
      err.code = constants.INVALID_INTERFACE;
      err.interface = ui;
      return err;
    }
    function createUnsupportedError(message) {
      var err = new Error(message);
      err.code = constants.UNSUPPORTED;
      return err;
    }
    function createMissingArgumentError(message, argument, expected) {
      return createInvalidArgumentTypeError(message, argument, expected);
    }
    function createInvalidArgumentTypeError(message, argument, expected) {
      var err = new TypeError(message);
      err.code = constants.INVALID_ARG_TYPE;
      err.argument = argument;
      err.expected = expected;
      err.actual = typeof argument;
      return err;
    }
    function createInvalidArgumentValueError(message, argument, value, reason) {
      var err = new TypeError(message);
      err.code = constants.INVALID_ARG_VALUE;
      err.argument = argument;
      err.value = value;
      err.reason = typeof reason !== "undefined" ? reason : "is invalid";
      return err;
    }
    function createInvalidExceptionError(message, value) {
      var err = new Error(message);
      err.code = constants.INVALID_EXCEPTION;
      err.valueType = typeof value;
      err.value = value;
      return err;
    }
    function createFatalError(message, value) {
      var err = new Error(message);
      err.code = constants.FATAL;
      err.valueType = typeof value;
      err.value = value;
      return err;
    }
    function createInvalidLegacyPluginError(message, pluginType, pluginId) {
      switch (pluginType) {
        case "reporter":
          return createInvalidReporterError(message, pluginId);
        case "interface":
          return createInvalidInterfaceError(message, pluginId);
        default:
          throw new Error('unknown pluginType "' + pluginType + '"');
      }
    }
    function createInvalidPluginError(...args) {
      deprecate("Use createInvalidLegacyPluginError() instead");
      return createInvalidLegacyPluginError(...args);
    }
    function createMochaInstanceAlreadyDisposedError(message, cleanReferencesAfterRun, instance) {
      var err = new Error(message);
      err.code = constants.INSTANCE_ALREADY_DISPOSED;
      err.cleanReferencesAfterRun = cleanReferencesAfterRun;
      err.instance = instance;
      return err;
    }
    function createMochaInstanceAlreadyRunningError(message, instance) {
      var err = new Error(message);
      err.code = constants.INSTANCE_ALREADY_RUNNING;
      err.instance = instance;
      return err;
    }
    function createMultipleDoneError(runnable, originalErr) {
      var title;
      try {
        title = format("<%s>", runnable.fullTitle());
        if (runnable.parent.root) {
          title += " (of root suite)";
        }
      } catch (ignored) {
        title = format("<%s> (of unknown suite)", runnable.title);
      }
      var message = format("done() called multiple times in %s %s", runnable.type ? runnable.type : "unknown runnable", title);
      if (runnable.file) {
        message += format(" of file %s", runnable.file);
      }
      if (originalErr) {
        message += format("; in addition, done() received error: %s", originalErr);
      }
      var err = new Error(message);
      err.code = constants.MULTIPLE_DONE;
      err.valueType = typeof originalErr;
      err.value = originalErr;
      return err;
    }
    function createForbiddenExclusivityError(mocha2) {
      var err = new Error(mocha2.isWorker ? "`.only` is not supported in parallel mode" : "`.only` forbidden by --forbid-only");
      err.code = constants.FORBIDDEN_EXCLUSIVITY;
      return err;
    }
    function createInvalidPluginDefinitionError(msg, pluginDef) {
      const err = new Error(msg);
      err.code = constants.INVALID_PLUGIN_DEFINITION;
      err.pluginDef = pluginDef;
      return err;
    }
    function createInvalidPluginImplementationError(msg, {pluginDef, pluginImpl} = {}) {
      const err = new Error(msg);
      err.code = constants.INVALID_PLUGIN_IMPLEMENTATION;
      err.pluginDef = pluginDef;
      err.pluginImpl = pluginImpl;
      return err;
    }
    function createTimeoutError(msg, timeout, file) {
      const err = new Error(msg);
      err.code = constants.TIMEOUT;
      err.timeout = timeout;
      err.file = file;
      return err;
    }
    var isMochaError = (err) => Boolean(err && typeof err === "object" && MOCHA_ERRORS.has(err.code));
    module.exports = {
      constants,
      createFatalError,
      createForbiddenExclusivityError,
      createInvalidArgumentTypeError,
      createInvalidArgumentValueError,
      createInvalidExceptionError,
      createInvalidInterfaceError,
      createInvalidLegacyPluginError,
      createInvalidPluginDefinitionError,
      createInvalidPluginError,
      createInvalidPluginImplementationError,
      createInvalidReporterError,
      createMissingArgumentError,
      createMochaInstanceAlreadyDisposedError,
      createMochaInstanceAlreadyRunningError,
      createMultipleDoneError,
      createNoFilesMatchPatternError,
      createTimeoutError,
      createUnsupportedError,
      deprecate,
      isMochaError,
      warn
    };
  });

  // (disabled):node_modules/mocha/lib/cli/index.js
  var require_cli = __commonJS(() => {
  });

  // node_modules/mocha/lib/utils.js
  var require_utils = __commonJS((exports) => {
    "use strict";
    var {nanoid} = require_non_secure();
    var path = require_path();
    var util2 = require_util2();
    var he = require_he();
    var errors = require_errors();
    var MOCHA_ID_PROP_NAME = "__mocha_id__";
    exports.inherits = util2.inherits;
    exports.escape = function(html) {
      return he.encode(String(html), {useNamedReferences: false});
    };
    exports.isString = function(obj) {
      return typeof obj === "string";
    };
    exports.slug = function(str) {
      return str.toLowerCase().replace(/\s+/g, "-").replace(/[^-\w]/g, "").replace(/-{2,}/g, "-");
    };
    exports.clean = function(str) {
      str = str.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, "").replace(/^function(?:\s*|\s+[^(]*)\([^)]*\)\s*\{((?:.|\n)*?)\s*\}$|^\([^)]*\)\s*=>\s*(?:\{((?:.|\n)*?)\s*\}|((?:.|\n)*))$/, "$1$2$3");
      var spaces = str.match(/^\n?( *)/)[1].length;
      var tabs = str.match(/^\n?(\t*)/)[1].length;
      var re = new RegExp("^\n?" + (tabs ? "	" : " ") + "{" + (tabs || spaces) + "}", "gm");
      str = str.replace(re, "");
      return str.trim();
    };
    function emptyRepresentation(value, typeHint) {
      switch (typeHint) {
        case "function":
          return "[Function]";
        case "object":
          return "{}";
        case "array":
          return "[]";
        default:
          return value.toString();
      }
    }
    var canonicalType = exports.canonicalType = function canonicalType2(value) {
      if (value === void 0) {
        return "undefined";
      } else if (value === null) {
        return "null";
      } else if (import_buffer.Buffer.isBuffer(value)) {
        return "buffer";
      }
      return Object.prototype.toString.call(value).replace(/^\[.+\s(.+?)]$/, "$1").toLowerCase();
    };
    exports.type = function type(value) {
      if (value === null)
        return "null";
      const primitives = new Set([
        "undefined",
        "boolean",
        "number",
        "string",
        "bigint",
        "symbol"
      ]);
      const _type = typeof value;
      if (_type === "function")
        return _type;
      if (primitives.has(_type))
        return _type;
      if (value instanceof String)
        return "string";
      if (value instanceof Error)
        return "error";
      if (Array.isArray(value))
        return "array";
      return _type;
    };
    exports.stringify = function(value) {
      var typeHint = canonicalType(value);
      if (!~["object", "array", "function"].indexOf(typeHint)) {
        if (typeHint === "buffer") {
          var json = import_buffer.Buffer.prototype.toJSON.call(value);
          return jsonStringify(json.data && json.type ? json.data : json, 2).replace(/,(\n|$)/g, "$1");
        }
        if (typeHint === "string" && typeof value === "object") {
          value = value.split("").reduce(function(acc, char, idx) {
            acc[idx] = char;
            return acc;
          }, {});
          typeHint = "object";
        } else {
          return jsonStringify(value);
        }
      }
      for (var prop in value) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          return jsonStringify(exports.canonicalize(value, null, typeHint), 2).replace(/,(\n|$)/g, "$1");
        }
      }
      return emptyRepresentation(value, typeHint);
    };
    function jsonStringify(object, spaces, depth) {
      if (typeof spaces === "undefined") {
        return _stringify(object);
      }
      depth = depth || 1;
      var space = spaces * depth;
      var str = Array.isArray(object) ? "[" : "{";
      var end = Array.isArray(object) ? "]" : "}";
      var length = typeof object.length === "number" ? object.length : Object.keys(object).length;
      function repeat(s, n) {
        return new Array(n).join(s);
      }
      function _stringify(val) {
        switch (canonicalType(val)) {
          case "null":
          case "undefined":
            val = "[" + val + "]";
            break;
          case "array":
          case "object":
            val = jsonStringify(val, spaces, depth + 1);
            break;
          case "boolean":
          case "regexp":
          case "symbol":
          case "number":
            val = val === 0 && 1 / val === -Infinity ? "-0" : val.toString();
            break;
          case "bigint":
            val = val.toString() + "n";
            break;
          case "date":
            var sDate = isNaN(val.getTime()) ? val.toString() : val.toISOString();
            val = "[Date: " + sDate + "]";
            break;
          case "buffer":
            var json = val.toJSON();
            json = json.data && json.type ? json.data : json;
            val = "[Buffer: " + jsonStringify(json, 2, depth + 1) + "]";
            break;
          default:
            val = val === "[Function]" || val === "[Circular]" ? val : JSON.stringify(val);
        }
        return val;
      }
      for (var i in object) {
        if (!Object.prototype.hasOwnProperty.call(object, i)) {
          continue;
        }
        --length;
        str += "\n " + repeat(" ", space) + (Array.isArray(object) ? "" : '"' + i + '": ') + _stringify(object[i]) + (length ? "," : "");
      }
      return str + (str.length !== 1 ? "\n" + repeat(" ", --space) + end : end);
    }
    exports.canonicalize = function canonicalize(value, stack, typeHint) {
      var canonicalizedObj;
      var prop;
      typeHint = typeHint || canonicalType(value);
      function withStack(value2, fn) {
        stack.push(value2);
        fn();
        stack.pop();
      }
      stack = stack || [];
      if (stack.indexOf(value) !== -1) {
        return "[Circular]";
      }
      switch (typeHint) {
        case "undefined":
        case "buffer":
        case "null":
          canonicalizedObj = value;
          break;
        case "array":
          withStack(value, function() {
            canonicalizedObj = value.map(function(item) {
              return exports.canonicalize(item, stack);
            });
          });
          break;
        case "function":
          for (prop in value) {
            canonicalizedObj = {};
            break;
          }
          if (!canonicalizedObj) {
            canonicalizedObj = emptyRepresentation(value, typeHint);
            break;
          }
        case "object":
          canonicalizedObj = canonicalizedObj || {};
          withStack(value, function() {
            Object.keys(value).sort().forEach(function(key) {
              canonicalizedObj[key] = exports.canonicalize(value[key], stack);
            });
          });
          break;
        case "date":
        case "number":
        case "regexp":
        case "boolean":
        case "symbol":
          canonicalizedObj = value;
          break;
        default:
          canonicalizedObj = value + "";
      }
      return canonicalizedObj;
    };
    exports.stackTraceFilter = function() {
      var is = typeof document === "undefined" ? {node: true} : {browser: true};
      var slash = path.sep;
      var cwd;
      if (is.node) {
        cwd = exports.cwd() + slash;
      } else {
        cwd = (typeof location === "undefined" ? window.location : location).href.replace(/\/[^/]*$/, "/");
        slash = "/";
      }
      function isMochaInternal(line) {
        return ~line.indexOf("node_modules" + slash + "mocha" + slash) || ~line.indexOf(slash + "mocha.js") || ~line.indexOf(slash + "mocha.min.js");
      }
      function isNodeInternal(line) {
        return ~line.indexOf("(timers.js:") || ~line.indexOf("(events.js:") || ~line.indexOf("(node.js:") || ~line.indexOf("(module.js:") || ~line.indexOf("GeneratorFunctionPrototype.next (native)") || false;
      }
      return function(stack) {
        stack = stack.split("\n");
        stack = stack.reduce(function(list, line) {
          if (isMochaInternal(line)) {
            return list;
          }
          if (is.node && isNodeInternal(line)) {
            return list;
          }
          if (/:\d+:\d+\)?$/.test(line)) {
            line = line.replace("(" + cwd, "(");
          }
          list.push(line);
          return list;
        }, []);
        return stack.join("\n");
      };
    };
    exports.isPromise = function isPromise(value) {
      return typeof value === "object" && value !== null && typeof value.then === "function";
    };
    exports.clamp = function clamp(value, range) {
      return Math.min(Math.max(value, range[0]), range[1]);
    };
    exports.sQuote = function(str) {
      return "'" + str + "'";
    };
    exports.dQuote = function(str) {
      return '"' + str + '"';
    };
    exports.noop = function() {
    };
    exports.createMap = function(obj) {
      return Object.assign.apply(null, [Object.create(null)].concat(Array.prototype.slice.call(arguments)));
    };
    exports.defineConstants = function(obj) {
      if (canonicalType(obj) !== "object" || !Object.keys(obj).length) {
        throw new TypeError("Invalid argument; expected a non-empty object");
      }
      return Object.freeze(exports.createMap(obj));
    };
    exports.supportsEsModules = function(partialSupport) {
      if (!exports.isBrowser() && import_process.default.versions && import_process.default.versions.node) {
        var versionFields = import_process.default.versions.node.split(".");
        var major = +versionFields[0];
        var minor = +versionFields[1];
        if (!partialSupport) {
          return major >= 13 || major === 12 && minor >= 11;
        } else {
          return major >= 10;
        }
      }
    };
    exports.cwd = function cwd() {
      return import_process.default.cwd();
    };
    exports.isBrowser = function isBrowser() {
      return Boolean(import_process.default.browser);
    };
    exports.lookupFiles = (...args) => {
      if (exports.isBrowser()) {
        throw errors.createUnsupportedError("lookupFiles() is only supported in Node.js!");
      }
      errors.deprecate("`lookupFiles()` in module `mocha/lib/utils` has moved to module `mocha/lib/cli` and will be removed in the next major revision of Mocha");
      return require_cli().lookupFiles(...args);
    };
    exports.castArray = function castArray(value) {
      if (value === void 0) {
        return [];
      }
      if (value === null) {
        return [null];
      }
      if (typeof value === "object" && (typeof value[Symbol.iterator] === "function" || value.length !== void 0)) {
        return Array.from(value);
      }
      return [value];
    };
    exports.constants = exports.defineConstants({
      MOCHA_ID_PROP_NAME
    });
    exports.uniqueID = () => nanoid();
    exports.assignNewMochaID = (obj) => {
      const id = exports.uniqueID();
      Object.defineProperty(obj, MOCHA_ID_PROP_NAME, {
        get() {
          return id;
        }
      });
      return obj;
    };
    exports.getMochaID = (obj) => obj && typeof obj === "object" ? obj[MOCHA_ID_PROP_NAME] : void 0;
  });

  // (disabled):node_modules/mocha/node_modules/supports-color/browser.js
  var require_browser3 = __commonJS(() => {
  });

  // node_modules/mocha/lib/pending.js
  var require_pending = __commonJS((exports, module) => {
    "use strict";
    module.exports = Pending;
    function Pending(message) {
      this.message = message;
    }
  });

  // node_modules/mocha/node_modules/debug/node_modules/ms/index.js
  var require_ms2 = __commonJS((exports, module) => {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  });

  // node_modules/mocha/node_modules/debug/src/common.js
  var require_common = __commonJS((exports, module) => {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms2();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  });

  // node_modules/mocha/node_modules/debug/src/browser.js
  var require_browser4 = __commonJS((exports, module) => {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof import_process.default !== "undefined" && "env" in import_process.default) {
        r = import_process.default.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var {formatters} = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  });

  // node_modules/mocha/lib/runnable.js
  var require_runnable = __commonJS((exports, module) => {
    "use strict";
    var EventEmitter = require_events().EventEmitter;
    var Pending = require_pending();
    var debug = require_browser4()("mocha:runnable");
    var milliseconds = require_ms();
    var utils = require_utils();
    var {
      createInvalidExceptionError,
      createMultipleDoneError,
      createTimeoutError
    } = require_errors();
    var Date2 = import_global.default.Date;
    var setTimeout2 = import_global.default.setTimeout;
    var clearTimeout2 = import_global.default.clearTimeout;
    var toString = Object.prototype.toString;
    module.exports = Runnable;
    function Runnable(title, fn) {
      this.title = title;
      this.fn = fn;
      this.body = (fn || "").toString();
      this.async = fn && fn.length;
      this.sync = !this.async;
      this._timeout = 2e3;
      this._slow = 75;
      this._retries = -1;
      utils.assignNewMochaID(this);
      Object.defineProperty(this, "id", {
        get() {
          return utils.getMochaID(this);
        }
      });
      this.reset();
    }
    utils.inherits(Runnable, EventEmitter);
    Runnable.prototype.reset = function() {
      this.timedOut = false;
      this._currentRetry = 0;
      this.pending = false;
      delete this.state;
      delete this.err;
    };
    Runnable.prototype.timeout = function(ms) {
      if (!arguments.length) {
        return this._timeout;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      var INT_MAX = Math.pow(2, 31) - 1;
      var range = [0, INT_MAX];
      ms = utils.clamp(ms, range);
      if (ms === range[0] || ms === range[1]) {
        this._timeout = 0;
      } else {
        this._timeout = ms;
      }
      debug("timeout %d", this._timeout);
      if (this.timer) {
        this.resetTimeout();
      }
      return this;
    };
    Runnable.prototype.slow = function(ms) {
      if (!arguments.length || typeof ms === "undefined") {
        return this._slow;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      debug("slow %d", ms);
      this._slow = ms;
      return this;
    };
    Runnable.prototype.skip = function() {
      this.pending = true;
      throw new Pending("sync skip; aborting execution");
    };
    Runnable.prototype.isPending = function() {
      return this.pending || this.parent && this.parent.isPending();
    };
    Runnable.prototype.isFailed = function() {
      return !this.isPending() && this.state === constants.STATE_FAILED;
    };
    Runnable.prototype.isPassed = function() {
      return !this.isPending() && this.state === constants.STATE_PASSED;
    };
    Runnable.prototype.retries = function(n) {
      if (!arguments.length) {
        return this._retries;
      }
      this._retries = n;
    };
    Runnable.prototype.currentRetry = function(n) {
      if (!arguments.length) {
        return this._currentRetry;
      }
      this._currentRetry = n;
    };
    Runnable.prototype.fullTitle = function() {
      return this.titlePath().join(" ");
    };
    Runnable.prototype.titlePath = function() {
      return this.parent.titlePath().concat([this.title]);
    };
    Runnable.prototype.clearTimeout = function() {
      clearTimeout2(this.timer);
    };
    Runnable.prototype.resetTimeout = function() {
      var self2 = this;
      var ms = this.timeout();
      if (ms === 0) {
        return;
      }
      this.clearTimeout();
      this.timer = setTimeout2(function() {
        if (self2.timeout() === 0) {
          return;
        }
        self2.callback(self2._timeoutError(ms));
        self2.timedOut = true;
      }, ms);
    };
    Runnable.prototype.globals = function(globals) {
      if (!arguments.length) {
        return this._allowedGlobals;
      }
      this._allowedGlobals = globals;
    };
    Runnable.prototype.run = function(fn) {
      var self2 = this;
      var start = new Date2();
      var ctx = this.ctx;
      var finished;
      var errorWasHandled = false;
      if (this.isPending())
        return fn();
      if (ctx && ctx.runnable) {
        ctx.runnable(this);
      }
      function multiple(err) {
        if (errorWasHandled) {
          return;
        }
        errorWasHandled = true;
        self2.emit("error", createMultipleDoneError(self2, err));
      }
      function done(err) {
        var ms = self2.timeout();
        if (self2.timedOut) {
          return;
        }
        if (finished) {
          return multiple(err);
        }
        self2.clearTimeout();
        self2.duration = new Date2() - start;
        finished = true;
        if (!err && self2.duration > ms && ms > 0) {
          err = self2._timeoutError(ms);
        }
        fn(err);
      }
      this.callback = done;
      if (this.fn && typeof this.fn.call !== "function") {
        done(new TypeError("A runnable must be passed a function as its second argument."));
        return;
      }
      if (this.async) {
        this.resetTimeout();
        this.skip = function asyncSkip() {
          this.pending = true;
          done();
          throw new Pending("async skip; aborting execution");
        };
        try {
          callFnAsync(this.fn);
        } catch (err) {
          errorWasHandled = true;
          if (err instanceof Pending) {
            return;
          } else if (this.allowUncaught) {
            throw err;
          }
          done(Runnable.toValueOrError(err));
        }
        return;
      }
      try {
        callFn(this.fn);
      } catch (err) {
        errorWasHandled = true;
        if (err instanceof Pending) {
          return done();
        } else if (this.allowUncaught) {
          throw err;
        }
        done(Runnable.toValueOrError(err));
      }
      function callFn(fn2) {
        var result = fn2.call(ctx);
        if (result && typeof result.then === "function") {
          self2.resetTimeout();
          result.then(function() {
            done();
            return null;
          }, function(reason) {
            done(reason || new Error("Promise rejected with no or falsy reason"));
          });
        } else {
          if (self2.asyncOnly) {
            return done(new Error("--async-only option in use without declaring `done()` or returning a promise"));
          }
          done();
        }
      }
      function callFnAsync(fn2) {
        var result = fn2.call(ctx, function(err) {
          if (err instanceof Error || toString.call(err) === "[object Error]") {
            return done(err);
          }
          if (err) {
            if (Object.prototype.toString.call(err) === "[object Object]") {
              return done(new Error("done() invoked with non-Error: " + JSON.stringify(err)));
            }
            return done(new Error("done() invoked with non-Error: " + err));
          }
          if (result && utils.isPromise(result)) {
            return done(new Error("Resolution method is overspecified. Specify a callback *or* return a Promise; not both."));
          }
          done();
        });
      }
    };
    Runnable.prototype._timeoutError = function(ms) {
      let msg = `Timeout of ${ms}ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.`;
      if (this.file) {
        msg += " (" + this.file + ")";
      }
      return createTimeoutError(msg, ms, this.file);
    };
    var constants = utils.defineConstants({
      STATE_FAILED: "failed",
      STATE_PASSED: "passed",
      STATE_PENDING: "pending"
    });
    Runnable.toValueOrError = function(value) {
      return value || createInvalidExceptionError("Runnable failed with falsy or undefined exception. Please throw an Error instead.", value);
    };
    Runnable.constants = constants;
  });

  // node_modules/mocha/lib/hook.js
  var require_hook = __commonJS((exports, module) => {
    "use strict";
    var Runnable = require_runnable();
    var {inherits, constants} = require_utils();
    var {MOCHA_ID_PROP_NAME} = constants;
    module.exports = Hook;
    function Hook(title, fn) {
      Runnable.call(this, title, fn);
      this.type = "hook";
    }
    inherits(Hook, Runnable);
    Hook.prototype.reset = function() {
      Runnable.prototype.reset.call(this);
      delete this._error;
    };
    Hook.prototype.error = function(err) {
      if (!arguments.length) {
        err = this._error;
        this._error = null;
        return err;
      }
      this._error = err;
    };
    Hook.prototype.serialize = function serialize() {
      return {
        $$isPending: this.isPending(),
        $$titlePath: this.titlePath(),
        ctx: this.ctx && this.ctx.currentTest ? {
          currentTest: {
            title: this.ctx.currentTest.title,
            [MOCHA_ID_PROP_NAME]: this.ctx.currentTest.id
          }
        } : {},
        parent: {
          [MOCHA_ID_PROP_NAME]: this.parent.id
        },
        title: this.title,
        type: this.type,
        [MOCHA_ID_PROP_NAME]: this.id
      };
    };
  });

  // node_modules/mocha/lib/suite.js
  var require_suite = __commonJS((exports, module) => {
    "use strict";
    var {EventEmitter} = require_events();
    var Hook = require_hook();
    var {
      assignNewMochaID,
      clamp,
      constants: utilsConstants,
      createMap,
      defineConstants,
      getMochaID,
      inherits,
      isString
    } = require_utils();
    var debug = require_browser4()("mocha:suite");
    var milliseconds = require_ms();
    var errors = require_errors();
    var {MOCHA_ID_PROP_NAME} = utilsConstants;
    exports = module.exports = Suite;
    Suite.create = function(parent, title) {
      var suite = new Suite(title, parent.ctx);
      suite.parent = parent;
      title = suite.fullTitle();
      parent.addSuite(suite);
      return suite;
    };
    function Suite(title, parentContext, isRoot) {
      if (!isString(title)) {
        throw errors.createInvalidArgumentTypeError('Suite argument "title" must be a string. Received type "' + typeof title + '"', "title", "string");
      }
      this.title = title;
      function Context() {
      }
      Context.prototype = parentContext;
      this.ctx = new Context();
      this.suites = [];
      this.tests = [];
      this.root = isRoot === true;
      this.pending = false;
      this._retries = -1;
      this._beforeEach = [];
      this._beforeAll = [];
      this._afterEach = [];
      this._afterAll = [];
      this._timeout = 2e3;
      this._slow = 75;
      this._bail = false;
      this._onlyTests = [];
      this._onlySuites = [];
      assignNewMochaID(this);
      Object.defineProperty(this, "id", {
        get() {
          return getMochaID(this);
        }
      });
      this.reset();
      this.on("newListener", function(event) {
        if (deprecatedEvents[event]) {
          errors.deprecate('Event "' + event + '" is deprecated.  Please let the Mocha team know about your use case: https://git.io/v6Lwm');
        }
      });
    }
    inherits(Suite, EventEmitter);
    Suite.prototype.reset = function() {
      this.delayed = false;
      function doReset(thingToReset) {
        thingToReset.reset();
      }
      this.suites.forEach(doReset);
      this.tests.forEach(doReset);
      this._beforeEach.forEach(doReset);
      this._afterEach.forEach(doReset);
      this._beforeAll.forEach(doReset);
      this._afterAll.forEach(doReset);
    };
    Suite.prototype.clone = function() {
      var suite = new Suite(this.title);
      debug("clone");
      suite.ctx = this.ctx;
      suite.root = this.root;
      suite.timeout(this.timeout());
      suite.retries(this.retries());
      suite.slow(this.slow());
      suite.bail(this.bail());
      return suite;
    };
    Suite.prototype.timeout = function(ms) {
      if (!arguments.length) {
        return this._timeout;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      var INT_MAX = Math.pow(2, 31) - 1;
      var range = [0, INT_MAX];
      ms = clamp(ms, range);
      debug("timeout %d", ms);
      this._timeout = parseInt(ms, 10);
      return this;
    };
    Suite.prototype.retries = function(n) {
      if (!arguments.length) {
        return this._retries;
      }
      debug("retries %d", n);
      this._retries = parseInt(n, 10) || 0;
      return this;
    };
    Suite.prototype.slow = function(ms) {
      if (!arguments.length) {
        return this._slow;
      }
      if (typeof ms === "string") {
        ms = milliseconds(ms);
      }
      debug("slow %d", ms);
      this._slow = ms;
      return this;
    };
    Suite.prototype.bail = function(bail) {
      if (!arguments.length) {
        return this._bail;
      }
      debug("bail %s", bail);
      this._bail = bail;
      return this;
    };
    Suite.prototype.isPending = function() {
      return this.pending || this.parent && this.parent.isPending();
    };
    Suite.prototype._createHook = function(title, fn) {
      var hook = new Hook(title, fn);
      hook.parent = this;
      hook.timeout(this.timeout());
      hook.retries(this.retries());
      hook.slow(this.slow());
      hook.ctx = this.ctx;
      hook.file = this.file;
      return hook;
    };
    Suite.prototype.beforeAll = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"before all" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._beforeAll.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_BEFORE_ALL, hook);
      return this;
    };
    Suite.prototype.afterAll = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"after all" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._afterAll.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_AFTER_ALL, hook);
      return this;
    };
    Suite.prototype.beforeEach = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"before each" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._beforeEach.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_BEFORE_EACH, hook);
      return this;
    };
    Suite.prototype.afterEach = function(title, fn) {
      if (this.isPending()) {
        return this;
      }
      if (typeof title === "function") {
        fn = title;
        title = fn.name;
      }
      title = '"after each" hook' + (title ? ": " + title : "");
      var hook = this._createHook(title, fn);
      this._afterEach.push(hook);
      this.emit(constants.EVENT_SUITE_ADD_HOOK_AFTER_EACH, hook);
      return this;
    };
    Suite.prototype.addSuite = function(suite) {
      suite.parent = this;
      suite.root = false;
      suite.timeout(this.timeout());
      suite.retries(this.retries());
      suite.slow(this.slow());
      suite.bail(this.bail());
      this.suites.push(suite);
      this.emit(constants.EVENT_SUITE_ADD_SUITE, suite);
      return this;
    };
    Suite.prototype.addTest = function(test) {
      test.parent = this;
      test.timeout(this.timeout());
      test.retries(this.retries());
      test.slow(this.slow());
      test.ctx = this.ctx;
      this.tests.push(test);
      this.emit(constants.EVENT_SUITE_ADD_TEST, test);
      return this;
    };
    Suite.prototype.fullTitle = function() {
      return this.titlePath().join(" ");
    };
    Suite.prototype.titlePath = function() {
      var result = [];
      if (this.parent) {
        result = result.concat(this.parent.titlePath());
      }
      if (!this.root) {
        result.push(this.title);
      }
      return result;
    };
    Suite.prototype.total = function() {
      return this.suites.reduce(function(sum, suite) {
        return sum + suite.total();
      }, 0) + this.tests.length;
    };
    Suite.prototype.eachTest = function(fn) {
      this.tests.forEach(fn);
      this.suites.forEach(function(suite) {
        suite.eachTest(fn);
      });
      return this;
    };
    Suite.prototype.run = function run() {
      if (this.root) {
        this.emit(constants.EVENT_ROOT_SUITE_RUN);
      }
    };
    Suite.prototype.hasOnly = function hasOnly() {
      return this._onlyTests.length > 0 || this._onlySuites.length > 0 || this.suites.some(function(suite) {
        return suite.hasOnly();
      });
    };
    Suite.prototype.filterOnly = function filterOnly() {
      if (this._onlyTests.length) {
        this.tests = this._onlyTests;
        this.suites = [];
      } else {
        this.tests = [];
        this._onlySuites.forEach(function(onlySuite) {
          if (onlySuite.hasOnly()) {
            onlySuite.filterOnly();
          }
        });
        var onlySuites = this._onlySuites;
        this.suites = this.suites.filter(function(childSuite) {
          return onlySuites.indexOf(childSuite) !== -1 || childSuite.filterOnly();
        });
      }
      return this.tests.length > 0 || this.suites.length > 0;
    };
    Suite.prototype.appendOnlySuite = function(suite) {
      this._onlySuites.push(suite);
    };
    Suite.prototype.markOnly = function() {
      this.parent && this.parent.appendOnlySuite(this);
    };
    Suite.prototype.appendOnlyTest = function(test) {
      this._onlyTests.push(test);
    };
    Suite.prototype.getHooks = function getHooks(name) {
      return this["_" + name];
    };
    Suite.prototype.dispose = function() {
      this.suites.forEach(function(suite) {
        suite.dispose();
      });
      this.cleanReferences();
    };
    Suite.prototype.cleanReferences = function cleanReferences() {
      function cleanArrReferences(arr) {
        for (var i2 = 0; i2 < arr.length; i2++) {
          delete arr[i2].fn;
        }
      }
      if (Array.isArray(this._beforeAll)) {
        cleanArrReferences(this._beforeAll);
      }
      if (Array.isArray(this._beforeEach)) {
        cleanArrReferences(this._beforeEach);
      }
      if (Array.isArray(this._afterAll)) {
        cleanArrReferences(this._afterAll);
      }
      if (Array.isArray(this._afterEach)) {
        cleanArrReferences(this._afterEach);
      }
      for (var i = 0; i < this.tests.length; i++) {
        delete this.tests[i].fn;
      }
    };
    Suite.prototype.serialize = function serialize() {
      return {
        _bail: this._bail,
        $$fullTitle: this.fullTitle(),
        $$isPending: this.isPending(),
        root: this.root,
        title: this.title,
        id: this.id,
        parent: this.parent ? {[MOCHA_ID_PROP_NAME]: this.parent.id} : null
      };
    };
    var constants = defineConstants({
      EVENT_FILE_POST_REQUIRE: "post-require",
      EVENT_FILE_PRE_REQUIRE: "pre-require",
      EVENT_FILE_REQUIRE: "require",
      EVENT_ROOT_SUITE_RUN: "run",
      HOOK_TYPE_AFTER_ALL: "afterAll",
      HOOK_TYPE_AFTER_EACH: "afterEach",
      HOOK_TYPE_BEFORE_ALL: "beforeAll",
      HOOK_TYPE_BEFORE_EACH: "beforeEach",
      EVENT_SUITE_ADD_HOOK_AFTER_ALL: "afterAll",
      EVENT_SUITE_ADD_HOOK_AFTER_EACH: "afterEach",
      EVENT_SUITE_ADD_HOOK_BEFORE_ALL: "beforeAll",
      EVENT_SUITE_ADD_HOOK_BEFORE_EACH: "beforeEach",
      EVENT_SUITE_ADD_SUITE: "suite",
      EVENT_SUITE_ADD_TEST: "test"
    });
    var deprecatedEvents = Object.keys(constants).filter(function(constant) {
      return constant.substring(0, 15) === "EVENT_SUITE_ADD";
    }).reduce(function(acc, constant) {
      acc[constants[constant]] = true;
      return acc;
    }, createMap());
    Suite.constants = constants;
  });

  // node_modules/mocha/lib/runner.js
  var require_runner = __commonJS((exports, module) => {
    "use strict";
    var util2 = require_util2();
    var EventEmitter = require_events().EventEmitter;
    var Pending = require_pending();
    var utils = require_utils();
    var debug = require_browser4()("mocha:runner");
    var Runnable = require_runnable();
    var Suite = require_suite();
    var HOOK_TYPE_BEFORE_EACH = Suite.constants.HOOK_TYPE_BEFORE_EACH;
    var HOOK_TYPE_AFTER_EACH = Suite.constants.HOOK_TYPE_AFTER_EACH;
    var HOOK_TYPE_AFTER_ALL = Suite.constants.HOOK_TYPE_AFTER_ALL;
    var HOOK_TYPE_BEFORE_ALL = Suite.constants.HOOK_TYPE_BEFORE_ALL;
    var EVENT_ROOT_SUITE_RUN = Suite.constants.EVENT_ROOT_SUITE_RUN;
    var STATE_FAILED = Runnable.constants.STATE_FAILED;
    var STATE_PASSED = Runnable.constants.STATE_PASSED;
    var STATE_PENDING = Runnable.constants.STATE_PENDING;
    var dQuote = utils.dQuote;
    var sQuote = utils.sQuote;
    var stackFilter = utils.stackTraceFilter();
    var stringify = utils.stringify;
    var {
      createInvalidExceptionError,
      createUnsupportedError,
      createFatalError,
      isMochaError,
      constants: errorConstants
    } = require_errors();
    var globals = [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "XMLHttpRequest",
      "Date",
      "setImmediate",
      "clearImmediate"
    ];
    var constants = utils.defineConstants({
      EVENT_HOOK_BEGIN: "hook",
      EVENT_HOOK_END: "hook end",
      EVENT_RUN_BEGIN: "start",
      EVENT_DELAY_BEGIN: "waiting",
      EVENT_DELAY_END: "ready",
      EVENT_RUN_END: "end",
      EVENT_SUITE_BEGIN: "suite",
      EVENT_SUITE_END: "suite end",
      EVENT_TEST_BEGIN: "test",
      EVENT_TEST_END: "test end",
      EVENT_TEST_FAIL: "fail",
      EVENT_TEST_PASS: "pass",
      EVENT_TEST_PENDING: "pending",
      EVENT_TEST_RETRY: "retry",
      STATE_IDLE: "idle",
      STATE_RUNNING: "running",
      STATE_STOPPED: "stopped"
    });
    var Runner = class extends EventEmitter {
      constructor(suite, opts) {
        super();
        if (opts === void 0) {
          opts = {};
        }
        if (typeof opts === "boolean") {
          this._delay = opts;
          opts = {};
        } else {
          this._delay = opts.delay;
        }
        var self2 = this;
        this._globals = [];
        this._abort = false;
        this.suite = suite;
        this._opts = opts;
        this.state = constants.STATE_IDLE;
        this.total = suite.total();
        this.failures = 0;
        this._eventListeners = new Map();
        this.on(constants.EVENT_TEST_END, function(test) {
          if (test.type === "test" && test.retriedTest() && test.parent) {
            var idx = test.parent.tests && test.parent.tests.indexOf(test.retriedTest());
            if (idx > -1)
              test.parent.tests[idx] = test;
          }
          self2.checkGlobals(test);
        });
        this.on(constants.EVENT_HOOK_END, function(hook) {
          self2.checkGlobals(hook);
        });
        this._defaultGrep = /.*/;
        this.grep(this._defaultGrep);
        this.globals(this.globalProps());
        this.uncaught = this._uncaught.bind(this);
        this.unhandled = (reason, promise) => {
          if (isMochaError(reason)) {
            debug("trapped unhandled rejection coming out of Mocha; forwarding to uncaught handler:", reason);
            this.uncaught(reason);
          } else {
            debug("trapped unhandled rejection from (probably) user code; re-emitting on process");
            this._removeEventListener(import_process.default, "unhandledRejection", this.unhandled);
            try {
              import_process.default.emit("unhandledRejection", reason, promise);
            } finally {
              this._addEventListener(import_process.default, "unhandledRejection", this.unhandled);
            }
          }
        };
      }
    };
    Runner.immediately = import_global.default.setImmediate || import_process.default.nextTick;
    Runner.prototype._addEventListener = function(target, eventName, listener) {
      debug("_addEventListener(): adding for event %s; %d current listeners", eventName, target.listenerCount(eventName));
      if (this._eventListeners.has(target) && this._eventListeners.get(target).has(eventName) && this._eventListeners.get(target).get(eventName).has(listener)) {
        debug("warning: tried to attach duplicate event listener for %s", eventName);
        return;
      }
      target.on(eventName, listener);
      const targetListeners = this._eventListeners.has(target) ? this._eventListeners.get(target) : new Map();
      const targetEventListeners = targetListeners.has(eventName) ? targetListeners.get(eventName) : new Set();
      targetEventListeners.add(listener);
      targetListeners.set(eventName, targetEventListeners);
      this._eventListeners.set(target, targetListeners);
    };
    Runner.prototype._removeEventListener = function(target, eventName, listener) {
      target.removeListener(eventName, listener);
      if (this._eventListeners.has(target)) {
        const targetListeners = this._eventListeners.get(target);
        if (targetListeners.has(eventName)) {
          const targetEventListeners = targetListeners.get(eventName);
          targetEventListeners.delete(listener);
          if (!targetEventListeners.size) {
            targetListeners.delete(eventName);
          }
        }
        if (!targetListeners.size) {
          this._eventListeners.delete(target);
        }
      } else {
        debug("trying to remove listener for untracked object %s", target);
      }
    };
    Runner.prototype.dispose = function() {
      this.removeAllListeners();
      this._eventListeners.forEach((targetListeners, target) => {
        targetListeners.forEach((targetEventListeners, eventName) => {
          targetEventListeners.forEach((listener) => {
            target.removeListener(eventName, listener);
          });
        });
      });
      this._eventListeners.clear();
    };
    Runner.prototype.grep = function(re, invert) {
      debug("grep(): setting to %s", re);
      this._grep = re;
      this._invert = invert;
      this.total = this.grepTotal(this.suite);
      return this;
    };
    Runner.prototype.grepTotal = function(suite) {
      var self2 = this;
      var total = 0;
      suite.eachTest(function(test) {
        var match = self2._grep.test(test.fullTitle());
        if (self2._invert) {
          match = !match;
        }
        if (match) {
          total++;
        }
      });
      return total;
    };
    Runner.prototype.globalProps = function() {
      var props = Object.keys(import_global.default);
      for (var i = 0; i < globals.length; ++i) {
        if (~props.indexOf(globals[i])) {
          continue;
        }
        props.push(globals[i]);
      }
      return props;
    };
    Runner.prototype.globals = function(arr) {
      if (!arguments.length) {
        return this._globals;
      }
      debug("globals(): setting to %O", arr);
      this._globals = this._globals.concat(arr);
      return this;
    };
    Runner.prototype.checkGlobals = function(test) {
      if (!this.checkLeaks) {
        return;
      }
      var ok = this._globals;
      var globals2 = this.globalProps();
      var leaks;
      if (test) {
        ok = ok.concat(test._allowedGlobals || []);
      }
      if (this.prevGlobalsLength === globals2.length) {
        return;
      }
      this.prevGlobalsLength = globals2.length;
      leaks = filterLeaks(ok, globals2);
      this._globals = this._globals.concat(leaks);
      if (leaks.length) {
        var msg = "global leak(s) detected: %s";
        var error = new Error(util2.format(msg, leaks.map(sQuote).join(", ")));
        this.fail(test, error);
      }
    };
    Runner.prototype.fail = function(test, err, force) {
      force = force === true;
      if (test.isPending() && !force) {
        return;
      }
      if (this.state === constants.STATE_STOPPED) {
        if (err.code === errorConstants.MULTIPLE_DONE) {
          throw err;
        }
        throw createFatalError("Test failed after root suite execution completed!", err);
      }
      ++this.failures;
      debug("total number of failures: %d", this.failures);
      test.state = STATE_FAILED;
      if (!isError(err)) {
        err = thrown2Error(err);
      }
      try {
        err.stack = this.fullStackTrace || !err.stack ? err.stack : stackFilter(err.stack);
      } catch (ignore) {
      }
      this.emit(constants.EVENT_TEST_FAIL, test, err);
    };
    Runner.prototype.hook = function(name, fn) {
      var suite = this.suite;
      var hooks = suite.getHooks(name);
      var self2 = this;
      function next(i) {
        var hook = hooks[i];
        if (!hook) {
          return fn();
        }
        self2.currentRunnable = hook;
        if (name === HOOK_TYPE_BEFORE_ALL) {
          hook.ctx.currentTest = hook.parent.tests[0];
        } else if (name === HOOK_TYPE_AFTER_ALL) {
          hook.ctx.currentTest = hook.parent.tests[hook.parent.tests.length - 1];
        } else {
          hook.ctx.currentTest = self2.test;
        }
        setHookTitle(hook);
        hook.allowUncaught = self2.allowUncaught;
        self2.emit(constants.EVENT_HOOK_BEGIN, hook);
        if (!hook.listeners("error").length) {
          self2._addEventListener(hook, "error", function(err) {
            self2.fail(hook, err);
          });
        }
        hook.run(function cbHookRun(err) {
          var testError = hook.error();
          if (testError) {
            self2.fail(self2.test, testError);
          }
          if (hook.pending) {
            if (name === HOOK_TYPE_AFTER_EACH) {
              if (self2.test) {
                self2.test.pending = true;
              }
            } else if (name === HOOK_TYPE_BEFORE_EACH) {
              if (self2.test) {
                self2.test.pending = true;
              }
              self2.emit(constants.EVENT_HOOK_END, hook);
              hook.pending = false;
              return fn(new Error("abort hookDown"));
            } else if (name === HOOK_TYPE_BEFORE_ALL) {
              suite.tests.forEach(function(test) {
                test.pending = true;
              });
              suite.suites.forEach(function(suite2) {
                suite2.pending = true;
              });
              hooks = [];
            } else {
              hook.pending = false;
              var errForbid = createUnsupportedError("`this.skip` forbidden");
              self2.fail(hook, errForbid);
              return fn(errForbid);
            }
          } else if (err) {
            self2.fail(hook, err);
            return fn(err);
          }
          self2.emit(constants.EVENT_HOOK_END, hook);
          delete hook.ctx.currentTest;
          setHookTitle(hook);
          next(++i);
        });
        function setHookTitle(hook2) {
          hook2.originalTitle = hook2.originalTitle || hook2.title;
          if (hook2.ctx && hook2.ctx.currentTest) {
            hook2.title = hook2.originalTitle + " for " + dQuote(hook2.ctx.currentTest.title);
          } else {
            var parentTitle;
            if (hook2.parent.title) {
              parentTitle = hook2.parent.title;
            } else {
              parentTitle = hook2.parent.root ? "{root}" : "";
            }
            hook2.title = hook2.originalTitle + " in " + dQuote(parentTitle);
          }
        }
      }
      Runner.immediately(function() {
        next(0);
      });
    };
    Runner.prototype.hooks = function(name, suites, fn) {
      var self2 = this;
      var orig = this.suite;
      function next(suite) {
        self2.suite = suite;
        if (!suite) {
          self2.suite = orig;
          return fn();
        }
        self2.hook(name, function(err) {
          if (err) {
            var errSuite = self2.suite;
            self2.suite = orig;
            return fn(err, errSuite);
          }
          next(suites.pop());
        });
      }
      next(suites.pop());
    };
    Runner.prototype.hookUp = function(name, fn) {
      var suites = [this.suite].concat(this.parents()).reverse();
      this.hooks(name, suites, fn);
    };
    Runner.prototype.hookDown = function(name, fn) {
      var suites = [this.suite].concat(this.parents());
      this.hooks(name, suites, fn);
    };
    Runner.prototype.parents = function() {
      var suite = this.suite;
      var suites = [];
      while (suite.parent) {
        suite = suite.parent;
        suites.push(suite);
      }
      return suites;
    };
    Runner.prototype.runTest = function(fn) {
      var self2 = this;
      var test = this.test;
      if (!test) {
        return;
      }
      if (this.asyncOnly) {
        test.asyncOnly = true;
      }
      this._addEventListener(test, "error", function(err) {
        self2.fail(test, err);
      });
      if (this.allowUncaught) {
        test.allowUncaught = true;
        return test.run(fn);
      }
      try {
        test.run(fn);
      } catch (err) {
        fn(err);
      }
    };
    Runner.prototype.runTests = function(suite, fn) {
      var self2 = this;
      var tests = suite.tests.slice();
      var test;
      function hookErr(_, errSuite, after) {
        var orig = self2.suite;
        self2.suite = after ? errSuite.parent : errSuite;
        if (self2.suite) {
          self2.hookUp(HOOK_TYPE_AFTER_EACH, function(err2, errSuite2) {
            self2.suite = orig;
            if (err2) {
              return hookErr(err2, errSuite2, true);
            }
            fn(errSuite);
          });
        } else {
          self2.suite = orig;
          fn(errSuite);
        }
      }
      function next(err, errSuite) {
        if (self2.failures && suite._bail) {
          tests = [];
        }
        if (self2._abort) {
          return fn();
        }
        if (err) {
          return hookErr(err, errSuite, true);
        }
        test = tests.shift();
        if (!test) {
          return fn();
        }
        var match = self2._grep.test(test.fullTitle());
        if (self2._invert) {
          match = !match;
        }
        if (!match) {
          if (self2._grep !== self2._defaultGrep) {
            Runner.immediately(next);
          } else {
            next();
          }
          return;
        }
        if (test.isPending()) {
          if (self2.forbidPending) {
            self2.fail(test, new Error("Pending test forbidden"), true);
          } else {
            test.state = STATE_PENDING;
            self2.emit(constants.EVENT_TEST_PENDING, test);
          }
          self2.emit(constants.EVENT_TEST_END, test);
          return next();
        }
        self2.emit(constants.EVENT_TEST_BEGIN, self2.test = test);
        self2.hookDown(HOOK_TYPE_BEFORE_EACH, function(err2, errSuite2) {
          if (test.isPending()) {
            if (self2.forbidPending) {
              self2.fail(test, new Error("Pending test forbidden"), true);
            } else {
              test.state = STATE_PENDING;
              self2.emit(constants.EVENT_TEST_PENDING, test);
            }
            self2.emit(constants.EVENT_TEST_END, test);
            var origSuite = self2.suite;
            self2.suite = errSuite2 || self2.suite;
            return self2.hookUp(HOOK_TYPE_AFTER_EACH, function(e, eSuite) {
              self2.suite = origSuite;
              next(e, eSuite);
            });
          }
          if (err2) {
            return hookErr(err2, errSuite2, false);
          }
          self2.currentRunnable = self2.test;
          self2.runTest(function(err3) {
            test = self2.test;
            if (test.pending) {
              if (self2.forbidPending) {
                self2.fail(test, new Error("Pending test forbidden"), true);
              } else {
                test.state = STATE_PENDING;
                self2.emit(constants.EVENT_TEST_PENDING, test);
              }
              self2.emit(constants.EVENT_TEST_END, test);
              return self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
            } else if (err3) {
              var retry = test.currentRetry();
              if (retry < test.retries()) {
                var clonedTest = test.clone();
                clonedTest.currentRetry(retry + 1);
                tests.unshift(clonedTest);
                self2.emit(constants.EVENT_TEST_RETRY, test, err3);
                return self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
              } else {
                self2.fail(test, err3);
              }
              self2.emit(constants.EVENT_TEST_END, test);
              return self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
            }
            test.state = STATE_PASSED;
            self2.emit(constants.EVENT_TEST_PASS, test);
            self2.emit(constants.EVENT_TEST_END, test);
            self2.hookUp(HOOK_TYPE_AFTER_EACH, next);
          });
        });
      }
      this.next = next;
      this.hookErr = hookErr;
      next();
    };
    Runner.prototype.runSuite = function(suite, fn) {
      var i = 0;
      var self2 = this;
      var total = this.grepTotal(suite);
      debug("runSuite(): running %s", suite.fullTitle());
      if (!total || self2.failures && suite._bail) {
        debug("runSuite(): bailing");
        return fn();
      }
      this.emit(constants.EVENT_SUITE_BEGIN, this.suite = suite);
      function next(errSuite) {
        if (errSuite) {
          if (errSuite === suite) {
            return done();
          }
          return done(errSuite);
        }
        if (self2._abort) {
          return done();
        }
        var curr = suite.suites[i++];
        if (!curr) {
          return done();
        }
        if (self2._grep !== self2._defaultGrep) {
          Runner.immediately(function() {
            self2.runSuite(curr, next);
          });
        } else {
          self2.runSuite(curr, next);
        }
      }
      function done(errSuite) {
        self2.suite = suite;
        self2.nextSuite = next;
        delete self2.test;
        self2.hook(HOOK_TYPE_AFTER_ALL, function() {
          self2.emit(constants.EVENT_SUITE_END, suite);
          fn(errSuite);
        });
      }
      this.nextSuite = next;
      this.hook(HOOK_TYPE_BEFORE_ALL, function(err) {
        if (err) {
          return done();
        }
        self2.runTests(suite, next);
      });
    };
    Runner.prototype._uncaught = function(err) {
      if (!(this instanceof Runner)) {
        throw createFatalError("Runner#uncaught() called with invalid context", this);
      }
      if (err instanceof Pending) {
        debug("uncaught(): caught a Pending");
        return;
      }
      if (this.allowUncaught && !utils.isBrowser()) {
        debug("uncaught(): bubbling exception due to --allow-uncaught");
        throw err;
      }
      if (this.state === constants.STATE_STOPPED) {
        debug("uncaught(): throwing after run has completed!");
        throw err;
      }
      if (err) {
        debug("uncaught(): got truthy exception %O", err);
      } else {
        debug("uncaught(): undefined/falsy exception");
        err = createInvalidExceptionError("Caught falsy/undefined exception which would otherwise be uncaught. No stack trace found; try a debugger", err);
      }
      if (!isError(err)) {
        err = thrown2Error(err);
        debug('uncaught(): converted "error" %o to Error', err);
      }
      err.uncaught = true;
      var runnable = this.currentRunnable;
      if (!runnable) {
        runnable = new Runnable("Uncaught error outside test suite");
        debug("uncaught(): no current Runnable; created a phony one");
        runnable.parent = this.suite;
        if (this.state === constants.STATE_RUNNING) {
          debug("uncaught(): failing gracefully");
          this.fail(runnable, err);
        } else {
          debug("uncaught(): test run has not yet started; unrecoverable");
          this.emit(constants.EVENT_RUN_BEGIN);
          this.fail(runnable, err);
          this.emit(constants.EVENT_RUN_END);
        }
        return;
      }
      runnable.clearTimeout();
      if (runnable.isFailed()) {
        debug("uncaught(): Runnable has already failed");
        return;
      } else if (runnable.isPending()) {
        debug("uncaught(): pending Runnable wound up failing!");
        this.fail(runnable, err, true);
        return;
      }
      if (runnable.isPassed()) {
        debug("uncaught(): Runnable has already passed; bailing gracefully");
        this.fail(runnable, err);
        this.abort();
      } else {
        debug("uncaught(): forcing Runnable to complete with Error");
        return runnable.callback(err);
      }
    };
    Runner.prototype.run = function(fn, opts = {}) {
      var rootSuite = this.suite;
      var options = opts.options || {};
      debug("run(): got options: %O", options);
      fn = fn || function() {
      };
      const end = () => {
        debug("run(): root suite completed; emitting %s", constants.EVENT_RUN_END);
        this.emit(constants.EVENT_RUN_END);
      };
      const begin = () => {
        debug("run(): emitting %s", constants.EVENT_RUN_BEGIN);
        this.emit(constants.EVENT_RUN_BEGIN);
        debug("run(): emitted %s", constants.EVENT_RUN_BEGIN);
        this.runSuite(rootSuite, end);
      };
      const prepare = () => {
        debug("run(): starting");
        if (rootSuite.hasOnly()) {
          rootSuite.filterOnly();
          debug("run(): filtered exclusive Runnables");
        }
        this.state = constants.STATE_RUNNING;
        if (this._delay) {
          this.emit(constants.EVENT_DELAY_END);
          debug('run(): "delay" ended');
        }
        return begin();
      };
      if (this._opts.cleanReferencesAfterRun) {
        this.on(constants.EVENT_SUITE_END, (suite) => {
          suite.cleanReferences();
        });
      }
      this.on(constants.EVENT_RUN_END, function() {
        this.state = constants.STATE_STOPPED;
        debug("run(): emitted %s", constants.EVENT_RUN_END);
        fn(this.failures);
      });
      this._removeEventListener(import_process.default, "uncaughtException", this.uncaught);
      this._removeEventListener(import_process.default, "unhandledRejection", this.unhandled);
      this._addEventListener(import_process.default, "uncaughtException", this.uncaught);
      this._addEventListener(import_process.default, "unhandledRejection", this.unhandled);
      if (this._delay) {
        this.emit(constants.EVENT_DELAY_BEGIN, rootSuite);
        rootSuite.once(EVENT_ROOT_SUITE_RUN, prepare);
        debug("run(): waiting for green light due to --delay");
      } else {
        Runner.immediately(prepare);
      }
      return this;
    };
    Runner.prototype.linkPartialObjects = function(value) {
      return this;
    };
    Runner.prototype.runAsync = async function runAsync(opts = {}) {
      return new Promise((resolve) => {
        this.run(resolve, opts);
      });
    };
    Runner.prototype.abort = function() {
      debug("abort(): aborting");
      this._abort = true;
      return this;
    };
    Runner.prototype.isParallelMode = function isParallelMode() {
      return false;
    };
    Runner.prototype.workerReporter = function() {
      throw createUnsupportedError("workerReporter() not supported in serial mode");
    };
    function filterLeaks(ok, globals2) {
      return globals2.filter(function(key) {
        if (/^\d+/.test(key)) {
          return false;
        }
        if (import_global.default.navigator && /^getInterface/.test(key)) {
          return false;
        }
        if (import_global.default.navigator && /^\d+/.test(key)) {
          return false;
        }
        if (/^mocha-/.test(key)) {
          return false;
        }
        var matched = ok.filter(function(ok2) {
          if (~ok2.indexOf("*")) {
            return key.indexOf(ok2.split("*")[0]) === 0;
          }
          return key === ok2;
        });
        return !matched.length && (!import_global.default.navigator || key !== "onerror");
      });
    }
    function isError(err) {
      return err instanceof Error || err && typeof err.message === "string";
    }
    function thrown2Error(err) {
      return new Error(`the ${utils.canonicalType(err)} ${stringify(err)} was thrown, throw an Error :)`);
    }
    Runner.constants = constants;
    module.exports = Runner;
  });

  // node_modules/mocha/lib/reporters/base.js
  var require_base = __commonJS((exports, module) => {
    "use strict";
    var diff = require_diff();
    var milliseconds = require_ms();
    var utils = require_utils();
    var supportsColor = require_browser3();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var isBrowser = utils.isBrowser();
    function getBrowserWindowSize() {
      if ("innerHeight" in import_global.default) {
        return [import_global.default.innerHeight, import_global.default.innerWidth];
      }
      return [640, 480];
    }
    exports = module.exports = Base;
    var isatty = isBrowser || import_process.default.stdout.isTTY && import_process.default.stderr.isTTY;
    var consoleLog = console.log;
    exports.useColors = !isBrowser && (supportsColor.stdout || import_process.default.env.MOCHA_COLORS !== void 0);
    exports.inlineDiffs = false;
    exports.colors = {
      pass: 90,
      fail: 31,
      "bright pass": 92,
      "bright fail": 91,
      "bright yellow": 93,
      pending: 36,
      suite: 0,
      "error title": 0,
      "error message": 31,
      "error stack": 90,
      checkmark: 32,
      fast: 90,
      medium: 33,
      slow: 31,
      green: 32,
      light: 90,
      "diff gutter": 90,
      "diff added": 32,
      "diff removed": 31,
      "diff added inline": "30;42",
      "diff removed inline": "30;41"
    };
    exports.symbols = {
      ok: "\u2713",
      err: "\u2716",
      dot: "\u2024",
      comma: ",",
      bang: "!"
    };
    if (import_process.default.platform === "win32") {
      exports.symbols.ok = "\u221A";
      exports.symbols.err = "\xD7";
      exports.symbols.dot = ".";
    }
    var color = exports.color = function(type, str) {
      if (!exports.useColors) {
        return String(str);
      }
      return "[" + exports.colors[type] + "m" + str + "[0m";
    };
    exports.window = {
      width: 75
    };
    if (isatty) {
      if (isBrowser) {
        exports.window.width = getBrowserWindowSize()[1];
      } else {
        exports.window.width = import_process.default.stdout.getWindowSize(1)[0];
      }
    }
    exports.cursor = {
      hide: function() {
        isatty && import_process.default.stdout.write("[?25l");
      },
      show: function() {
        isatty && import_process.default.stdout.write("[?25h");
      },
      deleteLine: function() {
        isatty && import_process.default.stdout.write("[2K");
      },
      beginningOfLine: function() {
        isatty && import_process.default.stdout.write("[0G");
      },
      CR: function() {
        if (isatty) {
          exports.cursor.deleteLine();
          exports.cursor.beginningOfLine();
        } else {
          import_process.default.stdout.write("\r");
        }
      }
    };
    var showDiff = exports.showDiff = function(err) {
      return err && err.showDiff !== false && sameType(err.actual, err.expected) && err.expected !== void 0;
    };
    function stringifyDiffObjs(err) {
      if (!utils.isString(err.actual) || !utils.isString(err.expected)) {
        err.actual = utils.stringify(err.actual);
        err.expected = utils.stringify(err.expected);
      }
    }
    var generateDiff = exports.generateDiff = function(actual, expected) {
      try {
        return exports.inlineDiffs ? inlineDiff(actual, expected) : unifiedDiff(actual, expected);
      } catch (err) {
        var msg = "\n      " + color("diff added", "+ expected") + " " + color("diff removed", "- actual:  failed to generate Mocha diff") + "\n";
        return msg;
      }
    };
    exports.list = function(failures) {
      var multipleErr, multipleTest;
      Base.consoleLog();
      failures.forEach(function(test, i) {
        var fmt = color("error title", "  %s) %s:\n") + color("error message", "     %s") + color("error stack", "\n%s\n");
        var msg;
        var err;
        if (test.err && test.err.multiple) {
          if (multipleTest !== test) {
            multipleTest = test;
            multipleErr = [test.err].concat(test.err.multiple);
          }
          err = multipleErr.shift();
        } else {
          err = test.err;
        }
        var message;
        if (err.message && typeof err.message.toString === "function") {
          message = err.message + "";
        } else if (typeof err.inspect === "function") {
          message = err.inspect() + "";
        } else {
          message = "";
        }
        var stack = err.stack || message;
        var index = message ? stack.indexOf(message) : -1;
        if (index === -1) {
          msg = message;
        } else {
          index += message.length;
          msg = stack.slice(0, index);
          stack = stack.slice(index + 1);
        }
        if (err.uncaught) {
          msg = "Uncaught " + msg;
        }
        if (!exports.hideDiff && showDiff(err)) {
          stringifyDiffObjs(err);
          fmt = color("error title", "  %s) %s:\n%s") + color("error stack", "\n%s\n");
          var match = message.match(/^([^:]+): expected/);
          msg = "\n      " + color("error message", match ? match[1] : msg);
          msg += generateDiff(err.actual, err.expected);
        }
        stack = stack.replace(/^/gm, "  ");
        var testTitle = "";
        test.titlePath().forEach(function(str, index2) {
          if (index2 !== 0) {
            testTitle += "\n     ";
          }
          for (var i2 = 0; i2 < index2; i2++) {
            testTitle += "  ";
          }
          testTitle += str;
        });
        Base.consoleLog(fmt, i + 1, testTitle, msg, stack);
      });
    };
    function Base(runner, options) {
      var failures = this.failures = [];
      if (!runner) {
        throw new TypeError("Missing runner argument");
      }
      this.options = options || {};
      this.runner = runner;
      this.stats = runner.stats;
      runner.on(EVENT_TEST_PASS, function(test) {
        if (test.duration > test.slow()) {
          test.speed = "slow";
        } else if (test.duration > test.slow() / 2) {
          test.speed = "medium";
        } else {
          test.speed = "fast";
        }
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        if (showDiff(err)) {
          stringifyDiffObjs(err);
        }
        if (test.err && err instanceof Error) {
          test.err.multiple = (test.err.multiple || []).concat(err);
        } else {
          test.err = err;
        }
        failures.push(test);
      });
    }
    Base.prototype.epilogue = function() {
      var stats = this.stats;
      var fmt;
      Base.consoleLog();
      fmt = color("bright pass", " ") + color("green", " %d passing") + color("light", " (%s)");
      Base.consoleLog(fmt, stats.passes || 0, milliseconds(stats.duration));
      if (stats.pending) {
        fmt = color("pending", " ") + color("pending", " %d pending");
        Base.consoleLog(fmt, stats.pending);
      }
      if (stats.failures) {
        fmt = color("fail", "  %d failing");
        Base.consoleLog(fmt, stats.failures);
        Base.list(this.failures);
        Base.consoleLog();
      }
      Base.consoleLog();
    };
    function pad(str, len) {
      str = String(str);
      return Array(len - str.length + 1).join(" ") + str;
    }
    function inlineDiff(actual, expected) {
      var msg = errorDiff(actual, expected);
      var lines = msg.split("\n");
      if (lines.length > 4) {
        var width = String(lines.length).length;
        msg = lines.map(function(str, i) {
          return pad(++i, width) + " | " + str;
        }).join("\n");
      }
      msg = "\n" + color("diff removed inline", "actual") + " " + color("diff added inline", "expected") + "\n\n" + msg + "\n";
      msg = msg.replace(/^/gm, "      ");
      return msg;
    }
    function unifiedDiff(actual, expected) {
      var indent = "      ";
      function cleanUp(line) {
        if (line[0] === "+") {
          return indent + colorLines("diff added", line);
        }
        if (line[0] === "-") {
          return indent + colorLines("diff removed", line);
        }
        if (line.match(/@@/)) {
          return "--";
        }
        if (line.match(/\\ No newline/)) {
          return null;
        }
        return indent + line;
      }
      function notBlank(line) {
        return typeof line !== "undefined" && line !== null;
      }
      var msg = diff.createPatch("string", actual, expected);
      var lines = msg.split("\n").splice(5);
      return "\n      " + colorLines("diff added", "+ expected") + " " + colorLines("diff removed", "- actual") + "\n\n" + lines.map(cleanUp).filter(notBlank).join("\n");
    }
    function errorDiff(actual, expected) {
      return diff.diffWordsWithSpace(actual, expected).map(function(str) {
        if (str.added) {
          return colorLines("diff added inline", str.value);
        }
        if (str.removed) {
          return colorLines("diff removed inline", str.value);
        }
        return str.value;
      }).join("");
    }
    function colorLines(name, str) {
      return str.split("\n").map(function(str2) {
        return color(name, str2);
      }).join("\n");
    }
    var objToString = Object.prototype.toString;
    function sameType(a, b) {
      return objToString.call(a) === objToString.call(b);
    }
    Base.consoleLog = consoleLog;
    Base.abstract = true;
  });

  // node_modules/mocha/lib/reporters/dot.js
  var require_dot = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    exports = module.exports = Dot;
    function Dot(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.75 | 0;
      var n = -1;
      runner.on(EVENT_RUN_BEGIN, function() {
        import_process.default.stdout.write("\n");
      });
      runner.on(EVENT_TEST_PENDING, function() {
        if (++n % width === 0) {
          import_process.default.stdout.write("\n  ");
        }
        import_process.default.stdout.write(Base.color("pending", Base.symbols.comma));
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        if (++n % width === 0) {
          import_process.default.stdout.write("\n  ");
        }
        if (test.speed === "slow") {
          import_process.default.stdout.write(Base.color("bright yellow", Base.symbols.dot));
        } else {
          import_process.default.stdout.write(Base.color(test.speed, Base.symbols.dot));
        }
      });
      runner.on(EVENT_TEST_FAIL, function() {
        if (++n % width === 0) {
          import_process.default.stdout.write("\n  ");
        }
        import_process.default.stdout.write(Base.color("fail", Base.symbols.bang));
      });
      runner.once(EVENT_RUN_END, function() {
        import_process.default.stdout.write("\n");
        self2.epilogue();
      });
    }
    inherits(Dot, Base);
    Dot.description = "dot matrix representation";
  });

  // node_modules/mocha/lib/reporters/doc.js
  var require_doc = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var utils = require_utils();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    exports = module.exports = Doc;
    function Doc(runner, options) {
      Base.call(this, runner, options);
      var indents = 2;
      function indent() {
        return Array(indents).join("  ");
      }
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        if (suite.root) {
          return;
        }
        ++indents;
        Base.consoleLog('%s<section class="suite">', indent());
        ++indents;
        Base.consoleLog("%s<h1>%s</h1>", indent(), utils.escape(suite.title));
        Base.consoleLog("%s<dl>", indent());
      });
      runner.on(EVENT_SUITE_END, function(suite) {
        if (suite.root) {
          return;
        }
        Base.consoleLog("%s</dl>", indent());
        --indents;
        Base.consoleLog("%s</section>", indent());
        --indents;
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        Base.consoleLog("%s  <dt>%s</dt>", indent(), utils.escape(test.title));
        Base.consoleLog("%s  <dt>%s</dt>", indent(), utils.escape(test.file));
        var code = utils.escape(utils.clean(test.body));
        Base.consoleLog("%s  <dd><pre><code>%s</code></pre></dd>", indent(), code);
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        Base.consoleLog('%s  <dt class="error">%s</dt>', indent(), utils.escape(test.title));
        Base.consoleLog('%s  <dt class="error">%s</dt>', indent(), utils.escape(test.file));
        var code = utils.escape(utils.clean(test.body));
        Base.consoleLog('%s  <dd class="error"><pre><code>%s</code></pre></dd>', indent(), code);
        Base.consoleLog('%s  <dd class="error">%s</dd>', indent(), utils.escape(err));
      });
    }
    Doc.description = "HTML documentation";
  });

  // node_modules/mocha/lib/reporters/tap.js
  var require_tap = __commonJS((exports, module) => {
    "use strict";
    var util2 = require_util2();
    var Base = require_base();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var inherits = require_utils().inherits;
    var sprintf = util2.format;
    exports = module.exports = TAP;
    function TAP(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var n = 1;
      var tapVersion = "12";
      if (options && options.reporterOptions) {
        if (options.reporterOptions.tapVersion) {
          tapVersion = options.reporterOptions.tapVersion.toString();
        }
      }
      this._producer = createProducer(tapVersion);
      runner.once(EVENT_RUN_BEGIN, function() {
        self2._producer.writeVersion();
      });
      runner.on(EVENT_TEST_END, function() {
        ++n;
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        self2._producer.writePending(n, test);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        self2._producer.writePass(n, test);
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        self2._producer.writeFail(n, test, err);
      });
      runner.once(EVENT_RUN_END, function() {
        self2._producer.writeEpilogue(runner.stats);
      });
    }
    inherits(TAP, Base);
    function title(test) {
      return test.fullTitle().replace(/#/g, "");
    }
    function println(format, varArgs) {
      var vargs = Array.from(arguments);
      vargs[0] += "\n";
      import_process.default.stdout.write(sprintf.apply(null, vargs));
    }
    function createProducer(tapVersion) {
      var producers = {
        "12": new TAP12Producer(),
        "13": new TAP13Producer()
      };
      var producer = producers[tapVersion];
      if (!producer) {
        throw new Error("invalid or unsupported TAP version: " + JSON.stringify(tapVersion));
      }
      return producer;
    }
    function TAPProducer() {
    }
    TAPProducer.prototype.writeVersion = function() {
    };
    TAPProducer.prototype.writePlan = function(ntests) {
      println("%d..%d", 1, ntests);
    };
    TAPProducer.prototype.writePass = function(n, test) {
      println("ok %d %s", n, title(test));
    };
    TAPProducer.prototype.writePending = function(n, test) {
      println("ok %d %s # SKIP -", n, title(test));
    };
    TAPProducer.prototype.writeFail = function(n, test, err) {
      println("not ok %d %s", n, title(test));
    };
    TAPProducer.prototype.writeEpilogue = function(stats) {
      println("# tests " + (stats.passes + stats.failures));
      println("# pass " + stats.passes);
      println("# fail " + stats.failures);
      this.writePlan(stats.passes + stats.failures + stats.pending);
    };
    function TAP12Producer() {
      this.writeFail = function(n, test, err) {
        TAPProducer.prototype.writeFail.call(this, n, test, err);
        if (err.message) {
          println(err.message.replace(/^/gm, "  "));
        }
        if (err.stack) {
          println(err.stack.replace(/^/gm, "  "));
        }
      };
    }
    inherits(TAP12Producer, TAPProducer);
    function TAP13Producer() {
      this.writeVersion = function() {
        println("TAP version 13");
      };
      this.writeFail = function(n, test, err) {
        TAPProducer.prototype.writeFail.call(this, n, test, err);
        var emitYamlBlock = err.message != null || err.stack != null;
        if (emitYamlBlock) {
          println(indent(1) + "---");
          if (err.message) {
            println(indent(2) + "message: |-");
            println(err.message.replace(/^/gm, indent(3)));
          }
          if (err.stack) {
            println(indent(2) + "stack: |-");
            println(err.stack.replace(/^/gm, indent(3)));
          }
          println(indent(1) + "...");
        }
      };
      function indent(level) {
        return Array(level + 1).join("  ");
      }
    }
    inherits(TAP13Producer, TAPProducer);
    TAP.description = "TAP-compatible output";
  });

  // node_modules/mocha/lib/reporters/json.js
  var require_json = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    exports = module.exports = JSONReporter;
    function JSONReporter(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var tests = [];
      var pending = [];
      var failures = [];
      var passes = [];
      runner.on(EVENT_TEST_END, function(test) {
        tests.push(test);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        passes.push(test);
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        failures.push(test);
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        pending.push(test);
      });
      runner.once(EVENT_RUN_END, function() {
        var obj = {
          stats: self2.stats,
          tests: tests.map(clean),
          pending: pending.map(clean),
          failures: failures.map(clean),
          passes: passes.map(clean)
        };
        runner.testResults = obj;
        import_process.default.stdout.write(JSON.stringify(obj, null, 2));
      });
    }
    function clean(test) {
      var err = test.err || {};
      if (err instanceof Error) {
        err = errorJSON(err);
      }
      return {
        title: test.title,
        fullTitle: test.fullTitle(),
        file: test.file,
        duration: test.duration,
        currentRetry: test.currentRetry(),
        speed: test.speed,
        err: cleanCycles(err)
      };
    }
    function cleanCycles(obj) {
      var cache = [];
      return JSON.parse(JSON.stringify(obj, function(key, value) {
        if (typeof value === "object" && value !== null) {
          if (cache.indexOf(value) !== -1) {
            return "" + value;
          }
          cache.push(value);
        }
        return value;
      }));
    }
    function errorJSON(err) {
      var res = {};
      Object.getOwnPropertyNames(err).forEach(function(key) {
        res[key] = err[key];
      }, err);
      return res;
    }
    JSONReporter.description = "single JSON object";
  });

  // node_modules/mocha/lib/browser/progress.js
  var require_progress = __commonJS((exports, module) => {
    "use strict";
    module.exports = Progress;
    function Progress() {
      this.percent = 0;
      this.size(0);
      this.fontSize(11);
      this.font("helvetica, arial, sans-serif");
    }
    Progress.prototype.size = function(size) {
      this._size = size;
      return this;
    };
    Progress.prototype.text = function(text) {
      this._text = text;
      return this;
    };
    Progress.prototype.fontSize = function(size) {
      this._fontSize = size;
      return this;
    };
    Progress.prototype.font = function(family) {
      this._font = family;
      return this;
    };
    Progress.prototype.update = function(n) {
      this.percent = n;
      return this;
    };
    Progress.prototype.draw = function(ctx) {
      try {
        var percent = Math.min(this.percent, 100);
        var size = this._size;
        var half = size / 2;
        var x = half;
        var y = half;
        var rad = half - 1;
        var fontSize = this._fontSize;
        ctx.font = fontSize + "px " + this._font;
        var angle = Math.PI * 2 * (percent / 100);
        ctx.clearRect(0, 0, size, size);
        ctx.strokeStyle = "#9f9f9f";
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, angle, false);
        ctx.stroke();
        ctx.strokeStyle = "#eee";
        ctx.beginPath();
        ctx.arc(x, y, rad - 1, 0, angle, true);
        ctx.stroke();
        var text = this._text || (percent | 0) + "%";
        var w = ctx.measureText(text).width;
        ctx.fillText(text, x - w / 2 + 1, y + fontSize / 2 - 1);
      } catch (ignore) {
      }
      return this;
    };
  });

  // node_modules/mocha/lib/reporters/html.js
  var require_html = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var utils = require_utils();
    var Progress = require_progress();
    var escapeRe = require_escape_string_regexp();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var escape = utils.escape;
    var Date2 = import_global.default.Date;
    exports = module.exports = HTML;
    var statsTemplate = '<ul id="mocha-stats"><li class="progress"><canvas width="40" height="40"></canvas></li><li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li><li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li><li class="duration">duration: <em>0</em>s</li></ul>';
    var playIcon = "&#x2023;";
    function HTML(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var stats = this.stats;
      var stat = fragment(statsTemplate);
      var items = stat.getElementsByTagName("li");
      var passes = items[1].getElementsByTagName("em")[0];
      var passesLink = items[1].getElementsByTagName("a")[0];
      var failures = items[2].getElementsByTagName("em")[0];
      var failuresLink = items[2].getElementsByTagName("a")[0];
      var duration = items[3].getElementsByTagName("em")[0];
      var canvas = stat.getElementsByTagName("canvas")[0];
      var report = fragment('<ul id="mocha-report"></ul>');
      var stack = [report];
      var progress;
      var ctx;
      var root = document.getElementById("mocha");
      if (canvas.getContext) {
        var ratio = window.devicePixelRatio || 1;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        canvas.width *= ratio;
        canvas.height *= ratio;
        ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);
        progress = new Progress();
      }
      if (!root) {
        return error("#mocha div missing, add it to your document");
      }
      on(passesLink, "click", function(evt) {
        evt.preventDefault();
        unhide();
        var name = /pass/.test(report.className) ? "" : " pass";
        report.className = report.className.replace(/fail|pass/g, "") + name;
        if (report.className.trim()) {
          hideSuitesWithout("test pass");
        }
      });
      on(failuresLink, "click", function(evt) {
        evt.preventDefault();
        unhide();
        var name = /fail/.test(report.className) ? "" : " fail";
        report.className = report.className.replace(/fail|pass/g, "") + name;
        if (report.className.trim()) {
          hideSuitesWithout("test fail");
        }
      });
      root.appendChild(stat);
      root.appendChild(report);
      if (progress) {
        progress.size(40);
      }
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        if (suite.root) {
          return;
        }
        var url = self2.suiteURL(suite);
        var el = fragment('<li class="suite"><h1><a href="%s">%s</a></h1></li>', url, escape(suite.title));
        stack[0].appendChild(el);
        stack.unshift(document.createElement("ul"));
        el.appendChild(stack[0]);
      });
      runner.on(EVENT_SUITE_END, function(suite) {
        if (suite.root) {
          updateStats();
          return;
        }
        stack.shift();
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var url = self2.testURL(test);
        var markup = '<li class="test pass %e"><h2>%e<span class="duration">%ems</span> <a href="%s" class="replay">' + playIcon + "</a></h2></li>";
        var el = fragment(markup, test.speed, test.title, test.duration, url);
        self2.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        var el = fragment('<li class="test fail"><h2>%e <a href="%e" class="replay">' + playIcon + "</a></h2></li>", test.title, self2.testURL(test));
        var stackString;
        var message = test.err.toString();
        if (message === "[object Error]") {
          message = test.err.message;
        }
        if (test.err.stack) {
          var indexOfMessage = test.err.stack.indexOf(test.err.message);
          if (indexOfMessage === -1) {
            stackString = test.err.stack;
          } else {
            stackString = test.err.stack.substr(test.err.message.length + indexOfMessage);
          }
        } else if (test.err.sourceURL && test.err.line !== void 0) {
          stackString = "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
        }
        stackString = stackString || "";
        if (test.err.htmlMessage && stackString) {
          el.appendChild(fragment('<div class="html-error">%s\n<pre class="error">%e</pre></div>', test.err.htmlMessage, stackString));
        } else if (test.err.htmlMessage) {
          el.appendChild(fragment('<div class="html-error">%s</div>', test.err.htmlMessage));
        } else {
          el.appendChild(fragment('<pre class="error">%e%e</pre>', message, stackString));
        }
        self2.addCodeToggle(el, test.body);
        appendToStack(el);
        updateStats();
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        var el = fragment('<li class="test pass pending"><h2>%e</h2></li>', test.title);
        appendToStack(el);
        updateStats();
      });
      function appendToStack(el) {
        if (stack[0]) {
          stack[0].appendChild(el);
        }
      }
      function updateStats() {
        var percent = stats.tests / runner.total * 100 | 0;
        if (progress) {
          progress.update(percent).draw(ctx);
        }
        var ms = new Date2() - stats.start;
        text(passes, stats.passes);
        text(failures, stats.failures);
        text(duration, (ms / 1e3).toFixed(2));
      }
    }
    function makeUrl(s) {
      var search = window.location.search;
      if (search) {
        search = search.replace(/[?&]grep=[^&\s]*/g, "").replace(/^&/, "?");
      }
      return window.location.pathname + (search ? search + "&" : "?") + "grep=" + encodeURIComponent(escapeRe(s));
    }
    HTML.prototype.suiteURL = function(suite) {
      return makeUrl(suite.fullTitle());
    };
    HTML.prototype.testURL = function(test) {
      return makeUrl(test.fullTitle());
    };
    HTML.prototype.addCodeToggle = function(el, contents) {
      var h2 = el.getElementsByTagName("h2")[0];
      on(h2, "click", function() {
        pre.style.display = pre.style.display === "none" ? "block" : "none";
      });
      var pre = fragment("<pre><code>%e</code></pre>", utils.clean(contents));
      el.appendChild(pre);
      pre.style.display = "none";
    };
    function error(msg) {
      document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
    }
    function fragment(html) {
      var args = arguments;
      var div = document.createElement("div");
      var i = 1;
      div.innerHTML = html.replace(/%([se])/g, function(_, type) {
        switch (type) {
          case "s":
            return String(args[i++]);
          case "e":
            return escape(args[i++]);
        }
      });
      return div.firstChild;
    }
    function hideSuitesWithout(classname) {
      var suites = document.getElementsByClassName("suite");
      for (var i = 0; i < suites.length; i++) {
        var els = suites[i].getElementsByClassName(classname);
        if (!els.length) {
          suites[i].className += " hidden";
        }
      }
    }
    function unhide() {
      var els = document.getElementsByClassName("suite hidden");
      while (els.length > 0) {
        els[0].className = els[0].className.replace("suite hidden", "suite");
      }
    }
    function text(el, contents) {
      if (el.textContent) {
        el.textContent = contents;
      } else {
        el.innerText = contents;
      }
    }
    function on(el, event, fn) {
      if (el.addEventListener) {
        el.addEventListener(event, fn, false);
      } else {
        el.attachEvent("on" + event, fn);
      }
    }
    HTML.browserOnly = true;
  });

  // node_modules/mocha/lib/reporters/list.js
  var require_list = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_BEGIN = constants.EVENT_TEST_BEGIN;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var color = Base.color;
    var cursor = Base.cursor;
    exports = module.exports = List;
    function List(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var n = 0;
      runner.on(EVENT_RUN_BEGIN, function() {
        Base.consoleLog();
      });
      runner.on(EVENT_TEST_BEGIN, function(test) {
        import_process.default.stdout.write(color("pass", "    " + test.fullTitle() + ": "));
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        var fmt = color("checkmark", "  -") + color("pending", " %s");
        Base.consoleLog(fmt, test.fullTitle());
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var fmt = color("checkmark", "  " + Base.symbols.ok) + color("pass", " %s: ") + color(test.speed, "%dms");
        cursor.CR();
        Base.consoleLog(fmt, test.fullTitle(), test.duration);
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        cursor.CR();
        Base.consoleLog(color("fail", "  %d) %s"), ++n, test.fullTitle());
      });
      runner.once(EVENT_RUN_END, self2.epilogue.bind(self2));
    }
    inherits(List, Base);
    List.description = 'like "spec" reporter but flat';
  });

  // node_modules/mocha/lib/reporters/min.js
  var require_min = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    exports = module.exports = Min;
    function Min(runner, options) {
      Base.call(this, runner, options);
      runner.on(EVENT_RUN_BEGIN, function() {
        import_process.default.stdout.write("[2J");
        import_process.default.stdout.write("[1;3H");
      });
      runner.once(EVENT_RUN_END, this.epilogue.bind(this));
    }
    inherits(Min, Base);
    Min.description = "essentially just a summary";
  });

  // node_modules/mocha/lib/reporters/spec.js
  var require_spec = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var inherits = require_utils().inherits;
    var color = Base.color;
    exports = module.exports = Spec;
    function Spec(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var indents = 0;
      var n = 0;
      function indent() {
        return Array(indents).join("  ");
      }
      runner.on(EVENT_RUN_BEGIN, function() {
        Base.consoleLog();
      });
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        ++indents;
        Base.consoleLog(color("suite", "%s%s"), indent(), suite.title);
      });
      runner.on(EVENT_SUITE_END, function() {
        --indents;
        if (indents === 1) {
          Base.consoleLog();
        }
      });
      runner.on(EVENT_TEST_PENDING, function(test) {
        var fmt = indent() + color("pending", "  - %s");
        Base.consoleLog(fmt, test.title);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var fmt;
        if (test.speed === "fast") {
          fmt = indent() + color("checkmark", "  " + Base.symbols.ok) + color("pass", " %s");
          Base.consoleLog(fmt, test.title);
        } else {
          fmt = indent() + color("checkmark", "  " + Base.symbols.ok) + color("pass", " %s") + color(test.speed, " (%dms)");
          Base.consoleLog(fmt, test.title, test.duration);
        }
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        Base.consoleLog(indent() + color("fail", "  %d) %s"), ++n, test.title);
      });
      runner.once(EVENT_RUN_END, self2.epilogue.bind(self2));
    }
    inherits(Spec, Base);
    Spec.description = "hierarchical & verbose [default]";
  });

  // node_modules/mocha/lib/reporters/nyan.js
  var require_nyan = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var constants = require_runner().constants;
    var inherits = require_utils().inherits;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    exports = module.exports = NyanCat;
    function NyanCat(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.75 | 0;
      var nyanCatWidth = this.nyanCatWidth = 11;
      this.colorIndex = 0;
      this.numberOfLines = 4;
      this.rainbowColors = self2.generateColors();
      this.scoreboardWidth = 5;
      this.tick = 0;
      this.trajectories = [[], [], [], []];
      this.trajectoryWidthMax = width - nyanCatWidth;
      runner.on(EVENT_RUN_BEGIN, function() {
        Base.cursor.hide();
        self2.draw();
      });
      runner.on(EVENT_TEST_PENDING, function() {
        self2.draw();
      });
      runner.on(EVENT_TEST_PASS, function() {
        self2.draw();
      });
      runner.on(EVENT_TEST_FAIL, function() {
        self2.draw();
      });
      runner.once(EVENT_RUN_END, function() {
        Base.cursor.show();
        for (var i = 0; i < self2.numberOfLines; i++) {
          write("\n");
        }
        self2.epilogue();
      });
    }
    inherits(NyanCat, Base);
    NyanCat.prototype.draw = function() {
      this.appendRainbow();
      this.drawScoreboard();
      this.drawRainbow();
      this.drawNyanCat();
      this.tick = !this.tick;
    };
    NyanCat.prototype.drawScoreboard = function() {
      var stats = this.stats;
      function draw(type, n) {
        write(" ");
        write(Base.color(type, n));
        write("\n");
      }
      draw("green", stats.passes);
      draw("fail", stats.failures);
      draw("pending", stats.pending);
      write("\n");
      this.cursorUp(this.numberOfLines);
    };
    NyanCat.prototype.appendRainbow = function() {
      var segment = this.tick ? "_" : "-";
      var rainbowified = this.rainbowify(segment);
      for (var index = 0; index < this.numberOfLines; index++) {
        var trajectory = this.trajectories[index];
        if (trajectory.length >= this.trajectoryWidthMax) {
          trajectory.shift();
        }
        trajectory.push(rainbowified);
      }
    };
    NyanCat.prototype.drawRainbow = function() {
      var self2 = this;
      this.trajectories.forEach(function(line) {
        write("[" + self2.scoreboardWidth + "C");
        write(line.join(""));
        write("\n");
      });
      this.cursorUp(this.numberOfLines);
    };
    NyanCat.prototype.drawNyanCat = function() {
      var self2 = this;
      var startWidth = this.scoreboardWidth + this.trajectories[0].length;
      var dist = "[" + startWidth + "C";
      var padding = "";
      write(dist);
      write("_,------,");
      write("\n");
      write(dist);
      padding = self2.tick ? "  " : "   ";
      write("_|" + padding + "/\\_/\\ ");
      write("\n");
      write(dist);
      padding = self2.tick ? "_" : "__";
      var tail = self2.tick ? "~" : "^";
      write(tail + "|" + padding + this.face() + " ");
      write("\n");
      write(dist);
      padding = self2.tick ? " " : "  ";
      write(padding + '""  "" ');
      write("\n");
      this.cursorUp(this.numberOfLines);
    };
    NyanCat.prototype.face = function() {
      var stats = this.stats;
      if (stats.failures) {
        return "( x .x)";
      } else if (stats.pending) {
        return "( o .o)";
      } else if (stats.passes) {
        return "( ^ .^)";
      }
      return "( - .-)";
    };
    NyanCat.prototype.cursorUp = function(n) {
      write("[" + n + "A");
    };
    NyanCat.prototype.cursorDown = function(n) {
      write("[" + n + "B");
    };
    NyanCat.prototype.generateColors = function() {
      var colors = [];
      for (var i = 0; i < 6 * 7; i++) {
        var pi3 = Math.floor(Math.PI / 3);
        var n = i * (1 / 6);
        var r = Math.floor(3 * Math.sin(n) + 3);
        var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
        var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
        colors.push(36 * r + 6 * g + b + 16);
      }
      return colors;
    };
    NyanCat.prototype.rainbowify = function(str) {
      if (!Base.useColors) {
        return str;
      }
      var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
      this.colorIndex += 1;
      return "[38;5;" + color + "m" + str + "[0m";
    };
    function write(string) {
      import_process.default.stdout.write(string);
    }
    NyanCat.description = '"nyan cat"';
  });

  // (disabled):fs
  var require_fs = __commonJS(() => {
  });

  // node_modules/mocha/lib/reporters/xunit.js
  var require_xunit = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var utils = require_utils();
    var fs = require_fs();
    var path = require_path();
    var errors = require_errors();
    var createUnsupportedError = errors.createUnsupportedError;
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var STATE_FAILED = require_runnable().constants.STATE_FAILED;
    var inherits = utils.inherits;
    var escape = utils.escape;
    var Date2 = import_global.default.Date;
    exports = module.exports = XUnit;
    function XUnit(runner, options) {
      Base.call(this, runner, options);
      var stats = this.stats;
      var tests = [];
      var self2 = this;
      var suiteName;
      var DEFAULT_SUITE_NAME = "Mocha Tests";
      if (options && options.reporterOptions) {
        if (options.reporterOptions.output) {
          if (!fs.createWriteStream) {
            throw createUnsupportedError("file output not supported in browser");
          }
          fs.mkdirSync(path.dirname(options.reporterOptions.output), {
            recursive: true
          });
          self2.fileStream = fs.createWriteStream(options.reporterOptions.output);
        }
        suiteName = options.reporterOptions.suiteName;
      }
      suiteName = suiteName || DEFAULT_SUITE_NAME;
      runner.on(EVENT_TEST_PENDING, function(test) {
        tests.push(test);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        tests.push(test);
      });
      runner.on(EVENT_TEST_FAIL, function(test) {
        tests.push(test);
      });
      runner.once(EVENT_RUN_END, function() {
        self2.write(tag("testsuite", {
          name: suiteName,
          tests: stats.tests,
          failures: 0,
          errors: stats.failures,
          skipped: stats.tests - stats.failures - stats.passes,
          timestamp: new Date2().toUTCString(),
          time: stats.duration / 1e3 || 0
        }, false));
        tests.forEach(function(t) {
          self2.test(t);
        });
        self2.write("</testsuite>");
      });
    }
    inherits(XUnit, Base);
    XUnit.prototype.done = function(failures, fn) {
      if (this.fileStream) {
        this.fileStream.end(function() {
          fn(failures);
        });
      } else {
        fn(failures);
      }
    };
    XUnit.prototype.write = function(line) {
      if (this.fileStream) {
        this.fileStream.write(line + "\n");
      } else if (typeof import_process.default === "object" && import_process.default.stdout) {
        import_process.default.stdout.write(line + "\n");
      } else {
        Base.consoleLog(line);
      }
    };
    XUnit.prototype.test = function(test) {
      Base.useColors = false;
      var attrs = {
        classname: test.parent.fullTitle(),
        name: test.title,
        time: test.duration / 1e3 || 0
      };
      if (test.state === STATE_FAILED) {
        var err = test.err;
        var diff = !Base.hideDiff && Base.showDiff(err) ? "\n" + Base.generateDiff(err.actual, err.expected) : "";
        this.write(tag("testcase", attrs, false, tag("failure", {}, false, escape(err.message) + escape(diff) + "\n" + escape(err.stack))));
      } else if (test.isPending()) {
        this.write(tag("testcase", attrs, false, tag("skipped", {}, true)));
      } else {
        this.write(tag("testcase", attrs, true));
      }
    };
    function tag(name, attrs, close, content) {
      var end = close ? "/>" : ">";
      var pairs = [];
      var tag2;
      for (var key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
          pairs.push(key + '="' + escape(attrs[key]) + '"');
        }
      }
      tag2 = "<" + name + (pairs.length ? " " + pairs.join(" ") : "") + end;
      if (content) {
        tag2 += content + "</" + name + end;
      }
      return tag2;
    }
    XUnit.description = "XUnit-compatible XML output";
  });

  // node_modules/mocha/lib/reporters/markdown.js
  var require_markdown = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var utils = require_utils();
    var constants = require_runner().constants;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_SUITE_END = constants.EVENT_SUITE_END;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var SUITE_PREFIX = "$";
    exports = module.exports = Markdown;
    function Markdown(runner, options) {
      Base.call(this, runner, options);
      var level = 0;
      var buf = "";
      function title(str) {
        return Array(level).join("#") + " " + str;
      }
      function mapTOC(suite, obj) {
        var ret = obj;
        var key = SUITE_PREFIX + suite.title;
        obj = obj[key] = obj[key] || {suite};
        suite.suites.forEach(function(suite2) {
          mapTOC(suite2, obj);
        });
        return ret;
      }
      function stringifyTOC(obj, level2) {
        ++level2;
        var buf2 = "";
        var link;
        for (var key in obj) {
          if (key === "suite") {
            continue;
          }
          if (key !== SUITE_PREFIX) {
            link = " - [" + key.substring(1) + "]";
            link += "(#" + utils.slug(obj[key].suite.fullTitle()) + ")\n";
            buf2 += Array(level2).join("  ") + link;
          }
          buf2 += stringifyTOC(obj[key], level2);
        }
        return buf2;
      }
      function generateTOC(suite) {
        var obj = mapTOC(suite, {});
        return stringifyTOC(obj, 0);
      }
      generateTOC(runner.suite);
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        ++level;
        var slug = utils.slug(suite.fullTitle());
        buf += '<a name="' + slug + '"></a>\n';
        buf += title(suite.title) + "\n";
      });
      runner.on(EVENT_SUITE_END, function() {
        --level;
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        var code = utils.clean(test.body);
        buf += test.title + ".\n";
        buf += "\n```js\n";
        buf += code + "\n";
        buf += "```\n\n";
      });
      runner.once(EVENT_RUN_END, function() {
        import_process.default.stdout.write("# TOC\n");
        import_process.default.stdout.write(generateTOC(runner.suite));
        import_process.default.stdout.write(buf);
      });
    }
    Markdown.description = "GitHub Flavored Markdown";
  });

  // node_modules/mocha/lib/reporters/progress.js
  var require_progress2 = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var inherits = require_utils().inherits;
    var color = Base.color;
    var cursor = Base.cursor;
    exports = module.exports = Progress;
    Base.colors.progress = 90;
    function Progress(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.5 | 0;
      var total = runner.total;
      var complete = 0;
      var lastN = -1;
      options = options || {};
      var reporterOptions = options.reporterOptions || {};
      options.open = reporterOptions.open || "[";
      options.complete = reporterOptions.complete || "\u25AC";
      options.incomplete = reporterOptions.incomplete || Base.symbols.dot;
      options.close = reporterOptions.close || "]";
      options.verbose = reporterOptions.verbose || false;
      runner.on(EVENT_RUN_BEGIN, function() {
        import_process.default.stdout.write("\n");
        cursor.hide();
      });
      runner.on(EVENT_TEST_END, function() {
        complete++;
        var percent = complete / total;
        var n = width * percent | 0;
        var i = width - n;
        if (n === lastN && !options.verbose) {
          return;
        }
        lastN = n;
        cursor.CR();
        import_process.default.stdout.write("[J");
        import_process.default.stdout.write(color("progress", "  " + options.open));
        import_process.default.stdout.write(Array(n).join(options.complete));
        import_process.default.stdout.write(Array(i).join(options.incomplete));
        import_process.default.stdout.write(color("progress", options.close));
        if (options.verbose) {
          import_process.default.stdout.write(color("progress", " " + complete + " of " + total));
        }
      });
      runner.once(EVENT_RUN_END, function() {
        cursor.show();
        import_process.default.stdout.write("\n");
        self2.epilogue();
      });
    }
    inherits(Progress, Base);
    Progress.description = "a progress bar";
  });

  // node_modules/mocha/lib/reporters/landing.js
  var require_landing = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var inherits = require_utils().inherits;
    var constants = require_runner().constants;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var STATE_FAILED = require_runnable().constants.STATE_FAILED;
    var cursor = Base.cursor;
    var color = Base.color;
    exports = module.exports = Landing;
    Base.colors.plane = 0;
    Base.colors["plane crash"] = 31;
    Base.colors.runway = 90;
    function Landing(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var width = Base.window.width * 0.75 | 0;
      var stream = import_process.default.stdout;
      var plane = color("plane", "\u2708");
      var crashed = -1;
      var n = 0;
      var total = 0;
      function runway() {
        var buf = Array(width).join("-");
        return "  " + color("runway", buf);
      }
      runner.on(EVENT_RUN_BEGIN, function() {
        stream.write("\n\n\n  ");
        cursor.hide();
      });
      runner.on(EVENT_TEST_END, function(test) {
        var col = crashed === -1 ? width * ++n / ++total | 0 : crashed;
        if (test.state === STATE_FAILED) {
          plane = color("plane crash", "\u2708");
          crashed = col;
        }
        stream.write("[" + (width + 1) + "D[2A");
        stream.write(runway());
        stream.write("\n  ");
        stream.write(color("runway", Array(col).join("\u22C5")));
        stream.write(plane);
        stream.write(color("runway", Array(width - col).join("\u22C5") + "\n"));
        stream.write(runway());
        stream.write("[0m");
      });
      runner.once(EVENT_RUN_END, function() {
        cursor.show();
        import_process.default.stdout.write("\n");
        self2.epilogue();
      });
      import_process.default.once("SIGINT", function() {
        cursor.show();
        import_process.default.nextTick(function() {
          import_process.default.kill(import_process.default.pid, "SIGINT");
        });
      });
    }
    inherits(Landing, Base);
    Landing.description = "Unicode landing strip";
  });

  // node_modules/mocha/lib/reporters/json-stream.js
  var require_json_stream = __commonJS((exports, module) => {
    "use strict";
    var Base = require_base();
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    exports = module.exports = JSONStream;
    function JSONStream(runner, options) {
      Base.call(this, runner, options);
      var self2 = this;
      var total = runner.total;
      runner.once(EVENT_RUN_BEGIN, function() {
        writeEvent(["start", {total}]);
      });
      runner.on(EVENT_TEST_PASS, function(test) {
        writeEvent(["pass", clean(test)]);
      });
      runner.on(EVENT_TEST_FAIL, function(test, err) {
        test = clean(test);
        test.err = err.message;
        test.stack = err.stack || null;
        writeEvent(["fail", test]);
      });
      runner.once(EVENT_RUN_END, function() {
        writeEvent(["end", self2.stats]);
      });
    }
    function writeEvent(event) {
      import_process.default.stdout.write(JSON.stringify(event) + "\n");
    }
    function clean(test) {
      return {
        title: test.title,
        fullTitle: test.fullTitle(),
        file: test.file,
        duration: test.duration,
        currentRetry: test.currentRetry(),
        speed: test.speed
      };
    }
    JSONStream.description = "newline delimited JSON events";
  });

  // node_modules/mocha/lib/reporters/index.js
  var require_reporters = __commonJS((exports) => {
    "use strict";
    exports.Base = exports.base = require_base();
    exports.Dot = exports.dot = require_dot();
    exports.Doc = exports.doc = require_doc();
    exports.TAP = exports.tap = require_tap();
    exports.JSON = exports.json = require_json();
    exports.HTML = exports.html = require_html();
    exports.List = exports.list = require_list();
    exports.Min = exports.min = require_min();
    exports.Spec = exports.spec = require_spec();
    exports.Nyan = exports.nyan = require_nyan();
    exports.XUnit = exports.xunit = require_xunit();
    exports.Markdown = exports.markdown = require_markdown();
    exports.Progress = exports.progress = require_progress2();
    exports.Landing = exports.landing = require_landing();
    exports.JSONStream = exports["json-stream"] = require_json_stream();
  });

  // node_modules/mocha/package.json
  var require_package = __commonJS((exports, module) => {
    module.exports = {
      name: "mocha",
      version: "8.3.0",
      description: "simple, flexible, fun test framework",
      keywords: [
        "mocha",
        "test",
        "bdd",
        "tdd",
        "tap",
        "testing",
        "chai",
        "assertion",
        "ava",
        "jest",
        "tape",
        "jasmine",
        "karma"
      ],
      funding: {
        type: "opencollective",
        url: "https://opencollective.com/mochajs"
      },
      author: "TJ Holowaychuk <tj@vision-media.ca>",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/mochajs/mocha.git"
      },
      bugs: {
        url: "https://github.com/mochajs/mocha/issues/"
      },
      homepage: "https://mochajs.org/",
      logo: "https://cldup.com/S9uQ-cOLYz.svg",
      notifyLogo: "https://ibin.co/4QuRuGjXvl36.png",
      bin: {
        mocha: "./bin/mocha",
        _mocha: "./bin/_mocha"
      },
      directories: {
        lib: "./lib",
        test: "./test"
      },
      engines: {
        node: ">= 10.12.0"
      },
      scripts: {
        prepublishOnly: "nps test clean build",
        start: "nps",
        test: "nps test",
        version: "nps version",
        "test:smoke": "node ./bin/mocha --no-config test/smoke/smoke.spec.js"
      },
      dependencies: {
        "@ungap/promise-all-settled": "1.1.2",
        "ansi-colors": "4.1.1",
        "browser-stdout": "1.3.1",
        chokidar: "3.5.1",
        debug: "4.3.1",
        diff: "5.0.0",
        "escape-string-regexp": "4.0.0",
        "find-up": "5.0.0",
        glob: "7.1.6",
        growl: "1.10.5",
        he: "1.2.0",
        "js-yaml": "4.0.0",
        "log-symbols": "4.0.0",
        minimatch: "3.0.4",
        ms: "2.1.3",
        nanoid: "3.1.20",
        "serialize-javascript": "5.0.1",
        "strip-json-comments": "3.1.1",
        "supports-color": "8.1.1",
        which: "2.0.2",
        "wide-align": "1.1.3",
        workerpool: "6.1.0",
        yargs: "16.2.0",
        "yargs-parser": "20.2.4",
        "yargs-unparser": "2.0.0"
      },
      devDependencies: {
        "@11ty/eleventy": "^0.11.0",
        "@11ty/eleventy-plugin-inclusive-language": "^1.0.0",
        "@babel/preset-env": "^7.11.0",
        "@mocha/docdash": "^3.0.1",
        "@rollup/plugin-babel": "^5.1.0",
        "@rollup/plugin-commonjs": "^14.0.0",
        "@rollup/plugin-json": "^4.1.0",
        "@rollup/plugin-multi-entry": "^3.0.1",
        "@rollup/plugin-node-resolve": "^8.4.0",
        "assetgraph-builder": "^8.1.0",
        autoprefixer: "^9.8.6",
        "babel-eslint": "^10.1.0",
        canvas: "^2.6.1",
        chai: "^4.2.0",
        "coffee-script": "^1.12.7",
        configstore: "^5.0.1",
        "core-js": "^3.6.5",
        coveralls: "^3.1.0",
        "cross-env": "^7.0.2",
        "cross-spawn": "^7.0.3",
        eslint: "^7.8.1",
        "eslint-config-prettier": "^6.11.0",
        "eslint-config-semistandard": "^15.0.1",
        "eslint-config-standard": "^14.1.1",
        "eslint-plugin-import": "^2.22.0",
        "eslint-plugin-node": "^11.0.0",
        "eslint-plugin-prettier": "^3.1.4",
        "eslint-plugin-promise": "^4.2.1",
        "eslint-plugin-standard": "^4.0.1",
        "fail-on-errors-webpack-plugin": "^3.0.0",
        "fs-extra": "^9.0.1",
        husky: "^4.2.5",
        hyperlink: "^4.5.2",
        jsdoc: "^3.6.5",
        "jsdoc-ts-utils": "^1.1.2",
        karma: "^5.1.1",
        "karma-chrome-launcher": "^3.1.0",
        "karma-mocha": "^2.0.1",
        "karma-mocha-reporter": "^2.2.5",
        "karma-requirejs": "^1.1.0",
        "karma-sauce-launcher": "^4.3.4",
        "lint-staged": "^10.2.11",
        "markdown-it": "^11.0.0",
        "markdown-it-anchor": "^5.3.0",
        "markdown-it-attrs": "^3.0.3",
        "markdown-it-emoji": "^1.4.0",
        "markdown-it-prism": "^2.1.1",
        "markdown-toc": "^1.2.0",
        "markdownlint-cli": "^0.23.2",
        needle: "^2.5.0",
        nps: "^5.10.0",
        nyc: "^15.1.0",
        pidtree: "^0.5.0",
        prettier: "^1.19.1",
        remark: "^12.0.1",
        "remark-github": "^9.0.1",
        "remark-inline-links": "^4.0.0",
        requirejs: "^2.3.6",
        rewiremock: "^3.14.3",
        rimraf: "^3.0.2",
        rollup: "^2.23.1",
        "rollup-plugin-node-globals": "^1.4.0",
        "rollup-plugin-node-polyfills": "^0.2.1",
        "rollup-plugin-visualizer": "^4.1.0",
        sinon: "^9.0.3",
        "strip-ansi": "^6.0.0",
        svgo: "^1.3.2",
        through2: "^4.0.2",
        "to-vfile": "^6.1.0",
        touch: "^3.1.0",
        unexpected: "^11.14.0",
        "unexpected-eventemitter": "^2.2.0",
        "unexpected-map": "^2.0.0",
        "unexpected-set": "^3.0.0",
        "unexpected-sinon": "^10.11.2",
        "update-notifier": "^4.1.0",
        uslug: "^1.0.4",
        uuid: "^8.3.0",
        watchify: "^3.11.1",
        webpack: "^4.44.1",
        "webpack-cli": "^3.3.12"
      },
      files: [
        "bin/*mocha",
        "assets/growl/*.png",
        "lib/**/*.{js,html,json}",
        "index.js",
        "mocha.css",
        "mocha.js",
        "mocha.js.map",
        "browser-entry.js"
      ],
      browser: {
        "./index.js": "./browser-entry.js",
        "./lib/nodejs/growl.js": "./lib/browser/growl.js",
        "./lib/esm-utils.js": false,
        fs: false,
        path: false,
        "supports-color": false,
        "./lib/nodejs/serializer.js": false,
        "./lib/nodejs/worker.js": false,
        "./lib/nodejs/buffered-worker-pool.js": false,
        "./lib/nodejs/parallel-buffered-runner.js": false,
        "./lib/nodejs/reporters/parallel-buffered.js": false,
        "./lib/nodejs/file-unloader.js": false,
        "./lib/cli/index.js": false
      },
      prettier: {
        singleQuote: true,
        bracketSpacing: false,
        endOfLine: "auto"
      },
      gitter: "https://gitter.im/mochajs/mocha",
      husky: {
        hooks: {
          "pre-commit": "lint-staged"
        }
      }
    };
  });

  // node_modules/mocha/lib/browser/growl.js
  var require_growl = __commonJS((exports) => {
    "use strict";
    var Date2 = import_global.default.Date;
    var setTimeout2 = import_global.default.setTimeout;
    var EVENT_RUN_END = require_runner().constants.EVENT_RUN_END;
    var isBrowser = require_utils().isBrowser;
    exports.isCapable = function() {
      var hasNotificationSupport = "Notification" in window;
      var hasPromiseSupport = typeof Promise === "function";
      return isBrowser() && hasNotificationSupport && hasPromiseSupport;
    };
    exports.notify = function(runner) {
      var promise = isPermitted();
      var sendNotification = function() {
        Promise.race([promise, Promise.resolve(void 0)]).then(canNotify).then(function() {
          display(runner);
        }).catch(notPermitted);
      };
      runner.once(EVENT_RUN_END, sendNotification);
    };
    function isPermitted() {
      var permitted = {
        granted: function allow() {
          return Promise.resolve(true);
        },
        denied: function deny() {
          return Promise.resolve(false);
        },
        default: function ask() {
          return Notification.requestPermission().then(function(permission) {
            return permission === "granted";
          });
        }
      };
      return permitted[Notification.permission]();
    }
    function canNotify(value) {
      if (!value) {
        var why = value === false ? "blocked" : "unacknowledged";
        var reason = "not permitted by user (" + why + ")";
        return Promise.reject(new Error(reason));
      }
      return Promise.resolve();
    }
    function display(runner) {
      var stats = runner.stats;
      var symbol = {
        cross: "\u274C",
        tick: "\u2705"
      };
      var logo = require_package().notifyLogo;
      var _message;
      var message;
      var title;
      if (stats.failures) {
        _message = stats.failures + " of " + stats.tests + " tests failed";
        message = symbol.cross + " " + _message;
        title = "Failed";
      } else {
        _message = stats.passes + " tests passed in " + stats.duration + "ms";
        message = symbol.tick + " " + _message;
        title = "Passed";
      }
      var options = {
        badge: logo,
        body: message,
        dir: "ltr",
        icon: logo,
        lang: "en-US",
        name: "mocha",
        requireInteraction: false,
        timestamp: Date2.now()
      };
      var notification = new Notification(title, options);
      var FORCE_DURATION = 4e3;
      setTimeout2(notification.close.bind(notification), FORCE_DURATION);
    }
    function notPermitted(err) {
      console.error("notification error:", err.message);
    }
  });

  // node_modules/mocha/lib/mocharc.json
  var require_mocharc = __commonJS((exports, module) => {
    module.exports = {
      diff: true,
      extension: ["js", "cjs", "mjs"],
      package: "./package.json",
      reporter: "spec",
      slow: 75,
      timeout: 2e3,
      ui: "bdd",
      "watch-ignore": ["node_modules", ".git"]
    };
  });

  // (disabled):node_modules/mocha/lib/esm-utils.js
  var require_esm_utils = __commonJS(() => {
  });

  // node_modules/mocha/lib/stats-collector.js
  var require_stats_collector = __commonJS((exports, module) => {
    "use strict";
    var constants = require_runner().constants;
    var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
    var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
    var EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
    var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
    var EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
    var EVENT_RUN_END = constants.EVENT_RUN_END;
    var EVENT_TEST_END = constants.EVENT_TEST_END;
    var Date2 = import_global.default.Date;
    function createStatsCollector(runner) {
      var stats = {
        suites: 0,
        tests: 0,
        passes: 0,
        pending: 0,
        failures: 0
      };
      if (!runner) {
        throw new TypeError("Missing runner argument");
      }
      runner.stats = stats;
      runner.once(EVENT_RUN_BEGIN, function() {
        stats.start = new Date2();
      });
      runner.on(EVENT_SUITE_BEGIN, function(suite) {
        suite.root || stats.suites++;
      });
      runner.on(EVENT_TEST_PASS, function() {
        stats.passes++;
      });
      runner.on(EVENT_TEST_FAIL, function() {
        stats.failures++;
      });
      runner.on(EVENT_TEST_PENDING, function() {
        stats.pending++;
      });
      runner.on(EVENT_TEST_END, function() {
        stats.tests++;
      });
      runner.once(EVENT_RUN_END, function() {
        stats.end = new Date2();
        stats.duration = stats.end - stats.start;
      });
    }
    module.exports = createStatsCollector;
  });

  // node_modules/mocha/lib/test.js
  var require_test = __commonJS((exports, module) => {
    "use strict";
    var Runnable = require_runnable();
    var utils = require_utils();
    var errors = require_errors();
    var createInvalidArgumentTypeError = errors.createInvalidArgumentTypeError;
    var isString = utils.isString;
    var {MOCHA_ID_PROP_NAME} = utils.constants;
    module.exports = Test;
    function Test(title, fn) {
      if (!isString(title)) {
        throw createInvalidArgumentTypeError('Test argument "title" should be a string. Received type "' + typeof title + '"', "title", "string");
      }
      this.type = "test";
      Runnable.call(this, title, fn);
      this.reset();
    }
    utils.inherits(Test, Runnable);
    Test.prototype.reset = function() {
      Runnable.prototype.reset.call(this);
      this.pending = !this.fn;
      delete this.state;
    };
    Test.prototype.retriedTest = function(n) {
      if (!arguments.length) {
        return this._retriedTest;
      }
      this._retriedTest = n;
    };
    Test.prototype.markOnly = function() {
      this.parent.appendOnlyTest(this);
    };
    Test.prototype.clone = function() {
      var test = new Test(this.title, this.fn);
      test.timeout(this.timeout());
      test.slow(this.slow());
      test.retries(this.retries());
      test.currentRetry(this.currentRetry());
      test.retriedTest(this.retriedTest() || this);
      test.globals(this.globals());
      test.parent = this.parent;
      test.file = this.file;
      test.ctx = this.ctx;
      return test;
    };
    Test.prototype.serialize = function serialize() {
      return {
        $$currentRetry: this._currentRetry,
        $$fullTitle: this.fullTitle(),
        $$isPending: this.pending,
        $$retriedTest: this._retriedTest || null,
        $$slow: this._slow,
        $$titlePath: this.titlePath(),
        body: this.body,
        duration: this.duration,
        err: this.err,
        parent: {
          $$fullTitle: this.parent.fullTitle(),
          [MOCHA_ID_PROP_NAME]: this.parent.id
        },
        speed: this.speed,
        state: this.state,
        title: this.title,
        type: this.type,
        file: this.file,
        [MOCHA_ID_PROP_NAME]: this.id
      };
    };
  });

  // node_modules/mocha/lib/interfaces/common.js
  var require_common2 = __commonJS((exports, module) => {
    "use strict";
    var Suite = require_suite();
    var errors = require_errors();
    var createMissingArgumentError = errors.createMissingArgumentError;
    var createUnsupportedError = errors.createUnsupportedError;
    var createForbiddenExclusivityError = errors.createForbiddenExclusivityError;
    module.exports = function(suites, context, mocha2) {
      function shouldBeTested(suite) {
        return !mocha2.options.grep || mocha2.options.grep && mocha2.options.grep.test(suite.fullTitle()) && !mocha2.options.invert;
      }
      return {
        runWithSuite: function runWithSuite(suite) {
          return function run() {
            suite.run();
          };
        },
        before: function(name, fn) {
          suites[0].beforeAll(name, fn);
        },
        after: function(name, fn) {
          suites[0].afterAll(name, fn);
        },
        beforeEach: function(name, fn) {
          suites[0].beforeEach(name, fn);
        },
        afterEach: function(name, fn) {
          suites[0].afterEach(name, fn);
        },
        suite: {
          only: function only(opts) {
            if (mocha2.options.forbidOnly) {
              throw createForbiddenExclusivityError(mocha2);
            }
            opts.isOnly = true;
            return this.create(opts);
          },
          skip: function skip(opts) {
            opts.pending = true;
            return this.create(opts);
          },
          create: function create(opts) {
            var suite = Suite.create(suites[0], opts.title);
            suite.pending = Boolean(opts.pending);
            suite.file = opts.file;
            suites.unshift(suite);
            if (opts.isOnly) {
              suite.markOnly();
            }
            if (suite.pending && mocha2.options.forbidPending && shouldBeTested(suite)) {
              throw createUnsupportedError("Pending test forbidden");
            }
            if (typeof opts.fn === "function") {
              opts.fn.call(suite);
              suites.shift();
            } else if (typeof opts.fn === "undefined" && !suite.pending) {
              throw createMissingArgumentError('Suite "' + suite.fullTitle() + '" was defined but no callback was supplied. Supply a callback or explicitly skip the suite.', "callback", "function");
            } else if (!opts.fn && suite.pending) {
              suites.shift();
            }
            return suite;
          }
        },
        test: {
          only: function(mocha3, test) {
            if (mocha3.options.forbidOnly) {
              throw createForbiddenExclusivityError(mocha3);
            }
            test.markOnly();
            return test;
          },
          skip: function(title) {
            context.test(title);
          },
          retries: function(n) {
            context.retries(n);
          }
        }
      };
    };
  });

  // node_modules/mocha/lib/interfaces/bdd.js
  var require_bdd = __commonJS((exports, module) => {
    "use strict";
    var Test = require_test();
    var EVENT_FILE_PRE_REQUIRE = require_suite().constants.EVENT_FILE_PRE_REQUIRE;
    module.exports = function bddInterface(suite) {
      var suites = [suite];
      suite.on(EVENT_FILE_PRE_REQUIRE, function(context, file, mocha2) {
        var common = require_common2()(suites, context, mocha2);
        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha2.options.delay && common.runWithSuite(suite);
        context.describe = context.context = function(title, fn) {
          return common.suite.create({
            title,
            file,
            fn
          });
        };
        context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
          return common.suite.skip({
            title,
            file,
            fn
          });
        };
        context.describe.only = function(title, fn) {
          return common.suite.only({
            title,
            file,
            fn
          });
        };
        context.it = context.specify = function(title, fn) {
          var suite2 = suites[0];
          if (suite2.isPending()) {
            fn = null;
          }
          var test = new Test(title, fn);
          test.file = file;
          suite2.addTest(test);
          return test;
        };
        context.it.only = function(title, fn) {
          return common.test.only(mocha2, context.it(title, fn));
        };
        context.xit = context.xspecify = context.it.skip = function(title) {
          return context.it(title);
        };
        context.it.retries = function(n) {
          context.retries(n);
        };
      });
    };
    module.exports.description = "BDD or RSpec style [default]";
  });

  // node_modules/mocha/lib/interfaces/tdd.js
  var require_tdd = __commonJS((exports, module) => {
    "use strict";
    var Test = require_test();
    var EVENT_FILE_PRE_REQUIRE = require_suite().constants.EVENT_FILE_PRE_REQUIRE;
    module.exports = function(suite) {
      var suites = [suite];
      suite.on(EVENT_FILE_PRE_REQUIRE, function(context, file, mocha2) {
        var common = require_common2()(suites, context, mocha2);
        context.setup = common.beforeEach;
        context.teardown = common.afterEach;
        context.suiteSetup = common.before;
        context.suiteTeardown = common.after;
        context.run = mocha2.options.delay && common.runWithSuite(suite);
        context.suite = function(title, fn) {
          return common.suite.create({
            title,
            file,
            fn
          });
        };
        context.suite.skip = function(title, fn) {
          return common.suite.skip({
            title,
            file,
            fn
          });
        };
        context.suite.only = function(title, fn) {
          return common.suite.only({
            title,
            file,
            fn
          });
        };
        context.test = function(title, fn) {
          var suite2 = suites[0];
          if (suite2.isPending()) {
            fn = null;
          }
          var test = new Test(title, fn);
          test.file = file;
          suite2.addTest(test);
          return test;
        };
        context.test.only = function(title, fn) {
          return common.test.only(mocha2, context.test(title, fn));
        };
        context.test.skip = common.test.skip;
        context.test.retries = common.test.retries;
      });
    };
    module.exports.description = `traditional "suite"/"test" instead of BDD's "describe"/"it"`;
  });

  // node_modules/mocha/lib/interfaces/qunit.js
  var require_qunit = __commonJS((exports, module) => {
    "use strict";
    var Test = require_test();
    var EVENT_FILE_PRE_REQUIRE = require_suite().constants.EVENT_FILE_PRE_REQUIRE;
    module.exports = function qUnitInterface(suite) {
      var suites = [suite];
      suite.on(EVENT_FILE_PRE_REQUIRE, function(context, file, mocha2) {
        var common = require_common2()(suites, context, mocha2);
        context.before = common.before;
        context.after = common.after;
        context.beforeEach = common.beforeEach;
        context.afterEach = common.afterEach;
        context.run = mocha2.options.delay && common.runWithSuite(suite);
        context.suite = function(title) {
          if (suites.length > 1) {
            suites.shift();
          }
          return common.suite.create({
            title,
            file,
            fn: false
          });
        };
        context.suite.only = function(title) {
          if (suites.length > 1) {
            suites.shift();
          }
          return common.suite.only({
            title,
            file,
            fn: false
          });
        };
        context.test = function(title, fn) {
          var test = new Test(title, fn);
          test.file = file;
          suites[0].addTest(test);
          return test;
        };
        context.test.only = function(title, fn) {
          return common.test.only(mocha2, context.test(title, fn));
        };
        context.test.skip = common.test.skip;
        context.test.retries = common.test.retries;
      });
    };
    module.exports.description = "QUnit style";
  });

  // node_modules/mocha/lib/interfaces/exports.js
  var require_exports = __commonJS((exports, module) => {
    "use strict";
    var Suite = require_suite();
    var Test = require_test();
    module.exports = function(suite) {
      var suites = [suite];
      suite.on(Suite.constants.EVENT_FILE_REQUIRE, visit);
      function visit(obj, file) {
        var suite2;
        for (var key in obj) {
          if (typeof obj[key] === "function") {
            var fn = obj[key];
            switch (key) {
              case "before":
                suites[0].beforeAll(fn);
                break;
              case "after":
                suites[0].afterAll(fn);
                break;
              case "beforeEach":
                suites[0].beforeEach(fn);
                break;
              case "afterEach":
                suites[0].afterEach(fn);
                break;
              default:
                var test = new Test(key, fn);
                test.file = file;
                suites[0].addTest(test);
            }
          } else {
            suite2 = Suite.create(suites[0], key);
            suites.unshift(suite2);
            visit(obj[key], file);
            suites.shift();
          }
        }
      }
    };
    module.exports.description = 'Node.js module ("exports") style';
  });

  // node_modules/mocha/lib/interfaces/index.js
  var require_interfaces = __commonJS((exports) => {
    "use strict";
    exports.bdd = require_bdd();
    exports.tdd = require_tdd();
    exports.qunit = require_qunit();
    exports.exports = require_exports();
  });

  // node_modules/mocha/lib/context.js
  var require_context = __commonJS((exports, module) => {
    "use strict";
    module.exports = Context;
    function Context() {
    }
    Context.prototype.runnable = function(runnable) {
      if (!arguments.length) {
        return this._runnable;
      }
      this.test = this._runnable = runnable;
      return this;
    };
    Context.prototype.timeout = function(ms) {
      if (!arguments.length) {
        return this.runnable().timeout();
      }
      this.runnable().timeout(ms);
      return this;
    };
    Context.prototype.slow = function(ms) {
      if (!arguments.length) {
        return this.runnable().slow();
      }
      this.runnable().slow(ms);
      return this;
    };
    Context.prototype.skip = function() {
      this.runnable().skip();
    };
    Context.prototype.retries = function(n) {
      if (!arguments.length) {
        return this.runnable().retries();
      }
      this.runnable().retries(n);
      return this;
    };
  });

  // (disabled):node_modules/mocha/lib/nodejs/file-unloader.js
  var require_file_unloader = __commonJS(() => {
  });

  // (disabled):node_modules/mocha/lib/nodejs/parallel-buffered-runner.js
  var require_parallel_buffered_runner = __commonJS(() => {
  });

  // node_modules/mocha/lib/mocha.js
  var require_mocha = __commonJS((exports, module) => {
    "use strict";
    /*!
     * mocha
     * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
     * MIT Licensed
     */
    var escapeRe = require_escape_string_regexp();
    var path = require_path();
    var builtinReporters = require_reporters();
    var growl = require_growl();
    var utils = require_utils();
    var mocharc = require_mocharc();
    var Suite = require_suite();
    var esmUtils = utils.supportsEsModules(true) ? require_esm_utils() : void 0;
    var createStatsCollector = require_stats_collector();
    var {
      warn,
      createInvalidReporterError,
      createInvalidInterfaceError,
      createMochaInstanceAlreadyDisposedError,
      createMochaInstanceAlreadyRunningError,
      createUnsupportedError
    } = require_errors();
    var {
      EVENT_FILE_PRE_REQUIRE,
      EVENT_FILE_POST_REQUIRE,
      EVENT_FILE_REQUIRE
    } = Suite.constants;
    var sQuote = utils.sQuote;
    var debug = require_browser4()("mocha:mocha");
    exports = module.exports = Mocha2;
    var mochaStates = utils.defineConstants({
      INIT: "init",
      RUNNING: "running",
      REFERENCES_CLEANED: "referencesCleaned",
      DISPOSED: "disposed"
    });
    if (!utils.isBrowser() && typeof module.paths !== "undefined") {
      cwd = utils.cwd();
      module.paths.push(cwd, path.join(cwd, "node_modules"));
    }
    var cwd;
    exports.utils = utils;
    exports.interfaces = require_interfaces();
    exports.reporters = builtinReporters;
    exports.Runnable = require_runnable();
    exports.Context = require_context();
    exports.Runner = require_runner();
    exports.Suite = Suite;
    exports.Hook = require_hook();
    exports.Test = require_test();
    function Mocha2(options = {}) {
      options = {...mocharc, ...options};
      this.files = [];
      this.options = options;
      this.suite = new exports.Suite("", new exports.Context(), true);
      this._cleanReferencesAfterRun = true;
      this._state = mochaStates.INIT;
      this.grep(options.grep).fgrep(options.fgrep).ui(options.ui).reporter(options.reporter, options.reporterOption || options.reporterOptions).slow(options.slow).global(options.global);
      if (typeof options.timeout !== "undefined") {
        this.timeout(options.timeout === false ? 0 : options.timeout);
      }
      if ("retries" in options) {
        this.retries(options.retries);
      }
      [
        "allowUncaught",
        "asyncOnly",
        "bail",
        "checkLeaks",
        "color",
        "delay",
        "diff",
        "forbidOnly",
        "forbidPending",
        "fullTrace",
        "growl",
        "inlineDiffs",
        "invert"
      ].forEach(function(opt) {
        if (options[opt]) {
          this[opt]();
        }
      }, this);
      if (options.rootHooks) {
        this.rootHooks(options.rootHooks);
      }
      this._runnerClass = exports.Runner;
      this._lazyLoadFiles = false;
      this.isWorker = Boolean(options.isWorker);
      this.globalSetup(options.globalSetup).globalTeardown(options.globalTeardown).enableGlobalSetup(options.enableGlobalSetup).enableGlobalTeardown(options.enableGlobalTeardown);
      if (options.parallel && (typeof options.jobs === "undefined" || options.jobs > 1)) {
        debug("attempting to enable parallel mode");
        this.parallelMode(true);
      }
    }
    Mocha2.prototype.bail = function(bail) {
      this.suite.bail(bail !== false);
      return this;
    };
    Mocha2.prototype.addFile = function(file) {
      this.files.push(file);
      return this;
    };
    Mocha2.prototype.reporter = function(reporterName, reporterOptions) {
      if (typeof reporterName === "function") {
        this._reporter = reporterName;
      } else {
        reporterName = reporterName || "spec";
        var reporter;
        if (builtinReporters[reporterName]) {
          reporter = builtinReporters[reporterName];
        }
        if (!reporter) {
          try {
            reporter = require(reporterName);
          } catch (err) {
            if (err.code === "MODULE_NOT_FOUND") {
              try {
                reporter = require(path.resolve(utils.cwd(), reporterName));
              } catch (_err) {
                _err.code === "MODULE_NOT_FOUND" ? warn(sQuote(reporterName) + " reporter not found") : warn(sQuote(reporterName) + " reporter blew up with error:\n" + err.stack);
              }
            } else {
              warn(sQuote(reporterName) + " reporter blew up with error:\n" + err.stack);
            }
          }
        }
        if (!reporter) {
          throw createInvalidReporterError("invalid reporter " + sQuote(reporterName), reporterName);
        }
        this._reporter = reporter;
      }
      this.options.reporterOption = reporterOptions;
      this.options.reporterOptions = reporterOptions;
      return this;
    };
    Mocha2.prototype.ui = function(ui) {
      var bindInterface;
      if (typeof ui === "function") {
        bindInterface = ui;
      } else {
        ui = ui || "bdd";
        bindInterface = exports.interfaces[ui];
        if (!bindInterface) {
          try {
            bindInterface = require(ui);
          } catch (err) {
            throw createInvalidInterfaceError("invalid interface " + sQuote(ui), ui);
          }
        }
      }
      bindInterface(this.suite);
      this.suite.on(EVENT_FILE_PRE_REQUIRE, function(context) {
        exports.afterEach = context.afterEach || context.teardown;
        exports.after = context.after || context.suiteTeardown;
        exports.beforeEach = context.beforeEach || context.setup;
        exports.before = context.before || context.suiteSetup;
        exports.describe = context.describe || context.suite;
        exports.it = context.it || context.test;
        exports.xit = context.xit || context.test && context.test.skip;
        exports.setup = context.setup || context.beforeEach;
        exports.suiteSetup = context.suiteSetup || context.before;
        exports.suiteTeardown = context.suiteTeardown || context.after;
        exports.suite = context.suite || context.describe;
        exports.teardown = context.teardown || context.afterEach;
        exports.test = context.test || context.it;
        exports.run = context.run;
      });
      return this;
    };
    Mocha2.prototype.loadFiles = function(fn) {
      var self2 = this;
      var suite = this.suite;
      this.files.forEach(function(file) {
        file = path.resolve(file);
        suite.emit(EVENT_FILE_PRE_REQUIRE, import_global.default, file, self2);
        suite.emit(EVENT_FILE_REQUIRE, require(file), file, self2);
        suite.emit(EVENT_FILE_POST_REQUIRE, import_global.default, file, self2);
      });
      fn && fn();
    };
    Mocha2.prototype.loadFilesAsync = function() {
      var self2 = this;
      var suite = this.suite;
      this.lazyLoadFiles(true);
      if (!esmUtils) {
        return new Promise(function(resolve) {
          self2.loadFiles(resolve);
        });
      }
      return esmUtils.loadFilesAsync(this.files, function(file) {
        suite.emit(EVENT_FILE_PRE_REQUIRE, import_global.default, file, self2);
      }, function(file, resultModule) {
        suite.emit(EVENT_FILE_REQUIRE, resultModule, file, self2);
        suite.emit(EVENT_FILE_POST_REQUIRE, import_global.default, file, self2);
      });
    };
    Mocha2.unloadFile = function(file) {
      if (utils.isBrowser()) {
        throw createUnsupportedError("unloadFile() is only suported in a Node.js environment");
      }
      return require_file_unloader().unloadFile(file);
    };
    Mocha2.prototype.unloadFiles = function() {
      if (this._state === mochaStates.DISPOSED) {
        throw createMochaInstanceAlreadyDisposedError("Mocha instance is already disposed, it cannot be used again.", this._cleanReferencesAfterRun, this);
      }
      this.files.forEach(function(file) {
        Mocha2.unloadFile(file);
      });
      this._state = mochaStates.INIT;
      return this;
    };
    Mocha2.prototype.fgrep = function(str) {
      if (!str) {
        return this;
      }
      return this.grep(new RegExp(escapeRe(str)));
    };
    Mocha2.prototype.grep = function(re) {
      if (utils.isString(re)) {
        var arg = re.match(/^\/(.*)\/(g|i|)$|.*/);
        this.options.grep = new RegExp(arg[1] || arg[0], arg[2]);
      } else {
        this.options.grep = re;
      }
      return this;
    };
    Mocha2.prototype.invert = function() {
      this.options.invert = true;
      return this;
    };
    Mocha2.prototype.checkLeaks = function(checkLeaks) {
      this.options.checkLeaks = checkLeaks !== false;
      return this;
    };
    Mocha2.prototype.cleanReferencesAfterRun = function(cleanReferencesAfterRun) {
      this._cleanReferencesAfterRun = cleanReferencesAfterRun !== false;
      return this;
    };
    Mocha2.prototype.dispose = function() {
      if (this._state === mochaStates.RUNNING) {
        throw createMochaInstanceAlreadyRunningError("Cannot dispose while the mocha instance is still running tests.");
      }
      this.unloadFiles();
      this._previousRunner && this._previousRunner.dispose();
      this.suite.dispose();
      this._state = mochaStates.DISPOSED;
    };
    Mocha2.prototype.fullTrace = function(fullTrace) {
      this.options.fullTrace = fullTrace !== false;
      return this;
    };
    Mocha2.prototype.growl = function() {
      this.options.growl = this.isGrowlCapable();
      if (!this.options.growl) {
        var detail = utils.isBrowser() ? "notification support not available in this browser..." : "notification support prerequisites not installed...";
        console.error(detail + " cannot enable!");
      }
      return this;
    };
    Mocha2.prototype.isGrowlCapable = growl.isCapable;
    Mocha2.prototype._growl = growl.notify;
    Mocha2.prototype.global = function(global2) {
      this.options.global = (this.options.global || []).concat(global2).filter(Boolean).filter(function(elt, idx, arr) {
        return arr.indexOf(elt) === idx;
      });
      return this;
    };
    Mocha2.prototype.globals = Mocha2.prototype.global;
    Mocha2.prototype.color = function(color) {
      this.options.color = color !== false;
      return this;
    };
    Mocha2.prototype.inlineDiffs = function(inlineDiffs) {
      this.options.inlineDiffs = inlineDiffs !== false;
      return this;
    };
    Mocha2.prototype.diff = function(diff) {
      this.options.diff = diff !== false;
      return this;
    };
    Mocha2.prototype.timeout = function(msecs) {
      this.suite.timeout(msecs);
      return this;
    };
    Mocha2.prototype.retries = function(retry) {
      this.suite.retries(retry);
      return this;
    };
    Mocha2.prototype.slow = function(msecs) {
      this.suite.slow(msecs);
      return this;
    };
    Mocha2.prototype.asyncOnly = function(asyncOnly) {
      this.options.asyncOnly = asyncOnly !== false;
      return this;
    };
    Mocha2.prototype.noHighlighting = function() {
      this.options.noHighlighting = true;
      return this;
    };
    Mocha2.prototype.allowUncaught = function(allowUncaught) {
      this.options.allowUncaught = allowUncaught !== false;
      return this;
    };
    Mocha2.prototype.delay = function delay() {
      this.options.delay = true;
      return this;
    };
    Mocha2.prototype.forbidOnly = function(forbidOnly) {
      this.options.forbidOnly = forbidOnly !== false;
      return this;
    };
    Mocha2.prototype.forbidPending = function(forbidPending) {
      this.options.forbidPending = forbidPending !== false;
      return this;
    };
    Mocha2.prototype._guardRunningStateTransition = function() {
      if (this._state === mochaStates.RUNNING) {
        throw createMochaInstanceAlreadyRunningError("Mocha instance is currently running tests, cannot start a next test run until this one is done", this);
      }
      if (this._state === mochaStates.DISPOSED || this._state === mochaStates.REFERENCES_CLEANED) {
        throw createMochaInstanceAlreadyDisposedError("Mocha instance is already disposed, cannot start a new test run. Please create a new mocha instance. Be sure to set disable `cleanReferencesAfterRun` when you want to reuse the same mocha instance for multiple test runs.", this._cleanReferencesAfterRun, this);
      }
    };
    Object.defineProperty(Mocha2.prototype, "version", {
      value: require_package().version,
      configurable: false,
      enumerable: true,
      writable: false
    });
    Mocha2.prototype.run = function(fn) {
      this._guardRunningStateTransition();
      this._state = mochaStates.RUNNING;
      if (this._previousRunner) {
        this._previousRunner.dispose();
        this.suite.reset();
      }
      if (this.files.length && !this._lazyLoadFiles) {
        this.loadFiles();
      }
      var suite = this.suite;
      var options = this.options;
      options.files = this.files;
      const runner = new this._runnerClass(suite, {
        delay: options.delay,
        cleanReferencesAfterRun: this._cleanReferencesAfterRun
      });
      createStatsCollector(runner);
      var reporter = new this._reporter(runner, options);
      runner.checkLeaks = options.checkLeaks === true;
      runner.fullStackTrace = options.fullTrace;
      runner.asyncOnly = options.asyncOnly;
      runner.allowUncaught = options.allowUncaught;
      runner.forbidOnly = options.forbidOnly;
      runner.forbidPending = options.forbidPending;
      if (options.grep) {
        runner.grep(options.grep, options.invert);
      }
      if (options.global) {
        runner.globals(options.global);
      }
      if (options.growl) {
        this._growl(runner);
      }
      if (options.color !== void 0) {
        exports.reporters.Base.useColors = options.color;
      }
      exports.reporters.Base.inlineDiffs = options.inlineDiffs;
      exports.reporters.Base.hideDiff = !options.diff;
      const done = (failures) => {
        this._previousRunner = runner;
        this._state = this._cleanReferencesAfterRun ? mochaStates.REFERENCES_CLEANED : mochaStates.INIT;
        fn = fn || utils.noop;
        if (typeof reporter.done === "function") {
          reporter.done(failures, fn);
        } else {
          fn(failures);
        }
      };
      const runAsync = async (runner2) => {
        const context = this.options.enableGlobalSetup && this.hasGlobalSetupFixtures() ? await this.runGlobalSetup(runner2) : {};
        const failureCount = await runner2.runAsync({
          files: this.files,
          options
        });
        if (this.options.enableGlobalTeardown && this.hasGlobalTeardownFixtures()) {
          await this.runGlobalTeardown(runner2, {context});
        }
        return failureCount;
      };
      runAsync(runner).then(done);
      return runner;
    };
    Mocha2.prototype.rootHooks = function rootHooks({
      beforeAll = [],
      beforeEach = [],
      afterAll = [],
      afterEach = []
    } = {}) {
      beforeAll = utils.castArray(beforeAll);
      beforeEach = utils.castArray(beforeEach);
      afterAll = utils.castArray(afterAll);
      afterEach = utils.castArray(afterEach);
      beforeAll.forEach((hook) => {
        this.suite.beforeAll(hook);
      });
      beforeEach.forEach((hook) => {
        this.suite.beforeEach(hook);
      });
      afterAll.forEach((hook) => {
        this.suite.afterAll(hook);
      });
      afterEach.forEach((hook) => {
        this.suite.afterEach(hook);
      });
      return this;
    };
    Mocha2.prototype.parallelMode = function parallelMode(enable = true) {
      if (utils.isBrowser()) {
        throw createUnsupportedError("parallel mode is only supported in Node.js");
      }
      const parallel = Boolean(enable);
      if (parallel === this.options.parallel && this._lazyLoadFiles && this._runnerClass !== exports.Runner) {
        return this;
      }
      if (this._state !== mochaStates.INIT) {
        throw createUnsupportedError("cannot change parallel mode after having called run()");
      }
      this.options.parallel = parallel;
      this._runnerClass = parallel ? require_parallel_buffered_runner() : exports.Runner;
      return this.lazyLoadFiles(this._lazyLoadFiles || parallel);
    };
    Mocha2.prototype.lazyLoadFiles = function lazyLoadFiles(enable) {
      this._lazyLoadFiles = enable === true;
      debug("set lazy load to %s", enable);
      return this;
    };
    Mocha2.prototype.globalSetup = function globalSetup(setupFns = []) {
      setupFns = utils.castArray(setupFns);
      this.options.globalSetup = setupFns;
      debug("configured %d global setup functions", setupFns.length);
      return this;
    };
    Mocha2.prototype.globalTeardown = function globalTeardown(teardownFns = []) {
      teardownFns = utils.castArray(teardownFns);
      this.options.globalTeardown = teardownFns;
      debug("configured %d global teardown functions", teardownFns.length);
      return this;
    };
    Mocha2.prototype.runGlobalSetup = async function runGlobalSetup(context = {}) {
      const {globalSetup} = this.options;
      if (globalSetup && globalSetup.length) {
        debug("run(): global setup starting");
        await this._runGlobalFixtures(globalSetup, context);
        debug("run(): global setup complete");
      }
      return context;
    };
    Mocha2.prototype.runGlobalTeardown = async function runGlobalTeardown(context = {}) {
      const {globalTeardown} = this.options;
      if (globalTeardown && globalTeardown.length) {
        debug("run(): global teardown starting");
        await this._runGlobalFixtures(globalTeardown, context);
      }
      debug("run(): global teardown complete");
      return context;
    };
    Mocha2.prototype._runGlobalFixtures = async function _runGlobalFixtures(fixtureFns = [], context = {}) {
      for await (const fixtureFn of fixtureFns) {
        await fixtureFn.call(context);
      }
      return context;
    };
    Mocha2.prototype.enableGlobalSetup = function enableGlobalSetup(enabled = true) {
      this.options.enableGlobalSetup = Boolean(enabled);
      return this;
    };
    Mocha2.prototype.enableGlobalTeardown = function enableGlobalTeardown(enabled = true) {
      this.options.enableGlobalTeardown = Boolean(enabled);
      return this;
    };
    Mocha2.prototype.hasGlobalSetupFixtures = function hasGlobalSetupFixtures() {
      return Boolean(this.options.globalSetup.length);
    };
    Mocha2.prototype.hasGlobalTeardownFixtures = function hasGlobalTeardownFixtures() {
      return Boolean(this.options.globalTeardown.length);
    };
  });

  // node_modules/mocha/browser-entry.js
  var require_browser_entry = __commonJS((exports, module) => {
    "use strict";
    import_process.default.stdout = require_browser_stdout()({label: false});
    var parseQuery = require_parse_query();
    var highlightTags = require_highlight_tags();
    var Mocha2 = require_mocha();
    var mocha2 = new Mocha2({reporter: "html"});
    var Date2 = import_global.default.Date;
    var setTimeout2 = import_global.default.setTimeout;
    var setInterval = import_global.default.setInterval;
    var clearTimeout2 = import_global.default.clearTimeout;
    var clearInterval = import_global.default.clearInterval;
    var uncaughtExceptionHandlers = [];
    var originalOnerrorHandler = import_global.default.onerror;
    import_process.default.removeListener = function(e, fn) {
      if (e === "uncaughtException") {
        if (originalOnerrorHandler) {
          import_global.default.onerror = originalOnerrorHandler;
        } else {
          import_global.default.onerror = function() {
          };
        }
        var i = uncaughtExceptionHandlers.indexOf(fn);
        if (i !== -1) {
          uncaughtExceptionHandlers.splice(i, 1);
        }
      }
    };
    import_process.default.listenerCount = function(name) {
      if (name === "uncaughtException") {
        return uncaughtExceptionHandlers.length;
      }
      return 0;
    };
    import_process.default.on = function(e, fn) {
      if (e === "uncaughtException") {
        import_global.default.onerror = function(err, url, line) {
          fn(new Error(err + " (" + url + ":" + line + ")"));
          return !mocha2.options.allowUncaught;
        };
        uncaughtExceptionHandlers.push(fn);
      }
    };
    import_process.default.listeners = function(e) {
      if (e === "uncaughtException") {
        return uncaughtExceptionHandlers;
      }
      return [];
    };
    mocha2.suite.removeAllListeners("pre-require");
    var immediateQueue = [];
    var immediateTimeout;
    function timeslice() {
      var immediateStart = new Date2().getTime();
      while (immediateQueue.length && new Date2().getTime() - immediateStart < 100) {
        immediateQueue.shift()();
      }
      if (immediateQueue.length) {
        immediateTimeout = setTimeout2(timeslice, 0);
      } else {
        immediateTimeout = null;
      }
    }
    Mocha2.Runner.immediately = function(callback) {
      immediateQueue.push(callback);
      if (!immediateTimeout) {
        immediateTimeout = setTimeout2(timeslice, 0);
      }
    };
    mocha2.throwError = function(err) {
      uncaughtExceptionHandlers.forEach(function(fn) {
        fn(err);
      });
      throw err;
    };
    mocha2.ui = function(ui) {
      Mocha2.prototype.ui.call(this, ui);
      this.suite.emit("pre-require", import_global.default, null, this);
      return this;
    };
    mocha2.setup = function(opts) {
      if (typeof opts === "string") {
        opts = {ui: opts};
      }
      if (opts.delay === true) {
        this.delay();
      }
      var self2 = this;
      Object.keys(opts).filter(function(opt) {
        return opt !== "delay";
      }).forEach(function(opt) {
        if (Object.prototype.hasOwnProperty.call(opts, opt)) {
          self2[opt](opts[opt]);
        }
      });
      return this;
    };
    mocha2.run = function(fn) {
      var options = mocha2.options;
      mocha2.globals("location");
      var query = parseQuery(import_global.default.location.search || "");
      if (query.grep) {
        mocha2.grep(query.grep);
      }
      if (query.fgrep) {
        mocha2.fgrep(query.fgrep);
      }
      if (query.invert) {
        mocha2.invert();
      }
      return Mocha2.prototype.run.call(mocha2, function(err) {
        var document2 = import_global.default.document;
        if (document2 && document2.getElementById("mocha") && options.noHighlighting !== true) {
          highlightTags("code");
        }
        if (fn) {
          fn(err);
        }
      });
    };
    Mocha2.process = import_process.default;
    import_global.default.Mocha = Mocha2;
    import_global.default.mocha = mocha2;
    module.exports = Object.assign(mocha2, import_global.default);
  });

  // node_modules/assertion-error/index.js
  var require_assertion_error = __commonJS((exports, module) => {
    /*!
     * assertion-error
     * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
     * MIT Licensed
     */
    /*!
     * Return a function that will copy properties from
     * one object to another excluding any originally
     * listed. Returned function will create a new `{}`.
     *
     * @param {String} excluded properties ...
     * @return {Function}
     */
    function exclude() {
      var excludes = [].slice.call(arguments);
      function excludeProps(res, obj) {
        Object.keys(obj).forEach(function(key) {
          if (!~excludes.indexOf(key))
            res[key] = obj[key];
        });
      }
      return function extendExclude() {
        var args = [].slice.call(arguments), i = 0, res = {};
        for (; i < args.length; i++) {
          excludeProps(res, args[i]);
        }
        return res;
      };
    }
    /*!
     * Primary Exports
     */
    module.exports = AssertionError2;
    function AssertionError2(message, _props, ssf) {
      var extend = exclude("name", "message", "stack", "constructor", "toJSON"), props = extend(_props || {});
      this.message = message || "Unspecified AssertionError";
      this.showDiff = false;
      for (var key in props) {
        this[key] = props[key];
      }
      ssf = ssf || AssertionError2;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ssf);
      } else {
        try {
          throw new Error();
        } catch (e) {
          this.stack = e.stack;
        }
      }
    }
    /*!
     * Inherit from Error.prototype
     */
    AssertionError2.prototype = Object.create(Error.prototype);
    /*!
     * Statically set name
     */
    AssertionError2.prototype.name = "AssertionError";
    /*!
     * Ensure correct constructor
     */
    AssertionError2.prototype.constructor = AssertionError2;
    AssertionError2.prototype.toJSON = function(stack) {
      var extend = exclude("constructor", "toJSON", "stack"), props = extend({name: this.name}, this);
      if (stack !== false && this.stack) {
        props.stack = this.stack;
      }
      return props;
    };
  });

  // node_modules/pathval/index.js
  var require_pathval = __commonJS((exports, module) => {
    "use strict";
    function hasProperty(obj, name) {
      if (typeof obj === "undefined" || obj === null) {
        return false;
      }
      return name in Object(obj);
    }
    function parsePath(path) {
      var str = path.replace(/([^\\])\[/g, "$1.[");
      var parts = str.match(/(\\\.|[^.]+?)+/g);
      return parts.map(function mapMatches(value) {
        var regexp = /^\[(\d+)\]$/;
        var mArr = regexp.exec(value);
        var parsed = null;
        if (mArr) {
          parsed = {i: parseFloat(mArr[1])};
        } else {
          parsed = {p: value.replace(/\\([.\[\]])/g, "$1")};
        }
        return parsed;
      });
    }
    function internalGetPathValue(obj, parsed, pathDepth) {
      var temporaryValue = obj;
      var res = null;
      pathDepth = typeof pathDepth === "undefined" ? parsed.length : pathDepth;
      for (var i = 0; i < pathDepth; i++) {
        var part = parsed[i];
        if (temporaryValue) {
          if (typeof part.p === "undefined") {
            temporaryValue = temporaryValue[part.i];
          } else {
            temporaryValue = temporaryValue[part.p];
          }
          if (i === pathDepth - 1) {
            res = temporaryValue;
          }
        }
      }
      return res;
    }
    function internalSetPathValue(obj, val, parsed) {
      var tempObj = obj;
      var pathDepth = parsed.length;
      var part = null;
      for (var i = 0; i < pathDepth; i++) {
        var propName = null;
        var propVal = null;
        part = parsed[i];
        if (i === pathDepth - 1) {
          propName = typeof part.p === "undefined" ? part.i : part.p;
          tempObj[propName] = val;
        } else if (typeof part.p !== "undefined" && tempObj[part.p]) {
          tempObj = tempObj[part.p];
        } else if (typeof part.i !== "undefined" && tempObj[part.i]) {
          tempObj = tempObj[part.i];
        } else {
          var next = parsed[i + 1];
          propName = typeof part.p === "undefined" ? part.i : part.p;
          propVal = typeof next.p === "undefined" ? [] : {};
          tempObj[propName] = propVal;
          tempObj = tempObj[propName];
        }
      }
    }
    function getPathInfo(obj, path) {
      var parsed = parsePath(path);
      var last = parsed[parsed.length - 1];
      var info = {
        parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
        name: last.p || last.i,
        value: internalGetPathValue(obj, parsed)
      };
      info.exists = hasProperty(info.parent, info.name);
      return info;
    }
    function getPathValue(obj, path) {
      var info = getPathInfo(obj, path);
      return info.value;
    }
    function setPathValue(obj, path, val) {
      var parsed = parsePath(path);
      internalSetPathValue(obj, val, parsed);
      return obj;
    }
    module.exports = {
      hasProperty,
      getPathInfo,
      getPathValue,
      setPathValue
    };
  });

  // node_modules/chai/lib/chai/utils/flag.js
  var require_flag = __commonJS((exports, module) => {
    /*!
     * Chai - flag utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function flag(obj, key, value) {
      var flags = obj.__flags || (obj.__flags = Object.create(null));
      if (arguments.length === 3) {
        flags[key] = value;
      } else {
        return flags[key];
      }
    };
  });

  // node_modules/chai/lib/chai/utils/test.js
  var require_test2 = __commonJS((exports, module) => {
    /*!
     * Chai - test utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Module dependencies
     */
    var flag = require_flag();
    module.exports = function test(obj, args) {
      var negate = flag(obj, "negate"), expr = args[0];
      return negate ? !expr : expr;
    };
  });

  // node_modules/type-detect/type-detect.js
  var require_type_detect = __commonJS((exports, module) => {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.typeDetect = factory();
    })(exports, function() {
      "use strict";
      var promiseExists = typeof Promise === "function";
      var globalObject = typeof self === "object" ? self : import_global.default;
      var symbolExists = typeof Symbol !== "undefined";
      var mapExists = typeof Map !== "undefined";
      var setExists = typeof Set !== "undefined";
      var weakMapExists = typeof WeakMap !== "undefined";
      var weakSetExists = typeof WeakSet !== "undefined";
      var dataViewExists = typeof DataView !== "undefined";
      var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== "undefined";
      var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== "undefined";
      var setEntriesExists = setExists && typeof Set.prototype.entries === "function";
      var mapEntriesExists = mapExists && typeof Map.prototype.entries === "function";
      var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
      var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
      var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === "function";
      var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
      var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === "function";
      var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(""[Symbol.iterator]());
      var toStringLeftSliceLength = 8;
      var toStringRightSliceLength = -1;
      function typeDetect(obj) {
        var typeofObj = typeof obj;
        if (typeofObj !== "object") {
          return typeofObj;
        }
        if (obj === null) {
          return "null";
        }
        if (obj === globalObject) {
          return "global";
        }
        if (Array.isArray(obj) && (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))) {
          return "Array";
        }
        if (typeof window === "object" && window !== null) {
          if (typeof window.location === "object" && obj === window.location) {
            return "Location";
          }
          if (typeof window.document === "object" && obj === window.document) {
            return "Document";
          }
          if (typeof window.navigator === "object") {
            if (typeof window.navigator.mimeTypes === "object" && obj === window.navigator.mimeTypes) {
              return "MimeTypeArray";
            }
            if (typeof window.navigator.plugins === "object" && obj === window.navigator.plugins) {
              return "PluginArray";
            }
          }
          if ((typeof window.HTMLElement === "function" || typeof window.HTMLElement === "object") && obj instanceof window.HTMLElement) {
            if (obj.tagName === "BLOCKQUOTE") {
              return "HTMLQuoteElement";
            }
            if (obj.tagName === "TD") {
              return "HTMLTableDataCellElement";
            }
            if (obj.tagName === "TH") {
              return "HTMLTableHeaderCellElement";
            }
          }
        }
        var stringTag = symbolToStringTagExists && obj[Symbol.toStringTag];
        if (typeof stringTag === "string") {
          return stringTag;
        }
        var objPrototype = Object.getPrototypeOf(obj);
        if (objPrototype === RegExp.prototype) {
          return "RegExp";
        }
        if (objPrototype === Date.prototype) {
          return "Date";
        }
        if (promiseExists && objPrototype === Promise.prototype) {
          return "Promise";
        }
        if (setExists && objPrototype === Set.prototype) {
          return "Set";
        }
        if (mapExists && objPrototype === Map.prototype) {
          return "Map";
        }
        if (weakSetExists && objPrototype === WeakSet.prototype) {
          return "WeakSet";
        }
        if (weakMapExists && objPrototype === WeakMap.prototype) {
          return "WeakMap";
        }
        if (dataViewExists && objPrototype === DataView.prototype) {
          return "DataView";
        }
        if (mapExists && objPrototype === mapIteratorPrototype) {
          return "Map Iterator";
        }
        if (setExists && objPrototype === setIteratorPrototype) {
          return "Set Iterator";
        }
        if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
          return "Array Iterator";
        }
        if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
          return "String Iterator";
        }
        if (objPrototype === null) {
          return "Object";
        }
        return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
      }
      return typeDetect;
    });
  });

  // node_modules/chai/lib/chai/utils/expectTypes.js
  var require_expectTypes = __commonJS((exports, module) => {
    /*!
     * Chai - expectTypes utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var AssertionError2 = require_assertion_error();
    var flag = require_flag();
    var type = require_type_detect();
    module.exports = function expectTypes(obj, types) {
      var flagMsg = flag(obj, "message");
      var ssfi = flag(obj, "ssfi");
      flagMsg = flagMsg ? flagMsg + ": " : "";
      obj = flag(obj, "object");
      types = types.map(function(t) {
        return t.toLowerCase();
      });
      types.sort();
      var str = types.map(function(t, index) {
        var art = ~["a", "e", "i", "o", "u"].indexOf(t.charAt(0)) ? "an" : "a";
        var or = types.length > 1 && index === types.length - 1 ? "or " : "";
        return or + art + " " + t;
      }).join(", ");
      var objType = type(obj).toLowerCase();
      if (!types.some(function(expected) {
        return objType === expected;
      })) {
        throw new AssertionError2(flagMsg + "object tested must be " + str + ", but " + objType + " given", void 0, ssfi);
      }
    };
  });

  // node_modules/chai/lib/chai/utils/getActual.js
  var require_getActual = __commonJS((exports, module) => {
    /*!
     * Chai - getActual utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function getActual(obj, args) {
      return args.length > 4 ? args[4] : obj._obj;
    };
  });

  // node_modules/get-func-name/index.js
  var require_get_func_name = __commonJS((exports, module) => {
    "use strict";
    var toString = Function.prototype.toString;
    var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
    function getFuncName(aFunc) {
      if (typeof aFunc !== "function") {
        return null;
      }
      var name = "";
      if (typeof Function.prototype.name === "undefined" && typeof aFunc.name === "undefined") {
        var match = toString.call(aFunc).match(functionNameMatch);
        if (match) {
          name = match[1];
        }
      } else {
        name = aFunc.name;
      }
      return name;
    }
    module.exports = getFuncName;
  });

  // node_modules/chai/lib/chai/utils/getProperties.js
  var require_getProperties = __commonJS((exports, module) => {
    /*!
     * Chai - getProperties utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function getProperties(object) {
      var result = Object.getOwnPropertyNames(object);
      function addProperty(property) {
        if (result.indexOf(property) === -1) {
          result.push(property);
        }
      }
      var proto = Object.getPrototypeOf(object);
      while (proto !== null) {
        Object.getOwnPropertyNames(proto).forEach(addProperty);
        proto = Object.getPrototypeOf(proto);
      }
      return result;
    };
  });

  // node_modules/chai/lib/chai/utils/getEnumerableProperties.js
  var require_getEnumerableProperties = __commonJS((exports, module) => {
    /*!
     * Chai - getEnumerableProperties utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function getEnumerableProperties(object) {
      var result = [];
      for (var name in object) {
        result.push(name);
      }
      return result;
    };
  });

  // node_modules/chai/lib/chai/config.js
  var require_config = __commonJS((exports, module) => {
    module.exports = {
      includeStack: false,
      showDiff: true,
      truncateThreshold: 40,
      useProxy: true,
      proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"]
    };
  });

  // node_modules/chai/lib/chai/utils/inspect.js
  var require_inspect = __commonJS((exports, module) => {
    var getName = require_get_func_name();
    var getProperties = require_getProperties();
    var getEnumerableProperties = require_getEnumerableProperties();
    var config2 = require_config();
    module.exports = inspect;
    function inspect(obj, showHidden, depth, colors) {
      var ctx = {
        showHidden,
        seen: [],
        stylize: function(str) {
          return str;
        }
      };
      return formatValue(ctx, obj, typeof depth === "undefined" ? 2 : depth);
    }
    var isDOMElement = function(object) {
      if (typeof HTMLElement === "object") {
        return object instanceof HTMLElement;
      } else {
        return object && typeof object === "object" && "nodeType" in object && object.nodeType === 1 && typeof object.nodeName === "string";
      }
    };
    function formatValue(ctx, value, recurseTimes) {
      if (value && typeof value.inspect === "function" && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (typeof ret !== "string") {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      if (isDOMElement(value)) {
        if ("outerHTML" in value) {
          return value.outerHTML;
        } else {
          try {
            if (document.xmlVersion) {
              var xmlSerializer = new XMLSerializer();
              return xmlSerializer.serializeToString(value);
            } else {
              var ns = "http://www.w3.org/1999/xhtml";
              var container = document.createElementNS(ns, "_");
              container.appendChild(value.cloneNode(false));
              var html = container.innerHTML.replace("><", ">" + value.innerHTML + "<");
              container.innerHTML = "";
              return html;
            }
          } catch (err) {
          }
        }
      }
      var visibleKeys = getEnumerableProperties(value);
      var keys = ctx.showHidden ? getProperties(value) : visibleKeys;
      var name, nameSuffix;
      if (keys.length === 0 || isError(value) && (keys.length === 1 && keys[0] === "stack" || keys.length === 2 && keys[0] === "description" && keys[1] === "stack")) {
        if (typeof value === "function") {
          name = getName(value);
          nameSuffix = name ? ": " + name : "";
          return ctx.stylize("[Function" + nameSuffix + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toUTCString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, typedArray = false, braces = ["{", "}"];
      if (isTypedArray(value)) {
        typedArray = true;
        braces = ["[", "]"];
      }
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (typeof value === "function") {
        name = getName(value);
        nameSuffix = name ? ": " + name : "";
        base = " [Function" + nameSuffix + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        return formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else if (typedArray) {
        return formatTypedArray(value);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    function formatPrimitive(ctx, value) {
      switch (typeof value) {
        case "undefined":
          return ctx.stylize("undefined", "undefined");
        case "string":
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        case "number":
          if (value === 0 && 1 / value === -Infinity) {
            return ctx.stylize("-0", "number");
          }
          return ctx.stylize("" + value, "number");
        case "boolean":
          return ctx.stylize("" + value, "boolean");
        case "symbol":
          return ctx.stylize(value.toString(), "symbol");
      }
      if (value === null) {
        return ctx.stylize("null", "null");
      }
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (Object.prototype.hasOwnProperty.call(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
        }
      });
      return output;
    }
    function formatTypedArray(value) {
      var str = "[ ";
      for (var i = 0; i < value.length; ++i) {
        if (str.length >= config2.truncateThreshold - 7) {
          str += "...";
          break;
        }
        str += value[i] + ", ";
      }
      str += " ]";
      if (str.indexOf(",  ]") !== -1) {
        str = str.replace(",  ]", " ]");
      }
      return str;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name;
      var propDescriptor = Object.getOwnPropertyDescriptor(value, key);
      var str;
      if (propDescriptor) {
        if (propDescriptor.get) {
          if (propDescriptor.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (propDescriptor.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
      }
      if (visibleKeys.indexOf(key) < 0) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = formatValue(ctx, value[key], null);
          } else {
            str = formatValue(ctx, value[key], recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line) {
                return "  " + line;
              }).join("\n").substr(2);
            } else {
              str = "\n" + str.split("\n").map(function(line) {
                return "   " + line;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (typeof name === "undefined") {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var length = output.reduce(function(prev, cur) {
        return prev + cur.length + 1;
      }, 0);
      if (length > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    function isTypedArray(ar) {
      return typeof ar === "object" && /\w+Array]$/.test(objectToString(ar));
    }
    function isArray(ar) {
      return Array.isArray(ar) || typeof ar === "object" && objectToString(ar) === "[object Array]";
    }
    function isRegExp(re) {
      return typeof re === "object" && objectToString(re) === "[object RegExp]";
    }
    function isDate(d) {
      return typeof d === "object" && objectToString(d) === "[object Date]";
    }
    function isError(e) {
      return typeof e === "object" && objectToString(e) === "[object Error]";
    }
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  });

  // node_modules/chai/lib/chai/utils/objDisplay.js
  var require_objDisplay = __commonJS((exports, module) => {
    /*!
     * Chai - flag utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Module dependencies
     */
    var inspect = require_inspect();
    var config2 = require_config();
    module.exports = function objDisplay(obj) {
      var str = inspect(obj), type = Object.prototype.toString.call(obj);
      if (config2.truncateThreshold && str.length >= config2.truncateThreshold) {
        if (type === "[object Function]") {
          return !obj.name || obj.name === "" ? "[Function]" : "[Function: " + obj.name + "]";
        } else if (type === "[object Array]") {
          return "[ Array(" + obj.length + ") ]";
        } else if (type === "[object Object]") {
          var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(", ") + ", ..." : keys.join(", ");
          return "{ Object (" + kstr + ") }";
        } else {
          return str;
        }
      } else {
        return str;
      }
    };
  });

  // node_modules/chai/lib/chai/utils/getMessage.js
  var require_getMessage = __commonJS((exports, module) => {
    /*!
     * Chai - message composition utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Module dependencies
     */
    var flag = require_flag();
    var getActual = require_getActual();
    var objDisplay = require_objDisplay();
    module.exports = function getMessage(obj, args) {
      var negate = flag(obj, "negate"), val = flag(obj, "object"), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, "message");
      if (typeof msg === "function")
        msg = msg();
      msg = msg || "";
      msg = msg.replace(/#\{this\}/g, function() {
        return objDisplay(val);
      }).replace(/#\{act\}/g, function() {
        return objDisplay(actual);
      }).replace(/#\{exp\}/g, function() {
        return objDisplay(expected);
      });
      return flagMsg ? flagMsg + ": " + msg : msg;
    };
  });

  // node_modules/chai/lib/chai/utils/transferFlags.js
  var require_transferFlags = __commonJS((exports, module) => {
    /*!
     * Chai - transferFlags utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function transferFlags(assertion, object, includeAll) {
      var flags = assertion.__flags || (assertion.__flags = Object.create(null));
      if (!object.__flags) {
        object.__flags = Object.create(null);
      }
      includeAll = arguments.length === 3 ? includeAll : true;
      for (var flag in flags) {
        if (includeAll || flag !== "object" && flag !== "ssfi" && flag !== "lockSsfi" && flag != "message") {
          object.__flags[flag] = flags[flag];
        }
      }
    };
  });

  // node_modules/deep-eql/index.js
  var require_deep_eql = __commonJS((exports, module) => {
    "use strict";
    /*!
     * deep-eql
     * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var type = require_type_detect();
    function FakeMap() {
      this._key = "chai/deep-eql__" + Math.random() + Date.now();
    }
    FakeMap.prototype = {
      get: function getMap(key) {
        return key[this._key];
      },
      set: function setMap(key, value) {
        if (Object.isExtensible(key)) {
          Object.defineProperty(key, this._key, {
            value,
            configurable: true
          });
        }
      }
    };
    var MemoizeMap = typeof WeakMap === "function" ? WeakMap : FakeMap;
    /*!
     * Check to see if the MemoizeMap has recorded a result of the two operands
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {MemoizeMap} memoizeMap
     * @returns {Boolean|null} result
    */
    function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
      if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return null;
      }
      var leftHandMap = memoizeMap.get(leftHandOperand);
      if (leftHandMap) {
        var result = leftHandMap.get(rightHandOperand);
        if (typeof result === "boolean") {
          return result;
        }
      }
      return null;
    }
    /*!
     * Set the result of the equality into the MemoizeMap
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {MemoizeMap} memoizeMap
     * @param {Boolean} result
    */
    function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
      if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return;
      }
      var leftHandMap = memoizeMap.get(leftHandOperand);
      if (leftHandMap) {
        leftHandMap.set(rightHandOperand, result);
      } else {
        leftHandMap = new MemoizeMap();
        leftHandMap.set(rightHandOperand, result);
        memoizeMap.set(leftHandOperand, leftHandMap);
      }
    }
    /*!
     * Primary Export
     */
    module.exports = deepEqual;
    module.exports.MemoizeMap = MemoizeMap;
    function deepEqual(leftHandOperand, rightHandOperand, options) {
      if (options && options.comparator) {
        return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
      }
      var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
      if (simpleResult !== null) {
        return simpleResult;
      }
      return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
    }
    function simpleEqual(leftHandOperand, rightHandOperand) {
      if (leftHandOperand === rightHandOperand) {
        return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
      }
      if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
        return true;
      }
      if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
        return false;
      }
      return null;
    }
    /*!
     * The main logic of the `deepEqual` function.
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {Object} [options] (optional) Additional options
     * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
     * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
        complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
        references to blow the stack.
     * @return {Boolean} equal match
    */
    function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
      options = options || {};
      options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
      var comparator = options && options.comparator;
      var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
      if (memoizeResultLeft !== null) {
        return memoizeResultLeft;
      }
      var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
      if (memoizeResultRight !== null) {
        return memoizeResultRight;
      }
      if (comparator) {
        var comparatorResult = comparator(leftHandOperand, rightHandOperand);
        if (comparatorResult === false || comparatorResult === true) {
          memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
          return comparatorResult;
        }
        var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
        if (simpleResult !== null) {
          return simpleResult;
        }
      }
      var leftHandType = type(leftHandOperand);
      if (leftHandType !== type(rightHandOperand)) {
        memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
        return false;
      }
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
      var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
      return result;
    }
    function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
      switch (leftHandType) {
        case "String":
        case "Number":
        case "Boolean":
        case "Date":
          return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
        case "Promise":
        case "Symbol":
        case "function":
        case "WeakMap":
        case "WeakSet":
        case "Error":
          return leftHandOperand === rightHandOperand;
        case "Arguments":
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "Array":
          return iterableEqual(leftHandOperand, rightHandOperand, options);
        case "RegExp":
          return regexpEqual(leftHandOperand, rightHandOperand);
        case "Generator":
          return generatorEqual(leftHandOperand, rightHandOperand, options);
        case "DataView":
          return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
        case "ArrayBuffer":
          return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
        case "Set":
          return entriesEqual(leftHandOperand, rightHandOperand, options);
        case "Map":
          return entriesEqual(leftHandOperand, rightHandOperand, options);
        default:
          return objectEqual(leftHandOperand, rightHandOperand, options);
      }
    }
    /*!
     * Compare two Regular Expressions for equality.
     *
     * @param {RegExp} leftHandOperand
     * @param {RegExp} rightHandOperand
     * @return {Boolean} result
     */
    function regexpEqual(leftHandOperand, rightHandOperand) {
      return leftHandOperand.toString() === rightHandOperand.toString();
    }
    /*!
     * Compare two Sets/Maps for equality. Faster than other equality functions.
     *
     * @param {Set} leftHandOperand
     * @param {Set} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     */
    function entriesEqual(leftHandOperand, rightHandOperand, options) {
      if (leftHandOperand.size !== rightHandOperand.size) {
        return false;
      }
      if (leftHandOperand.size === 0) {
        return true;
      }
      var leftHandItems = [];
      var rightHandItems = [];
      leftHandOperand.forEach(function gatherEntries(key, value) {
        leftHandItems.push([key, value]);
      });
      rightHandOperand.forEach(function gatherEntries(key, value) {
        rightHandItems.push([key, value]);
      });
      return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
    }
    /*!
     * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
     *
     * @param {Iterable} leftHandOperand
     * @param {Iterable} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     */
    function iterableEqual(leftHandOperand, rightHandOperand, options) {
      var length = leftHandOperand.length;
      if (length !== rightHandOperand.length) {
        return false;
      }
      if (length === 0) {
        return true;
      }
      var index = -1;
      while (++index < length) {
        if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
          return false;
        }
      }
      return true;
    }
    /*!
     * Simple equality for generator objects such as those returned by generator functions.
     *
     * @param {Iterable} leftHandOperand
     * @param {Iterable} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     */
    function generatorEqual(leftHandOperand, rightHandOperand, options) {
      return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
    }
    /*!
     * Determine if the given object has an @@iterator function.
     *
     * @param {Object} target
     * @return {Boolean} `true` if the object has an @@iterator function.
     */
    function hasIteratorFunction(target) {
      return typeof Symbol !== "undefined" && typeof target === "object" && typeof Symbol.iterator !== "undefined" && typeof target[Symbol.iterator] === "function";
    }
    /*!
     * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
     * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
     *
     * @param {Object} target
     * @returns {Array} an array of entries from the @@iterator function
     */
    function getIteratorEntries(target) {
      if (hasIteratorFunction(target)) {
        try {
          return getGeneratorEntries(target[Symbol.iterator]());
        } catch (iteratorError) {
          return [];
        }
      }
      return [];
    }
    /*!
     * Gets all entries from a Generator. This will consume the generator - which could have side effects.
     *
     * @param {Generator} target
     * @returns {Array} an array of entries from the Generator.
     */
    function getGeneratorEntries(generator) {
      var generatorResult = generator.next();
      var accumulator = [generatorResult.value];
      while (generatorResult.done === false) {
        generatorResult = generator.next();
        accumulator.push(generatorResult.value);
      }
      return accumulator;
    }
    /*!
     * Gets all own and inherited enumerable keys from a target.
     *
     * @param {Object} target
     * @returns {Array} an array of own and inherited enumerable keys from the target.
     */
    function getEnumerableKeys(target) {
      var keys = [];
      for (var key in target) {
        keys.push(key);
      }
      return keys;
    }
    /*!
     * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
     * each key. If any value of the given key is not equal, the function will return false (early).
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     */
    function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
      var length = keys.length;
      if (length === 0) {
        return true;
      }
      for (var i = 0; i < length; i += 1) {
        if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
          return false;
        }
      }
      return true;
    }
    /*!
     * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
     * for each enumerable key in the object.
     *
     * @param {Mixed} leftHandOperand
     * @param {Mixed} rightHandOperand
     * @param {Object} [options] (Optional)
     * @return {Boolean} result
     */
    function objectEqual(leftHandOperand, rightHandOperand, options) {
      var leftHandKeys = getEnumerableKeys(leftHandOperand);
      var rightHandKeys = getEnumerableKeys(rightHandOperand);
      if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
        leftHandKeys.sort();
        rightHandKeys.sort();
        if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
          return false;
        }
        return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
      }
      var leftHandEntries = getIteratorEntries(leftHandOperand);
      var rightHandEntries = getIteratorEntries(rightHandOperand);
      if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
        leftHandEntries.sort();
        rightHandEntries.sort();
        return iterableEqual(leftHandEntries, rightHandEntries, options);
      }
      if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
        return true;
      }
      return false;
    }
    /*!
     * Returns true if the argument is a primitive.
     *
     * This intentionally returns true for all objects that can be compared by reference,
     * including functions and symbols.
     *
     * @param {Mixed} value
     * @return {Boolean} result
     */
    function isPrimitive(value) {
      return value === null || typeof value !== "object";
    }
  });

  // node_modules/chai/lib/chai/utils/isProxyEnabled.js
  var require_isProxyEnabled = __commonJS((exports, module) => {
    var config2 = require_config();
    /*!
     * Chai - isProxyEnabled helper
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function isProxyEnabled() {
      return config2.useProxy && typeof Proxy !== "undefined" && typeof Reflect !== "undefined";
    };
  });

  // node_modules/chai/lib/chai/utils/addProperty.js
  var require_addProperty = __commonJS((exports, module) => {
    /*!
     * Chai - addProperty utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var chai2 = require_chai();
    var flag = require_flag();
    var isProxyEnabled = require_isProxyEnabled();
    var transferFlags = require_transferFlags();
    module.exports = function addProperty(ctx, name, getter) {
      getter = getter === void 0 ? function() {
      } : getter;
      Object.defineProperty(ctx, name, {
        get: function propertyGetter() {
          if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
            flag(this, "ssfi", propertyGetter);
          }
          var result = getter.call(this);
          if (result !== void 0)
            return result;
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        },
        configurable: true
      });
    };
  });

  // node_modules/chai/lib/chai/utils/addLengthGuard.js
  var require_addLengthGuard = __commonJS((exports, module) => {
    var fnLengthDesc = Object.getOwnPropertyDescriptor(function() {
    }, "length");
    /*!
     * Chai - addLengthGuard utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function addLengthGuard(fn, assertionName, isChainable) {
      if (!fnLengthDesc.configurable)
        return fn;
      Object.defineProperty(fn, "length", {
        get: function() {
          if (isChainable) {
            throw Error("Invalid Chai property: " + assertionName + '.length. Due to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
          }
          throw Error("Invalid Chai property: " + assertionName + '.length. See docs for proper usage of "' + assertionName + '".');
        }
      });
      return fn;
    };
  });

  // node_modules/chai/lib/chai/utils/proxify.js
  var require_proxify = __commonJS((exports, module) => {
    var config2 = require_config();
    var flag = require_flag();
    var getProperties = require_getProperties();
    var isProxyEnabled = require_isProxyEnabled();
    /*!
     * Chai - proxify utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var builtins = ["__flags", "__methods", "_obj", "assert"];
    module.exports = function proxify(obj, nonChainableMethodName) {
      if (!isProxyEnabled())
        return obj;
      return new Proxy(obj, {
        get: function proxyGetter(target, property) {
          if (typeof property === "string" && config2.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
            if (nonChainableMethodName) {
              throw Error("Invalid Chai property: " + nonChainableMethodName + "." + property + '. See docs for proper usage of "' + nonChainableMethodName + '".');
            }
            var suggestion = null;
            var suggestionDistance = 4;
            getProperties(target).forEach(function(prop) {
              if (!Object.prototype.hasOwnProperty(prop) && builtins.indexOf(prop) === -1) {
                var dist = stringDistanceCapped(property, prop, suggestionDistance);
                if (dist < suggestionDistance) {
                  suggestion = prop;
                  suggestionDistance = dist;
                }
              }
            });
            if (suggestion !== null) {
              throw Error("Invalid Chai property: " + property + '. Did you mean "' + suggestion + '"?');
            } else {
              throw Error("Invalid Chai property: " + property);
            }
          }
          if (builtins.indexOf(property) === -1 && !flag(target, "lockSsfi")) {
            flag(target, "ssfi", proxyGetter);
          }
          return Reflect.get(target, property);
        }
      });
    };
    function stringDistanceCapped(strA, strB, cap) {
      if (Math.abs(strA.length - strB.length) >= cap) {
        return cap;
      }
      var memo = [];
      for (var i = 0; i <= strA.length; i++) {
        memo[i] = Array(strB.length + 1).fill(0);
        memo[i][0] = i;
      }
      for (var j = 0; j < strB.length; j++) {
        memo[0][j] = j;
      }
      for (var i = 1; i <= strA.length; i++) {
        var ch = strA.charCodeAt(i - 1);
        for (var j = 1; j <= strB.length; j++) {
          if (Math.abs(i - j) >= cap) {
            memo[i][j] = cap;
            continue;
          }
          memo[i][j] = Math.min(memo[i - 1][j] + 1, memo[i][j - 1] + 1, memo[i - 1][j - 1] + (ch === strB.charCodeAt(j - 1) ? 0 : 1));
        }
      }
      return memo[strA.length][strB.length];
    }
  });

  // node_modules/chai/lib/chai/utils/addMethod.js
  var require_addMethod = __commonJS((exports, module) => {
    /*!
     * Chai - addMethod utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var addLengthGuard = require_addLengthGuard();
    var chai2 = require_chai();
    var flag = require_flag();
    var proxify = require_proxify();
    var transferFlags = require_transferFlags();
    module.exports = function addMethod(ctx, name, method) {
      var methodWrapper = function() {
        if (!flag(this, "lockSsfi")) {
          flag(this, "ssfi", methodWrapper);
        }
        var result = method.apply(this, arguments);
        if (result !== void 0)
          return result;
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
      addLengthGuard(methodWrapper, name, false);
      ctx[name] = proxify(methodWrapper, name);
    };
  });

  // node_modules/chai/lib/chai/utils/overwriteProperty.js
  var require_overwriteProperty = __commonJS((exports, module) => {
    /*!
     * Chai - overwriteProperty utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var chai2 = require_chai();
    var flag = require_flag();
    var isProxyEnabled = require_isProxyEnabled();
    var transferFlags = require_transferFlags();
    module.exports = function overwriteProperty(ctx, name, getter) {
      var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function() {
      };
      if (_get && typeof _get.get === "function")
        _super = _get.get;
      Object.defineProperty(ctx, name, {
        get: function overwritingPropertyGetter() {
          if (!isProxyEnabled() && !flag(this, "lockSsfi")) {
            flag(this, "ssfi", overwritingPropertyGetter);
          }
          var origLockSsfi = flag(this, "lockSsfi");
          flag(this, "lockSsfi", true);
          var result = getter(_super).call(this);
          flag(this, "lockSsfi", origLockSsfi);
          if (result !== void 0) {
            return result;
          }
          var newAssertion = new chai2.Assertion();
          transferFlags(this, newAssertion);
          return newAssertion;
        },
        configurable: true
      });
    };
  });

  // node_modules/chai/lib/chai/utils/overwriteMethod.js
  var require_overwriteMethod = __commonJS((exports, module) => {
    /*!
     * Chai - overwriteMethod utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var addLengthGuard = require_addLengthGuard();
    var chai2 = require_chai();
    var flag = require_flag();
    var proxify = require_proxify();
    var transferFlags = require_transferFlags();
    module.exports = function overwriteMethod(ctx, name, method) {
      var _method = ctx[name], _super = function() {
        throw new Error(name + " is not a function");
      };
      if (_method && typeof _method === "function")
        _super = _method;
      var overwritingMethodWrapper = function() {
        if (!flag(this, "lockSsfi")) {
          flag(this, "ssfi", overwritingMethodWrapper);
        }
        var origLockSsfi = flag(this, "lockSsfi");
        flag(this, "lockSsfi", true);
        var result = method(_super).apply(this, arguments);
        flag(this, "lockSsfi", origLockSsfi);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
      addLengthGuard(overwritingMethodWrapper, name, false);
      ctx[name] = proxify(overwritingMethodWrapper, name);
    };
  });

  // node_modules/chai/lib/chai/utils/addChainableMethod.js
  var require_addChainableMethod = __commonJS((exports, module) => {
    /*!
     * Chai - addChainingMethod utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Module dependencies
     */
    var addLengthGuard = require_addLengthGuard();
    var chai2 = require_chai();
    var flag = require_flag();
    var proxify = require_proxify();
    var transferFlags = require_transferFlags();
    /*!
     * Module variables
     */
    var canSetPrototype = typeof Object.setPrototypeOf === "function";
    var testFn = function() {
    };
    var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
      var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
      if (typeof propDesc !== "object")
        return true;
      return !propDesc.configurable;
    });
    var call = Function.prototype.call;
    var apply = Function.prototype.apply;
    module.exports = function addChainableMethod(ctx, name, method, chainingBehavior) {
      if (typeof chainingBehavior !== "function") {
        chainingBehavior = function() {
        };
      }
      var chainableBehavior = {
        method,
        chainingBehavior
      };
      if (!ctx.__methods) {
        ctx.__methods = {};
      }
      ctx.__methods[name] = chainableBehavior;
      Object.defineProperty(ctx, name, {
        get: function chainableMethodGetter() {
          chainableBehavior.chainingBehavior.call(this);
          var chainableMethodWrapper = function() {
            if (!flag(this, "lockSsfi")) {
              flag(this, "ssfi", chainableMethodWrapper);
            }
            var result = chainableBehavior.method.apply(this, arguments);
            if (result !== void 0) {
              return result;
            }
            var newAssertion = new chai2.Assertion();
            transferFlags(this, newAssertion);
            return newAssertion;
          };
          addLengthGuard(chainableMethodWrapper, name, true);
          if (canSetPrototype) {
            var prototype = Object.create(this);
            prototype.call = call;
            prototype.apply = apply;
            Object.setPrototypeOf(chainableMethodWrapper, prototype);
          } else {
            var asserterNames = Object.getOwnPropertyNames(ctx);
            asserterNames.forEach(function(asserterName) {
              if (excludeNames.indexOf(asserterName) !== -1) {
                return;
              }
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
              Object.defineProperty(chainableMethodWrapper, asserterName, pd);
            });
          }
          transferFlags(this, chainableMethodWrapper);
          return proxify(chainableMethodWrapper);
        },
        configurable: true
      });
    };
  });

  // node_modules/chai/lib/chai/utils/overwriteChainableMethod.js
  var require_overwriteChainableMethod = __commonJS((exports, module) => {
    /*!
     * Chai - overwriteChainableMethod utility
     * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var chai2 = require_chai();
    var transferFlags = require_transferFlags();
    module.exports = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
      var chainableBehavior = ctx.__methods[name];
      var _chainingBehavior = chainableBehavior.chainingBehavior;
      chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
        var result = chainingBehavior(_chainingBehavior).call(this);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
      var _method = chainableBehavior.method;
      chainableBehavior.method = function overwritingChainableMethodWrapper() {
        var result = method(_method).apply(this, arguments);
        if (result !== void 0) {
          return result;
        }
        var newAssertion = new chai2.Assertion();
        transferFlags(this, newAssertion);
        return newAssertion;
      };
    };
  });

  // node_modules/chai/lib/chai/utils/compareByInspect.js
  var require_compareByInspect = __commonJS((exports, module) => {
    /*!
     * Chai - compareByInspect utility
     * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Module dependencies
     */
    var inspect = require_inspect();
    module.exports = function compareByInspect(a, b) {
      return inspect(a) < inspect(b) ? -1 : 1;
    };
  });

  // node_modules/chai/lib/chai/utils/getOwnEnumerablePropertySymbols.js
  var require_getOwnEnumerablePropertySymbols = __commonJS((exports, module) => {
    /*!
     * Chai - getOwnEnumerablePropertySymbols utility
     * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function getOwnEnumerablePropertySymbols(obj) {
      if (typeof Object.getOwnPropertySymbols !== "function")
        return [];
      return Object.getOwnPropertySymbols(obj).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
      });
    };
  });

  // node_modules/chai/lib/chai/utils/getOwnEnumerableProperties.js
  var require_getOwnEnumerableProperties = __commonJS((exports, module) => {
    /*!
     * Chai - getOwnEnumerableProperties utility
     * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Module dependencies
     */
    var getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
    module.exports = function getOwnEnumerableProperties(obj) {
      return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
    };
  });

  // node_modules/check-error/index.js
  var require_check_error = __commonJS((exports, module) => {
    "use strict";
    function compatibleInstance(thrown, errorLike) {
      return errorLike instanceof Error && thrown === errorLike;
    }
    function compatibleConstructor(thrown, errorLike) {
      if (errorLike instanceof Error) {
        return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
      } else if (errorLike.prototype instanceof Error || errorLike === Error) {
        return thrown.constructor === errorLike || thrown instanceof errorLike;
      }
      return false;
    }
    function compatibleMessage(thrown, errMatcher) {
      var comparisonString = typeof thrown === "string" ? thrown : thrown.message;
      if (errMatcher instanceof RegExp) {
        return errMatcher.test(comparisonString);
      } else if (typeof errMatcher === "string") {
        return comparisonString.indexOf(errMatcher) !== -1;
      }
      return false;
    }
    var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
    function getFunctionName(constructorFn) {
      var name = "";
      if (typeof constructorFn.name === "undefined") {
        var match = String(constructorFn).match(functionNameMatch);
        if (match) {
          name = match[1];
        }
      } else {
        name = constructorFn.name;
      }
      return name;
    }
    function getConstructorName(errorLike) {
      var constructorName = errorLike;
      if (errorLike instanceof Error) {
        constructorName = getFunctionName(errorLike.constructor);
      } else if (typeof errorLike === "function") {
        constructorName = getFunctionName(errorLike).trim() || getFunctionName(new errorLike());
      }
      return constructorName;
    }
    function getMessage(errorLike) {
      var msg = "";
      if (errorLike && errorLike.message) {
        msg = errorLike.message;
      } else if (typeof errorLike === "string") {
        msg = errorLike;
      }
      return msg;
    }
    module.exports = {
      compatibleInstance,
      compatibleConstructor,
      compatibleMessage,
      getMessage,
      getConstructorName
    };
  });

  // node_modules/chai/lib/chai/utils/isNaN.js
  var require_isNaN = __commonJS((exports, module) => {
    /*!
     * Chai - isNaN utility
     * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
     * MIT Licensed
     */
    function isNaN2(value) {
      return value !== value;
    }
    module.exports = Number.isNaN || isNaN2;
  });

  // node_modules/chai/lib/chai/utils/getOperator.js
  var require_getOperator = __commonJS((exports, module) => {
    var type = require_type_detect();
    var flag = require_flag();
    function isObjectType(obj) {
      var objectType = type(obj);
      var objectTypes = ["Array", "Object", "function"];
      return objectTypes.indexOf(objectType) !== -1;
    }
    module.exports = function getOperator(obj, args) {
      var operator = flag(obj, "operator");
      var negate = flag(obj, "negate");
      var expected = args[3];
      var msg = negate ? args[2] : args[1];
      if (operator) {
        return operator;
      }
      if (typeof msg === "function")
        msg = msg();
      msg = msg || "";
      if (!msg) {
        return void 0;
      }
      if (/\shave\s/.test(msg)) {
        return void 0;
      }
      var isObject = isObjectType(expected);
      if (/\snot\s/.test(msg)) {
        return isObject ? "notDeepStrictEqual" : "notStrictEqual";
      }
      return isObject ? "deepStrictEqual" : "strictEqual";
    };
  });

  // node_modules/chai/lib/chai/utils/index.js
  var require_utils2 = __commonJS((exports) => {
    /*!
     * chai
     * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    /*!
     * Dependencies that are used for multiple exports are required here only once
     */
    var pathval = require_pathval();
    /*!
     * test utility
     */
    exports.test = require_test2();
    /*!
     * type utility
     */
    exports.type = require_type_detect();
    /*!
     * expectTypes utility
     */
    exports.expectTypes = require_expectTypes();
    /*!
     * message utility
     */
    exports.getMessage = require_getMessage();
    /*!
     * actual utility
     */
    exports.getActual = require_getActual();
    /*!
     * Inspect util
     */
    exports.inspect = require_inspect();
    /*!
     * Object Display util
     */
    exports.objDisplay = require_objDisplay();
    /*!
     * Flag utility
     */
    exports.flag = require_flag();
    /*!
     * Flag transferring utility
     */
    exports.transferFlags = require_transferFlags();
    /*!
     * Deep equal utility
     */
    exports.eql = require_deep_eql();
    /*!
     * Deep path info
     */
    exports.getPathInfo = pathval.getPathInfo;
    /*!
     * Check if a property exists
     */
    exports.hasProperty = pathval.hasProperty;
    /*!
     * Function name
     */
    exports.getName = require_get_func_name();
    /*!
     * add Property
     */
    exports.addProperty = require_addProperty();
    /*!
     * add Method
     */
    exports.addMethod = require_addMethod();
    /*!
     * overwrite Property
     */
    exports.overwriteProperty = require_overwriteProperty();
    /*!
     * overwrite Method
     */
    exports.overwriteMethod = require_overwriteMethod();
    /*!
     * Add a chainable method
     */
    exports.addChainableMethod = require_addChainableMethod();
    /*!
     * Overwrite chainable method
     */
    exports.overwriteChainableMethod = require_overwriteChainableMethod();
    /*!
     * Compare by inspect method
     */
    exports.compareByInspect = require_compareByInspect();
    /*!
     * Get own enumerable property symbols method
     */
    exports.getOwnEnumerablePropertySymbols = require_getOwnEnumerablePropertySymbols();
    /*!
     * Get own enumerable properties method
     */
    exports.getOwnEnumerableProperties = require_getOwnEnumerableProperties();
    /*!
     * Checks error against a given set of criteria
     */
    exports.checkError = require_check_error();
    /*!
     * Proxify util
     */
    exports.proxify = require_proxify();
    /*!
     * addLengthGuard util
     */
    exports.addLengthGuard = require_addLengthGuard();
    /*!
     * isProxyEnabled helper
     */
    exports.isProxyEnabled = require_isProxyEnabled();
    /*!
     * isNaN method
     */
    exports.isNaN = require_isNaN();
    /*!
     * getOperator method
     */
    exports.getOperator = require_getOperator();
  });

  // node_modules/chai/lib/chai/assertion.js
  var require_assertion = __commonJS((exports, module) => {
    /*!
     * chai
     * http://chaijs.com
     * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var config2 = require_config();
    module.exports = function(_chai, util2) {
      /*!
       * Module dependencies.
       */
      var AssertionError2 = _chai.AssertionError, flag = util2.flag;
      /*!
       * Module export.
       */
      _chai.Assertion = Assertion;
      /*!
       * Assertion Constructor
       *
       * Creates object for chaining.
       *
       * `Assertion` objects contain metadata in the form of flags. Three flags can
       * be assigned during instantiation by passing arguments to this constructor:
       *
       * - `object`: This flag contains the target of the assertion. For example, in
       *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
       *   contain `numKittens` so that the `equal` assertion can reference it when
       *   needed.
       *
       * - `message`: This flag contains an optional custom error message to be
       *   prepended to the error message that's generated by the assertion when it
       *   fails.
       *
       * - `ssfi`: This flag stands for "start stack function indicator". It
       *   contains a function reference that serves as the starting point for
       *   removing frames from the stack trace of the error that's created by the
       *   assertion when it fails. The goal is to provide a cleaner stack trace to
       *   end users by removing Chai's internal functions. Note that it only works
       *   in environments that support `Error.captureStackTrace`, and only when
       *   `Chai.config.includeStack` hasn't been set to `false`.
       *
       * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
       *   should retain its current value, even as assertions are chained off of
       *   this object. This is usually set to `true` when creating a new assertion
       *   from within another assertion. It's also temporarily set to `true` before
       *   an overwritten assertion gets called by the overwriting assertion.
       *
       * @param {Mixed} obj target of the assertion
       * @param {String} msg (optional) custom error message
       * @param {Function} ssfi (optional) starting point for removing stack frames
       * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
       * @api private
       */
      function Assertion(obj, msg, ssfi, lockSsfi) {
        flag(this, "ssfi", ssfi || Assertion);
        flag(this, "lockSsfi", lockSsfi);
        flag(this, "object", obj);
        flag(this, "message", msg);
        return util2.proxify(this);
      }
      Object.defineProperty(Assertion, "includeStack", {
        get: function() {
          console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
          return config2.includeStack;
        },
        set: function(value) {
          console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead.");
          config2.includeStack = value;
        }
      });
      Object.defineProperty(Assertion, "showDiff", {
        get: function() {
          console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
          return config2.showDiff;
        },
        set: function(value) {
          console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead.");
          config2.showDiff = value;
        }
      });
      Assertion.addProperty = function(name, fn) {
        util2.addProperty(this.prototype, name, fn);
      };
      Assertion.addMethod = function(name, fn) {
        util2.addMethod(this.prototype, name, fn);
      };
      Assertion.addChainableMethod = function(name, fn, chainingBehavior) {
        util2.addChainableMethod(this.prototype, name, fn, chainingBehavior);
      };
      Assertion.overwriteProperty = function(name, fn) {
        util2.overwriteProperty(this.prototype, name, fn);
      };
      Assertion.overwriteMethod = function(name, fn) {
        util2.overwriteMethod(this.prototype, name, fn);
      };
      Assertion.overwriteChainableMethod = function(name, fn, chainingBehavior) {
        util2.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
      };
      Assertion.prototype.assert = function(expr, msg, negateMsg, expected, _actual, showDiff) {
        var ok = util2.test(this, arguments);
        if (showDiff !== false)
          showDiff = true;
        if (expected === void 0 && _actual === void 0)
          showDiff = false;
        if (config2.showDiff !== true)
          showDiff = false;
        if (!ok) {
          msg = util2.getMessage(this, arguments);
          var actual = util2.getActual(this, arguments);
          var assertionErrorObjectProperties = {
            actual,
            expected,
            showDiff
          };
          var operator = util2.getOperator(this, arguments);
          if (operator) {
            assertionErrorObjectProperties.operator = operator;
          }
          throw new AssertionError2(msg, assertionErrorObjectProperties, config2.includeStack ? this.assert : flag(this, "ssfi"));
        }
      };
      /*!
       * ### ._obj
       *
       * Quick reference to stored `actual` value for plugin developers.
       *
       * @api private
       */
      Object.defineProperty(Assertion.prototype, "_obj", {
        get: function() {
          return flag(this, "object");
        },
        set: function(val) {
          flag(this, "object", val);
        }
      });
    };
  });

  // node_modules/chai/lib/chai/core/assertions.js
  var require_assertions = __commonJS((exports, module) => {
    /*!
     * chai
     * http://chaijs.com
     * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function(chai2, _) {
      var Assertion = chai2.Assertion, AssertionError2 = chai2.AssertionError, flag = _.flag;
      [
        "to",
        "be",
        "been",
        "is",
        "and",
        "has",
        "have",
        "with",
        "that",
        "which",
        "at",
        "of",
        "same",
        "but",
        "does",
        "still"
      ].forEach(function(chain) {
        Assertion.addProperty(chain);
      });
      Assertion.addProperty("not", function() {
        flag(this, "negate", true);
      });
      Assertion.addProperty("deep", function() {
        flag(this, "deep", true);
      });
      Assertion.addProperty("nested", function() {
        flag(this, "nested", true);
      });
      Assertion.addProperty("own", function() {
        flag(this, "own", true);
      });
      Assertion.addProperty("ordered", function() {
        flag(this, "ordered", true);
      });
      Assertion.addProperty("any", function() {
        flag(this, "any", true);
        flag(this, "all", false);
      });
      Assertion.addProperty("all", function() {
        flag(this, "all", true);
        flag(this, "any", false);
      });
      function an(type, msg) {
        if (msg)
          flag(this, "message", msg);
        type = type.toLowerCase();
        var obj = flag(this, "object"), article = ~["a", "e", "i", "o", "u"].indexOf(type.charAt(0)) ? "an " : "a ";
        this.assert(type === _.type(obj).toLowerCase(), "expected #{this} to be " + article + type, "expected #{this} not to be " + article + type);
      }
      Assertion.addChainableMethod("an", an);
      Assertion.addChainableMethod("a", an);
      function SameValueZero(a, b) {
        return _.isNaN(a) && _.isNaN(b) || a === b;
      }
      function includeChainingBehavior() {
        flag(this, "contains", true);
      }
      function include(val, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), negate = flag(this, "negate"), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), descriptor = isDeep ? "deep " : "";
        flagMsg = flagMsg ? flagMsg + ": " : "";
        var included = false;
        switch (objType) {
          case "string":
            included = obj.indexOf(val) !== -1;
            break;
          case "weakset":
            if (isDeep) {
              throw new AssertionError2(flagMsg + "unable to use .deep.include with WeakSet", void 0, ssfi);
            }
            included = obj.has(val);
            break;
          case "map":
            var isEql = isDeep ? _.eql : SameValueZero;
            obj.forEach(function(item) {
              included = included || isEql(item, val);
            });
            break;
          case "set":
            if (isDeep) {
              obj.forEach(function(item) {
                included = included || _.eql(item, val);
              });
            } else {
              included = obj.has(val);
            }
            break;
          case "array":
            if (isDeep) {
              included = obj.some(function(item) {
                return _.eql(item, val);
              });
            } else {
              included = obj.indexOf(val) !== -1;
            }
            break;
          default:
            if (val !== Object(val)) {
              throw new AssertionError2(flagMsg + "the given combination of arguments (" + objType + " and " + _.type(val).toLowerCase() + ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " + _.type(val).toLowerCase(), void 0, ssfi);
            }
            var props = Object.keys(val), firstErr = null, numErrs = 0;
            props.forEach(function(prop) {
              var propAssertion = new Assertion(obj);
              _.transferFlags(this, propAssertion, true);
              flag(propAssertion, "lockSsfi", true);
              if (!negate || props.length === 1) {
                propAssertion.property(prop, val[prop]);
                return;
              }
              try {
                propAssertion.property(prop, val[prop]);
              } catch (err) {
                if (!_.checkError.compatibleConstructor(err, AssertionError2)) {
                  throw err;
                }
                if (firstErr === null)
                  firstErr = err;
                numErrs++;
              }
            }, this);
            if (negate && props.length > 1 && numErrs === props.length) {
              throw firstErr;
            }
            return;
        }
        this.assert(included, "expected #{this} to " + descriptor + "include " + _.inspect(val), "expected #{this} to not " + descriptor + "include " + _.inspect(val));
      }
      Assertion.addChainableMethod("include", include, includeChainingBehavior);
      Assertion.addChainableMethod("contain", include, includeChainingBehavior);
      Assertion.addChainableMethod("contains", include, includeChainingBehavior);
      Assertion.addChainableMethod("includes", include, includeChainingBehavior);
      Assertion.addProperty("ok", function() {
        this.assert(flag(this, "object"), "expected #{this} to be truthy", "expected #{this} to be falsy");
      });
      Assertion.addProperty("true", function() {
        this.assert(flag(this, "object") === true, "expected #{this} to be true", "expected #{this} to be false", flag(this, "negate") ? false : true);
      });
      Assertion.addProperty("false", function() {
        this.assert(flag(this, "object") === false, "expected #{this} to be false", "expected #{this} to be true", flag(this, "negate") ? true : false);
      });
      Assertion.addProperty("null", function() {
        this.assert(flag(this, "object") === null, "expected #{this} to be null", "expected #{this} not to be null");
      });
      Assertion.addProperty("undefined", function() {
        this.assert(flag(this, "object") === void 0, "expected #{this} to be undefined", "expected #{this} not to be undefined");
      });
      Assertion.addProperty("NaN", function() {
        this.assert(_.isNaN(flag(this, "object")), "expected #{this} to be NaN", "expected #{this} not to be NaN");
      });
      Assertion.addProperty("exist", function() {
        var val = flag(this, "object");
        this.assert(val !== null && val !== void 0, "expected #{this} to exist", "expected #{this} to not exist");
      });
      Assertion.addProperty("empty", function() {
        var val = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), itemsCount;
        flagMsg = flagMsg ? flagMsg + ": " : "";
        switch (_.type(val).toLowerCase()) {
          case "array":
          case "string":
            itemsCount = val.length;
            break;
          case "map":
          case "set":
            itemsCount = val.size;
            break;
          case "weakmap":
          case "weakset":
            throw new AssertionError2(flagMsg + ".empty was passed a weak collection", void 0, ssfi);
          case "function":
            var msg = flagMsg + ".empty was passed a function " + _.getName(val);
            throw new AssertionError2(msg.trim(), void 0, ssfi);
          default:
            if (val !== Object(val)) {
              throw new AssertionError2(flagMsg + ".empty was passed non-string primitive " + _.inspect(val), void 0, ssfi);
            }
            itemsCount = Object.keys(val).length;
        }
        this.assert(itemsCount === 0, "expected #{this} to be empty", "expected #{this} not to be empty");
      });
      function checkArguments() {
        var obj = flag(this, "object"), type = _.type(obj);
        this.assert(type === "Arguments", "expected #{this} to be arguments but got " + type, "expected #{this} to not be arguments");
      }
      Assertion.addProperty("arguments", checkArguments);
      Assertion.addProperty("Arguments", checkArguments);
      function assertEqual(val, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        if (flag(this, "deep")) {
          var prevLockSsfi = flag(this, "lockSsfi");
          flag(this, "lockSsfi", true);
          this.eql(val);
          flag(this, "lockSsfi", prevLockSsfi);
        } else {
          this.assert(val === obj, "expected #{this} to equal #{exp}", "expected #{this} to not equal #{exp}", val, this._obj, true);
        }
      }
      Assertion.addMethod("equal", assertEqual);
      Assertion.addMethod("equals", assertEqual);
      Assertion.addMethod("eq", assertEqual);
      function assertEql(obj, msg) {
        if (msg)
          flag(this, "message", msg);
        this.assert(_.eql(obj, flag(this, "object")), "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", obj, this._obj, true);
      }
      Assertion.addMethod("eql", assertEql);
      Assertion.addMethod("eqls", assertEql);
      function assertAbove(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to above must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to above must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount > n, "expected #{this} to have a " + descriptor + " above #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " above #{exp}", n, itemsCount);
        } else {
          this.assert(obj > n, "expected #{this} to be above #{exp}", "expected #{this} to be at most #{exp}", n);
        }
      }
      Assertion.addMethod("above", assertAbove);
      Assertion.addMethod("gt", assertAbove);
      Assertion.addMethod("greaterThan", assertAbove);
      function assertLeast(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to least must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to least must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount >= n, "expected #{this} to have a " + descriptor + " at least #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " below #{exp}", n, itemsCount);
        } else {
          this.assert(obj >= n, "expected #{this} to be at least #{exp}", "expected #{this} to be below #{exp}", n);
        }
      }
      Assertion.addMethod("least", assertLeast);
      Assertion.addMethod("gte", assertLeast);
      function assertBelow(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to below must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to below must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount < n, "expected #{this} to have a " + descriptor + " below #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " below #{exp}", n, itemsCount);
        } else {
          this.assert(obj < n, "expected #{this} to be below #{exp}", "expected #{this} to be at least #{exp}", n);
        }
      }
      Assertion.addMethod("below", assertBelow);
      Assertion.addMethod("lt", assertBelow);
      Assertion.addMethod("lessThan", assertBelow);
      function assertMost(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), errorMessage, shouldThrow = true;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && nType !== "date")) {
          errorMessage = msgPrefix + "the argument to most must be a date";
        } else if (nType !== "number" && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the argument to most must be a number";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount <= n, "expected #{this} to have a " + descriptor + " at most #{exp} but got #{act}", "expected #{this} to have a " + descriptor + " above #{exp}", n, itemsCount);
        } else {
          this.assert(obj <= n, "expected #{this} to be at most #{exp}", "expected #{this} to be above #{exp}", n);
        }
      }
      Assertion.addMethod("most", assertMost);
      Assertion.addMethod("lte", assertMost);
      Assertion.addMethod("within", function(start, finish, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), doLength = flag(this, "doLength"), flagMsg = flag(this, "message"), msgPrefix = flagMsg ? flagMsg + ": " : "", ssfi = flag(this, "ssfi"), objType = _.type(obj).toLowerCase(), startType = _.type(start).toLowerCase(), finishType = _.type(finish).toLowerCase(), errorMessage, shouldThrow = true, range = startType === "date" && finishType === "date" ? start.toUTCString() + ".." + finish.toUTCString() : start + ".." + finish;
        if (doLength && objType !== "map" && objType !== "set") {
          new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
        }
        if (!doLength && (objType === "date" && (startType !== "date" || finishType !== "date"))) {
          errorMessage = msgPrefix + "the arguments to within must be dates";
        } else if ((startType !== "number" || finishType !== "number") && (doLength || objType === "number")) {
          errorMessage = msgPrefix + "the arguments to within must be numbers";
        } else if (!doLength && (objType !== "date" && objType !== "number")) {
          var printObj = objType === "string" ? "'" + obj + "'" : obj;
          errorMessage = msgPrefix + "expected " + printObj + " to be a number or a date";
        } else {
          shouldThrow = false;
        }
        if (shouldThrow) {
          throw new AssertionError2(errorMessage, void 0, ssfi);
        }
        if (doLength) {
          var descriptor = "length", itemsCount;
          if (objType === "map" || objType === "set") {
            descriptor = "size";
            itemsCount = obj.size;
          } else {
            itemsCount = obj.length;
          }
          this.assert(itemsCount >= start && itemsCount <= finish, "expected #{this} to have a " + descriptor + " within " + range, "expected #{this} to not have a " + descriptor + " within " + range);
        } else {
          this.assert(obj >= start && obj <= finish, "expected #{this} to be within " + range, "expected #{this} to not be within " + range);
        }
      });
      function assertInstanceOf(constructor, msg) {
        if (msg)
          flag(this, "message", msg);
        var target = flag(this, "object");
        var ssfi = flag(this, "ssfi");
        var flagMsg = flag(this, "message");
        try {
          var isInstanceOf = target instanceof constructor;
        } catch (err) {
          if (err instanceof TypeError) {
            flagMsg = flagMsg ? flagMsg + ": " : "";
            throw new AssertionError2(flagMsg + "The instanceof assertion needs a constructor but " + _.type(constructor) + " was given.", void 0, ssfi);
          }
          throw err;
        }
        var name = _.getName(constructor);
        if (name === null) {
          name = "an unnamed constructor";
        }
        this.assert(isInstanceOf, "expected #{this} to be an instance of " + name, "expected #{this} to not be an instance of " + name);
      }
      ;
      Assertion.addMethod("instanceof", assertInstanceOf);
      Assertion.addMethod("instanceOf", assertInstanceOf);
      function assertProperty(name, val, msg) {
        if (msg)
          flag(this, "message", msg);
        var isNested = flag(this, "nested"), isOwn = flag(this, "own"), flagMsg = flag(this, "message"), obj = flag(this, "object"), ssfi = flag(this, "ssfi"), nameType = typeof name;
        flagMsg = flagMsg ? flagMsg + ": " : "";
        if (isNested) {
          if (nameType !== "string") {
            throw new AssertionError2(flagMsg + "the argument to property must be a string when using nested syntax", void 0, ssfi);
          }
        } else {
          if (nameType !== "string" && nameType !== "number" && nameType !== "symbol") {
            throw new AssertionError2(flagMsg + "the argument to property must be a string, number, or symbol", void 0, ssfi);
          }
        }
        if (isNested && isOwn) {
          throw new AssertionError2(flagMsg + 'The "nested" and "own" flags cannot be combined.', void 0, ssfi);
        }
        if (obj === null || obj === void 0) {
          throw new AssertionError2(flagMsg + "Target cannot be null or undefined.", void 0, ssfi);
        }
        var isDeep = flag(this, "deep"), negate = flag(this, "negate"), pathInfo = isNested ? _.getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name];
        var descriptor = "";
        if (isDeep)
          descriptor += "deep ";
        if (isOwn)
          descriptor += "own ";
        if (isNested)
          descriptor += "nested ";
        descriptor += "property ";
        var hasProperty;
        if (isOwn)
          hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
        else if (isNested)
          hasProperty = pathInfo.exists;
        else
          hasProperty = _.hasProperty(obj, name);
        if (!negate || arguments.length === 1) {
          this.assert(hasProperty, "expected #{this} to have " + descriptor + _.inspect(name), "expected #{this} to not have " + descriptor + _.inspect(name));
        }
        if (arguments.length > 1) {
          this.assert(hasProperty && (isDeep ? _.eql(val, value) : val === value), "expected #{this} to have " + descriptor + _.inspect(name) + " of #{exp}, but got #{act}", "expected #{this} to not have " + descriptor + _.inspect(name) + " of #{act}", val, value);
        }
        flag(this, "object", value);
      }
      Assertion.addMethod("property", assertProperty);
      function assertOwnProperty(name, value, msg) {
        flag(this, "own", true);
        assertProperty.apply(this, arguments);
      }
      Assertion.addMethod("ownProperty", assertOwnProperty);
      Assertion.addMethod("haveOwnProperty", assertOwnProperty);
      function assertOwnPropertyDescriptor(name, descriptor, msg) {
        if (typeof descriptor === "string") {
          msg = descriptor;
          descriptor = null;
        }
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
        if (actualDescriptor && descriptor) {
          this.assert(_.eql(descriptor, actualDescriptor), "expected the own property descriptor for " + _.inspect(name) + " on #{this} to match " + _.inspect(descriptor) + ", got " + _.inspect(actualDescriptor), "expected the own property descriptor for " + _.inspect(name) + " on #{this} to not match " + _.inspect(descriptor), descriptor, actualDescriptor, true);
        } else {
          this.assert(actualDescriptor, "expected #{this} to have an own property descriptor for " + _.inspect(name), "expected #{this} to not have an own property descriptor for " + _.inspect(name));
        }
        flag(this, "object", actualDescriptor);
      }
      Assertion.addMethod("ownPropertyDescriptor", assertOwnPropertyDescriptor);
      Assertion.addMethod("haveOwnPropertyDescriptor", assertOwnPropertyDescriptor);
      function assertLengthChain() {
        flag(this, "doLength", true);
      }
      function assertLength(n, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), descriptor = "length", itemsCount;
        switch (objType) {
          case "map":
          case "set":
            descriptor = "size";
            itemsCount = obj.size;
            break;
          default:
            new Assertion(obj, flagMsg, ssfi, true).to.have.property("length");
            itemsCount = obj.length;
        }
        this.assert(itemsCount == n, "expected #{this} to have a " + descriptor + " of #{exp} but got #{act}", "expected #{this} to not have a " + descriptor + " of #{act}", n, itemsCount);
      }
      Assertion.addChainableMethod("length", assertLength, assertLengthChain);
      Assertion.addChainableMethod("lengthOf", assertLength, assertLengthChain);
      function assertMatch(re, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        this.assert(re.exec(obj), "expected #{this} to match " + re, "expected #{this} not to match " + re);
      }
      Assertion.addMethod("match", assertMatch);
      Assertion.addMethod("matches", assertMatch);
      Assertion.addMethod("string", function(str, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion(obj, flagMsg, ssfi, true).is.a("string");
        this.assert(~obj.indexOf(str), "expected #{this} to contain " + _.inspect(str), "expected #{this} to not contain " + _.inspect(str));
      });
      function assertKeys(keys) {
        var obj = flag(this, "object"), objType = _.type(obj), keysType = _.type(keys), ssfi = flag(this, "ssfi"), isDeep = flag(this, "deep"), str, deepStr = "", actual, ok = true, flagMsg = flag(this, "message");
        flagMsg = flagMsg ? flagMsg + ": " : "";
        var mixedArgsMsg = flagMsg + "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
        if (objType === "Map" || objType === "Set") {
          deepStr = isDeep ? "deeply " : "";
          actual = [];
          obj.forEach(function(val, key) {
            actual.push(key);
          });
          if (keysType !== "Array") {
            keys = Array.prototype.slice.call(arguments);
          }
        } else {
          actual = _.getOwnEnumerableProperties(obj);
          switch (keysType) {
            case "Array":
              if (arguments.length > 1) {
                throw new AssertionError2(mixedArgsMsg, void 0, ssfi);
              }
              break;
            case "Object":
              if (arguments.length > 1) {
                throw new AssertionError2(mixedArgsMsg, void 0, ssfi);
              }
              keys = Object.keys(keys);
              break;
            default:
              keys = Array.prototype.slice.call(arguments);
          }
          keys = keys.map(function(val) {
            return typeof val === "symbol" ? val : String(val);
          });
        }
        if (!keys.length) {
          throw new AssertionError2(flagMsg + "keys required", void 0, ssfi);
        }
        var len = keys.length, any = flag(this, "any"), all = flag(this, "all"), expected = keys;
        if (!any && !all) {
          all = true;
        }
        if (any) {
          ok = expected.some(function(expectedKey) {
            return actual.some(function(actualKey) {
              if (isDeep) {
                return _.eql(expectedKey, actualKey);
              } else {
                return expectedKey === actualKey;
              }
            });
          });
        }
        if (all) {
          ok = expected.every(function(expectedKey) {
            return actual.some(function(actualKey) {
              if (isDeep) {
                return _.eql(expectedKey, actualKey);
              } else {
                return expectedKey === actualKey;
              }
            });
          });
          if (!flag(this, "contains")) {
            ok = ok && keys.length == actual.length;
          }
        }
        if (len > 1) {
          keys = keys.map(function(key) {
            return _.inspect(key);
          });
          var last = keys.pop();
          if (all) {
            str = keys.join(", ") + ", and " + last;
          }
          if (any) {
            str = keys.join(", ") + ", or " + last;
          }
        } else {
          str = _.inspect(keys[0]);
        }
        str = (len > 1 ? "keys " : "key ") + str;
        str = (flag(this, "contains") ? "contain " : "have ") + str;
        this.assert(ok, "expected #{this} to " + deepStr + str, "expected #{this} to not " + deepStr + str, expected.slice(0).sort(_.compareByInspect), actual.sort(_.compareByInspect), true);
      }
      Assertion.addMethod("keys", assertKeys);
      Assertion.addMethod("key", assertKeys);
      function assertThrows(errorLike, errMsgMatcher, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), ssfi = flag(this, "ssfi"), flagMsg = flag(this, "message"), negate = flag(this, "negate") || false;
        new Assertion(obj, flagMsg, ssfi, true).is.a("function");
        if (errorLike instanceof RegExp || typeof errorLike === "string") {
          errMsgMatcher = errorLike;
          errorLike = null;
        }
        var caughtErr;
        try {
          obj();
        } catch (err) {
          caughtErr = err;
        }
        var everyArgIsUndefined = errorLike === void 0 && errMsgMatcher === void 0;
        var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
        var errorLikeFail = false;
        var errMsgMatcherFail = false;
        if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
          var errorLikeString = "an error";
          if (errorLike instanceof Error) {
            errorLikeString = "#{exp}";
          } else if (errorLike) {
            errorLikeString = _.checkError.getConstructorName(errorLike);
          }
          this.assert(caughtErr, "expected #{this} to throw " + errorLikeString, "expected #{this} to not throw an error but #{act} was thrown", errorLike && errorLike.toString(), caughtErr instanceof Error ? caughtErr.toString() : typeof caughtErr === "string" ? caughtErr : caughtErr && _.checkError.getConstructorName(caughtErr));
        }
        if (errorLike && caughtErr) {
          if (errorLike instanceof Error) {
            var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);
            if (isCompatibleInstance === negate) {
              if (everyArgIsDefined && negate) {
                errorLikeFail = true;
              } else {
                this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr && !negate ? " but #{act} was thrown" : ""), errorLike.toString(), caughtErr.toString());
              }
            }
          }
          var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
          if (isCompatibleConstructor === negate) {
            if (everyArgIsDefined && negate) {
              errorLikeFail = true;
            } else {
              this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr));
            }
          }
        }
        if (caughtErr && errMsgMatcher !== void 0 && errMsgMatcher !== null) {
          var placeholder = "including";
          if (errMsgMatcher instanceof RegExp) {
            placeholder = "matching";
          }
          var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
          if (isCompatibleMessage === negate) {
            if (everyArgIsDefined && negate) {
              errMsgMatcherFail = true;
            } else {
              this.assert(negate, "expected #{this} to throw error " + placeholder + " #{exp} but got #{act}", "expected #{this} to throw error not " + placeholder + " #{exp}", errMsgMatcher, _.checkError.getMessage(caughtErr));
            }
          }
        }
        if (errorLikeFail && errMsgMatcherFail) {
          this.assert(negate, "expected #{this} to throw #{exp} but #{act} was thrown", "expected #{this} to not throw #{exp}" + (caughtErr ? " but #{act} was thrown" : ""), errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike), caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr));
        }
        flag(this, "object", caughtErr);
      }
      ;
      Assertion.addMethod("throw", assertThrows);
      Assertion.addMethod("throws", assertThrows);
      Assertion.addMethod("Throw", assertThrows);
      function respondTo(method, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), itself = flag(this, "itself"), context = typeof obj === "function" && !itself ? obj.prototype[method] : obj[method];
        this.assert(typeof context === "function", "expected #{this} to respond to " + _.inspect(method), "expected #{this} to not respond to " + _.inspect(method));
      }
      Assertion.addMethod("respondTo", respondTo);
      Assertion.addMethod("respondsTo", respondTo);
      Assertion.addProperty("itself", function() {
        flag(this, "itself", true);
      });
      function satisfy(matcher, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object");
        var result = matcher(obj);
        this.assert(result, "expected #{this} to satisfy " + _.objDisplay(matcher), "expected #{this} to not satisfy" + _.objDisplay(matcher), flag(this, "negate") ? false : true, result);
      }
      Assertion.addMethod("satisfy", satisfy);
      Assertion.addMethod("satisfies", satisfy);
      function closeTo(expected, delta, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion(obj, flagMsg, ssfi, true).is.a("number");
        if (typeof expected !== "number" || typeof delta !== "number") {
          flagMsg = flagMsg ? flagMsg + ": " : "";
          var deltaMessage = delta === void 0 ? ", and a delta is required" : "";
          throw new AssertionError2(flagMsg + "the arguments to closeTo or approximately must be numbers" + deltaMessage, void 0, ssfi);
        }
        this.assert(Math.abs(obj - expected) <= delta, "expected #{this} to be close to " + expected + " +/- " + delta, "expected #{this} not to be close to " + expected + " +/- " + delta);
      }
      Assertion.addMethod("closeTo", closeTo);
      Assertion.addMethod("approximately", closeTo);
      function isSubsetOf(subset, superset, cmp, contains, ordered) {
        if (!contains) {
          if (subset.length !== superset.length)
            return false;
          superset = superset.slice();
        }
        return subset.every(function(elem, idx) {
          if (ordered)
            return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
          if (!cmp) {
            var matchIdx = superset.indexOf(elem);
            if (matchIdx === -1)
              return false;
            if (!contains)
              superset.splice(matchIdx, 1);
            return true;
          }
          return superset.some(function(elem2, matchIdx2) {
            if (!cmp(elem, elem2))
              return false;
            if (!contains)
              superset.splice(matchIdx2, 1);
            return true;
          });
        });
      }
      Assertion.addMethod("members", function(subset, msg) {
        if (msg)
          flag(this, "message", msg);
        var obj = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion(obj, flagMsg, ssfi, true).to.be.an("array");
        new Assertion(subset, flagMsg, ssfi, true).to.be.an("array");
        var contains = flag(this, "contains");
        var ordered = flag(this, "ordered");
        var subject, failMsg, failNegateMsg;
        if (contains) {
          subject = ordered ? "an ordered superset" : "a superset";
          failMsg = "expected #{this} to be " + subject + " of #{exp}";
          failNegateMsg = "expected #{this} to not be " + subject + " of #{exp}";
        } else {
          subject = ordered ? "ordered members" : "members";
          failMsg = "expected #{this} to have the same " + subject + " as #{exp}";
          failNegateMsg = "expected #{this} to not have the same " + subject + " as #{exp}";
        }
        var cmp = flag(this, "deep") ? _.eql : void 0;
        this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
      });
      function oneOf(list, msg) {
        if (msg)
          flag(this, "message", msg);
        var expected = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi"), contains = flag(this, "contains");
        new Assertion(list, flagMsg, ssfi, true).to.be.an("array");
        if (contains) {
          this.assert(list.some(function(possibility) {
            return expected.indexOf(possibility) > -1;
          }), "expected #{this} to contain one of #{exp}", "expected #{this} to not contain one of #{exp}", list, expected);
        } else {
          this.assert(list.indexOf(expected) > -1, "expected #{this} to be one of #{exp}", "expected #{this} to not be one of #{exp}", list, expected);
        }
      }
      Assertion.addMethod("oneOf", oneOf);
      function assertChanges(subject, prop, msg) {
        if (msg)
          flag(this, "message", msg);
        var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion(fn, flagMsg, ssfi, true).is.a("function");
        var initial;
        if (!prop) {
          new Assertion(subject, flagMsg, ssfi, true).is.a("function");
          initial = subject();
        } else {
          new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
          initial = subject[prop];
        }
        fn();
        var final = prop === void 0 || prop === null ? subject() : subject[prop];
        var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
        flag(this, "deltaMsgObj", msgObj);
        flag(this, "initialDeltaValue", initial);
        flag(this, "finalDeltaValue", final);
        flag(this, "deltaBehavior", "change");
        flag(this, "realDelta", final !== initial);
        this.assert(initial !== final, "expected " + msgObj + " to change", "expected " + msgObj + " to not change");
      }
      Assertion.addMethod("change", assertChanges);
      Assertion.addMethod("changes", assertChanges);
      function assertIncreases(subject, prop, msg) {
        if (msg)
          flag(this, "message", msg);
        var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion(fn, flagMsg, ssfi, true).is.a("function");
        var initial;
        if (!prop) {
          new Assertion(subject, flagMsg, ssfi, true).is.a("function");
          initial = subject();
        } else {
          new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
          initial = subject[prop];
        }
        new Assertion(initial, flagMsg, ssfi, true).is.a("number");
        fn();
        var final = prop === void 0 || prop === null ? subject() : subject[prop];
        var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
        flag(this, "deltaMsgObj", msgObj);
        flag(this, "initialDeltaValue", initial);
        flag(this, "finalDeltaValue", final);
        flag(this, "deltaBehavior", "increase");
        flag(this, "realDelta", final - initial);
        this.assert(final - initial > 0, "expected " + msgObj + " to increase", "expected " + msgObj + " to not increase");
      }
      Assertion.addMethod("increase", assertIncreases);
      Assertion.addMethod("increases", assertIncreases);
      function assertDecreases(subject, prop, msg) {
        if (msg)
          flag(this, "message", msg);
        var fn = flag(this, "object"), flagMsg = flag(this, "message"), ssfi = flag(this, "ssfi");
        new Assertion(fn, flagMsg, ssfi, true).is.a("function");
        var initial;
        if (!prop) {
          new Assertion(subject, flagMsg, ssfi, true).is.a("function");
          initial = subject();
        } else {
          new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
          initial = subject[prop];
        }
        new Assertion(initial, flagMsg, ssfi, true).is.a("number");
        fn();
        var final = prop === void 0 || prop === null ? subject() : subject[prop];
        var msgObj = prop === void 0 || prop === null ? initial : "." + prop;
        flag(this, "deltaMsgObj", msgObj);
        flag(this, "initialDeltaValue", initial);
        flag(this, "finalDeltaValue", final);
        flag(this, "deltaBehavior", "decrease");
        flag(this, "realDelta", initial - final);
        this.assert(final - initial < 0, "expected " + msgObj + " to decrease", "expected " + msgObj + " to not decrease");
      }
      Assertion.addMethod("decrease", assertDecreases);
      Assertion.addMethod("decreases", assertDecreases);
      function assertDelta(delta, msg) {
        if (msg)
          flag(this, "message", msg);
        var msgObj = flag(this, "deltaMsgObj");
        var initial = flag(this, "initialDeltaValue");
        var final = flag(this, "finalDeltaValue");
        var behavior = flag(this, "deltaBehavior");
        var realDelta = flag(this, "realDelta");
        var expression;
        if (behavior === "change") {
          expression = Math.abs(final - initial) === Math.abs(delta);
        } else {
          expression = realDelta === Math.abs(delta);
        }
        this.assert(expression, "expected " + msgObj + " to " + behavior + " by " + delta, "expected " + msgObj + " to not " + behavior + " by " + delta);
      }
      Assertion.addMethod("by", assertDelta);
      Assertion.addProperty("extensible", function() {
        var obj = flag(this, "object");
        var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
        this.assert(isExtensible, "expected #{this} to be extensible", "expected #{this} to not be extensible");
      });
      Assertion.addProperty("sealed", function() {
        var obj = flag(this, "object");
        var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
        this.assert(isSealed, "expected #{this} to be sealed", "expected #{this} to not be sealed");
      });
      Assertion.addProperty("frozen", function() {
        var obj = flag(this, "object");
        var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
        this.assert(isFrozen, "expected #{this} to be frozen", "expected #{this} to not be frozen");
      });
      Assertion.addProperty("finite", function(msg) {
        var obj = flag(this, "object");
        this.assert(typeof obj === "number" && isFinite(obj), "expected #{this} to be a finite number", "expected #{this} to not be a finite number");
      });
    };
  });

  // node_modules/chai/lib/chai/interface/expect.js
  var require_expect = __commonJS((exports, module) => {
    /*!
     * chai
     * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function(chai2, util2) {
      chai2.expect = function(val, message) {
        return new chai2.Assertion(val, message);
      };
      chai2.expect.fail = function(actual, expected, message, operator) {
        if (arguments.length < 2) {
          message = actual;
          actual = void 0;
        }
        message = message || "expect.fail()";
        throw new chai2.AssertionError(message, {
          actual,
          expected,
          operator
        }, chai2.expect.fail);
      };
    };
  });

  // node_modules/chai/lib/chai/interface/should.js
  var require_should = __commonJS((exports, module) => {
    /*!
     * chai
     * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function(chai2, util2) {
      var Assertion = chai2.Assertion;
      function loadShould() {
        function shouldGetter() {
          if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === "function" && this instanceof Symbol || typeof BigInt === "function" && this instanceof BigInt) {
            return new Assertion(this.valueOf(), null, shouldGetter);
          }
          return new Assertion(this, null, shouldGetter);
        }
        function shouldSetter(value) {
          Object.defineProperty(this, "should", {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        }
        Object.defineProperty(Object.prototype, "should", {
          set: shouldSetter,
          get: shouldGetter,
          configurable: true
        });
        var should2 = {};
        should2.fail = function(actual, expected, message, operator) {
          if (arguments.length < 2) {
            message = actual;
            actual = void 0;
          }
          message = message || "should.fail()";
          throw new chai2.AssertionError(message, {
            actual,
            expected,
            operator
          }, should2.fail);
        };
        should2.equal = function(val1, val2, msg) {
          new Assertion(val1, msg).to.equal(val2);
        };
        should2.Throw = function(fn, errt, errs, msg) {
          new Assertion(fn, msg).to.Throw(errt, errs);
        };
        should2.exist = function(val, msg) {
          new Assertion(val, msg).to.exist;
        };
        should2.not = {};
        should2.not.equal = function(val1, val2, msg) {
          new Assertion(val1, msg).to.not.equal(val2);
        };
        should2.not.Throw = function(fn, errt, errs, msg) {
          new Assertion(fn, msg).to.not.Throw(errt, errs);
        };
        should2.not.exist = function(val, msg) {
          new Assertion(val, msg).to.not.exist;
        };
        should2["throw"] = should2["Throw"];
        should2.not["throw"] = should2.not["Throw"];
        return should2;
      }
      ;
      chai2.should = loadShould;
      chai2.Should = loadShould;
    };
  });

  // node_modules/chai/lib/chai/interface/assert.js
  var require_assert = __commonJS((exports, module) => {
    /*!
     * chai
     * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    module.exports = function(chai2, util2) {
      /*!
       * Chai dependencies.
       */
      var Assertion = chai2.Assertion, flag = util2.flag;
      /*!
       * Module export.
       */
      var assert2 = chai2.assert = function(express, errmsg) {
        var test = new Assertion(null, null, chai2.assert, true);
        test.assert(express, errmsg, "[ negation message unavailable ]");
      };
      assert2.fail = function(actual, expected, message, operator) {
        if (arguments.length < 2) {
          message = actual;
          actual = void 0;
        }
        message = message || "assert.fail()";
        throw new chai2.AssertionError(message, {
          actual,
          expected,
          operator
        }, assert2.fail);
      };
      assert2.isOk = function(val, msg) {
        new Assertion(val, msg, assert2.isOk, true).is.ok;
      };
      assert2.isNotOk = function(val, msg) {
        new Assertion(val, msg, assert2.isNotOk, true).is.not.ok;
      };
      assert2.equal = function(act, exp, msg) {
        var test = new Assertion(act, msg, assert2.equal, true);
        test.assert(exp == flag(test, "object"), "expected #{this} to equal #{exp}", "expected #{this} to not equal #{act}", exp, act, true);
      };
      assert2.notEqual = function(act, exp, msg) {
        var test = new Assertion(act, msg, assert2.notEqual, true);
        test.assert(exp != flag(test, "object"), "expected #{this} to not equal #{exp}", "expected #{this} to equal #{act}", exp, act, true);
      };
      assert2.strictEqual = function(act, exp, msg) {
        new Assertion(act, msg, assert2.strictEqual, true).to.equal(exp);
      };
      assert2.notStrictEqual = function(act, exp, msg) {
        new Assertion(act, msg, assert2.notStrictEqual, true).to.not.equal(exp);
      };
      assert2.deepEqual = assert2.deepStrictEqual = function(act, exp, msg) {
        new Assertion(act, msg, assert2.deepEqual, true).to.eql(exp);
      };
      assert2.notDeepEqual = function(act, exp, msg) {
        new Assertion(act, msg, assert2.notDeepEqual, true).to.not.eql(exp);
      };
      assert2.isAbove = function(val, abv, msg) {
        new Assertion(val, msg, assert2.isAbove, true).to.be.above(abv);
      };
      assert2.isAtLeast = function(val, atlst, msg) {
        new Assertion(val, msg, assert2.isAtLeast, true).to.be.least(atlst);
      };
      assert2.isBelow = function(val, blw, msg) {
        new Assertion(val, msg, assert2.isBelow, true).to.be.below(blw);
      };
      assert2.isAtMost = function(val, atmst, msg) {
        new Assertion(val, msg, assert2.isAtMost, true).to.be.most(atmst);
      };
      assert2.isTrue = function(val, msg) {
        new Assertion(val, msg, assert2.isTrue, true).is["true"];
      };
      assert2.isNotTrue = function(val, msg) {
        new Assertion(val, msg, assert2.isNotTrue, true).to.not.equal(true);
      };
      assert2.isFalse = function(val, msg) {
        new Assertion(val, msg, assert2.isFalse, true).is["false"];
      };
      assert2.isNotFalse = function(val, msg) {
        new Assertion(val, msg, assert2.isNotFalse, true).to.not.equal(false);
      };
      assert2.isNull = function(val, msg) {
        new Assertion(val, msg, assert2.isNull, true).to.equal(null);
      };
      assert2.isNotNull = function(val, msg) {
        new Assertion(val, msg, assert2.isNotNull, true).to.not.equal(null);
      };
      assert2.isNaN = function(val, msg) {
        new Assertion(val, msg, assert2.isNaN, true).to.be.NaN;
      };
      assert2.isNotNaN = function(val, msg) {
        new Assertion(val, msg, assert2.isNotNaN, true).not.to.be.NaN;
      };
      assert2.exists = function(val, msg) {
        new Assertion(val, msg, assert2.exists, true).to.exist;
      };
      assert2.notExists = function(val, msg) {
        new Assertion(val, msg, assert2.notExists, true).to.not.exist;
      };
      assert2.isUndefined = function(val, msg) {
        new Assertion(val, msg, assert2.isUndefined, true).to.equal(void 0);
      };
      assert2.isDefined = function(val, msg) {
        new Assertion(val, msg, assert2.isDefined, true).to.not.equal(void 0);
      };
      assert2.isFunction = function(val, msg) {
        new Assertion(val, msg, assert2.isFunction, true).to.be.a("function");
      };
      assert2.isNotFunction = function(val, msg) {
        new Assertion(val, msg, assert2.isNotFunction, true).to.not.be.a("function");
      };
      assert2.isObject = function(val, msg) {
        new Assertion(val, msg, assert2.isObject, true).to.be.a("object");
      };
      assert2.isNotObject = function(val, msg) {
        new Assertion(val, msg, assert2.isNotObject, true).to.not.be.a("object");
      };
      assert2.isArray = function(val, msg) {
        new Assertion(val, msg, assert2.isArray, true).to.be.an("array");
      };
      assert2.isNotArray = function(val, msg) {
        new Assertion(val, msg, assert2.isNotArray, true).to.not.be.an("array");
      };
      assert2.isString = function(val, msg) {
        new Assertion(val, msg, assert2.isString, true).to.be.a("string");
      };
      assert2.isNotString = function(val, msg) {
        new Assertion(val, msg, assert2.isNotString, true).to.not.be.a("string");
      };
      assert2.isNumber = function(val, msg) {
        new Assertion(val, msg, assert2.isNumber, true).to.be.a("number");
      };
      assert2.isNotNumber = function(val, msg) {
        new Assertion(val, msg, assert2.isNotNumber, true).to.not.be.a("number");
      };
      assert2.isFinite = function(val, msg) {
        new Assertion(val, msg, assert2.isFinite, true).to.be.finite;
      };
      assert2.isBoolean = function(val, msg) {
        new Assertion(val, msg, assert2.isBoolean, true).to.be.a("boolean");
      };
      assert2.isNotBoolean = function(val, msg) {
        new Assertion(val, msg, assert2.isNotBoolean, true).to.not.be.a("boolean");
      };
      assert2.typeOf = function(val, type, msg) {
        new Assertion(val, msg, assert2.typeOf, true).to.be.a(type);
      };
      assert2.notTypeOf = function(val, type, msg) {
        new Assertion(val, msg, assert2.notTypeOf, true).to.not.be.a(type);
      };
      assert2.instanceOf = function(val, type, msg) {
        new Assertion(val, msg, assert2.instanceOf, true).to.be.instanceOf(type);
      };
      assert2.notInstanceOf = function(val, type, msg) {
        new Assertion(val, msg, assert2.notInstanceOf, true).to.not.be.instanceOf(type);
      };
      assert2.include = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.include, true).include(inc);
      };
      assert2.notInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.notInclude, true).not.include(inc);
      };
      assert2.deepInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.deepInclude, true).deep.include(inc);
      };
      assert2.notDeepInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.notDeepInclude, true).not.deep.include(inc);
      };
      assert2.nestedInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.nestedInclude, true).nested.include(inc);
      };
      assert2.notNestedInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.notNestedInclude, true).not.nested.include(inc);
      };
      assert2.deepNestedInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.deepNestedInclude, true).deep.nested.include(inc);
      };
      assert2.notDeepNestedInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.notDeepNestedInclude, true).not.deep.nested.include(inc);
      };
      assert2.ownInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.ownInclude, true).own.include(inc);
      };
      assert2.notOwnInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.notOwnInclude, true).not.own.include(inc);
      };
      assert2.deepOwnInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.deepOwnInclude, true).deep.own.include(inc);
      };
      assert2.notDeepOwnInclude = function(exp, inc, msg) {
        new Assertion(exp, msg, assert2.notDeepOwnInclude, true).not.deep.own.include(inc);
      };
      assert2.match = function(exp, re, msg) {
        new Assertion(exp, msg, assert2.match, true).to.match(re);
      };
      assert2.notMatch = function(exp, re, msg) {
        new Assertion(exp, msg, assert2.notMatch, true).to.not.match(re);
      };
      assert2.property = function(obj, prop, msg) {
        new Assertion(obj, msg, assert2.property, true).to.have.property(prop);
      };
      assert2.notProperty = function(obj, prop, msg) {
        new Assertion(obj, msg, assert2.notProperty, true).to.not.have.property(prop);
      };
      assert2.propertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.propertyVal, true).to.have.property(prop, val);
      };
      assert2.notPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.notPropertyVal, true).to.not.have.property(prop, val);
      };
      assert2.deepPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.deepPropertyVal, true).to.have.deep.property(prop, val);
      };
      assert2.notDeepPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
      };
      assert2.ownProperty = function(obj, prop, msg) {
        new Assertion(obj, msg, assert2.ownProperty, true).to.have.own.property(prop);
      };
      assert2.notOwnProperty = function(obj, prop, msg) {
        new Assertion(obj, msg, assert2.notOwnProperty, true).to.not.have.own.property(prop);
      };
      assert2.ownPropertyVal = function(obj, prop, value, msg) {
        new Assertion(obj, msg, assert2.ownPropertyVal, true).to.have.own.property(prop, value);
      };
      assert2.notOwnPropertyVal = function(obj, prop, value, msg) {
        new Assertion(obj, msg, assert2.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
      };
      assert2.deepOwnPropertyVal = function(obj, prop, value, msg) {
        new Assertion(obj, msg, assert2.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
      };
      assert2.notDeepOwnPropertyVal = function(obj, prop, value, msg) {
        new Assertion(obj, msg, assert2.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
      };
      assert2.nestedProperty = function(obj, prop, msg) {
        new Assertion(obj, msg, assert2.nestedProperty, true).to.have.nested.property(prop);
      };
      assert2.notNestedProperty = function(obj, prop, msg) {
        new Assertion(obj, msg, assert2.notNestedProperty, true).to.not.have.nested.property(prop);
      };
      assert2.nestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.nestedPropertyVal, true).to.have.nested.property(prop, val);
      };
      assert2.notNestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
      };
      assert2.deepNestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
      };
      assert2.notDeepNestedPropertyVal = function(obj, prop, val, msg) {
        new Assertion(obj, msg, assert2.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
      };
      assert2.lengthOf = function(exp, len, msg) {
        new Assertion(exp, msg, assert2.lengthOf, true).to.have.lengthOf(len);
      };
      assert2.hasAnyKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.hasAnyKeys, true).to.have.any.keys(keys);
      };
      assert2.hasAllKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.hasAllKeys, true).to.have.all.keys(keys);
      };
      assert2.containsAllKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.containsAllKeys, true).to.contain.all.keys(keys);
      };
      assert2.doesNotHaveAnyKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
      };
      assert2.doesNotHaveAllKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
      };
      assert2.hasAnyDeepKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
      };
      assert2.hasAllDeepKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
      };
      assert2.containsAllDeepKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
      };
      assert2.doesNotHaveAnyDeepKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
      };
      assert2.doesNotHaveAllDeepKeys = function(obj, keys, msg) {
        new Assertion(obj, msg, assert2.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
      };
      assert2.throws = function(fn, errorLike, errMsgMatcher, msg) {
        if (typeof errorLike === "string" || errorLike instanceof RegExp) {
          errMsgMatcher = errorLike;
          errorLike = null;
        }
        var assertErr = new Assertion(fn, msg, assert2.throws, true).to.throw(errorLike, errMsgMatcher);
        return flag(assertErr, "object");
      };
      assert2.doesNotThrow = function(fn, errorLike, errMsgMatcher, msg) {
        if (typeof errorLike === "string" || errorLike instanceof RegExp) {
          errMsgMatcher = errorLike;
          errorLike = null;
        }
        new Assertion(fn, msg, assert2.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
      };
      assert2.operator = function(val, operator, val2, msg) {
        var ok;
        switch (operator) {
          case "==":
            ok = val == val2;
            break;
          case "===":
            ok = val === val2;
            break;
          case ">":
            ok = val > val2;
            break;
          case ">=":
            ok = val >= val2;
            break;
          case "<":
            ok = val < val2;
            break;
          case "<=":
            ok = val <= val2;
            break;
          case "!=":
            ok = val != val2;
            break;
          case "!==":
            ok = val !== val2;
            break;
          default:
            msg = msg ? msg + ": " : msg;
            throw new chai2.AssertionError(msg + 'Invalid operator "' + operator + '"', void 0, assert2.operator);
        }
        var test = new Assertion(ok, msg, assert2.operator, true);
        test.assert(flag(test, "object") === true, "expected " + util2.inspect(val) + " to be " + operator + " " + util2.inspect(val2), "expected " + util2.inspect(val) + " to not be " + operator + " " + util2.inspect(val2));
      };
      assert2.closeTo = function(act, exp, delta, msg) {
        new Assertion(act, msg, assert2.closeTo, true).to.be.closeTo(exp, delta);
      };
      assert2.approximately = function(act, exp, delta, msg) {
        new Assertion(act, msg, assert2.approximately, true).to.be.approximately(exp, delta);
      };
      assert2.sameMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.sameMembers, true).to.have.same.members(set2);
      };
      assert2.notSameMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.notSameMembers, true).to.not.have.same.members(set2);
      };
      assert2.sameDeepMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.sameDeepMembers, true).to.have.same.deep.members(set2);
      };
      assert2.notSameDeepMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
      };
      assert2.sameOrderedMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.sameOrderedMembers, true).to.have.same.ordered.members(set2);
      };
      assert2.notSameOrderedMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
      };
      assert2.sameDeepOrderedMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
      };
      assert2.notSameDeepOrderedMembers = function(set1, set2, msg) {
        new Assertion(set1, msg, assert2.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
      };
      assert2.includeMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.includeMembers, true).to.include.members(subset);
      };
      assert2.notIncludeMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.notIncludeMembers, true).to.not.include.members(subset);
      };
      assert2.includeDeepMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.includeDeepMembers, true).to.include.deep.members(subset);
      };
      assert2.notIncludeDeepMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
      };
      assert2.includeOrderedMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.includeOrderedMembers, true).to.include.ordered.members(subset);
      };
      assert2.notIncludeOrderedMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
      };
      assert2.includeDeepOrderedMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
      };
      assert2.notIncludeDeepOrderedMembers = function(superset, subset, msg) {
        new Assertion(superset, msg, assert2.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
      };
      assert2.oneOf = function(inList, list, msg) {
        new Assertion(inList, msg, assert2.oneOf, true).to.be.oneOf(list);
      };
      assert2.changes = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.changes, true).to.change(obj, prop);
      };
      assert2.changesBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.changesBy, true).to.change(obj, prop).by(delta);
      };
      assert2.doesNotChange = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion(fn, msg, assert2.doesNotChange, true).to.not.change(obj, prop);
      };
      assert2.changesButNotBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
      };
      assert2.increases = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion(fn, msg, assert2.increases, true).to.increase(obj, prop);
      };
      assert2.increasesBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.increasesBy, true).to.increase(obj, prop).by(delta);
      };
      assert2.doesNotIncrease = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion(fn, msg, assert2.doesNotIncrease, true).to.not.increase(obj, prop);
      };
      assert2.increasesButNotBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
      };
      assert2.decreases = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion(fn, msg, assert2.decreases, true).to.decrease(obj, prop);
      };
      assert2.decreasesBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.decreasesBy, true).to.decrease(obj, prop).by(delta);
      };
      assert2.doesNotDecrease = function(fn, obj, prop, msg) {
        if (arguments.length === 3 && typeof obj === "function") {
          msg = prop;
          prop = null;
        }
        return new Assertion(fn, msg, assert2.doesNotDecrease, true).to.not.decrease(obj, prop);
      };
      assert2.doesNotDecreaseBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        return new Assertion(fn, msg, assert2.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
      };
      assert2.decreasesButNotBy = function(fn, obj, prop, delta, msg) {
        if (arguments.length === 4 && typeof obj === "function") {
          var tmpMsg = delta;
          delta = prop;
          msg = tmpMsg;
        } else if (arguments.length === 3) {
          delta = prop;
          prop = null;
        }
        new Assertion(fn, msg, assert2.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
      };
      /*!
       * ### .ifError(object)
       *
       * Asserts if value is not a false value, and throws if it is a true value.
       * This is added to allow for chai to be a drop-in replacement for Node's
       * assert class.
       *
       *     var err = new Error('I am a custom error');
       *     assert.ifError(err); // Rethrows err!
       *
       * @name ifError
       * @param {Object} object
       * @namespace Assert
       * @api public
       */
      assert2.ifError = function(val) {
        if (val) {
          throw val;
        }
      };
      assert2.isExtensible = function(obj, msg) {
        new Assertion(obj, msg, assert2.isExtensible, true).to.be.extensible;
      };
      assert2.isNotExtensible = function(obj, msg) {
        new Assertion(obj, msg, assert2.isNotExtensible, true).to.not.be.extensible;
      };
      assert2.isSealed = function(obj, msg) {
        new Assertion(obj, msg, assert2.isSealed, true).to.be.sealed;
      };
      assert2.isNotSealed = function(obj, msg) {
        new Assertion(obj, msg, assert2.isNotSealed, true).to.not.be.sealed;
      };
      assert2.isFrozen = function(obj, msg) {
        new Assertion(obj, msg, assert2.isFrozen, true).to.be.frozen;
      };
      assert2.isNotFrozen = function(obj, msg) {
        new Assertion(obj, msg, assert2.isNotFrozen, true).to.not.be.frozen;
      };
      assert2.isEmpty = function(val, msg) {
        new Assertion(val, msg, assert2.isEmpty, true).to.be.empty;
      };
      assert2.isNotEmpty = function(val, msg) {
        new Assertion(val, msg, assert2.isNotEmpty, true).to.not.be.empty;
      };
      /*!
       * Aliases.
       */
      (function alias(name, as) {
        assert2[as] = assert2[name];
        return alias;
      })("isOk", "ok")("isNotOk", "notOk")("throws", "throw")("throws", "Throw")("isExtensible", "extensible")("isNotExtensible", "notExtensible")("isSealed", "sealed")("isNotSealed", "notSealed")("isFrozen", "frozen")("isNotFrozen", "notFrozen")("isEmpty", "empty")("isNotEmpty", "notEmpty");
    };
  });

  // node_modules/chai/lib/chai.js
  var require_chai = __commonJS((exports) => {
    /*!
     * chai
     * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
     * MIT Licensed
     */
    var used = [];
    /*!
     * Chai version
     */
    exports.version = "4.3.0";
    /*!
     * Assertion Error
     */
    exports.AssertionError = require_assertion_error();
    /*!
     * Utils for plugins (not exported)
     */
    var util2 = require_utils2();
    exports.use = function(fn) {
      if (!~used.indexOf(fn)) {
        fn(exports, util2);
        used.push(fn);
      }
      return exports;
    };
    /*!
     * Utility Functions
     */
    exports.util = util2;
    /*!
     * Configuration
     */
    var config2 = require_config();
    exports.config = config2;
    /*!
     * Primary `Assertion` prototype
     */
    var assertion = require_assertion();
    exports.use(assertion);
    /*!
     * Core Assertions
     */
    var core2 = require_assertions();
    exports.use(core2);
    /*!
     * Expect interface
     */
    var expect3 = require_expect();
    exports.use(expect3);
    /*!
     * Should interface
     */
    var should2 = require_should();
    exports.use(should2);
    /*!
     * Assert interface
     */
    var assert2 = require_assert();
    exports.use(assert2);
  });

  // node_modules/chai/index.js
  var require_chai2 = __commonJS((exports, module) => {
    module.exports = require_chai();
  });

  // node_modules/chai-as-promised/lib/chai-as-promised.js
  var require_chai_as_promised = __commonJS((exports, module) => {
    "use strict";
    var checkError = require_check_error();
    module.exports = (chai2, utils) => {
      const Assertion = chai2.Assertion;
      const assert2 = chai2.assert;
      const proxify = utils.proxify;
      if (utils.checkError) {
        checkError = utils.checkError;
      }
      function isLegacyJQueryPromise(thenable) {
        return typeof thenable.catch !== "function" && typeof thenable.always === "function" && typeof thenable.done === "function" && typeof thenable.fail === "function" && typeof thenable.pipe === "function" && typeof thenable.progress === "function" && typeof thenable.state === "function";
      }
      function assertIsAboutPromise(assertion) {
        if (typeof assertion._obj.then !== "function") {
          throw new TypeError(utils.inspect(assertion._obj) + " is not a thenable.");
        }
        if (isLegacyJQueryPromise(assertion._obj)) {
          throw new TypeError("Chai as Promised is incompatible with thenables of jQuery<3.0.0, sorry! Please upgrade jQuery or use another Promises/A+ compatible library (see http://promisesaplus.com/).");
        }
      }
      function proxifyIfSupported(assertion) {
        return proxify === void 0 ? assertion : proxify(assertion);
      }
      function method(name, asserter) {
        utils.addMethod(Assertion.prototype, name, function() {
          assertIsAboutPromise(this);
          return asserter.apply(this, arguments);
        });
      }
      function property(name, asserter) {
        utils.addProperty(Assertion.prototype, name, function() {
          assertIsAboutPromise(this);
          return proxifyIfSupported(asserter.apply(this, arguments));
        });
      }
      function doNotify(promise, done) {
        promise.then(() => done(), done);
      }
      function assertIfNegated(assertion, message, extra) {
        assertion.assert(true, null, message, extra.expected, extra.actual);
      }
      function assertIfNotNegated(assertion, message, extra) {
        assertion.assert(false, message, null, extra.expected, extra.actual);
      }
      function getBasePromise(assertion) {
        return typeof assertion.then === "function" ? assertion : assertion._obj;
      }
      function getReasonName(reason) {
        return reason instanceof Error ? reason.toString() : checkError.getConstructorName(reason);
      }
      const propertyNames = Object.getOwnPropertyNames(Assertion.prototype);
      const propertyDescs = {};
      for (const name of propertyNames) {
        propertyDescs[name] = Object.getOwnPropertyDescriptor(Assertion.prototype, name);
      }
      property("fulfilled", function() {
        const derivedPromise = getBasePromise(this).then((value) => {
          assertIfNegated(this, "expected promise not to be fulfilled but it was fulfilled with #{act}", {actual: value});
          return value;
        }, (reason) => {
          assertIfNotNegated(this, "expected promise to be fulfilled but it was rejected with #{act}", {actual: getReasonName(reason)});
          return reason;
        });
        module.exports.transferPromiseness(this, derivedPromise);
        return this;
      });
      property("rejected", function() {
        const derivedPromise = getBasePromise(this).then((value) => {
          assertIfNotNegated(this, "expected promise to be rejected but it was fulfilled with #{act}", {actual: value});
          return value;
        }, (reason) => {
          assertIfNegated(this, "expected promise not to be rejected but it was rejected with #{act}", {actual: getReasonName(reason)});
          return reason;
        });
        module.exports.transferPromiseness(this, derivedPromise);
        return this;
      });
      method("rejectedWith", function(errorLike, errMsgMatcher, message) {
        let errorLikeName = null;
        const negate = utils.flag(this, "negate") || false;
        if (errorLike === void 0 && errMsgMatcher === void 0 && message === void 0) {
          return this.rejected;
        }
        if (message !== void 0) {
          utils.flag(this, "message", message);
        }
        if (errorLike instanceof RegExp || typeof errorLike === "string") {
          errMsgMatcher = errorLike;
          errorLike = null;
        } else if (errorLike && errorLike instanceof Error) {
          errorLikeName = errorLike.toString();
        } else if (typeof errorLike === "function") {
          errorLikeName = checkError.getConstructorName(errorLike);
        } else {
          errorLike = null;
        }
        const everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
        let matcherRelation = "including";
        if (errMsgMatcher instanceof RegExp) {
          matcherRelation = "matching";
        }
        const derivedPromise = getBasePromise(this).then((value) => {
          let assertionMessage = null;
          let expected = null;
          if (errorLike) {
            assertionMessage = "expected promise to be rejected with #{exp} but it was fulfilled with #{act}";
            expected = errorLikeName;
          } else if (errMsgMatcher) {
            assertionMessage = `expected promise to be rejected with an error ${matcherRelation} #{exp} but it was fulfilled with #{act}`;
            expected = errMsgMatcher;
          }
          assertIfNotNegated(this, assertionMessage, {expected, actual: value});
          return value;
        }, (reason) => {
          const errorLikeCompatible = errorLike && (errorLike instanceof Error ? checkError.compatibleInstance(reason, errorLike) : checkError.compatibleConstructor(reason, errorLike));
          const errMsgMatcherCompatible = errMsgMatcher && checkError.compatibleMessage(reason, errMsgMatcher);
          const reasonName = getReasonName(reason);
          if (negate && everyArgIsDefined) {
            if (errorLikeCompatible && errMsgMatcherCompatible) {
              this.assert(true, null, "expected promise not to be rejected with #{exp} but it was rejected with #{act}", errorLikeName, reasonName);
            }
          } else {
            if (errorLike) {
              this.assert(errorLikeCompatible, "expected promise to be rejected with #{exp} but it was rejected with #{act}", "expected promise not to be rejected with #{exp} but it was rejected with #{act}", errorLikeName, reasonName);
            }
            if (errMsgMatcher) {
              this.assert(errMsgMatcherCompatible, `expected promise to be rejected with an error ${matcherRelation} #{exp} but got #{act}`, `expected promise not to be rejected with an error ${matcherRelation} #{exp}`, errMsgMatcher, checkError.getMessage(reason));
            }
          }
          return reason;
        });
        module.exports.transferPromiseness(this, derivedPromise);
        return this;
      });
      property("eventually", function() {
        utils.flag(this, "eventually", true);
        return this;
      });
      method("notify", function(done) {
        doNotify(getBasePromise(this), done);
        return this;
      });
      method("become", function(value, message) {
        return this.eventually.deep.equal(value, message);
      });
      const methodNames = propertyNames.filter((name) => {
        return name !== "assert" && typeof propertyDescs[name].value === "function";
      });
      methodNames.forEach((methodName) => {
        Assertion.overwriteMethod(methodName, (originalMethod) => function() {
          return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
        });
      });
      const getterNames = propertyNames.filter((name) => {
        return name !== "_obj" && typeof propertyDescs[name].get === "function";
      });
      getterNames.forEach((getterName) => {
        const isChainableMethod = Assertion.prototype.__methods.hasOwnProperty(getterName);
        if (isChainableMethod) {
          Assertion.overwriteChainableMethod(getterName, (originalMethod) => function() {
            return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
          }, (originalGetter) => function() {
            return doAsserterAsyncAndAddThen(originalGetter, this);
          });
        } else {
          Assertion.overwriteProperty(getterName, (originalGetter) => function() {
            return proxifyIfSupported(doAsserterAsyncAndAddThen(originalGetter, this));
          });
        }
      });
      function doAsserterAsyncAndAddThen(asserter, assertion, args) {
        if (!utils.flag(assertion, "eventually")) {
          asserter.apply(assertion, args);
          return assertion;
        }
        const derivedPromise = getBasePromise(assertion).then((value) => {
          assertion._obj = value;
          utils.flag(assertion, "eventually", false);
          return args ? module.exports.transformAsserterArgs(args) : args;
        }).then((newArgs) => {
          asserter.apply(assertion, newArgs);
          return assertion._obj;
        });
        module.exports.transferPromiseness(assertion, derivedPromise);
        return assertion;
      }
      const originalAssertMethods = Object.getOwnPropertyNames(assert2).filter((propName) => {
        return typeof assert2[propName] === "function";
      });
      assert2.isFulfilled = (promise, message) => new Assertion(promise, message).to.be.fulfilled;
      assert2.isRejected = (promise, errorLike, errMsgMatcher, message) => {
        const assertion = new Assertion(promise, message);
        return assertion.to.be.rejectedWith(errorLike, errMsgMatcher, message);
      };
      assert2.becomes = (promise, value, message) => assert2.eventually.deepEqual(promise, value, message);
      assert2.doesNotBecome = (promise, value, message) => assert2.eventually.notDeepEqual(promise, value, message);
      assert2.eventually = {};
      originalAssertMethods.forEach((assertMethodName) => {
        assert2.eventually[assertMethodName] = function(promise) {
          const otherArgs = Array.prototype.slice.call(arguments, 1);
          let customRejectionHandler;
          const message = arguments[assert2[assertMethodName].length - 1];
          if (typeof message === "string") {
            customRejectionHandler = (reason) => {
              throw new chai2.AssertionError(`${message}

Original reason: ${utils.inspect(reason)}`);
            };
          }
          const returnedPromise = promise.then((fulfillmentValue) => assert2[assertMethodName].apply(assert2, [fulfillmentValue].concat(otherArgs)), customRejectionHandler);
          returnedPromise.notify = (done) => {
            doNotify(returnedPromise, done);
          };
          return returnedPromise;
        };
      });
    };
    module.exports.transferPromiseness = (assertion, promise) => {
      assertion.then = promise.then.bind(promise);
    };
    module.exports.transformAsserterArgs = (values) => values;
  });

  // tests/node to browser shims.js
  var import_buffer = __toModule(require_buffer());
  var import_global = __toModule(require_window());
  var import_process = __toModule(require_browser());

  // tests/browser client.test.js
  var import_browser_entry = __toModule(require_browser_entry());

  // node_modules/chai/index.mjs
  var import_index = __toModule(require_chai2());
  var expect = import_index.default.expect;
  var version = import_index.default.version;
  var AssertionError = import_index.default.AssertionError;
  var util = import_index.default.util;
  var config = import_index.default.config;
  var use = import_index.default.use;
  var should = import_index.default.should;
  var assert = import_index.default.assert;
  var core = import_index.default.core;
  var chai_default = import_index.default;

  // tests/browser client.test.js
  var import_chai_as_promised = __toModule(require_chai_as_promised());

  // browser/duplex/duplex stream.js
  var import_stream_browserify = __toModule(require_stream_browserify());
  var {Duplex} = import_stream_browserify.default;
  var runFnsOnlyOnce = () => {
    let called = false;
    return (fn) => (...args) => called || (called = true) && fn(...args);
  };
  var FetchDuplex = class extends Duplex {
    constructor(url, reader, id, fetchOptions = {}, duplexOptions = {}, errorCb) {
      super(duplexOptions);
      let idx = 0;
      let reading = false;
      let first = true;
      const once = runFnsOnlyOnce();
      const errorFn = once((...args) => {
        debugger;
        errorCb(...args);
      });
      this._read = () => {
        if (reading) {
          return;
        }
        reading = true;
        (async () => {
          try {
            let value;
            let done;
            do {
              ({value, done} = await reader.read());
              if (done)
                this.push(null);
              else if (first) {
                first = false;
                done = !this.push(import_buffer.Buffer.from(value.subarray(1)));
              } else
                done = !this.push(import_buffer.Buffer.from(value));
            } while (!done);
            reading = false;
          } catch (error) {
            errorFn(error);
          }
        })();
      };
      this._write = (chunk, encoding, callback) => {
        (async () => {
          try {
            const response = await this._fetch({body: Uint8Array.from(chunk)});
            if (!response.ok)
              errorFn(response);
            else {
              await response.arrayBuffer();
              callback(null);
            }
          } catch (error) {
            errorFn(error);
          }
        })();
      };
      this._fetch = (additionalRequestInit) => {
        const options = {
          method: "POST",
          cache: "no-store",
          headers: {},
          ...fetchOptions,
          ...additionalRequestInit
        };
        options.headers = {
          "Content-Type": "application/octet-stream",
          ...options.headers,
          "http2-duplex-id": id,
          "http2-duplex-idx": idx
        };
        idx += 1;
        return fetch(url, options);
      };
      this.on("end", () => {
        debugger;
      });
      this.on("finish", () => {
        debugger;
      });
      this.on("close", () => {
        debugger;
      });
    }
  };
  var connectToServer = (url, fetchOptions = {}, duplexOptions = {}, errorCb) => new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await fetch(url, {...fetchOptions, cache: "no-store"});
        if (response.ok) {
          resolve(new FetchDuplex(url, response.body.getReader(), response.headers.get("http2-duplex-id"), fetchOptions, duplexOptions, errorCb));
        } else
          reject(response);
      } catch (e) {
        debugger;
        reject(e);
      }
    })();
  });
  var duplex_stream_default = connectToServer;

  // src/other/globals.js
  var SETTINGS = {};
  var MSG_TYPES = {
    question: "question",
    reply: "reply",
    message: "message",
    cancelled: "cancelled",
    error: "error",
    listening: "listening",
    object: "object",
    raw: "raw"
  };
  var setDefaultSettings = (settings, browser = true) => {
    Object.assign(SETTINGS, {
      browserStreams: "/browserStreams",
      listenerStreams: "/listenerStreams"
    });
    if (browser) {
      Object.assign(SETTINGS, {
        serverAddress: "https://192.168.1.70:8443"
      });
    } else {
      Object.assign(SETTINGS, {
        serverPort: 8443,
        serverHostName: "127.0.0.1",
        serverAddress: "https://localhost:8443",
        http2ConnectionOptions: {
          rejectUnauthorized: false,
          enablePush: true
        },
        nodeStreams: "/nodeStreams",
        serveFilesFrom: `${import_process.default.cwd()}/dist`,
        defaultResponseHeaders: {
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": 86400,
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Expose-Headers": "http2-duplex-id, http2-duplex-idx",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/ecmascript",
          "Cache-Control": "max-age=0, no-cache, must-revalidate, proxy-revalidate"
        },
        log: "verbose"
      });
    }
    if (settings)
      Object.assign(SETTINGS, settings);
  };

  // src/pull/get object from streams.js
  var NUMBER_OF_BYTES = 4;
  var fromBytesInt32 = (numString) => {
    let result = 0;
    for (let i = NUMBER_OF_BYTES - 1; i >= 0; i -= 1)
      result += numString.charCodeAt(NUMBER_OF_BYTES - 1 - i) << 8 * i;
    return result;
  };
  var getFirstMessage = (getMoreDataFn) => (firstObjectCb, uid) => {
    let data = "";
    let object;
    let extractOneObject;
    let stream;
    const translateDataToObject = () => {
      if (data.length > NUMBER_OF_BYTES) {
        const length = fromBytesInt32(data.substring(0, NUMBER_OF_BYTES));
        if (length <= data.length - NUMBER_OF_BYTES) {
          object = JSON.parse(data.slice(NUMBER_OF_BYTES, length + NUMBER_OF_BYTES));
          data = data.slice(length + NUMBER_OF_BYTES);
        }
      }
    };
    const handleObject = (cb) => {
      const pullerMessageContainer = {
        messageObject: object,
        nextObject: (nextObjectCb) => {
          delete pullerMessageContainer.nextObject;
          object = void 0;
          extractOneObject(nextObjectCb);
        }
      };
      if (stream)
        pullerMessageContainer.stream = stream;
      cb(pullerMessageContainer);
    };
    const handleEndOfStreams = (cb) => {
      cb(void 0);
      stream.end();
    };
    const processNextStream = (cb) => {
      if (stream)
        stream.respondEnd();
      const newDataCb = (newData, newStream) => {
        stream = newStream;
        data += newData;
        extractOneObject(cb);
      };
      getMoreDataFn(newDataCb, uid);
    };
    extractOneObject = (objectCb) => {
      translateDataToObject();
      if (object)
        handleObject(objectCb);
      else if (stream && stream.endRequested)
        handleEndOfStreams(objectCb);
      else
        processNextStream(objectCb);
    };
    extractOneObject(firstObjectCb);
  };
  var get_object_from_streams_default = getFirstMessage;

  // src/other/shared functions.js
  var createUid = () => Array.from({length: 20}, () => Math.random().toString(36)[2]).join("");

  // src/pull/enhanced stream.js
  var NUMBER_OF_BYTES2 = 4;
  var toBytesInt32 = (num) => {
    let ascii = "";
    for (let i = NUMBER_OF_BYTES2 - 1; i >= 0; i -= 1)
      ascii += String.fromCharCode(num >> 8 * i & 255);
    return ascii;
  };
  var makeStreamWritable = (eStream, stream) => {
    let writable = true;
    Object.defineProperties(eStream, {
      writable: {get() {
        return writable;
      }},
      writeRaw: {
        value: (msgString) => {
          if (!writable)
            throw new Error("stream has already ended - cannot write to it");
          stream.write(msgString);
        }
      },
      write: {
        value: (msgObject) => {
          const str = JSON.stringify(msgObject);
          eStream.writeRaw(toBytesInt32(str.length) + str);
        }
      },
      end: {
        value: (msgObject, doneCb) => {
          if (!writable)
            throw new Error("stream has already ended - cannot end twice");
          writable = false;
          if (msgObject)
            eStream.write(msgObject);
          stream.end(void 0, void 0, () => {
            if (stream.close)
              stream.close(void 0, doneCb);
            else if (doneCb)
              doneCb();
          });
        }
      }
    });
    return eStream;
  };
  var enhanceToServerStream = (eStream, stream, requestHeaders) => {
    const responseHeaders = (headerOverrides) => {
      const headers = {...SETTINGS.defaultResponseHeaders, "Content-Type": "text/plain; charset=UTF-8", ...headerOverrides};
      if (eStream.uid)
        headers["http2-duplex-id"] = eStream.uid;
      if (eStream.idx)
        headers["http2-duplex-idx"] = eStream.idx;
      return headers;
    };
    const throwAlreadyResponded = () => {
      throw new Error("already responded on eStream steam - unable to respond twice");
    };
    let responded = false;
    let setUid;
    Object.defineProperties(eStream, {
      requestHeaders: {value: requestHeaders},
      method: {value: requestHeaders[":method"]},
      idx: {value: parseInt(requestHeaders["http2-duplex-idx"], 10)},
      endRequested: {value: requestHeaders["http2-duplex-end"] === "true"},
      uid: {get() {
        return requestHeaders["http2-duplex-id"] || setUid;
      }},
      responded: {get() {
        return responded;
      }},
      respond: {
        value: (code = 200, headerOverrides = {}) => {
          if (eStream.responded)
            throwAlreadyResponded();
          responded = true;
          stream.respond({":status": code, ...responseHeaders(headerOverrides)});
          makeStreamWritable(eStream, stream);
        }
      },
      respondConversation: {
        value: (doneCb) => {
          setUid = createUid();
          eStream.respond(200);
          stream.write("a");
          eStream.onClose(doneCb);
          return eStream.uid;
        }
      },
      respondEnd: {
        value: (code = 200, msg) => {
          eStream.respond(code);
          if (msg)
            eStream.write(msg);
          return eStream.end();
        }
      },
      respondError: {
        value: (httpError) => eStream.respondEnd(httpError.statusCode, httpError.message, "TEXT", "text/plain; charset=utf-8")
      }
    });
  };
  var EnhancedStream = class {
    constructor(stream, requestHeaders) {
      this._stream = stream;
      if (requestHeaders)
        enhanceToServerStream(this, stream, requestHeaders);
      else
        makeStreamWritable(this, stream);
      this.onClose = (doneCb) => stream.once("close", doneCb);
    }
    [Symbol.asyncIterator](...args) {
      return this._stream[Symbol.asyncIterator](...args);
    }
  };
  var enhanced_stream_default = EnhancedStream;

  // src/pull/http error.js
  var HttpError = class extends Error {
    constructor(statusCode, msg, stream) {
      super(msg);
      this.name = "HttpError";
      this.statusCode = statusCode;
      this.stream = stream;
    }
    respondError() {
      if (!this.stream.responded)
        this.stream.respondError(this);
    }
  };
  var http_error_default = HttpError;

  // src/pull/message router.js
  var messageRouter = (db) => {
    const nextMsgHandler = (msgContainer) => {
      if (msgContainer && msgContainer.messageObject) {
        if (msgContainer.messageObject.type === MSG_TYPES.error)
          throw new Error(msgContainer.messageObject.message);
        const fn = db[msgContainer.messageObject.originalQuestionId || msgContainer.messageObject.questionId];
        if (!fn && msgContainer.stream)
          throw new http_error_default(404, "invalid questionId", msgContainer.stream);
        const message = {
          messageObject: msgContainer.messageObject,
          doneWithObject: () => {
            delete message.doneWithObject;
            msgContainer.nextObject(nextMsgHandler);
          }
        };
        if (msgContainer.stream)
          message.stream = msgContainer.stream;
        fn(message);
      } else {
      }
    };
    return nextMsgHandler;
  };
  var message_router_default = messageRouter;

  // src/pull/question.js
  var questionConstructor = (baseConstructor) => {
    return (newQ, doneCb, originalQuestionId) => {
      const questionId = createUid();
      newQ.messageObject.questionId = questionId;
      if (originalQuestionId)
        newQ.messageObject.originalQuestionId = originalQuestionId;
      const base = baseConstructor(newQ);
      let promise;
      const qFace = {
        on: base.on,
        then: (answeredCb, failedCb = () => {
        }) => {
          if (!promise) {
            promise = new Promise((resolve, reject) => {
              base.db[questionId] = (newMsgContainer) => {
                let handled = base.messageHandler(newMsgContainer);
                if (newMsgContainer.messageObject.type === MSG_TYPES.reply) {
                  delete base.db[questionId];
                  resolve(newMsgContainer);
                  handled = true;
                }
                if (!handled)
                  throw new http_error_default(400, `message of type '${newMsgContainer.messageObject.type}' not handled.`);
                if (newMsgContainer.doneWithObject)
                  newMsgContainer.doneWithObject();
              };
              base.say(newQ.messageObject, MSG_TYPES.question);
              delete qFace.then;
              Object.assign(qFace, {
                say: (json, type) => base.say({body: json}, type),
                ask: base.ask,
                answerOwnQuestion: resolve,
                cancelQuestion: reject
              });
            });
          }
          promise.then(answeredCb, failedCb);
        }
      };
      return qFace;
    };
  };
  var question_default = questionConstructor;

  // src/pull/answer.js
  var answerConstructor = (baseConstructor) => {
    return (receivedMsgContainer, doneWithQuestionCb) => {
      const base = baseConstructor(receivedMsgContainer);
      let rFace;
      const reply = (json) => {
        if (base.questions > 0)
          throw new http_error_default(400, "answer still has outstanding questions", receivedMsgContainer.stream);
        if (base.answers > 0)
          throw new http_error_default(400, "answer still has outstanding answers", receivedMsgContainer.stream);
        base.say({body: json}, MSG_TYPES.reply);
        Object.keys(rFace).forEach((key) => delete rFace[key]);
        delete base.db[receivedMsgContainer.messageObject.questionId];
        doneWithQuestionCb();
      };
      base.db[receivedMsgContainer.messageObject.questionId] = (newMsgContainer) => {
        let handled = base.messageHandler(newMsgContainer);
        if (!handled)
          throw new http_error_default(400, `message of type '${newMsgContainer.messageObject.type}' not handled.`);
        if (newMsgContainer.doneWithObject)
          newMsgContainer.doneWithObject();
      };
      rFace = {
        questionJSON: receivedMsgContainer.messageObject.body,
        say: (json, type) => base.say({body: json}, type),
        ask: base.ask,
        on: base.on,
        doneWithObject: () => {
          delete rFace.doneWithObject;
          receivedMsgContainer.doneWithObject();
        },
        reply
      };
      return rFace;
    };
  };
  var answer_default = answerConstructor;

  // src/pull/shared base.js
  var sharedBaseInit = (db, writeStream) => {
    let newQuestion;
    let answerQuestion;
    const baseConstructor = (msgContainer) => {
      const {questionId} = msgContainer.messageObject;
      let questions = 0;
      let answers = 0;
      const msgListeners = [];
      const say = (json, type = MSG_TYPES.message) => writeStream.write({...json, type, questionId});
      const ask = (json) => {
        questions += 1;
        return newQuestion({messageObject: {body: {...json}}, stream: msgContainer.stream}, () => {
          questions -= 1;
        }, questionId);
      };
      const on = (type, fn) => msgListeners.push({type, fn});
      return {
        get db() {
          return db;
        },
        get questions() {
          return questions;
        },
        get answers() {
          return answers;
        },
        get messageObject() {
          return msgContainer.messageObject;
        },
        say,
        ask,
        on,
        messageHandler: (newMsgContainer) => {
          const t = newMsgContainer.messageObject.type;
          const fns = msgListeners.filter(({type}) => type === t || type === void 0);
          if (fns.length === 0)
            return false;
          let startMsg = newMsgContainer;
          if (t === MSG_TYPES.question) {
            answers += 1;
            startMsg = answerQuestion(newMsgContainer, () => {
              answers -= 1;
            });
          }
          fns.reduce((newMsg, {fn}) => {
            const result = fn(...newMsg);
            return [result ? result : newMsg, startMsg];
          }, [startMsg, startMsg]);
          return true;
        }
      };
    };
    newQuestion = question_default(baseConstructor);
    answerQuestion = answer_default(baseConstructor);
    return {newQuestion, answerQuestion};
  };
  var shared_base_default = sharedBaseInit;

  // src/pull/browser get object from stream.js
  var browserGetMoreData;
  var readBrowserStream = (errorCb, stream) => {
    let cb;
    let data = "";
    (async () => {
      try {
        for await (const chunk of stream) {
          data += new TextDecoder("utf-8").decode(chunk);
          if (cb) {
            const result = data;
            const cbTmp = cb;
            data = "";
            cb = void 0;
            cbTmp(result);
          }
        }
      } catch (e) {
        errorCb(e);
      }
    })();
    browserGetMoreData = (newDataCb) => {
      if (cb)
        throw new Error("two gets!");
      if (data !== "") {
        const result = data;
        data = "";
        newDataCb(result);
      } else
        cb = newDataCb;
    };
  };
  var browserGetMsgFromStream = (firstMsgCb) => get_object_from_streams_default(browserGetMoreData)(firstMsgCb);
  var browserNewQuestion = (stream, json) => {
    let question;
    let unexpectedClose = true;
    const writeStream = new enhanced_stream_default(stream);
    writeStream.onClose(() => {
      if (unexpectedClose)
        question.cancelQuestion(new Error("stream closed unexpectedly"));
      unexpectedClose = false;
    });
    const processingErrorInStream = (e) => {
      unexpectedClose = false;
      debugger;
      writeStream.end();
      question.cancelQuestion(e);
    };
    readBrowserStream(processingErrorInStream, writeStream);
    const db = {};
    browserGetMsgFromStream(message_router_default(db));
    question = shared_base_default(db, writeStream).newQuestion({messageObject: {body: {...json}}}, (results) => {
      console.log(results);
    });
    return question;
  };
  var browser_get_object_from_stream_default = browserNewQuestion;

  // browser/browser client.js
  var connection = async (settings) => {
    debugger;
    const cObj = {};
    setDefaultSettings(settings);
    const stream = await duplex_stream_default(`${SETTINGS.serverAddress}/${SETTINGS.browserStreams}`, void 0, void 0, (error) => {
      cObj.ask = () => {
        throw new Error("connection already closed");
      };
      throw error;
    });
    cObj.ask = (json) => browser_get_object_from_stream_default(stream, json);
    return cObj;
  };
  var browser_client_default = connection;

  // tests/browser client.test.js
  var {mocha} = import_browser_entry.default;
  debugger;
  mocha.setup("bdd");
  mocha.checkLeaks();
  var {expect: expect2} = chai_default;
  chai_default.use(import_chai_as_promised.default);
  describe("test", function() {
    this.timeout(5e5);
    it("passes", async () => {
    });
    it("fails", async () => {
      debugger;
      const {ask} = await browser_client_default();
      debugger;
      const question = ask({content: "STEP 1", count: 1});
      question.on("question received", (msg) => {
        debugger;
        msg.doneWithObject();
        expect2(msg.messageObject.body.content).to.equal("STEP 1");
        question.say({error: "STEP 2", count: msg.messageObject.body.count + 1}, "throw");
      });
      try {
        debugger;
        const response = await question;
        debugger;
      } catch (e) {
        debugger;
        console.log(e, ask, question);
      }
    });
  });
  mocha.run();
})();