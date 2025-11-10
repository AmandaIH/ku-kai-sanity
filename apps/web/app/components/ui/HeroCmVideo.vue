<template>
  <video 
    ref="video" 
    :class="props.classes" 
    :key="videoSource || undefined" 
    autoplay 
    muted 
    loop 
    playsinline
    preload="metadata"
    :poster="videoPoster || undefined"
    webkit-playsinline
    x-webkit-airplay="allow"
    disablepictureinpicture
  >
    <slot>
      <source v-if="videoSource" :src="videoSource" type="video/mp4; codecs=avc1.42E01E">
      <source v-if="mobileVideoSource" :src="mobileVideoSource" type="video/mp4; codecs=avc1.42E01E" media="(max-width: 768px)">
    </slot>
  </video>

  <div v-if="!props.hideControls" class="absolute z-20 bottom-3 right-3 text-white" :class="props.playBtnClasses">
    <button aria-label="Pause video" class="p-2" @click="pauseVideo" v-show="!videoIsPaused">
      <svg class="w-4 h-4" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="9" y1="4.37114e-08" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="1" y1="4.37114e-08" x2="0.999999" y2="12" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>

    <button aria-label="Play video" class="p-2" @click="playVideo" v-show="videoIsPaused">
      <svg class="w-4 h-4" width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 7L0.25 13.0622L0.250001 0.937822L10 7Z" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import {useSanityFile} from "~/composables/useSanityFile";

const props = defineProps({
  src: {
    type: [String, Object],
    default: null
  },
  index: {
    type: Number,
    default: null
  },
  classes: {
    type: String,
    default: ''
  },
  playBtnClasses: {
    type: String,
  },
  hideControls: {
    type: Boolean,
    default: false
  }
});

// Initialize Sanity file composable
const { getFileUrl } = useSanityFile();

const videoSource = computed(() => {
  if (!props.src) {
    return null;
  }
  
  // If src is already a URL string, return it directly
  if (typeof props.src === 'string') {
    return props.src;
  }
  
  // If src is a Sanity file object, convert it to URL using the composable
  if (props.src && typeof props.src === 'object' && props.src._type === 'file' && props.src.asset) {
    const proxyUrl = getFileUrl(props.src as { _type: 'file'; asset: { _ref: string; _type: 'reference' } });
    
    // Make it absolute for Safari compatibility and to avoid hydration mismatch
    if (proxyUrl) {
      if (proxyUrl.startsWith('/cdn')) {
        // Relative proxy URL - make it absolute
        const config = useRuntimeConfig();
        const origin = process.client 
          ? window.location.origin 
          : (config.public.siteUrl || 'http://localhost:3000');
        return `${origin}${proxyUrl}`;
      } else if (proxyUrl.startsWith('http')) {
        // Already absolute (fallback from composable)
        return proxyUrl;
      }
    }
    
    return proxyUrl;
  }
  
  return null;
});

// Mobile-optimized video source (same as desktop for now)
const mobileVideoSource = computed(() => {
  return videoSource.value;
});

// Video poster for better loading experience
const videoPoster = computed(() => {
  // For now, we'll return null for poster since we don't have a way to generate
  // video thumbnails from Sanity file references without additional API calls
  return null;
});

const videoIsPaused = ref(false); // Start as playing for better Safari compatibility
const video = ref();

// Mobile detection
const isMobile = ref(false);

onMounted(() => {
  // Detect mobile device
  isMobile.value = window.innerWidth <= 768;
  
  // Safari-specific optimizations
  if (video.value) {
    // Force hardware acceleration for Safari
    video.value.style.transform = 'translateZ(0)';
    video.value.style.webkitTransform = 'translateZ(0)';
    video.value.style.backfaceVisibility = 'hidden';
    video.value.style.webkitBackfaceVisibility = 'hidden';
    
    // Safari video optimizations
    video.value.style.objectFit = 'cover';
    video.value.style.width = '100%';
    video.value.style.height = '100%';
    
    // Additional Safari video fixes
    video.value.setAttribute('webkit-playsinline', 'true');
    video.value.setAttribute('playsinline', 'true');
    video.value.setAttribute('x-webkit-airplay', 'allow');
    
    // Force Safari to load the video
    video.value.load();
  }
  
  // Add mobile-specific optimizations
  if (isMobile.value && video.value) {
    // Set video quality for mobile
    video.value.style.imageRendering = 'crisp-edges';
    video.value.style.webkitImageRendering = 'crisp-edges';
  }
  
  // Add video event listeners to track play/pause state
  if (video.value) {
    video.value.addEventListener('play', () => {
      videoIsPaused.value = false;
    });
    video.value.addEventListener('pause', () => {
      videoIsPaused.value = true;
    });
    video.value.addEventListener('ended', () => {
      videoIsPaused.value = true;
    });
    video.value.addEventListener('error', (e: Event) => {
      console.error('Video error:', e);
    });
    video.value.addEventListener('loadeddata', () => {
      // Force Safari to play the video
      video.value.play().catch((e: any) => console.log('Video play failed:', e));
    });
    video.value.addEventListener('canplaythrough', () => {
      // Force Safari to play the video
      video.value.play().catch((e: any) => console.log('Video play failed:', e));
    });
  }
});

const pauseVideo = () => {
  video.value.pause();
  videoIsPaused.value = true;
}

const playVideo = () => {
  video.value.play();
  videoIsPaused.value = false;
}
</script>