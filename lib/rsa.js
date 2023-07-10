import BigInteger from './jsbn.js';
import utils from './utils.js';
import { pkcs1unpad, pkcs1pad, oaeppad, oaepunpad } from './schema.js';
// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str) {
    let radix
    if (typeof str == 'string') {
        radix = 16
    }
    return new BigInteger(str, radix, true);
}

const OAEP_PADDING = 'RSA_PKCS1_OAEP_PADDING'
const PKCS1_PADDING = 'RSA_PKCS1_PADDING'
const ENCODING = {
    BASE64: "base64",
    HEX: "hex",
    ARRAY: "array"
}

// "empty" RSA key constructor
class RSAKey {
    constructor(padding) {
        if (!padding) {
            padding = OAEP_PADDING
        }
        this.padding = padding
        if (this.padding != OAEP_PADDING && this.padding != PKCS1_PADDING) {
            throw new Error("Invalid RSA padding mode");
        }
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null
    }
    // Set the public key fields N and e from hex strings
    setPublic(N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N);
            this.e = parseInt(E, 16);
        }
        else
            throw new Error("Invalid RSA public key");
    }
    // Set the private key fields N, e, and d from hex strings
    setPrivate(N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D);
        }
        else
            throw new Error("Invalid RSA private key");
    }

    // Set the private key fields N, e, d and CRT params from hex strings
    setPrivateEx(N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D);
            this.p = parseBigInt(P);
            this.q = parseBigInt(Q);
            this.dmp1 = parseBigInt(DP);
            this.dmq1 = parseBigInt(DQ);
            this.coeff = parseBigInt(C);
        }
        else
            throw new Error("Invalid RSA private key");
    }
    // Perform raw public operation on "x": return x^e (mod n)
    doPublic(x) {
        return x.modPowInt(this.e, this.n);
    }
    /**
    * 
    * @param {BigInteger} x 
    * @returns 
    */
    doPrivate(x) {
        // Perform raw private operation on "x": return x^d (mod n)
        if (this.p == null || this.q == null)
            return x.modPow(this.d, this.n);

        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);

        while (xp.compareTo(xq) < 0)
            xp = xp.add(this.p);
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    }
    /**
     * 
     * @param {String} ctext hex or base64
     * @param {String} encoding ctext encoding, default base644
     * @param {String} resultEncoding return encoding, array or utf8, default utf8
     * @param {Boolean} usePrivate use private key decrypt
     * @returns {String}
     */
    decrypt(ctext, encoding = ENCODING.BASE64, resultEncoding, usePrivate) {
        if (encoding == ENCODING.BASE64) {
            ctext = utils.base64.toHex(ctext)
        } else if (encoding == ENCODING.HEX) {
            // do nothing
        } else if (encoding == ENCODING.ARRAY) {
            ctext = utils.hex.fromByteArray(ctext)
        } else {
            throw new Error("Invalid RSA text encoding");
        }
        const c = parseBigInt(ctext);

        let m
        if (usePrivate) {
            m = this.doPrivate(c);
        } else {
            m = this.doPublic(c);
        }
        const buffer = m.toByteArray(true);
        let unpadArr
        if (usePrivate) {
            if (this.padding == OAEP_PADDING) {
                unpadArr = oaepunpad(buffer);
            } else {
                unpadArr = pkcs1unpad(buffer);
            }
        } else {
            unpadArr = pkcs1unpad(buffer, true);
        }
        if (resultEncoding && resultEncoding == ENCODING.ARRAY) {
            return unpadArr
        }
        return utils.utf8.fromByteArray(unpadArr);
    }
    /**
     * 
     * @param {String} text 
     * @param {String|ENCODING} resultEncoding return encoding, array, base64 or hex, default base644
     * @param {Boolean} usePrivate use private key encrypt? default public key
     * @returns 
     */
    encrypt(text, resultEncoding = ENCODING.BASE64, usePrivate) {
        if (!usePrivate && (this.n == null || this.e == null)) {
            throw new Error("Invalid RSA public key, please check the setPublic method");
        }
        if (usePrivate && (this.n == null || this.e == null || this.d == null)) {
            throw new Error("Invalid RSA private key, please check the setPrivate method");
        }
        let textArr
        if (Array.isArray(text)) {
            textArr = text
        } else {
            textArr = utils.utf8.toByteArray(text);
        }

        const nLen = (this.n.bitLength() + 7) >> 3;

        let c
        if (usePrivate) {
            let m = pkcs1pad(textArr, nLen, true);
            c = this.doPrivate(m);
        } else {
            let m
            if (this.padding == OAEP_PADDING) {
                m = oaeppad(textArr, nLen);
            } else {
                m = pkcs1pad(textArr, nLen);
            }
            c = this.doPublic(m);
        }
        if (c == null) {
            throw new Error("RSA encryption failed");
        }
        var h = c.toString(16);
        let res = h.length % 2 == 0 ? h : "0" + h;
        if (resultEncoding == ENCODING.HEX) {
            return res;
        } else if (resultEncoding == ENCODING.BASE64) {
            return utils.base64.fromHex(res);
        } else if (resultEncoding == ENCODING.ARRAY) {
            return utils.hex.toByteArray(res);
        } else {
            throw new Error("Invalid result encoding: " + resultEncoding);
        }
    }
    publicEncrypt(text, resultEncoding) {
        return this.encrypt(text, resultEncoding, false);
    }
    publicDecrypt(ctext, encoding, resultEncoding) {
        return this.decrypt(ctext, encoding, resultEncoding, false);
    }
    privateEncrypt(text, resultEncoding) {
        return this.encrypt(text, resultEncoding, true);
    }
    privateDecrypt(ctext, encoding, resultEncoding) {
        return this.decrypt(ctext, encoding, resultEncoding, true);
    }
}

export default RSAKey;