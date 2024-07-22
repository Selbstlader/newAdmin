// api.ts
import { Interceptors } from './axios';
import { ElMessage } from 'element-plus';
import { Common } from './index'

// 请求配置
export class HttpServer {
  axios: any;
  // 获取axios实例
  constructor() {
    this.axios = new Interceptors().getInterceptors();
  }
  // 封装
  request(config: Common.HttpRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.axios(config).then((res: Common.HttpResponse) => {
        resolve(res);
      }).catch((err: any) => {
        err?.error && ElMessage.error(err?.error);
        reject(err);
      });
    });
  }
}

const http = new HttpServer();

export default http;
