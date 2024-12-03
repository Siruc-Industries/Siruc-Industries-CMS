<template>
  <div>
    <h1 class="title">Content Managment System</h1>
    <div v-if="articles.length">
      <el-card v-for="article in articles" :key="article.title" class="card">
        <template #header>
          <div class="header">
            <div class="header-info">
              <span>{{ article.title  }}</span>
            </div>
            <div class="header-options">
              <el-dropdown trigger="click">
                <el-button circle>
                  <img
                    src="assets/icons/vert-dots.svg"
                    class="icon"
                    alt="More options"
                  />
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Edit</el-dropdown-item>
                    <el-dropdown-item>Delete</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
        <p class="text item">
          {{ article.text }}
        </p>
        <template #footer>
          <div class="footer">
            <div class="footer-info">
              <p>{{ article.author }}</p>
              <span class="span">|</span>
              <i>{{ article.createdAt }}</i>
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <div v-else>
      <h3>No articles yet!</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &-info {
    display: flex;
  }
  &-options {
    display: flex;
  }
}

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
  flex-direction: row;
  justify-content: space-between;

  &-info {
    display: flex;
  }
}

.span {
  margin: 0 6px;
}
</style>