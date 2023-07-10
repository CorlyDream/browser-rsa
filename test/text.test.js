import utils from "../lib/utils.js";

const text = "测试数据🤮嘞"
test("test utf16 <=> bytes", () => {
    const bytes = utils.utf8.toByteArray(text)
    const str = utils.utf8.fromByteArray(bytes)
    expect(str).toBe(text)
})

test("test base64 <=> hex", () => {
    const base64 = 'P6jvMHcDt2+zaa2LowfT8WHZaXHuZFkAYydna9ZwarEkfys/Z7CmufB5M0IovkVkbOyPwgKmoqMZVtdiD40Dxw=='
    const bytes2 = Buffer.from(base64, 'base64')
    const bytes3 = utils.base64.toHex(base64)
    expect(bytes2.toString('hex')).toBe(bytes3)
})

