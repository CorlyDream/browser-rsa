import AES from './lib/base/aes.js'
import utils from './lib/utils.js'
function hasCrypto() {
    return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined'
}
class BrowserAesCtr {
    /**
     * 
     * @param {Uint8Array|Array} key 
     * @param {Uint8Array|Array} counter 
     */
    constructor(key, counter) {
        this.key = key
        this.counter = counter
    }
    /**
     * 
     * @param {Array|String} data 
     * @returns {Uint8Array}
     */
    encrypt(data) {
        if(hasCrypto){
            return this.encryptByCrypto(data)
        }
        let sourceArray
        if (utils.isArray(data)) {
            sourceArray = data
        } else {
            sourceArray = utils.utf8.toByteArray(data)
        }
        // 内部 counter 会自增
        let aesCtr = new AES.ctr(this.key, this.counter)
        return aesCtr.encrypt(sourceArray)
    }
    /**
     * 
     * @param {Array|String} data if string, must be base64
     * @returns {Uint8Array}
     */
    decrypt(data) {
        if(hasCrypto){
            return this.decryptByCrypto(data)
        }
        let sourceArray
        if (utils.isArray(data)) {
            sourceArray = data
        } else {
            sourceArray = utils.base64.toByteArray(data)
        }
        let aesCtr = new AES.ctr(this.key, this.counter)
        return aesCtr.decrypt(sourceArray)
    }
    async getCryptoKey() {
        return await crypto.subtle.importKey(
            "raw",
            this.key,
            { name: "AES-CTR" },
            false,
            ["encrypt", "decrypt"]
        );
    }
    /**
     * 
     * @param {Array|String} data 
     * @returns 
     */
    async encryptByCrypto(data) {
        let sourceArray
        if (utils.isArray(data)) {
            sourceArray = data
        } else {
            sourceArray = utils.utf8.toByteArray(data)
        }
        const cryptoKey = await this.getCryptoKey()
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "AES-CTR",
                counter: this.counter,
                length: this.counter.length, // Counter length (in bits)
            },
            cryptoKey,
            sourceArray
        );

        return new Uint8Array(encryptedData);
    }
    /**
     * 
     * @param {Array|String} data 
     * @returns {ArrayBuffer}
     */
    async decryptByCrypto(data) {
        let sourceArray
        if (utils.isArray(data)) {
            sourceArray = data
        } else {
            sourceArray = utils.base64.toByteArray(data)
        }
        const cryptoKey = await this.getCryptoKey()
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: "AES-CTR",
                counter: this.counter,
                length: this.counter.length, // Counter length (in bits)
            },
            cryptoKey,
            sourceArray
        );

        return new Uint8Array(decryptedData);
    }
}

export default BrowserAesCtr