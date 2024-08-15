import utils from "../lib/utils.js";

const text = "测试数据🤮嘞fd廁🚗"
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


test("test base64url <=> text", () => {
    const textBuff = Buffer.from(text)
    const base64Url = textBuff.toString('base64url')
    const base64 = utils.base64.fromBase64Url(base64Url)
    expect(base64Url).toEqual(utils.base64.toBase64Url(base64))
    expect(base64).toEqual(textBuff.toString('base64'))
    const arr = utils.base64.toByteArray(base64)
    expect(text).toEqual(utils.utf8.fromByteArray(arr))
})

test("test padding base64url <=> text", () => {
    const t = 'a'
    const textBuff = Buffer.from(t)
    const base64Url = textBuff.toString('base64url')
    const base64 = utils.base64.fromBase64Url(base64Url)
    expect(base64Url).toEqual(utils.base64.toBase64Url(base64))
    expect(base64).toEqual(textBuff.toString('base64'))
    const arr = utils.base64.toByteArray(base64)
    expect(t).toEqual(utils.utf8.fromByteArray(arr))
})

test("test base64 encode/decode <=> text", () => {
    const t = 'a'
    const en1 = btoa(t)
    const en2 = utils.base64.encode(t)
    expect(en1).toEqual(en2)
    const de1 = atob(en1)
    const de2 = utils.base64.decode(en2)
    expect(de1).toEqual(de2)
})