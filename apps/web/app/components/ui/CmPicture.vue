<template>
  <picture v-if="responsiveSources && Array.isArray(responsiveSources) && responsiveSources.length > 0 && defaultSource" :key="defaultSource.src">
    <source v-for="(source, index) in responsiveSources.reverse()" :key="index" :media="source.media" :srcset="source.src" />
    <img :src="defaultSource.src" :width="defaultSource.width" :height="defaultSource.height" :class="classes" :loading="loading" :alt="alt" :style="focalPoint ? 'object-position:'+focalPoint+';' : ''" />
  </picture>
  <picture v-else-if="responsiveSources && !Array.isArray(responsiveSources)" :key="responsiveSources.src">
    <source :media="responsiveSources.media" :srcset="responsiveSources.src" />
    <img :src="responsiveSources.src" :class="classes" :loading="loading" :alt="alt" :style="focalPoint ? 'object-position:'+focalPoint+';' : ''" />
  </picture>
  <img v-else-if="defaultSource" :src="defaultSource.src" :width="defaultSource.width" :height="defaultSource.height" :class="classes" :loading="loading" :alt="alt" :style="focalPoint ? 'object-position:'+focalPoint+';' : ''" />
  <div v-else class="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500">
    <span>No image available</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSanityImage } from '~/composables/useSanityImage';

// Default screens configuration
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

/**
 * Type for the screens configuration from Tailwind
 */
type ScreensConfig = Record<string, string>;

/**
 * Interface for Sanity image object structure
 * @interface SanityImageObject
 */
interface SanityImageObject {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
  caption?: string;
}

/**
 * Interface for image source data used in the picture element
 * @interface ImageSourceData
 * @property {string} src - Source URL of the image
 * @property {number} [width] - Width of the image
 * @property {number} [height] - Height of the image
 * @property {string} [media] - Media query for responsive images
 */
interface ImageSourceData {
  src: string;
  width?: number;
  height?: number;
  media?: string;
}

/**
 * Type for the loading attribute of img elements
 */
type LoadingAttribute = 'lazy' | 'eager';

/**
 * Component props definition
 */
const props = defineProps({
  /**
   * Whether to lazy load the image
   * @default true
   */
  lazy: {
    type: Boolean,
    default: true
  },
  /**
   * The Sanity image object containing all image data
   * @required
   */
  imageObject: {
    type: Object as () => SanityImageObject,
    required: true,
    default: null
  },
  /**
   * Array of crop specifications in format 'breakpoint:width'
   * @example ['sm:400', 'md:800', 'lg:1200']
   * @default []
   */
  crops: {
    type: Array as () => string[],
    default: () => []
  },
  /**
   * CSS classes to apply to the image
   * @default ""
   */
  classes: {
    type: String,
    default: ""
  },
  /**
   * Focal point for the image in format 'x% y%'
   * @example "50% 50%"
   * @default ""
   */
  focalPoint: {
    type: String,
    default: ""
  }
});

/**
 * Computed property for the loading attribute
 * @returns {LoadingAttribute} 'lazy' or 'eager' based on props
 */
const loading = computed((): LoadingAttribute => {
  return props.lazy ? 'lazy' : 'eager';
});

/**
 * Computed property for the alt text
 * @returns {string} Alt text from the image object or empty string
 */
const alt = computed((): string => {
  return props.imageObject?.alt || '';
});

/**
 * Gets the width value for a specific breakpoint from Tailwind config
 * @param {string} breakpoint - The breakpoint name (e.g., 'sm', 'md', 'lg')
 * @returns {string} The width value for the breakpoint
 */
const getBreakpointWidth = (breakpoint: string): string => {
  const screensWithDefault: ScreensConfig = { ...screens, default: '0px' };
  return screensWithDefault[breakpoint] || '0px';
}

// Initialize the Sanity image composable
const { getImageUrl } = useSanityImage();

/**
 * Computes valid crops based on the crops prop
 * @returns {string[]} Array of valid crop specifications
 */
const validCrops = computed((): string[] => {
  return props.crops || [];
});

/**
 * Computes responsive sources for the picture element
 * @returns {ImageSourceData | ImageSourceData[]} Single source or array of sources
 */
const responsiveSources = computed((): ImageSourceData | ImageSourceData[] => {
  if (!props.imageObject || !props.imageObject.asset || validCrops.value.length === 0) {
    return getImgDataFromCrop('default:800');
  }

  return validCrops.value.map(s => {
    return getImgDataFromCrop(s);
  });
});

/**
 * Computes the default source for the image
 * @returns {ImageSourceData} Default image source data
 */
const defaultSource = computed((): ImageSourceData => {
  if (!props.imageObject || !props.imageObject.asset) {
    return { src: '', width: 800, height: 450 };
  }

  const defaultCrop = validCrops.value.find(s => s.includes('default'));
  let cropToUse = 'default:800';
  
  if (defaultCrop) {
    cropToUse = defaultCrop;
  } else if (validCrops.value.length > 0) {
    cropToUse = validCrops.value[0] || 'default:800';
  }

  return getImgDataFromCrop(cropToUse);
});

/**
 * Parses a crop specification string into its components
 * @param {string} cropSpec - Crop specification string
 * @returns {{ breakpoint: string, width: string }} Parsed breakpoint and width
 */
const parseCropSpec = (cropSpec: string): { breakpoint: string, width: string } => {
  if (!cropSpec) {
    return { breakpoint: 'default', width: '800' };
  }
  
  const parts = cropSpec.split(':');
  
  if (parts.length === 1) {
    // If only one part, assume it's the width with default breakpoint
    return { 
      breakpoint: 'default', 
      width: parts[0] || '800' 
    };
  }
  
  return { 
    breakpoint: parts[0] || 'default', 
    width: parts[1] || '800' 
  };
};

/**
 * Extracts image data from a crop specification
 * @param {string} cropSpec - Crop specification in format 'breakpoint:width'
 * @returns {ImageSourceData} Image source data
 */
const getImgDataFromCrop = (cropSpec: string): ImageSourceData => {
  if (!cropSpec || !props.imageObject || !props.imageObject.asset) {
    return { src: '' };
  }
  
  // Parse the crop specification into breakpoint and width
  const { breakpoint, width } = parseCropSpec(cropSpec);
  
  // Generate URL using the composable
  const url = getImageUrl(props.imageObject, { width: parseInt(width) });
  
  return {
    src: url,
    width: parseInt(width),
    height: Math.round((parseInt(width) * 9) / 16), // Default 16:9 aspect ratio
    media: `(min-width: ${getBreakpointWidth(breakpoint)})`
  }
}
</script>
