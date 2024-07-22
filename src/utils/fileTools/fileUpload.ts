

import http from '/@/api/api'
import * as Api from '/@/api'

export const ZlUpload = {
    /** 文件上传保存到COS，成功后保存到文件系统
     * @param file 文件
     * @param fileType 文件类型，和file权限的path对应
     * @param fileGroup 文件分组
     */
    async UploadAsync(file: any, fileType: string, fileGroup: string) {
        return new Promise (async (resolve, reject) => {
            // 1、 检查文件是否存在
            if (!file) return Promise.reject({ error: '文件不存在' });
            // 2、 获取文件名
            const fileName = new Date().getTime() + '_' + getFileName(file.name);
            // 3、 上传
            let formData = new FormData();
            formData.append('file', file) 
            const { code, error, data } = await SaveFile(formData, fileType)
            if (error || code != 1) return Promise.reject({ error: '上传失败' });
            // 6、 保存信息到文件系统
            let res: any = await SaveFilePath1(data, fileType, fileGroup || '', fileName, file.size + '')
            if (res.code == 1) {
                resolve({ success: { id: res.data, filepath: data, fileName: fileName } });
            } else {
                reject({ error: res.error });
            }
        })
        
    }
}
const getFileName = (fileName: string) => {
    if (!fileName) return '';
    if (fileName.length > 20) return fileName.substring(fileName.length - 20)
}

// 保存到本地
export const SaveFile = function (param: FormData, fileType: string) {
    return http.request({ url: Api.Host + `file/upload?fileType=${fileType}`, method: 'post', data: param });
};

/** 保存信息到文件系统
 * @param filePath 文件path
 * @param fileType 文件类型，和file权限的path对应
 * @param fileGroup 文件分组
 * @param fileName 文件名
 * @param length 文件大小
 * @returns 
 */
export const SaveFilePath1 = function (filePath: string, fileType: string, fileGroup: string, fileName: string, length: string) {
    // 6、保存到数据库，得到文件id
    //Host
    return http.request({ url: Api.Host + `/system/filelist`, method: 'post', data: { fileType: fileType, filePath: filePath,fileGroup: fileGroup, fileName: fileName, length: length } });
  };


