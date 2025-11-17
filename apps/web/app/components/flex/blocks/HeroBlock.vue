<template>
  <div class="w-full relative overflow-hidden" :id="'hero-' + (index || 0)" :class="[containerClasses, componentData.size === 'half' && props.index !== 0 ? '!items-center' : '']">
    <div ref="backgroundImageRef" v-if="heroType === 'image' && componentData.backgroundImage" class="absolute inset-0 z-0 overflow-hidden">
      <cm-picture :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600', '2xl:2560']" 
        :classes="'w-full h-full object-cover'" :lazy="(index || 0) > 0"></cm-picture>
    </div>
    
    <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="['w-full h-full absolute inset-0 z-0 object-cover fixed', 'md:object-cover', 'object-center', 'md:object-center', 'transform-gpu', 'will-change-transform', 'mobile-video-optimized'].join(' ')"></hero-cm-video>
    
    <!-- Overlay only on background media -->
    <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.opacity || 0) / 100 }"></div>

    <!-- Single responsive layout -->
    <div class="flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:gap-8 min-h-screen w-full px-8 sm:px-16 pt-16 pb-16">
      <!-- Text box - same layout for mobile and desktop -->
      <div v-if="hasContent" ref="textBoxRef" class="sm:col-span-7 md:col-span-5 lg:col-span-4 xl:col-span-4 sm:col-start-1 md:col-start-1 lg:col-start-1 xl:col-start-1 text-white z-20 flex items-end justify-center sm:justify-start mt-auto sm:mt-0">
        <div class="w-full bg-white/10 backdrop-blur-md rounded-2xl p-8">
          <div class="flex flex-col">
            <!-- Eyebrow -->
            <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow text-sm uppercase text-white/80 md:text-white tracking-wider" v-html="componentData.eyebrow"></p>
            
            <!-- Header -->
            <div ref="headerRef" v-if="componentData.header" class="mb-32">
              <h1 class="font-bold text-white leading-none" style="letter-spacing: -0.02em; font-size: clamp(3.25rem, 4vw, 5rem);">
                <span v-html="componentData.header"></span>
              </h1>
            </div>
            
            <!-- Body Text and Buttons Container -->
            <div class="flex flex-col">
              <!-- Body Text -->
              <div ref="paragraphRef" v-if="componentData.paragraphText" class="text-white text-base md:text-md leading-normal mb-0" style="letter-spacing: -0.01em;" v-html="componentData.paragraphText">
              </div>
              
              <!-- Buttons -->
              <div ref="buttonsRef" v-if="componentData.ctas && componentData.ctas.length > 0" class="mt-8">
                <Buttons :data="componentData.ctas" class="!justify-start !mt-0"></Buttons>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Spacer columns 6-12 (empty) - hidden on mobile -->
      <div class="hidden md:block md:col-span-7"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { PortableText } from '@portabletext/vue';
import { useGsapAnimations } from '../../../composables/useGsapAnimations';
import { gsap } from 'gsap';
import Buttons from '../../ui/Buttons.vue';

// Define the component data interface
interface HeroBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  paragraphText?: any[];
  backgroundType?: 'image' | 'video';
  backgroundImage?: any;
  backgroundVideo?: any;
  opacity?: number;
  size?: 'full' | 'half';
  ctas?: any[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
}

const props = defineProps<{
  data: HeroBlockData;
  index?: number;
}>();

// Refs for GSAP animations
const textBoxRef = ref<HTMLElement | null>(null);
const eyebrowRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const paragraphRef = ref<HTMLElement | null>(null);
const buttonsRef = ref<HTMLElement | null>(null);
const backgroundImageRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);
const backgroundImageAnimation = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

const componentData = computed(() => props.data);

const heroType = computed(() => {
  return componentData.value.backgroundType || 'image';
});

const containerClasses = computed(() => {
  return componentData.value.size === 'half' ? 'min-h-[50svh]' : 'min-h-svh';
});

// Check if there's any content to display
const hasContent = computed(() => {
  return !!(
    componentData.value.eyebrow ||
    componentData.value.header ||
    componentData.value.subheader ||
    componentData.value.paragraphText ||
    (componentData.value.ctas && componentData.value.ctas.length > 0)
  );
});

// Setup background image animation (only for image backgrounds)
const setupBackgroundImageAnimation = async () => {
  if (!backgroundImageRef.value || heroType.value !== 'image') return;

  // Wait for DOM to be ready
  await nextTick();

  try {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP is not available, skipping background image animation');
      return;
    }

    // Find the img element inside the container
    const imgElement = backgroundImageRef.value.querySelector('img');
    if (!imgElement) {
      console.warn('No img element found in background image container');
      return;
    }

    console.log('Setting up background image animation on:', imgElement);

    // Set initial scale to ensure image starts at normal size
    gsap.set(imgElement, { scale: 1.0 });

    // Create infinite scale animation for background image (subtle zoom effect)
    backgroundImageAnimation.value = gsap.to(imgElement, {
      scale: 1.1, // Reduced from 1.3 to 1.1 for more subtle effect
      duration: 30, // 30 seconds to reach scale 1.1 (half of 60s cycle)
      ease: "none",
      yoyo: true, // Automatically reverse the animation
      repeat: -1 // Infinite repeat
    });

   

  } catch (error) {
  
  }
};

// Setup all animations
const setupAnimations = () => {
  if (!textBoxRef.value) return;

  try {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
    
      return;
    }

    // Collect all text elements inside the text box
    const textElements = [
      eyebrowRef.value,
      headerRef.value,
      paragraphRef.value,
      buttonsRef.value
    ].filter(Boolean) as HTMLElement[];

    // Set initial state for text box (slide up from bottom, but keep opacity visible)
    gsap.set(textBoxRef.value, { 
      opacity: 1, // Keep opacity at 1 so the box is always visible
      y: 0, // Start at correct position
      scale: 1 // Start at correct scale
    });

    // Set initial state for text elements (hidden)
    textElements.forEach(element => {
      gsap.set(element, { opacity: 0, y: 30 });
    });

    // Create main timeline
    const tl = gsap.timeline();

    // First: Animate text box sliding up from bottom (no opacity change)
    tl.to(textBoxRef.value, {
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out"
    });

    // Simultaneously: Stagger animate the text elements inside while box is sliding
    if (textElements.length > 0) {
      tl.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15
      }, "-=0.8"); // Start 0.8 seconds before the text box animation ends (overlap more)
    }

    // Add scroll trigger for the animation
    scrollTriggerInstance.value = scrollTriggerAnimation(textBoxRef.value, tl, {
      trigger: textBoxRef.value,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none none"
    });

  } catch (error) {
    console.error('Error setting up hero animations:', error);
  }
};

onMounted(async () => {
  // Set up animations after component is mounted
  setupAnimations();
  await setupBackgroundImageAnimation();
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instance if it exists
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
  // Kill the background image animation if it exists
  if (backgroundImageAnimation.value) {
    backgroundImageAnimation.value.kill();
  }
});
</script>



