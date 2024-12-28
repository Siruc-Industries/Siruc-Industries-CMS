// Pinia Store: formFieldsStore.js
import { defineStore } from 'pinia';

export const useFormFieldsStore = defineStore('formFields', {
  state: () => ({
    formFields: [
      { field: 'input', type: null, value: '', placeholder: 'Title (Heading 1)' },
      { field: 'textarea', type: null, value: '', placeholder: 'Text' },
      { field: 'input', type: null, value: '', placeholder: 'Author' },
    ],
    availableFields: [
      { field: 'input', type: null, label: 'Title (Heading 1)', placeholder: 'Title (Heading 1)' },
      { field: 'input', type: null, label: 'Subtitle (Heading 2)', placeholder: 'Subtitle (Heading 2)' },
      { field: 'textarea', type: null, label: 'Text Area', placeholder: 'Text Area' },
      { field: 'input', type: 'file', label: 'File Uploader' },
      { field: 'input', type: null, label: 'Quote (Iconic Input) 123', placeholder: 'Quote (Iconic Input) qwe' },
    ],
  }),
  actions: {
    addField(field) {
      this.formFields.push({ ...field, value: '' });
    },
    removeField(index) {
      if (confirm('Are you sure you want to delete this field?')) {
        this.formFields.splice(index, 1);
      }
    },
    updateFieldValue(index, value) {
      this.formFields[index].value = value;
    },
    handleFileUpload(index, file) {
      this.formFields[index].value = file;
    },
    clearForm() {
      this.formFields = this.formFields.map(field => ({
        ...field,
        value: field.type === 'file' ? null : '',
      }));
    },
  },
});
