import hex from './hex.js'
import utf8 from './utf8.js';
const b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const b64padchar = "=";
const b64pad = b64map + b64padchar;
const BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) { return BI_RM.charAt(n); }
function fillPadding(s) {
    while ((s.length & 3) > 0) s += b64padchar;
    return s;
}
function fromHex(h) {
    let i;
    let c;
    let ret = "";
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
    return fillPadding(ret);
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
    return fillPadding(base64Url);
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
// base 64 encoding
function encode(input) {
    let output = "";

    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    input = utf8.toByteArray(input);

    while (i < input.length) {

        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output +=
            b64pad.charAt(enc1) + b64pad.charAt(enc2) +
            b64pad.charAt(enc3) + b64pad.charAt(enc4);
    }
    return output;
}

function decode(input) {

    let output = [];
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0, j = 0;
    input = input.replace(/[^A-Za-z0-9+/=]/g, "");

    while (i < input.length) {

        enc1 = b64pad.indexOf(input.charAt(i++));
        enc2 = b64pad.indexOf(input.charAt(i++));
        enc3 = b64pad.indexOf(input.charAt(i++));
        enc4 = b64pad.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output[j++] = chr1;

        if (enc3 != 64) {
            output[j++] = chr2;
        }
        if (enc4 != 64) {
            output[j++] = chr3;
        }
    }
    output = utf8.fromByteArray(output);

    return output;
}

const base64 = {
    encode,
    decode,
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