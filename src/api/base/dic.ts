import * as Api from '/@/api'
import * as Utils from '/@/utils'
import http from '/@/api/api';

/* #region *************************************************************** 字典数据结构 ************************************************************  */
export interface Dic {
    default?: boolean;
    dictCode?: number;
    dictLabel?: string;
    dictSort?: number;
    dictType?: string;
    dictValue?: string;
    isDefault?: string;
    listClass?: string;
    remark?: string;
    status?: string;
}

/* #endregion */

/* #region *************************************************************** 批量查询字典 ************************************************************  */
// 请求 request
export class QueryDicReq  {
    dictTypeList?: string[];                     // 课程名称
    constructor(param: {[key: string]: any}) {
        Utils.DataTools.NewMap.ConstructorObjDefault(this, param);
    }
}

// 返回 response
export interface QueryDicRes extends Api.Common.HttpResponse {
    data: {[key: string]: Dic[]};
}

// 接口地址 api
export const QueryDic = async (param: QueryDicReq): Promise<QueryDicRes> => {
    return http.request({ url: Api.Host + `/system/dict/type/query/tree`, method: 'post', data: param })
}
/* #endregion */
