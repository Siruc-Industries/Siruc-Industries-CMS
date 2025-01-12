<template>
  <div>
    <h2>New Article</h2>

    <div>
      <div class="input-selector">
        <el-select v-model="selectedField" placeholder="Add Field" value-key="label">
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
              @change="onFileUpload($event, index)"
            />
            <el-input
              v-model="field.description"
              :placeholder="'Provide a description for the image'"
              :clearable="true"
              :disabled="!field.value"
            />
          </template>
          <template v-else-if="field.field === 'input' || field.field === 'textarea'">
            <el-input
              :type="field.field"
              v-model="field.value"
              :placeholder="field.placeholder"
              class="input"
            />
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
      <span>Are you sure you want to create a new article?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmCreateArticle">Confirm</el-button>
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

.create-button {
  width: 100%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormFieldsStore } from '~/stores/articles';
import { createArticle } from '~/services/api/articles';

const store = useFormFieldsStore();

const { formFields, availableFields } = store; // Expose store properties

const selectedField = ref(null);
const isDialogVisible = ref(false);

const addField = (field: any) => {
  store.addField(field);
  selectedField.value = null; // Reset selection
};

const removeField = (index: any) => {
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

const confirmCreateArticle = async () => {
  isDialogVisible.value = false;

  const formData = new FormData();
  formFields.forEach((field: any, index: any) => {
    if (field.type === 'file' && field.value instanceof File) {
      formData.append(`file-${index}`, field.value);
      if (field.description) {
        formData.append(`file-description-${index}`, field.description);
      }
    } else {
      formData.append(`field-${index}`, field.value);
    }
  });

  try {
    await createArticle(formData);
    store.clearForm();
  } catch (error: any) {
    console.error(error.message);
  }
};
</script>