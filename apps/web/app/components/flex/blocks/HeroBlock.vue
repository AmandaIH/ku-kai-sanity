<template>
  <div class="w-full relative overflow-hidden flex flex-col md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-end" :id="'hero-' + (index || 0)" :class="[containerClasses, componentData.size === 'half' && props.index !== 0 ? '!items-center' : '']">
    <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.overlayOpacity || 0) / 100 }"></div>

    <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600']" 
      :classes="['absolute inset-0 flex items-center z-0 w-full h-full object-cover fixed'].join(' ')" :lazy="(index || 0) > 0"></cm-picture>
    
    <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="['w-full h-full absolute inset-0 z-0 h-full w-full object-cover fixed'].join(' ')"></hero-cm-video>

    <!-- Mobile layout (flex column) -->
    <div class="flex flex-col justify-center items-center md:hidden text-white z-10 min-h-screen">
      
      <!-- Header for mobile - centered in middle of screen -->
      <div class="w-full text-center mb-6 px-8" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
        <div class="flex flex-col gap-5">
          <p v-if="componentData.eyebrow" class="!mb-0" v-html="componentData.eyebrow"></p>
          <div v-if="componentData.header">
            <h1 class="h1 text-2xl text-white text-center">
              <span v-html="componentData.header"></span>
            </h1>
          </div>
          <h6 v-if="componentData.subheader" class="!mb-0" v-html="componentData.subheader"></h6>
        </div>
      </div>
    </div>

    <!-- Stats Display - positioned at bottom, will fade in when scrolled to -->
    <div ref="mobileStatsRef" v-if="componentData.stats && componentData.stats.length > 0" class="w-full opacity-0 px-8 pb-8 md:hidden">
      <div class="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center">
        <div 
          v-for="(stat, index) in componentData.stats" 
          :key="index"
          class="flex flex-col items-center w-full sm:w-auto"
          :ref="el => setStatsItemRef(el, index)"
        >
          <div class="text-lg sm:text-lg text-white mb-1">
            {{ stat }}
          </div>
          <div class="text-sm font-medium text-white/80">
         
          </div>
        </div>
      </div>
    </div>

    <div class="hidden md:block md:col-span-4 md:col-start-5 text-white z-10" :class="componentData.size === 'half' && props.index !== 0 ? 'pt-8 sm:pt-15' : 'pt-32'">
      <div ref="parallaxHeaderRef" class="text-center mb-6" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
        <div class="flex flex-col gap-5">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="!mb-0" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" v-if="componentData.header">
            <h1 class="h1 text-2xl text-white text-center">
              <span v-html="componentData.header"></span>
            </h1>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" class="!mb-0" v-html="componentData.subheader"></h6>
        </div>
      </div>
    </div>

    <!-- Stats - Left side (columns 2-6) - Second row -->
    <div class="hidden md:block md:col-span-5 md:col-start-1 md:row-start-2 text-white z-10 p-4 pl-8">
      <!-- Stats Display -->
      <div ref="statsRef" v-if="componentData.stats && componentData.stats.length > 0" class="opacity-0">
        <div class="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div 
            v-for="(stat, index) in componentData.stats" 
            :key="index"
            class="flex flex-col items-start w-full"
            :ref="el => setStatsItemRef(el, index)"
          >
            <div class="text-lg sm:text-lg text-white mb-1">
              {{ stat }}
            </div>
            <div class="text-sm font-medium text-white/80">
              <!-- Add your label here if needed -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Spacer (column 7) - Second row -->
    <div class="hidden md:block md:col-span-1 md:row-start-2"></div>

    <!-- Content - Right side (columns 8-12) - Second row -->
    <div class="hidden md:block md:col-span-5 lg:col-span-6 md:row-start-2 text-white z-10">
      <div ref="textRef" v-if="componentData.bodyText" class="opacity-0">
        <PortableText :value="componentData.bodyText" />
      </div>
      <Buttons v-if="componentData.ctas && componentData.ctas.length > 0" :data="componentData.ctas" class="mt-6"></Buttons>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, reactive } from 'vue';
import { PortableText } from '@portabletext/vue';
import { useGsapAnimations } from '../../../composables/useGsapAnimations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Define the component data interface
interface HeroBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  bodyText?: any[];
  backgroundType?: 'image' | 'video';
  backgroundImage?: any;
  backgroundVideo?: any;
  overlayOpacity?: number;
  size?: 'full' | 'half';
  ctas?: any[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
  stats?: string[];
}

const props = defineProps<{
  data: HeroBlockData;
  index?: number;
}>();

// Refs for GSAP animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const parallaxHeaderRef = ref<HTMLElement | null>(null);
const statsRef = ref<HTMLElement | null>(null);
const mobileStatsRef = ref<HTMLElement | null>(null);
const statsItemRefs = ref<HTMLElement[]>([]);
const textRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);
const statsScrollTriggerInstance = ref<any>(null);
const parallaxScrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const componentData = computed(() => props.data);

// Function to set stats item refs
const setStatsItemRef = (el: any, index: number) => {
  if (el && el.$el) {
    statsItemRefs.value[index] = el.$el;
  } else if (el) {
    statsItemRefs.value[index] = el;
  }
};

// Setup all animations
const setupAnimations = () => {
  // Only animate text content, not header elements
  const elements = [
    textRef.value
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

// Setup stats animation with scroll-triggered fade-in/out
const setupStatsAnimation = () => {
  // Setup desktop stats animation
  if (statsRef.value) {
    try {
      statsScrollTriggerInstance.value = ScrollTrigger.create({
        trigger: statsRef.value,
        start: "top bottom-=200px",
        end: "bottom top+=200px",
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true,
        onEnter: () => {
          gsap.to(statsRef.value, { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        },
        onLeave: () => {
          gsap.to(statsRef.value, { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        },
        onEnterBack: () => {
          gsap.to(statsRef.value, { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        },
        onLeaveBack: () => {
          gsap.to(statsRef.value, { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        }
      });
    } catch (error) {
      console.error('Error setting up desktop stats animation:', error);
    }
  }

  // Setup mobile stats animation
  if (mobileStatsRef.value) {
    try {
      ScrollTrigger.create({
        trigger: mobileStatsRef.value,
        start: "top bottom-=200px",
        end: "bottom top+=200px",
        toggleActions: "play reverse play reverse",
        invalidateOnRefresh: true,
        onEnter: () => {
          gsap.to(mobileStatsRef.value, { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        },
        onLeave: () => {
          gsap.to(mobileStatsRef.value, { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        },
        onEnterBack: () => {
          gsap.to(mobileStatsRef.value, { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        },
        onLeaveBack: () => {
          gsap.to(mobileStatsRef.value, { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: "power2.out",
            force3D: true
          });
        }
      });
    } catch (error) {
      console.error('Error setting up mobile stats animation:', error);
    }
  }
};

// Setup parallax animation for header
const setupParallaxAnimation = () => {
  if (parallaxHeaderRef.value) {
    try {
      // Ensure header starts with full opacity and reset any transforms
      gsap.set(parallaxHeaderRef.value, { 
        opacity: 1, 
        y: 0,
        clearProps: "all"
      });
      
      // Create parallax animation - fades out on scroll
      parallaxScrollTriggerInstance.value = gsap.to(parallaxHeaderRef.value, {
        opacity: 0,
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: parallaxHeaderRef.value,
          start: "top center",
          end: "bottom top",
          scrub: 1
        }
      });
    } catch (error) {
      console.error('Error setting up parallax animation:', error);
    }
  }
};

onMounted(() => {
  // Set up header immediately to ensure it's visible - use multiple methods
  if (parallaxHeaderRef.value) {
    gsap.set(parallaxHeaderRef.value, { opacity: 1, y: 0, clearProps: "all" });
    parallaxHeaderRef.value.style.setProperty('opacity', '1', 'important');
    parallaxHeaderRef.value.style.setProperty('transform', 'none', 'important');
  }
  
  // Immediately hide stats to prevent them from being visible during setup
  if (statsRef.value) {
    gsap.set(statsRef.value, { opacity: 0, y: 30 });
  }
  if (mobileStatsRef.value) {
    gsap.set(mobileStatsRef.value, { opacity: 0, y: 30 });
  }
  
  // Set up animations after component is mounted
  setupAnimations();
  
  // Set up animations after a short delay to ensure page is fully loaded
  setTimeout(() => {
    setupStatsAnimation();
    setupParallaxAnimation();
  }, 100);
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instances if they exist
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
  if (statsScrollTriggerInstance.value) {
    statsScrollTriggerInstance.value.kill();
  }
  if (parallaxScrollTriggerInstance.value) {
    parallaxScrollTriggerInstance.value.kill();
  }
});

const heroType = computed(() => {
  return componentData.value.backgroundType || 'image';
});

const containerClasses = computed(() => {
  return componentData.value.size === 'half' ? 'min-h-[50svh]' : 'min-h-svh';
});

</script>



