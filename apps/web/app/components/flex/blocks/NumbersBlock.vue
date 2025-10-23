<template>
  <div class="section-container py-8 md:py-16" :class="containerClasses">
    <div class="default-grid" :class="isInSbs ? 'half-grid' : ''">
      <div class="col-span-full" :class="isInSbs ? '' : ''">
        <div class="flex flex-col gap-5" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow opacity-0" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="opacity-0" v-html="componentData.subheader"></h6>
        </div>
        
     
        <div ref="numbersRef" v-if="componentData.numbers && componentData.numbers.length > 0" class="md:col-span-12" >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
            <div 
              v-for="(numberItem, index) in componentData.numbers" 
              :key="index"
              class="flex flex-col justify-between items-start text-left border-b sm:border-b-0 sm:border-l md:border-l border-black h-28 min-h-64 pl-0 sm:pl-2 md:pl-2 pb-2 sm:pb-0 md:pb-0 mb-0 mx-16"
              :class="componentData.numbers?.length === 3 ? 'md:col-span-4' : 'md:col-span-3'"
              :ref="el => setNumberItemRef(el, index)"
            >
              <div class="text-sm md:text-base text-black">
                {{ numberItem.header }}
              </div>
              <div class="text-4xl">
                {{ numberItem.number }}
              </div>
            </div>
          </div>
        </div>
        
        <div ref="textRef" class="opacity-0" v-if="componentData.bodyText" :class="componentData.eyebrow || componentData.header || componentData.subheader || (componentData.numbers && componentData.numbers.length > 0) ? 'mt-4' : ''">
          <PortableText :value="componentData.bodyText" />
        </div>
        <div ref="buttonsRef" class="opacity-0" v-if="componentData.ctas && componentData.ctas.length > 0">
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
import { gsap } from 'gsap';

// Define the component data interface
interface NumbersBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  bodyText?: any[];
  numbers?: Array<{
    header: string;
    number: string;
  }>;
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
  data: NumbersBlockData;
  index?: number;
  isInSbs?: boolean;
}>();

// Refs for animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const numbersRef = ref<HTMLElement | null>(null);
const numberItemRefs = ref<HTMLElement[]>([]);
const textRef = ref<HTMLElement | null>(null);
const buttonsRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);
const numbersScrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Use the data directly without Zod validation
const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);

// Initialize the flex settings composable
const { getContainerClasses } = useCheckmateFlexSettings(componentSettings);

// Function to set number item refs
const setNumberItemRef = (el: any, index: number) => {
  if (el && el.$el) {
    numberItemRefs.value[index] = el.$el;
  } else if (el) {
    numberItemRefs.value[index] = el;
  }
};

// Setup all animations
const setupAnimations = () => {
  // Animate text content
  const elements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value,
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

// Setup numbers animation with scroll-triggered fade-in/out
const setupNumbersAnimation = () => {
  if (numbersRef.value && numberItemRefs.value.length > 0) {
    try {
      // Ensure numbers start hidden with inline styles (stronger than CSS classes)
      gsap.set(numbersRef.value, { 
        opacity: 0, 
        y: 30,
        clearProps: "all"
      });
      
      // Create fade-in animation for the numbers container
      const numbersTimeline = gsap.timeline();
      numbersTimeline.to(numbersRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Add scroll trigger for numbers animation with bidirectional toggle
      // Use a more reliable trigger that works on all screen sizes
      numbersScrollTriggerInstance.value = scrollTriggerAnimation(numbersRef.value, numbersTimeline, {
        trigger: numbersRef.value,
        start: "top bottom-=100px", // Start when numbers are 100px from bottom of viewport
        end: "bottom top+=100px", // End when numbers are 100px past top of viewport
        toggleActions: "play reverse play reverse" // Play on enter, reverse on leave (both directions)
      });
    } catch (error) {
      console.error('Error setting up numbers animation:', error);
    }
  }
};

onMounted(() => {
  // Set up animations after component is mounted
  setupAnimations();
  
  // Set up numbers animation after a delay to ensure page is fully loaded
  setTimeout(() => {
    setupNumbersAnimation();
  }, 500);
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instances if they exist
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
  if (numbersScrollTriggerInstance.value) {
    numbersScrollTriggerInstance.value.kill();
  }
});

const containerClasses = computed(() => {
  return getContainerClasses();
});
</script>
