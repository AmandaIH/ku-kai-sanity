<template>
  <div class="section-container py-8 md:py-16" :class="containerClasses">
    <div class="default-grid !gap-y-4">
      <!-- Header Section -->
      <div v-if="componentData.header && index === 0" class="col-span-full text-center">
        <h1 class="" v-html="componentData.header"></h1>
      </div>
      <div v-else-if="componentData.header" class="col-span-full md:col-start-5 md:col-span-5 text-center">
        <h2 class="text-2xl" v-html="componentData.header"></h2>
      </div>
      <div v-if="componentData.subheader" class="col-span-full text-center">
        <h6 class="text-base" v-html="componentData.subheader"></h6>
      </div>
      
      <!-- Logos Section -->
      <div class="col-span-full mt-8" v-if="componentData.logos && componentData.logos.length > 0">
        <div class="logos-container">
          <div class="logos-track">
            <div 
              v-for="(logo, logoIndex) in duplicatedLogos" 
              :key="`logo-${logoIndex}`"
              class="logo-item"
            >
              <cm-picture 
                :image-object="logo" 
                :crops="['default:200', 'md:300']" 
                classes="h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';

// Define the component data interface based on the actual data structure
interface LogoImage {
  _key: string;
  _type: 'image';
  alt: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

interface SliderBlockData {
  _key?: string;
  _type?: string;
  header?: string;
  subheader?: string;
  logos?: LogoImage[];
  container?: 'contained' | 'fullWidth';
  customMargin?: any;
  customPadding?: any;
}

const props = defineProps<{
  data: SliderBlockData;
  index?: number;
  isInSbs?: boolean;
}>();

// Use the data directly
const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);

// Initialize the flex settings composable
const { getContainerClasses } = useCheckmateFlexSettings(componentSettings);

// Container classes computed property
const containerClasses = computed(() => {
  return getContainerClasses('background', 'text', 'padding', 'margin', 'width');
});

// Duplicate logos for seamless infinite scroll
const duplicatedLogos = computed(() => {
  if (!componentData.value.logos || componentData.value.logos.length === 0) {
    return [];
  }
  
  // Create many duplicates to fill screen width and ensure seamless loop
  const logos = componentData.value.logos;
  const multiplier = Math.ceil(30 / logos.length); // Ensure at least 30 items for full coverage
  return Array(multiplier).fill(logos).flat();
});

</script>

<style scoped>
.logo-item {
  @apply flex items-center justify-center;
}

/* Logos container - Full width */
.logos-container {
  @apply w-full overflow-hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

/* Logos track - CSS animation */
.logos-track {
  @apply flex items-center;
  animation: scroll 30s linear infinite;
  width: max-content;
  display: flex;
}

.logos-track:hover {
  animation-play-state: paused;
}

/* Logo items */
.logo-item {
  @apply flex items-center justify-center px-6 md:px-8;
  flex-shrink: 0;
  white-space: nowrap;
}

/* Scroll animation - seamless loop */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 3));
  }
}
</style> 