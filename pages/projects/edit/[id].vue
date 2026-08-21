<template>
  <div>
    <h2>Edit Project</h2>
    
    <!-- Form Inputs -->
    <input class="input" v-model="formData.title" placeholder="Title" />
    <textarea class="input" v-model="formData.text" placeholder="Text"></textarea>
    <input class="input" v-model="formData.author" placeholder="Author" />

    <!-- Image Preview and Upload -->
    <div class="image-holder">
      <div>
        <img
          v-if="project?.image"
          :src="`http://localhost:5000${project.image}`"
          alt="Project image"
          class="card-image"
        />
      </div>
      <input type="file" @change="handleFileUpload" ref="fileInput" />
    </div>

    <!-- Submit Button -->
    <el-button type="primary" @click="updateProject">Update</el-button>
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
  const project = ref<any>(null);


  const isLoading = useState('isLoading');

  const formData = ref({
    title: '',
    text: '',
    author: '',
  });
  const selectedImage = ref<File | null>(null);

  // Fetch project details to populate the form
  const fetchProject = async (id: any) => {
    isLoading.value = true;
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status}`);
      }
      const data = await response.json();

      // Populate form data
      formData.value = {
        title: data.title,
        text: data.text,
        author: data.author,
      };
      project.value = data;
    } catch (error: any) {
      console.error('Fetch project error:', error.message);
      alert('Failed to load project data');
    } finally {
      isLoading.value = false;
    }
  };

  // Handle file upload
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      selectedImage.value = target.files[0];
    }
  };

  // Update project
  const updateProject = async () => {    
    isLoading.value = true;

    if (!formData.value.title || !formData.value.text || !formData.value.author) {
      alert('Please fill in all fields');
      isLoading.value = false;
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
      const response = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'PUT',
        body: updatedFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      alert('Project updated successfully!');
      router.push(`/projects/${route.params.id}`);
    } catch (error: any) {
      console.error(error.message);
      alert('Failed to update the project');
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    const id = route.params.id;
    fetchProject(id);
  });
</script> 