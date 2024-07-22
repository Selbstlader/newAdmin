<template>
  <div>
    <SearchForm v-show='showSearch' :columns="table.columns" />
  </div>
</template>

<script setup lang="ts">
import SearchForm from '/@/components/SearchForm/index.vue';
// 公用
import { ref, reactive, onMounted, nextTick, onUnmounted, watch, computed, unref, toRefs } from 'vue';
import { VXETable, VxeGridInstance, VxeGridProps, VxeTableEvents, VxeToolbarInstance, VxeGridEvents, VxeButtonEvents, VxeTablePropTypes, VxeTableInstance } from 'vxe-table';
import Sortable from 'sortablejs'; // 拖动三方
// 组件
import { ZlTag } from '@/zlComponents/index'
// 接口
import { ZlVXETableColumn } from './model';
import { vxeTableHeaderSearch, vxeTableHeaderSearchItem } from './model';
import http from '@/api/api'
import * as Api from '@/api'
// 方法
import * as Utils from '@/utils'
// 其它
import useStore from "@/store/store";
import variables from '@/assets/styles/export.module.scss'
import request from '@/utils/request';

const props = defineProps({
  zlvalue: { type: Object, default: {} },                      // 数据
  showTable: { type: Boolean, default: true },                 // 是否显示表格
  showSearch: { type: Boolean, default: true },                // 是否显示搜索区域
  custom: { type: Boolean, default: true },                   // 是否显示列配置图标
  pager: { type: Boolean, default: true, },                    // 是否显示分页器
  tools: { type: Boolean, default: true },                    // 是否显示工具条
  more: { type: Boolean, default: false },                     // 是否显示更多按钮
  export: { type: Boolean, default: false },                    // 显示导出
  import: { type: Boolean, default: false },                     // 显示导入
  exportDisabled: { type: Boolean, default: false },            // 禁用导出
  importDisabled: { type: Boolean, default: false },            // 禁用导出
  pageSize: { type: Array, default: [10, 20, 50, 100], },      // 分页器的初始数据
  highLightFirst: { type: Boolean, default: false },           // 是否进来高亮第一行
  getHeader: { type: Boolean, default: false },                // 是否加载Header
  reset: { type: Boolean, default: false },                    // 是否重置
  refresh: { type: Boolean, default: false },                  // 刷新
  setSearchValue: { type: Object, default: {} },               // 是否修改某个搜索参数
  rowConfig: { type: Object, default: {} },                    // VXE行配置
  columnConfig: { type: Object, default: { resizable: true } },// VXE列配置
  treeConfig: { type: Object, default: {} },                   // VXE树配置
  exportOut: { type: Boolean, default: false },               // 监听导入
  getTableColumns: { type: Boolean, default: true },           // 是否加载的时候读取排序
  merge: { type: Object, defalut: {} },                        // 合并行的配置
  empty: { type: String, default: '暂无数据' },                // 没有数据的文字
  showFooter: { type: Boolean, default: false },               // 显示合计栏
  footerNumber: { type: Number, default: 0 },                  // 合计栏，合计显示在哪一列
  canDrop: { type: Boolean, default: true },                   // 能否拖动列
  canWidth: { type: Boolean, default: true },                  // 能否拖动宽度
  haveMenu: { type: Boolean, default: false },                 // 是否带有menu，左上角的圆角干掉
  mergeCells: { type: Array, default: [] },                    // 合并规则
  tableID: { type: String, default: '' },                      // tableID
  topPosition: { type: Boolean, default: true },               // 是否搜索悬浮
  groupName: { type: String, default: '' },
  allSelect: { type: Boolean, default: false },                 // 多选框是否全选
  showSearchRight: { type: Boolean, default: true },           // 是否显示右边的搜索操作按钮
})
// 表格信息
const table = reactive({
  title: props.zlvalue.title,
  pageSize: props.pageSize as number[],
  tableData: props.zlvalue.tableData,
  columns: props.zlvalue.columns.filter((e: any) => !e.noShow),
  headers: props.zlvalue.headers,
  pageName: props.zlvalue.pageName,
  tableName: props.zlvalue.tableName,
  loading: props.zlvalue.loading,
  editConfig: props.zlvalue.editConfig,
  tableConfigID: 0,
  more: props.zlvalue.more || [],
  userId: 0,
  unfold: false,
  showzlVXETable: true,
  showTable: true,
  search: {
    page: 1,
    pageSize: pageSizeInfo(props.zlvalue.pageName, props.zlvalue.tableName) > 100 ? pageSizeInfo(props.zlvalue.pageName ? props.zlvalue.pageName : '', props.zlvalue.tableName ? props.zlvalue.tableName : '', 10) : pageSizeInfo(props.zlvalue.pageName, props.zlvalue.tableName),
    orderByList: [] as any
  } as any,
  searchs: {} as vxeTableHeaderSearch,
  tableExport: { // 导出配置
    // 默认选中类型
    type: 'xlsx',
    // 自定义类型
    types: ['xlsx', 'csv', 'html', 'xml', 'txt'],
    // types: ['xlsx']
  } as VxeTablePropTypes.ExportConfig,
  mergeCells: computed(() => props.mergeCells) as any,
})
const { search, title, searchs, tableExport, pageSize } = toRefs(table);

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
</script>

<style lang="scss" scoped></style>