<template>
  <!-- 头部header -->
  <SmartHeader v-if="route.name !== 'Login'" />
  <RouterView />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SmartHeader from './smart-header.vue';
const route = useRoute();
console.log(route, route.name);
</script>

<style lang="less" scoped>
</style>