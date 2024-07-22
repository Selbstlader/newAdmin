import { isArray, isBoolean, isObject } from "xe-utils"

export const NewMap = {
    /** 将原始数据，返回
    * @param item 原始数据
     * @param key 键名
     * @param func // 自定义方法
     * @returns 
     */
    Constructor(item: any,key: any, func?: any): any {
        let obj = item ? JSON.parse(JSON.stringify(item)) : {}
        if (func && func[key] && func[key](obj) != 'undefined') {
            return func[key](obj)
        } else if (obj[key]) {
            return obj[key]
        } else if ((typeof (obj[key]) == 'number' && obj[key] == 0) || (typeof (obj[key]) == 'boolean' && !obj[key])) {
            return obj[key]
        }
    },
    /** 将原始数据，同时如果原始数据里面没有的值，设定为默认值
     * @param item 原始数据
     * @param key 键名
     * @param defaultValue // 键名对应的默认值
     * @param func // 自定义方法
     * @returns 
     */
    ConstructorDefault(item: any, key: any, defaultValue: any, func?: any): any {
        let obj = item ? JSON.parse(JSON.stringify(item)) : {}
        if (func && func[key] && func[key](obj) != 'undefined') {
            return func[key](obj)
        } else if (obj[key]) {
            return obj[key]
        }  else if ((typeof (obj[key]) == 'number' && obj[key] == 0) || (typeof (obj[key]) == 'boolean' && !obj[key])) {
            return obj[key]
        } else {
            return defaultValue
        }
    },
    /** 将数据循环赋值
     * @param obj 需要赋值的对象
     * @param data 传入的对象
     * @param func 
     * @returns 
     */
    ConstructorObj(obj: {[key: string]: any}, data: {[key: string]: any}, func?: any): any {
        if (!isObject(obj)) return undefined
        for (let key in obj) obj[key] = this.Constructor(data, key, func);
        return true
    },
    /** 将数据循环赋值,如没有值，设为默认值
     * @param obj 需要赋值的对象
     * @param data 传入的对象
     * @param func 
     * @returns 
     */
    ConstructorObjDefault(obj: {[key: string]: any}, data: {[key: string]: any}, func?: any): any {
        if (!isObject(obj)) return undefined
        for (let key in obj) obj[key] = this.ConstructorDefault(data, key, func);
        return true
    }
}

// 将所有的格式转成string
const anyToString = (data: any) => {
    if (typeof(data) == 'number' && data == 0) return '0'
    if (typeof(data) == 'boolean' && !data) return 'false' 
    if (!data) return undefined
    let s: {[key: string]: any}|string = JSON.parse(JSON.stringify(data))
    if (isArray(s)) {
        let arr: any = []
        if (s.length > 0) {
            s.forEach((item: any) => { arr.push(anyToString(item))  })
        }
        return arr.length > 0 ? arr : undefined
    } else if (isObject(s)) {
        for (let key in s) s[key] = anyToString(s[key])
    } else if (typeof(s) == 'boolean') {
        let b = s ? 'true':'false' 
        return b
    } else {
        s = s + ''
    }
    return s
}

// 将金额转成number并去掉￥
const anyToNumber = (data: {[key: string]: any}) => {
    let obj: {[key: string]: any} = {}
    for (let key in data) {
        if (data[key] && typeof data[key] == 'string' && data[key].indexOf('￥') == 0) { obj[key] = Number(data[key].replace('￥', '').replaceAll(',', ''))}
        else obj[key] = data[key]
    }
    return obj
}
