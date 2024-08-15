纯 js 实现 rsa，无第三方依赖，适用于某些环境无 crypto 场景。比如：微信小程序。

支持：
私钥加密 -> 公钥解密
公钥加密 -> 私钥解密

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



AES 


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
utils.base64.encode // 支持 utf8 字符集。（TextEncoder + btoa）
utils.base64.decode // 支持 utf8 字符集。（TextDecoder + atob）
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

### 原理

RSA 算法基于：http://www-cs-students.stanford.edu/~tjw/jsbn/

简单说下密钥解析。

- 私钥格式

```
RSAPrivateKey ::= SEQUENCE {
 version Version,
 modulus INTEGER, -- n
 publicExponent INTEGER, -- e
 privateExponent INTEGER, -- d
 prime1 INTEGER, -- p
 prime2 INTEGER, -- q
 exponent1 INTEGER, -- d mod (p-1)
 exponent2 INTEGER, -- d mod (q-1)
 coefficient INTEGER -- (inverse of q) mod p 
}

(n、d)：私钥，这个我们要私密保存。
(n、e)：公钥，可以对外公布。
n：模数（Modulus），私钥和公钥都包含有这个数。
e：公钥指数（publicExponent），一般是固定值65537。
d：私钥指数（privateExponent）。
```

密钥是使用 [ASN.1 编码](https://zh.wikipedia.org/wiki/ASN.1) ，然后再 base64。

用如下命令，可以解析出上面的格式。

```bash
➜  openssl rsa -in key1.pem -text -noout
RSA Private-Key: (512 bit)
modulus:
    00:cf:14:0d:20:e3:fc:79:2f:42:b1:e2:0e:ea:26:
    fb:e4:4a:1e:ab:7e:3c:56:41:a9:ae:fa:43:b2:17:
    16:7c:55:c9:38:03:0f:9b:7d:68:c9:e2:7a:55:be:
    95:80:f9:41:f9:13:62:48:fe:f3:d4:44:00:a2:32:
    a7:ac:5b:2d:fd
publicExponent: 65537 (0x10001)
privateExponent:
    02:ba:11:de:30:02:60:1a:26:37:af:71:60:d5:f8:
    95:2e:00:af:63:6f:29:f7:9d:63:67:7a:42:bb:19:
    19:b4:05:6c:4a:b2:32:c7:cb:62:41:ed:fe:b0:79:
    37:61:15:1d:1d:84:f9:e5:ca:96:6a:d0:e3:13:10:
    35:57:ef:a1
prime1:
    00:ed:1b:8a:fb:c5:a2:fe:b2:5e:53:84:dc:fc:f3:
    4a:2b:5e:f7:ac:6e:fc:6a:aa:e6:f5:52:fa:38:7e:
    0d:54:19
prime2:
    00:df:93:fa:c0:0a:a8:3b:cc:f7:78:35:4d:99:c8:
    a0:68:1e:84:b1:93:2e:97:56:a1:2e:58:6e:56:bc:
    5a:05:85
exponent1:
    20:91:89:f3:af:60:06:30:25:f8:be:e5:43:f1:7f:
    1c:99:fc:d7:38:9f:7f:5f:5e:3e:10:59:c2:6c:be:
    13:f1
exponent2:
    31:19:f5:b2:e1:64:4b:25:db:9f:89:cd:4e:1d:d2:
    a4:ab:37:27:2c:94:c9:e5:db:a6:2b:03:a8:86:db:
    1a:65
coefficient:
    20:22:85:e8:ca:e1:ce:fa:b8:c8:fc:ed:05:4e:16:
    a9:8f:51:c6:c0:60:50:15:72:56:b2:e6:88:3e:20:
    4f:05
```

解析过程只需要用 js 实现，然后再加上 jsbn 就组成了 RSA 加密、解密。
