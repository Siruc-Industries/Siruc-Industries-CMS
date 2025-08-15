<template>
  <div>
    <h1 class="title">Content Management System</h1>
    <div class="navigation-links">
      <NuxtLink to="/articles">
        <el-button type="primary" size="large">Manage Articles</el-button>
      </NuxtLink>
      <NuxtLink to="/projects">
        <el-button type="success" size="large">Manage Projects</el-button>
      </NuxtLink>
    </div>
  </div>
</template>
<script scoped lang="ts"></script>
<style lang="scss" scoped>
.title {
  margin-bottom: 40px;
  text-align: center;
}

.navigation-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  
  a {
    text-decoration: none;
  }
}
</style>
