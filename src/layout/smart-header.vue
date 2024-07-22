<template>
  <a-row class="layout-header">
    <a-col :span="6" class="layout-logo">
      <img :src="logoSvg" alt="logoIcon" style="position: absolute; top: 20px; left: 15px" />
      <img :src="logoBgSvg" alt="logoIcon" />
    </a-col>

    <a-col :span="14">
      <a-menu class="menu-list" v-model:selectedKeys="current" mode="horizontal" style="gap: 15px">
        <template v-for="item in items" :key="item.key">
          <a-menu-item :key="item.key" v-if="item" @click="onSelectMenu(item)">
            {{ item.label }}
          </a-menu-item>
        </template></a-menu
      >
    </a-col>
    <a-col :span="4">
      <HeaderAvatar />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import logoSvg from '/@/assets/images/logo/logo.svg';
import logoBgSvg from '/@/assets/images/logo/logoBg.svg';
import HeaderAvatar from './components/header-user-space/header-avatar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const current = ref<string[]>(['help-doc']);
const items = ref([
  {
    label: '医保服务一张图',
    key: 1,
  },
  {
    label: '业务控制平台',
    key: 2,
  },
  {
    label: '医疗救助智能通',
    key: 3,
  },
  {
    label: '长护驿站指挥管理',
    key: 4,
    route: '/help-doc',
  },
  {
    label: '系统设置',
    key: 5,
    route: '/',
  },
]);
const onSelectMenu = (row: any) => {
  router.push({
    path: row.route,
  });
};
</script>

<style lang="less" scoped>
.layout-header {
  height: 64px;
  opacity: 1;
  background: @gray-bg-color;
  line-height: 64px;
  .menu-list {
    line-height: 64px;
    color: #fff;
    background: @gray-bg-color;
    font-size: @theme-mini-sise;
    top: 10px !important;
  }
}
::v-deep .ant-menu-item {
  top: 8px !important;
}
::v-deep .ant-menu-item-active,
::v-deep .ant-menu-item-selected {
  height: 60px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 4%, rgba(255, 255, 255, 0) 100%);
  font-size: @theme-mini-sise;
  color: #fff !important;
  font-weight: 600;
  border-radius: 8px !important;
  top: 8px !important;
}
</style>
