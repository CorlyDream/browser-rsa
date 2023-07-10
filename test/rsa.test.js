import BrowserRsa from '../BrowserRsa.js'
import crypto from 'crypto'

const pubkey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L
0a6Pamf4WGY/6oZR2q/nULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQ==`
const privateKey = `MIIBPAIBAAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L0a6Pamf4WGY/6oZR2q/n
ULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQJBAJGIvRYHZymlPlTQQQJm
lFTGvOJJznr/Bub9Ba5TFwViYUAFySTYaaL/FoTIk1Mk5Ng6ImXzYGdEbzHvauZP
T3kCIQDctCw9Jyz9+cwjkaes7j5LYGAAPa4xW7tzzBNXR6MkHwIhAM1iVXozZLfb
4nnNNZJsb4FCua6KBneNI7i+bDqvPQ17AiEAvGDEycWgb39BMLLoDYCkhy3RgyMi
hVqo2yO69mpc4z0CICimPLq570ZAe9uVlPPNCGix9yQnZ05EHfzTm4Il6tR/AiEA
htJm7j0/PnH24O/UKvNrnACnIeBOMi7wIF6B/UN5Wbs=`
const nodePrivateKey = crypto.createPrivateKey({
    key: `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`,
    format: 'pem',
})
const rsa = new BrowserRsa()
rsa.setPrivateKey(privateKey)
const text = '测试数据🤮嘞'
test('rsa publicEncrypt-privateDecrypt', () => {
    const pubKeyEncript = rsa.publicEncrypt(text)
    const pText = rsa.privateDecrypt(pubKeyEncript)
    expect(text).toEqual(pText)
})

test('rsa privateEncrypt-publicDecrypt', () => {
    const priKeyEncript = rsa.privateEncrypt(text)
    const pText = rsa.publicDecrypt(priKeyEncript)
    expect(text).toEqual(pText)
})

test('rsa publicEncrypt node privateDecrypt ', () => {
    const pubKeyEncript = rsa.publicEncrypt(text)
    let encrypted = Buffer.from(pubKeyEncript, "base64")
    const pText = crypto.privateDecrypt({
        key: nodePrivateKey,
    }, encrypted)
    expect(text).toEqual(pText.toString('utf8'))
})

test('rsa privateEncrypt node publicDecrypt ', () => {
    const priKeyEncript = rsa.privateEncrypt(text)
    let encrypted = Buffer.from(priKeyEncript, "base64")
    const pText = crypto.publicDecrypt({
        key: nodePrivateKey,
    }, encrypted)
    expect(text).toEqual(pText.toString('utf8'))
})