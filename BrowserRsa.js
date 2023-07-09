import { b64toBA,BAtoHex } from './lib/base64.js'
import ASNReader from './ASNReader.js';
import RSAKey from './lib/rsa.js';

var PUBLIC_RSA_OID = '1.2.840.113549.1.1.1'
function cleanKey(key) {
    return key.replace(/\s+|\n\r|\n|\r$/gm, '');
}


class BrowserRsa {
    constructor(padding) {
        this.padding = padding

    }
    setPublicKey(base64str) {
        const arr = b64toBA(cleanKey(base64str))
        const reader = new ASNReader(arr)
        const all = reader.readSequence()
        const header = all.readSequence()
        const oid = header.readOID()
        if (oid !== PUBLIC_RSA_OID) {
            throw Error('Invalid Public key format');
        }
        let body = all.readBitString()
        body.readByte()  // 0
        body = body.readSequence()
        const modulus = body.readInteger() // n
        const exponent = body.readInteger() // e
        this._rsaKey = new RSAKey(this.padding)
        this._rsaKey.setPublic(modulus.copyToArray(), BAtoHex(exponent.copyToArray()))
    }
    publicEncrypt(str, base64 = true) {
        return this._rsaKey.publicEncrypt(str, base64)
    }
    /**
     * https://crypto.stackexchange.com/questions/21102/what-is-the-ssl-private-key-file-format
     * @param {String} base64str 
     */
    setPrivateKey(base64str) {

    }
}

export default BrowserRsa
