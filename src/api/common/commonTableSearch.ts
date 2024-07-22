import * as Utils from '/@/utils';

/* #region *************************************************************** 公用表格搜索结构 ******************************************************************  */
export class CommonTableSearch {
    page: number = 1;                       // 页数
    pageSize: number = 10;                  // 每页条数
    [key: string]: any;                     // 其他参数
    constructor(params: any) {
        Utils.DataTools.NewMap.ConstructorObjDefault(this, params);   
    }
}
/* #endregion */
