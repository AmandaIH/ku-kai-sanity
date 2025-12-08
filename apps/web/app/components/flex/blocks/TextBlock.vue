<template>
  <div :class="containerClasses">
    <div class="px-8 md:px-16 max-w-[1480px] mx-auto py-8 md:py-16">
    <!-- RIGHT LAYOUT: Text aligned to the right side of the grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16" v-if="componentSettings.layout === 'right'" :class="isInSbs ? 'md:grid-cols-6' : ''">
      <div class="col-span-1 md:col-span-12 gap-8" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow opacity-0 text-sm font-medium uppercase" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h2 v-if="index === 0" class=" !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
            <h2 v-else class="h2 !mb-4">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="opacity-0" v-html="componentData.subheader"></h6>
        </div>
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
        </div>
      </div>
    </div>
    <!-- LEFT LAYOUT: Text aligned to the left side of the grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16" v-if="componentSettings.layout === 'left'" :class="isInSbs ? 'md:grid-cols-6' : ''">
      <div class="col-span-1 md:col-span-12" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow opacity-0 text-sm font-medium uppercase" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h2 v-if="index === 0" class="!mb-0">
              <span v-html="componentData.header"></span>
            </h2>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="opacity-0" v-html="componentData.subheader"></h6>
        </div>
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
        </div>
      </div>
    </div>
    <!-- CENTER LAYOUT: Text centered in the middle of the grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 py-8 md:py-16" v-if="componentSettings.layout === 'center'" :class="isInSbs ? 'md:grid-cols-6' : ''">
      <div class="col-span-1 md:col-span-12" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow opacity-0 text-sm font-medium uppercase" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h2 v-if="index === 0" class="!mb-4">
              <span v-html="componentData.header"></span>
            </h2>
            <h2 v-else class="h2 !mb-4">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="opacity-0" v-html="componentData.subheader"></h6>
        </div>
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
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
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';

// Define the component data interface
interface TextBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  layout?: 'left' | 'center' | 'right';
  bodyText?: any[];
  ctas?: any[];
  backgroundColor?: string;
  textColor?: string;
  customMargin?: any;
  customPadding?: any;
  width?: string;
  container?: 'contained' | 'fullWidth';
  spacing?: string; 
}

const props = defineProps<{
  data: TextBlockData;
  index?: number;
  isInSbs?: boolean;
}>();

// Refs for animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const buttonsRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Use the data directly without Zod validation
const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);

// Initialize the flex settings composable
const { getContainerClasses } = useCheckmateFlexSettings(componentSettings);

// Setup all animations
const setupAnimations = () => {
  // Collect all headline elements
  const headlineElements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value
  ].filter(Boolean) as HTMLElement[];
  
  // Collect content elements based on layout
  const contentElements = [];
  if (componentSettings.value.layout && ['left', 'center', 'right'].includes(componentSettings.value.layout)) {
    contentElements.push(textRef.value, buttonsRef.value);
  }
  
  // Collect all elements for animation
  const elements = [
    ...headlineElements,
    ...contentElements.filter(Boolean)
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

// Container classes
const containerClasses = computed(() => {
  let classes = getContainerClasses('background', 'text', 'padding', 'margin', 'width');
  
  // Add default padding if no custom padding is set
  if (!componentSettings.value.customPadding) {
    classes.push('py-16');
  }
  
  return classes.join(' ');
});

// Get text alignment classes based on layout
// NOTE: Currently all layouts use text-left, but this can be customized per layout
const getTextAlignment = () => {
  const layout = componentSettings.value.layout;
  switch (layout) {
    case 'left':
      return 'text-left';   // LEFT: Text aligned to the left
    case 'center':
      return 'text-left';   // CENTER: Currently left-aligned (can be changed to 'text-center')
    case 'right':
      return 'text-left';   // RIGHT: Currently left-aligned (can be changed to 'text-right')
    default:
      return 'text-left';   // DEFAULT: Text aligned to the left
  }
};

//Get layout positioning classes based on layout 
const getLayoutPosition = () => {
  const layout = componentSettings.value.layout;
  switch (layout) {
    case 'left':
      return 'md:col-start-1 md:col-span-5'; // LEFT: Starts at column 1, spans 5 columns
    case 'center':
      return 'md:col-start-3 md:col-span-8'; // CENTER: Starts at column 4, spans 6 columns
    case 'right':
      return 'md:col-start-8 md:col-span-5'; // RIGHT: Starts at column 8, spans 5 columns
    default:
      return 'md:col-start-4 md:col-span-6'; // DEFAULT: Centered (same as center)
  }
};
</script>
