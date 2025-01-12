<template>
  <div class="global-container">
    <aside class="aside">
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/articles">
        <el-button>Articles</el-button>
      </NuxtLink>
    </aside>
    <main class="main">
      <div class="top">
        <NuxtLink to="/articles/new">
          <el-button>Add article</el-button>
        </NuxtLink>
      </div>
      <section class="section">
        <NuxtPage />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  document.documentElement.classList.add('dark');
});
</script>

<style lang="scss" scoped>
.global-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;

  .aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 15%;
    padding: 25px 30px;
    border-right: 1px solid var(--el-color-border);
  }

  .main {
    width: 100%;

    .top {
      height: 80px;
      padding: 25px 30px;
      border-bottom: 1px solid var(--el-color-border);
    }

    .section {
      padding: 25px 30px;
    }
  }
}
</style>