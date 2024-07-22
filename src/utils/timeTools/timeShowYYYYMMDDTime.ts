import {Format} from './timeFormat'

/** 将对象中包含Data，Time，tips的参数转换成YYYY-MM-DD hh:mm:ss的格式
 * 
 * @param obj 传入的对象
 * @param type 
 * @param ifTime 
 * @param it 
 * @returns 
 */
export const ShowYYYYMMDDHHMMSSTime = (obj: any, type: number = 1,ifTime: boolean = true, it: string = 'yyyy/MM/dd hh:mm:ss') => {
    if (!obj) {
        return {}
    }
    let arr: any = Object.keys(obj);
    arr.forEach((o: any) => {
        if ((o.indexOf('Date') != -1 || (ifTime && o.indexOf('Time') != -1) ) && o.indexOf('tips') == -1) {
            if (obj[o]) {
                if (type) {
                    obj['show' + o] = Format(it, new Date(obj[o]));
                } else {
                    if (ifTime && o.indexOf('Time') != -1) {
                        obj[o] = Format(it, new Date(obj[o]));
                    } else {
                        obj[o] = Format('yyyy/MM/dd', new Date(obj[o]));
                    }
                }
            }
        }
        if ( !ifTime && o.indexOf('Time') != -1) {
            if (obj[o]) {
                if (type) {
                    obj['show' + o] = Format(it + ' hh:mm:ss', new Date(obj[o]));
                } else {
                    obj[o] = Format(it + ' hh:mm:ss', new Date(obj[o]));
                }
            }
        }
    })
    return obj
}