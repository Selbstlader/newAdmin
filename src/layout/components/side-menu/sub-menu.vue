<!--
  * 传统菜单-递归菜单
  * 
  * @Author:    1024创新实验室-主任：卓大 
  * @Date:      2022-09-06 20:29:12 
  * @Wechat:    zhuda1024 
  * @Email:     lab1024@163.com 
  * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012 
-->
<template>
  <a-sub-menu :key="menuInfo.menuId">
    <template #icon>
      <component :is="$antIcons[menuInfo.icon]" />
    </template>
    <template #title>{{ menuInfo.menuName }}</template>
    <template v-for="item in menuInfo.children" :key="item.menuId">
      <template v-if="item.visibleFlag && !item.disabledFlag">
        <template v-if="!item.children">
          <div class="menu-header"></div>
          <a-menu-item :key="item.menuId" @click="turnToPage(item)" style="width: 140px; left: 45px">
            <!-- <template #icon>
              <component :is="$antIcons[item.icon]" />
            </template> -->
            <span style="left: 20px; position: absolute; top: 0; text-align: left">{{ item.menuName }}</span>
          </a-menu-item>
        </template>
        <template v-else>
          <SubMenu :menu-info="item" :key="item.menuId" @turnToPage="turnToPage" />
        </template>
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup lang="ts">
const props = defineProps({
  menuInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['turnToPage']);
const turnToPage = (route) => {
  emits('turnToPage', route);
};
</script>
<style lang="less" scoped>
:deep(.ant-menu-item-selected .ant-menu-item-only-child) {
  padding-left: 0 !important; /* 将 padding-left 设置为 0 */
}
.menu-header {
  position: relative; /* 使伪元素相对于此元素定位 */
  display: inline-block; /* 如果你想让它和其他文本或元素在同一行显示 */
}

.menu-header::before {
  content: ''; /* 显示的内容 */
  position: absolute; /* 定位方式 */
  left: 30px; /* 调整位置，使其紧挨着 .menu-header */
  width: 2px; /* 竖线宽度 */
  background-color: @gray-14;
  height: 53px;
  top: -5px;
}
</style>