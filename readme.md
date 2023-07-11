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

const text = 'hello world'
const pStr = rsa.publicEncrypt(str)
const pdStr = rsa.privateDecrypt(pStr)
console.log(str, pStr, pdStr)
```

