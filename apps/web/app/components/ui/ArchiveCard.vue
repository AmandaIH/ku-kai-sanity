<template>
  <div class="archive-card relative overflow-hidden group h-[600px]">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <CmPicture 
        v-if="item.featuredImage"
        :image-object="item.featuredImage" 
        :crops="['default:600', 'md:800']" 
        :lazy="true"
        :classes="'w-full h-full object-cover'"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/25"></div>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between p-8 text-white">
      <div class="flex flex-col gap-2">
        <!-- Show date only for articles, not portfolios -->
        <div v-if="(item.date || item._createdAt) && item._type === 'article'" class="text-sm font-medium uppercase tracking-wide opacity-90">
          {{ formatDate(item.date || item._createdAt || '') }}
        </div>
        <div v-if="item.title" class="text-xl font-bold leading-tight line-clamp-3">
          {{ item.title }}
        </div>
       
      </div>

      <div class="flex justify-start items-center gap-1">
        <!-- Debug info -->
        <div style="background: lime; color: black; padding: 5px; font-size: 12px; margin-bottom: 5px;">
          DEBUG: itemPath={{ itemPath }}, hasValidPath={{ hasValidPath }}, buttonClasses={{ buttonClasses }}
        </div>
        
        <NuxtLink 
          :to="itemPath" 
          :class="buttonClasses" 
          @click="handleClick"
          style="background: red !important; color: white !important; border: 5px solid yellow !important; font-size: 24px !important; padding: 20px !important; display: block !important; cursor: pointer !important; z-index: 99999 !important; position: relative !important;"
        >
          {{ buttonText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ArchiveItem {
  _id: string
  _type?: string
  title: string
  slug: {
    current: string
  }
  featuredImage?: any
  date?: string
  _createdAt?: string
  headline?: string
}

interface Props {
  item: ArchiveItem
  buttonVariant?: string
  buttonText?: string
}

const props = defineProps<Props>()

// Computed item path
const itemPath = computed(() => {
  if (props.item.slug?.current) {
    return `/${props.item.slug.current}`
  }
  return '/'
})

// Check if the button has a valid path
const hasValidPath = computed(() => {
  return props.item.slug?.current && props.item.slug.current !== ''
})

// Computed button classes
const buttonClasses = computed(() => {
  const classes = ['btn', 'uppercase']
  
  if (props.buttonVariant) {
    classes.push(`btn-${props.buttonVariant}`)
  } else {
    classes.push('btn-primary') // Default variant
  }
  
  return classes.join(' ')
})

// Computed button text
const buttonText = computed(() => {
  return props.buttonText || 'Read More'
})

// Format date utility
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Debug click handler
const handleClick = (event: Event) => {
  console.log('Button clicked!', {
    itemPath: itemPath.value,
    buttonClasses: buttonClasses.value,
    hasValidPath: hasValidPath.value,
    item: props.item,
    event
  })
}

// Debug on mount to see what data we have
onMounted(() => {
  console.log('ArchiveCard mounted with:', {
    item: props.item,
    itemPath: itemPath.value,
    hasValidPath: hasValidPath.value,
    buttonClasses: buttonClasses.value
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure button is clickable and has proper cursor */
.archive-card .btn {
  cursor: pointer !important;
  pointer-events: auto !important;
  position: relative;
  z-index: 999;
}

/* Ensure no other elements are blocking the button */
.archive-card .btn:hover {
  cursor: pointer !important;
}

/* Make sure the button container doesn't block clicks */
.archive-card .flex.justify-start.items-center.gap-1 {
  pointer-events: auto !important;
  position: relative;
  z-index: 999;
}

/* Temporary debug styling to make button very obvious */
.archive-card .btn,
.archive-card a.btn,
.archive-card .btn-primary,
.archive-card a.btn-primary {
  background-color: red !important;
  color: white !important;
  border: 3px solid yellow !important;
  font-size: 20px !important;
  padding: 20px !important;
  cursor: pointer !important;
  pointer-events: auto !important;
  position: relative;
  z-index: 9999 !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  width: auto !important;
  height: auto !important;
}
</style>
