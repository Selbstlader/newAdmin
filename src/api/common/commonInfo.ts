import * as Utils from '/@/utils';

/* #region *************************************************************** 公用数据结构 ******************************************************************  */
export interface CommonInfo {
    createUserId: string;                         // 创建人编号
    createUserName: string;                       // 创建人姓名
    createTime: string;                           // 创建时间
    editUserId: string;                           // 修改人编号
    editUserName: string;                         // 修改人姓名
    editTime: string;                             // 修改时间
    deleted: boolean;                             // 是否删除
    deleteReason: string;                         // 删除原因
}
/* #endregion */


