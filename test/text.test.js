import { BAtoUtf16, Utf16ToBA } from "../lib/text.js";
import { b64tohex } from "../lib/base64.js";

const text = "测试数据🤮嘞"
test("test utf16 <=> bytes", () => {
    const bytes = Utf16ToBA(text)
    const str = BAtoUtf16(bytes)
    expect(str).toBe(text)
})

test("test base64 <=> hex", () => {
    const base64 = 'P6jvMHcDt2+zaa2LowfT8WHZaXHuZFkAYydna9ZwarEkfys/Z7CmufB5M0IovkVkbOyPwgKmoqMZVtdiD40Dxw=='
    const bytes2 = Buffer.from(base64, 'base64')
    const bytes3 = b64tohex(base64)
    expect(bytes2.toString('hex')).toBe(bytes3)
})

