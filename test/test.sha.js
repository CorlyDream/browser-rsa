import utils from '../lib/utils.js'
const  text1 = "测试🦐"
const text = "测试文本🧰。『, 』, 〖, 〗. 【, 】, ±, ×, ÷, ∧, ∨. ∑, ∏, ∪, ∩, ∈, ∷, √. ⊥, ∥, ∠, ⌒, ⊙, ∫, ∮."
let e = utils.base64.encode(text)
console.log(text, "encode", e)

let s = '5rWL6K+V8J+mkA=='
let d = utils.base64.decode(s)
console.log(text1, "decode", d)

