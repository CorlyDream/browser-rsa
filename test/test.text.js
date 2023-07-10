import { BAtoUtf16, Utf16ToBA } from "../lib/text.js";
import { b64toBA, b64tohex } from "../lib/base64.js";

const text = "🤮"
const bytes = Utf16ToBA(text)
const str = BAtoUtf16(bytes)
console.log(text == str)
console.log(text, bytes, str)

const base64 = 'P6jvMHcDt2+zaa2LowfT8WHZaXHuZFkAYydna9ZwarEkfys/Z7CmufB5M0IovkVkbOyPwgKmoqMZVtdiD40Dxw=='
const bytes2 = Buffer.from(base64, 'base64')
const bytes3 = b64tohex(base64)

console.log(bytes2.toString('hex'))
console.log(bytes3)