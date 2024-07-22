import http from '/@/api/api'
import Cos from 'cos-js-sdk-v5'
import useStore from "/@/store/store";
import * as Api from '/@/api'

interface FileInfo {
    fileDirectory: string;
    credentials: Credentials;
}
interface Credentials {
    TmpSecretId?: number;
    TmpSecretKey?: string;
    XCosSecurityToken?: string;
    ExpiredTime?: string;
    StartTime?: string;
}

export const ZlCosUpload = {
    /** 文件上传保存到COS，成功后保存到文件系统
     * @param file 文件
     * @param fileType 文件类型，和file权限的path对应
     * @param fileGroup 文件分组
     */

    async UploadAsync(file: any, fileType: string, fileGroup: string) {
        return new Promise (async (resolve, reject) => {
            console.log('fiel', file)
            // 1、 检查文件是否存在
            if (!file) return Promise.reject({ error: '文件不存在' });
            // 2、 获取文件名
            const fileName = new Date().getTime() + '_' + file.name;
            // 3、 获取文件path和临时密匙
            const fileInfo: any = await getFileInfo(fileGroup);
            // 4、 获取filepath
            const filepath: string = (fileGroup ? '/' + fileGroup : '') + '/' + fileName;
            console.log('dddd', filepath)
            if (!filepath) return Promise.reject({ error: '获取filepath失败' });
            // 5、 上传文件到COS
            const cosRes: any = await PutObjectAsync(file, filepath, fileInfo.credentials);
            if (!cosRes) return Promise.reject({ error: '上传COS失败' }); 
            // 6、 保存信息到文件系统
            const res: any = await SaveFilePath(filepath, fileType, fileGroup || '', fileName, file.size)
            if (res.code == 200) {
                resolve({ success: { id: res.data, filepath: filepath, fileName: fileName } });
            } else {
                reject({ error: res.error });
            }
        })
        
    }
}

/** 上传到COS
 * @param file 
 * @param filepath 
 * @param filecredentials 
 * @returns 
 */
export const PutObjectAsync = (file: any, filepath: any, filecredentials: any ) => {
    return new Promise((resolve, reject) => {
        console.log('file', file, filepath)
        const { upload } = useStore()
        let cos = new Cos({
            getAuthorization(options, callback) {
                callback(filecredentials)
            }
        })
        cos.putObject(
            {
                Bucket: Api.Bucket,
                /* 必须 */
                Region: 'ap-chengdu',
                /* 必须 */
                Key: filepath,
                /* 必须 */
                Body: file, // 上传文件对象
                onProgress: (progressData: any) => { // 上传进度
                    const percent = progressData.percent * 100
                    upload.setPercent(percent)
                },
            },
            function (err: any, data: any) {
                if (data && data.statusCode == 200) {
                    resolve(true)
                } else {
                    reject({ error: err });
                }
            }
        );
    });
};

/** 上传前从后端获取文件path和临时密匙
 * @param fileType 文件类型，和file权限的path对应
 * @returns 
 */
export const getFileInfo = async (fileType: string): Promise<FileInfo> => {
    // 异步获取临时密钥
    return new Promise((resolve, rejects) => {
        http.request({ url: Api.Host + `/system/filelist/upload/credential`, method: 'post', data:{filedirectory: fileType} })
        .then(
        res => {
            try {
                let data = res.data
                let credentials = data.credentials
                if (!data || !credentials) return console.error('credentials invalid')
                let r: FileInfo = {
                    fileDirectory: '',
                    credentials: {
                        TmpSecretId: credentials.tmpSecretId, // 临时密钥的 tmpSecretId
                        TmpSecretKey: credentials.tmpSecretKey, // 临时密钥的 tmpSecretKey
                        XCosSecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
                        ExpiredTime: data.expiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
                        StartTime: data.startTime
                    }
                }
                console.log('ddssd', r)
                resolve(r)
            } catch (e) {
                console.log(' res.data', res.data);
            }
        })
    })
    

}

/** 保存信息到文件系统
 * @param filePath 文件path
 * @param fileType 文件类型，和file权限的path对应
 * @param fileGroup 文件分组
 * @param fileName 文件名
 * @param length 文件大小
 * @returns 
 */
export const SaveFilePath = function (filePath: string, fileType: string, fileGroup: string, fileName: string, length: number) {
    // 6、保存到数据库，得到文件id
    //Host
    return http.request({ url: Api.Host + `/system/filelist`, method: 'post', data: { fileType: fileType, filePath: filePath,fileGroup: fileGroup, fileName: fileName, length: length } });
  };


