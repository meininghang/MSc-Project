import BN from 'bignumber.js'
/**
 * Convert to hexadecimal based on string (avatar color)
 * @param str
 * @returns {string}
 */
export function strToHexCharCode(str) {
    const hexCharCode = [];
    const chars = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    for(let i = 0; i < str.length; i++) {
        let bit = (str[i] & 0x0f0) >> 4;
        hexCharCode.push(chars[bit]);
        bit = str[i] & 0x0f;
        hexCharCode.push(chars[bit]);
    }
    return hexCharCode.join("");
}
export function strToUtf8Bytes(str) {
    const utf8 = [];
    for (let ii = 0; ii < str.length; ii++) {
        let charCode = str.charCodeAt(ii);
        if (charCode < 0x80) utf8.push(charCode);
        else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
        } else {
            ii++;
            charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff));
            utf8.push(
                0xf0 | (charCode >> 18),
                0x80 | ((charCode >> 12) & 0x3f),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f),
            );
        }
    }
    // Compatible with Chinese characters, the maximum value of the ASCII code table is 127, and values greater than 127 are special characters
    for(let jj=0;jj<utf8.length;jj++){
        const code = utf8[jj];
        if(code>127){
            utf8[jj] = code - 256;
        }
    }
    return utf8;
}
export function getFileSize(size) {
    if (!size) return 0

    const num = 1024.0 //byte

    if (size < num) return size + "B"
    if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "K" //kb
    if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + "M" //M
    if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(2) + "G" //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T" //T
}

export async function exportOrderExcel(blob, fileName) {
    let aLink = document.createElement("a")
    let href = window.URL.createObjectURL(blob) //Create a link to download
    aLink.href = href
    aLink.download = fileName //fileName+time
    document.body.appendChild(aLink)
    aLink.click() //click to download
    document.body.removeChild(aLink) //Remove the element after downloading
    window.URL.revokeObjectURL(blob) //Release the blob object
}

export const toBN = (x) => {
    if (isNaN(Number(x))) return new BN(0)
    if (x instanceof BN) return x

    if (typeof x === 'string') {
        if (x.indexOf('0x') === 0 || x.indexOf('-0x') === 0) {
            return new BN((x).replace('0x', ''), 16)
        }
    }
    return new BN(x)
}