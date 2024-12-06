<template>
  <div class="container">
    <h1>{{ article.title }}</h1>
    <p>{{ article.text }}</p>
    <img
      v-if="article.image"
      :src="`http://localhost:5000${article.image}`"
      alt="Article image"
      class="card-image"
    />
    <p>Written by: {{ article.author }}</p>
    <p>Published on: {{ article.createdAt }}</p>

    <div>
      <NuxtLink :to="`/articles/edit/${article.id}`">
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const article = ref({});
const dialogVisible = ref(false);

const loadArticle = async id => {
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
    article.value = []; // Fallback to an empty array
  }
};

const openDialog = () => {
  dialogVisible.value = true;
};

const confirmDelete = async () => {
  dialogVisible.value = false;
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
</style>
