import { CreateTableColumnConfig,YbVXETableColumnCreate,CreateTableHeadersConfig,YbVXETableHeadersCreate} from './model'
export * from './model'

/** column创建
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param field 字段 [string]
 * @param title 字段名 [string]
 * @param minWidth 列最小宽度 [string]
 * @param config 其他配置 [CreateTableColumnConfig]
 */
 export const CreateTableColumn = (field:string,title:string,minWidth:string,config?: CreateTableColumnConfig) => {
    let res: YbVXETableColumnCreate = {
        field: field,
        title: title,
        minWidth: minWidth,
        visible: config?.visible,
        params: config?.params,
        align: config?.align // 文字位置
    }
    if (config?.fixed) res.fixed = config.fixed
    if (config?.slots) res.slots = config.slots
    if (config?.editRender) res.editRender = config.editRender
    if (config?.align) res.align = config.align
    if (config?.headerAlign) res.headerAlign = config.headerAlign
    if (config?.footerAlign) res.footerAlign = config.footerAlign
    if (config?.visible) res.visible = config.visible
    if (config?.params) res.params = config.params
    if (config?.resizable) res.resizable = config.resizable
    if (config?.sum) res.sum = config.sum
    if (config?.treeNode) res.treeNode = config.treeNode
    if (config?.type) res.type = config.type
    if (config?.width) res.width = config.width
    if (config?.hasOwnProperty('showOverflow')) res.showOverflow = config.showOverflow
    if (config?.className) res.className = config.className
    if (config?.width) res.width = config.width
    return res
}


/** headers创建
 * @author CC
 * @DateTime 2022-09-27
 * @version 1.0
 * @param field 字段 [string]
 * @param title 字段名 [string]
 * @param slot 在column中slots为header时相对应的名称 [string]
 * @param type input:输入框;time:时间范围选择器;checkbox:多选;range:数字范围; [string]
 * @param search 传给后端的搜索字段: input:字段名;  time:start + 字段名,end + 字段名;  checkbox:字段名 + List;  range:min + 字段名,max + 字段名 [string]
 * @param config 其他配置 [CreateTableHeadersConfig]
 */
 export const CreateTableHeaders = (field:string,title:string,slot:string,type: string,search: string,config?: CreateTableHeadersConfig) => {
    let res: YbVXETableHeadersCreate = {
        field: field,
        title: title,
        slot: slot,
        type: type,
        search: search
    }
    if (config?.toArr) res.toArr = config.toArr
    if (config?.toNumber) res.toNumber = config.toNumber
    if (config?.sort) res.sort = config.sort
    if (config?.tableName) res.tableName = config.tableName
    if (config?.data) res.data = config.data
    if (config?.align) res.align = config.align
    if (config?.original) res.original = config.original
    if (config?.defaultValue) res.defaultValue = config.defaultValue
    if (config?.placeholder) res.placeholder = config.placeholder

    
    return res
}