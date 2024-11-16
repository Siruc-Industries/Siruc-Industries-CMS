<template>
  <div>
    <h2>
      New Article
    </h2>
    
    <input class="input" v-model="formData.title" placeholder="title" >
    <textarea class="input" v-model="formData.text" placeholder="text"></textarea>
    <input class="input" v-model="formData.author" placeholder="author" >
       
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
        date: '',
      },
    };
  },
  methods: {
    createArticle() {
      // Add the current date to the formData
      this.formData.date = new Date().toISOString().split('T')[0];

      // API call
      fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create article');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Article created:', data);
          alert('success')
          // Redirect or reset the form
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
  },
};
</script>