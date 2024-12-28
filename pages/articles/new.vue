<template>
  <div>
    <h2>New Article</h2>

    <div>
      <div class="input-selector">
        <el-select v-model="selectedField" placeholder="Add Field">
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
              @input="updateFieldValue(index, $event.target.value)"
              class="input"
            />
          </template>
          <el-button class="delete-field" @click="removeField(index)">
            <img src="assets/icons/trash-bin.svg" class="icon" alt="trash bin" />
          </el-button>
        </div>
      </template>
    </div>

    <el-button type="primary" @click="newArticle">Create</el-button>
  </div>
</template>

<style scoped lang="scss">
.input {
  margin-bottom: 16px;
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
  }
  &-field {
    width: 100%;
    display: flex;
    gap: 1rem;

    .input {
      flex: 1;
    }
  } 
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormFieldsStore } from '~/stores/articles';
import { createArticle } from '~/services/api/articles';

const store = useFormFieldsStore();

const { formFields, availableFields } = store; // Expose store properties

const selectedField = ref(null);

const addField = (field) => {
  store.addField(field);
  selectedField.value = null; // Reset selection
};

const removeField = (index) => {
  store.removeField(index);
};

const onFileUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) store.handleFileUpload(index, file);
};

const newArticle  = async () => {
  const formData = new FormData();

  formFields.forEach((field, index) => {
    if (field.type === 'file' && field.value instanceof File) {
      formData.append(`file-${index}`, field.value);
    } else {
      formData.append(`field-${index}`, field.value);
    }
  });

  try {
    await createArticle(formData);
    store.clearForm();
  } catch (error) {
    console.error(error.message);
  }
};
</script>