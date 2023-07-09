
import BrowserRsa from '../BrowserRsa.js'
const pubkey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L
0a6Pamf4WGY/6oZR2q/nULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQ==`
const privateKey = `MIIBPAIBAAJBALERDhcUpCN0sZB/syK4VdPkXf2xjH+L0a6Pamf4WGY/6oZR2q/n
ULKtqXNtzRLNeF7ZXWrIeFUSawKUKYCa7eUCAwEAAQJBAJGIvRYHZymlPlTQQQJm
lFTGvOJJznr/Bub9Ba5TFwViYUAFySTYaaL/FoTIk1Mk5Ng6ImXzYGdEbzHvauZP
T3kCIQDctCw9Jyz9+cwjkaes7j5LYGAAPa4xW7tzzBNXR6MkHwIhAM1iVXozZLfb
4nnNNZJsb4FCua6KBneNI7i+bDqvPQ17AiEAvGDEycWgb39BMLLoDYCkhy3RgyMi
hVqo2yO69mpc4z0CICimPLq570ZAe9uVlPPNCGix9yQnZ05EHfzTm4Il6tR/AiEA
htJm7j0/PnH24O/UKvNrnACnIeBOMi7wIF6B/UN5Wbs=`
const rsa = new BrowserRsa()
rsa.setPrivateKey(privateKey)
let pubKeyEncript = rsa.publicEncrypt("测试数据测试🤮")
console.log(pubKeyEncript)
