import http from '@/api/api'
import * as Api from '@/api'
import axios from 'axios'

/**
 * 如：拍摄图片key = 'video=grabimage'
 * @param {*} key
 * @param {*} param
 * @returns
 */
export const PostCameraService = (key: string,param?: any) => {

  return axios.post(Api.CameraHost + `${key}`, param ? JSON.stringify(param) : '');
  // return http.request({ url: CameraHost, method: 'post', data: JSON.stringify(param) })
}
/**
 * 检测高拍仪 服务是否打开 硬件是否连接
 * @param {*} key
 * @returns
 */
export const PostOpenCameraService = (key: any) => {
    return axios.get(Api.CameraHost + `${key}`);
    // return http.request({ url: CameraHost + `${key}`, method: 'get' })
  }

/* #region ********************************************* 新的 *************************************************************** */

// 身份证正面
export const PostOcrZlIDCardFront = (filePath: string) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/idcard/front`, method: 'post', data: { path: filePath } })
}
// 身份证背面
export const PostOcrZlIDCardBack = (filePath: string) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/idcard/back`, method: 'post', data: { path: filePath } })
}


// 行驶证主页
export const PostOcrZlDrivingPermitFront = (filePath: string) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/vehicle/license/front`, method: 'post', data: { path: filePath } })
}
// 行驶证副页
export const PostOcrZlDrivingPermitBack = (filePath: string) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/vehicle/license/back`, method: 'post', data: { path: filePath } })
}


// 驾驶证主页
export const PostOcrZlDrivingLicenseFront = (filePath: string) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/driverlicense/front`, method: 'post', data: { path: filePath } })
}
// 驾驶证副页
export const PostOcrZlDrivingLicenseBack = (filePath: string) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/driverlicense/back`, method: 'post', data: { path: filePath } })
}


// 服务证
export const PostOcrZlCertificateIdentify = (filePath: any) => {
  return http.request({ url: Api.Host + `api/ocr/pc/v1/driverinfo/certificate`, method: 'post', data: { path: filePath } })
}

/* #endregion */