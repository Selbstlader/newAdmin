import * as Api from '..'
import * as Utils from '../../utils'
import http from '../api';
import { roleApi } from './role/role-api';
import { getRequest } from '../../lib/axios';
/* #region *************************************************************** 角色管理******************************************************************  */
export interface RoleList extends Api.Common.CommonTableSearch {
    roleName?: string;                      // 姓名
    remark?: string;                    // 手机号
}
/* #endregion */

/* #region *************************************************************** 查询角色管理列表 ************************************************************  */
// 请求 request
export class QueryRoleListReq extends Api.Common.CommonReq {
    constructor(param: { [key: string]: any }) {
        super(param)
        Utils.DataTools.NewMap.ConstructorObjDefault(this, param);
    }
}

// 返回 response
export interface QueryRoleListRes extends Api.Common.HttpResponse {
    RoleList?: RoleList[];                   // 角色管理列表
}

// 接口地址 api
// 查询角色列表
export const QueryRoleList = async (param: QueryRoleListReq): Promise<QueryRoleListRes> => {
    return getRequest('/role/getAll');
}