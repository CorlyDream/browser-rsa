import AES from './lib/base/aes.js'
import utils from './lib/utils.js'

class BrowserAesCtr {
    /**
     * 
     * @param {Uint8Array|Array} key 
     * @param {Uint8Array|Array} counter 
     */
    constructor(key, counter){
        this.key = key
        this.counter = counter
    }
    /**
     * 
     * @param {Array|String} data 
     * @returns {Uint8Array}
     */
    encrypt(data){
        let sourceArray
        if(utils.isArray(data)){
            sourceArray = data
        }else {
            sourceArray = utils.utf8.toByteArray(data)
        }
        let aesCtr = new AES.ctr(this.key, this.counter)
        return aesCtr.encrypt(sourceArray)
    }
    /**
     * 
     * @param {Array|String} data if string, must be base64
     * @returns {Uint8Array}
     */
    decrypt(data){
        let sourceArray
        if(utils.isArray(data)){
            sourceArray = data
        }else {
            sourceArray = utils.base64.toByteArray(data)
        }
        let aesCtr = new AES.ctr(this.key, this.counter)
        return aesCtr.decrypt(sourceArray)
    }
}

export default BrowserAesCtr