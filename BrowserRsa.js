import utils from "./lib/utils.js";
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
        const arr = utils.base64.toByteArray(cleanKey(base64str))
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
        this._rsaKey.setPublic(modulus.copyToArray(), utils.hex.fromByteArray(exponent.copyToArray()))
    }
    /**
     * https://crypto.stackexchange.com/questions/21102/what-is-the-ssl-private-key-file-format
     * @param {String} base64str 
     */
    setPrivateKey(base64str) {
        const arr = utils.base64.toByteArray(cleanKey(base64str))
        const reader = new ASNReader(arr)
        const all = reader.readSequence();
        all.readInteger(); // just zero
        this._rsaKey = new RSAKey(this.padding)
        this._rsaKey.setPrivateEx(
            all.readInteger().copyToArray(),  // modulus  n
            utils.hex.fromByteArray(all.readInteger().copyToArray()),  // publicExponent    e
            all.readInteger().copyToArray(),  // privateExponent  d
            all.readInteger().copyToArray(),  // prime1
            all.readInteger().copyToArray(),  // prime2
            all.readInteger().copyToArray(),  // exponent1 -- d mod (p1)
            all.readInteger().copyToArray(),  // exponent2 -- d mod (q-1)
            all.readInteger().copyToArray()   // coefficient -- (inverse of q) mod p
        );
    }
    /**
     * @param {String} str 
     * @param {Boolean} resultEncoding return encoding, array, base64 or hex, default base64
     * @returns {String}
     */
    publicEncrypt(str, resultEncoding = 'base64') {
        return this._rsaKey.publicEncrypt(str, resultEncoding)
    }
    /**
     * 
     * @param {String} ctext hex or base64
     * @param {Boolean} encoding ctext encoding, array, base64 or hex, default base64
     * @param {Boolean} resultEncoding return encoding, array or utf8 default utf8
     * @returns {String}
     */
    publicDecrypt(ctext, encoding = 'base64', resultEncoding) {
        return this._rsaKey.publicDecrypt(ctext, encoding, resultEncoding)
    }
    /**
     * @param {String} str 
     * @param {Boolean} resultEncoding return encoding, array, base64 or hex, default base64
     * @returns {String}
     */
    privateEncrypt(str, resultEncoding = 'base64') {
        return this._rsaKey.privateEncrypt(str, resultEncoding)
    }
    /**
     * 
     * @param {String} ctext hex or base64
     * @param {Boolean} encoding ctext encoding, array, base64 or hex, default base64
     * @param {Boolean} resultEncoding return encoding, array or utf8 default utf8
     * @returns {String}
     */
    privateDecrypt(str, encoding = 'base64', resultEncoding) {
        return this._rsaKey.privateDecrypt(str, encoding, resultEncoding)
    }
}

export default BrowserRsa
