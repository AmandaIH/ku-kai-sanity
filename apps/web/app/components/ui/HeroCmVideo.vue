<template>
  <video 
    ref="video" 
    :class="props.classes" 
    :key="videoSource || undefined" 
    autoplay 
    muted 
    loop 
    playsinline
    preload="auto"
    :poster="videoPoster || undefined"
    webkit-playsinline
    x-webkit-airplay="allow"
    disablepictureinpicture
  >
    <slot>
      <source v-if="absoluteVideoSource" :src="absoluteVideoSource" :type="videoMimeType">
      <source v-if="absoluteMobileVideoSource && absoluteMobileVideoSource !== absoluteVideoSource" :src="absoluteMobileVideoSource" :type="videoMimeType" media="(max-width: 768px)">
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
import {useSanityVideo} from "~/composables/useSanityVideo";

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

// Initialize Sanity video composable
const { getVideoUrl } = useSanityVideo();

// Helper function to get MIME type from file extension
const getMimeType = (url: string | null): string => {
  if (!url) return 'video/mp4';
  const ext = url.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'm4v': 'video/x-m4v',
  };
  return mimeTypes[ext || ''] || 'video/mp4';
};

// Helper function to convert relative URL to absolute
const getAbsoluteUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (process.client) {
    return new URL(url, window.location.origin).toString();
  }
  return url;
};

// Debug: Log immediately when component is created
if (process.client) {
  console.log('🔴 HeroCmVideo component created with props.src:', props.src);
}

const videoSource = computed(() => {
  if (!props.src) {
    return null;
  }
  
  // If src is already a URL string, return it directly
  if (typeof props.src === 'string') {
    return props.src;
  }
  
  // If src is a Sanity file object, convert it to URL using the video composable
  if (props.src && typeof props.src === 'object' && props.src._type === 'file') {
    console.log('🔴 HeroCmVideo: Processing Sanity file object:', props.src);
    const url = getVideoUrl(props.src as { _type: 'file'; asset: { _ref: string; _type: 'reference' } });
    console.log('🔴 HeroCmVideo: Generated URL:', url);
    if (!url) {
      console.error('🔴 HeroCmVideo: Failed to generate video URL from:', props.src);
    }
    return url;
  }
  
  console.warn('🔴 HeroCmVideo: props.src is not a recognized format:', props.src);
  
  return null;
});

// Get absolute URL for Safari compatibility
const absoluteVideoSource = computed(() => {
  return getAbsoluteUrl(videoSource.value);
});

// Get MIME type for the video source
const videoMimeType = computed(() => {
  return getMimeType(videoSource.value);
});

// Mobile-optimized video source (same as desktop for now)
const mobileVideoSource = computed(() => {
  return videoSource.value;
});

const absoluteMobileVideoSource = computed(() => {
  return getAbsoluteUrl(mobileVideoSource.value);
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
  // Debug: Log video source
  console.log('🔴 HeroCmVideo MOUNTED');
  console.log('🔴 videoSource.value:', videoSource.value);
  console.log('🔴 props.src:', props.src);
  console.log('🔴 video element exists:', !!video.value);
  
  // Detect mobile device
  isMobile.value = window.innerWidth <= 768;
  
  // Safari-specific optimizations
  if (video.value) {
    console.log('🔴 Setting up video element');
    console.log('🔴 Video currentSrc before setup:', video.value.currentSrc);
    console.log('🔴 Video sources:', Array.from(video.value.querySelectorAll('source') as NodeListOf<HTMLSourceElement>).map(s => s.src));
    
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
    
    // Safari needs the video element to not have a src attribute when using source elements
    // Remove any src attribute that might have been set
    if (video.value.hasAttribute('src')) {
      video.value.removeAttribute('src');
    }
    
    // Force video to load - Safari needs source elements to be in DOM first
    nextTick(() => {
      setTimeout(() => {
        console.log('🔴 Attempting to load video');
        console.log('🔴 Video readyState before load():', video.value?.readyState);
        console.log('🔴 Video networkState before load():', video.value?.networkState);
        
        // Ensure source elements are properly set up for Safari
        const sourceElements = video.value?.querySelectorAll('source');
        console.log('🔴 Source elements found:', sourceElements?.length);
        sourceElements?.forEach((source: HTMLSourceElement, index: number) => {
          console.log(`🔴 Source ${index}:`, {
            src: source.src,
            type: source.type,
            media: source.media
          });
        });
        
        // Test if the video URL is accessible
        const sourceElement = video.value?.querySelector('source');
        if (sourceElement?.src) {
          fetch(sourceElement.src, { method: 'HEAD' })
            .then(response => {
              console.log('🔴 Video URL fetch test - Status:', response.status);
              console.log('🔴 Video URL fetch test - Headers:', Object.fromEntries(response.headers.entries()));
              const contentType = response.headers.get('content-type');
              console.log('🔴 Video URL Content-Type:', contentType);
              if (!response.ok) {
                console.error('🔴 Video URL is not accessible! Status:', response.status);
              }
            })
            .catch(error => {
              console.error('🔴 Video URL fetch test failed:', error);
            });
        }
        
        // Safari: Call load() to reload the source elements
        // Make sure source elements are in the DOM before calling load()
        if (sourceElements && sourceElements.length > 0) {
          video.value?.load();
          console.log('🔴 Video currentSrc after load():', video.value?.currentSrc);
          console.log('🔴 Video readyState after load():', video.value?.readyState);
          console.log('🔴 Video networkState after load():', video.value?.networkState);
        } else {
          console.error('🔴 No source elements found! Video cannot load.');
        }
      }, 100);
    });
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
      console.error('🔴 VIDEO ERROR:', e);
      console.error('🔴 Video source:', video.value?.src);
      console.error('🔴 Video currentSrc:', video.value?.currentSrc);
      console.error('🔴 Video networkState:', video.value?.networkState);
      console.error('🔴 Video error code:', video.value?.error?.code);
      console.error('🔴 Video error message:', video.value?.error?.message);
      console.error('🔴 Video element:', video.value);
    });
    
    video.value.addEventListener('loadstart', () => {
      console.log('🔴 Video loadstart');
      console.log('🔴 Video src:', video.value?.src);
      console.log('🔴 Video currentSrc:', video.value?.currentSrc);
      console.log('🔴 Video readyState:', video.value?.readyState);
      console.log('🔴 Video networkState:', video.value?.networkState);
    });
    
    video.value.addEventListener('stalled', () => {
      console.warn('🔴 Video stalled');
      console.warn('🔴 Video networkState:', video.value?.networkState);
    });
    
    video.value.addEventListener('suspend', () => {
      console.warn('🔴 Video suspend');
      console.warn('🔴 Video networkState:', video.value?.networkState);
    });
    
    video.value.addEventListener('abort', () => {
      console.error('🔴 Video abort');
      console.error('🔴 Video networkState:', video.value?.networkState);
    });
    
    video.value.addEventListener('progress', () => {
      console.log('🔴 Video progress - buffered:', video.value?.buffered.length ? `${video.value.buffered.start(0)}-${video.value.buffered.end(0)}` : 'none');
    });
    video.value.addEventListener('loadeddata', () => {
      console.log('🔴 Video loadeddata - ready to play');
      // Force Safari to play the video
      video.value.play().catch((e: any) => console.error('🔴 Video play failed:', e));
    });
    video.value.addEventListener('canplay', () => {
      console.log('🔴 Video canplay');
    });
    video.value.addEventListener('canplaythrough', () => {
      console.log('🔴 Video canplaythrough - ready to play');
      // Force Safari to play the video
      video.value.play().catch((e: any) => console.error('🔴 Video play failed:', e));
    });
    video.value.addEventListener('loadedmetadata', () => {
      console.log('🔴 Video loadedmetadata');
      console.log('🔴 Video duration:', video.value?.duration);
      console.log('🔴 Video readyState:', video.value?.readyState);
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