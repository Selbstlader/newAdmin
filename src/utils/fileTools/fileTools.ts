import * as Api from '/@/api'
import { ElMessage, ElMessageBox } from 'element-plus';
// import * as Utils from '/@/utils'
/**
 * 将base64图片转为File文件类型
 * @param {*} urlData
 * @param {*} fileName
 * @returns
 */
export const   base64ToFile = (urlData: any, fileName: any) => {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bytes = atob(arr[1]); // 解码base64
    let n = bytes.length
    let ia = new Uint8Array(n);
    while (n--) {
    ia[n] = bytes.charCodeAt(n);
    }
    return new File([ia], fileName, { type: mime });
}

// 整理附件信息 param
export const  getFilesParam = async (ids: string) => {
    if(!ids) return
    let param: any[] = []
    const list = ids.split(',')
    if (list.length) list.forEach((el: any) => { if (el) param.push(el) })
    const resFiles: Api.SystemApi.FilesItem[] = await httpQueryFiles(param);
    const res = {
        files: resFiles,
        filesDic: {} as any
    }
    if (resFiles.length) {
        resFiles.forEach((item: Api.SystemApi.FilesItem) => {
            res.filesDic[`${item.fileType}${item.fileGroup}`] = item.fileID
        })
    }
    return res
}


// 整理附件信息 arr 
export const getFilesArr = async (arr: any) => {
    if (!arr || arr.length == 0) return
    let param:any[] = []
    arr.forEach((item: any) => {if (item.fileIDs) param.push(item.fileIDs)})
    if (param.length) param = param.toString().split(',')
    let resFiles: Api.SystemApi.FilesItem[] = await httpQueryFiles(param);
    let res = {
        files: resFiles,
        filesDic: {} as any
    }
    if (resFiles.length) {
        resFiles.forEach((item: Api.SystemApi.FilesItem) => {
            res.filesDic[`${item.fileType}${item.fileGroup}`] = item.fileID
        })
    }
    return res
}


/*查询附件*/
export const httpQueryFiles = async (param: string[]): Promise<Api.SystemApi.FilesItem[]> => {
    return new Promise(async (resolve, reject) => {
        const res: Api.SystemApi.QueryFilesResponse = await Api.SystemApi.PostQueryFile(param);
        if (res.code == 200) {
            resolve(res.data)
        } else {
            if (!res.error) ElMessage.error(res.error)
        }
    })

}


/** 判断文件类型
 * @param fileName 文件名
 * @returns 文件类型，image/txt/excel/word/pdf/ppt/video/radio/zip/unknown
 */
export const getFileType = (fileName: string) => {
    // 后缀获取
    let suffix = ''
    // 获取类型结果
    let result: any = ''
    try {
        const flieArr = fileName.split('.')//根据.分割数组
        suffix = flieArr[flieArr.length - 1]//取最后一个
    } catch (err) {//如果fileName为空等.split方法会报错，就走下面的逻辑
        suffix = ''
    }
    // fileName无后缀返回 false
    if (!suffix) {//走catch后返回false
        return 'unknown'
    }
    suffix = suffix.toLocaleLowerCase()//将后缀所有字母改为小写方便操作

    // 图片格式
    const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif','webp','jfif']//可以将符合该分类的后缀都写入数组里
    // 进行图片匹配
    result = imglist.find(item => item === suffix)
    if (result) {
        return 'image'
    }
    // 匹配txt
    const txtlist = ['txt']
    result = txtlist.find(item => item === suffix)
    if (result) {
        return 'txt'
    }
    // 匹配 excel
    const excelist = ['xls', 'xlsx']
    result = excelist.find(item => item === suffix)
    if (result) {
        return 'excel'
    }
    // 匹配 word
    const wordlist = ['doc', 'docx']
    result = wordlist.find(item => item === suffix)
    if (result) {
        return 'word'
    }
    // 匹配 pdf
    const pdflist = ['pdf']
    result = pdflist.find(item => item === suffix)
    if (result) {
        return 'pdf'
    }
    // 匹配 ppt
    const pptlist = ['ppt', 'pptx']
    result = pptlist.find(item => item === suffix)
    if (result) {
        return 'ppt'
    }
    // 匹配 视频
    const videolist = [
        'mp4',
        'm2v',
        'mkv',
        'rmvb',
        'wmv',
        'avi',
        'flv',
        'mov',
        'm4v'
    ]
    result = videolist.find(item => item === suffix)
    if (result) {
        return 'video'
    }
    // 匹配 音频
    const radiolist = ['mp3', 'wav', 'wmv']
    result = radiolist.find(item => item === suffix)
    if (result) {
        return 'radio'
    }
    // 匹配 压缩包
    const ziplist = ['zip', 'rar']
    result = ziplist.find(item => item === suffix)
    if (result) {
        return 'zip'
    }
    return 'unknown'//以上的判断逻辑都没return时反馈当前后缀是其他类型文件后缀
}



/** 判断是否是图片文件或者txt
 * @param {*} imgFile
 * @returns
 */
export const isImg = (imgFile: any) => {
    var imgStr = /\.(jpg|jpeg|png|bmp|gif|BMP|JPG|PNG|JPEG|GIF|jfif|JFIF)$/;
    if (!imgStr.test(imgFile.fileName)) {
        return false;
    }
    return true;
}

export const isVideo = (imgFile: any) => {
    var imgStr = /\.(mp4|MP4|ogg|OGG|flv|FLV|avi|AVI|wmv|WMV|rmvb|RMVB|mov|MOV|ogv|OGV)$/;
    if (!imgStr.test(imgFile.fileName)) {
        return false;
    }
    return true;
}

/** 判断是否是excel
 * @param {*} excelFile
 * @returns
 */
export const isExcel = (excelFile: any) => {
    var imgStr = /\.(xlsx|xls)$/;
    if (!imgStr.test(excelFile.fileName)) {
        return false;
    }
    return true;
}


/** 判断传入的字符串的后缀
 * @param {*} name
 * @returns
 */
export const getSuffix = (name: any) => {
    var imgStr =
        /\.(7z|aep|asp|aet|ai|bak|aac|3gp|bmp|cpp|avi|aepx|aspx|csv|cmd|c|bat|div|dll|doc|cs|eps|dbf|css|flv|db|dot|h|gif|docx|htm|jpg|exe|jpeg|json|html|jsp|java|m4v|mkv|js|mdf|mp3|mp4|mdb|php|mov|lib|png|pptx|psd|ppt|pdf|rar|mpeg|raw|rm|xml|wav|txt|tiff|rtf|py|xd|svg|zip|rmvb|wdb|xlsx|wps|wma|tmp|wmv|vob|xls|excel)$/;
    if (!imgStr.test(name)) {
        return 'weizhiwenjian';
    }
    if (name && name.includes('.')) {
        let arr = name.split('.');
        return arr[arr.length - 1];
    } else {
        return 'weizhiwenjian';
    }
}


/** 判断传入的字符串的后缀返回颜色
 * @param {*} name
 * @returns
 */
export const getSuffixColor = (name: any) => {
    var imgStr =
        /\.(7z|aep|asp|aet|ai|bak|aac|3gp|bmp|cpp|avi|aepx|aspx|csv|cmd|c|bat|div|dll|doc|cs|eps|dbf|css|flv|db|dot|h|gif|docx|htm|jpg|exe|jpeg|json|html|jsp|java|m4v|mkv|js|mdf|mp3|mp4|mdb|php|mov|lib|png|pptx|psd|ppt|pdf|rar|mpeg|raw|rm|xml|wav|txt|tiff|rtf|py|xd|svg|zip|rmvb|wdb|xlsx|wps|wma|tmp|wmv|vob|xls|excel)$/;
    if (!imgStr.test(name)) {
        return '#9A9A9A';
    }
    if (name && name.includes('.')) {
        let arr = name.split('.');
        let color: any = {
            xls: '#1fb77a',
            '7z': '#8c72fe',
            aep: '#e06aff',
            asp: '#57c021',
            aet: '#e06aff',
            ai: '#ff9a00',
            bak: '#87a0a0',
            aex: '#e06aff',
            aac: '#df3d54',
            '3gp': '#ffc466',
            bmp: '#72a9fe',
            cpp: '#57c021',
            avi: '#ffc466',
            aepx: '#e06aff',
            aspx: '#57c021',
            csv: '#1fb77a',
            c: '#57c021',
            bat: '#87a0a0',
            div: '#f7ce5a',
            dll: '#87a0a0',
            doc: '#3e8af0',
            cs: '#57c021',
            eps: '#0092bf',
            css: '#57c021',
            flv: '#ffc466',
            db: '#ffa566',
            dot: '#3e8af0',
            h: '#57c021',
            gif: '#72a9fe',
            docx: '#3e8af0',
            jpg: '#72a9fe',
            exe: '#87a0a0',
            jpeg: '#72a9fe',
            json: '#57c021',
            html: '#3ecbf0',
            jsp: '#57c021',
            java: '#57c021',
            mkv: '#ffc466',
            js: '#57c021',
            mdf: '#ffa566',
            mp3: '#df3d54',
            mp4: '#ffc466',
            mdb: '#ffa566',
            php: '#57c021',
            lib: '#87a0a0',
            png: '#72a9fe',
            pptx: '#ed6941',
            psd: '#0092bf',
            ppt: '#ed6941',
            pdf: '#ca223d',
            rar: '#8c72fe',
            raw: '#72a9fe',
            rm: '#ffc466',
            xml: '#57c021',
            wav: '#df3d54',
            txt: '#57c021',
            tiff: '#72a9fe',
            py: '#57c021',
            xd: '#ff00b3',
            svg: '#72a9fe',
            zip: '#8c72fe',
            rmvb: '#ffc466',
            wdb: '#ffa566',
            xlsx: '#1fb77a',
            wma: '#df3d54',
            tmp: '#87a0a0',
            wmv: '#ffc466',
            vob: '#ffc466',
        };
        return color[`${arr[arr.length - 1].toString()}`];
    } else {
        return '#9A9A9A';
    }
}


