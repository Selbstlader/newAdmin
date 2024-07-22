import * as Utils from '/@/utils';

/* #region *************************************************************** 公用保存请求 ******************************************************************  */
export class CommonSave {
    protected tenantID?: number;                        // 租户编号
    protected tenantIDs?: number[];                     // 数据范围
    constructor(item: any, func?: any) {
        Utils.DataTools.NewMap.ConstructorObjDefault(this, item, func);
    }
}


/* #endregion */
