/* #region ************************************************************* 表格配置 *************************************************************  */
export class ZlVXETable {
    private loading = false;           // 是否加载中
    pageName = '';              // 页面名称
    tableName = '';             // 表格名称
    columns: ZlVXETableColumn[] = [];   // 列配置
    constructor(pageName: string, tableName: string) {
        this.pageName = pageName;
        this.tableName = tableName;
    }
    createColumns(field: string, title: string, minWidth: string, config?: ZlVXETableColumnOthers) {
        this.columns?.push(new ZlVXETableColumn({ field, title, minWidth, ...config }));
        return this;
    }
    setLoading(loading: boolean) {
        this.loading = loading;
    }
}

export class ZlVXETableColumnOthers {
    width?: string;                         // 宽度
    visible?: boolean;                      // 是否显示
    fixed?: string;                         // 是否固定left:左固定,right:右固定 string
    editRender?: Object;                    // 编辑
    children?: any[];                       // 子表
    align?: string = 'left';                 // column文字位置
    headerAlign?: string = 'left';           // header文字位置
    footerAlign?: string = 'left';           // pager合计文字位置
    params?: any;                            // 参数
    resizable?: boolean;                   // 能否拖动
    sum?: boolean;                          // 是否合计
    treeNode?: boolean;                     // 树节点
    type?: string;                          // 类型
    showOverflow?: boolean;                 // 是否展示文字缩略三个点
    className?: string;                     // columnClassName
    searchType?: string;                    // 搜索类型
    searchDefault?: string;                  // 搜索默认值
    options?: ZlVXETableHeadersDataCreate[]; // 搜索选择项
    searchField?: string;                   // 搜索字段
    slots?: ZlVXETableColumnSlots;          // 插槽的配置
    noShow?: boolean;
    constructor(column: { [key: string]: any }) {
        for (const key in this) if (column.hasOwnProperty(key)) this[key] = column[key];
        if (column.slots) this.slots = new ZlVXETableColumnSlots(column.slots);
        if (column.options && column.options.length) this.options = column.options.map((item: any) => new ZlVXETableHeadersDataCreate(item));
    }
}

export class ZlVXETableColumn extends ZlVXETableColumnOthers {
    field = '';                       // 字段
    title = '';                       // 显示名称
    minWidth?: string;                      // 最小列宽
    constructor(column: { [key: string]: any }) {
        super(column);
        for (const key in this) if (column.hasOwnProperty(key)) this[key] = column[key];
        // 当需要搜索且没有设置searchField时，默认使用field
        if (column.searchType && !column.searchField) this.searchField = column.field;
    }
}

/** zlVXETableColoum中slots配置类
 * @author CC
 * @DateTime 2024-06-12
 * @version 2.0
 * @param header 表头插槽的名称，和YbVXETableCreate中headers一一对应 string
 * @param default 单元格插槽的名称，和YbVXETableCreate中的slots一一对应 string
 */
export class ZlVXETableColumnSlots {
    header?: string; // 表头插槽的名称，和YbVXETableCreate中headers一一对应
    default?: string; // 单元格插槽的名称，和YbVXETableCreate中的slots一一对应
    edit?: string; // 单元格编辑插槽的名称，和YbVXETableCreate中的slots一一对应
    constructor(slots: { [key: string]: any }) {
        for (const key in this) if (slots.hasOwnProperty(key)) this[key] = slots[key];
    }
}

/** zlVXETableHeadersData配置类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param name 字段名 [string]
 * @param value 字段值 [string]
 * @param check 是否选上 [boolean]
 */
export class ZlVXETableHeadersDataCreate {
    name?: string; // 字段名
    value?: string; // 字段值
    check?: boolean; // 是否选上
    constructor(data: { [key: string]: any }) {
        for (const key in this) if (data.hasOwnProperty(key)) this[key] = data[key];
    }
}
/* #endregion */

/* #region ************************************************************* 表格数据 *************************************************************  */
// 搜索
export class ZlVXETableSearch {
    page:number = 1;                       // 页数
    pageSize:number = 10;                  // 每页条数
    [key: string]: any;                     // 其他参数
    constructor(params?: any) {
        for (const key in params) this[key] = params[key];
    }
    getSearch(params: any, isReset?: boolean) {
        for (const key in this) if (key !== 'page' && key !== 'pageSize') delete this[key];
        // 当时重置
        if (isReset) {
            // 先重置删除参数
            for (const key in this) if (key !== 'page' && key !== 'pageSize') delete this[key];
        }
        // 参数赋值
        for (const key in params) this[key] = params[key];
        return this;
    }
}

export class ZlVXETableData<T> {
    tableData: T[] = [];                    // 表格
    searchTable: ZlVXETableSearch;         // 搜索表格
    otherSearch?: { [key: string]: any };     // 搜索其他
    count = 0;                      // 总条数
    constructor() {
        this.searchTable = new ZlVXETableSearch();
    }
    query() { }
}

/* #endregion */

/* #region ************************************************************* 表格功能 *************************************************************  */
// 表头筛选数据
export class vxeTableHeaderSearch {
    [k: string]: vxeTableHeaderSearchItem;
}
export class vxeTableHeaderSearchItem {
    value?: string;
    startTime?: string;
    lastTime?: string;
    minNumber?: number;
    maxNumber?: number;
    checkbox?: string[] = [];
    oldCheck?: string[] = [];
    elTime?: string[] = [];
    sortTop?: boolean;
    sortBottom?: boolean;
    orderBy?: any;
    checkValue?: { [key: string]: any } = {};
    constructor(item: any) {
        for (const key in this) if (item.hasOwnProperty(key)) this[key] = item[key];
    }
}


/* #endregion */
