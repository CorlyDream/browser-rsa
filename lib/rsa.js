import BigInteger from './jsbn.js';
import SecureRandom from './rng.js';
import { hex2b64, b64tohex } from './base64.js';
import { pkcs1unpad2, pkcs1pad2, oaeppad, oaepunpad } from './schema.js';
import { Utf16ToBA, BAtoUtf16 } from './text.js';
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
    // Perform raw public operation on "x": return x^e (mod n)
    doPublic(x) {
        return x.modPowInt(this.e, this.n);
    }
    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    publicEncrypt(text, base64) {
        const textArr = Utf16ToBA(text);

        var m
        const nLen = (this.n.bitLength() + 7) >> 3;
        if (this.padding == OAEP_PADDING) {
            m = oaeppad(textArr, nLen);
        } else {
            m = pkcs1pad2(textArr, nLen);
        }
        var c = this.doPublic(m);
        if (c == null) {
            throw new Error("RSA encryption failed");
        }
        var h = c.toString(16);
        console.log("source buffer", c.toByteArray(true))
        let res = h.length % 2 == 0 ? h : "0" + h;
        return base64 ? hex2b64(res) : res;
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
    // Perform raw private operation on "x": return x^d (mod n)
    doPrivate(x) {
        if (this.p == null || this.q == null)
            return x.modPow(this.d, this.n);

        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);

        while (xp.compareTo(xq) < 0)
            xp = xp.add(this.p);
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    }

    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    privateDecrypt(ctext, base64) {
        ctext = base64 ? b64tohex(ctext) : ctext;
        const c = parseBigInt(ctext);
        const m = this.doPrivate(c);
        const buffer = m.toByteArray(true);
        console.log("decrypt buffer", buffer)
        let unpadArr
        if (this.padding == OAEP_PADDING) {
            unpadArr = oaepunpad(buffer);
        } else {
            unpadArr = pkcs1unpad2(buffer, (this.n.bitLength() + 7) >> 3);
        }
        return BAtoUtf16(unpadArr);
    }

}






// Generate a new random private key B bits long, using public expt E
function RSAGenerate(B, E) {
    var rng = new SecureRandom();
    var qs = B >> 1;
    this.e = parseInt(E, 16);
    var ee = new BigInteger(E, 16);
    for (; ;) {
        for (; ;) {
            this.p = new BigInteger(B - qs, 1, rng);
            if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
        }
        for (; ;) {
            this.q = new BigInteger(qs, 1, rng);
            if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
        }
        if (this.p.compareTo(this.q) <= 0) {
            var t = this.p;
            this.p = this.q;
            this.q = t;
        }
        var p1 = this.p.subtract(BigInteger.ONE);
        var q1 = this.q.subtract(BigInteger.ONE);
        var phi = p1.multiply(q1);
        if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
            this.n = this.p.multiply(this.q);
            this.d = ee.modInverse(phi);
            this.dmp1 = this.d.mod(p1);
            this.dmq1 = this.d.mod(q1);
            this.coeff = this.q.modInverse(this.p);
            break;
        }
    }
}

RSAKey.prototype.generate = RSAGenerate;


export default RSAKey;