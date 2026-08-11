<template>
  <div class="container">
    <h1>{{ article?.title }}</h1>
    <div v-html="article?.text" class="article-content"></div>
    <div v-if="article?.image">
      <img  
        :src="article?.image" 
        :title="article?.imageDescription"
        class="card-image"
      />
      <i class="img-desc">{{ article?.imageDescription }}</i>
    </div>
    <div v-if="article?.tabs" class="tabs">
      <div v-for="tab in article?.tabs" :key="tab" class="tab">
        {{ tab }}
      </div>
    </div>
    <p>Written by: {{ article?.author }}</p>
    <p>Published on: {{ article?.createdAt }}</p>

    <div>
      <NuxtLink :to="`/articles/edit/${article?.id}`">
        <el-button type="warning">Edit</el-button>
      </NuxtLink>
      <el-button 
        type="danger" 
        class="delete-btn" 
        @click="openDialog()"
      >
        Delete
      </el-button>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Attention"
      width="500"
      align-center
    >
      <span>Are you sure you want to delete this article?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmDelete()">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

 <Spinner v-if="isLoading" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Article } from '~/services/types/Article';

const route = useRoute();
const router = useRouter();
const article = ref<Article | null>(null);
const dialogVisible = ref(false);

const isLoading = ref(false);

const loadArticle = async (id: any) => {
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON from the response

    // Format the date if necessary
    const date = new Date(data.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    data.createdAt = formattedDate;

    article.value = data;
  } catch (error: any) {
    console.error('Fetch articles error:', error.message);
    // Allow the frontend to proceed even if the API call fails
    article.value = null; // Fallback to an empty array
  } finally {
    isLoading.value = false;
  }
};

const openDialog = () => {
  dialogVisible.value = true;
};

const confirmDelete = async () => {
  dialogVisible.value = false;
  isLoading.value = true;
  const id = route.params.id;

  try {
    const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete article');
    }

    console.log('Article deleted successfully');
    
    // Fetch the updated list of articles
    router.push('/articles')
  } catch (error) {
    console.error('Error deleting article:', error);
  } finally {
    isLoading.value = false;
  }
};


onMounted(() => {
  const id = route.params.id;
  loadArticle(id);
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-image {
  width: 600px;
  height: 400px;
  object-fit: cover;
}

.delete-btn {
  margin-left: 8px;
}

.tabs {
  display: flex;
  flex-direction: row;
  gap: 8px;

  .tab {
    border: 1px solid #ccc;
    background-color: #7b7b7b;
    padding: 4px 8px;
    border-radius: 4px;
  }
}

.img-desc {
    display: block;
    line-height: 12px;
    font-size: 14px;
    margin-bottom: 8px;
    color: #ccc;
}
</style>
