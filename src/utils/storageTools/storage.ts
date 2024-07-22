import * as Utils from '/@/utils'
import useStore from "/@/store/store";



/* #region ************************ window.localStorage 浏览器永久缓存 *******************************************/
export const ZlLocalStorage = {
    // 设置永久缓存
    set(key: string, val: any) {
        window.localStorage.setItem(key, JSON.stringify(val));
    },
    // 获取永久缓存
    get(key: string) {
        const json: any = window.localStorage.getItem(key);
        return json ? JSON.parse(json) : '';
    },
    // 移除永久缓存
    remove(key: string) {
        window.localStorage.removeItem(key);
    },
    // 移除全部永久缓存
    clear() {
        window.localStorage.clear();
    }
};
/* #endregion */

/* #region ************************ window.localStorage 浏览器永久缓存（AES_CBC加密） ****************************/
export const ZlLocalStorageAES_CBC = {
    // 设置永久缓存
    set(key: string, val: any, ek?: string) {
        if (!val) return
        let IV = ek || key
        let valJSON = JSON.stringify(val)
        let crypoto = new Utils.CommonTools.Crypoto
        let enWord = crypoto.encryptAES_CBC(valJSON, '', IV)
        window.localStorage.setItem(key, enWord);
    },
    // 用ID设置永久缓存
    setByID(key: string, val: any) {
        if (!val) return
        const { user } = useStore();
        let valJSON = JSON.stringify(val)
        let crypoto = new Utils.CommonTools.Crypoto
        let enWord = crypoto.encryptAES_CBC(valJSON, user.userId+'')
        window.localStorage.setItem(key, enWord);
        return true
    },
    // 获取永久缓存
    get(key: string, ek?: string) {
        const json: any = window.localStorage.getItem(key);
        if (!json) return ''
        let IV = ek || key
        let crypoto = new Utils.CommonTools.Crypoto
        let outWord = crypoto.decryptAES_CBC(json,'', IV)
        let out: any = outWord ? JSON.parse(outWord) : ''
        return out
    },
    // 用ID设置永久缓存
    getByID(key: string) {
        const { user } = useStore();
        const json: any = window.localStorage.getItem(key);
        if (!json) return ''
        let crypoto = new Utils.CommonTools.Crypoto
        let outWord = crypoto.decryptAES_CBC(json, user.userId+'')
        let out: any = outWord ? JSON.parse(outWord) : ''
        return out
    },
    // 移除永久缓存
    remove(key: string) {
        window.localStorage.removeItem(key);
    },
    // 移除全部永久缓存
    clear() {
        window.localStorage.clear();
    }
};
/* #endregion */

/* #region ************************ window.sessionStorage 浏览器临时缓存 ****************************************/
export const ZlSessionStorage = {
    // 设置临时缓存
    set(key: string, val: any) {
        window.sessionStorage.setItem(key, JSON.stringify(val));
    },
    
    // 获取临时缓存
    get(key: string) {
        const json: any = window.sessionStorage.getItem(key);
        return json ? JSON.parse(json) : '';
    },
    
    // 移除临时缓存
    remove(key: string) {
        window.sessionStorage.removeItem(key);
    },
    // 移除全部临时缓存
    clear() {
        window.sessionStorage.clear();
    }
};
/* #endregion */

/* #region ************************ window.sessionStorage 浏览器临时缓存（AES_CBC加密） **************************/
export const ZlSessionStorageAES_CBC = {
    // 设置临时缓存
    set(key: string, val: any, ek?: string) {
        if (!val) return
        let IV = ek || key

        let valJSON = JSON.stringify(val)
        let crypoto = new Utils.CommonTools.Crypoto
        let enWord = crypoto.encryptAES_CBC(valJSON, '', IV)
        window.sessionStorage.setItem(key, enWord);
    },
    // 用ID设置临时缓存
    setByID(key: string, val: any) {
        if (!val) return
        const { user } = useStore();
        let valJSON = JSON.stringify(val)
        let crypoto = new Utils.CommonTools.Crypoto
        let enWord = crypoto.encryptAES_CBC(valJSON, user.userId+'')
        window.sessionStorage.setItem(key, enWord);
        return true
    },
    // 获取临时缓存
    get(key: string, ek?: string) {
        const json: any = window.sessionStorage.getItem(key);
        if (!json) return ''
        let IV = ek || key
        let crypoto = new Utils.CommonTools.Crypoto
        let outWord = crypoto.decryptAES_CBC(json, '', IV)
        let out: any = outWord ? JSON.parse(outWord) : ''
        return out
    },
    // 用ID设置临时缓存
    getByID(key: string) {
        const { user } = useStore();
        const json: any = window.sessionStorage.getItem(key);
        if (!json) return ''
        let crypoto = new Utils.CommonTools.Crypoto
        let outWord = crypoto.decryptAES_CBC(json, user.userId+'')
        let out: any = outWord ? JSON.parse(outWord) : ''
        return out
    },
    // 移除临时缓存
    remove(key: string) {
        window.sessionStorage.removeItem(key);
    },
    // 移除全部临时缓存
    clear() {
        window.sessionStorage.clear();
    }
};
/* #endregion */

/* #region ************************ 各种缓存方法 ****************************************************************/
export const ZlStroageTools = {
    /* #region ********************** 设置账户 ************************* */
    /** 保存未加密账户信息到sessionStorage
     * @param obj 账户信息
     */
    setCurUser(obj: Object) {
        window.sessionStorage.setItem('CurUser', JSON.stringify(obj))
    },
    /** 保存AES_CBC加密账户信息到sessionStorage
     * @param obj 账户信息
     */
    setCurUserAES_CBC(obj: Object) {
        let objJSON = JSON.stringify(obj)
        let crypoto = new Utils.CommonTools.Crypoto
        let enWord = crypoto.encryptAES_CBC(objJSON)
        window.sessionStorage.setItem('CurUser', JSON.stringify(enWord))
    },
    /** 获取sessionStorange中的账户信息
     * @returns 账户信息
     */
    getCurUser() {
        let userinfoJSON = window.sessionStorage.getItem('CurUser');
        return userinfoJSON ? JSON.parse(userinfoJSON) : ''
    },
    /** 获取sessionStorange中的AES_CBC加密账户信息
     * @returns 账户信息
     */
    getCurUserAES_CBC() {
        const json: any = window.sessionStorage.getItem('CurUser');
        if (!json) return ''
        let crypoto = new Utils.CommonTools.Crypoto
        let outWord = crypoto.decryptAES_CBC(json)
        let out: any = outWord ? JSON.parse(outWord) : ''
        return out
    },
    /* #endregion */

    /* #region ********************** page 页面信息缓存 ************************* */
    /** 页面PageInfo缓存的方法
     * @param pn 页面名
     * @param tn 表格名
     * @param ps 缓存的pageSize，不传默认为10
     * @returns 
     */
    pageSizeInfo(pn: any, tn: any, ps?: number) {
        let tbparam: any = {}
        let param: any = {}
        if (!localStorage.getItem('pageSizeInfo')) { // 缓存里没有pageSizeInfo
            tbparam[tn] = 50
            param[pn] = tbparam
            localStorage.setItem('pageSizeInfo', JSON.stringify(param))
        } else {
            let pageSizeInfo = localStorage.getItem('pageSizeInfo')
            param = pageSizeInfo ? JSON.parse(pageSizeInfo) : {}
            tbparam = { ...param[pn] }
            if (!ps && param[pn] && param[pn][tn]) return String(param[pn][tn])
            tbparam[tn] = ps ? ps : 10
            param[pn] = { ...tbparam }
            localStorage.setItem('pageSizeInfo', JSON.stringify(param))
        }
        return tbparam[tn]
    },
    /** 页面PageInfo缓存AES_CBC加密的方法
     * @param pn 页面名
     * @param tn 表格名
     * @param ps 缓存的pageSize，不传默认为10
     * @returns 
     */
    pageSizeInfoAES_CBC(pn: any, tn: any, ps?: number) {
        let param: any = Utils.StorageTools.ZlLocalStorageAES_CBC.get('pageSizeInfo') || {} // 整个缓存对象，先从缓存获取，如果没有为{}空对象
        let tbparam: any = {} // 单个页面
        tbparam[tn] = 10 // 初始化设置pageSize为10
        if (!param) { // 缓存里没有pageSizeInfo，进行初始化
            param[pn] = tbparam // 将页面装入整个缓存的对象里面
            Utils.StorageTools.ZlLocalStorageAES_CBC.set('pageSizeInfo', param)
        } else {
            tbparam = { ...param[pn] } // 将单个页面的pageInfo拿到
            if (!ps && param[pn] && param[pn][tn]) return String(param[pn][tn]) // 不需要设置pageSize的时候，返回获取到的pageSize
            if (ps) tbparam[tn] = ps
            param[pn] = { ...tbparam } // 姜单个页面的pageInfo更新到整个缓存对象里面
            Utils.StorageTools.ZlLocalStorageAES_CBC.set('pageSizeInfo', param)
        }
        return tbparam[tn] // 返回pageSize
    },
    clearByV(type: string) {
        let param: any = Utils.StorageTools.ZlLocalStorageAES_CBC.get('zlv') || undefined
        if (!param || param != type) {
            Utils.StorageTools.ZlLocalStorageAES_CBC.clear();
            Utils.StorageTools.ZlLocalStorageAES_CBC.set('zlv', type)
        }
    }
    /* #endregion */
}
/* #endregion */


