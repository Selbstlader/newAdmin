export * as Common from './common';       // 公共接口
export * as BaseApi from './base';       // 基础接口
export * as SystemApi from './system';    // 系统接口公共接口
// export * as YjApi from './yingjia';       // 赢家接口
export * as RoleApi from './system/role';  // 角色接口
import http from './api';
import * as MainApi from '../api'

// 接口地址
export const Host = import.meta.env.VITE_APP_BASE_API;
// export const Host = 'http://192.168.211.20:8080' ;
// export const Host = 'http://192.168.211.20:8080' ;
// export const Host = 'http://49.234.152.31:8080' ;
// COS地址
export const COSHost = import.meta.env.VITE_APP_COS_URL;
// COS储存桶
export const Bucket = 'yingjia-1304963394';
// 高拍仪地址
export const CameraHost = 'http://127.0.0.1:38088/';



export const updateUserAvatar = async (param: any): Promise<any> => {
  return http.request({ url: MainApi.Host + `/system/user/upload/avatar`, method: 'post', data: param })
}