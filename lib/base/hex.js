
const hex = {
     toByteArray(h) {
        var i;
        var a = new Array();
        for (i = 0; 2 * i < h.length; ++i) {
            a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
        }
        return a;
    },
     fromByteArray(byteArray) {
        return Array.from(byteArray, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    }
}
export default hex