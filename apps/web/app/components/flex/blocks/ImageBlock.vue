<template>
  <div :class="containerClasses">
    <div class="w-full flex flex-col items-center mb-16" ref="imageRef">
      <!-- Regular image -->
      <cm-picture 
        v-if="componentData.image && !isSvgImage" 
        :image-object="componentData.image" 
        :crops="['default:800', 'md:1200', 'lg:1600']" 
        :classes="imageClasses"
        ref="pictureRef"
      />
      
      <!-- Inline SVG -->
      <div 
        v-if="componentData.image && isSvgImage && svgContent" 
        ref="svgContainerRef"
        v-html="svgContent"
        class="w-full flex justify-center items-center [&>svg]:mx-auto [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:block"
      ></div>
      
      <p v-if="componentData.imageCaption" class="text-sm text-gray-600 mt-4 text-center" v-html="componentData.imageCaption"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
// @ts-ignore - Auto-imported composables
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';
// @ts-ignore - Auto-imported composables
import { useSanityImage } from '~/composables/useSanityImage';

// Dynamic imports for GSAP (client-side only)
let gsap: any = null;
let ScrollTrigger: any = null;

if (typeof window !== 'undefined') {
  // @ts-ignore - GSAP types may not be available
  import('gsap').then((gsapModule) => {
    gsap = gsapModule.default;
    // @ts-ignore - GSAP types may not be available
    return import('gsap/ScrollTrigger');
  }).then((scrollTriggerModule: any) => {
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    if (gsap) {
      gsap.registerPlugin(ScrollTrigger);
    }
  });
}

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
const pictureRef = ref<any>(null);
const svgContainerRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<any>(null);
const svgAnimationTrigger = ref<any>(null);

// SVG state
const isSvgImage = ref(false);
const svgContent = ref<string>('');

// Initialize Sanity image composable
const { getImageUrl } = useSanityImage();

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

// Load and prepare SVG for animation
const loadSvg = async () => {
  if (!componentData.value.image?.asset?._ref) return;
  
  try {
    // Check if it's an SVG by checking the asset reference
    const assetRef = componentData.value.image.asset._ref || '';
    const isSvg = assetRef.toLowerCase().includes('svg');
    
    if (!isSvg) {
      isSvgImage.value = false;
      return;
    }
    
    isSvgImage.value = true;
    
    // For SVG files, get the URL - don't specify format to preserve SVG
    // Get the base URL from Sanity image builder
    // @ts-ignore - Auto-imported Nuxt composable
    const config = useRuntimeConfig();
    const sanityConfig = config.public?.sanity as {
      projectId: string;
      dataset: string;
    } | undefined;
    
    if (!sanityConfig) {
      console.warn('Sanity config not found');
      isSvgImage.value = false;
      return;
    }
    
    // Use imageUrlBuilder directly to get raw SVG URL
    const imageUrlBuilder = (await import('@sanity/image-url')).default;
    const builder = imageUrlBuilder({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
    });
    
    // Get URL without format conversion (SVG should stay SVG)
    const sanityUrl = builder.image(componentData.value.image as any).url();
    
    if (!sanityUrl) {
      console.warn('Could not generate SVG URL');
      isSvgImage.value = false;
      return;
    }
    
    // Use local CDN proxy (same as useSanityImage does)
    let imageUrl: string;
    try {
      const url = new URL(sanityUrl);
      imageUrl = `/cdn${url.pathname}${url.search}`;
    } catch (error) {
      // Fallback to original URL if parsing fails
      imageUrl = sanityUrl;
    }
    
    // Fetch the SVG content
    const response = await fetch(imageUrl);
    
    // Check if response is OK
    if (!response.ok) {
      console.warn('Failed to fetch SVG:', response.statusText);
      isSvgImage.value = false;
      return;
    }
    
    const svgText = await response.text();
    
    // Validate that it's actually SVG content
    if (!svgText.trim().startsWith('<') || !svgText.includes('<svg')) {
      console.warn('Response is not valid SVG content');
      isSvgImage.value = false;
      return;
    }
    
    // Parse the SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    // Check for parsing errors
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      console.warn('SVG parsing error:', parserError.textContent);
      isSvgImage.value = false;
      return;
    }
    
    // Serialize back to string (keep SVG as-is, no text splitting)
    const serializer = new XMLSerializer();
    svgContent.value = serializer.serializeToString(svgDoc.documentElement);
    
    // Wait for SVG to render, then setup parallax
    await nextTick();
    await setupParallax();
  } catch (error) {
    console.error('Error loading SVG:', error);
    isSvgImage.value = false;
  }
};

// Setup parallax effect for SVG
const setupParallax = async () => {
  if (!svgContainerRef.value) return;
  
  await nextTick();
  
  try {
    // Parallax effect for SVG container
    const parallaxTrigger = ScrollTrigger.create({
      trigger: imageRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self: any) => {
        const progress = self.progress;
        const yOffset = (progress - 0.5) * 100; // Move up/down based on scroll
        gsap.set(svgContainerRef.value, {
          y: yOffset
        });
      }
    });
    
    svgAnimationTrigger.value = parallaxTrigger;
  } catch (error) {
    console.error('Error setting up parallax:', error);
  }
};

// Setup parallax for regular images too
const setupImageParallax = () => {
  if (!imageRef.value || isSvgImage.value) return;
  
  try {
    const imageElement = imageRef.value.querySelector('img') || pictureRef.value?.$el?.querySelector('img');
    if (!imageElement) return;
    
    const parallaxTrigger = ScrollTrigger.create({
      trigger: imageRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self: any) => {
        const progress = self.progress;
        const yOffset = (progress - 0.5) * 100;
        gsap.set(imageElement, {
          y: yOffset
        });
      }
    });
    
    scrollTriggerInstance.value = parallaxTrigger;
  } catch (error) {
    console.error('Error setting up image parallax:', error);
  }
};



/**
 * Image classes based on style
 */
const imageClasses = computed(() => {
  let classes = ['h-auto', 'object-cover'];
  
  // For regular images, use full width
  if (!isSvgImage.value) {
    classes.push('w-full');
  }
  
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

onMounted(async () => {
  // Load SVG first to check if it's an SVG
  await loadSvg();
  // Set up parallax for all images (SVG or regular)
  if (isSvgImage.value) {
    // Parallax is set up in setupParallax() which is called from loadSvg()
  } else {
    setupImageParallax();
  }
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instances if they exist
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
  if (svgAnimationTrigger.value) {
    svgAnimationTrigger.value.kill();
  }
});
</script>
