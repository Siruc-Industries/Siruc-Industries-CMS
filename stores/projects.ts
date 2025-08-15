// Pinia Store: formFieldsStore.js
import { defineStore } from 'pinia';

export const useFormFieldsStore = defineStore('projectsFormFields', {
  state: () => ({
    formFields: [
      { field: 'input', name: 'title', type: null, value: '', placeholder: 'Title (Heading 1)', description: '' },
      { field: 'textarea', name: 'text', type: null, value: '', placeholder: 'Text' },
      { field: 'input', name: 'author', type: null, value: '', placeholder: 'Author' },
      { field: 'input', type: null, name: 'tabs', value: '', label: 'Tabs', placeholder: 'Tab1, Tab2, Tab3, ...' },
    ],
    availableFields: [
      { field: 'input', type: null, label: 'Title (Heading 1)', placeholder: 'Title (Heading 1)' },
      { field: 'input', type: null, label: 'Subtitle (Heading 2)', placeholder: 'Subtitle (Heading 2)' },
      { field: 'textarea', type: null, label: 'Text Area', placeholder: 'Text Area' },
      { field: 'input', type: 'file', label: 'File Uploader (main image)', description: '' },
      { field: 'input', type: null, label: 'Quote (Iconic Input)', placeholder: 'Quote (Iconic Input)' },
      { field: 'input', type: null, name: 'tabs', label: 'Tabs', placeholder: 'Tab1, Tab2, Tab3, ...' },
    ],
  }),
  actions: {
    addField(field: any) {
      this.formFields.push({ ...field, value: '' });
    },
    removeField(index: any) {
      if (confirm('Are you sure you want to delete this field?')) {
        this.formFields.splice(index, 1);
      }
    },
    updateFieldValue(index: any, value: any) {
      this.formFields[index].value = value;
    },
    handleFileUpload(index: any, file: any) {
      this.formFields[index].value = file;
    },
    clearForm() {
      this.formFields = this.formFields.map(field => ({
        ...field,
        value: field.type === 'file' ? '' : '',
      }));
    },
  },
}); 