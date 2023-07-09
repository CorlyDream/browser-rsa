
import BrowserRsa from '../BrowserRsa.js'
const pubkey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L
0a6Pamf4WGY/6oZR2q/nULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQ==`
const rsa = new BrowserRsa()
rsa.setPublicKey(pubkey)
let pubKeyEncript = rsa.publicEncrypt("测试数据测试🤮")
console.log(pubKeyEncript)
