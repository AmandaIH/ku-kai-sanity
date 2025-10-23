<template>
  <div class="py-8 md:py-16 px-0 mx-0 w-full">
    <div class="grid grid-cols-12 gap-4 lg:gap-x-12 gap-y-8 md:!gap-y-16 px-0 mx-0 w-full">


      <div class="col-span-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
     
        <div class="col-span-full md:col-start-3 md:col-span-8 flex flex-col gap-5 text-center" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
          <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" v-if="componentData.header">
            <h1 v-if="index === 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="text-2.5xl">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" v-html="componentData.subheader"></h6>
        </div>

        
        <div ref="videoRef" class="col-span-full md:col-span-8 px-0 mx-0 w-full">
          <cm-video 
            v-if="componentData.videoSource === 'upload' && componentData.videoFile" 
            :src="componentData.videoFile"
            :poster="componentData.posterImage"
            :autoplay="componentData.videoControls?.autoplay"
            :muted="componentData.videoControls?.muted"
            :loop="componentData.videoControls?.loop"
            :controls="componentData.videoControls?.showControls"
            :classes="videoClasses"
          />
          <div 
            v-else-if="componentData.videoSource === 'embed' && componentData.embedUrl" 
            class="w-full h-auto aspect-video px-0 mx-0"
            v-html="getEmbedHtml(componentData.embedUrl)"
          />
        
          <div 
            v-else-if="componentData.posterImage" 
            class="w-full h-auto aspect-video pl-0 ml-0"
          >
            <cm-picture 
              :image-object="componentData.posterImage" 
              :crops="['default:800', 'md:1200', 'lg:1600']"
              :classes="'w-full h-full object-cover'"
            />
          </div>
        </div>

      
        <div class="flex flex-col gap-6 col-span-full md:col-span-2">
          <div ref="textRef" v-if="componentData.bodyText" class="p-8 md:p-0 text-base">
            <PortableText :value="componentData.bodyText" />
          </div>
          
          <div ref="buttonsRef" v-if="componentData.ctas && componentData.ctas.length > 0">
            <Buttons :data="componentData.ctas" />
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
interface VideoControls {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

interface TextVideoBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  bodyText?: any[];
  videoSource?: 'upload' | 'embed';
  videoFile?: any;
  embedUrl?: string;
  posterImage?: any;
  videoPosition?: 'left' | 'right';
  layoutRatio?: '50-50' | '60-40' | '40-60';
  videoSize?: 'small' | 'medium' | 'large';
  videoControls?: VideoControls;
  ctas?: any[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
  customMargin?: any;
  customPadding?: any;
  container?: 'contained' | 'fullWidth';
}

const props = defineProps<{
  data: TextVideoBlockData;
  index?: number;
  isInSbs?: boolean;
}>();

// Refs for animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const videoRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const buttonsRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Use the data directly without Zod validation
const componentData = computed((): TextVideoBlockData => props.data);
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
  
  // Collect all elements for animation
  const elements = [
    ...headlineElements,
    videoRef.value,
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
 * Container classes computed property
 */
const containerClasses = computed(() => {
  return getContainerClasses('background', 'text', 'padding', 'margin', 'width');
});




/**
 * Video classes based on size
 */
const videoClasses = computed(() => {
  let classes = ['w-full h-auto pl-0 ml-0'];
  
  // Remove max-width constraints so video/image can take full container width
  // switch (componentData.value.videoSize) {
  //   case 'small':
  //     classes.push('max-w-sm');
  //     break;
  //   case 'large':
  //     classes.push('max-w-2xl');
  //     break;
  //   default:
  //     classes.push('max-w-lg');
  //     break;
  // }
  
  return classes.join(' ');
});

/**
 * Convert embed URL to iframe HTML
 */
const getEmbedHtml = (url: string) => {
  if (!url) return '';
  
  // Handle YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
  }
  
  // Handle Vimeo URLs
  if (url.includes('vimeo.com')) {
    const videoId = extractVimeoId(url);
    if (videoId) {
      return `<iframe width="100%" height="100%" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
  }
  
  // For other URLs, try to use as-is
  return `<iframe width="100%" height="100%" src="${url}" frameborder="0" allowfullscreen></iframe>`;
};

const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2] && match[2].length === 11) ? match[2] : null;
};

const extractVimeoId = (url: string) => {
  const regExp = /vimeo\.com\/([0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
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
</script> 