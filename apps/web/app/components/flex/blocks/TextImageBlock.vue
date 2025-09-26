<template>
  <div class="py-16">
    <div class="px-8 md:px-16">
    <div class="" :class="isInSbs ? 'half-grid' : ''">

      <!-- Main content grid -->
      <div class="col-span-full grid grid-cols-1 md:grid-cols-12" :class="layoutClasses">
        
        <!-- Image column - always maintains its position -->
        <div ref="imageRef" class="opacity-0 overflow-hidden mb-8 md:mb-0" :class="imageColumnClass">
          <cm-picture class="w-full h-auto" 
            v-if="componentData.image" 
            :image-object="componentData.image" 
            :crops="['default:800', 'md:1000']" 
            :classes="imageClasses"
          />
        </div>

        <!-- Empty spacing div -->
        <div class="hidden md:block" :class="spacingColumnClass"></div>

        <!-- Text content column - always maintains its position -->
        <div :class="textColumnClass">
          <!-- Header section (eyebrow, header, subheader) -->
          <div class="mb-[1.875rem]" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
            <p ref="eyebrowRef" v-if="componentData.eyebrow" class="text-sm font-medium uppercase mb-[1.875rem]" v-html="componentData.eyebrow"></p>
            <div class="mb-[1.875rem]" ref="headerWrapperRef" v-if="componentData.header">
              <h2 v-if="index === 0" class="">
                <span v-html="componentData.header"></span>
              </h2>
              <h2 v-else class="h2 text-3xl">
                <span v-html="componentData.header"></span>
              </h2>
            </div>
            <h6 ref="subheaderRef" v-if="componentData.subheader" class="text-lg" v-html="componentData.subheader"></h6>
          </div>

          <div ref="textRef" v-if="componentData.bodyText" class="text-base mb-[2.5rem]">
            <PortableText :value="componentData.bodyText" />
          </div>

          <div class="" ref="buttonsRef" v-if="componentData.ctas && componentData.ctas.length > 0">
            <Buttons :data="componentData.ctas" />
          </div>
        </div>

      </div>
    </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { PortableText } from '@portabletext/vue';
import { useGsapAnimations } from '~/composables/useGsapAnimations';

// Define the component data interface
interface TextImageBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  bodyText?: any[];
  image?: any;
  imageAltText?: string;
  imageCaption?: string;
  imagePosition?: 'left' | 'right';
  layoutRatio?: '50-50' | '60-40' | '40-60';
  imageSize?: 'small' | 'medium' | 'large';
  imageStyle?: 'default' | 'rounded' | 'circular' | 'framed';
  ctas?: any[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
  customMargin?: any;
  customPadding?: any;
  container?: 'contained' | 'fullWidth';
}

const props = defineProps<{
  data: TextImageBlockData;
  index?: number;
  isInSbs?: boolean;
}>();

// Refs for animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const buttonsRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Use the data directly without Zod validation
const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);


// Setup all animations
const setupAnimations = () => {
  // Collect all headline elements
  const headlineElements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value
  ].filter(Boolean) as HTMLElement[];
  
  // Collect all elements for animation
  const elements = [
    ...headlineElements,
    imageRef.value,
    textRef.value,
    buttonsRef.value
  ].filter(Boolean) as HTMLElement[];

  if (elements.length > 0 && elements[0]) {
    try {
      // Create staggered animation using the composable
      const timeline = staggerAnimation(elements, {
        duration: 0.8,
        ease: "power3.out"
      }, 0.15);

      // Add scroll trigger using the composable
      scrollTriggerInstance.value = scrollTriggerAnimation(elements[0], timeline, {
        trigger: elements[0],
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
 * Layout classes based on ratio - now using 12-column grid
 */
const layoutClasses = computed(() => {
  // Always use 12 columns for maximum flexibility
  return 'md:grid-cols-12';
});

/**
 * Image column class - determines which column the image appears in
 */
const imageColumnClass = computed(() => {
  const isLeft = componentData.value.imagePosition === 'left';
  
  if (isLeft) {
    return 'md:order-1 md:col-span-5'; // 5/12 columns
  } else {
    return 'md:order-3 md:col-span-5'; // 5/12 columns
  }
});

/**
 * Text column class - determines which column the text appears in
 */
const textColumnClass = computed(() => {
  const isLeft = componentData.value.imagePosition === 'left';
  
  if (isLeft) {
    return 'md:order-3 md:col-span-5'; // 5/12 columns
  } else {
    return 'md:order-1 md:col-span-5'; // 5/12 columns
  }
});

/**
 * Spacing column class - creates the 2-column gap between image and text
 */
const spacingColumnClass = computed(() => {
  const isLeft = componentData.value.imagePosition === 'left';
  
  if (isLeft) {
    return 'md:order-2 md:col-span-2'; // 2/12 columns for spacing (between image and text)
  } else {
    return 'md:order-2 md:col-span-2'; // 2/12 columns for spacing (between text and image)
  }
});

/**
 * Image classes based on style and size
 */
const imageClasses = computed(() => {
  let classes = ['w-full h-auto'];
  
  // Image style
  switch (componentData.value.imageStyle) {
    case 'rounded':
      classes.push('rounded-lg');
      break;
    case 'circular':
      classes.push('rounded-full');
      break;
    case 'framed':
      classes.push('border-4 border-gray-200 p-2');
      break;
    default:
      break;
  }
  
  // Image size - removed max-width constraints to allow full height filling
  // The image will now fill the available height regardless of size setting
  
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

<style scoped>
/* Ensure proper image container behavior */
.overflow-hidden {
  overflow: hidden;
}
</style>