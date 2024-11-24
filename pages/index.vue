<template>
  <div>
    <h1 class="title">Content Managment System</h1>
    <div v-if="articles.length">
      <el-card v-for="article in articles" :key="article.title" class="card">
        <template #header>
          <div class="card-header">
            <span>{{ article.title  }}</span>
          </div>
        </template>
        <p class="text item">
          {{ article.text }}
        </p>
        <template #footer>
          <div class="footer">
            <p>{{ article.author }}</p>
            <span class="span">|</span>
            <i>{{ article.createdAt }}</i>
          </div>
        </template>
      </el-card>
    </div>
    <div v-else>
      <h3>No articles yet!</h3>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const articles = ref([]);

// Fetch articles when the component is mounted
const fetchArticles = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/articles');
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    let data = await response.json();
    data = data.map((article) => {
      return {
        ...article,
        createdAt: article.createdAt.split('T')[0]
      }
    })
    articles.value = data;
  } catch (error) {
    console.error('Fetch articles error:', error.message);
    // Allow the frontend to proceed even if the API call fails
    articles.value = []; // Fallback to an empty array
  }
};

onMounted(fetchArticles);
</script>

<style>
.title {
  margin-bottom: 40px
}

.card {
  background-color: var(--el-color-bg) !important;
  color: var(--el-color-text) !important;
  margin-bottom: 16px;
}

.footer {
  display: flex;
}

.span {
  margin: 0 6px;
}
</style>