import * as MainApi from '/@/api'

export interface SysDicOptions {
    [key:string]: SysDicItem;
}
export interface SysDicItem {
    type: string;
    data?: MainApi.BaseApi.QueryDicRes[];
    dic?: ShowSysDic | undefined;
    options?: SysDicOptionsItem[];
    label?: string[]; // 需要拼接的展示
    name?: string[]; // 需要拼接的展示
    value?: string; // 需要拼接的值
}

export interface SysDicOptionsItem {
    name?: string; 
    label?: string;
    value?: any;
    check?: boolean;
    original?: boolean; 
}

export interface ShowSysDic {
    [key:string]: MainApi.BaseApi.QueryDicRes;
}

export const queryDic = async (options: any, tables?: any, forms?: any, others?: any, checkInfo?: any, checkInfo2?: any) => {
    let param = new MainApi.BaseApi.QueryDicReq({ dictTypeList: [] as string[],}) 
    for (let i in options) { if (options[i].type) param.dictTypeList!.push(options[i].type + '') }
    const res: MainApi.BaseApi.QueryDicRes = await MainApi.BaseApi.QueryDic(param);
    if (res.code == 200) {
        for (let opKey in options) {
            for (let resKey in res.data) {
                console.log('222',options[opKey].type, resKey, options[opKey].type == resKey)
                if (options[opKey].type === resKey) {
                        // 原格式数据
                    options[opKey].data = res.data[resKey]
                        // 整理了格式后的数据
                    options[opKey].options = res.data[resKey].length > 0 ? res.data[resKey].map((resItem: any) => { return { name: getSysdicName(options[opKey], resItem), label: getSysdicLabel(options[opKey], resItem), value: getSysdicValue(options[opKey], resItem), check: getSysdicCheck(resItem, checkInfo), original: getSysdicOriginal(resItem, checkInfo) } }) : []
                    // 字典格式数据
                    options[opKey].dic = {} as any
                    if (res.data[resKey].length > 0) res.data[resKey].forEach((resDicItem: any) => options[opKey].dic![resDicItem.dictValue] = resDicItem) 
                }

                // table解析
                if (tables && Array.isArray(tables)) {// 判断传入的是不是多个tables
                    if (tables.length) tables.forEach((table: any) => { if (table.columns && table.headers.length) table.columns.forEach((tableItem: any) => { if (tableItem.field == opKey) tableItem.options = options[opKey].options })}) // 遍历tables，当table.headers的field和options的Key相等，装入options
                } else if (tables) {
                    if (tables.columns && tables.columns.length) tables.columns.forEach((tableItem: any) => { if (tableItem.field == opKey) tableItem.options = options[opKey].options }) // 当table.headers的field和options的Key相等，装入options
                }

                // form解析
                if (forms && Array.isArray(forms)) { // 判断传入的是不是多个forms
                    if (forms.length) forms.forEach((form: any) => { if (form.columns && form.columns.hasOwnProperty(opKey)) form.columns[opKey].options = options[opKey].options }) // 遍历forms，当form.colomns的key和options的key相等，装入options
                } else if (forms) {
                    if (forms && forms.columns && forms.columns.hasOwnProperty(opKey)) forms.columns[opKey].options = options[opKey].options // 当form.colomns的key和options的key相等，装入options
                }

                // 其它解析
                if  (others && Array.isArray(others)) {
                    if (others.length) others.forEach((other: any) => { if (other.hasOwnProperty(opKey)) other[opKey].options = options[opKey].options })
                } else if (others) {
                    if (others && others.hasOwnProperty(opKey)) others[opKey].options = options[opKey].options
                }
            }
        }
        console.log('oti', options)
        return { code: res.code,data: options,error: res.error }
    } else {
        return res
    }
}

// 获取label,name,value
const getSysdicLabel = (optionsItem: SysDicItem, resItem: MainApi.BaseApi.Dic | any) => {
    if (!optionsItem || !optionsItem.label || optionsItem.label.length == 0) return resItem.dictValue
    let res: string[] = []
    optionsItem.label.forEach((el: string) => {
        for (let key in resItem) {
            if (el == key) res.push(resItem[key])
        }
    })
    return res.toString().replaceAll(',', '_')
}
const getSysdicName = (optionsItem: SysDicItem, resItem: MainApi.BaseApi.Dic | any) => {
    if (!optionsItem || !optionsItem.name || optionsItem.name.length == 0) return resItem.dictValue
    let res: string[] = []
    optionsItem.name.forEach((el: string) => {
        for (let key in resItem) {
            if (el == key) res.push(resItem[key])
        }
    })
    return res.toString().replaceAll(',', '_')
}
const getSysdicValue = (optionsItem: SysDicItem, resItem: MainApi.BaseApi.Dic | any) => {
    if (!optionsItem || !optionsItem.value) return resItem.dictValue
    let res: any = ''
        for (let key in resItem) {
            if (optionsItem.value == key) {
                if (resItem[key] == 'true') res = true
                else if (resItem[key] == 'false') res = false
                else res = resItem[key]
            }
        }
    return res
}

const getSysdicCheck = (resItem: MainApi.BaseApi.Dic | any, checkInfo?: any) => {
        let res = true
    // if (resItem && resItem.extra2 && resItem.extra2 == 'false') return false
    if (checkInfo && checkInfo.type == resItem.dictType && checkInfo.values && checkInfo.values.length) {
        let check = false
        checkInfo.values.forEach((el: string) => { if (el == resItem.dictValue) check = true })
        res = check
    }
    return res
}

const getSysdicOriginal = (resItem: MainApi.BaseApi.Dic | any, checkInfo?: any) => {
    if (!checkInfo) return false
    if (resItem && resItem.dictType == checkInfo.type) return true
}