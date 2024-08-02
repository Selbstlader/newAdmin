<template>
  <div class="height100" style="background: #fff; border-radius: 8px">
    <a-card class="role-container height100">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="系统角色"> <RoleList ref="roleList" /></a-tab-pane>
        <a-tab-pane key="2" tab="审批角色">
          <SignRole />
          <!-- <RoleDataScope /> -->
        </a-tab-pane>
      </a-tabs>
      <!-- 系统角色 -->

      <!-- 审批角色 -->
      <!-- <a-row :gutter="10" type="flex" v-if="activeKey == 2">
        <a-col flex="200px"> <SignRole :roleId="roleId" /> </a-col>
      </a-row> -->
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { computed, provide, ref, toRefs, reactive } from 'vue';
import RoleList from './components/role-list/index.vue';
// import RoleSetting from './components/role-setting/index.vue';
// import RoleTree from './components/role-tree/index.vue';
import SignRole from './components/sign-role/index.vue';

// 数据
const state = reactive({
  activeKey: '1',
  roleId: 1,
});
const { activeKey, roleId } = toRefs(state);

let roleList = ref();
const selectRoleId = computed(() => {
  if (!roleList.value) {
    return null;
  }
  return roleList.value.selectRoleId;
});
const getRoleTreeId = (ids) => {
  roleId.value = ids;
};
provide('selectRoleId', selectRoleId);
</script>
<style scoped lang="less">
.height100 {
  height: 100%;
}
:deep(.ant-menu-light.ant-menu-root.ant-menu-vertical) {
  border-inline-end: 0;
}
:deep(.ant-tabs-nav) {
  margin: 0;
}
:deep(.ant-card) {
  border-radius: 8px !important;
}
:deep(.ant-card-bordered) {
  border: 0 !important;
}
</style>
