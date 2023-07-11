import AES from '../lib/base/aes.js'
import utils from '../lib/utils.js'
const text = "测试文本🧰"

const counter = new Uint8Array([191, 167, 0, 170, 152, 141, 171, 32, 5, 69, 177, 137, 21, 204, 229, 225]);  // set random initialisation vector

const key =  new Uint8Array([
    87, 219,  91,  67, 114, 196,
   219,   8, 184, 193,  91, 186,
   139,  33,   7, 212
 ])
// 内部 counter 会自增
let aesCtr = new AES.ctr(key, counter)
const sourceArray = utils.utf8.toByteArray(text)
const encrypt = aesCtr.encrypt(sourceArray)
console.log("encrypt", utils.base64.fromByteArray(encrypt))
aesCtr = new AES.ctr(utils.base64.toByteArray('D7NfOV28ixkCIiF+BVdtnQ=='), counter)
const decrypt = aesCtr.decrypt(utils.base64.toByteArray('7r3FHg5m6l+LmqgFIqSu1Q=='))
console.log("decrypt", utils.utf8.fromByteArray(decrypt))