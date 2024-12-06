<template>
  <div>
    <h2>Edit Article</h2>
    
    <!-- Form Inputs -->
    <input class="input" v-model="formData.title" placeholder="Title" />
    <textarea class="input" v-model="formData.text" placeholder="Text"></textarea>
    <input class="input" v-model="formData.author" placeholder="Author" />

    <!-- Image Preview and Upload -->
    <div class="image-holder">
      <div>
        <img
          v-if="article?.image"
          :src="`http://localhost:5000${article.image}`"
          alt="Article image"
          class="card-image"
        />
      </div>
      <input type="file" @change="handleFileUpload" ref="fileInput" />
    </div>

    <!-- Submit Button -->
    <el-button type="primary" @click="updateArticle">Update</el-button>
  </div>
</template>

<style lang="scss" scoped>
.input {
  margin-bottom: 16px;
  width: 100%;
}
.card-image {
  margin-bottom: 8px;
  width: 600px;
  height: 400px;
  object-fit: cover;
}
.image-holder {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const article = ref<any>(null);

const formData = ref({
  title: '',
  text: '',
  author: '',
});
const selectedImage = ref<File | null>(null);

// Fetch article details to populate the form
const fetchArticle = async (id: any) => {
  try {
    const response = await fetch(`http://localhost:5000/api/articles/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    const data = await response.json();

    // Populate form data
    formData.value = {
      title: data.title,
      text: data.text,
      author: data.author,
    };
    article.value = data;
  } catch (error: any) {
    console.error('Fetch article error:', error.message);
    alert('Failed to load article data');
  }
};

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedImage.value = target.files[0];
  }
};

// Update article
const updateArticle = async () => {
  if (!formData.value.title || !formData.value.text || !formData.value.author) {
    alert('Please fill in all fields');
    return;
  }

  const id = route.params.id;
  const apiUrl = process.env.API_BASE_URL || 'http://localhost:5000';

  // Prepare FormData object
  const updatedFormData = new FormData();
  updatedFormData.append('title', formData.value.title);
  updatedFormData.append('text', formData.value.text);
  updatedFormData.append('author', formData.value.author);

  if (selectedImage.value) {
    updatedFormData.append('image', selectedImage.value);
  }

  try {
    const response = await fetch(`${apiUrl}/api/articles/${id}`, {
      method: 'PUT',
      body: updatedFormData,
    });

    if (!response.ok) {
      throw new Error('Failed to update article');
    }

    alert('Article updated successfully!');
    router.push(`/articles/${route.params.id}`);
  } catch (error: any) {
    console.error(error.message);
    alert('Failed to update the article');
  }
};

onMounted(() => {
  const id = route.params.id;
  fetchArticle(id);
});
</script>