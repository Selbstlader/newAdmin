import * as Utils from '/@/utils';

/* #region *************************************************************** 公用返回结构 ******************************************************************  */
export interface CommonRes {
    code: number;                         // 返回状态码
    msg: string;                          // 返回消息
    [key: string]: any;                   // 返回数据
}
/* #endregion */


