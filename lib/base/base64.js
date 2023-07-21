import hex from './hex.js'
const b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const b64padchar = "=";
const BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) { return BI_RM.charAt(n); }
function fromHex(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) ret += b64padchar;
    return ret;
}

// convert a base64 string to hex
function toHex(s) {
    var ret = ""
    var i;
    var k = 0; // b64 state, 0-3
    var slop;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64padchar) break;
        let v = b64map.indexOf(s.charAt(i));
        if (v < 0) continue;
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1)
        ret += int2char(slop << 2);
    return ret;
}
function fromBase64Url(base64Url) {
    // Replace non-url compatible chars with base64 standard chars
    base64Url = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = base64Url.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: base64url string is the wrong length to determine padding');
        }
        base64Url += new Array(5 - pad).join('=');
    }
    return base64Url;
}

function toBase64Url(base64) {
    // Remove padding equal characters
    base64 = base64.replace(/=+$/, '');
    // Replace non-url compatible chars with base64 standard chars
    base64 = base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return base64;
}

// convert a base64 string to a byte/number array
function toByteArray(s) {
    //piggyback on b64tohex for now, optimize later
    var h = toHex(s);
    return hex.toByteArray(h);
}
function fromByteArray(arr) {
    return fromHex(hex.fromByteArray(arr))
}
const base64 = {
    fromHex,
    toHex,
    toByteArray,
    fromByteArray,
    int2char,
    fromBase64Url,
    toBase64Url
}
export { int2char }

export default base64