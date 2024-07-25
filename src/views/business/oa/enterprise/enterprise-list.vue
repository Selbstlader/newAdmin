<template>
  <div class="height100">
    <!-- table表单 -->
    <Table.Table :zlvalue="{ ...table, ...tableConfig }" :showSearch="true" :allSelect="true" @getSearch="queryData">
      <template #left>
        <div class="default">
          <div class="flex-center">
            <ZlTag style="margin-right: 12px" tagType="button" type="search" effect="light" size="small" @click="addRole"
              ><el-icon style="margin-right: 6px">
                <el-icon><Plus /></el-icon> </el-icon
              >新增岗位</ZlTag
            >
          </div>
        </div>
      </template>
      <template #showIsChecke="{ row }">
        <div style="display: flex; justify-content: flex-start">
          <ZlTag v-if="row.enterpriseId == '1'" type="success"><span class="successColor">在线</span></ZlTag>
          <ZlTag v-if="row.enterpriseId == '2'" type="danger"><span class="dangerColor">离线</span></ZlTag>
        </div>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="roleEdit(row)">编辑</el-button>
        <!-- <el-button link type="primary" @click="roleView(row)">查看</el-button> -->
      </template>
    </Table.Table>
    <ProDialog
      :width="1200"
      :visible="form.visible"
      :title="form.title"
      :showSubmit="form.showSubmit"
      :showDelete="form.showDelete"
      @close="closeForm"
      @submit="submit"
    >
      <Form.Form :visible="form.visible" labelWidth="140px" :zlvalue="form" :showDelete="form.showDelete" />
    </ProDialog>
  </div>
</template>
<script setup lang="ts">
import { FormData } from '/@/components/form/module/index';
import { Table, ZlTag } from '/@/components';
import { reactive, onMounted, toRefs, watch } from 'vue';
import { roleList } from '/@/views/system/employee/role/model';
import ProDialog from '/@/components/dialog/dialog.vue';
import { Form } from '/@/components/index';
import { RoleForm } from './components/module/roleForm';
import isEqual from 'lodash/isequal';
// import * as Utils from '/@/utils';
const state = reactive({
  tableConfig: new Table.ZlVXETable('index', 'roleIndex')
    .createColumns('', '', '20', { type: 'checkbox', fixed: 'left' })
    .createColumns('index', '序号', '60')
    .createColumns('enterpriseName', '企业名称', '180', { searchType: 'input' })
    .createColumns('unifiedSocialCreditCode', '统一社会信用代码', '170')
    .createColumns('type', '企业类型', '100')
    .createColumns('contact', '联系人', '100')
    .createColumns('contactPhone', '联系人电话', '100')
    .createColumns('email', '邮箱', '100')
    .createColumns('disabledFlag', '状态', '100', {
      slots: { default: 'showIsChecke' },
      searchField: 'isCheckList',
      options: [
        { name: '在线', value: '1', check: true },
        { name: '离线', value: '0', check: true },
      ],
    })
    .createColumns('createUserName', '创建人', '100')
    .createColumns('createTime', '创建时间', '100')
    .createColumns('', '操作', '120', {
      slots: { default: 'operation' },
      fixed: 'right',
    }),
  table: {} as roleList,
  form: {
    title: '企业类型',
    visible: false,
    type: '',
    formData: new RoleForm()
      .createColumns('enterpriseName', '企业名称', 'input', '无内容', { span: 24, rule: true, autosize: { minRows: 3 } })
      .createColumns('cySlot', '课程期数', ' ', '请选择课程期数', { span: 24, rule: true })
      .createColumns('logo', ' 企业logo', 'ZlSingleUpload', '企业logo', { span: 24, rule: true })
      .createColumns('type', '企业类型', 'select', '企业类型', {
        span: 24,
        rule: true,
        filterable: true,
        options: [
          { label: '在线', value: 1, original: undefined },
          { label: '离线', value: 0, original: undefined },
        ],
      })
      .createColumns('unifiedSocialCreditCode', '统一社会信用代码', 'input', '统一社会信用代码', { span: 24, rule: true })
      .createColumns('contact', '联系人', 'input', '联系人', { span: 24, rule: true })
      .createColumns('contactPhone', '联系人电话', 'input', '电话', { span: 24, rule: true })
      .createColumns('email', '邮箱', 'input', '邮箱', { span: 24, rule: true })
      .createColumns('disabledFlag', '状态', 'select', '状态', {
        span: 24,
        rule: true,
        options: [
          { label: '在线', value: 1, original: undefined },
          { label: '离线', value: 0, original: undefined },
        ],
      })
      .createColumns('ocr', ' 营业执照', 'ZlFileListUpload', '请上传营业执照', { span: 24, rule: true }) as RoleForm,
    showSubmit: true,
    showDelete: false,
  } as FormData,
  isEdit: true,
});
const { table, tableConfig, form, isEdit } = toRefs(state);
// 获取list
const queryData = async (params?: any, isReset?: boolean) => {
  // state.table.searchTable.pageSize = Utils.StorageTools.ZlStroageTools.pageSizeInfoAES_CBC(state.tableConfig.pageName, state.tableConfig.tableName);
  state.table.search(params, isReset).query();
};
// 表单
// 修改表单
const roleEdit = (row: any) => {
  state.form.formData.formData = row;
  state.form.visible = true;
};
// 查看
// const roleView = (row: any) => {
// };
const submit = () => {
  console.log(1111);

  let result: any;
  if (isEdit.value) {
    console.log(state.form.formData);
    result = state.form.formData.QueryUpdateRole(state.form.formData!);
  } else {
    result = state.form.formData.add(state.form.formData!);
  }
  setTimeout(() => {
    state.form.visible = false;
  }, 1000);
  // state.form.formData = {};
  queryData({ pageNum: 1 });
};
const addRole = () => {
  console.log(state.form.formData);

  state.form.formData.formData = {};
  state.form.visible = true;
};
const closeForm = () => {
  state.form.visible = !state.form.visible;
};
//
onMounted(() => {
  state.table = new roleList();
  queryData({ pageNum: 1 });
});
</script>
<style scoped lang="less">
.height100 {
  height: 100%;
}
</style>
