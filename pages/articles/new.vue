<template>
  <div>
    <h2>
      New Article
    </h2>
    
    <input class="input" v-model="formData.title" placeholder="title" >
    <textarea class="input" v-model="formData.text" placeholder="text"></textarea>
    <input class="input" v-model="formData.author" placeholder="author" >
    <input type="file" @change="handleFileUpload" ref="fileInput"/>

    <el-button type="primary" @click="newArticle">Create</el-button>
  </div>
</template>

<style scoped lang="scss">
.input {
  margin-bottom: 16px;
  width: 100%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { createArticle } from '~/services/api/articles';

const formData = ref({
  title: '',
  text: '',
  author: '',
})
const selectedImage = ref<null | File>(null);
// Reference to the file input element
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedImage.value = target.files[0];
  }
};

// old
// const handleFileUpload = (event: any) => {
//   selectedImage.value = event.target.files[0];
// };

const newArticle = async () => {
  if (!formData.value.title || !formData.value.text || !formData.value.author) {
    alert('Please fill in all fields');
    return;
  }
  const apiUrl = process.env.API_BASE_URL || 'http://localhost:5000';

  // Create FormData object
  const form = new FormData();
  form.append('title', formData.value.title);
  form.append('text', formData.value.text);
  form.append('author', formData.value.author);
  if (selectedImage.value) {
    form.append('image', selectedImage.value);
  }

  try {
    await createArticle(form);
    alert('Article created successfully.');
    clearForm();
  } catch (error: any) { 
      console.error(error.message);
  }
}

const clearForm = () => {
  formData.value = {
    title: '',
    text: '',
    author: '',
  };
  selectedImage.value = null;
  // Safely reset the file input element
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>