// 封装axios
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { addPending, checkRequest } from './pending';
import { tansParams } from '../utils/ruoyi';
import errorCode from '../utils/errorCode';
import cache from '../plugins/cache';
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus';
import useUserStore from '../store/modules/user';
import { getToken } from '../utils/auth';
import { getTokenFromCookie } from '/@/utils/cookie-util';
// 是否显示重新登录
export const isRelogin = { show: false };
// token的消息头
const TOKEN_HEADER: string = 'x-access-token';

export class Interceptors {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_API as string,
      timeout: 30 * 1000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    this.setupInterceptors();
  }
  // 初始化拦截器
  setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 在发送请求之前消息头加入token token
        // const token = getTokenFromCookie();
        // if (token) {
        //   config.headers[TOKEN_HEADER] = token;
        // } else {
        //   delete config.headers[TOKEN_HEADER];
        // }
        // 是否需要设置 token
        const isToken = getTokenFromCookie();
        if (isToken) {
          config.headers![TOKEN_HEADER] = isToken;
        } else {
          delete config.headers![TOKEN_HEADER];
        }
        // 是否需要防止数据重复提交
        const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
        // 如果pending中没有该请求，则加入pending ，有的话，会在该方法中取消
        if (!checkRequest(config)) addPending(config)
        if (getToken() && !isToken && config.headers) {
          config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        // 请求没有headers时，抛出错误
        if (!config.headers) throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);

        // get请求映射params参数
        if (config.method === 'get' && config.params) {
          let url = config.url + '?' + tansParams(config.params);
          url = url.slice(0, -1);
          config.params = {};
          config.url = url;
        }

        if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
          const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime(),
          };
          const sessionObj = cache.session.getJSON('sessionObj');
          cache.session.setJSON('sessionObj', requestObj);
          //       if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
          //       cache.session.setJSON('sessionObj', requestObj);
          //   } else {
          //       const s_url = sessionObj.url; // 请求地址
          //       const s_data = sessionObj.data; // 请求数据
          //       const s_time = sessionObj.time; // 请求时间
          //       const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
          //       if (
          //           s_data === requestObj.data &&
          //           requestObj.time - s_time < interval &&
          //           s_url === requestObj.url
          //       ) {
          //           const message = '数据正在处理，请勿重复提交';
          //           console.warn(`[${s_url}]: ` + message);
          //           return Promise.reject(new Error(message));
          //       } else {
          //           cache.session.setJSON('sessionObj', requestObj);
          //       }
          //   }
        }

        return config
      },
      () => {
        // 错误抛到业务代码
        const error = { data: { msg: '服务器异常，请联系管理员！' } };
        return Promise.resolve(error);
      },
    );
    // 响应拦截器
    this.instance.interceptors.response.use((res: any) => { // ok
      // 未设置状态码则默认成功状态
      const code = res.data.code || 200;
      // 获取错误信息
      const msg = errorCode[code] || res.data.msg || errorCode['default'];
      // 二进制数据则直接返回
      if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data;
      }
      if (code === 401) {
        if (!isRelogin.show) {
          isRelogin.show = true;
          ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              isRelogin.show = false;
              useUserStore()
                .logOut()
                .then(() => {
                  location.href = '/index';
                });
            })
            .catch(() => {
              isRelogin.show = false;
            });
        }
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
      } else if (code === 500) {
        ElMessage.error(msg);
        return Promise.reject(new Error(msg));
      } else if (code === 601) {
        ElMessage({
          message: msg,
          type: 'warning',
        });
        return Promise.reject(new Error(msg));
      } else if (code !== 200) {
        ElNotification.error({
          title: msg,
        });
        return Promise.reject('error');
      } else {
        return Promise.resolve(res.data);
      }
    }, (error: any) => { // err
      console.log('err' + error);
      let { message } = error;
      if (message === 'Network Error') {
        message = '后端接口连接异常';
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时';
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常';
      }
      ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    });
  }
  // 返回一下
  getInterceptors() {
    return this.instance;
  }
}

// 通用下载方法
// export function download(url: string, params: any, filename: string, config: any = {}) {
//   downloadLoadingInstance = ElLoading.service({
//       text: '正在下载数据，请稍候',
//       background: 'rgba(0, 0, 0, 0.7)',
//   });
//   return service
//       .post(url, params, {
//           transformRequest: [
//               params => {
//                   return tansParams(params);
//               },
//           ],
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//           responseType: 'blob',
//           ...config,
//       })
//       .then(async (data: any) => {
//           const isBlob = blobValidate(data);
//           if (isBlob) {
//               const blob = new Blob([data]);
//               saveAs(blob, filename);
//           } else {
//               const resText = await data.text();
//               const rspObj = JSON.parse(resText);
//               const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
//               ElMessage.error(errMsg);
//           }
//           downloadLoadingInstance.close();
//       })
//       .catch(r => {
//           console.error(r);
//           ElMessage.error('下载文件出现错误，请联系管理员！');
//           downloadLoadingInstance.close();
//       });
// }
