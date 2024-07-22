import http from '@/api/api'
import * as Api from '@/api'
import * as Utils from '@/utils'

/* #region ************************************************************* 附件查询 *****************************************************************  */
export interface FilesItem {
  tenantID?: number;
  createTime?: string;
  createUserID?: string;
  createUserName?: string;
  deleted?: boolean;
  editTime?: string;
  editUserID?: string;
  editUserName?: string;
  fileID: string;
  fileName: string;
  filePath: string;
  length: number;
  memo?: string;
  fileType: string;
  fileGroup?: string;
  userName?: string;
}

export interface QueryFilesResponse extends Api.Common.HttpResponse {
  data: FilesItem[];
}

/** 附件查询 Api
 * @param {string[]} param
 * @returns {QueryFilesResponse} 
 */
export const PostQueryFile = (param: string[]): Promise<QueryFilesResponse> => {
  return http.request({ url: Api.Host + `api/base/pc/v1/file/queryfile`, method: 'post', data: param })
}
/* #endregion */