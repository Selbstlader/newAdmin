<template>
  <svg :class="svgClass" v-bind="$attrs" :style="`color: ${props.color}`">
    <use :xlink:href="iconName" rel="external nofollow" />
  </svg>
</template>

<script lang="ts" setup>


import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  myClass: {
    type: String,
    defalut: () => ''
  },
  color: {
    type: String,
    default: ''
  }
})

const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name} ${props.myClass}`
  }
  return `svg-icon`
});
</script>

<style lang='scss' scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
