<template>
  <div :class="containerClasses">
    <div class="w-full" ref="imageRef">
      <cm-picture 
        v-if="componentData.image" 
        :image-object="componentData.image" 
        :crops="['default:800', 'md:1200', 'lg:1600']" 
        :classes="imageClasses"
      />
      <p v-if="componentData.imageCaption" class="text-sm text-gray-600 mt-4 text-center" v-html="componentData.imageCaption"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useGsapAnimations } from '~/composables/useGsapAnimations';
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';

// Define the component data interface
interface ImageBlockData {
  image?: any;
  imageAltText?: string;
  imageCaption?: string;
  imageStyle?: 'default' | 'rounded' | 'circular' | 'framed';
  customPadding?: any;
  customMargin?: any;
  container?: string;
}

const props = defineProps<{
  data: ImageBlockData;
  index?: number;
}>();

// Refs for animations
const imageRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation } = useGsapAnimations();

// Use the data directly
const componentData = computed(() => props.data);

// Dynamic classes for padding/margin
const { getContainerClasses } = useCheckmateFlexSettings(componentData);

const containerClasses = computed(() => {
  let classes = getContainerClasses('background', 'text', 'padding', 'margin', 'width');
  
  // Add default padding if no custom padding is set
  if (!componentData.value.customPadding) {
    classes.push('py-8', 'md:py-16');
  }
  
  return classes.join(' ');
});

// Setup animations
const setupAnimations = () => {
  if (imageRef.value) {
    try {
      // Set initial state
      gsap.set(imageRef.value, { opacity: 0, y: 30 });
      
      // Create simple fade-in animation
      const timeline = gsap.timeline();
      timeline.to(imageRef.value, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out" 
      });

      // Add scroll trigger
      scrollTriggerInstance.value = scrollTriggerAnimation(imageRef.value, timeline, {
        trigger: imageRef.value,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      });
    } catch (error) {
      console.error('Error setting up animations:', error);
    }
  }
};


/**
 * Image classes based on style
 */
const imageClasses = computed(() => {
  let classes = ['w-full', 'h-auto', 'object-cover'];
  
  // Image style
  switch (componentData.value.imageStyle) {
    case 'rounded':
      classes.push('rounded-lg');
      break;
    case 'circular':
      classes.push('rounded-full', 'aspect-square', 'object-cover');
      break;
    case 'framed':
      classes.push('border-4', 'border-gray-200', 'p-2', 'rounded-lg');
      break;
    default:
      classes.push('rounded-lg'); // Default to rounded corners
      break;
  }
  
  return classes.join(' ');
});

onMounted(() => {
  // Set up animations after component is mounted
  setupAnimations();
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instance if it exists
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
});
</script>
