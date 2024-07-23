<template>
    <div class="zl_vxe_table" :style="props.haveMenu ? `border-radius: 0 ${variables.mainRadius} ${variables.mainRadius} ${variables.mainRadius}`:''">
        <!-- 是否显示隐藏搜索 -->
        <div class="zl_showTopSearch" @dblclick="changShowTopSearch"></div>
        <!-- 搜索区域 start -->
        <div v-if="table.showTopSearch && props.tools && props.showSearch" class="z_header" :style="props.haveMenu ? `border-radius: 0 ${variables.mainRadius} ${variables.mainRadius} ${variables.mainRadius}`:''" :class="{ z_header_position: props.topPosition && table.unfold }">
            <div class="header_title_box">
                <div class="t_l"><YbTitle>{{ title }}</YbTitle></div>
                <div class="t_r"></div>
            </div>
            <div class="header_tool_box">
                <div class="t_l" :style="table.unfold ? 'height: auto;' : 'overflow: hidden;'">
                    <div class="z_header_input" v-for="(item, index) in table.headers " :key="index">
                        <div v-if="item.type == 'input' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-input style="width: 232.36px;" @keyup.enter="topSearch(false)" v-model="searchs[item.slot].value" :id="props.tableID + item.slot" :placeholder="item.placeholder || '请输入'"/>
                        </div>
                        <div v-else-if="item.type == 'checkbox' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-select multiple collapse-tags v-model="searchs[item.slot].checkbox" style="width: 232.36px;" :id="props.tableID + item.slot"
                                clearable  :placeholder="item.placeholder || '请选择'" min="0">
                                <el-option v-for="(itemOptions, indexOptions) in item.data" :key="indexOptions"
                                    :label="itemOptions.name" :value="itemOptions.name"/>
                            </el-select>
                        </div>
                        <div v-else-if="item.type == 'radio' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-select collapse-tags v-model="searchs[item.slot].value" style="width: auto" :id="props.tableID + item.slot"
                                clearable  :placeholder="item.placeholder || '请选择'" min="0">
                                <el-option v-for="(itemOptions, indexOptions) in item.data" :key="indexOptions"
                                    :label="itemOptions.name" :value="itemOptions.name"/>
                            </el-select>
                        </div>
                        <div v-else-if="item.type == 'time' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.slot"
                                v-model="searchs[item.slot].elTime" type="daterange" value-format="YYYY-MM-DD"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期" size="default" />
                        </div>
                        <div v-else-if="item.type == 'datetime' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px"
                                v-model="searchs[item.slot].elTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" :id="props.tableID + item.slot"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="截止时间" size="default" />
                        </div>
                        <div v-else-if="item.type == 'month' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.slot"
                                v-model="searchs[item.slot].elTime" type="monthrange" value-format="YYYY-MM"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期" size="default" />
                        </div>
                        <div v-else-if="item.type == 'year' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.slot"
                                v-model="searchs[item.slot].value" type="year" value-format="YYYY" size="default" placeholder="请选择"  />
                        </div>
                        <div v-else-if="item.type == 'monthOne' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-date-picker @change="setSearch(item, true)" style="width: 300px" :id="props.tableID + item.slot"
                                v-model="searchs[item.slot].value" type="month" value-format="YYYY-MM" size="default" placeholder="请选择" />
                        </div>
                        <div v-else-if="item.type == 'range' && showTopSearch" class="z_header_input_box">
                            <div class="z_header_input_label">{{ item.title }}:</div>
                            <el-input style="width: 93px;" @keyup.enter="topSearch(false)" :id="props.tableID + item.slot"
                                v-model="searchs[item.slot].minNumber"  :placeholder="item.placeholder || '请输入'"/>
                            <div class="center_content" @click="setMaxNumber(item)">至</div>
                            <el-input style="width: 93px;" @keyup.enter="topSearch(false)" :id="props.tableID + item.slot"
                                v-model="searchs[item.slot].maxNumber"  :placeholder="item.placeholder || '请输入'"/>
                        </div>
                    </div>
                </div>
                <div v-if="props.showSearchRight" class="t_r">
                    <div class="t_r_one"><ZlTag style="margin-right: 12px;" tagType="button" type="search" effect="light" size="small" @click="topSearch(false)">搜索</ZlTag></div>
                    <div class="t_r_one"><ZlTag style=" margin-right: 12px;" tagType="button" type="search" effect="light" size="small" @click="topSearch(true)">重置</ZlTag></div>
                    <div class="t_r_one">
                        <div class="unfold_class" @click="table.unfold = !table.unfold">
                            <span class="searchColor smallFont margin-r6">{{table.unfold ? '收起' : '更多'}}</span>
                            <ArrowUp v-if="table.unfold" style="width: 12px; height: 12px;" :color="variables.primary" />
                            <ArrowDown v-else style="width: 12px; height: 12px;" :color="variables.primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 搜索区域 end -->
        <!-- 工具区域 start -->
        <div v-if="props.tools" class="zl_vxe_top" :class="{zl_vxe_top_position: props.topPosition && table.unfold }">
            <div v-if="props.topPosition && table.unfold" class="zl_vxe_top_cover"></div>
            <div class="zl_top_l">
                <slot name="left-l"></slot>
                <div class="top_l_one" v-if="props.showExport"><ZlTag style="margin-right: 12px;" :disabled="props.disabledExport" tagType="button" type="primary" effect="light" size="default" @click="bindExportTable">导出</ZlTag></div>
                <div v-if="props.custom" class="top_l_one zl_vxe_tools">
                    <vxe-toolbar ref="xToolbar1" :custom="{ icon: '1' }"/>
                    <span class="zl_vxe_tools_content">表格配置</span>
                </div>
                <div v-if="table.badgeData.length > 0" style="display: flex">
                    <div v-for="(item, index) in table.badgeData" :key="item.keyWord">
                        <ZlTag style="margin-right: 12px;" @click="keySearch(item.keyWord, index)"
                            :showValue="item.showValue" :showBadge="item.showBadge" :badgeValue="item.value"
                            :showZero="item.showZero" :select="item.select" :type="item.colorType" tagType="button">{{ item.type }}</ZlTag>
                    </div>
                </div>
                <slot name="left"></slot>
            </div>
            <div class="zl_top_r">
                <slot name="right"></slot>
                <div v-if="table.badgeDataButton.length > 0" style="display: flex">
                    <div v-for="(item, index) in table.badgeDataButton" :key="item.keyWord">
                        <ZlTag style="margin-right: 12px;" @click="buttonClick(item.keyWord, index)"
                            :showValue="item.showValue" :showBadge="item.showBadge" :badgeValue="item.value"
                            effect="light" :showZero="item.showZero" :select="item.select" :type="item.colorType"
                            tagType="button">{{ item.type }}</ZlTag>
                    </div>
                </div>
                <slot name="right-r"></slot>
                <!-- 导入 -->
                <div v-if="props.showImport">
                    <el-tooltip effect="light" content="导入" placement="top">
                        <el-button :style="props.showExport ? 'margin-right: 11.2px;':''" type="info" class="button_class" circle plain @click="importIn"><i class="vxe-icon-upload"></i></el-button>
                    </el-tooltip>
                </div>
                <div v-if="props.custom" :class="props.zlStyle ? 'zl_vxe_tools' : ''">
                    <el-tooltip effect="light" content="表格列设置" placement="top"><div></div></el-tooltip>
                </div>
                <el-popover v-if="props.more || (table.more && table.more?.length > 0)" popper-class="moreClass"
                    placement="bottom" :width="150" trigger="click">
                    <template #reference>
                        <div class="zl_top_r_more_box">
                            <div class="zl_top_r_more">
                                <el-tooltip effect="light" content="更多设置" placement="top">
                                    <svg-icon name="tablemore" style="height:1rem;height:1rem;"/>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                    <div class="more_row"
                        style="width: 100%;height: auto;padding: 3px;box-sizing: border-box;cursor: pointer;"
                        v-for="item in table.more" :key="item" @click="clickMore(item)">{{ item }}</div>
                    <slot name="more"></slot>
                </el-popover>
            </div>
        </div>
        <!-- 工具区域 end -->
        <div class="zl_vxe_bottom" :style="!props.pager?'padding-bottom: 12px;': ''" :class="{zl_vxe_bottom_position: props.topPosition && table.unfold }">
            <div v-if="props.topPosition && table.unfold" class="zl_vxe_bottom_cover"  @click="bindClickTopCover"></div>
            <div v-if="props.showTable && table.showTable" :class="props.zlStyle ? 'table_box zl_vxe' : 'table_box'">
                <vxe-grid ref="xGrid2" :class="props.zlStyle ? 'vxe_table' : ''" height="100%" border='inner'  
                    v-bind="gridOptions2"
                    :loading='table.loading' :empty-text="props.empty"
                    auto-resize show-overflow highlight-hover-row highlight-current-row  

                    :row-config="props.rowConfig" :column-config="props.columnConfig"
                    :show-footer="props.showFooter" :footer-method="footerMethod"
                    :export-config="table.tableExport || []"
                    :span-method="mergeRowMethod"
                    :merge-cells="table.mergeCells && table.mergeCells.length > 0 ? table.mergeCells : undefined"
                    :cell-style="cellStyle"

                    @checkbox-change="changeCurrent" @checkbox-all="changeCurrentAll" @resizable-change="resizableChange"
                    @custom="toolbarCustomEvent" @cell-click="clickRow">
                    <!-- 单元格插槽 -->
                    <template v-for="item, index in props.zlvalue.slots" :key="index"
                        v-slot:[item]="{ row, rowIndex, column }">
                        <slot :name="item" :row="row" :index="rowIndex" :column="column"></slot>
                    </template>

                    <!-- 表头筛选插槽 -->
                    <template v-for="item, index in table.headers" :key="index" v-slot:[item.slot]>
                        <div class="zl_table_title" :class="{start: item.align == 'left' || !item.align, center: item.align == 'center', end: item.align == 'right'}">
                            <div class="flex">
                                {{ item.title }}
                            </div>
                        </div>
                    </template>
                </vxe-grid>
            </div>
            <!-- 分页器 -->
            <div v-if="props.pager" :class="props.zlStyle ? 'zl_pager z_pager' : 'zl_pager'">
                <el-pagination style="margin-right: 7px;" @size-change="sizeChange" @current-change="currentChange" :id="`${props.tableID}pagerID`"
                v-model:currentPage="tablePage" :page-sizes="props.pageSize" :page-size="Number(table.search.pageSize)"
                    :page-count="table.search.getPages" layout="total,sizes, prev, pager, next" :total="count"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
/** #region ********************************************* 引入*************************************************** */
// 公用
import { ref, reactive, onMounted, nextTick, onUnmounted, watch, computed, unref, toRefs } from 'vue';
import { VXETable, VxeGridInstance, VxeGridProps, VxeTableEvents, VxeToolbarInstance, VxeGridEvents,VxeButtonEvents,VxeTablePropTypes, VxeTableInstance } from 'vxe-table';
import Sortable from 'sortablejs'; // 拖动三方
// 组件
import { ZlTag, YbTitle } from '../index'
// 接口
// import { MainHost, CommonHost } from "@/api";
import http from '/@/api/api'
import * as MainApi from '/@/api'
// 方法
import * as Utils from '/@/utils'
// 其它
// import useStore from "@/store";
import variables from '/@/assets/styles/export.module.scss'

/* #endregion */

/* #region ********************************************** 数据准备 ********************************************** */
// 全局变量
// const { user } = useStore()

// 表格基础数据
class searchBaseData { // 搜索
    page: number | undefined;
    pageSize: number | undefined;
    [k: string]: any;
}
class tableBaseDataInner {
    title?: string;                                   // 显示的表名
    tableData: any | undefined;
    columns?: any | undefined;
    headers?: any;
    pageName?: string | undefined;
    tableName?: string | undefined;
    userId?: string | undefined;
    loading?: boolean;
    count?: number | string | undefined;
    badgeData?: any | undefined;
    badgeDataButton?: any | undefined;
    unfold?: boolean;
    tableConfigID?: number;
    tableTopConfigID?: number;
    showTopSearch?: boolean;
    showzlVXETable?: boolean;
    search: searchBaseData | any
    mergeCells: any;
    showTable: boolean | undefined;
    more?: Array<string>;
    editConfig?: any;
    tableExport?: any;
    tableImport?: any;
    getPages?() {
        return this.count && this.search.pageSize ? Math.ceil(Number(this.count) / this.search.pageSize) : 1
    }
}
// 拖动刷新数据
class vxeTableOrder {
    userId: string | undefined;
    tableKey: string | undefined;
    tableConfigValue?: string;
    tableConfigID?: number|string;
}

// 表头筛选数据
class vxeTableHeaderSearchArr {
    [k: string]: any;
}
class vxeTableHeaderSearch {
    value?: string;
    startTime?: string;
    lastTime?: string;
    minNumber?: number;
    maxNumber?: number;
    checkbox?: Array<string>;
    oldCheck?: Array<string>;
    elTime?: Array<string>;
    sortTop?: boolean;
    sortBottom?: boolean;
    orderBy?: any;
    [checkValue: string]: any;
}
/** 传入页面名和表名，查询内存的每页显示条数，传入数字保存每页显示条数
 * @param {string} pn 页面名
 * @param {string} tn 表名
 * @param {number} ps 页的列数：如果没有表名，创建表名字段，不传默认为10
 * @returns {number} 
 */
const pageSizeInfo = (pn: string, tn: string, ps?: number | undefined) => {
    let param: any = Utils.StorageTools.ZlLocalStorageAES_CBC.get('pageSizeInfo') || undefined // 整个缓存对象，先从缓存获取，如果没有为{}空对象
    let tbparam: any = {} // 单个页面
    tbparam[tn] = 10 // 初始化设置pageSize为10
    if (!param) { // 缓存里没有pageSizeInfo，进行初始化
        param = {}
        param[pn] = tbparam // 将页面装入整个缓存的对象里面
        Utils.StorageTools.ZlLocalStorageAES_CBC.set('pageSizeInfo', param)
    } else {
        tbparam = { ...param[pn], ...tbparam } // 将单个页面的pageInfo拿到
        if (!ps && param[pn] && param[pn][tn]) return String(param[pn][tn]) // 不需要设置pageSize的时候，返回获取到的pageSize
        if (ps) tbparam[tn] = ps
        param[pn] = { ...tbparam } // 姜单个页面的pageInfo更新到整个缓存对象里面
        Utils.StorageTools.ZlLocalStorageAES_CBC.set('pageSizeInfo', param)
    }
    return tbparam[tn] // 返回pageSize
}

// 传入
const props = defineProps({
    zlStyle: { type: Boolean, default: true, },                  // 是否使用zl的CSS，默认使用
    zlvalue: { type: Object, default: {} },                      // 数据
    showTable: { type: Boolean, default: true },                 // 是否显示表格
    showSearch: { type: Boolean, default: true },                // 是否显示搜索区域
    custom: { type: Boolean, default: true, },                   // 是否显示列配置图标
    pager: { type: Boolean, default: true, },                    // 是否显示分页器
    tools: { type: Boolean,  default: true },                    // 是否显示工具条
    more: { type: Boolean, default: false },                     // 是否显示更多按钮
    pageSize: { type: Array, default: [10, 20, 50, 100], },      // 分页器的初始数据
    highLightFirst: { type: Boolean, default: false },           // 是否进来高亮第一行
    getHeader: { type: Boolean, default: false },                // 是否加载Header
    reset: { type: Boolean, default: false },                    // 是否重置
    refresh: { type: Boolean, default: false },                  // 刷新
    setSearchValue: { type: Object, default: {} },               // 是否修改某个搜索参数
    rowConfig: { type: Object, default: {} },                    // VXE行配置
    columnConfig: { type: Object, default: { resizable: true } },// VXE列配置
    treeConfig: { type: Object, default: {} },                   // VXE树配置
    showExport: { type: Boolean, default: false },               // 显示导出
    disabledExport: { type: Boolean, default: false },            // 禁用导出
    showImport:{ type: Boolean, default: false },                // 显示导入
    exportOut:  { type: Boolean, default: false },               // 监听导入
    getTableColumns: { type: Boolean, default: true },           // 是否加载的时候读取排序
    merge: { type: Object, defalut: {} },                        // 合并行的配置
    empty:  { type: String, default: '暂无数据' },                // 没有数据的文字
    showFooter: { type: Boolean, default: false },               // 显示合计栏
    footerNumber: { type: Number, default: 0 },                  // 合计栏，合计显示在哪一列
    canDrop: { type: Boolean, default: true },                   // 能否拖动列
    canWidth: { type: Boolean, default: true },                  // 能否拖动宽度
    haveMenu: { type: Boolean, default: false },                 // 是否带有menu，左上角的圆角干掉
    mergeCells: { type: Array, default: [] },                    // 合并规则
    tableID: { type: String, default: '' },                      // tableID
    topPosition: { type: Boolean, default: true },               // 是否搜索悬浮
    groupName: { type: String, default: '' },
    allSelect: { type: Boolean, default: false},                 // 多选框是否全选
    showSearchRight: { type: Boolean, default: true },           // 是否显示右边的搜索操作按钮
})
// 导出
const emit = defineEmits(['getPageInfo', 'changeRow', 'getSearch', 'resetSearch', 'getMore', 'changeCurrent', 'changeCurrentAll', 'badgeButton','import'])

// popover获取动态ref
const Refs: any = {}
const setRef = (el: any, item: any) => {
    if (el) Refs[item.slot] = el
}


// 表格信息
const table = reactive<tableBaseDataInner>({
    title: props.zlvalue.title,
    tableData: props.zlvalue.tableData,
    columns: props.zlvalue.columns,
    headers: props.zlvalue.headers,
    pageName: props.zlvalue.pageName,
    tableName: props.zlvalue.tableName,
    loading: props.zlvalue.loading,
    editConfig: props.zlvalue.editConfig,
    tableConfigID: 0,
    tableTopConfigID: 0,
    more: props.zlvalue.more || [],
    badgeData: props.zlvalue.badgeData || [],
    badgeDataButton: props.zlvalue.badgeDataButton || [],
    userId: undefined,
    unfold: false,
    showTopSearch: true,
    showzlVXETable: true,
    showTable: true,
    search: {
        page: 1,
        pageSize: pageSizeInfo(props.zlvalue.pageName, props.zlvalue.tableName) > 100 ? pageSizeInfo(props.zlvalue.pageName ? props.zlvalue.pageName : '', props.zlvalue.tableName ? props.zlvalue.tableName : '', 10) : pageSizeInfo(props.zlvalue.pageName, props.zlvalue.tableName),
        orderByList: [] as any
    },
    tableExport: { // 导出配置
        // 默认选中类型
        type: 'xlsx',
        // 自定义类型
        types: ['xlsx', 'csv', 'html', 'xml', 'txt'],
        // types: ['xlsx']
    } as VxeTablePropTypes.ExpandConfig,
    mergeCells: computed(() => props.mergeCells) as any,
})
const {  title, } = toRefs(table);

// 页码
const tablePage = ref(1) 

// 默认显示的时间选择的时分秒
const defaultTime: [Date, Date] = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
]
 /* #endregion */

/* #region ********************************************** 初始化 ************************************************ */
// 加载
onMounted(() => {
    if (props.zlvalue.showTable) queryData()
})

// 初始化
const queryData = async () => {
    // table.userId = user.userId + ''
    let headers = props.zlvalue.headers
    let columns = props.zlvalue.columns
    if (props.getTableColumns) {
        // 查询显示的列
        if (props.custom) toVxeTable(table.userId || '', props.zlvalue.pageName + '_' + props.zlvalue.tableName, props.zlvalue.columns).then((value) => {
            columns = value
            setColumnsAndHeaders(columns, headers)
        })
    } else {
        setColumnsAndHeaders(columns, headers)
    }
    
    if (props.highLightFirst) {
        xGrid2.value.setCurrentRow(table.tableData[0]) // 加载高亮第一行
        emit('changeRow', table.tableData[0])
    }
    getHeader();
    
    
}

// 设置columns和headers的值
const setColumnsAndHeaders = (columns: any, headers: any ) => {
    let fieldConfig = Utils.StorageTools.ZlSessionStorageAES_CBC.get('fieldConfig')
    // 拿到字段显示
    if (fieldConfig) {
        columns.forEach((el: any) => { if (fieldConfig.hasOwnProperty(el.field)) el.title = fieldConfig[el.field]})
        headers.forEach((el: any) => { if (fieldConfig.hasOwnProperty(el.field)) el.title = fieldConfig[el.field] })
    }
    table.columns = columns
    table.headers = headers
    gridOptions2.columns = table.columns
}

// 刷新
watch(() => props.refresh, (nl: any, ol: any) => {
    let headers = props.zlvalue.headers
    let columns = props.zlvalue.columns
    setColumnsAndHeaders(columns, headers)
})

// 监听时候加载完header的数据
watch(() => props.getHeader, (nl: any, ol: any) => {
    getHeader()
})

// 监听是否改变搜索的值
watch(() => props.setSearchValue?.set, (nl: any, ol: any) => {
    if (props.setSearchValue.type == 'input' || props.setSearchValue.type == 'monthOne') searchs[props.setSearchValue.slot].value = props.setSearchValue.value
    if (props.setSearchValue.type == 'time'|| props.setSearchValue.type == 'month' || props.setSearchValue.type == 'datetime') searchs[props.setSearchValue.slot].elTime = props.setSearchValue.value
    if (props.setSearchValue.type == 'range') {
        searchs[props.setSearchValue.slot].minNumber = props.setSearchValue.value[0]
        searchs[props.setSearchValue.slot].maxNumber = props.setSearchValue.value[1]
    }
    if (props.setSearchValue.type == 'checkbox') {
        searchs[props.setSearchValue.slot].checkbox = props.setSearchValue.value
        checked.value[props.setSearchValue.slot] = searchs[props.setSearchValue.slot].checkbox.length == props.setSearchValue.value.length;
        indeterminate.value[props.setSearchValue.slot] = searchs[props.setSearchValue.slot].checkbox.length > 0 && searchs[props.setSearchValue.slot].checkbox.length < props.setSearchValue.value.length;
    }
    topSearch(false);
})

// 获取是否loading
watch(() => props.zlvalue.loading, (nl: any, ol: any) => {
    table.loading = props.zlvalue.loading
})

// 监听是否点击了重置
watch(() => props.reset, (nl: any, ol: any) => {
    resetHeaders();
})



// 监听导出
watch(() => props.exportOut,(nl,ol) => {
    let a: any
    exportDataEvent(a)
})
const exportDataEvent: VxeButtonEvents.Click = () => {
    const $table = xGrid2.value
    $table.exportData({ type: 'xlsx' })
}

// 导出点击
const importIn = () => {
    emit('import', true)
}

// header搜索信息
const showTopSearch = ref(false)
let searchs: vxeTableHeaderSearchArr = {};
// 解析Header信息,同时生成search信息
const searchOld = ref({});
// checkbox全部的数量
const checkboxNumber = ref({} as any);
const getHeader = () => {
    if (props.zlvalue.headers && props.zlvalue.headers[0]) {
        props.zlvalue.headers.forEach((item: any) => {
            searchs[item.slot] = reactive<vxeTableHeaderSearch>({
                value: undefined,
                startTime: undefined,
                lastTime: undefined,
                minNumber: undefined,
                maxNumber: undefined,
                elTime: [],
                checkbox: [],
                oldCheck: [],
                checkValue: {},
                sortTop: false,
                sortBottom: false,
                orderBy: {}
            })
            if (item.type == 'checkbox' && item.data && item.data.length > 0) {
                checkboxNumber[item.slot] = item.data.length
                item.data.forEach((itemCheck: any, indexCheck: number) => {
                    if(item.original) { // 判断是否要用最原始的保存备份
                        searchs[item.slot].oldCheck.push(itemCheck.name)// 备份一份，用于重置
                    } else {
                        if (itemCheck.check) searchs[item.slot].oldCheck.push(itemCheck.name) // 备份一份，用于重置
                    }
                    if (itemCheck.check) searchs[item.slot].checkbox.push(itemCheck.name) // 当前选择的项
                    searchs[item.slot].checkValue[itemCheck.name] = itemCheck.value
                })
                checked.value[item.slot] = searchs[item.slot].checkbox.length == item.data.length;
                indeterminate.value[item.slot] = searchs[item.slot].checkbox.length > 0 && searchs[item.slot].checkbox.length < item.data.length;
            }

            // 得到搜素字段
            if (item.type == 'time' || item.type == 'month' || item.type == 'datetime') {
                table.search[item.search.split(',')[0]] = ''
                table.search[item.search.split(',')[1]] = ''
            } else if (item.type == 'checkbox') {
                table.search[item.search] = []
            } else if (item.type == 'range') {
                table.search[item.search.split(',')[0]] = undefined
                table.search[item.search.split(',')[1]] = undefined
            } else if (item.type == 'radio') {
                table.search[item.search] = item.defaultValue
                searchs[item.slot].value = item.defaultValue
            } else if (item.type == 'monthOne') {
                searchs[item.slot].value = ''
            } else {
                table.search[item.search] = ''
                if (item.field == 'groupName' && props.groupName)  {
                    table.search[item.search] = props.groupName 
                    searchs[item.slot].value = props.groupName
                }
            }
            // console.log(item.field, props.groupName)
            searchOld.value = table.search ? JSON.parse(JSON.stringify(table.search)) : {};
        })
        showTopSearch.value = false
        nextTick(() => showTopSearch.value = true)
    }
}



// 监听气泡数据是否有了
watch(() => props.zlvalue.badgeData, (nl: any, ol: any) => {
    if (props.zlvalue.badgeData && props.zlvalue.badgeData.length > 0) {
        table.badgeData = nl || []
        table.badgeData.forEach((el: any) => {
            if (saveBadgeSelect.value) {
                el.select = false
                if ( saveBadgeSelect.value == el.type) el.select = true
            }
        })
        
    }
})

// 监听右上角的处理气泡
watch(() => props.zlvalue.badgeDataButton, (nl: any, ol: any) => {
    if (props.zlvalue.badgeDataButton.length > 0) {
        table.badgeDataButton = nl || []
    }
})


// 监听表格数据
watch(() => props.zlvalue.tableData, (nl: any, ol: any) => {
    table.tableData = nl
    // const $table = xGrid2.value
    // const startTime = Date.now()
    // $table.reloadData(nl).then(() => {
    //     // console.log('ewwrew')
    //                 // VXETable.modal.message({ content: `渲染${nl.length}行，用时 ${Date.now() - startTime}毫秒`, status: 'info' })
    //     table.loading = false
    // })
    gridOptions2.data = nl
})

// 计算总条数
const count = computed(() => {
    return props.zlvalue.count
})

// 复选框是否全选
watch(() => props.allSelect, (nl, ol) => {
    const $table: any = xGrid2.value
    $table.setAllCheckboxRow(nl)
    const records = $table.getCheckboxRecords()
    emit('changeCurrent', records)
})
/* #endregion */

/* #region ********************************************** 表格操作 ********************************************** */
// 导出
const bindExportTable: VxeButtonEvents.Click = () => {
    if (props.disabledExport) return
    const $table = xGrid2.value
    if ($table) {
        $table.openExport({ type: 'xlsx',types: ['xlsx', 'csv', 'html', 'xml', 'txt'],})
    }
}



// 点击More的行
const clickMore = (item: string) => {
    emit('getMore', item)
}

// 点击设置范围至相同
const setMaxNumber = (item: any) => {
    searchs[item.slot].maxNumber = searchs[item.slot].minNumber
}

//  多选
const changeCurrent: VxeTableEvents.CheckboxChange = ({ checked }) => {
    const $table: any = xGrid2.value
    const records = $table.getCheckboxRecords()
    emit('changeCurrent', records)
}
const changeCurrentAll: VxeTableEvents.CheckboxAll = ({ checked }) => {
    const $table: any = xGrid2.value
    const records = $table.getCheckboxRecords()
    emit('changeCurrentAll', records)
}

// 分页 
const sizeChange = (size: number) => {
    table.search.pageSize = pageSizeInfo(table.pageName ? table.pageName : '', table.tableName ? table.tableName : '', size)
    let param = { page: table.search.page, pageSize: size }
    emit('getPageInfo', param);
    topSearch(false, count.value > size * table.search.page);
}
// 翻页
const currentChange = (page: number) => {
    table.search.page = page
    let param = { page: page, pageSize: table.search.pageSize }
    emit('getPageInfo', param);
    topSearch(false, true);
}

// 表格点击
const clickRow: VxeTableEvents.CellMenu = ({ row }) => {
    emit('changeRow', row);
}

// 点击排序
const clickSort = (item: any, type: boolean) => {
    let param = {
        field: item.sort,
        desc: type.toString(),
        tableName: ''
    }
    if (item.tableName) {
        param.tableName = item.tableName
    }

    searchs[item.slot].sortTop = searchs[item.slot].sortTop ? false : !type
    searchs[item.slot].sortBottom = searchs[item.slot].sortBottom ? false : type
    if (searchs[item.slot].sortTop || searchs[item.slot].sortBottom) {
        searchs[item.slot].orderBy = { ...param }
    } else {
        if (table.search.orderByList && table.search.orderByList.length > 0) {
            table.search.orderByList.forEach((itemList: any, indexList: number) => {
                if (itemList.field == item.sort) table.search.orderByList.splice(indexList, 1)
            })
        }
        searchs[item.slot].orderBy = {}
    }
    topSearch(false)
}

// 重置表头选项
const resetHeaders = () => {
    for (let item in searchs) {
        searchs[item].checkbox = [...searchs[item].oldCheck]
        searchs[item].lastTime = ''
        searchs[item].startTime = ''
        searchs[item].value = ''
        searchs[item].minNumber = undefined
        searchs[item].maxNumber = undefined 
        searchs[item].elTime = []
        searchs[item].sortTop = false
        searchs[item].sortBottom = false
        searchs[item].orderBy = {}
        
        if (item == 'groupNameHeader' && props.groupName) searchs[item].value = props.groupName
    }
}

// 重置搜索
const resetSearch = () => {
    // console.log('searchOld',searchOld.value)
    saveBadgeSelect.value = undefined // 重置清空选择
    table.badgeData.forEach((el: any) => el.select = false )
    table.search = searchOld.value ? JSON.parse(JSON.stringify(searchOld.value)) : {};
    table.search.page = 1
    table.search.pageSize = pageSizeInfo(props.zlvalue.pageName, props.zlvalue.tableName) > 100 ? pageSizeInfo(props.zlvalue.pageName ? props.zlvalue.pageName : '', props.zlvalue.tableName ? props.zlvalue.tableName : '', 10) : pageSizeInfo(props.zlvalue.pageName, props.zlvalue.tableName)
    tablePage.value = 1
    emit('resetSearch', true);
    if (table.badgeData && table.badgeData.length > 0) {
        table.badgeData.forEach((item: any) => {
            item.select = false
        })
    }
}

// key搜索
const saveBadgeSelect = ref()
const keySearch = (keyWord: string, index: number) => {
    table.search.keyWord = keyWord
    table.badgeData.forEach((item: any) => {
        item.select = false
    })
    table.badgeData[index].select = true
    saveBadgeSelect.value = table.badgeData[index].type
    topSearch(false);
}

// button气泡点击
const buttonClick = (keyWord: string, index: number) => {
    emit('badgeButton', keyWord)
}

// 点击顶部cover
const bindClickTopCover = () => {
    table.unfold = false
}

//  top搜索
const topSearch = (type: boolean, ispager?: boolean) => {
    if (type) {
        resetSearch();
        resetHeaders();
    } else {
        if (!ispager) {
            table.search.page = 1 // 如果不是分页器，就把页数改为1
            tablePage.value = 1
        }
        table.headers.forEach((item: any) => {
            let param = itemSearch(item, true);
            table.search = getHeaderSearch(param, table.search)
        })
        emit('getSearch', table.search)
    }
    table.unfold = false
}

// 表头搜索
const setSearch = (item: any, type: boolean) => {
    let param = itemSearch(item, type);
    table.search = getHeaderSearch(param, table.search)
    
    topSearch(false);
    if (Refs[item.slot]) unref(Refs[item.slot]).hide() // 关闭popover
}
const itemSearch = (item: any, type: boolean) => {
    let param = {
        title: item.title,
        slot: item.slot,
        field: item.field,
        type: item.type,
        toArr: item.toArr ? true : false,
        toNumber: item.toNumber ? true : false,
        search: item.search,
        value: '',
        orderByList: [] as any
    }
    if (type) {
        if (item.type === 'input') param.value = searchs[item.slot].value ? searchs[item.slot].value : undefined;
        if (item.type === 'radio') param.value = searchs[item.slot].value ? searchs[item.slot].value : undefined;
        if (item.type === 'year') param.value = searchs[item.slot].value ? searchs[item.slot].value : undefined;
        if (item.type === 'monthOne') param.value = searchs[item.slot].value ? searchs[item.slot].value : undefined;

        if (item.type === 'time') {
            if (!searchs[item.slot].elTime) searchs[item.slot].elTime = ['','']
            let eltime = []
            if (searchs[item.slot].elTime[0] && searchs[item.slot].elTime[1]) {
                eltime[0] = searchs[item.slot].elTime[0] + ' 00:00:00'
                eltime[1] = searchs[item.slot].elTime[1] + ' 23:59:59'
            }
            param.value = eltime ? eltime.toString() : '';
        }
        if (item.type === 'datetime') {
            if (!searchs[item.slot].elTime) searchs[item.slot].elTime  = ['','']
            let eltime = []
            if (searchs[item.slot].elTime[0] && searchs[item.slot].elTime[1]) {
                eltime[0] = searchs[item.slot].elTime[0] 
                eltime[1] = searchs[item.slot].elTime[1]
            }
            param.value = eltime ? eltime.toString() : '';
        }
        if (item.type === 'month') {
            if (!searchs[item.slot].elTime) searchs[item.slot].elTime  = ['','']
            let eltime = []
            if (searchs[item.slot].elTime[0] && searchs[item.slot].elTime[1]) {
                eltime[0] = searchs[item.slot].elTime[0]
                eltime[1] = searchs[item.slot].elTime[1] 
            }
            param.value = eltime ? eltime.toString() : '';
        }
        if (item.type === 'range') {
            param.value = (searchs[item.slot].minNumber ? searchs[item.slot].minNumber : item.toNumber ? 0 : '') + ',' + (searchs[item.slot].maxNumber ? searchs[item.slot].maxNumber : item.toNumber ? 0 : '')
        }
        if (item.type === 'checkbox' && searchs[item.slot].checkbox.length > 0) {
            param.value = searchs[item.slot].checkbox.length == checkboxNumber[item.slot] ? '' : searchs[item.slot].checkbox.toString()
        }
        if (searchs[item.slot].orderBy) param.orderByList.push(searchs[item.slot].orderBy)
    } else {
        
        searchs[item.slot].value = ''
        searchs[item.slot].startTime = ''
        searchs[item.slot].lastTime = ''
        searchs[item.slot].minNumber = undefined
        searchs[item.slot].maxNumber = undefined

        searchs[item.slot].elTime = []
        searchs[item.slot].checkbox = [...searchs[item.slot].oldCheck]
        searchs[item.slot].sortTop = false
        searchs[item.slot].sortBottom = false
        searchs[item.slot].orderBy = {}
        if (item.type == 'input') table.search[item.search] = ''
        if (item.type == 'radio') table.search[item.search] = ''
        if (item.type == 'year') table.search[item.search] = '' 
        if (item.type == 'monthOne') table.search[item.search] = '' 

        if (item.type == 'time' || item.type == 'month' || item.type == 'datetime') table.search[item.search] = ''
        if (item.type == 'datetime' || item.type == 'month') table.search[item.search] = ''
        if (item.type == 'range') table.search[item.search] = undefined
        if (item.type == 'checkbox') table.search[item.search] = [...searchs[item.slot].oldCheck]
    }
    return param
}

// checkbox全选按钮
const checked: any = ref({});
const indeterminate: any = ref({});
const handleCheckAllChange = (e: boolean, item: any) => {
    searchs[item.slot].checkbox = []
    if (e) {
        item.data.forEach((itemA: any, indexA: number) => {
            itemA.check = true;
            searchs[item.slot].checkbox.push(itemA.name)
        })
    }
    checked.value[item.slot] = searchs[item.slot].checkbox.length == item.data.length
    indeterminate.value[item.slot] = searchs[item.slot].checkbox.length > 0 && searchs[item.slot].checkbox.length < item.data.length
}
const handleCheckOneChange = (e: any, item: any, itemOne: any) => {
    item.data.forEach((itemA: any) => {
        if (itemA.name == itemOne.name) itemA.check = e
    })
    checked.value[item.slot] = searchs[item.slot].checkbox.length == item.data.length
    indeterminate.value[item.slot] = searchs[item.slot].checkbox.length > 0 && searchs[item.slot].checkbox.length < item.data.length
}



/** 将将表头查询内容解析并传会查询内容
 * 
 * @param 
 * @returns 
 */
const getHeaderSearch = (data: any, search: any) => {
    if (!data && !data.type && !search) return {}
    let s: any = search ? JSON.parse(JSON.stringify(search)) : {}
    if (data.type == 'time' || data.type == 'month' || data.type == 'datetime') {
        let timeName = data.search ? data.search.split(',') : []
        timeName.forEach((item: any, index: number) => {
            s[item] = data.value && data.value.length > 0 ? data.value.split(',')[index] : undefined
        })
    } else if (data.type == 'year') {
        let timeName = data.search ? data.search.split(',') : []
        timeName.forEach((item: any, index: number) => {
            s[item] = data.value && data.value.length > 0 ? data.value + `${index == 0 ? '/01/01 00:00:00':'/12/31 23:59:59'}` : undefined
        })
    } else if (data.type == 'monthOne') {
        s[data.search] = data.value || undefined
    } else if (data.type == 'input') {
        s[data.search] = data.value || undefined
    } else if (data.type == 'radio'){
        s[data.search] = data.value || undefined
    }else if (data.type == 'checkbox') {
        let valuelist = data.value ? data.value.split(',') : []
        let list: any = data.toArr ? valuelist.length == checkboxNumber[data.slot] ? [] : valuelist : data.value
        let search: any = []
        if (list.length > 0) {
            list.forEach((item: any) => {
                search.push(searchs[data.slot].checkValue[item])
            })
        }
        s[data.search] = search.length > 0 ? search : undefined
    } else if (data.type == 'range') {
        s[data.search.split(',')[0]] = data.toNumber ? data.value.split(',')[0] * 1 : data.value.split(',')[0]
        s[data.search.split(',')[1]] = data.toNumber ? data.value.split(',')[1] * 1 : data.value.split(',')[1]
    }

    if (data.orderByList && data.orderByList[0] && data.orderByList[0].field) {
        if (s.orderByList && s.orderByList.length > 0) {
            s.orderByList.forEach((item: any, index: number) => {
                if (item.field == data.orderByList[0].field) {
                    s.orderByList.splice(index, 1)
                }
            })
        }
        let orderByList = [...s.orderByList, ...data.orderByList]

        s.orderByList = orderByList.length > 0 ? orderByList : undefined

    }
    return s
}

/* #endregion */

/* #region ********************************************** 表格绑定 ********************************************** */
const xGrid2 = ref({} as VxeGridInstance)
var xToolbar1 = ref({} as VxeToolbarInstance)

const gridOptions2 = reactive({
    // class: 'vxe_table',
    editConfig: table.editConfig,
    columnConfig: {
        useKey: true,
        resizable: true
    },
    scrollX: {
        enabled: false,
    },
    columns: table.columns,
    data: []
} as VxeGridProps);

let sortable: any;

const columnDrop2 = () => {
    gridOptions2.loading = true
    const $grid = xGrid2.value
    if ($grid) $grid.loadData(table.tableData)
    if (!props.canDrop) return
    sortable = Sortable.create($grid.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
        handle: '.vxe-header--column',
        onEnd: (sortableEvent: any) => {
            const targetThElem = sortableEvent.item
            const newIndex = sortableEvent.newIndex as number
            const oldIndex = sortableEvent.oldIndex as number
            const { fullColumn, tableColumn } = $grid.getTableColumn()
            const wrapperElem = targetThElem.parentNode as HTMLElement
            const newColumn = fullColumn[newIndex]
            if (newColumn.fixed) {
                // 错误的移动
                const oldThElem = wrapperElem.children[oldIndex] as HTMLElement
                if (newIndex > oldIndex) {
                    wrapperElem.insertBefore(targetThElem, oldThElem)
                } else {
                    wrapperElem.insertBefore(targetThElem, oldThElem ? oldThElem.nextElementSibling : oldThElem)
                }
                VXETable.modal.message({ content: '固定列不允许拖动！', status: 'error' })
                return
            }
            // 获取列索引 columnIndex > fullColumn
            const oldColumnIndex = $grid.getColumnIndex(tableColumn[oldIndex])
            const newColumnIndex = $grid.getColumnIndex(tableColumn[newIndex])
            // 移动到目标列
            const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
            fullColumn.splice(newColumnIndex, 0, currRow)
            $grid.loadColumn(fullColumn)
            // console.log('fullcolum', fullColumn)
            toVxeTable(table.userId || '', table.pageName + '_' + table.tableName, table.columns, fullColumn).then((value) => {
                
                gridOptions2.columns = value
                
                table.showTable = false
                bindClear()
                nextTick(() => {
                    table.showTable = true
                    bindTable()
                })
                queryData()
                
            })
        }
    })
}

let initTime: any
nextTick(() => {
    bindTable()
})

const bindTable = () => {
    // 加载完成之后在绑定拖动事件
    initTime = setTimeout(() => {
        columnDrop2()
    }, 500)
    // 将表格和工具栏进行关联
    setTimeout(() => {
        const $table = xGrid2.value
        if (props.tools && props.custom) {
            let $toolbar = xToolbar1.value
            // 判断为空不
            if($toolbar)$table.connect($toolbar)
            // $table.connect($toolbar)
        }
    }, 500);
}

onUnmounted(() => {
    bindClear()
})

const bindClear = () => {
    clearTimeout(initTime)
    if (sortable) {
        sortable.destroy()
    }
}

/* #endregion */

/* #region ********************************************** 表格组件配置 ******************************************* */
// 点击切换是否显示顶部搜索栏
const changShowTopSearch = () => {
    return
    let type = table.showTopSearch ? '不显示' : '显示'
    toShowTopSearch(table.userId || '', props.zlvalue.pageName + '_' + props.zlvalue.tableName, type).then((value: boolean) => {
        table.showTopSearch = value
    })
}

// 选择显示列
const toolbarCustomEvent: VxeTableEvents.Custom = (params) => {
    const $table = xGrid2.value
    const visibleColumn = $table.getColumns()
    switch (params.type) {
        case 'confirm': {
            toVxeTable(table.userId || '', table.pageName + '_' + table.tableName, table.columns, visibleColumn).then((value) => {
                gridOptions2.columns = value
            })
            break
        }
        case 'reset': {
            toVxeTable(table.userId || '', table.pageName + '_' + table.tableName, table.columns, table.columns, true).then((value) => {
                gridOptions2.columns = value
            })
            break
        }
        case 'close': {
            break
        }
    }
}
// 列宽拖动监听
const resizableChange =(e: any) => {
    const $table = xGrid2.value
    const visibleColumn = $table.getColumns()
    visibleColumn[e.columnIndex].width = e.resizeWidth
    if (!props.canWidth) return
    toVxeTable(table.userId || '', table.pageName + '_' + table.tableName, table.columns, visibleColumn).then((value) => {
        gridOptions2.columns = value
    })
}

// 上传列改变
const toVxeTable = async (userid: string, ptName: string, odata: Array<any>, data?: Array<any>, rest?: boolean) => {
    // if (!props.custom) return // 不显示表格配置的时候
    let param: vxeTableOrder = {
        tableConfigID: table.tableConfigID,
        userId: userid,
        tableKey: ptName,
        tableConfigValue: ''
    }
    let list: any = []
    if (data && data.length > 0) {
        data.forEach((item: any) => {
            if (rest) item.visible = true
            if (item.visible && item.tilte !='操作') list.push({title: item.title,width: item.width})
        })
    }
    param.tableConfigValue = list.length > 0 ? JSON.stringify(list) : ''
    if(rest) param.tableConfigValue = JSON.stringify([])
    if (param.tableConfigValue) await PostSaveTableConfig(param);
    const res:any = await PostQueryTableConfig(param);
    if (res.code == 1) {
        let arr = res.data && res.data.length > 0 ? JSON.parse(res.data[0]?.tableConfigValue) : []
        table.tableConfigID = (res.data && res.data[0] ? res.data[0] : {}).tableConfigID
        
        if (!arr || arr.length == 0) return odata
        let oarr = JSON.parse(JSON.stringify(odata))
        let columns: any = []
        arr.forEach((itemR: any) => {
            oarr.forEach((itemO: any, indexO: number) => {
                if (itemR.title === itemO.title) {
                    itemO.visible = true
                    if (itemR.width) itemO.width = itemR.width
                    if (itemO.field == 'showType') itemO.width = '10'
                    // if (itemO.title == '内容') itemO.width = '800'
                    columns.push(itemO)
                    oarr.splice(indexO, 1)
                }
            })
        })
        oarr.forEach((itemL: any) => {
            itemL.visible = false
            if(itemL.title=='操作') itemL.visible = true // 当标题为操作的时候，固定打开为true
            if (itemL.title == '') itemL.visible = true
            columns.push(itemL)
        })
        return columns
    } else {
        return odata
    }
}

// 获取/上传是否显示顶部搜索栏
const toShowTopSearch = async (userid: string, ptName: string, type?: string) => {
    let param: vxeTableOrder = {
        tableConfigID: table.tableTopConfigID,
        userId: userid,
        tableKey: ptName + '_top',
        tableConfigValue: type ? type : ''
    }
    if (type) await PostSaveTableConfig(param);
    const res = await PostQueryTableConfig(param);
    return true
    // if (res.code == 1) {
    //     table.tableTopConfigID = (res.data && res.data[0] ? res.data[0] : {}).tableConfigID
    //     let raw = res.data && res.data[0] ? res.data[0] : {}
    //     if (raw && raw.value && raw.value == '不显示') return false
    //     return true
    // } else {
    //     return true
    // }
}

// 保存vxeTable顺序
const PostSaveTableConfig = (param: vxeTableOrder) => {
        
    if (param.tableConfigID) {
        param.tableConfigID = param.tableConfigID?.toString()
        param.userId = param.userId?.toString()
        return http.request({ url: import.meta.env.VITE_APP_BASE_API  + 'tableconfig/update', method: 'post', data: param })
    } else {
        param.tableConfigID = ''
        param.userId = param.userId?.toString()
        return http.request({ url: import.meta.env.VITE_APP_BASE_API + 'tableconfig/insert', method: 'post', data: param })
    }
}

// 查询vxeTable顺序
const PostQueryTableConfig = (param: vxeTableOrder) => {
    return http.request({ url: import.meta.env.VITE_APP_BASE_API  + `/dev-api/tableconfig/query/config?userId=${param.userId}&tableKey=${param.tableKey}`, method: 'get' })
}
/* #endregion */

/* #region ********************************************** 合并行 ************************************************ */
const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({ row, _rowIndex, column, visibleData }) => {
    // console.log('row', _rowIndex)
    // const fields = ['key']
    if (props.mergeCells && props.mergeCells.length > 0) return
    if (props.merge?.fileds?.length == 0) return
        let fields = props.merge?.fileds || []
        let key = props.merge?.key
        const cellValue = row[column.field]
        if (cellValue && fields.includes(column.field)) {
            const prevRow = visibleData[_rowIndex - 1]
            let nextRow = visibleData[_rowIndex + 1]
            if (prevRow && prevRow[column.field] === cellValue && row[key] == prevRow[key]) {
                return { rowspan: 0, colspan: 0 }
            } else {
                let countRowspan = 1
                while (nextRow && nextRow[column.field] === cellValue && row[key] == nextRow[key]) {
                nextRow = visibleData[++countRowspan + _rowIndex]
                }
                if (countRowspan > 1) {
                    // mergeRowCell.value.push({row: _rowIndex,col: column.colSpan,  rowspan: countRowspan, colspan: 1})
                    
                    return { rowspan: countRowspan, colspan: 1 }
                }
            }
        }
}   
/* #endregion */

/* #region ********************************************** 合计 ************************************************** */
const footerMethod: VxeTablePropTypes.FooterMethod = ({ columns, data }) => {
    const sums: any[] = []
    columns.forEach((column, columnIndex) => {
    if (columnIndex === props.footerNumber) {
        sums.push('表内合计')
    } else {
        let columns = JSON.parse(JSON.stringify(props.zlvalue.columns))
        sums.push('')
        if (columns.length > 0) {
        columns.forEach((item: any) => {
            if (item.field == column.field && item.sum) sums[columnIndex] = sumNum(data, column.field)
        })
        }
        
    }
    })
    // 返回一个二维数组的表尾合计
    return [sums]
}
// 平均的方法
const meanNum = (list: any[], field: string) => {
    let count = 0
    list.forEach(item => {
    count += Number(item[field])
    })
    return count / list.length
}
//合计的方法
const sumNum = (list: any[], field: string) => {
    let count = 0
    list.forEach(item => {
    count += Number(item[field] || 0)
    })
    return count.toFixed(2)
}
/* #endregion */

/* #region ********************************************** 表内单元格样式 ***************************************** */
const cellStyle: VxeTablePropTypes.CellStyle = ({ row, column }) => {
    if (column.params?.background) {
        let css = {
            backgroundColor: column.params.background[row[column.field]],
            borderRadius: '10px 0 0 10px',
            border: `2px solid ${variables.cardBg}`
        }

        return css
    }
}
/* #endregion */

//使用此属性导出实例方法
defineExpose({
    resetSearch
});

</script>

<style lang="scss" scoped>
.zl_vxe_table {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: $mainRadius;
    position: relative;
    // margin-top: 1rem;
    // background: $formBodyBg;
/* #region ********************************************** 搜索区域样式 ***************************************** */
    // 是否显示隐藏搜索
    .zl_showTopSearch {
        height: 15px;
        width: 15px;
        border-radius: 0 $mainRadius 0 $mainRadius;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;

        &:hover {
            background-color: $menuHover;
        }
    }
    .z_header {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: $mainPadding;
        border-radius: 10px;
        background: $tableBg;
        box-sizing: border-box;
        .header_title_box {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .header_tool_box {
            width: 100%;
            margin-top: $mainPadding;
            display: flex;
            justify-content: space-between;
            .t_l {
                height: 40px;
                width: 0;
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                .z_header_input {
                    display: flex;
                    margin-right: 12px;
                    margin-bottom: 6px;

                    .z_header_input_box {
                        height: 100%;
                        width: fit-content;
                        display: flex;
                        align-items: center;
                        .z_header_input_label {
                            width: 100px;
                            display: flex;
                            margin-right: $smallPadding;
                            align-items: center;
                            justify-content: end;
                            color: $mainFontColor;
                            // text-justify: distribute-all-lines;
                            // text-align-last: justify;
                        }

                        .center_content {
                            height: 100%;
                            display: flex;
                            align-items: center;
                            padding: 0 6px;
                            color: $cjFontColor;

                            &:hover {
                                cursor: pointer;
                                color: #5faeff;
                            }
                        }
                    }

                }

            }
            .t_r {
                margin-left: $mainPadding;
                display: flex;
                align-items: flex-start;
                justify-content: flex-end;
                .t_r_one {
                    text-align: right;
                    display: flex;
                    align-items: center;
                    height: 32px;
                }
                .unfold_class {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
            }
        }  
    }
    // 搜索展开
    .z_header_position {
        position: absolute;
        top: 0;
        left: 0;
        border-bottom: none;
        border-radius: 10px;
        z-index: 999;
    }
/* #endregion */

/* #region ********************************************** 工具栏 ***************************************** */
.zl_vxe_top {
    padding: $mainPadding;
    margin-top: $mainPadding;
    border-radius: $mainRadius $mainRadius 0 0;
    background: $tableBg;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .zl_top_l {
        display: flex;
        .top_l_one {
            text-align: right;
            display: flex;
            align-items: center;
            height: 32px;
        }
    }

    .zl_top_r {
        margin-left: 0.75rem;
        min-width: 7.1875rem;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        
        .vxe-toolbar {
            height: auto;

        }
        .zl_top_r_more_box {
            width: 36px;
            height: 36px;
            // padding: 0 12px;
            // margin-left: 12px;
            box-sizing: border-box;
            .zl_top_r_more {
                height: 36px;
                width: 36px;
                background: #3370ff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    background: $menuHover;
                    cursor: pointer;
                }
            }
        }
        



    }
}

// 功能区
.zl_vxe_tools {
    position: relative;
    .zl_vxe_tools_content {
        position: absolute;
        left: 24px;
        top: 8px;
        pointer-events: none;
        color: #FFFFFF;
        font-size: 14px;
    }
    :deep(.el-tooltip__trigger) {
        padding: 0 !important;
    }
    :deep(.vxe-button.type--button.is--circle) {
        border-radius: 5px !important;
        height: 36px !important;
        background: #3370ff !important;
        width: 86px !important;
        &:hover {
            background: #3375b9 !important;
        }
    }
    :deep(.vxe-custom--option-wrapper) {
        z-index: 10000 !important;
    }
    
}
.zl_vxe_top_position {
    margin-top: 122.39px;
    position: relative;
}
.zl_vxe_top_cover {
    width: 100%;
    height: 100%;
    z-index: 500;
    position: absolute;
    top:0;
    left: 0;
    background: #FFF;
}
/* #endregion */

/* #region ********************************************** 表格区域样式 ***************************************** */
.zl_vxe_bottom {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 $mainPadding;
    box-sizing: border-box;
    background: $tableBg;
    border-radius: 0 0 $mainRadius $mainRadius;
    .table_box {
        flex-grow: 1;
        height: 0;

        .zl_table_title {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
        }
    }
    .zl_pager {
        // flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        padding: $smallPadding 0;
        box-sizing: border-box;
        width: 100%;

        .el-pagination {
            margin-right: 0 !important;
            padding: 0;
        }
    }
}

.zl_vxe_bottom_position {
    position: relative;
}
.zl_vxe_bottom_cover {
    width: 100%;
    height: 100%;
    z-index: 500;
    position: absolute;
    top:0;
    left: 0;
    background: #FFF;
    border-radius: 0 0 $mainRadius $mainRadius;
}
/* #endregion */

/* #region ********************************************** 搜索区域样式 ***************************************** */
// input框样式
:deep(.el-input__wrapper) {
    background: $inputBg;
    border: $inputBorder;
    box-shadow: none;
    height: 36px;
    .el-input__inner {
        color: $mainFontColor;
    }
}

// input hover
:deep(.el-input__wrapper:hover) {
    background: $inputBg;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

// tabel header
:deep(.vxe-table--header) {
    background: $tableHeaderBg !important;
}
    

// 如果有footer的border
:deep(.body--wrapper) {
    border: none !important;
}
:deep(.vxe-table--footer) {
    background: $tableBg !important;
    border-top: #DCDCDC !important;
}
// 导入如果有footer
:deep(.fixed-left--wrapper) {
    border: none !important;
}
:deep(.fixed-right--wrapper) {
    border: none !important;
}
    //  header title字体
    :deep(.vxe-modal--header-title) {
        background: $tableHeaderBg !important;
        color: $mainFontColor;
        border: none;
    }
    :deep(.vxe-modal--header-right) {
        background: $tableHeaderBg;
    }
    :deep(.vxe-input.type--text.is--controls.is--suffix) {
        border: #DCDCDC!important;
        border-radius: 4px !important;
    }
    :deep(.vxe-input--inner) {
        background: $inputBg;
        color: $mainFontColor !important;
    }
    :deep(.vxe-input--inner::placeholder) {
        color: $labelFontColor !important;
    }
    :deep(.vxe-modal--wrapper .vxe-modal--box) {
        background: $formBodyBg !important;
    }
    :deep(.vxe-export--panel .vxe-export--panel-column .vxe-export--panel-column-header) {
        background: $formBodyBg !important;
    }
    
// 加载样式
:deep(.vxe-loading) {
    background: $menuHover !important;
}
    
// 导出样式
:deep(.vxe-modal--wrapper .vxe-modal--box) {
    border: none !important;
}
:deep(.vxe-modal--wrapper .vxe-modal--header) {
    border-bottom: #D8D8D8;
}
:deep(.vxe-input--inner) {
    border: none !important;
}
:deep(.vxe-export--panel .vxe-export--panel-column) {
    border: #D8D8D8;
}
:deep(.vxe-export--panel .vxe-export--panel-column .vxe-export--panel-column-header) {
    border-bottom: #D8D8D8;
}
    
//外层边框
.vxe-table--render-default .vxe-table--border-line {
    border: #DCDCDC !important;
}

// 行下方border
.vxe-table--render-default.border--default .vxe-body--column,
.vxe-table--render-default.border--default .vxe-footer--column,
.vxe-table--render-default.border--default .vxe-header--column,
.vxe-table--render-default.border--inner .vxe-body--column,
.vxe-table--render-default.border--inner .vxe-footer--column,
.vxe-table--render-default.border--inner .vxe-header--column {
    background-image: none;
    border-bottom: #D8D8D8;
}
    

    .el-button--info.is-plain {
        background: #3370ff !important;
        // border: 1px solid #3370ff !important;
        color: $mainFontColor;
    }

    .el-form-item__label {
        color: $mainFontColor;
    }

    

    

    .el-button--info.is-plain {
        background: $tableBg;
        border: none;
        width: 36px;
    }

    .el-button--info.is-plain:hover {
        background: $menuHover;
    }
    
    :deep(.vxe-table--render-default .vxe-table--body-wrapper table) {
        background: none !important;
    }

    :deep(.el-range-editor.el-input__inner) {
        background: $tableBg;
        border: none;
        box-shadow: none;

        .el-range-separator {
            color: $cjFontColor;
        }

        .el-range-input {
            color: $mainFontColor;
        }

    }
    :deep(.el-input__inner::placeholder) {
                color: $labelFontColor;
            }

    

    

    
    
    .button_class {
        display: flex;
        height: 36px;
        width: 36px;
        align-items: center;
        color: #99b8ff !important;
        &:hover {
            color: #5faeff !important;
        }
    }
    
}

//更多按钮
.moreClass {
    .more_row {
        width: 100%;
        height: auto;
        padding: 3px;
        box-sizing: border-box;
        color: $mainFontColor;

        &:hover {
            cursor: pointer;
            background: $menuHover;
            color: #5da9f7;
            border-radius: 3px;
        }
    }
}

// 圆形按钮
:deep(.vxe-button.type--button.is--circle) {
    min-width: 32px;
    width: 32px;
    min-height: 32px;
    height: 32px;
    border: none;

    &:hover {
        background: $menuHover;
    }
}

// 页面内所有时间居中的地方
.nextDateTiemCenter{
    width:115px;
    max-width: 115px;
    display: flex;
}

.start {
    justify-content: start;
}
.center {
    justify-content: center;
}
.end {
    justify-content: end;
}

:deep(.zl_vxe .vxe-table--render-default .vxe-cell) {
    font-size: 14px !important;
}

:deep(.el-select__wrapper) {
    background: $inputBg !important;
    box-shadow: none;
    
}
:deep(.el-select__wrapper.is-disabled) {
        background: $inputDisabled!important;
    }
</style>
