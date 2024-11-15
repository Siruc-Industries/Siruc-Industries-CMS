<template>
  <div class="container">
    <aside class="aside">
      ...
    </aside>
    <main class="main">
      <div class="top">
        <el-button>Add article</el-button>
      </div>
      <section class="section">
        <NuxtPage />
      </section>
    </main>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;

  .aside {
    width: 15%;
    height: 100%;
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