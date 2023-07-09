/**
 https://zh.wikipedia.org/wiki/UTF-16

Unicode符号范围     |        UTF-8编码方式
(十六进制)        |              （二进制）
----------------------+---------------------------------------------
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
 */

/**
 * bytes array to utf-8 string
 * @param {Array} arr
 */
function BAtoUtf16(arr) {
    var resultString = "", index = 0, len = arr.length;
    // Note that tmp represents the 2nd half of a surrogate pair incase a surrogate gets divided between blocks
    while (index < len) {
        const point = arr[index] & 0xff;
        if (point >> 7 === 0) {
            resultString += String.fromCharCode(point);
            index++;
        } else if (point >> 5 === 0x6) {
            resultString += String.fromCharCode(((point & 0x1f) << 6) | (arr[index + 1] & 0x3f));
            index += 2;
        } else{
            let unicodePoint = 0;
            if (point >> 4 === 0xe) {
                unicodePoint = ((point & 0xf) << 12) | ((arr[index + 1] & 0x3f) << 6) | (arr[index + 2] & 0x3f)
                index += 3;
            } else if (point >> 3 === 0x1e) {
                unicodePoint = ((point & 0x7) << 18) | ((arr[index + 1] & 0x3f) << 12) | ((arr[index + 2] & 0x3f) << 6) | (arr[index + 3] & 0x3f)
                index += 4;
            } else {
                throw new Error("invalid utf8 bytes");
            }
            if(unicodePoint > 0xFFFF){
                unicodePoint -= 0x10000;
                resultString += String.fromCharCode(0xD800 + (unicodePoint >> 10), 0xDC00 + (unicodePoint & 0x3FF));
            }else{
                resultString += String.fromCharCode(unicodePoint);
            }
        } 
    }
    return resultString;
}

/**
 * utf-16 string to utf-8 bytes array
 * @param {String} inputString 
 * @returns array of bytes
 */
function Utf16ToBA(inputString) {
    const len = inputString.length | 0;
    var result = [];
    var pos = 0, point = 0
    for (var i = 0; i < len; i++, pos++) {
        point = inputString.charCodeAt(i);
        if (point <= 0x007f) {
            result[pos] = point;
        } else if (point <= 0x07ff) {
            result[pos] = (0x6 << 5) | (point >> 6);
            result[++pos] = (0x2 << 6) | (point & 0x3f);
        } else {
            if ((point & 0xF800) == 0xD800) {
                // surrogate pair
                const nextPoint = inputString.charCodeAt(i+1);
                if ((nextPoint & 0xFC00) === 0xDC00) {
                    point = ((point - 0xD800) << 10) + (nextPoint - 0xDC00) + 0x10000;
                    i++;
                }
            }
            if (point <= 0xFFFF) {
                result[pos] = (0xe/*0b1110*/ << 4) | (point >> 12);
                result[++pos] = (0x2/*0b10*/ << 6) | ((point >> 6) & 0x3f/*0b00111111*/);
                result[++pos] = (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/);
            } else {
                result[pos] = (0x1e/*0b11110*/ << 3) | (point >> 18);
                result[++pos] = (0x2/*0b10*/ << 6) | ((point >> 12) & 0x3f/*0b00111111*/);
                result[++pos] = (0x2/*0b10*/ << 6) | ((point >> 6) & 0x3f/*0b00111111*/);
                result[++pos] = (0x2/*0b10*/ << 6) | (point & 0x3f/*0b00111111*/);
            }
        }



    }
    return result
}

export { BAtoUtf16, Utf16ToBA };