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
        <!-- <el-button link type="danger" @click="roleDel(row)">删除</el-button> -->
      </template>
    </Table.Table>
    <RoleForm :visible="form.visible" :formConfig="form" @submit="submit" />
  </div>
</template>
<script setup lang="ts">
import RoleForm from './components/RoleForm.vue';
import { FormData } from '/@/components/form/module/index';
import { Table, ZlTag } from '/@/components';
import { reactive, onMounted, toRefs, watch } from 'vue';
import { roleList } from '/@/views/system/employee/role/model';
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
    formData: {} as any,
    showSubmit: true,
    showDelete: false,
  } as FormData,
});
const { table, tableConfig, form } = toRefs(state);
// 获取list
const queryData = async (params?: any, isReset?: boolean) => {
  // state.table.searchTable.pageSize = Utils.StorageTools.ZlStroageTools.pageSizeInfoAES_CBC(state.tableConfig.pageName, state.tableConfig.tableName);
  state.table.search(params, isReset).query();
};
// 表单
// 修改表单
const roleEdit = (row: any) => {
  state.form.formData = row;
  state.form.visible = true;
};
const submit = () => {
  state.form.visible = false;
  state.form.formData = {};
  queryData({ pageNum: 1 });
};
const addRole = () => {
  state.form.visible = true;
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
