import * as Utils from '@/utils';

/* #region *************************************************************** 公用查询请求 ******************************************************************  */
export class CommonReq {
    protected page: number = 1;                         // 页数
    protected pageSize: number = 10;                    // 页码
    protected tenantID?: number;                        // 租户编号
    protected tenantIDs?: number[];                     // 数据范围
    protected keyWord?: string;                         // 关键字
    protected orderByList?: ReqOrderByListItem[];       // 排序字段
    constructor(item: any, func?: any) {
        Utils.DataTools.NewMap.ConstructorObjDefault(this, item, func);
        if (this.orderByList && this.orderByList.length) this.orderByList = this.orderByList.map((e: any) => new ReqOrderByListItem(e, func));
    }
}

// 排序
export class ReqOrderByListItem {
    desc?: boolean;                                     // 倒序：true， 正序：false
    field?: string;                                     // 排序字段：小驼峰
    tableName?: string;                                 // 排序表名
    constructor(item: any, func?: any) {
        Utils.DataTools.NewMap.ConstructorObjDefault(this, item, func);
    }
}
/* #endregion */
