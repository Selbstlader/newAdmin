export * from './commonInfo';   // 公共信息
export * from './commonReq';    // 公共请求
export * from './commonSave';   // 公共保存
export * from './commonRes';    // 公共返回
export * from './commonTableSearch';    // 表格查询
export * from './ocr';                  // OCR识别

/* #region *************************************************************** 公用请求结构 ******************************************************************  */
export interface HttpRequest {
    method?: string
    url: string
    data?: any
    timeout?: number
    permissionsName?: string
    rows?: any
}
/* #endregion */

/* #region *************************************************************** 公用返回结构 ******************************************************************  */
export interface HttpResponse {
    code: number;                         // 返回状态码
    msg: string;                          // 返回消息
    data?: any;                           // 返回数据
    rows?: any
    [key: string]: any;                   // 返回数据
}
/* #endregion */