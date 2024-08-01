<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { Table, ZlTag } from '/@/components';
import { reactive, onMounted, toRefs, watch } from 'vue';

import { roleApi } from '/@/api/system/role/role-api';
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
  table: {} as any,

  isEdit: true,
});
const { table, tableConfig, isEdit } = toRefs(state);
interface roleProps {
  roleId: number; // 数据
}
const props = withDefaults(defineProps<roleProps>(), {
  roleId: 1,
});
// 监听类型变化
watch(
  () => props.roleId,
  () => {
    queryData();
  }
);
// 初始化
onMounted(() => {
  queryData();
});
const queryData = async () => {
  // table.value = {
  //   roleId: props.roleId,
  // };
  const data = await roleApi.getRoleDetail(props.roleId);
};
</script>

<style lang="scss" scoped>
</style>