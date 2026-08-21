<template>
  <div>
    <h2>New Project</h2>

    <div>
      <div class="input-selector">
        <el-select :disabled="false" v-model="selectedField" placeholder="Choose tags for your project" value-key="label">
          <el-option 
            v-for="field in availableFields" 
            :key="field.label" 
            :label="field.label" 
            :value="field" 
          />
        </el-select>
        <el-button type="primary" :disabled="!selectedField" @click="addField(selectedField)">Add</el-button>
      </div>
    </div>

    <div class="form-wrapper">
      <template v-for="(field, index) in formFields" :key="index">
        <div class="form-field">
          <template v-if="field.type === 'file'">
            <input
              type="file"
              name="file"
              @change="onFileUpload($event, index)"
            />
            <el-input
              v-model="field.description"
              :placeholder="'Provide a description for the image'"
              :clearable="true"
            />
          </template>
          <template v-else-if="field.field === 'input'">
            <el-input
              :type="field.field"
              v-model="field.value"
              :placeholder="field.placeholder"
              class="input"
            />
          </template>
          <template v-else-if="field.field === 'textarea'">
            <ClientOnly>
              <div class="editor-container">
                <div :id="`editor-${index}`" :value="field.value"></div>
              </div>
            </ClientOnly>
          </template>
          <template v-else>
            <component
              :is="field.field"
              v-model="field.value"
              :placeholder="field.placeholder"
              :value="field.value"
              class="input"
            />
          </template>
          <div class="move-btns">
            <el-button class="move-up" @click="moveFieldUp(index)" :disabled="index === 0">
              <img src="assets/icons/arrow-up.svg" class="icon" alt="move up" />
            </el-button>
            <el-button class="move-down" @click="moveFieldDown(index)" :disabled="index === formFields.length - 1">
              <img src="assets/icons/arrow-down.svg" class="icon" alt="move down" />
            </el-button>
          </div>
          <el-button class="delete-field" @click="removeField(index)">
            <img src="assets/icons/trash-bin.svg" class="icon" alt="trash bin" />
          </el-button>
        </div>
      </template>
    </div>

    <el-button type="primary" @click="showConfirmationDialog" class="create-button">Create</el-button>

    <!-- Confirmation Dialog -->
    <el-dialog
      title="Confirmation"
      v-model="isDialogVisible"
      width="360px"
      align-center
    >
      <span>Are you sure you want to create a new project?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmCreateProject">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.input {
  width: 100%;
}

.input-selector {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 4rem;
  gap: 1rem;
}

.form {
  &-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  &-field {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;

    .input {
      flex: 1;
    }

    .move-btns  {
      display: flex;
      flex-direction: column;
    }

    .move-up,
    .move-down {
      margin: 0;
      width: 30px;
      height: 10px;
    }
  } 
}

.editor-container {
  width: 100%;
}

.create-button {
  width: 100%;
}
</style>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { useFormFieldsStore } from '~/stores/projects';
import { createProject } from '~/services/api/projects';

const store = useFormFieldsStore();
const router = useRouter();

const { formFields, availableFields } = store;

const selectedField = ref<{ label: string; field: string; placeholder: string }>({
  label: '',
  field: '',
  placeholder: ''
});
const isDialogVisible = ref(false);

const addField = (field: any) => {
  store.addField(field);
  selectedField.value = {
    label: '',
    field: '',
    placeholder: ''
  };

  if (field.field === 'textarea') {
    initializeQuill(formFields.length - 1);
  }
};

const quillInstances = ref<{ [key: number]: any }>({});

const initializeQuill = async (index: number) => {
  // Only initialize on client side
  if (!process.client) return;

  // Dynamically import Quill and CSS only on client
  const { default: Quill } = await import('quill');
  await import('quill/dist/quill.snow.css');
  
  // Wait for next tick to ensure DOM is updated
  nextTick(() => {
    const editorElement = document.getElementById(`editor-${index}`);
    if (editorElement && !quillInstances.value[index]) {
      quillInstances.value[index] = new Quill(`#editor-${index}`, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });

      // Set initial content if field has a value
      if (formFields[index].value) {
        quillInstances.value[index].root.innerHTML = formFields[index].value;
      }

      // Listen for content changes and update field.value
      quillInstances.value[index].on('text-change', () => {
        const content = quillInstances.value[index].root.innerHTML;
        formFields[index].value = content;
      });
    }
  });
};

onMounted(() => {
  if (process.client) {
    formFields.forEach((field: any, index: number) => {
      if (field.field === 'textarea') {
        initializeQuill(index);
      }
    });
  }
});

const removeField = (index: any) => {
  // Clean up Quill instance if it exists
  if (quillInstances.value[index]) {
    delete quillInstances.value[index];
  }
  store.removeField(index);
};

const onFileUpload = (event: any, index: any) => {
  const file = event.target.files[0];
  if (file) store.handleFileUpload(index, file);
};

const moveFieldUp = (index: any) => {
  if (index > 0) {
    const temp = formFields[index];
    formFields[index] = formFields[index - 1];
    formFields[index - 1] = temp;
  }
};

const moveFieldDown = (index: any) => {
  if (index < formFields.length - 1) {
    const temp = formFields[index];
    formFields[index] = formFields[index + 1];
    formFields[index + 1] = temp;
  }
};

const showConfirmationDialog = () => {
  isDialogVisible.value = true;
};

const confirmCreateProject = async () => {
  isDialogVisible.value = false;

  const formData = new FormData();
  formFields.forEach((field: any, index: any) => {
    if (field.type === 'file' && field.value instanceof File) {
      formData.append(`image`, field.value);
      // formData.append(`file-${index}`, field.value);
      if (field.description) {
        formData.append(`image-description`, field.description);
      }
    } else if (field.field === 'textarea' && quillInstances.value[index]) {
      // Get content directly from Quill instance for textarea fields
      const content = quillInstances.value[index].root.innerHTML;
      formData.append(field.name, content);
    } else if (field.name === 'tabs') {
      const tabsArray = field.value.split(',').map((tab: string) => tab.trim());
      formData.append('tabs', JSON.stringify(tabsArray));
    } else {
      formData.append(field.name, field.value);
    }
  });

  try {
    const newProjectResponse = await createProject(formData);
    store.clearForm();

    await router.push(`/projects/${newProjectResponse.id}`);
  } catch (error: any) {
    console.error(error.message);
  }
};
</script> 