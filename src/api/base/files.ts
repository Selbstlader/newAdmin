import http from '@/api/api'
import * as Api from '@/api'
import * as Utils from '@/utils'

/* #region ************************************************************* 文件系统 *****************************************************************  */
export interface Files {
  tenantID?: number;
  createTime?: string;
  createUserID?: string;
  createUserName?: string;
  deleted?: boolean;
  editTime?: string;
  editUserID?: string;
  editUserName?: string;
  fileID: number | string;
  fileName: string;
  filePath: string;
  length: number;
  memo?: string;
  fileType: string;
  fileGroup?: string;
  userName?: string;
}
/* #endregion */

/* #region ************************************************************* 附件查询 *****************************************************************  */

export interface QueryFilesResponse extends Api.Common.HttpResponse {
  data: Files[];
}



/** 附件查询 Api
 * @param {string[]} param
 * @returns {QueryFilesResponse} 
 */
export const PostQueryFile = (param: string[]): Promise<QueryFilesResponse> => {
  return http.request({ url: Api.Host + `/system/filelist/list+`, method: 'post', data: param })
}
/* #endregion */