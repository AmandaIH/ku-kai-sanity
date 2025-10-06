<template>
  <div>
    <!-- Internal Link -->
    <NuxtLink 
      v-if="link.linkType === 'internal' && hasValidPath" 
      :to="linkPath"
      :class="linkClasses"
      @click="handleClick"
    >
      <slot></slot>
    </NuxtLink>
    
    <!-- External Link -->
    <a 
      v-else-if="link.linkType === 'external' && hasValidPath" 
      :href="linkPath"
      :target="link.openInNewTab ? '_blank' : ''"
      :class="linkClasses"
      @click="handleClick"
    >
      <slot></slot>
    </a>
    
    <!-- Form Trigger -->
    <button 
      v-else-if="link.linkType === 'form'" 
      :class="linkClasses"
      @click="openForm"
    >
      <slot></slot>
    </button>
    
    <!-- Fallback for invalid links -->
    <span 
      v-else 
      :class="[linkClasses, 'opacity-50 cursor-not-allowed']"
    >
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface NavigationLink {
  linkType: 'internal' | 'external' | 'form'
  url?: string
  openInNewTab?: boolean
  formConfig?: {
    formId: string
    formTitle?: string
    formDescription?: string
  }
}

const props = defineProps<{
  link: NavigationLink
  class?: string
}>()

const emit = defineEmits<{
  click: [event: Event]
}>()

const linkPath = computed(() => {
  // Use the url directly from the menu API
  return props.link.url || ''
})

const hasValidPath = computed(() => {
  return linkPath.value && linkPath.value !== ''
})

const linkClasses = computed(() => {
  return props.class || ''
})

const handleClick = (event: Event) => {
  emit('click', event)
}

// Open form modal/overlay
const openForm = () => {
  const formId = props.link.formConfig?.formId
  const formTitle = props.link.formConfig?.formTitle
  const formDescription = props.link.formConfig?.formDescription
  
  if (!formId) {
    console.warn('Form ID is required for form links')
    return
  }
  
  const formData = {
    id: formId,
    title: formTitle,
    description: formDescription
  }
  
  // Dispatch custom event for FormModal to listen to
  if (process.client) {
    window.dispatchEvent(new CustomEvent('openForm', { 
      detail: formData 
    }))
  }
}
</script>