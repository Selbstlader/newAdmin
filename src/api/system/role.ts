import * as Api from '..'
import * as Utils from '../../utils'
import { postRequest } from '../../lib/axios';
/* #region *************************************************************** 角色管理******************************************************************  */
export interface RoleList extends Api.Common.CommonTableSearch {
   /**
    * 企业名称
    */
   enterpriseName?: string;
   /**
      * 统一社会信用代码
      */
   unifiedSocialCreditCode?: string;
   /**
      * 企业类型
      */
   type?: string;
   /**
    * 联系人
    */
   contact?: string
   /**
      * 联系人电话
      */
   contactPhone?: Number
   /**
      * 邮箱
      */
   email?: string
   /**
      * 状态
      */
   disabledFlag?: boolean
   /**
      * 创建人
      */
   createUserName?: string
   /**
      * 创建时间
      */
   createTime?: string
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
   return postRequest('/oa/enterprise/page/query', param);
}
export const QueryAddRole = async (param: any): Promise<QueryRoleListRes> => {
   return postRequest('/oa/enterprise/create', param);
}
export const QueryUpdateRole = async (param: any): Promise<QueryRoleListRes> => {
   return postRequest('/oa/enterprise/update', param);
}
