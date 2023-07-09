import { BAtoUtf16, Utf16ToBA } from "../lib/text.js";

const text = "🤮"
const bytes = Utf16ToBA(text)
const str = BAtoUtf16(bytes)
console.log(text, bytes, str)