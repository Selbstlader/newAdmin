/** zlVXETable类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param badgeData [可选]左上筛选气泡 [Object[]] 
 * @param badgeDataButton [可选]右上待办提醒气泡 [Object[]]
 * @param slots [可选]单元格插槽注册 [string[]]
 * @param editSlots [可选]编辑单元格插槽注册 [string[]]
 * @param headers [可选]表格头插槽配置 [Object[]]
 * @param columns 表格列配置 [zlVXETableColoum[]]
 * @param tableData 表格展示用数据 [Object[]]
 * @param loading 表格loading效果开关 [boolean]
 * @param count 表格总条数 [number] 
 * @param pageName 页面名称,请使用当前文件名 [string]
 * @param tableName 表格名称,请使用当前表格的业务作为表格名 [string]
 * @param searchTable 组件内搜索字段，通过headers等配置,包含page,pageSize,左上、右上气泡的keyWord等   [Object]
 * @param search 自定义搜索字段，通过组件外的搜索 [Object]
 * @param more 右边的三个点的配置文件，当为空时不显示 [string[]]
 * @param getHeader 当表头等需要的Options数据拿到后，改为true，重新渲染header，否则checkbox等需要从字典等拿选项的会默认为空,需默认为false [boolean]
 */
export class YbVXETableCreate {
    badgeData?: any[] | undefined; // 左上筛选气泡
    badgeDataButton?: any[] | undefined; // 右上待办提醒气泡
    slots?: string[]; // 单元格插槽注册
    editSlots?: string[]; // 编辑单元格插槽注册
    editConfig?: any; // 
    headers?: YbVXETableHeadersCreate[]; // 表格头插槽配置
    columns: YbVXETableColumnCreate[] | undefined; //  表格列配置
    tableData: any[] | undefined; // 表格展示用数据
    showTable?: boolean | undefined; // 
    originalData: any[] | undefined; // 原始数据
    loading: boolean | undefined; // 表格loading效果开关
    count: number | undefined; // 总条数
    pageName: string | undefined; // 页面名称
    tableName: string | undefined; // 表格名称
    searchTable: any | undefined; // 组件内搜索字段，通过headers等配置,包含page,pageSize,左上、右上气泡的keyWord等   Object
    search: any | undefined; // 自定义搜索字段，通过组件外的搜索 Object
    more?: string[]; // 右边的三个点的配置文件，当为空时不显示
    getHeader: boolean = false; // 当表头等需要的Options数据拿到后，改为true，重新渲染header，否则checkbox等需要从字典等拿选项的会默认为空
}

/** zlVXETableColoum配置类
 *  @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param field 字段 [string]
 * @param title 字段名 [string]
 * @param visible [可选]是否显示 [boolean]
 * @param minWidth [可选]最小列宽 [string]
 * @param slots  [可选]插槽的配置 [YbVXETableColumnSlotsCreate]
 * @param fixed [可选]是否固定left:左固定,right:右固定 [string]
 * @param editRender [可选]编辑 [string]
 * @param children [可选]子表 [string]
 */
export class YbVXETableColumnCreate {
    field: string | undefined; // 字段
    title: string | undefined; // 字段名
    visible?: boolean; // 是否显示
    minWidth?: string; // 最小列宽
    slots?: YbVXETableColumnSlotsCreate; // 插槽的配置
    fixed?: string; // 是否固定left:左固定,right:右固定 string
    editRender?: Object; // 编辑
    children?: any[]; // 子表
    align?: string = 'left'; // 文字位置
    headerAlign?: string = 'left'; // title文字位置
    footerAlign?: string = 'left'; // 合计文字位置
    params?:any;
    resizable?: boolean ; // 能否拖动
    sum?: boolean; // 是否合计
    treeNode?: boolean; // 树节点
    type?: string; // 类型
    showOverflow?: boolean;
    width?: string; // 宽度
    className?: string;    // columnClassName
    

}

/** zlVXETableHeaders配置类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param field 字段 [string]
 * @param title 字段名 [string]
 * @param slot 在column中slots为header时相对应的名称 [string]
 * @param type input:输入框;time:时间范围选择器;checkbox:多选;range:数字范围; [string]
 * @param search 传给后端的搜索字段: input:字段名;  time:start + 字段名,end + 字段名;  checkbox:字段名 + List;  range:min + 字段名,max + 字段名 [string]
 * @param toArr [可选]当type为checkbox的时候: true 为数组, false 为字符串用','分割 [boolean]
 * @param toNumber [可选]当type为range的时候: true 为数字, false 为字符串 [boolean]
 * @param sort [可选]排序的字段 [string]
 * @param tableName [可选]当开启排序并需要从其他子表的字段进行排序，传入数据库表名 [string]
 */
 export class YbVXETableHeadersCreate {
    field: string | undefined; // 字段
    title: string | undefined; // 字段名
    slot: string | undefined; // 在column中slots为header时相对应的名称
    type: string | undefined; // input:输入框;  time:时间范围选择器;  checkbox:多选;  range:数字范围;
    search: string | undefined; // 传给后端的搜索字段: input:字段名;  time:start + 字段名,end + 字段名;  checkbox:字段名 + List;  range:min + 字段名,max + 字段名
    toArr?: boolean; // 当type为checkbox的时候: true 为数组, false 为字符串用','分割
    toNumber?: boolean; // 当type为range的时候: true 为数字, false 为字符串
    sort?: string; // 排序的字段
    tableName?: string; // 当开启排序并需要从其他子表的字段进行排序，传入数据库表名
    align?: string = 'left'; // 文字位置
    data?: YbVXETableHeadersDataCreate[]; // 当type为checkbox的时候：选择数据的格式
    original?: boolean = false; // 是否保持已原来的数组来重置
    defaultValue?: string; // 默认的填写
    placeholder?: string;
}

/** zlVXETableHeadersData配置类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param name 字段名 [string]
 * @param value 字段值 [string]
 * @param check 是否选上 [boolean]
 */
 export class YbVXETableHeadersDataCreate {
    name: string | undefined; // 字段名
    value: string | undefined; // 字段值
    check: boolean | undefined; // 是否选上
}

/** zlVXETableColoum中slots配置类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param header 表头插槽的名称，和YbVXETableCreate中headers一一对应 string
 * @param default 单元格插槽的名称，和YbVXETableCreate中的slots一一对应 string
 */
 export class YbVXETableColumnSlotsCreate {
    header?: string ; // 表头插槽的名称，和YbVXETableCreate中headers一一对应
    default?: string ; // 单元格插槽的名称，和YbVXETableCreate中的slots一一对应
    edit?: string ; // 单元格编辑插槽的名称，和YbVXETableCreate中的slots一一对应
}




/** column创建时config的类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param visible [可选]是否显示 [boolean]
 * @param minWidth [可选]最小列宽 [string]
 * @param slots  [可选]插槽的配置 [YbVXETableColumnSlotsCreate]
 * @param fixed [可选]是否固定left:左固定,right:右固定 [string]
 */
export class CreateTableColumnConfig { //新加类型 如最小宽度，最大宽度 2022/11/21
    visible?: boolean; // 是否显示
    slots?: YbVXETableColumnSlotsCreate; // 插槽的配置
    fixed?: string; // 是否固定left:左固定,right:右固定 string
    editRender?: Object; // 编辑
    align?: string; // 文字位置
    headerAlign?: string; // title文字位置
    footerAlign?: string; // 合计文字位置
    width?:string;
    minWidth?: string;
    params?: any;
    resizable?: boolean; // 能否拖动
    sum?: boolean; // 是否合计
    treeNode?: boolean; // 树节点
    type?: string; // 类型
    showOverflow?: boolean; 
    className?: string;    // columnClassName
}



/** header创建时config的类
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param toArr [可选]当type为checkbox的时候: true 为数组, false 为字符串用','分割 [boolean]
 * @param toNumber [可选]当type为range的时候: true 为数字, false 为字符串 [boolean]
 * @param sort [可选]是否开启排序 [boolean]
 * @param tableName [可选]当开启排序并需要从其他子表的字段进行排序，传入数据库表名 [string]
 */
export class CreateTableHeadersConfig {
    toArr?: boolean; // 当type为checkbox的时候: true 为数组, false 为字符串用','分割
    toNumber?: boolean; // 当type为range的时候: true 为数字, false 为字符串
    sort?: string; // 排序的字段
    tableName?: string; // 当开启排序并需要从其他子表的字段进行排序，传入数据库表名
    data?: YbVXETableHeadersDataCreate[]; // 当type为checkbox的时候：选择数据的格式
    align?: string = 'left'; // 文字位置
    original?: boolean = false; // 是否保持已原来的数组来重置
    defaultValue?: string; // 默认的填写
    placeholder?: string;
}

