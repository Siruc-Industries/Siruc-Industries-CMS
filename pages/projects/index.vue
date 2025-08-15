<template>
  <div>
    <h1 class="title">Projects</h1>
    <div v-if="projects.length">
      <el-card v-for="project in projects" :key="project.id" class="card">
        <template #header>
          <div class="header">
            <div class="header-info">
              <NuxtLink :to="`/projects/${project.id}`">
                <span>{{ project.title }}</span>
              </NuxtLink>
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
                    <NuxtLink :to="`/projects/edit/${project.id}`">
                      <el-dropdown-item>Edit</el-dropdown-item>
                    </NuxtLink>
                    <el-dropdown-item @click="openDialog(project.id)">Delete</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
        <div class="text item">
          <div v-html="project?.text" class="project-content"></div>
        </div>
        <template #footer>
          <div class="footer">
            <div class="footer-info">
              <p>{{ project.author }}</p>
              <span class="span">|</span>
              <i>{{ project.createdAt }}</i>
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <div v-else>
      <h3>No projects yet!</h3>
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

import { ref, onMounted } from 'vue';
import { fetchProjects } from '~/services/api/projects'
import type { Project } from '~/services/types/Project';

const projects = ref<Project[]>([]);
const dialogVisible = ref(false);
const chosenProjectId = ref();

const openDialog = (id: number) => {
  chosenProjectId.value = id;
  dialogVisible.value = true;
};

const confirmDelete = async () => {
  dialogVisible.value = false;
  console.log(`>>> ID: ${chosenProjectId.value}`);
  
  try {
    const response = await fetch(`http://localhost:5000/api/projects/${chosenProjectId.value}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

    console.log('Project deleted successfully');
    
    // Fetch the updated list of projects
    await getProjectsList();
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};

const getProjectsList = async () => {
  try {
    const fetchedProjects = await fetchProjects();
    projects.value = fetchedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    projects.value = [];
  }
}

// Fetch projects when the component is mounted
onMounted(getProjectsList);
</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
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
  margin-bottom: 16px;
}

.text {
  &.item {
    margin-bottom: 16px;
  }
}

.footer {
  &-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .span {
      color: var(--el-color-text-placeholder);
    }
    
    i {
      color: var(--el-color-text-placeholder);
      font-style: normal;
    }
  }
}

.project-content {
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 