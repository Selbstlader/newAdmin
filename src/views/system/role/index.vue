<template>
  <div class="height100">
    <TreeFilter label="name" title="" :data="treeRoleData.tableData" />
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue';
import { roleList } from './model';
import * as Api from '/@/api';
const state = reactive({
  treeRoleData: {} as roleList,
});
const { treeRoleData } = toRefs(state);
onMounted(() => {});
</script>
<style scoped lang="less">
.height100 {
  height: 100%;
  background: #fff;
}
</style>
