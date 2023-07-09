const OID_TAG = 6
const SEQUENCE_TAG = 0x30
const INTEGER_TAG = 0x02
const BIT_STRING_TAG = 0x03
class ASNReader {
    /**
     * 
     * @param {Array} arr 
     * @param {Number} start 开始位置，包含
     * @param {Number} end 结束位置，不包含
     */
    constructor(arr, start = 0, end) {
        if (end && end > arr.length) throw new Error('end out of range')
        this._arr = arr
        this._start = start
        this._offset = 0
        this._end = end || arr.length
    }
    readByte(pos, changeOffset = true) {
        if (!pos) {
            pos = this._start + this._offset
        }
        if (pos >= this._end) {
            throw new Error(`readByte out of range, pos: ${pos}, end: ${this._end}`)
        }
        if (changeOffset) {
            this._offset++
        }
        return this._arr[pos] & 0xff
    }
    /**
     * tag + length + value
     * @param {Number} tag 
     * @returns 
     */
    readTagValue(tag) {
        const t = this.readByte()
        if (tag && t !== tag) {
            throw new Error(`Expected tag ${tag}, got ${t}`)
        }
        const length = this.readByte()
        const newReader = this.slice(this._offset, length)
        this._offset += length
        return newReader
    }
    slice(offset, length) {
        return new ASNReader(this._arr, this._start + offset, this._start + offset + length)
    }
    copyToArray() {
        return this._arr.slice(this._start + this._offset, this._end)
    }
    readSequence() {
        return this.readTagValue(SEQUENCE_TAG)
    }
    readBitString() {
        return this.readTagValue(BIT_STRING_TAG)
    }
    readInteger() {
        return this.readTagValue(INTEGER_TAG)
    }
    readOID() {
        var b = this.readTagValue(OID_TAG, true);
        if (b === null)
            return null;

        var values = [];
        var value = 0;

        for (var i = b._start; i < b._end; i++) {
            var byte = b._arr[i] & 0xff;

            value <<= 7;
            value += byte & 0x7f;
            if ((byte & 0x80) === 0) {
                values.push(value);
                value = 0;
            }
        }

        value = values.shift();
        values.unshift(value % 40);
        values.unshift((value / 40) >> 0);

        return values.join('.');
    }
}

export default ASNReader