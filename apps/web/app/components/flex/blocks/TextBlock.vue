<template>
  <div class="section-container py-8 md:py-16" :class="containerClasses">
    <div class="default-grid" v-if="componentSettings.layout === 'single'" :class="isInSbs ? 'half-grid' : ''">
      <div class="col-span-full" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col gap-5" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0 opacity-0 text-sm" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0 opacity-0" v-html="componentData.subheader"></h6>
        </div>
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
        </div>
      </div>
    </div>
    <div class="default-grid" v-if="componentSettings.layout === 'right'" :class="isInSbs ? 'half-grid' : ''">
      <div class="col-span-full" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col gap-5" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0 opacity-0 text-sm" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0 opacity-0" v-html="componentData.subheader"></h6>
        </div>
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
        </div>
      </div>
    </div>
    <div class="default-grid" v-if="componentSettings.layout === 'two-column'" :class="isInSbs ? 'half-grid' : ''">
      <div class="col-span-full " :class="isInSbs ? '' : 'md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6'">
        <div class="flex flex-col gap-5" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0 opacity-0 text-sm" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1> 
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0 opacity-0" v-html="componentData.subheader"></h6>
        </div>
      </div>

      <div class="col-span-full lg:col-span-3" :class="isInSbs ? '' : 'md:col-span-8 md:col-start-3 lg:col-start-4'">
        <div ref="firstColumnTextRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
        </div>
      </div>

      <div class="col-span-full lg:col-span-3" :class="isInSbs ? '' : 'md:col-span-8 md:col-start-3'">
        <div ref="secondColumnTextRef" class="opacity-0" v-if="componentData.secondColumnText" :class="getTextAlignment()">
          <PortableText :value="componentData.secondColumnText" />
        </div>
      </div>
    </div>
    <div class="default-grid" v-if="componentSettings.layout === 'left'" :class="isInSbs ? 'half-grid' : ''">
      <div class="col-span-full" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col gap-5" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0 opacity-0 text-sm" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0 opacity-0" v-html="componentData.subheader"></h6>
        </div>
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="[componentData.eyebrow || componentData.header || componentData.subheader ? 'mt-4' : '', getTextAlignment()]">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0" :class="getTextAlignment()">
          <Buttons :data="componentData.ctas"></Buttons>
        </div>
      </div>
    </div>
    <div class="default-grid" v-if="componentSettings.layout === 'center'" :class="isInSbs ? 'half-grid' : ''">
      <div class="col-span-full" :class="isInSbs ? '' : getLayoutPosition()">
        <div class="flex flex-col gap-5" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0 opacity-0 text-sm" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0 opacity-0" v-html="componentData.subheader"></h6>
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
  layout?: 'single' | 'two-column' | 'left' | 'center' | 'right';
  bodyText?: any[];
  secondColumnText?: any[];
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
const firstColumnTextRef = ref<HTMLElement | null>(null);
const secondColumnTextRef = ref<HTMLElement | null>(null);
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
  if (componentSettings.value.layout === 'single') {
    contentElements.push(textRef.value, buttonsRef.value);
  } else if (componentSettings.value.layout === 'two-column') {
    contentElements.push(firstColumnTextRef.value, secondColumnTextRef.value, buttonsRef.value);
  } else if (componentSettings.value.layout && ['left', 'center', 'right'].includes(componentSettings.value.layout)) {
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
  return getContainerClasses('background', 'text', 'padding', 'margin', 'width');
});

// Get text alignment classes based on layout
const getTextAlignment = () => {
  const layout = componentSettings.value.layout;
  switch (layout) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-left';
    case 'right':
      return 'text-left'; 
    default:
      return 'text-left';
  }
};

//Get layout positioning classes based on layout 
const getLayoutPosition = () => {
  const layout = componentSettings.value.layout;
  switch (layout) {
    case 'left':
      return 'md:col-start-1 md:col-span-7';
    case 'center':
      return 'md:col-start-4 md:col-span-6';
    case 'right':
      return 'md:col-start-7 md:col-span-7';
    default:
      return 'md:col-start-3 md:col-span-5';
  }
};
</script>
