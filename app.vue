<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout />
  </div>
</template>

<script setup>
onMounted(() => {
  document.body.classList.add('dark-mode');
})
</script>

<style scoped>
body.dark-mode {
  background-color: var(--el-color-secondary);
  color: var(--el-color-text)
}
</style>