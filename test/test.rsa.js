import RSAKey from "../lib/rsa.js";
const N = '00b1110e1714a42374b1907fb322b855d3e45dfdb18c7f8bd1ae8f6a67f858663fea8651daafe750b2ada9736dcd12cd785ed95d6ac87855126b029429809aede5'
const E = '10001'
const D = '009188bd16076729a53e54d04102669454c6bce249ce7aff06e6fd05ae53170562614005c924d869a2ff1684c8935324e4d83a2265f36067446f31ef6ae64f4f79'
const privateKey = new RSAKey('RSA_PKCS1_PADDING')
privateKey.setPrivate(N, E, D)


const str = '测试数据测试🤮'
const enstr = privateKey.publicEncrypt(str, true)
// const enstr = "2ed13e9a711b2f3a2c1c47c897d7d20d7f1fbebd2ceb7616665fc7d5aabb2d75cd390ad9cb5c04fb2ebd55a5d4366d6ac4fb5075d9a9e99de9a38d1f43bacc0a"
const dstr = privateKey.privateDecrypt(enstr, true)
console.log(str, enstr, dstr)