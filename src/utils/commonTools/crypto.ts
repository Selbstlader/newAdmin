import CryptoJS from "crypto-js";

// 加密类型定义
export interface CrypotoType {
    encryptAES_CBC: any
    decryptAES_CBC: any
    encryptSHA256: any
    encryptMD5: any
}
 
/** 加密方法
 * 加密方法
 */
export class Crypoto implements CrypotoType {
    private EK = "zlskek"; // zlsk + userId
    private keyHex = this.getHetKey();
    private iv = "zlskiv"; // zlsk + tenantID + userId
    private IV = this.getIV()

    private getIV() {
        return CryptoJS.enc.Utf8.parse(this.encryptMD5(this.iv));
    }

    private getHetKey() {
        return CryptoJS.enc.Utf8.parse(this.encryptMD5(this.EK));
    }
    
    /* #region ***************** CBC加密 ****************** */
    /** CBC加密 */
    encryptAES_CBC(word: string, ek?: string,iv?: string) {
        if (!word) return word;
        if (ek) this.EK = `zlsk${ek}`
        if (iv) this.iv = `zlsk${iv}`
        let srcs = CryptoJS.enc.Utf8.parse(word)
        let encrypted = CryptoJS.AES.encrypt(srcs, this.keyHex, { 
            iv: this.IV, 
            mode: CryptoJS.mode.ECB, 
            // padding: CryptoJS.pad.Pkcs7,
            padding: CryptoJS.pad.ZeroPadding,
        })
        return encrypted.toString()
    }
 
    /** CBC解密 */
    decryptAES_CBC(word: string, ek?: string, iv?: string) {
        if (!word) return word; 
        if (ek) this.EK = `zlsk${ek}`
        if (iv) this.iv = `zlsk${iv}`
        // let base64 = CryptoJS.enc.Base64.parse(word)
        // let src = CryptoJS.enc.Base64.stringify(base64)
        let decrypt = CryptoJS.AES.decrypt(word, this.keyHex, { 
            iv: this.IV, 
            mode: CryptoJS.mode.ECB, 
            // padding: CryptoJS.pad.Pkcs7,
            padding: CryptoJS.pad.ZeroPadding,
        })
        
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
        return decryptedStr.toString()
    }
    /* #endregion */

    /* #region ***************** SHA256加密 ****************** */
    encryptSHA256(word: string) {
        if (!word) return word
        return CryptoJS.SHA256(word).toString()
    }
    /* #engregion */

    /* #region ***************** MD5加密 ****************** */
    encryptMD5(word: string) {
        if (!word) return word
        return CryptoJS.MD5(word).toString()
    }
    /* #engregion */
}