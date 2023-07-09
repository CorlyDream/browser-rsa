import sha1 from '../lib/sha1.js'
import SecureRandom from '../lib/rng.js';
const res = sha1('The quick brown fox jumps over the lazy dog')
console.log(res)
var lHash = sha1.create();
// lHash.update(label);
const emptyHash = lHash.digest();
console.log(emptyHash)

const random = new SecureRandom();
const seed = new Array(10);
random.nextBytes(seed);
console.log(seed)