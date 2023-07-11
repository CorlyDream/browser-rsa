// wrapper for directory base
import base64 from "./base/base64.js";
import hex from "./base/hex.js";
import utf8 from "./base/utf8.js";
import random from "./base/rng.js";

function isArray(array) {
    return ArrayBuffer.isView(array) || Array.isArray(array);
}

export default {
    base64: base64,
    hex: hex,
    utf8: utf8,
    random: random,
    isArray
}