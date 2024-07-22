<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>