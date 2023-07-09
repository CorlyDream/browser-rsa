import RSAKey from "../lib/rsa.js";
const N = '00b1110e1714a42374b1907fb322b855d3e45dfdb18c7f8bd1ae8f6a67f858663fea8651daafe750b2ada9736dcd12cd785ed95d6ac87855126b029429809aede5'
const E = '10001'
const D = '009188bd16076729a53e54d04102669454c6bce249ce7aff06e6fd05ae53170562614005c924d869a2ff1684c8935324e4d83a2265f36067446f31ef6ae64f4f79'
const P = '00dcb42c3d272cfdf9cc2391a7acee3e4b6060003dae315bbb73cc135747a3241f'
const Q = '00cd62557a3364b7dbe279cd35926c6f8142b9ae8a06778d23b8be6c3aaf3d0d7b'
const DP = '00bc60c4c9c5a06f7f4130b2e80d80a4872dd1832322855aa8db23baf66a5ce33d'
const DQ = '28a63cbab9ef46407bdb9594f3cd0868b1f72427674e441dfcd39b8225ead47f'
const C = '0086d266ee3d3f3e71f6e0efd42af36b9c00a721e04e322ef0205e81fd437959bb'
const privateKey = new RSAKey("RSA_PKCS1_PADDING")
privateKey.setPrivate(N, E, D)


const str = '测试数据测试🤮'
const enstr = privateKey.publicEncrypt(str, true)
// const enstr = "2ed13e9a711b2f3a2c1c47c897d7d20d7f1fbebd2ceb7616665fc7d5aabb2d75cd390ad9cb5c04fb2ebd55a5d4366d6ac4fb5075d9a9e99de9a38d1f43bacc0a"
const dstr = privateKey.privateDecrypt(enstr, true)
console.log(str, enstr, dstr)
const pStr = privateKey.privateEncrypt(str, true)
const pdStr = privateKey.publicDecrypt(pStr, true)
console.log(str, pStr, pdStr)