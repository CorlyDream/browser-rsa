import BrowserAesCtr from '../BrowserAesCtr.js';
import utils from '../lib/utils.js'
const text = "测试文本🧰"

const counter = new Uint8Array([191, 167, 0, 170, 152, 141, 171, 32, 5, 69, 177, 137, 21, 204, 229, 225]);  // set random initialisation vector

const key = new Uint8Array([87, 219, 91, 67, 114, 196, 219, 8, 184, 193, 91, 186, 139, 33, 7, 212])
console.log("key", utils.base64.fromByteArray(key))
async function test(){
    const aesCtr = new BrowserAesCtr(key, counter)
    const sourceArray = utils.utf8.toByteArray(text)
    const encrypt = aesCtr.encrypt(sourceArray)
    console.log("encrypt", utils.base64.fromByteArray(encrypt))
    
    const cryptoDecrypt = await aesCtr.decryptByCrypto(encrypt)
    console.log("decryptByCrypto", utils.utf8.fromByteArray(cryptoDecrypt))

    const cryptoEncrypt = await aesCtr.encryptByCrypto(text)
    console.log("encryptByCrypto", utils.base64.fromByteArray(cryptoEncrypt))
    const decrypt = aesCtr.decrypt(cryptoEncrypt)
    console.log("decrypt", utils.utf8.fromByteArray(decrypt))
}

test()


