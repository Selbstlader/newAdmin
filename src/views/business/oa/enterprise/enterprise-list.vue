<template>
  <div class="height100">
    <!-- table表单 -->
    <Table.Table :zlvalue="{ ...table, ...tableConfig }" :showSearch="true">
      <template #operation="{ row }">
        <el-button link type="primary" v-hasPermi="['trainees:users:edit']" @click="bindEdit(row)">编辑</el-button>
        <el-button link type="danger" v-hasPermi="['trainees:users:remove']" @click="bindDel(row)">删除</el-button>
      </template>
    </Table.Table>
  </div>
</template>
<script setup lang="ts">
import { Table } from '/@/components';
import { reactive, onMounted, toRefs } from 'vue';
import { roleList } from '/@/views/system/employee/role/model';
// import * as Utils from '/@/utils';
const state = reactive({
  tableConfig: new Table.ZlVXETable('index', 'roleIndex')
    .createColumns('roleName', '岗位', '120', { searchType: 'input' })
    .createColumns('remark', '备注', '120', { searchType: 'input' })
    .createColumns('', '操作', '120', {
      slots: { default: 'operation' },
      fixed: 'right',
    }),
  table: {} as roleList,
});
const { table, tableConfig } = toRefs(state);
onMounted(() => {
  state.table = new roleList();
  queryData();
  // console.log(state.table);
});
// 获取list
const queryData = async (params?: any, isReset?: boolean) => {
  // state.table.searchTable.pageSize = Utils.StorageTools.ZlStroageTools.pageSizeInfoAES_CBC(state.tableConfig.pageName, state.tableConfig.tableName);
  state.table.search(params, isReset).query();
};
</script>
<style scoped lang="less">
.height100 {
  height: 100%;
}
</style>
