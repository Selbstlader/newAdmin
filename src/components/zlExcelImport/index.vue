<template>
  <div class="zlImport" v-if="props.zlvalue.dialogVisible">
    <el-dialog v-model="props.zlvalue.dialogVisible" destroy-on-close :title="props.zlvalue.title"
      :close-on-click-modal="false" :before-close="closeDialog" :width="props.width">
      <!-- 表单数据 -->
      <div class="zlImport_body_boxzong">
        <!-- body区域 -->
        <div class="z-tablecalIns">
          <!-- <slot name="importTable"></slot> -->
          <YbVXETable :zlvalue="dataAll" :pager="false" :tools="true" :custom="false" :showTable="showTable"
            :showFooter="props.showFooter" :canDrop="false" :canWidth="false" :showSearch="props.showSearch"
            @getSearch="bindCarInsuranceGetSearch" @resetSearch="bindCarInsuranceResetSearch">
            <template #left>
              <div v-if="!state.buttonType" class="checkData_box">
                <div v-if="props.errCount" class="checkData_row">
                  <WarningFilled style="height: 20px;width: 20px;margin-right: 6px;" color="#f56c6c" />
                  <span style="color: #f56c6c;font-weight: 700;font-size: 16px;">部分效验失败</span>
                  <span class="cjColor" style="margin-left: 6px">共 <span class="primaryColor">{{
                    props.zlvalue.tableData.tableData.length }}</span> 条数据, <span class="dangerColor">{{
                        props.errCount }}</span> 条效验失败, <span class="warningColor">{{ props.warningCount }}</span>
                    条重复数据。请根据错误信息修改下表后点击</span>
                  <el-tooltip effect="light" v-if="!state.buttonType"
                    :content="`${props.zlvalue.title.includes('导入') ? props.zlvalue.title.split('导入')[0] : ''}再次效验`"
                    placement="top">
                    <ZlTag style="margin: 0 6px;" icon effect="light" type="warning" size="small" tagType="button"
                      @click="bindReValidation" class="iconfont"> &#xe702;<span class="buttonleftmargin">再次效验</span>
                    </ZlTag>
                  </el-tooltip>
                  <span class="cjColor">或</span>
                  <el-tooltip effect="light" v-if="!state.buttonType"
                    :content="`${props.zlvalue.title.includes('导入') ? props.zlvalue.title.split('导入')[0] : ''}下载错误数据`"
                    placement="top">
                    <ZlTag style="margin: 0 6px;" icon effect="light" type="primary" size="small" tagType="button"
                      @click="bindExportDataError">
                      <Download style="height: 16px;width: 16px;margin-right: 6px;" />下载错误数据
                    </ZlTag>
                  </el-tooltip>
                  <span class="cjColor">。点击右下保存按钮将提交正确数据。</span>
                </div>
                <div v-else class="checkData_row">
                  <SuccessFilled style="height: 20px;width: 20px;margin-right: 6px;" color="#67c23a" />
                  <span style="color: #67c23a;font-weight: 700;font-size: 16px;">效验成功</span>
                  <span class="cjColor" style="margin-left: 6px">共 <span class="primaryColor">{{
                    props.zlvalue.tableData.tableData.length }}</span> 条数据, <span class="successColor">{{
                        props.zlvalue.tableData.tableData.length }}</span> 条效验成功, <span class="warningColor">{{
                        props.warningCount }}</span> 条重复数据。点击右下保存按钮将提交正确数据。</span>
                  <el-tooltip effect="light" v-if="!state.buttonType"
                    :content="`${props.zlvalue.title.includes('导入') ? props.zlvalue.title.split('导入')[0] : ''}再次效验`"
                    placement="top">
                    <ZlTag style="margin: 0 6px;" icon effect="light" type="warning" size="small" tagType="button"
                      @click="bindReValidation" class="iconfont"> &#xe702;<span class="buttonleftmargin">再次效验</span>
                    </ZlTag>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <template #right-r>
              <el-tooltip v-if="state.buttonType" effect="light"
                :content="`${props.zlvalue.title.includes('导入') ? props.zlvalue.title.split('导入')[0] : ''}模板下载`"
                placement="top">
                <el-link target="_blank" :href="`/web/static/files/${props.fileName}`" :download="`${props.fileName}`"
                  :underline="false" style="margin-left:0px">
                  <ZlTag icon effect="light" type="primary" tagType="button" style="margin-right:12px;">
                    <Download style="height: 16px;width: 16px;margin-right: 6px;" />模板下载
                  </ZlTag>
                </el-link>
              </el-tooltip>
              <el-tooltip v-if="state.buttonType" effect="light"
                :content="`${props.zlvalue.title.includes('导入') ? props.zlvalue.title.split('导入')[0] : ''}导入`"
                placement="top">
                <el-upload class="upload-demo" action="#"
                  :http-request="(files: any) => before_avatar_success(files, 'one')" :limit="3" :auto-upload="true">

                  <ZlTag icon effect="light" type="primary" tagType="button" class="iconfont"><el-icon
                      style="margin-right: 6px;">
                      <Upload />
                    </el-icon><span class="buttonleftmargin">导入</span>
                  </ZlTag>
                </el-upload>
              </el-tooltip>
              <el-tooltip effect="light" v-if="!state.buttonType"
                :content="`${props.zlvalue.title.includes('导入') ? props.zlvalue.title.split('导入')[0] : ''}全部导出`"
                placement="top">
                <ZlTag icon effect="light" type="primary" tagType="button" @click="bindExportDataAll">
                  <Download style="height: 16px;width: 16px;margin-right: 6px;" />全部导出
                </ZlTag>
              </el-tooltip>


            </template>
            <template #serialNo="{ row }">
              <div class="tableCellLeft">
                <div v-if="row.errormsg" class="zlExcelImportTrColor">
                  <div class="zlExcelImportTrColorDiv1">{{ '0' }}</div>
                  <el-tooltip effect="light" :content="row.serialNo" placement="top">
                    <div class="zlExcelImportTrColorDiv2">{{ row.serialNo }} </div>
                  </el-tooltip>
                </div>
                <div v-else-if="row.warningmsg" class="zlExcelImportTrColorWarning">
                  <div class="zlExcelImportTrColorDivWarning1">{{ '0' }}</div>
                  <el-tooltip effect="light" :content="row.serialNo" placement="top">
                    <div class="zlExcelImportTrColorDivWarning2">{{ row.serialNo }} </div>
                  </el-tooltip>
                </div>
                <div v-else>
                  <div>{{ row.serialNo }} </div>
                </div>
              </div>
            </template>
            <template v-for="editItem, editIndex in edits" :key="editItem.field"
              v-slot:[editItem.field]="{ row, index, column }">
              <div
                :class="{ tableCellLeft: !editItem.align && editItem.align == 'left', tableCellRight: editItem.align && editItem.align == 'right', tableCellCenter: editItem.align && editItem.align == 'center' }">
                <!-- input -->
                <div v-if="editItem.type == 'input'">
                  <el-input v-show="row[editItem.field + 'Show']" :id="`${editItem.field}${index}`"
                    v-model="row[editItem.field]" @blur="changeBulletinInput(row, index, false, editItem.field)"
                    :disabled="false" placeholder="请输入"/>
                  <span v-show="!row[editItem.field + 'Show']"
                    :class="{ mainFont: row[editItem.field], mainColor: true, noneClass: !row[editItem.field] }"
                    @click="changeBulletinInput(row, index, true, editItem.field)">{{ row[editItem.field] || '点击输入'
                    }}</span>
                </div>
                <!-- nubmer -->
                <div v-if="editItem.type == 'number'">
                  <el-input v-show="row[editItem.field + 'Show']" :id="`${editItem.field}${index}`"
                    v-model="row[editItem.field]" @blur="changeBulletinInput(row, index, false, editItem.field)"
                    :disabled="false" placeholder="请输入" type="number"/>
                  <span v-show="!row[editItem.field + 'Show']"
                    :class="{ mainFont: row[editItem.field], mainColor: true, noneClass: !row[editItem.field] }"
                    @click="changeBulletinInput(row, index, true, editItem.field)">{{ row[editItem.field] || '点击输入'
                    }}</span>
                </div>
                <!-- select -->
                <div v-if="editItem.type == 'select'">
                  <el-select v-show="row[editItem.field + 'Show']" :id="`${editItem.field}${index}`"
                    v-model="row[editItem.field]" placeholder="请选择"
                    @change="changeBulletinInput(row, index, false, editItem.field)" style="width:80px"
                    :clearable="editItem.hasOwnProperty('clearable') ? editItem.clearable : true"
                    :filterable="editItem.hasOwnProperty('filterable') ? editItem.filterable : true"
                    default-first-option>
                    <el-option v-for="itemSelect in state.options[editItem.field]" :value="itemSelect.value"
                      :label="itemSelect.label"/>
                  </el-select>
                  <span v-show="!row[editItem.field + 'Show']"
                    :class="{ mainFont: row[editItem.field], mainColor: true, noneClass: !row[editItem.field] }"
                    @click="changeBulletinInput(row, index, true, editItem.field)">{{ row[editItem.field] || '点击选择'
                    }}</span>
                </div>
                <!-- date -->
                <div v-if="editItem.type == 'date'">
                  <div v-show="row[editItem.field + 'Show']">
                    <el-date-picker :ref="(e: any) => setDateRef(e, index, editItem.field)"
                      :id="`${editItem.field}${index}`" style="width: 100%;"
                      @blur="changeBulletinInput(row, index, false, editItem.field)" value-format="YYYY/MM/DD"
                      v-model="row[editItem.field]" type="date" placeholder="请选择"
                      @visible-change="(visibility: boolean) => changeBulletinInput(row, index, visibility, editItem.field)" />
                  </div>
                  <span v-show="!row[editItem.field + 'Show']"
                    :class="{ mainFont: row[editItem.field], mainColor: true, noneClass: !row[editItem.field] }"
                    @click="changeBulletinInput(row, index, true, editItem.field, editItem.type)">{{ row[editItem.field]
                      ||
                    '点击选择'}}</span>
                </div>
                <!-- datetime -->
                <div v-if="editItem.type == 'datetime'">
                  <div v-show="row[editItem.field + 'Show']">
                    <el-date-picker :ref="(e: any) => setDateRef(e, index, editItem.field)"
                      :id="`${editItem.field}${index}`" style="width: 100%;"
                      @blur="changeBulletinInput(row, index, false, editItem.field)" value-format="YYYY/MM/DD HH:mm:ss"
                      v-model="row[editItem.field]" type="datetime" placeholder="请选择"
                      @visible-change="(visibility: boolean) => changeBulletinInput(row, index, visibility, editItem.field)" />
                  </div>
                  <span v-show="!row[editItem.field + 'Show']"
                    :class="{ mainFont: row[editItem.field], mainColor: true, noneClass: !row[editItem.field] }"
                    @click="changeBulletinInput(row, index, true, editItem.field, editItem.type)">{{ row[editItem.field]
                      ||
                    '点击选择'}}</span>
                </div>
              </div>
            </template>
            <template v-for="elItem, elIndex in props.zlvalue.editSlots" :key="elIndex"
              v-slot:[elItem]="{ row, index, column }">
              <slot :name="elItem" :row="row" :index="index" :column="column"></slot>
            </template>
            <template #operation="{ row, index }">
              <el-button link type="danger" @click="bindImportDelete(row, index)">删除</el-button>
            </template>
          </YbVXETable>
        </div>
        <div class="z_pager"></div>
      </div>
      <!-- footer区域 -->
      <template #footer>
        <div class="zlImport_footer_box">
          <div class="zlImport_footer_box_r">
            <slot name="footer-right"></slot>

            <el-button type="info" @click="closeDialog">关闭</el-button>
            <el-tooltip effect="light" :content="submitDisabled ? '请先点击上方的再次效验' : '点击保存正确的数据'" placement="top">
              <view style="height: 32px;  overflow: hidden;">
                <ZlTag :disabled="submitDisabled || state.importData.tableData.tableData.length == 0"
                  style="margin-left: 12px;" effect="light" type="primary" tagType="button" @click="submitClick()">保存
                </ZlTag>
              </view>
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/* #region ***************************************************************引入*******************************************************************  */
// 公用组件
import { toRefs, reactive, ref, watch, onMounted, nextTick, onUpdated, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from 'element-plus'
// 众链组件 ZlDrawer
import { YbVXETable, ZlTag } from "../index";
// 方法相关
import * as XLSX from 'xlsx';
import * as Utils from "/@/utils/index";
// 样式相关
import { isArray } from "xe-utils";
import { Download } from "@element-plus/icons-vue";
/* #endregion */

/* #region *************************************************************数据准备*****************************************************************  */

// 传入
const props = defineProps({
  zlvalue: { type: Object, default: false, },                               // 所有数据
  fileName: { type: String, default: '', },                                 // 模板文件名称
  width: { type: Number, default: 800 },                                     // 宽度
  showFooter: { type: Boolean, default: false },                            // 显示合计
  change: { type: Boolean, default: false },                                // 数据是否改变
  showTable: { type: Boolean, default: true },                              // 显示表格
  errCount: { type: Number, default: 0 },                                   // 数据效验错误数据数量
  warningCount: { type: Number, default: 0 },                               // 数据效验警告数据数量
  submitDisabled: { type: Boolean, default: false },                        // 提交按钮是否禁用
  customFieldData: { type: Array, default: [] },                            // 自定义字段数据
  showSearch: { type: Boolean, default: true }
});
// 传出
const emit = defineEmits(["closeImport", "changeImport", "submitImport"]); //closeImport 弹窗是否关闭 changeImport 上传内容 submitImport 保存按钮

// 数据
const state = reactive({
  buttonType: true,
  serAch: {} as any,
  typeif: true,
  exportData: [] as any,
  importData: props.zlvalue,                       // 数据
  showTable: props.showTable,                      // 是否显示表格
  submitDisabled: false,            // 是否禁用
  edits: [] as any,                      // 可编辑的
  options: {} as any,                    // 选择
})
const {
  buttonType,
  serAch,
  typeif,
  exportData,
  showTable,
  submitDisabled,
  edits,
  options,
} = toRefs(state);
/* #endregion */

/* #region *************************************************************初始化*****************************************************************  */
// 加载
onMounted(() => {
  state.submitDisabled = props.submitDisabled
  queryData()
});
watch(() => props.change, (valuN, oldW) => {
  // console.log('werwer', props.submitDisabled)
  state.submitDisabled = props.submitDisabled
  queryData()
})

// 初始化
const queryData = () => {

  getEdits()
}

// 解析可编辑
const getEdits = () => {
  if (props.zlvalue.edits) {
    let inEdits = props.zlvalue.edits
    let showEdits = [] as any
    let showPotions = {} as any
    for (let key in inEdits) {
      if (typeof (inEdits[key]) == 'string') { // 当是字符串
        showEdits.push({ type: inEdits[key], field: key })
      } else { // 当是一个对象
        showEdits.push({ field: key, ...inEdits[key] })
        if (inEdits[key].type == 'select') showPotions[key] = inEdits[key].options
      }
    }
    state.edits = showEdits
    state.options = showPotions
  }
}
/* #endregion */


/* #region *************************************************************表格相关*****************************************************************  */
let dataAll = computed(() => {
  let newData = [...state.importData.tableData.tableData]
  let newTableData = { ...props.zlvalue.tableData }
  let returnData = newData.filter((item) => {
    let typeShow = false
    let i = 0
    for (let key in item) {
      if (state.serAch[key] && state.serAch[key] != undefined && item[key] && item[key] != undefined) { //搜索内容
        if (isArray(state.serAch[key])) { //判断是否为多选数组
          if (state.serAch[key].length > 0) i = 1
          let newData = state.serAch[key]
          newData.forEach((item: any, index: any) => {
            typeShow = item[key].includes(item)
          });
        } else {
          if (state.serAch[key]) i = 1
          typeShow = item[key].includes(state.serAch[key])
        }
      } else {
        if (state.serAch["min" + key] || state.serAch["max" + key]) i = 1
        if (state.serAch["min" + key] && state.serAch["max" + key]) { //判断是否为经营权号的范围
          typeShow = state.serAch["min" + key] <= item[key] && state.serAch["max" + key] >= item[key]
        } else if (state.serAch["min" + key] && !state.serAch["max" + key]) {
          typeShow = item[key].includes(state.serAch["min" + key])
        }
      }

    }
    if (i == 0) typeShow = true
    if (typeShow) return typeShow
    if (state.typeif) return true
  })
  newTableData.tableData = returnData
  state.exportData = returnData
  return newTableData


})


const bindCarInsuranceGetSearch = (e: any) => {
  state.serAch = { ...e }
  state.typeif = false
}

// 获取表格组件的重置
const bindCarInsuranceResetSearch = (e: any) => {
  state.typeif = true
}
/* #endregion  */

/* #region ************************************************************* 表格编辑 *****************************************************************  */
// 切換是否点击编辑
const editDateRef = ref({} as any) // 时间的动态Ref
const setDateRef = (el: any, index: number, field: string) => {
  if (el) {
    editDateRef[field] = []
    editDateRef[field][index] = el
  }
}
const changeBulletinInput = (item: any, index: number, type: boolean, field: string, divType?: string) => {
  item[`${field}Show`] = type
  if (type) { // 打开
    nextTick(() => {
      document.getElementById(field + index)?.focus()
      if (divType && (divType == 'date' || divType == 'datetime')) editDateRef[field][index].handleOpen()
    })
  } else { // 失焦时
    state.showTable = false
    nextTick(() => {
      state.showTable = true
    })
    state.submitDisabled = true
  }
  queryData()
}

// 删除
const bindImportDelete = (row: any, index: number) => {
  ElMessageBox.confirm(
    `确认删除吗?`,
    `删除`,
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
      confirmButtonClass: 'ExitConfirmButton',
    }).then(() => {
      state.importData.tableData.tableData.splice(index, 1)
    })
}
/* #endregion */
  
/* #region *************************************************************导入相关*****************************************************************  */

// 保存按钮
const submitClick = Utils.debounce(async (formEl: FormInstance | undefined) => {
  if (state.importData.tableData.tableData.length == 0) {
    return
  }
  if (state.submitDisabled) return
  ElMessageBox.confirm(
    `本次会提交所有正确的数据${props.warningCount ? `, 其中包含 ${props.warningCount} 条重复数据，重复数据将覆盖原来的数据` : ''}，错误数据可以提交完成后导出，是否确认提交保存?`,
    `导入保存确认`,
    {
      confirmButtonText: '确认提交',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
      confirmButtonClass: 'ExitConfirmButton',
    }).then(() => {
      let submitArr: any = []
      let errArr: any = []
      if (state.importData.tableData.tableData.length) {
        state.importData.tableData.tableData.forEach((item: any) => {
          // console.log('item.err', item.errormsg)
          if (item.errormsg) {
            errArr.push(item)
          } else {
            submitArr.push(item)
          }
        })
      }
      emit("submitImport", submitArr, errArr)
    })

}, 500);

// 再次效验
const bindReValidation = Utils.debounce(async () => {
  emit("changeImport", state.importData.tableData.tableData)
})

/** 关闭弹窗
 *
 */
const closeDialog = () => {
  emit("closeImport", false);
  state.buttonType = true
};


/* #endregion  */

/* #region *************************************************************导出*****************************************************************  */
// 导出全部数据
const bindExportDataAll = () => {
  tackleData(true, '全部数据')
}
// 导出错误数据
const bindExportDataError = () => {
  tackleData(false, '错误数据')
}

// 负责数据处理
const tackleData = (ifType: boolean, nameExport: string) => {

  // 准备数据 computed
  // let newData = [...props.zlvalue.tableData.tableData]
  let newData = [...state.exportData]
  let importFormatObj = { ...{ serialNo: '序号及错误信息' }, ...props.zlvalue.importFormat }
  // if (nameExport == '错误数据') importFormatObj = {...{serialNo: '序号及错误信息'}, ...importFormatObj}
  let newObj = {} //导出对应顺序
  let exportArrNew = [] as any //导出格式
  let headerNew = [] as any//头部内容

  for (let key in importFormatObj) {
    headerNew.push(importFormatObj[key]) //头部内容
    newObj[key] = ''
  }
  newData.forEach((item: any) => {
    if (item.errormsg || ifType) {
      let newNewObj = { ...newObj }
      for (let key in newNewObj) {
        newNewObj[key] = item[key]
      }
      exportArrNew.push(newNewObj)
    }
  })

  // 赋值
  // exportArr = exportArrNew
  toExport(exportArrNew, headerNew, nameExport)
}

// 负责导出的数据
const toExport = (exportData: any, headerData: any, type: any) => {
  if (exportData.length == 0) return
  // 需要导出的数据
  const exportArr: any = [...exportData];
  // 自定义下载的header，注意是数组中的数组哦
  const Header = [[...headerData]] as any;
  // 将JS数据数组转换为工作表。
  const headerWs = XLSX.utils.aoa_to_sheet(Header);
  const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, { skipHeader: true, origin: 'A2' });

  /* 新建空的工作表 */
  const wb = XLSX.utils.book_new();

  // 可以自定义下载之后的sheetname
  XLSX.utils.book_append_sheet(wb, ws, 'sheetName');
  let exportName = props.zlvalue.title ? props.zlvalue.title.split('数据')[0] : ''


  /* 生成xlsx文件 */
  XLSX.writeFile(wb, `${exportName}${type}.xlsx`);
}
/* #endregion  */

/* #region *************************************************************文件上传*****************************************************************  */

// 上传信息
const before_avatar_success = Utils.debounce(async (File: any, FileList: any) => {
  // console.log('文件信息',File.file);
  if (File.file != '') {
    importExcel(File.file)
  }

}, 500)

// 读取文件
const importExcel = (file: any) => {
  // console.log('file',file)
  const types = file.name.split(".")[1];
  const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
    item => item === types
  );
  if (!fileType) {
    alert("格式错误！请重新选择");
    return;
  }
  file2Xce(file)
    .then((tabJson: any) => {
      if (tabJson && tabJson.length > 0) {
        // that.importExcelVisible = true;
        return tabJson[0].sheet;
      }
    })
    .then(data => {

      if (data.length == 0) return ElMessage.warning("数据为空，请检查导入内容！")
      dealData(data)
    });
}
// 解析文件
const file2Xce = (file: any) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const data = e.target.result;
      let wb = XLSX.read(data, {
        type: "binary"
      });
      const result: any = [];
      wb.SheetNames.forEach((sheetName: any) => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
        });
      });
      resolve(result);
    };
    reader.readAsBinaryString(file);
  });
}

// 处理数据
const dealData = (data: any) => {
  // console.log('data',data)
  if (data && data.length > 0) {
    data.forEach((item: any) => {

      for (let key in item) {
        if (key.includes('日期')) {
          item[key] = formatDate(item[key], '/')
        } else if (key.includes('时间')) {
          item[key] = formatDateTime(item[key], '/')
        }
      }
    })
  }
  loadingData(data)
}
// 按照需要的格式装填数据
const loadingData = (data: any) => {
  let newData = [] as any
  let obj = { ...props.zlvalue.importFormat }
  let newObj = {}
  for (let key in obj) {
    newObj[key] = ''
  }
  data.forEach((item: any) => {
    let objData = { ...newObj }
    if (props.customFieldData.length) objData['customFieldData'] = props.customFieldData
    for (let key in item) {
      for (let objKey in obj) {
        if (key == obj[objKey]) objData[objKey] = item[key] + ''
      }
    }
    newData.push(objData)
  });
  emit('changeImport', newData)
  state.buttonType = false
}
/* #endregion  */


/* #region ***************处理时间excel时间转字符串时间************* */
// 不带时分秒
const formatDate = (numb: any, format?: string) => {
  let fm = format || '/'
  if (numb) {
    if (typeof numb === "number") {
      return getExeclDate(numb, fm)
    } else if (typeof numb === "string") {
      return Utils.TimeTools.Format(`yyyy${fm}MM${fm}dd`, new Date(numb))
    }
  } else {
    return undefined;
  }
}

const getExeclDate = (num: number, fm?: string) => {
  let days = parseInt(num.toString())
  let seconds = parseInt(((num - days) / 0.0000115741 + 0.5).toString())
  let s = new Date(2020, 0, 1, 0, 0, seconds).getTime()

  let d = s + 24 * 1000 * 60 * 60 * (days - 43831)
  return Utils.TimeTools.Format(`yyyy${fm}MM${fm}dd`, new Date(d))

}

// 带时分秒
const formatDateTime = (numb: any, format?: string) => {
  let fm = format || '/'
  if (numb) {
    if (typeof numb === "number") {
      return getExeclDateTime(numb, fm)
    } else if (typeof numb === "string") {
      return Utils.TimeTools.Format(`yyyy${fm}MM${fm}dd hh:mm:ss`, new Date(numb))
    } else {
      return null;
    }
  }
}

const getExeclDateTime = (num: number, fm: string) => {
  let days = parseInt(num.toString())
  let seconds = parseInt(((num - days) / 0.0000115741 + 0.5).toString())
  let s = new Date(2020, 0, 1, 0, 0, seconds).getTime()

  let d = s + 24 * 1000 * 60 * 60 * (days - 43831)
  return Utils.TimeTools.Format(`yyyy${fm}MM${fm}dd hh:mm:ss`, new Date(d))

}
/* #endregion */

</script>



<style lang="scss" scoped>
/*Dialog主题样式*/
.zlImport {
  :deep(.el-dialog) {
    height: auto;
    border-radius: 5px;
    background: none !important;
    --el-dialog-padding-primary: 0;

    .el-dialog__header {
      padding: 16px !important;
      border-radius: 6px 6px 0 0;
    }

    .el-dialog__body {
      padding: 16px !important;
    }
  }

  // :deep(.el-dialog) {
  //   height: auto;
  //   border-radius: 5px;
  //   background: #262626 !important;
  // }
  :deep(.el-form-item__label) {
    color: #9e9e9e;
  }

  .zlImport_menu_box {
    width: 100%;
    height: auto;

    height: 60%;
    padding: 0 $formPadding;
    box-sizing: border-box;
    background: #262626;
  }

  :deep(.el-dialog__header) {
    width: 100%;
    background: $formTitleBg !important;
    margin-right: 0;
    border-radius: 5px 5px 0 0;
    padding: $formPadding;
    box-sizing: border-box;

    .el-dialog__title {
      color: $mainFontColor !important;
    }
  }

  :deep(.el-upload-list) {
    // background-color: red;
    display: none;
    margin: 0;
  }


  .el-input.is-disabled .el-input__wrapper {
    background-color: none !important;
  }

  :deep(.el-tabs__item) {
    color: $cjFontColor;
  }

  :deep(.el-dialog__body) {
    background: $formBodyBg !important;
    //   padding: $formPadding 0 !important;
    padding: 0 !important;

    .el-input__wrapper {
      background: $mainBg;
      box-shadow: none;

      .el-input__inner {
        color: $mainFontColor;
      }
    }

    .el-select {
      width: 100% !important;
    }

    .el-select-v2__wrapper {
      background: $mainBg;
      box-shadow: none;
      // .el-input__inner {
      //   color: $mainFontColor;

      // }
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100% !important;

      .el-input__wrapper {
        width: 100% !important;
        box-sizing: border-box;
      }
    }

    .el-input__wrapper:hover {
      background: $mainBg;
      // box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
      //   inset;
    }
  }

  :deep(.el-dialog__footer) {
    background: $formBodyBg;
    padding: $formPadding;
    box-sizing: border-box;
    border-radius: 0 0 5px 5px;
  }

  .zlImport_body_boxzong {
    // width: 97%;
    height: auto;
    margin: 0 auto;

    .zlImport_body_boxzongtitle {
      // width: 98.5%;
      padding: $smallPadding;
      display: flex;
      align-items: center;
      justify-content: space-between;

      //   padding: 1rem 0;
      .zlImport_body_boxzongtitlebutto {
        // width: 160px;
        display: flex;
        // justify-content: space-between;
        // :deep(.tagSearchBox){
        //   font-size: $smallFontSize;
        // }
      }
    }

    .z-tablecalIns {
      height: 36rem;
      min-height: 200px;
    }
  }

  .downLoad {
    color: white;
    text-decoration: none;
  }

  .zlImport_footer_box {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;

    .zlImport_footer_box_l {
      display: flex;
    }

    .zlImport_footer_box_r {
      display: flex;
    }
  }
}

.checkData_box {
  height: 100%;
  display: flex;
  align-items: center;

  .checkData_row {
    height: 100%;
    display: flex;
    align-items: center;
  }
}

//   本文区域
:deep(.el-textarea__inner) {
  background: $topBg;
  box-shadow: none;
  color: $mainFontColor;
}

.button_box {
  width: 100%;
  display: flex;
}

.zlExcelImportTrColor {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  // background-color: pink;
  .zlExcelImportTrColorDiv1 {
    // flex: 1;
    width: 9.6px;
    height: 44.8px;
    border: none;
    border-radius: 10px 0 0 10px;
    background: #F56C6C;
    margin-right: 9.6px;
    color: transparent;
  }

  .zlExcelImportTrColorDiv2 {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #F56C6C;
  }
}

.zlExcelImportTrColorWarning {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  // background-color: pink;
  .zlExcelImportTrColorDivWarning1 {
    // flex: 1;
    width: 9.6px;
    height: 44.8px;
    border: none;
    border-radius: 10px 0 0 10px;
    background: #e6a23c;
    margin-right: 9.6px;
    color: transparent;
  }

  .zlExcelImportTrColorDivWarning2 {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #e6a23c;
  }
}
</style>