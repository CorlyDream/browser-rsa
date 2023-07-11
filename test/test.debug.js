import BrowserRsa from '../BrowserRsa.js'
import utils from '../lib/utils.js'
const pubkey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L
0a6Pamf4WGY/6oZR2q/nULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQ==`
const privateKey = `MIIBPAIBAAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L0a6Pamf4WGY/6oZR2q/n
ULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQJBAJGIvRYHZymlPlTQQQJm
lFTGvOJJznr/Bub9Ba5TFwViYUAFySTYaaL/FoTIk1Mk5Ng6ImXzYGdEbzHvauZP
T3kCIQDctCw9Jyz9+cwjkaes7j5LYGAAPa4xW7tzzBNXR6MkHwIhAM1iVXozZLfb
4nnNNZJsb4FCua6KBneNI7i+bDqvPQ17AiEAvGDEycWgb39BMLLoDYCkhy3RgyMi
hVqo2yO69mpc4z0CICimPLq570ZAe9uVlPPNCGix9yQnZ05EHfzTm4Il6tR/AiEA
htJm7j0/PnH24O/UKvNrnACnIeBOMi7wIF6B/UN5Wbs=`

const text = 'ce🤮'
const arr = new Uint8Array([1,2,3])
// utils.random.nextBytes(arr)

function testEncryptDecrypt(str) {
    const rsa = new BrowserRsa()
    rsa.setPrivateKey(privateKey)
    const pStr = rsa.publicEncrypt(str)
    const pdStr = rsa.privateDecrypt(pStr, "base64", 'array')
    console.log(str, pStr, pdStr)
}

function testPublicEncrypt(str) {
    const rsa = new BrowserRsa()
    rsa.setPublicKey(pubkey)
    const res = rsa.publicEncrypt(str)
    console.log(str, res)
}

function testPublicDecrypt(str) {
    const rsa = new BrowserRsa()
    rsa.setPublicKey(pubkey)
    const res = rsa.publicDecrypt(str, 'base64', 'array')
    console.log(str, res)
}

testPublicDecrypt('P5faBAqhEXmrHwsC5FKbg+9r04lL/WP+ZXuiDjRLHn8aIj6hoa9lezu0Tj7jaKSEN/w4LzeaO7SblxI0hajfzA==')
// testPublicEncrypt(arr)
// testEncryptDecrypt(arr)