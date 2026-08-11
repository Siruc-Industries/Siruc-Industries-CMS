<template>
  <div class="container">
    <h1>{{ project?.title }}</h1>
    <div v-html="project?.text" class="content"></div>
    <img
      v-if="project?.image"
      :src="`http://localhost:5000${project.image}`"
      alt="Project image"
      class="card-image"
    />
    <div v-if="project?.tabs" class="tabs">
      <div v-for="tab in project?.tabs" :key="tab" class="tab">
        {{ tab }}
      </div>
    </div>
    <p>Written by: {{ project?.author }}</p>
    <p>Published on: {{ project?.createdAt }}</p>

    <div>
      <NuxtLink :to="`/projects/edit/${project?.id}`">
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
      <span>Are you sure you want to delete this project?</span>
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
import type { Project } from '~/services/types/Project';

const route = useRoute();
const router = useRouter();
const project = ref<Project | null>(null);
const dialogVisible = ref(false);

const isLoading = useState('isLoading');

const loadProject = async (id: any) => {
  isLoading.value = true
  try {
    const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.status}`);
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

    project.value = data;
  } catch (error: any) {
    console.error('Fetch projects error:', error.message);
    // Allow the frontend to proceed even if the API call fails
    project.value = null; // Fallback to an empty array
  } finally {
    isLoading.value = false
  }
};

const openDialog = () => {
  dialogVisible.value = true;
};

const confirmDelete = async () => {
  dialogVisible.value = false;
  const id = route.params.id;

  try {
    const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

    console.log('Project deleted successfully');
    
    // Fetch the updated list of projects
    router.push('/projects')
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};


onMounted(() => {
  const id = route.params.id;
  loadProject(id);
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
</style> 