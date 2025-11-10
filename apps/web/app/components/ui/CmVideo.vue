<template>
  <div class="relative">
    <video ref="video" :class="props.classes" :key="videoSource || undefined" :poster="posterSource || undefined" :autoplay="props.autoplay" :muted="props.muted" :loop="props.loop" :controls="props.controls" playsinline>
      <slot>
        <source v-if="videoSource" :src="videoSource" type="video/mp4">
      </slot>
    </video>
    <div class="absolute z-10 bottom-3 right-3">
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
  </div>
</template>

<script setup lang="ts">
import {useSanityFile} from "~/composables/useSanityFile";
import {useSanityImage} from "~/composables/useSanityImage";

const props = defineProps({
  src: {
    type: [String, Object],
    default: null
  },
  poster: {
    type: [String, Object],
    default: null
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  muted: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean,
    default: true
  },
  controls: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: null
  },
  classes: {
    type: String,
    default: ''
  },
});

// Initialize composables
const { getFileUrl } = useSanityFile();
const { getImageUrl } = useSanityImage();

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
    return getFileUrl(props.src as { _type: 'file'; asset: { _ref: string; _type: 'reference' } });
  }
  
  return null;
});

const posterSource = computed(() => {
  if (!props.poster) {
    return null;
  }
  
  // If poster is already a URL string, return it directly
  if (typeof props.poster === 'string') {
    return props.poster;
  }
  
  // If poster is a Sanity image object, convert it to URL using the composable
  if (props.poster && typeof props.poster === 'object' && props.poster._type === 'image' && props.poster.asset) {
    return getImageUrl(props.poster as { _type: 'image'; asset: { _ref: string; _type: 'reference' }; hotspot?: any; crop?: any; alt?: string; caption?: string }, { width: 1920 });
  }
  
  return null;
});

const videoIsPaused = ref(false);
const video = ref();
const pauseVideo = () => {
  video.value.pause();
  videoIsPaused.value = true;
}

const playVideo = () => {
  video.value.play();
  videoIsPaused.value = false;
}
</script>
