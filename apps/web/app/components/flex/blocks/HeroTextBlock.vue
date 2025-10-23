<template>
  <div class="pt-32 pb-2 md:pt-40 md:pb-4">
    <div class="px-8 md:px-16">
      <div class="w-full relative overflow-hidden flex items-center" :id="'hero-text-' + (index || 0)" :class="containerClasses">
    <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.opacity || 0) / 100 }"></div>

    <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600']" 
      :classes="['absolute inset-0 flex items-center z-0 w-full h-full object-cover absolute inset-0'].join(' ')" :lazy="(index || 0) > 0"></cm-picture>
    
    <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="['w-full h-full absolute inset-0 z-0 h-full w-full object-cover'].join(' ')"></hero-cm-video>

    <div class="w-full relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-items-center">
        <!-- Mobile: single column, centered -->
        <div class="w-full md:hidden text-center">
          <div class="flex flex-col gap-4" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
            <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow text-sm font-medium uppercase tracking-wide text-black" v-html="componentData.eyebrow"></p>
            <div ref="headerWrapperRef" class="" v-if="componentData.header">
              <h2 class="h2 !mb-0 text-black">
                <span v-html="componentData.header"></span>
              </h2>
            </div>
            <h6 ref="subheaderRef" v-if="componentData.subheader" class="text-lg text-black leading-[1.4]" v-html="componentData.subheader"></h6>
          </div>
        </div>
        
        <!-- Desktop: eyebrow and header in columns 3-10 (spans 8 columns), centered -->
        <div class="hidden md:block md:col-span-8 md:col-start-3 text-center">
          <div class="flex flex-col gap-4" v-if="componentData.eyebrow || componentData.header">
            <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow text-sm font-medium uppercase tracking-wide text-black" v-html="componentData.eyebrow"></p>
            <div ref="headerWrapperRef" class="" v-if="componentData.header">
              <h2 class="h2 !mb-0 text-black">
                <span v-html="componentData.header"></span>
              </h2>
            </div>
          </div>
        </div>
        
        <!-- Desktop: subheader in columns 4-9 (spans 6 columns), centered -->
        <div class="hidden md:block md:col-span-6 md:col-start-4 text-center" v-if="componentData.subheader">
          <h6 ref="subheaderRef" class="text-lg text-black leading-[1.4]" v-html="componentData.subheader"></h6>
        </div>
      </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useGsapAnimations } from '../../../composables/useGsapAnimations';

// Define the component data interface
interface HeroTextBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  backgroundType?: 'image' | 'video';
  backgroundImage?: any;
  backgroundVideo?: any;
  opacity?: number;
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
}

const props = defineProps<{
  data: HeroTextBlockData;
  index?: number;
}>();

// Refs for GSAP animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

const componentData = computed(() => props.data);

// Setup all animations
const setupAnimations = () => {
  const headlineElements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value
  ].filter(Boolean) as HTMLElement[];

  if (headlineElements.length > 0 && headlineElements[0]) {
    try {
      // Set initial state for all elements
      headlineElements.forEach(element => {
        gsap.set(element, { opacity: 0, y: 30 });
      });

      // Create staggered animation using the composable
      const timeline = staggerAnimation(headlineElements, {
        duration: 0.6,
        ease: "power3.out"
      }, 0.1);

      // Add scroll trigger using the composable
      scrollTriggerInstance.value = scrollTriggerAnimation(headlineElements[0], timeline, {
        trigger: headlineElements[0],
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

const heroType = computed(() => {
  return componentData.value.backgroundType || 'image';
});

const containerClasses = computed(() => {
  return 'min-h-[25vh]';
});

</script>
