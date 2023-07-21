纯 js 实现 rsa，无第三方依赖，适用于某些环境无 crypto 场景。比如：微信小程序。

### 生成密钥

生成私钥

```bash
➜  openssl genrsa -out key1.pem 512
➜  cat key1.pem
-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAKBKx4EJPI9rjYV1nfyPjdOZoeyHVxbYwrRLkxyNRoRGYRPmaShJ
Zd0dGlMw1Cm70BCpzz0iswMyJIj88yoVg18CAwEAAQJAPUwbewbzN81jc1QFNJ4Z
GIA54d/nt/7whk4YVeTYwKAmYJ7nXV1G9rioQ2CUb0MuBOVBgZaPdKNT+3bkbrEb
kQIhANEpPGOruTbTSbWIlTNxRxZvsPT/kUKeraNpBT6k2rBrAiEAxC/8/DBAysAz
yilUg+V3OY54czTtA1la7KLpI91TZd0CIQC16K0y6lkNS7mhfoZ01SJEayN2EQee
7y6JHn+HOg1QvQIhAJz0Q3JC7GMIt6ZBwIKw/txGNej9a6zlPM/aWai+tazlAiA0
w9ttPRc/TukSp8fHZBzWdszSU5SO/IwTKVmeLmnC0g==
-----END RSA PRIVATE KEY-----
```

从私钥生成公钥

```bash
➜  openssl rsa -in key1.pem -pubout -out pubkey.pem
➜  cat pubkey.pem
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKBKx4EJPI9rjYV1nfyPjdOZoeyHVxbY
wrRLkxyNRoRGYRPmaShJZd0dGlMw1Cm70BCpzz0iswMyJIj88yoVg18CAwEAAQ==
-----END PUBLIC KEY-----
```

### 安装

```bash
npm install browser-rsa
```

### 使用

RSA

```javascript
import BrowserRsa from 'browser-rsa'
import utils from 'browser-rsa/lib/utils.js'
const pubkey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKBKx4EJPI9rjYV1nfyPjdOZoeyHVxbY
wrRLkxyNRoRGYRPmaShJZd0dGlMw1Cm70BCpzz0iswMyJIj88yoVg18CAwEAAQ==`
const privateKey = `MIIBOwIBAAJBAKBKx4EJPI9rjYV1nfyPjdOZoeyHVxbYwrRLkxyNRoRGYRPmaShJ
Zd0dGlMw1Cm70BCpzz0iswMyJIj88yoVg18CAwEAAQJAPUwbewbzN81jc1QFNJ4Z
GIA54d/nt/7whk4YVeTYwKAmYJ7nXV1G9rioQ2CUb0MuBOVBgZaPdKNT+3bkbrEb
kQIhANEpPGOruTbTSbWIlTNxRxZvsPT/kUKeraNpBT6k2rBrAiEAxC/8/DBAysAz
yilUg+V3OY54czTtA1la7KLpI91TZd0CIQC16K0y6lkNS7mhfoZ01SJEayN2EQee
7y6JHn+HOg1QvQIhAJz0Q3JC7GMIt6ZBwIKw/txGNej9a6zlPM/aWai+tazlAiA0
w9ttPRc/TukSp8fHZBzWdszSU5SO/IwTKVmeLmnC0g==`

const rsa = new BrowserRsa()
// 设置 key，二选一
rsa.setPublicKey(pubkey)
rsa.setPrivateKey(privateKey)

const str = 'hello world'
const pStr = rsa.publicEncrypt(str)
const pdStr = rsa.privateDecrypt(pStr)
console.log(str == pdStr, pStr)
```

AES-CTR，对称加密的工具类

```javascript
import BrowserAesCtr from 'browser-rsa/BrowserAesCtr.js'
import utils from 'browser-rsa/lib/utils.js';
const text = "测试文本🧰"

const counter = new Uint8Array([191, 167, 0, 170, 152, 141, 171, 32, 5, 69, 177, 137, 21, 204, 229, 225]);  // set random initialisation vector

const key = new Uint8Array([87, 219, 91, 67, 114, 196, 219, 8, 184, 193, 91, 186, 139, 33, 7, 212])
// 内部 counter 会自增
let aesCtr = new BrowserAesCtr(key, counter)
const encrypt = aesCtr.encrypt(text)

aesCtr = new BrowserAesCtr(key, counter)
const decrypt = aesCtr.decrypt(encrypt)
console.log(text == utils.utf8.fromByteArray(decrypt))
```

### API 说明

RSA 

```javascript
class BrowserRsa {
    /**
     * @param {String} padding rsa padding, support RSA_PKCS1_PADDING and RSA_PKCS1_OAEP_PADDING, default is RSA_PKCS1_OAEP_PADDING
     */
    constructor(padding)
  
    setPublicKey(base64str)
    /**
     * https://crypto.stackexchange.com/questions/21102/what-is-the-ssl-private-key-file-format
     * @param {String} base64str 
     */
    setPrivateKey(base64str) 
    /**
     * @param {String} str 
     * @param {String} resultEncoding return encoding, array, base64 or hex, default base64
     * @returns {String|Array}
     */
    publicEncrypt(str, resultEncoding = 'base64')
    /**
     * 
     * @param {String} ctext hex or base64
     * @param {String} encoding ctext encoding, array, base64 or hex, default base64
     * @param {String} resultEncoding return encoding, array or utf8 default utf8
     * @returns {String|Array}
     */
    publicDecrypt(ctext, encoding = 'base64', resultEncoding)
    /**
     * @param {String} str 
     * @param {String} resultEncoding return encoding, array, base64 or hex, default base64
     * @returns {String|Array}
     */
    privateEncrypt(str, resultEncoding = 'base64')
    /**
     * 
     * @param {String} ctext hex or base64
     * @param {Boolean} encoding ctext encoding, array, base64 or hex, default base64
     * @param {Boolean} resultEncoding return encoding, array or utf8 default utf8
     * @returns {String|Array}
     */
    privateDecrypt(str, encoding = 'base64', resultEncoding) 
}
```



```
```



```javascript
class BrowserAesCtr {
    /**
     * 
     * @param {Uint8Array|Array} key 
     * @param {Uint8Array|Array} counter 
     */
    constructor(key, counter)
    /**
     * 
     * @param {Array|String} data 
     * @returns {Uint8Array}
     */
    encrypt(data)
    /**
     * 
     * @param {Array|String} data if string, must be base64
     * @returns {Uint8Array}
     */
    decrypt(data)
}
```

utils 工具类

```javascript
import utils from "browser-rsa/lib/utils";

// base64 处理
utils.base64.fromHex
utils.base64.toHex
utils.base64.toByteArray
utils.base64.fromByteArray
utils.base64.fromBase64Url
utils.base64.toBase64Url

utils.hex.toByteArray
utils.hex.fromByteArray

// 同 TextEncoder.encode
utils.utf8.toByteArray
// 同 TextDecoder.decode
utils.utf8.fromByteArray

// 生成随机数
utils.random.nextByte()
utils.random.nextBytes(arr)

```

