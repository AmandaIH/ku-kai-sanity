<template>
  <button 
    class="flex gap-4 items-center btn" 
    :class="[buttonClasses, additionalClasses]"
    @click="openForm"
  >
    {{ buttonText }}
  </button>
</template>

<script setup>
const props = defineProps({
  button: {
    type: Object,
    required: true,
    default: function() {
      return {}
    }
  },
  additionalClasses: {
    type: String,
    default: ''
  }
});

const buttonClasses = computed(() => {
  const classes = ['btn'];
  
  if (props.button.variant) {
    classes.push(`btn-${props.button.variant}`);
  } else {
    classes.push('btn-primary'); // Default variant
  }
  
  return classes.join(' ');
});

const buttonText = computed(() => {
  return props.button.linkTitle || props.button.formConfig?.formTitle || 'Open Form';
});

// Open form modal/overlay
const openForm = () => {
  const formId = props.button.formConfig?.formId;
  const formTitle = props.button.formConfig?.formTitle;
  const formDescription = props.button.formConfig?.formDescription;
  
  if (!formId) {
    console.warn('Form ID is required for form buttons');
    return;
  }
  
  const formData = {
    id: formId,
    title: formTitle,
    description: formDescription
  };
  
  // Dispatch custom event to open form modal
  if (process.client) {
    window.dispatchEvent(new CustomEvent('openForm', { 
      detail: formData 
    }));
  }
};
</script>
