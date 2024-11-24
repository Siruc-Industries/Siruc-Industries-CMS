<template>
  <div>
    <h2>
      New Article
    </h2>
    
    <input class="input" v-model="formData.title" placeholder="title" >
    <textarea class="input" v-model="formData.text" placeholder="text"></textarea>
    <input class="input" v-model="formData.author" placeholder="author" >
    <input type="file" @change="handleFileUpload" ref="fileInput"/>

    <el-button type="primary" @click="createArticle">Create</el-button>
  </div>
</template>
<style lang="scss">
.input {
  margin-bottom: 16px;
  width: 100%;
}
</style>
<script scoped>
export default {
  data() {
    return {
      formData: {
        title: '',
        text: '',
        author: '',
      },
      selectedImage: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedImage = event.target.files[0];
    },
    createArticle() {
      if (!this.formData.title || !this.formData.text || !this.formData.author) {
        alert('Please fill in all fields');
        return;
      }
      const apiUrl = process.env.API_BASE_URL || 'http://localhost:5000';

      // Create FormData object
      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('text', this.formData.text);
      formData.append('author', this.formData.author);
      formData.append('image', this.selectedImage);

      // API call
      fetch(`${apiUrl}/api/articles`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create article');
          }
          return response.json();
        })
        .then((data) => {
          alert('Article created successfully.');
          this.clearForm();
        })
        .catch((error) => { 
          console.error(error.message);
        });
    },
    clearForm() {
      this.formData = {
        title: '',
        text: '',
        author: '',
        date: '',
      };
      this.selectedImage = null;
      // Reset the file input value
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = null;
      }
    },
  },
};
</script>