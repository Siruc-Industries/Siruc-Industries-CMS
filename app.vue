<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  document.body.classList.add('dark-mode-custom');
})
</script>

<style scoped lang="scss">
body.dark-mode-custom {
  background-color: var(--el-color-secondary);
  color: var(--el-color-text)
}
</style>