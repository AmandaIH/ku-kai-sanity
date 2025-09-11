<template>
  <div class="w-full relative overflow-hidden flex items-center" :id="'hero-small-' + (index || 0)" :class="containerClasses">
    <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.opacity || 0) / 100 }"></div>

    <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600']" 
      :classes="['absolute inset-0 flex items-center z-0 w-full h-full object-cover absolute inset-0'].join(' ')" :lazy="(index || 0) > 0"></cm-picture>
    
    <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="['w-full h-full absolute inset-0 z-0 h-full w-full object-cover'].join(' ')"></hero-cm-video>

    <div class="w-full px-4 sm:px-15 relative z-10">
      <div class="flex flex-col justify-center md:flex-row md:justify-between md:items-center text-white">
        <div class="w-full md:w-7/12">
          <div class="flex flex-col gap-4" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
            <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0 opacity-0 text-sm font-medium uppercase tracking-wide" v-html="componentData.eyebrow"></p>
            <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
              <h2 class="h2 !mb-0">
                <span v-html="componentData.header"></span>
              </h2>
            </div>
            <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0 opacity-0 text-lg" v-html="componentData.subheader"></h6>
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
interface HeroSmallBlockData {
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
  data: HeroSmallBlockData;
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
  return 'min-h-screen';
});

</script>
