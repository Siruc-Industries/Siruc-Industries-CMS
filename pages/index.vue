<template>
  <div>
    <h1 class="title">CMS</h1>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Card name</span>
        </div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer>Footer content</template>
    </el-card>
  </div>
</template>

<script></script>

<style>
.title {
  margin-bottom: 40px
}
</style>