import sha1 from './sha1.js'
import BigInteger from './jsbn.js';
import SecureRandom from './rng.js';
import { BAtoHex } from './base64.js';
/**
 * RSA 常用的 padding
 * RSA_PKCS1_PADDING
 * RSA_PKCS1_OAEP_PADDING
 */

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
/**
 * @returns {Array}
 */
function pkcs1unpad2(b, n) {
    var i = 0;
    while (i < b.length && b[i] == 0) ++i;
    if (b.length - i != n - 1 || b[i] != 2)
        return null;
    ++i;
    while (b[i] != 0)
        if (++i >= b.length) return null;
    return b.slice(i);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
/**
 * 
 * @param {Array} s 
 * @param {Number} n modulus byte length
 * @returns 
 */
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { 
        throw new Error("Message too long for RSA");
    }
    var ba = new Array();
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        ba[--n] = s[i--];
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = new Array();
    while (n > 2) { // random non-zero pad
        x[0] = 0;
        while (x[0] == 0) rng.nextBytes(x);
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}

/**
 * https://en.wikipedia.org/wiki/Mask_generation_function#MGF1
 * hash 只支持 sha1
 * @param {*} seed 
 * @param {*} len 
 */
const sha1Len = 20;
function mgf1(seed, maskLength) {
    var hLen = sha1Len;
    var count = Math.ceil(maskLength / hLen);
    var T = [];
    for (var i = 0; i < count; ++i) {
        const hash = sha1.create();
        hash.update(seed);
        hash.update([0, 0, 0, i]);
        const arr = hash.digest()
        T.push(...arr);
    }
    return T.slice(0, maskLength);

}
/**
 * https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding
 * @param {Array} buffer 加密内容
 * @param {Number} k - the length of the RSA modulus n in bytes
 * @returns 
 */
function oaeppad(buffer, k) {
    var hLen = sha1Len;

    // Make sure we can put message into an encoded message of emLen bytes
    if (buffer.length > k - 2 * hLen - 2) {
        throw new Error("data too large for key size. data size: " + buffer.length + " bytes, current key allowed max size: " +(k - 2 * hLen - 2));
    }
    var lHash = sha1.create();
    // lHash.update(label);
    lHash = lHash.digest();
    const psLen = k - buffer.length - 2 * hLen - 1
    const PS = new Array(psLen); // Padding "String"
    PS.fill(0); // Fill the buffer with octets of 0
    PS[psLen - 1] = 1; // The last octet of PS shall be 0x01.

    const DB = lHash.concat(PS, buffer);
    const rng = new SecureRandom();
    const seed = new Array(hLen);
    rng.nextBytes(seed);

    const dbMask = mgf1(seed, DB.length);
    // XOR DB and dbMask together.
    for (var i = 0; i < DB.length; i++) {
        DB[i] ^= dbMask[i];
    }
    // DB = maskedDB

    const seedMask = mgf1(DB, hLen);
    // XOR seed and seedMask together.
    for (i = 0; i < seed.length; i++) {
        seed[i] ^= seedMask[i];
    }
    // seed = maskedSeed

    // 0x00||maskedSeed||maskedDB
    return new BigInteger([0, ...seed, ...DB])
}

function oaepunpad(buffer) {
    let start = 0
    while (buffer[start] == 0) {
        start++;
    }

    const hLen = sha1Len;

    // Check to see if buffer is a properly encoded OAEP message
    if (buffer.length-start < 2 * hLen + 2) {
        throw new Error("Error decoding message, the supplied message is not long enough to be a valid OAEP encoded message");
    }

    const seed = buffer.slice(start, start + hLen + 1);	// seed = maskedSeed
    const DB = buffer.slice(start + 1 + hLen);		// DB = maskedDB

    const seedMask = mgf1(DB, hLen); // seedMask
    // XOR maskedSeed and seedMask together to get the original seed.
    for (var i = 0; i < seed.length; i++) {
        seed[i] ^= seedMask[i];
    }

    const dbMask = mgf1(seed, DB.length); // dbMask
    // XOR DB and dbMask together to get the original data block.
    for (i = 0; i < DB.length; i++) {
        DB[i] ^= dbMask[i];
    }

    var lHash = sha1.create();
    lHash = lHash.digest();

    var lHashEM = DB.slice(0, hLen);
    if (BAtoHex(lHashEM) != BAtoHex(lHash)) {
        throw new Error("Error decoding message, the lHash calculated from the label provided and the lHash in the encrypted data do not match.");
    }

    // Filter out padding
    i = hLen;
    while (DB[i++] === 0 && i < DB.length);
    if (DB[i - 1] != 1) {
        throw new Error("Error decoding message, there is no padding message separator byte");
    }

    return DB.slice(i); // Message
}

export {
    pkcs1unpad2,
    pkcs1pad2,
    oaeppad,
    oaepunpad
}